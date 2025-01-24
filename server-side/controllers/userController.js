const userService = require('../services/userService');
const multer = require('multer');
const path = require('path');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const SavingsGoal = require('../models/SavingsGoal');
const passport = require('passport');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await userService.registerUser(username, email, password);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    if (error.code === 'EMAIL_IN_USE') {
      return res.status(400).json({ message: 'Email is already in use' });
    } else if (error.code === 'USERNAME_IN_USE') {
      return res.status(400).json({ message: 'Username is already in use' });
    }
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const { user, token } = await userService.loginUser(email, password);
    res.status(200).json({ message: 'User logged in successfully', user, token });
  } catch (error) {
    res.status(401).json({ message: 'Invalid email or password', error: error.message });
  }
};

const googleOAuth = (req, res) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
};

const googleOAuthCallback = async (req, res) => {
  passport.authenticate('google', { failureRedirect: '/login' }, async (err, user) => {
    if (err || !user) {
      return res.status(500).json({ message: 'Authentication failed', error: err });
    }

    try {
      const newUser = await userService.registerOrUpdateGoogleUser(user);
      const token = userService.generateToken(newUser);
      res.status(200).json({ message: 'User logged in successfully', user: newUser, token });
    } catch (error) {
      res.status(500).json({ message: 'Error processing Google user', error: error.message });
    }
  })(req, res);
};

const updateIncomeAndCurrency = async (req, res) => {
  const { userId, monthlyIncome, preferredCurrency } = req.body;

  if (!userId || !monthlyIncome || !preferredCurrency) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await userService.updateUserIncomeAndCurrency(userId, monthlyIncome, preferredCurrency);
    res.status(200).json({ message: 'User income and currency updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user income and currency', error: error.message });
  }
};

const updateProfile = async (req, res) => {
  const { userId, username, profilePicture } = req.body;

  if (!userId || !username) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await userService.updateUserProfile(userId, username, profilePicture);
    res.status(200).json({ message: 'User profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user profile', error: error.message });
  }
};

const updateProfilePicture = async (req, res) => {
  const { userId } = req.body;
  const profilePicture = req.file ? req.file.path : '';

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const user = await userService.updateUserProfilePicture(userId, profilePicture);
    res.status(200).json({ message: 'User profile picture updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user profile picture', error: error.message });
  }
};

const changePassword = async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  if (!userId || !currentPassword || !newPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await userService.changePassword(userId, currentPassword, newPassword);
    res.status(200).json({ message: 'Password changed successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error changing password', error: error.message });
  }
};

const updateOnboardingStatus = async (req, res) => {
  const { userId, onboardingCompleted } = req.body;

  if (!userId || onboardingCompleted === undefined) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await userService.updateUserOnboardingStatus(userId, onboardingCompleted);
    res.status(200).json({ message: 'User onboarding status updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user onboarding status', error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};

const resetMonthlyData = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    console.log(`Resetting monthly data for user ID: ${userId}`);

    const budgets = await Budget.findAll({ where: { userId } });

    // Calculate the total remaining budget
    let totalRemaining = 0;
    for (const budget of budgets) {
      const remaining = budget.allocated - budget.spent;
      if (remaining > 0) {
        totalRemaining += remaining;
      }
      budget.spent = 0;
      await budget.save();
    }

    // Reset budgets
    const deletedBudgets = await Budget.destroy({ where: { userId } });
    console.log(`Deleted budgets: ${deletedBudgets}`);

    // Reset transactions
    const deletedTransactions = await Transaction.destroy({ where: { userId } });
    console.log(`Deleted transactions: ${deletedTransactions}`);

    // Update user's savings
  } catch (error) {
    res.status(500).json({ message: 'Error resetting monthly data', error: error.message });
  }
};

module.exports = {
  register,
  login,
  googleOAuth,
  googleOAuthCallback,
  updateIncomeAndCurrency,
  updateProfile,
  updateProfilePicture,
  updateOnboardingStatus,
  changePassword,
  getProfile,
  upload,
  resetMonthlyData,
};
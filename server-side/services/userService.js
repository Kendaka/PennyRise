const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


// This file contains the logic for user registration, login, and profile management.
const registerUser = async (username, email, password) => {
  const existingEmail = await User.findOne({ where: { email } });
  if (existingEmail) {
    const error = new Error('Email is already in use');
    error.code = 'EMAIL_IN_USE';
    throw error;
  }

  const existingUsername = await User.findOne({ where: { username } });
  if (existingUsername) {
    const error = new Error('Username is already in use');
    error.code = 'USERNAME_IN_USE';
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashedPassword });
  return user;
};

// This function registers or updates a user based on their Google profile information.
const registerOrUpdateGoogleUser = async (profile) => {
  const { id: googleId, displayName: username, emails } = profile;

  if (!emails || emails.length === 0) {
    console.error('No email found in Google profile:', profile); 
    throw new Error('No email found in Google profile');
  }

  const email = emails[0].value;

  let user = await User.findOne({ where: { googleId } });
  if (!user) {
    user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.create({ username, email, googleId });
    } else {
      user.googleId = googleId;
      await user.save();
    }
  }
  return user;
};

// This function generates a JWT token for the user.
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// This function logs in a user by verifying their email and password.
const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('User does not exist');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return { user, token };
};

// This function registers a user with Google and returns the user object.
const registerWithGoogle = async (profile) => {
  const { id: googleId, displayName: username, emails } = profile;
  const email = emails[0].value;

  let user = await User.findOne({ where: { googleId } });
  if (!user) {
    user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.create({ username, email, googleId });
    }
  }
  return user;
};

// This function updates the user's monthly income and preferred currency.
const updateUserIncomeAndCurrency = async (userId, monthlyIncome, preferredCurrency) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }

  user.monthlyIncome = monthlyIncome;
  user.preferredCurrency = preferredCurrency;
  await user.save();

  return user;
};

// This function updates the user's profile information, including username and profile picture.
const updateUserProfile = async (userId, username, profilePicture) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }

  user.username = username;
  user.profilePicture = profilePicture;
  await user.save();

  return user;
};

// This function updates the user's profile picture.
const updateUserProfilePicture = async (userId, profilePicture) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }

  user.profilePicture = profilePicture;
  await user.save();

  return user;
};

// This function updates the user's onboarding status.
const updateUserOnboardingStatus = async (userId, onboardingCompleted) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }

  user.onboardingCompleted = onboardingCompleted;
  await user.save();

  return user;
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new Error('Current password is incorrect');
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedNewPassword;
  await user.save();

  return user;
};

const getUserById = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

const resetMonthlyData = async () => {
  const users = await User.findAll();

  for (const user of users) {
    const budgets = await Budget.findAll({ where: { userId: user.id } });
    const savingsGoals = await SavingsGoal.findAll({ where: { userId: user.id } });

    let totalSaved = 0;

    for (const budget of budgets) {
      const remaining = budget.allocated - budget.spent;
      if (remaining > 0) {
        totalSaved += remaining;
      }
      budget.spent = 0;
      await budget.save();
    }

    if (totalSaved > 0) {
      const savingsGoal = savingsGoals.find(goal => goal.name === 'Monthly Savings');
      if (savingsGoal) {
        savingsGoal.saved += totalSaved;
        await savingsGoal.save();
      } else {
        await SavingsGoal.create({
          userId: user.id,
          name: 'Monthly Savings',
          target: totalSaved,
          saved: totalSaved,
        });
      }
    }

    user.monthlyIncome = 0; 
    await user.save();
  }
};

module.exports = {
  registerUser,
  loginUser,
  registerWithGoogle,
  registerOrUpdateGoogleUser,
  generateToken,
  updateUserIncomeAndCurrency,
  updateUserProfile,
  updateUserProfilePicture,
  updateUserOnboardingStatus,
  changePassword,
  getUserById,
  resetMonthlyData,
};
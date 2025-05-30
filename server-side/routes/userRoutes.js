const express = require('express');
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', userController.register); // Endpoint to register a new user
router.post('/login', userController.login); // Endpoint to log in an existing user
router.put('/update-income-currency', authenticateToken, userController.updateIncomeAndCurrency); // Endpoint to update user's income and currency
router.put('/update-profile', authenticateToken, userController.updateProfile); // Endpoint to update user's profile information
router.put('/update-profile-picture', authenticateToken, userController.upload.single('profilePicture'), userController.updateProfilePicture);
router.put('/update-onboarding-status', authenticateToken, userController.updateOnboardingStatus); // Endpoint to update user's onboarding status
router.put('/change-password', authenticateToken, userController.changePassword); // Endpoint to change user's password
router.get('/profile', authenticateToken, userController.getProfile); // Endpoint to get user's profile information
router.put('/reset-monthly-data', userController.resetMonthlyData); // Endpoint to reset user's monthly data

module.exports = router;
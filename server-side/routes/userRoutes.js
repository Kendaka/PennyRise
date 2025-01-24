const express = require('express');
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.put('/update-income-currency', authenticateToken, userController.updateIncomeAndCurrency);
router.put('/update-profile', authenticateToken, userController.updateProfile);
router.put('/update-profile-picture', authenticateToken, userController.upload.single('profilePicture'), userController.updateProfilePicture);
router.put('/update-onboarding-status', authenticateToken, userController.updateOnboardingStatus);
router.put('/change-password', authenticateToken, userController.changePassword);
router.get('/profile', authenticateToken, userController.getProfile);
router.put('/reset-monthly-data', userController.resetMonthlyData);

router.get('/auth/google', userController.googleOAuth);
router.get('/auth/google/callback', userController.googleOAuthCallback);

module.exports = router;
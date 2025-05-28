const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/request-password-reset', authController.requestPasswordReset); // Endpoint to request a password reset
router.post('/reset-password', authController.resetPassword); // Endpoint to reset the password

module.exports = router;
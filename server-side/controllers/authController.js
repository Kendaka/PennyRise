const authService = require('../services/authService');

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const token = await authService.generateResetToken(email);
    res.status(200).json({ message: 'Password reset token generated', token });
  } catch (error) {
    res.status(500).json({ message: 'Error generating password reset token', error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await authService.resetPassword(token, newPassword);
    res.status(200).json({ message: 'Password reset successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password', error: error.message });
  }
};

module.exports = {
  requestPasswordReset,
  resetPassword,
};
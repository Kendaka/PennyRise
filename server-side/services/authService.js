// This file contains the logic for generating a password reset token and resetting the password.
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize'); 
const User = require('../models/User');

// This function generates a password reset token and saves it to the user's record in the database.
const generateResetToken = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('User not found');
  }

  const token = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; 
  await user.save();

  return token;
};

// This function resets the user's password using the provided token and new password.
const resetPassword = async (token, newPassword) => {
  const user = await User.findOne({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: { [Sequelize.Op.gt]: Date.now() },
    },
  });

  if (!user) {
    throw new Error('Password reset token is invalid or has expired');
  }

  // Validate the new password (you can add your own validation logic here)
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  return user;
};

module.exports = {
  generateResetToken,
  resetPassword,
};
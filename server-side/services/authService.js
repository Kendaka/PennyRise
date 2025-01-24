const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize'); 
const User = require('../models/User');

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
const SavingsGoal = require('../models/SavingsGoal');
const User = require('../models/User');
const Budget = require('../models/Budget');

// This file contains the logic for creating, retrieving, updating, and deleting savings goals for users.
const createSavingsGoal = async (userId, name, target, saved) => {
  const user = await User.findByPk(userId);

  const totalAllocated = await Budget.sum('allocated', { where: { userId } }); // Sum of all allocated budgets for the user
  const totalSaved = await SavingsGoal.sum('saved', { where: { userId } }); // Sum of all saved amounts in savings goals for the user
  const availableBalance = user.monthlyIncome - totalAllocated - totalSaved;

  if (saved > availableBalance) {
    throw new Error('Saved amount exceeds available balance');
  }

  const savingsGoal = await SavingsGoal.create({ userId, name, target, saved });
  return savingsGoal;
};

const getSavingsGoalsByUserId = async (userId) => {
  const savingsGoals = await SavingsGoal.findAll({ where: { userId } });
  return savingsGoals;
};

const updateSavingsGoal = async (goalId, name, target, saved) => {
  const savingsGoal = await SavingsGoal.findByPk(goalId);
  if (!savingsGoal) {
    throw new Error('Savings goal not found');
  }

  const user = await User.findByPk(savingsGoal.userId);

  const totalAllocated = await Budget.sum('allocated', { where: { userId: savingsGoal.userId } });
  const totalSaved = await SavingsGoal.sum('saved', { where: { userId: savingsGoal.userId } });
  const availableBalance = user.monthlyIncome - totalAllocated - totalSaved + savingsGoal.saved;

  if (saved > availableBalance) {
    throw new Error('Saved amount exceeds available balance');
  }

  savingsGoal.name = name;
  savingsGoal.target = target;
  savingsGoal.saved = saved;
  await savingsGoal.save();
  return savingsGoal;
};

const deleteSavingsGoal = async (goalId) => {
  const savingsGoal = await SavingsGoal.findByPk(goalId);
  if (!savingsGoal) {
    throw new Error('Savings goal not found');
  }

  await savingsGoal.destroy();
  return savingsGoal;
};

module.exports = {
  createSavingsGoal,
  getSavingsGoalsByUserId,
  updateSavingsGoal,
  deleteSavingsGoal,
};
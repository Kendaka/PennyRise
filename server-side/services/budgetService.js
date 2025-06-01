const Budget = require('../models/Budget');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// This file contains the logic for creating, retrieving, updating, and deleting budgets for users.
const createBudget = async (userId, category, allocated) => {
  const user = await User.findByPk(userId);
  const budgets = await Budget.findAll({ where: { userId } });

  const totalAllocated = budgets.reduce((sum, budget) => sum + budget.allocated, 0);

  if (totalAllocated + allocated > user.monthlyIncome) {
    throw new Error(`YOU DON'T HAVE ENOUGH BALANCE FOR THIS BUDGET. YOUR BALANCE: ${user.monthlyIncome - totalAllocated}`);
  }

  // Check if the category already exists for the user
  const budget = await Budget.create({ userId, category, allocated });
  return budget;
};

// Retrieves all budgets for a specific user by their userId
const getBudgetsByUserId = async (userId) => {
  const budgets = await Budget.findAll({ where: { userId } });
  return budgets;
};

// Updates an existing budget by its ID
const updateBudget = async (budgetId, allocated) => {
  const budget = await Budget.findByPk(budgetId);
  if (!budget) {
    throw new Error('Budget not found');
  }

  if (allocated < budget.spent) {
    throw new Error(`The budget limit cannot be less than the amount already spent (${budget.spent}).`);
  }

  const user = await User.findByPk(budget.userId);
  const budgets = await Budget.findAll({ where: { userId: budget.userId } });

  const totalAllocated = budgets.reduce((sum, b) => sum + (b.id !== budgetId ? b.allocated : 0), 0);

  if (totalAllocated + allocated > user.monthlyIncome) {
    throw new Error(`YOU DON'T HAVE ENOUGH BALANCE FOR THIS BUDGET. YOUR BALANCE: ${user.monthlyIncome - totalAllocated}`);
  }

  budget.allocated = allocated;
  await budget.save();
  return budget;
};

const deleteBudget = async (budgetId) => {
  const budget = await Budget.findByPk(budgetId);
  if (!budget) {
    throw new Error('Budget not found');
  }

  await Transaction.destroy({ where: { userId: budget.userId, category: budget.category } });

  await budget.destroy();
  return budget;
};

module.exports = {
  createBudget,
  getBudgetsByUserId,
  updateBudget,
  deleteBudget,
};
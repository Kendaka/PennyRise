const budgetService = require('../services/budgetService'); // Importing the budget service

// This controller handles budget-related operations such as creating, fetching, updating, and deleting budgets
const createBudget = async (req, res) => {
  const { category, allocated } = req.body;
  const userId = req.user.id;

  // Validate input
  if (!category || !allocated) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const budget = await budgetService.createBudget(userId, category, allocated);
    res.status(201).json({ message: 'Budget created successfully', budget });
  } catch (error) {
    res.status(500).json({ message: 'Error creating budget', error: error.message });
  }
};

// This controller fetches all budgets for a user
const getBudgets = async (req, res) => {
  const userId = req.user.id;

  try {
    const budgets = await budgetService.getBudgetsByUserId(userId);
    res.status(200).json({ budgets });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching budgets', error: error.message });
  }
};

// This controller updates an existing budget
const updateBudget = async (req, res) => {
  const { budgetId, allocated } = req.body;

  if (!budgetId || !allocated) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const budget = await budgetService.updateBudget(budgetId, allocated);
    res.status(200).json({ message: 'Budget updated successfully', budget });
  } catch (error) {
    res.status(500).json({ message: 'Error updating budget', error: error.message });
  }
};

// This controller deletes a budget
const deleteBudget = async (req, res) => {
  const { budgetId } = req.body;

  if (!budgetId) {
    return res.status(400).json({ message: 'Budget ID is required' });
  }

  // Validate that the budget ID is a valid format
  try {
    const budget = await budgetService.deleteBudget(budgetId);
    res.status(200).json({ message: 'Budget deleted successfully', budget });
  } catch (error) {
    console.error('Error deleting budget:', error); 
    res.status(500).json({ message: 'Error deleting budget', error: error.message });
  }
};

module.exports = {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
};
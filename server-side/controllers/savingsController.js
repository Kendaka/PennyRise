const savingsService = require('../services/savingsService');

// This controller handles savings goal-related operations such as creating, fetching, updating, and deleting savings goals
const createSavingsGoal = async (req, res) => {
  const { name, target, saved } = req.body;
  const userId = req.user.id;

  if (!name || !target || saved === undefined) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const savingsGoal = await savingsService.createSavingsGoal(userId, name, target, saved);
    res.status(201).json({ message: 'Savings goal created successfully', savingsGoal });
  } catch (error) {
    console.error('Error creating savings goal:', error); 
    res.status(500).json({ message: 'Error creating savings goal', error: error.message });
  }
};

// This controller fetches all savings goals for a user
const getSavingsGoals = async (req, res) => {
  const userId = req.user.id;

  try {
    const savingsGoals = await savingsService.getSavingsGoalsByUserId(userId);
    res.status(200).json({ savingsGoals });
  } catch (error) {
    console.error('Error fetching savings goals:', error); 
    res.status(500).json({ message: 'Error fetching savings goals', error: error.message });
  }
};

// This controller updates an existing savings goal
const updateSavingsGoal = async (req, res) => {
  const { goalId, name, target, saved } = req.body;

  if (!goalId || !name || !target || saved === undefined) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const savingsGoal = await savingsService.updateSavingsGoal(goalId, name, target, saved);
    res.status(200).json({ message: 'Savings goal updated successfully', savingsGoal });
  } catch (error) {
    console.error('Error updating savings goal:', error); 
    res.status(500).json({ message: 'Error updating savings goal', error: error.message });
  }
};

// This controller deletes a savings goal
const deleteSavingsGoal = async (req, res) => {
  const { goalId } = req.body;

  if (!goalId) {
    return res.status(400).json({ message: 'Goal ID is required' });
  }

  try {
    const savingsGoal = await savingsService.deleteSavingsGoal(goalId);
    res.status(200).json({ message: 'Savings goal deleted successfully', savingsGoal });
  } catch (error) {
    console.error('Error deleting savings goal:', error); 
    res.status(500).json({ message: 'Error deleting savings goal', error: error.message });
  }
};

module.exports = {
  createSavingsGoal,
  getSavingsGoals,
  updateSavingsGoal,
  deleteSavingsGoal,
};
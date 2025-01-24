const transactionService = require('../services/transactionService');

const createTransaction = async (req, res) => {
  const { name, amount, category, type, date } = req.body;
  const userId = req.user.id;

  if (!name || !amount || !category || !type || !date) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const transaction = await transactionService.createTransaction(userId, name, amount, category, type, date);
    res.status(201).json({ message: 'Transaction created successfully', transaction });
  } catch (error) {
    res.status(500).json({ message: 'Error creating transaction', error: error.message });
  }
};

const getTransactions = async (req, res) => {
  const userId = req.user.id;

  try {
    const transactions = await transactionService.getTransactionsByUserId(userId);
    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  const { transactionId } = req.body;

  if (!transactionId) {
    return res.status(400).json({ message: 'Transaction ID is required' });
  }

  try {
    const transaction = await transactionService.deleteTransaction(transactionId);
    res.status(200).json({ message: 'Transaction deleted successfully', transaction });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting transaction', error: error.message });
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  deleteTransaction,
};
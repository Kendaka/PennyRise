const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

// Transactions are linked to budgets and users, ensuring that expenses do not exceed allocated budgets.
const createTransaction = async (userId, name, amount, category, type, date) => {

  const budgets = await Budget.findAll({ where: { userId } });
  if (budgets.length === 0) {
    throw new Error('User must set a budget before creating transactions');
  }

  const budget = budgets.find(b => b.category === category);
  if (!budget) {
    throw new Error(`No budget found for category: ${category}`);
  }

  if (type === 'expense' && budget.spent + amount > budget.allocated) {
    throw new Error(`Not enough budget remaining for category: ${category}`);
  }

  if (type === 'expense') {
    budget.spent += amount;
    await budget.save();
  }

  const transaction = await Transaction.create({ userId, name, amount, category, type, date });
  return transaction;
};

//  Retrieves all transactions for a specific user by their userId
const getTransactionsByUserId = async (userId) => {
  const transactions = await Transaction.findAll({ where: { userId } });
  return transactions;
};

// Deletes a transaction by its ID and updates the associated budget if it's an expense
const deleteTransaction = async (transactionId) => {
  const transaction = await Transaction.findByPk(transactionId);
  if (!transaction) {
    throw new Error('Transaction not found');
  }

  if (transaction.type === 'expense') {
    const budget = await Budget.findOne({ where: { userId: transaction.userId, category: transaction.category } });
    if (budget) {
      budget.spent -= transaction.amount;
      await budget.save();
    }
  }

  await transaction.destroy();
  return transaction;
};

module.exports = {
  createTransaction,
  getTransactionsByUserId,
  deleteTransaction,
};
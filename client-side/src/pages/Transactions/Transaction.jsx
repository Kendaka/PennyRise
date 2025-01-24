import React, { useState, useEffect } from 'react';
import TransactionList from '../../components/sections/Transactions/TransactionList';
import AddTransactionModal from '../../components/sections/Transactions/AddTransactionModal';
import TransactionSearch from '../../components/sections/Transactions/TransactionSearch';
import BottomNavbar from '../../components/layouts/BottomNavbar';
import ErrorModal from '../../components/common/ErrorModal';
import { getTransactions, createTransaction, deleteTransaction, getBudgets } from '../../services/api';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        setToken(token);
        const response = await getTransactions(token);
        setTransactions(response.transactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    const fetchBudgets = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await getBudgets(token);
        setBudgets(response.budgets);
      } catch (error) {
        console.error('Error fetching budgets:', error);
      }
    };

    fetchTransactions();
    fetchBudgets();
  }, []);

  const handleAddTransaction = async (transaction) => {
    try {
      const budget = budgets.find(b => b.category === transaction.category);
      if (!budget) {
        throw new Error(`No budget found for category: ${transaction.category}`);
      }

      if (budget.spent + transaction.amount > budget.allocated) {
        throw new Error(`Not enough budget remaining for category: ${transaction.category}`);
      }

      const response = await createTransaction(token, transaction);
      setTransactions([...transactions, response.transaction]);
      setBudgets(budgets.map(b => b.category === transaction.category ? { ...b, spent: b.spent + transaction.amount } : b));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
      setErrorMessage(error.response?.data?.message || 'An unexpected error occurred');
      setShowErrorModal(true);
    }
  };

  const handleDeleteTransaction = async (index) => {
    try {
      const transactionId = transactions[index].id;
      const transaction = transactions[index];
      await deleteTransaction(token, transactionId);
      setTransactions(transactions.filter((_, i) => i !== index));
      setBudgets(budgets.map(b => b.category === transaction.category ? { ...b, spent: b.spent - transaction.amount } : b));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const filteredTransactions = transactions.filter((transaction) =>
    search ? transaction.name.toLowerCase().includes(search.toLowerCase()) : true
  );

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {!isModalOpen && <BottomNavbar/>}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-20 right-4 font-bold font-roboto bg-secondary text-background text-xl w-12 h-12 flex items-center justify-center rounded-full shadow-lg z-10"
      >
        +
      </button>

      <div className={`flex-grow p-4 space-y-4 overflow-y-auto ${isModalOpen ? 'blur-sm' : ''}`}>
        <h1 className="text-xl text-text font-montserrat font-bold mb-4">Transactions</h1>
        <TransactionSearch onSearch={setSearch} />
        <TransactionList 
          transactions={filteredTransactions} 
          onDelete={handleDeleteTransaction} 
        />
      </div>

      {isModalOpen && (
        <AddTransactionModal
          onAdd={handleAddTransaction}
          onClose={() => setIsModalOpen(false)}
          budgets={budgets}
        />
      )}

      {showErrorModal && (
        <ErrorModal
          message={errorMessage}
          onClose={handleCloseErrorModal}
        />
      )}
    </div>
  );
};

export default Transactions;
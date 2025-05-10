import React, { useState, useEffect } from 'react';
import { FiTrash } from 'react-icons/fi';
import ConfirmationModal from '../../common/ConfirmationModal';
import { getCurrencySymbol } from '../../../utils/currencyUtils';

// Assuming you have a utility function to get the currency symbol based on user preference
interface Transaction {
  name: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (index: number) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  const [showAll, setShowAll] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(null);
  const [currency, setCurrency] = useState<string>('$');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user) {
      setCurrency(getCurrencySymbol(user.preferredCurrency));
    }
  }, []);

  const maxTransactionsToShow = 8;
  const visibleTransactions = showAll ? transactions : transactions.slice(0, maxTransactionsToShow);

  const handleDeleteClick = (index: number) => {
    setTransactionToDelete(index);
    setShowConfirmation(true);
  };

  const handleConfirmDelete = () => {
    if (transactionToDelete !== null) {
      onDelete(transactionToDelete);
    }
    setShowConfirmation(false);
    setTransactionToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
    setTransactionToDelete(null);
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md relative">
      <h2 className="text-lg text-text font-bold font-montserrat mb-4">Transaction History</h2>
      {transactions.length === 0 ? (
        <p className="text-textLight font-roboto font-bold">No transactions found. Start adding income or expenses!</p>
      ) : (
        <ul>
          {visibleTransactions.map((transaction, index) => (
            <li key={index} className="flex justify-between items-center py-2 border-b">
              <div>
                <p className="font-montserrat font-bold text-text mb-1">{transaction.category}</p>
                <p className="text-sm font-roboto text-text">{transaction.name}</p>
                <p className="text-sm text-textLight font-roboto">{transaction.date}</p>
              </div>
              <div className="flex items-center space-x-4">
                <p
                  className={`font-roboto font-bold ${
                    transaction.type === 'income' ? 'text-primary' : 'text-accent'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}{currency}{transaction.amount.toLocaleString()}
                </p>
                <button
                  onClick={() => handleDeleteClick(index)}
                  className="text-accent hover:text-orange-600"
                  aria-label="Delete transaction"
                >
                  <FiTrash size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {transactions.length > maxTransactionsToShow && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-4 text-secondary font-bold underline"
        >
          See More
        </button>
      )}

      {showAll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-md shadow-lg w-96 relative">
            <button
              onClick={() => setShowAll(false)}
              className="absolute top-2 right-4 text-text text-2xl font-roboto font-bold"
            >
              ×
            </button>
            <h3 className="text-lg text-text font-montserrat font-bold mb-4">All Transactions</h3>
            <ul className="max-h-64 overflow-y-auto">
              {transactions.map((transaction, index) => (
                <li key={index} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-montserrat font-bold text-text mb-1">{transaction.category}</p>
                    <p className="text-sm font-roboto text-text">{transaction.name}</p>
                    <p className="text-sm text-textLight font-roboto">{transaction.date}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p
                      className={`font-roboto font-bold ${
                        transaction.type === 'income' ? 'text-secondary' : 'text-accent'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}{currency}{transaction.amount.toLocaleString()}
                    </p>
                    <button
                      onClick={() => handleDeleteClick(index)}
                      className="text-accent hover:text-orange-600"
                      aria-label="Delete transaction"
                    >
                      <FiTrash size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {showConfirmation && (
        <ConfirmationModal
          message="Are you sure you want to delete this?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default TransactionList;

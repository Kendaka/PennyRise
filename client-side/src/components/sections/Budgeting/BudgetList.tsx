import React, { useState, useEffect } from 'react';
import ProgressBar from './ProgressBar';
import { FiTrash } from 'react-icons/fi';
import ConfirmationModal from '../../common/ConfirmationModal';
import { getCurrencySymbol } from '../../../utils/currencyUtils';

// Define the Budget interface to represent each budget item
interface Budget {
  id: string; 
  category: string;
  allocated: number;
  spent: number;
}

interface BudgetListProps {
  budgets: Budget[];
  onEdit: (budget: Budget) => void;
  onDelete: (index: number) => void;
  currency: string;
}

const BudgetList: React.FC<BudgetListProps> = ({ budgets, onEdit, onDelete, currency }) => {
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [budgetToDelete, setBudgetToDelete] = useState<number | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user) {
      currency = getCurrencySymbol(user.preferredCurrency);
    }
  }, []);

  const handleDeleteClick = (index: number) => {
    setBudgetToDelete(index);
    setShowConfirmation(true);
  };

  const handleConfirmDelete = () => {
    if (budgetToDelete !== null) {
      onDelete(budgetToDelete);
      setShowConfirmation(false);
      setBudgetToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
    setBudgetToDelete(null);
  };

  return (
    <div className="bg-background p-4 rounded-md shadow-md mb-20">
      <h2 className="text-md text-text font-montserrat mb-4">Your Budgets</h2>
      {budgets.length === 0 ? (
        <p className="text-textLight font-bold font-roboto">No budgets set. Start adding a budget!</p>
      ) : (
        <ul>
          {budgets.map((budget, index) => (
            <li key={budget.id} className="mb-3"> {/* Use budget.id as key */}
              <div className="flex justify-between items-center">
                <p className="font-bold">{budget.category}</p>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => onEdit(budget)}
                    className="text-secondary font-roboto underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(index)}
                    className="text-accent hover:text-orange-600"
                    aria-label="Delete budget"
                  >
                    <FiTrash size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-text font-roboto p-2">
                Spent: {currency}{budget.spent} / {currency}{budget.allocated}
              </p>
              <ProgressBar value={(budget.spent / budget.allocated) * 100} color="blue" />
            </li>
          ))}
        </ul>
      )}

      {showConfirmation && (
        <ConfirmationModal
          message="Deleting this budget will also delete all associated transactions. Are you sure you want to proceed?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default BudgetList;
import React, { useState, useEffect } from 'react';
import ProgressBar from '../Budgeting/ProgressBar';
import { FiTrash } from 'react-icons/fi';
import ConfirmationModal from '../../common/ConfirmationModal';
import { getCurrencySymbol } from '../../../utils/currencyUtils.js';

// This component is responsible for displaying a list of savings goals and allowing the user to edit or delete them.
interface SavingsGoal {
  id: string;
  name: string;
  saved: number;
  target: number;
}

interface SavingsListProps {
  savingsGoals: SavingsGoal[];
  onEdit: (goal: SavingsGoal) => void;
  onDelete: (index: number) => void;
}

const SavingsList: React.FC<SavingsListProps> = ({ savingsGoals, onEdit, onDelete }) => {
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [goalToDelete, setGoalToDelete] = useState<number | null>(null);
  const [currency, setCurrency] = useState<string>('$');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user && user.preferredCurrency) {
      setCurrency(getCurrencySymbol(user.preferredCurrency));
    }
  }, []);

  const handleDeleteClick = (index: number) => {
    setGoalToDelete(index);
    setShowConfirmation(true);
  };

  const handleConfirmDelete = () => {
    if (goalToDelete !== null) {
      onDelete(goalToDelete);
      setShowConfirmation(false);
      setGoalToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
    setGoalToDelete(null);
  };

  return (
    <div className="bg-background p-4 rounded-md shadow-md mb-20">
      <h2 className="text-lg text-text font-bold font-montserrat mb-4">Your Savings Goals</h2>
      {savingsGoals.length === 0 ? (
        <p className="text-textLight font-bold font-roboto">
          No savings goals yet. Start adding one!
        </p>
      ) : (
        <ul>
          {savingsGoals.map((goal, index) => (
            <li key={goal.id} className="mb-4">
              <div className="flex justify-between items-center">
                <p className="font-bold font-montserrat text-text text-lg">{goal.name}</p>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => onEdit(goal)}
                    className="text-primary font-roboto underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(index)}
                    className="text-accent hover:text-orange-600"
                    aria-label="Delete savings goal"
                  >
                    <FiTrash size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-textLight mb-2">
                Saved: {currency}
                {goal.saved} / {currency}
                {goal.target}
              </p>
              <ProgressBar value={(goal.saved / goal.target) * 100} color="accent" />
            </li>
          ))}
        </ul>
      )}

      {showConfirmation && (
        <ConfirmationModal
          message="Are you sure you want to delete this savings goal?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default SavingsList;
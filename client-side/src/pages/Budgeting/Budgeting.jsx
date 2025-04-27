import React, { useState, useEffect } from 'react';
import BudgetList from '../../components/sections/Budgeting/BudgetList';
import AddBudgetModal from '../../components/sections/Budgeting/AddBudgetModal';
import BottomNavbar from '../../components/layouts/BottomNavbar.tsx';
import ErrorModal from '../../components/common/ErrorModal';
import { getBudgets, createBudget, updateBudget, deleteBudget, getUser, getSavingsGoals } from '../../services/api';

const Budgeting = () => {
  const [budgets, setBudgets] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBudget, setCurrentBudget] = useState(null);
  const [token, setToken] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [remainingBalance, setRemainingBalance] = useState(0);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const token = localStorage.getItem('token');
        setToken(token);
        const response = await getBudgets(token);
        setBudgets(response.budgets || []);
      } catch (error) {
        console.error('Error fetching budgets:', error);
      }
    };

    fetchBudgets();
  }, []);

  useEffect(() => {
    const fetchSavingsGoals = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await getSavingsGoals(token);
        setSavingsGoals(response.savingsGoals || []);
      } catch (error) {
        console.error('Error fetching savings goals:', error);
      }
    };

    fetchSavingsGoals();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await getUser(token);
        const user = response.user;
        const totalAllocated = budgets.reduce((sum, budget) => sum + budget.allocated, 0);
        const totalSaved = savingsGoals.reduce((sum, goal) => sum + goal.saved, 0);
        setRemainingBalance(user.monthlyIncome - totalAllocated - totalSaved);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [budgets, savingsGoals]);

  const handleSaveBudget = async (budget) => {
    try {
      if (currentBudget) {
        const response = await updateBudget(token, { budgetId: currentBudget.id, allocated: budget.limit });
        setBudgets(budgets.map((b) => (b.id === currentBudget.id ? response.budget : b)));
      } else {
        const response = await createBudget(token, { category: budget.category, allocated: budget.limit });
        setBudgets([...budgets, response.budget]);
      }
      setIsModalOpen(false);
      setCurrentBudget(null);
    } catch (error) {
      console.error('Error saving budget:', error);
      setErrorMessage(error.response?.data?.message || 'An unexpected error occurred');
      setShowErrorModal(true);
    }
  };

  const handleEditBudget = (budget) => {
    setCurrentBudget(budget);
    setIsModalOpen(true);
  };

  const handleDeleteBudget = async (index) => {
    try {
      const budgetId = budgets[index].id;
      await deleteBudget(token, budgetId);
      setBudgets(budgets.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  return (
    <div>
      <div className="min-h-screen bg-background flex flex-col">
        <BottomNavbar/>
        <main className="flex-grow p-4 space-y-4 pb-20">
          <h1 className="text-xl text-text font-montserrat font-bold mb-4">Budgeting</h1>
          <BudgetList budgets={budgets} onEdit={handleEditBudget} onDelete={handleDeleteBudget} currency="$" />
          <button
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-20 right-4 font-bold font-roboto bg-secondary text-background text-xl w-12 h-12 flex items-center justify-center rounded-full shadow-lg z-10"
          >
            +
          </button>

          {isModalOpen && (
            <AddBudgetModal
              onSave={handleSaveBudget}
              onClose={() => setIsModalOpen(false)}
              initialData={currentBudget}
              existingBudgets={budgets.map((b) => b.category)}
              remainingBalance={remainingBalance}
            />
          )}
        </main>
      </div>
      {showErrorModal && (
        <ErrorModal
          message={errorMessage}
          onClose={handleCloseErrorModal}
        />
      )}
    </div>
  );
};

export default Budgeting;
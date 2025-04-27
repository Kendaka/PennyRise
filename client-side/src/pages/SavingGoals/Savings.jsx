import React, { useState, useEffect } from 'react';
import SavingsList from '../../components/sections/Savings/SavingsList';
import AddSavingsGoalModal from '../../components/sections/Savings/AddSavingsGoalModal';
import SavingsSummary from '../../components/sections/Savings/SavingsSummary';
import BottomNavBar from '../../components/layouts/BottomNavbar.tsx';
import { getSavingsGoals, createSavingsGoal, updateSavingsGoal, deleteSavingsGoal, getUser, getBudgets } from '../../services/api';

const Savings = () => {
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(null);
  const [remainingBalance, setRemainingBalance] = useState(0);
  const [token, setToken] = useState('');
  const [achievementModal, setAchievementModal] = useState({ isOpen: false, goalName: '' });

  useEffect(() => {
    const fetchSavingsGoals = async () => {
      try {
        const token = localStorage.getItem('token');
        setToken(token);
        const response = await getSavingsGoals(token);
        setSavingsGoals(response.savingsGoals);
      } catch (error) {
        console.error('Error fetching savings goals:', error);
      }
    };

    fetchSavingsGoals();
  }, []);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await getBudgets(token);
        setBudgets(response.budgets || []);
      } catch (error) {
        console.error('Error fetching budgets:', error);
      }
    };

    fetchBudgets();
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

  const handleSaveGoal = async (goal) => {
    try {
      if (currentGoal) {
        const response = await updateSavingsGoal(token, { goalId: currentGoal.id, ...goal });
        setSavingsGoals(savingsGoals.map((g) => (g.id === currentGoal.id ? response.savingsGoal : g)));
      } else {
        const response = await createSavingsGoal(token, goal);
        setSavingsGoals([...savingsGoals, response.savingsGoal]);
      }
      setIsModalOpen(false);
      setCurrentGoal(null);

      if (goal.saved >= goal.target) {
        setAchievementModal({ isOpen: true, goalName: goal.name });
      }
    } catch (error) {
      console.error('Error saving savings goal:', error);
    }
  };

  const handleEditGoal = (goal) => {
    setCurrentGoal(goal);
    setIsModalOpen(true);
  };

  const handleDeleteGoal = async (index) => {
    try {
      const goalId = savingsGoals[index].id;
      await deleteSavingsGoal(token, goalId);
      setSavingsGoals(savingsGoals.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting savings goal:', error);
    }
  };

  const refreshSavingsData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await getSavingsGoals(token);
      setSavingsGoals(response.savingsGoals);
    } catch (error) {
      console.error('Error refreshing savings data:', error);
    }
  };

  useEffect(() => {
    refreshSavingsData();
  }, []);

  return (
    <div>
      <BottomNavBar/>
      <div className="min-h-screen bg-background p-4">
        <h1 className="text-xl text-text font-bold font-montserrat mb-4">Savings</h1>
        <SavingsSummary savingsGoals={savingsGoals} />
        <SavingsList savingsGoals={savingsGoals} onEdit={handleEditGoal} onDelete={handleDeleteGoal} />

        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-20 right-4 font-bold font-roboto bg-secondary text-background text-xl w-12 h-12 flex items-center justify-center rounded-full shadow-lg z-10"
        >
          +
        </button>

        {isModalOpen && (
          <AddSavingsGoalModal
            onSave={handleSaveGoal}
            onClose={() => setIsModalOpen(false)}
            initialData={currentGoal}
            remainingBalance={remainingBalance}
          />
        )}

        {achievementModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-background p-6 rounded-md shadow-lg w-96">
              <h3 className="text-lg tex-text font-bold font-montserrat mb-4">
                Achievement Unlocked!
              </h3>
              <p className="text-text font-roboto mb-4">
                You just achieved this saving goal: {achievementModal.goalName}
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => setAchievementModal({ isOpen: false, goalName: '' })}
                  className="bg-secondary text-background font-roboto px-4 py-2 rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Savings;
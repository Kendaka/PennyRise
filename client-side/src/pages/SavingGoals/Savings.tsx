import React, { useState, useEffect } from 'react';
import SavingsList from '../../components/sections/Savings/SavingsList';
import AddSavingsGoalModal from '../../components/sections/Savings/AddSavingsGoalModal';
import SavingsSummary from '../../components/sections/Savings/SavingsSummary';
import BottomNavBar from '../../components/layouts/BottomNavbar';
import {
  getSavingsGoals,
  createSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
  getUser,
  getBudgets,
} from '../../services/api';

// Define types
interface SavingsGoalData {
  id: string;
  name: string;
  target: number;
  saved: number;
}

// Define the Budget interface
interface Budget {
  id: string;
  category: string;
  allocated: number;
}

interface User {
  monthlyIncome: number;
}

// Define the AchievementModalState interface
interface AchievementModalState {
  isOpen: boolean;
  goalName: string;
}

const Savings: React.FC = () => {
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoalData[]>([]); // State to hold savings goals
  const [budgets, setBudgets] = useState<Budget[]>([]); // State to hold budgets
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State to control modal visibility
  const [currentGoal, setCurrentGoal] = useState<SavingsGoalData | undefined>(undefined); // State to hold the current goal being edited
  const [remainingBalance, setRemainingBalance] = useState<number>(0); // State to hold the remaining balance
  const [token, setToken] = useState<string>(''); // State to hold the token
  const [achievementModal, setAchievementModal] = useState<AchievementModalState>({
    isOpen: false,
    goalName: '',
  }); // State to control the achievement modal visibility

  // Fetch savings goals and budgets when the component mounts
  useEffect(() => {
    const fetchSavingsGoals = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        setToken(token);
        const response = await getSavingsGoals(token);
        setSavingsGoals(response.savingsGoals);
      } catch (error) {
        console.error('Error fetching savings goals:', error);
      }
    };

    fetchSavingsGoals();
  }, []);

  // Fetch budgets when the component mounts
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const response = await getBudgets(token);
        setBudgets(response.budgets || []);
      } catch (error) {
        console.error('Error fetching budgets:', error);
      }
    };

    fetchBudgets();
  }, []);

  // Fetch user data to calculate remaining balance
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const response = await getUser(token);
        const user: User = response.user;
        const totalAllocated = budgets.reduce((sum, budget) => sum + budget.allocated, 0);
        const totalSaved = savingsGoals.reduce((sum, goal) => sum + goal.saved, 0);
        setRemainingBalance(user.monthlyIncome - totalAllocated - totalSaved);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [budgets, savingsGoals]);

  // Function to handle saving a goal
  const handleSaveGoal = async (goal: Omit<SavingsGoalData, 'id'>) => {
    try {
      if (currentGoal) {
        const response = await updateSavingsGoal(token, { goalId: currentGoal.id, ...goal });
        setSavingsGoals(
          savingsGoals.map((g) => (g.id === currentGoal.id ? response.savingsGoal : g))
        );
      } else {
        const response = await createSavingsGoal(token, goal);
        setSavingsGoals([...savingsGoals, response.savingsGoal]);
      }

      setIsModalOpen(false);
      setCurrentGoal(undefined);

      if (goal.saved >= goal.target) {
        setAchievementModal({ isOpen: true, goalName: goal.name });
      }
    } catch (error) {
      console.error('Error saving savings goal:', error);
    }
  };

  // Function to handle editing a goal
  const handleEditGoal = (goal: SavingsGoalData) => {
    setCurrentGoal(goal);
    setIsModalOpen(true);
  };

  // Function to handle deleting a goal
  const handleDeleteGoal = async (index: number) => {
    try {
      const goalId = savingsGoals[index].id;
      await deleteSavingsGoal(token, goalId);
      setSavingsGoals(savingsGoals.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting savings goal:', error);
    }
  };

  // Function to refresh savings data
  const refreshSavingsData = async () => {
    try {
      const token = localStorage.getItem('token') || '';
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
      <BottomNavBar />
      <div className="min-h-screen bg-background p-4">
        <h1 className="text-xl text-text font-bold font-montserrat mb-4">Savings</h1>
        <SavingsSummary savingsGoals={savingsGoals} />
        <SavingsList
          savingsGoals={savingsGoals}
          onEdit={handleEditGoal}
          onDelete={handleDeleteGoal}
        />

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
                  onClick={() =>
                    setAchievementModal({ isOpen: false, goalName: '' })
                  }
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
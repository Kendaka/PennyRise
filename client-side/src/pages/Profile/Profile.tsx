import React, { useState, useEffect, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProfileHeader from '../../components/sections/Profile/ProfileHeader';
import ProfileDetails from '../../components/sections/Profile/ProfileDetails';
import MonthlyIncomeField from '../../components/sections/Profile/MonthlyIncomeField';
import CurrencyField from '../../components/sections/Profile/CurrencyField';
import ChangePasswordForm from '../../components/sections/Profile/ChangePassword';
import BottomNavbar from '../../components/layouts/BottomNavbar';
import SuccessModal from '../../components/common/SuccessModal';
import ErrorModal from '../../components/common/ErrorModal';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import {
  updateUserProfile,
  updateUserIncomeAndCurrency,
  updateUserProfilePicture,
  changeUserPassword,
  getBudgets,
  resetMonthlyData,
  getUser,
  getTransactions,
  getSavingsGoals
} from '../../services/api';

// Define the types for the user and currency options
interface User {
  id?: string;
  username: string;
  email: string;
  monthlyIncome: number;
  preferredCurrency: string;
  profilePicture?: string;
}

// Define the types for the currency options
interface CurrencyOption {
  value: string;
  label: string;
}

// Define the types for the password change and savings goal
interface PasswordChange {
  currentPassword: string;
  newPassword: string;
}

// Define the types for the savings goal
interface SavingsGoal {
  name: string;
  saved: number;
  target: number;
}

// Interface for API parameters
interface IncomeCurrencyData {
  income: number;       // Using 'income' instead of 'monthlyIncome'
  currency: string;     // Using 'currency' instead of 'preferredCurrency'
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User>({
    username: '',
    email: '',
    monthlyIncome: 0,
    preferredCurrency: '',
    profilePicture: '',
  });
// Define the initial state for the user
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [totalAllocated, setTotalAllocated] = useState(0);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // Define the initial state for the savings goals
  const navigate = useNavigate();

  // Define the initial state for the currency options
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Fetch the user data from local storage
    const fetchBudgets = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const response = await getBudgets(token);
        const budgets = response.budgets || [];
        const total = budgets.reduce((sum: number, budget: { allocated: number }) => sum + budget.allocated, 0);
        setTotalAllocated(total);
      } catch (error) {
        console.error('Error fetching budgets:', error);
      }
    };

    fetchBudgets();
  }, []);

  // Fetch the user data from local storagec
  const handleUpdateUser = async (updatedUser: Partial<User>) => {
    try {
      const token = localStorage.getItem('token') || '';
      const response = await updateUserProfile(token, { userId: user.id, ...updatedUser });
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      setSuccessMessage('Username updated successfully!');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  // Handle the save income and currency functions
  const handleSaveIncome = async (income: number) => {
    if (income < totalAllocated) {
      setErrorMessage(`Monthly income cannot be lower than the total allocated budget (${totalAllocated}).`);
      setShowErrorModal(true);
      return;
    }

    try {
      const token = localStorage.getItem('token') || '';
      const response = await updateUserIncomeAndCurrency(token, {
        income: income,                       // Changed from userId and monthlyIncome
        currency: user.preferredCurrency,     // Changed from preferredCurrency
      });
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      setSuccessMessage('Monthly income updated successfully!');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error updating monthly income:', error);
    }
  };

  const handleSaveCurrency = async (currency: CurrencyOption) => {
    try {
      const token = localStorage.getItem('token') || '';
      const response = await updateUserIncomeAndCurrency(token, {
        income: user.monthlyIncome,          // Changed from userId and monthlyIncome
        currency: currency.value,            // Changed from preferredCurrency
      });
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      setSuccessMessage('Preferred currency updated successfully!');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error updating preferred currency:', error);
    }
  };

  // Handle the change password function
  const handleChangePassword = async ({ currentPassword, newPassword }: PasswordChange) => {
    try {
      const token = localStorage.getItem('token') || '';
      await changeUserPassword(token, { currentPassword, newPassword });
      setSuccessMessage('Password changed successfully!');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error changing password:', error);
      setErrorMessage('Error changing password. Please try again.');
      setShowErrorModal(true);
    }
  };

  // Handle the reset monthly data function
  const handleResetMonthlyData = () => {
    setShowConfirmationModal(true);
  };

  // Handle the confirm reset monthly data function
  const handleConfirmReset = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      const response = await resetMonthlyData(token, { userId: user.id });
      setSuccessMessage('Monthly data reset successfully!');
      setShowSuccessModal(true);
      refreshDashboardData();
      refreshSavingsData(response.totalRemaining);
    } catch (error) {
      console.error('Error resetting monthly data:', error);
      setErrorMessage('Error resetting monthly data. Please try again.');
      setShowErrorModal(true);
    } finally {
      setShowConfirmationModal(false);
    }
  };

  // Handle the refresh savings data function
  const refreshSavingsData = (totalRemaining: number) => {
    setSavingsGoals((prevGoals) => {
      const updated = prevGoals.map((goal) =>
        goal.name === 'Monthly Savings'
          ? {
              ...goal,
              saved: goal.saved + totalRemaining,
              target: goal.target + totalRemaining,
            }
          : goal
      );

      if (!updated.find((goal) => goal.name === 'Monthly Savings')) {
        updated.push({
          name: 'Monthly Savings',
          saved: totalRemaining,
          target: totalRemaining,
        });
      }

      return updated;
    });
  };

  // Handle the refresh dashboard data function
  const refreshDashboardData = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      const userResponse = await getUser(token);
      const budgetsResponse = await getBudgets(token);
      await getTransactions(token); 
      await getSavingsGoals(token); // optional: use the result if needed

      setUser(userResponse.user);
      setTotalAllocated(
        budgetsResponse.budgets.reduce(
          (sum: number, budget: { allocated: number }) => sum + budget.allocated,
          0
        )
      );
      navigate('/dashboard');
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
    }
  };

  // Handle the change image function
  const handleChangeImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('profilePicture', file);
      formData.append('userId', user.id || '');

      try {
        const token = localStorage.getItem('token') || '';
        const response = await updateUserProfilePicture(token, formData);
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
      } catch (error) {
        console.error('Error updating profile picture:', error);
      }
    }
  };

  // Handle the delete image function
  const handleDeleteImage = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      const response = await updateUserProfile(token, {
        userId: user.id,
        profilePicture: '',
      });
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error) {
      console.error('Error deleting profile picture:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background mb-8 flex flex-col">
      <BottomNavbar />
      <main className="flex-grow p-4 space-y-4 overflow-y-auto pb-12 mt-2">
        <ProfileHeader user={user} onChangeImage={handleChangeImage} onDeleteImage={handleDeleteImage} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="space-y-4">
            <ProfileDetails user={user} onUpdate={handleUpdateUser} />
          </div>
          <div className="space-y-4">
            <MonthlyIncomeField initialIncome={user.monthlyIncome} onSave={handleSaveIncome} />
            <CurrencyField onSave={handleSaveCurrency} />
          </div>
        </div>
        <div className="flex flex-col items-center mt-4 space-y-2">
          <button
            onClick={() => setShowChangePassword(!showChangePassword)}
            className="bg-secondary text-background font-roboto px-4 py-2 rounded-md"
          >
            {showChangePassword ? 'Hide Change Password' : 'Change Password'}
          </button>
          {showChangePassword && <ChangePasswordForm onChangePassword={handleChangePassword} />}
          <button
            onClick={handleResetMonthlyData}
            className="bg-red-500 text-background font-roboto px-4 py-2 rounded-md hover:bg-red-600"
          >
            Reset Monthly Data
          </button>
          <Link
            to="/login"
            className="bg-red-500 text-background font-roboto px-5 py-2 rounded-md hover:bg-red-600"
          >
            Log Out
          </Link>
        </div>
      </main>
      {showSuccessModal && (
        <SuccessModal message={successMessage} onClose={() => setShowSuccessModal(false)} />
      )}
      {showErrorModal && (
        <ErrorModal message={errorMessage} onClose={() => setShowErrorModal(false)} />
      )}
      {showConfirmationModal && (
        <ConfirmationModal
          message="Are you sure you want to reset the monthly data?"
          onConfirm={handleConfirmReset}
          onCancel={() => setShowConfirmationModal(false)}
        />
      )}
    </div>
  );
};

export default Profile;
import React, { useState, useEffect } from 'react';
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
import { updateUserProfile, updateUserIncomeAndCurrency, updateUserProfilePicture, changeUserPassword, getBudgets, resetMonthlyData, getUser, getTransactions, getSavingsGoals } from '../../services/api';

const Profile = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    monthlyIncome: 0,
    preferredCurrency: '',
    profilePicture: '',
  });
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [totalAllocated, setTotalAllocated] = useState(0);
  const [savingsGoals, setSavingsGoals] = useState([]); 
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    }

    const fetchBudgets = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await getBudgets(token);
        const budgets = response.budgets || [];
        const totalAllocated = budgets.reduce((sum, budget) => sum + budget.allocated, 0);
        setTotalAllocated(totalAllocated);
      } catch (error) {
        console.error('Error fetching budgets:', error);
      }
    };

    fetchBudgets();
  }, []);

  const handleUpdateUser = async (updatedUser) => {
    try {
      const token = localStorage.getItem('token');
      const response = await updateUserProfile(token, { userId: user.id, ...updatedUser });
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      setSuccessMessage('Username updated successfully!');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const handleSaveIncome = async (income) => {
    if (income < totalAllocated) {
      setErrorMessage(`Monthly income cannot be lower than the total allocated budget (${totalAllocated}).`);
      setShowErrorModal(true);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await updateUserIncomeAndCurrency(token, { userId: user.id, monthlyIncome: income, preferredCurrency: user.preferredCurrency });
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      setSuccessMessage('Monthly income updated successfully!');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error updating monthly income:', error);
    }
  };

  const handleSaveCurrency = async (currency) => {
    try {
      const token = localStorage.getItem('token');
      const response = await updateUserIncomeAndCurrency(token, { userId: user.id, monthlyIncome: user.monthlyIncome, preferredCurrency: currency.value });
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      setSuccessMessage('Preferredd currency updated successfully!');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error updating preferred currency:', error);
    }
  };

  const handleChangePassword = async ({ currentPassword, newPassword }) => {
    try {
      const token = localStorage.getItem('token');
      await changeUserPassword(token, { currentPassword, newPassword });
      setSuccessMessage('Password changed successfully!');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error changing password:', error);
      setErrorMessage('Error changing password. Please try again.');
      setShowErrorModal(true);
    }
  };

  const handleResetMonthlyData = async () => {
    setShowConfirmationModal(true);
  };

  const handleConfirmReset = async () => {
    try {
      const token = localStorage.getItem('token');
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

  const refreshSavingsData = (totalRemaining) => {
    setSavingsGoals((prevSavingsGoals) => {
      const updatedSavingsGoals = prevSavingsGoals.map((goal) => {
        if (goal.name === 'Monthly Savings') {
          return {
            ...goal,
            saved: goal.saved + totalRemaining,
            target: goal.target + totalRemaining,
          };
        }
        return goal;
      });

      if (!updatedSavingsGoals.find((goal) => goal.name === 'Monthly Savings')) {
        updatedSavingsGoals.push({
          name: 'Monthly Savings',
          target: totalRemaining,
          saved: totalRemaining,
        });
      }

      return updatedSavingsGoals;
    });
  };

  const refreshDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userResponse = await getUser(token);
      const budgetsResponse = await getBudgets(token);
      const transactionsResponse = await getTransactions(token);
      const savingsGoalsResponse = await getSavingsGoals(token);

      setUser(userResponse.user);
      setTotalAllocated(budgetsResponse.budgets.reduce((sum, budget) => sum + budget.allocated, 0));
      navigate('/dashboard');
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
    }
  };

  const handleChangeImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
    const formData = new FormData();
    formData.append('profilePicture', file);
    formData.append('userId', user.id);
    try {
    const token = localStorage.getItem('token');
    const response = await updateUserProfilePicture(token, formData);
    setUser(response.user);
    localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error) {
    console.error('Error updating profile picture:', error);
    }
    }
    };
    
    const handleDeleteImage = async () => {
    try {
    const token = localStorage.getItem('token');
    const response = await updateUserProfile(token, { userId: user.id, profilePicture: '' });
    setUser(response.user);
    localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error) {
    console.error('Error deleting profile picture:', error);
    }
    };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  return (
    <div className="min-h-screen bg-background mb-8 md:mb-8 lg:mb-8 flex flex-col">
      <BottomNavbar />
      <main className="flex-grow p-4 space-y-4 overflow-y-auto pb-12 md:mt-2">
        <ProfileHeader user={user} onChangeImage={handleChangeImage} onDeleteImage={handleDeleteImage} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 mt-8">
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
        <SuccessModal
          message={successMessage}
          onClose={handleCloseSuccessModal}
        />
      )}
      {showErrorModal && (
        <ErrorModal
          message={errorMessage}
          onClose={handleCloseErrorModal}
        />
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
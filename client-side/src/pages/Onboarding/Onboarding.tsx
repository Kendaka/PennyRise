// Onboarding.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { currencyOptions } from '../../utils/currencyOptions';
import ErrorModal from '../../components/common/ErrorModal';
import { updateUserIncomeAndCurrency, updateUserOnboardingStatus } from '../../services/api';

interface CurrencyOption {
  value: string;
  label: string;
}

const Onboarding: React.FC = () => {
  const [monthlyIncome, setMonthlyIncome] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption | null>(currencyOptions[0]);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!monthlyIncome) {
      setError('Monthly income is required.');
      setShowErrorModal(true);
      return;
    }

    if (!selectedCurrency) {
      setError('Preferred currency is required.');
      setShowErrorModal(true);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const userId = JSON.parse(atob(token.split('.')[1])).id;

      const updatedUser = await updateUserIncomeAndCurrency(token, {
        userId,
        monthlyIncome,
        preferredCurrency: selectedCurrency.value,
      });

      await updateUserOnboardingStatus(token, {
        userId,
        onboardingCompleted: true,
      });

      localStorage.setItem('user', JSON.stringify(updatedUser.user));
      navigate('/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
      setError('An unexpected error occurred');
      setShowErrorModal(true);
    }
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-background p-6 rounded-md shadow-md w-full max-w-md">
        <h1 className="text-xl text-text font-montserrat font-bold mb-4">Welcome to PennyPrise!</h1>
        <p className="text-sm text-textLight font-roboto mb-6">
          Let's get started by setting up your monthly income and preferred currency.
        </p>
        <div className="mb-4">
          <label className="block text-sm text-textLight font-roboto mb-1">Monthly Income</label>
          <input
            type="number"
            placeholder="Enter your monthly income"
            value={monthlyIncome}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMonthlyIncome(e.target.value)}
            className="py-3 px-4 mb-3 w-full bg-background text-[#333333] placeholder-[#777777] border border-secondary rounded-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm text-textLight font-roboto mb-1">Preferred Currency</label>
          <Select
            value={selectedCurrency}
            onChange={(option) => setSelectedCurrency(option as CurrencyOption)}
            options={currencyOptions}
            className="mb-4"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-secondary text-background text-roboto px-4 py-2 rounded-md"
        >
          Get Started
        </button>
      </div>

      {showErrorModal && (
        <ErrorModal
          message={error}
          onClose={handleCloseErrorModal}
        />
      )}
    </div>
  );
};

export default Onboarding;

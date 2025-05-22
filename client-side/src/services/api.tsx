import axios from 'axios';

const API_URL = 'https://pennyrise.onrender.com/api';

// Interfaces for typing
interface UserData {
  email: string;
  password: string;
  [key: string]: any;
}

// Define the types for transactions and budgets
interface ProfileData {
  [key: string]: any;
}

interface BudgetData {
  [key: string]: any;
}

interface TransactionData {
  [key: string]: any;
}

interface SavingsGoalData {
  [key: string]: any;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
}

interface IncomeCurrencyData {
  income: number;
  currency: string;
}

interface OnboardingData {
  completed: boolean;
}

interface ResetData {
  [key: string]: any;
}

// User Authentication
export const registerUser = async (userData: UserData) => {
  const response = await axios.post(`${API_URL}/users/register`, userData);
  return response.data;
};

// Login
export const loginUser = async (userData: UserData) => {
  const response = await axios.post(`${API_URL}/users/login`, userData);
  return response.data;
};

// Password Reset
export const requestPasswordReset = async (email: string) => {
  const response = await axios.post(`${API_URL}/auth/request-password-reset`, { email });
  return response.data;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const response = await axios.post(`${API_URL}/auth/reset-password`, { token, newPassword });
  return response.data;
};

// User Profile
export const getUser = async (token: string) => {
  const response = await axios.get(`${API_URL}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get user by ID
export const updateUserProfile = async (token: string, profileData: ProfileData) => {
  const response = await axios.put(`${API_URL}/users/update-profile`, profileData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update user income and currency
export const updateUserIncomeAndCurrency = async (token: string, incomeCurrencyData: IncomeCurrencyData) => {
  const response = await axios.put(`${API_URL}/users/update-income-currency`, incomeCurrencyData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update user onboarding status
export const updateUserOnboardingStatus = async (token: string, onboardingData: OnboardingData) => {
  const response = await axios.put(`${API_URL}/users/update-onboarding-status`, onboardingData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// change user password
export const changeUserPassword = async (token: string, passwordData: PasswordData) => {
  const response = await axios.put(`${API_URL}/users/change-password`, passwordData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update user profile picture
export const updateUserProfilePicture = async (token: string, formData: FormData) => {
  const response = await axios.put(`${API_URL}/users/update-profile-picture`, formData, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// Budgets
export const createBudget = async (token: string, budgetData: BudgetData) => {
  const response = await axios.post(`${API_URL}/budgets/create`, budgetData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get all budgets
export const getBudgets = async (token: string) => {
  const response = await axios.get(`${API_URL}/budgets`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get budget by ID
export const updateBudget = async (token: string, budgetData: BudgetData) => {
  const response = await axios.put(`${API_URL}/budgets/update`, budgetData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get detailed budget by ID
export const deleteBudget = async (token: string, budgetId: string) => {
  const response = await axios.delete(`${API_URL}/budgets/delete`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { budgetId },
  });
  return response.data;
};

// Transactions
export const createTransaction = async (token: string, transactionData: TransactionData) => {
  const response = await axios.post(`${API_URL}/transactions/create`, transactionData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getTransactions = async (token: string) => {
  const response = await axios.get(`${API_URL}/transactions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteTransaction = async (token: string, transactionId: string) => {
  const response = await axios.delete(`${API_URL}/transactions/delete`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { transactionId },
  });
  return response.data;
};

// Savings Goals
export const createSavingsGoal = async (token: string, savingsGoalData: SavingsGoalData) => {
  const response = await axios.post(`${API_URL}/savings/create`, savingsGoalData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getSavingsGoals = async (token: string) => {
  const response = await axios.get(`${API_URL}/savings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateSavingsGoal = async (token: string, savingsGoalData: SavingsGoalData) => {
  const response = await axios.put(`${API_URL}/savings/update`, savingsGoalData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteSavingsGoal = async (token: string, goalId: string) => {
  const response = await axios.delete(`${API_URL}/savings/delete`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { goalId },
  });
  return response.data;
};

export const resetMonthlyData = async (token: string, data: ResetData) => {
  const response = await axios.put(`${API_URL}/users/reset-monthly-data`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

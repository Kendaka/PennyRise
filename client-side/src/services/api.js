import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; 

// User Authentication
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/users/register`, userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/users/login`, userData);
  return response.data;
};

// Password Reset
export const requestPasswordReset = async (email) => {
  const response = await axios.post(`${API_URL}/auth/request-password-reset`, { email });
  return response.data;
};

export const resetPassword = async (token, newPassword) => {
  const response = await axios.post(`${API_URL}/auth/reset-password`, { token, newPassword });
  return response.data;
};

// User Profile
export const getUser = async (token) => {
  const response = await axios.get(`${API_URL}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateUserProfile = async (token, profileData) => {
  const response = await axios.put(`${API_URL}/users/update-profile`, profileData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateUserIncomeAndCurrency = async (token, incomeCurrencyData) => {
  const response = await axios.put(`${API_URL}/users/update-income-currency`, incomeCurrencyData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateUserOnboardingStatus = async (token, onboardingData) => {
  const response = await axios.put(`${API_URL}/users/update-onboarding-status`, onboardingData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const changeUserPassword = async (token, passwordData) => {
  const response = await axios.put(`${API_URL}/users/change-password`, passwordData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateUserProfilePicture = async (token, formData) => {
  const response = await axios.put(`${API_URL}/users/update-profile-picture`, formData, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// Budgets
export const createBudget = async (token, budgetData) => {
  const response = await axios.post(`${API_URL}/budgets/create`, budgetData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getBudgets = async (token) => {
  const response = await axios.get(`${API_URL}/budgets`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateBudget = async (token, budgetData) => {
  const response = await axios.put(`${API_URL}/budgets/update`, budgetData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteBudget = async (token, budgetId) => {
  const response = await axios.delete(`${API_URL}/budgets/delete`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { budgetId },
  });
  return response.data;
};

// Transactions
export const createTransaction = async (token, transactionData) => {
  const response = await axios.post(`${API_URL}/transactions/create`, transactionData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getTransactions = async (token) => {
  const response = await axios.get(`${API_URL}/transactions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteTransaction = async (token, transactionId) => {
  const response = await axios.delete(`${API_URL}/transactions/delete`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { transactionId },
  });
  return response.data;
};

// Savings Goals
export const createSavingsGoal = async (token, savingsGoalData) => {
  const response = await axios.post(`${API_URL}/savings/create`, savingsGoalData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getSavingsGoals = async (token) => {
  const response = await axios.get(`${API_URL}/savings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateSavingsGoal = async (token, savingsGoalData) => {
  const response = await axios.put(`${API_URL}/savings/update`, savingsGoalData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteSavingsGoal = async (token, goalId) => {
  const response = await axios.delete(`${API_URL}/savings/delete`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { goalId },
  });
  return response.data;
};

export const resetMonthlyData = async (token, data) => {
  const response = await axios.put(`${API_URL}/users/reset-monthly-data`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};



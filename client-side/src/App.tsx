import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import Registration from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Transactions from "./pages/Transactions/Transaction";
import Budgeting from "./pages/Budgeting/Budgeting";
import Savings from "./pages/SavingGoals/Savings";
import Profile from "./pages/Profile/Profile";
import Onboarding from "./pages/Onboarding/Onboarding";

// This file contains the main application component that sets up the routing for the application.
const App: React.FC = () => {

  return (
    <Routes>
      <Route path="/" element={<Home />} /> // Home page
      <Route path="/login" element={<Login />} /> // Login page
      <Route path="/forgot-password" element={<ForgotPassword />} /> // Forgot password page
      <Route path="/reset-password" element={<ResetPassword />} /> // Reset password page
      <Route path="/register" element={<Registration />} /> // Registration page
      <Route path="/dashboard" element={<Dashboard />} /> // Dashboard page
      <Route path="/transactions" element={<Transactions />} /> // Transactions page
      <Route path="/budgeting" element={<Budgeting />} /> // Budgeting page
      <Route path="/savings" element={<Savings />} /> // Savings goals page
      <Route path="/profile" element={<Profile />} /> // Profile page
      <Route path="/onboarding" element={<Onboarding />} /> // Onboarding page
    </Routes>
  );
};

export default App;

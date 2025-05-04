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

const App: React.FC = () => {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/budgeting" element={<Budgeting />} />
      <Route path="/savings" element={<Savings />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/onboarding" element={<Onboarding />} />
    </Routes>
  );
};

export default App;

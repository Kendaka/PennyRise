import React, { useState, useEffect } from 'react';
import DashboardHeader from '../../components/sections/Dashboard/DashboardHeader';
import CurrentBalanceCard from '../../components/sections/Dashboard/CurrentBalanceCard';
import SavingsCard from '../../components/sections/Dashboard/SavingsCard';
import SpendingBreakdown from '../../components/sections/Dashboard/SpendingBreakdown';
import BottomNavBar from '../../components/layouts/BottomNavbar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getUser, getBudgets, getTransactions, getSavingsGoals } from '../../services/api';
import { getCurrencySymbol } from '../../utils/currencyUtils';

// Type definitions
interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  type: string;
}

interface Budget {
  id: string;
  category: string;
  allocated: number;
}

interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  saved: number;
}

interface User {
  id: string;
  username: string;
  email: string;
  monthlyIncome: number;
  preferredCurrency: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [currency, setCurrency] = useState<string>('$');

  // Function to refresh dashboard data
  const refreshDashboardData = async () => {
    try {
      const token = localStorage.getItem('token') || '';

      const userResponse = await getUser(token);
      const budgetsResponse = await getBudgets(token);
      const transactionsResponse = await getTransactions(token);
      const savingsGoalsResponse = await getSavingsGoals(token);

      setUser(userResponse.user);
      setBudgets(budgetsResponse.budgets);
      setTransactions(transactionsResponse.transactions);
      setSavingsGoals(savingsGoalsResponse.savingsGoals);

      if (userResponse.user) {
        setCurrency(getCurrencySymbol(userResponse.user.preferredCurrency));
      }
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    refreshDashboardData();
  }, []);

  if (!user) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  // Calculate total income, expenses, and savings progress
  const totalIncome = user.monthlyIncome;
  const totalExpenses = transactions.reduce((acc, transaction) => acc + transaction.amount, 0); // Calculate total expenses
  const totalBudget = budgets.reduce((acc, budget) => acc + budget.allocated, 0); // Calculate total budget
  const currentBalance = totalIncome - totalExpenses; // Calculate current balance
  const progressPercentage = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0; //  Calculate progress percentage

  // Calculate savings progress
  const totalSaved = savingsGoals.reduce((acc, goal) => acc + goal.saved, 0);
  const totalTarget = savingsGoals.reduce((acc, goal) => acc + goal.target, 0);
  const savingsProgressPercentage = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <BottomNavBar />
      <main className="flex-grow p-4 space-y-4 overflow-y-auto pb-12">
        <DashboardHeader userName={user.username} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 mt-4">
          <div className="space-y-4 mt-8 mb-8">
            <CurrentBalanceCard
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
              currentBalance={currentBalance}
              totalBudget={totalBudget}
              progressPercentage={progressPercentage}
              currency={currency}
            />
            <SavingsCard
              totalSaved={totalSaved}
              totalTarget={totalTarget}
              progressPercentage={savingsProgressPercentage}
              currency={currency}
            />
          </div>
          <div className="flex flex-col justify-start mt-2">
            <SpendingBreakdown
              transactions={transactions}
              budgets={budgets}
              currency={currency}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

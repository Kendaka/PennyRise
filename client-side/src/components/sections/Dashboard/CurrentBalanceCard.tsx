import React from 'react';

interface CurrentBalanceCardProps {
  totalIncome: number;
  totalExpenses: number;
  currentBalance: number;
  totalBudget: number;
  progressPercentage: number;
  currency: string;
}

const CurrentBalanceCard: React.FC<CurrentBalanceCardProps> = ({
  totalIncome,
  totalExpenses,
  currentBalance,
  totalBudget,
  progressPercentage,
  currency,
}) => {
  return (
    <div className="p-4 bg-background rounded-md shadow-lg">
      <p className="text-sm text-text font-bold font-montserrat">Balance</p>
      <p className="text-3xl font-bold font-roboto text-primary mt-1">
        {currency}
        {currentBalance.toLocaleString()}
      </p>

      <div className="mt-6">
        <div className="flex justify-between text-md mb-2">
          <span className="text-text font-roboto">Current Spending</span>
          <span className="text-text font-roboto">
            Total: {currency}
            {totalBudget.toLocaleString()}
          </span>
        </div>
        <div className="relative w-full bg-gray-200 rounded-full h-3">
          <div
            className="absolute top-0 left-0 h-full bg-accent rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="mt-2 text-sm text-textLight font-roboto">
          Spent: {currency}
          {totalExpenses.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default CurrentBalanceCard;

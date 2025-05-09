import React, { useState, useEffect } from 'react';
import { getCurrencySymbol } from '../../../utils/currencyUtils';

// This component is responsible for displaying a summary of savings goals, including total saved and target amounts.
interface SavingsGoal {
  name: string;
  saved: number;
  target: number;
}

interface SavingsSummaryProps {
  savingsGoals: SavingsGoal[];
}

const SavingsSummary: React.FC<SavingsSummaryProps> = ({ savingsGoals }) => {
  const [currency, setCurrency] = useState<string>('$');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user && user.preferredCurrency) {
      setCurrency(getCurrencySymbol(user.preferredCurrency));
    }
  }, []);

  const totalSaved = savingsGoals.reduce((acc, goal) => acc + goal.saved, 0);
  const totalTarget = savingsGoals.reduce((acc, goal) => acc + goal.target, 0);

  return (
    <div className="bg-background p-6 rounded-md shadow-md">
      <h2 className="text-lg text-text font-montserrat font-bold mb-4">Savings Summary</h2>
      <p className="text-text mb-2 font-roboto">
        Total Saved: {currency}{totalSaved.toLocaleString()}
      </p>
      <p className="text-text mb-2 font-roboto">Savings Goals: {savingsGoals.length}</p>
      <p className="text-text font-roboto">
        Total Target: {currency}{totalTarget.toLocaleString()}
      </p>
    </div>
  );
};

export default SavingsSummary;

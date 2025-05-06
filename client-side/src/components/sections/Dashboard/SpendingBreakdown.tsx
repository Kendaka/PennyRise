import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

//  This component displays a pie chart of spending breakdown by category
interface Transaction {
  type: string;
  category: string;
  amount: number;
}

//  This component displays a pie chart of spending breakdown by category
interface Budget {
  category: string;
  allocated: number;
}

// This component displays a pie chart of spending breakdown by category
interface SpendingBreakdownProps {
  transactions: Transaction[];
  budgets: Budget[];
  currency: string;
}

const SpendingBreakdown: React.FC<SpendingBreakdownProps> = ({ transactions, budgets, currency }) => {
  const budgetMap = budgets.reduce<Record<string, number>>((acc, budget) => {
    acc[budget.category] = budget.allocated;
    return acc;
  }, {});

  const expenseMap = transactions.reduce<Record<string, number>>((acc, transaction) => {
    if (transaction.type === 'expense') {
      if (!acc[transaction.category]) {
        acc[transaction.category] = 0;
      }
      acc[transaction.category] += transaction.amount;
    }
    return acc;
  }, {});

  const data = Object.keys(budgetMap).map((category) => ({
    name: category,
    value: expenseMap[category] || 0,
    budget: budgetMap[category],
  }));

  const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

  const totalExpenses = data.reduce((acc, item) => acc + item.value, 0);
  const totalBudget = data.reduce((acc, item) => acc + item.budget, 0);

  if (transactions.length === 0) {
    return (
      <div className="bg-background p-4 rounded-md shadow-md">
        <h3 className="text-lg font-montserrat font-bold text-text mb-4">All expenses</h3>
        <p className="text-textLight font-roboto">No chart to display so far because there are no transactions yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-background p-4 rounded-md shadow-md">
      <h3 className="text-lg font-montserrat font-bold text-text mb-4">All expenses</h3>
      <div className="flex flex-col items-center">
        <div className="flex flex-col md:flex-row md:justify-between w-full mb-4">
          <div className="flex flex-col">
            {data.slice(0, 3).map((entry, index) => (
              <div key={`legend-${index}`} className="flex items-center mb-1">
                <div
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  className="w-4 h-4 mr-2"
                />
                <span className="text-text font-montserrat">
                  {entry.name} ({((entry.value / totalExpenses) * 100).toFixed(0)}%)
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-col">
            {data.slice(3).map((entry, index) => (
              <div key={`legend-${index + 3}`} className="flex items-center mb-1">
                <div
                  style={{ backgroundColor: COLORS[(index + 3) % COLORS.length] }}
                  className="w-4 h-4 mr-2"
                />
                <span className="text-text font-montserrat">
                  {entry.name} ({((entry.value / totalExpenses) * 100).toFixed(0)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
        <PieChart width={300} height={300}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
};

export default SpendingBreakdown;

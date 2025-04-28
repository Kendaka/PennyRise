import React, { useState, useEffect } from 'react';

interface MonthlyIncomeFieldProps {
  initialIncome: number;
  onSave: (income: number) => void;
}

const MonthlyIncomeField: React.FC<MonthlyIncomeFieldProps> = ({ initialIncome, onSave }) => {
  const [monthlyIncome, setMonthlyIncome] = useState(initialIncome);

  useEffect(() => {
    setMonthlyIncome(initialIncome);
  }, [initialIncome]);

  const handleSave = () => {
    onSave(monthlyIncome);
  };

  return (
    <div className="bg-background p-4 rounded-md shadow-md mt-2">
      <h3 className="text-lg text-text font-montserrat font-bold mb-4">Monthly Income</h3>
      <input
        type="number"
        value={monthlyIncome}
        onChange={(e) => setMonthlyIncome(Number(e.target.value))}
        className="py-3 px-4 mb-3 w-full md:w-80 bg-background text-[#333333] placeholder-[#777777] border border-secondary rounded-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
      />
      <div className="flex justify-end mt-2">
        <button
          onClick={handleSave}
          className="bg-secondary text-sm text-background px-3 py-2 font-roboto rounded-lg"
        >
          Save Income
        </button>
      </div>
    </div>
  );
};

export default MonthlyIncomeField;

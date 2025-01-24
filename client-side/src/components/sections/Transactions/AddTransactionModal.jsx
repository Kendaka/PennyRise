import React, { useState } from 'react';
import categories from '../../../utils/categories';

const AddTransactionModal = ({ onAdd, onClose, budgets }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0].name);
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const budget = budgets.find(b => b.category === category);
    if (!budget) {
      setError(`No budget found for category: ${category}`);
      return;
    }

    if (budget.spent + parseFloat(amount) > budget.allocated) {
      setError(`Not enough budget remaining for category: ${category}`);
      return;
    }

    if (name && amount && category && date) {
      onAdd({
        name,
        amount: parseFloat(amount),
        type: 'expense',
        category,
        date,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-background p-6 rounded-md shadow-lg w-96">
        <h3 className="text-lg text-text font-bold font-montserrat mb-4">Add Transaction</h3>
        
        <input
          type="text"
          placeholder="Transaction Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
          className="py-3 px-4 mb-3 w-80 bg-background text-[#333333] placeholder-[#777777] border border-secondary rounded-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          maxLength={15}
          className="py-3 px-4 mb-3 w-80 bg-background text-[#333333] placeholder-[#777777] border border-secondary rounded-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
        />

        <label className="block mb-2 text-textLight font-montserrat font-bold">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="py-3 px-4 mb-3 w-80 bg-background text-[#333333] placeholder-[#777777] border border-secondary rounded-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
        >
          {categories.map((cat, index) => (
            <option key={index} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="py-3 px-4 mb-3 w-80 bg-background text-[#333333] placeholder-[#777777] border border-secondary rounded-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary appearance-none"
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <div className="flex justify-end">
          <button onClick={onClose} className="mr-4 text-text font-roboto">
            Cancel
          </button>
          <button onClick={handleSubmit} className="bg-secondary text-background px-4 py-2 rounded-md">
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionModal;
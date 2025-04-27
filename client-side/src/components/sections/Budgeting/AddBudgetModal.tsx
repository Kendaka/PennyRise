import React, { useState, useEffect } from 'react';

interface Category {
  name: string;
  // Add other properties if your categories have more fields
}

interface BudgetData {
  category: string;
  allocated: number | string;
  limit?: number;
  spent?: number;
}

interface AddBudgetModalProps {
  onSave: (data: { category: string; limit: number }) => void;
  onClose: () => void;
  initialData?: BudgetData;
  existingBudgets: string[];
  remainingBalance: number;
}

// Assuming categories is an array of Category objects
const categories: Category[] = [
  { name: 'Food' },
  { name: 'Transportation' },
  { name: 'Entertainment' },
  // Add other categories as needed
];

const AddBudgetModal: React.FC<AddBudgetModalProps> = ({
  onSave,
  onClose,
  initialData,
  existingBudgets,
  remainingBalance,
}) => {
  const [category, setCategory] = useState<string>(
    initialData?.category || categories[0].name
  );
  const [limit, setLimit] = useState<string | number>(
    initialData?.allocated || ''
  );
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setCategory(initialData.category);
      setLimit(initialData.allocated);
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!limit) {
      setError('This field cannot be empty');
      return;
    }

    const limitNumber = typeof limit === 'string' ? parseFloat(limit) : limit;

    if (isNaN(limitNumber)) {
      setError('Please enter a valid number');
      return;
    }

    if (limitNumber > remainingBalance) {
      setError(`You only have: ${remainingBalance} remaining for adding budgets`);
      return;
    }

    if (existingBudgets.includes(category) && !initialData) {
      setError('A budget for this category already exists. Please update the existing budget.');
      return;
    }

    if (initialData && limitNumber < (initialData.spent || 0)) {
      setError(`The budget limit cannot be less than the amount already spent (${initialData.spent}).`);
      return;
    }

    if (category && limit) {
      onSave({ category, limit: limitNumber });
      onClose();
    }
  };

  return (
    <div>
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-background p-6 rounded-lg shadow-xl w-96">
          <h3 className="text-lg text-text font-bold font-montserrat mb-4">
            {initialData ? 'Edit Budget' : 'Add Budget'}
          </h3>
          <label className="block mb-2 text-textLight font-montserrat font-bold">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="py-3 px-4 mb-3 w-full bg-background text-text border border-secondary rounded-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
            disabled={!!initialData}
          >
            {categories.map((cat, index) => (
              <option key={index} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <label className="block mb-2 text-textLight font-montserrat font-bold">Budget Limit</label>
          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="py-3 px-4 mb-3 w-full bg-background text-text border border-secondary rounded-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
          />
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="mr-4 text-text font-roboto hover:underline focus:outline-none"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-secondary text-white px-4 py-2 rounded-md font-roboto"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBudgetModal;
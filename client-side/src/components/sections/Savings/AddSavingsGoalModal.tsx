import React, { useState } from 'react';

// This component is responsible for adding or editing a savings goal in the application.
interface SavingsGoalData {
  id?: string;
  name: string;
  target: number;
  saved: number;
}

// This component is responsible for adding or editing a savings goal in the application.
interface AddSavingsGoalModalProps {
  onSave: (goal: Omit<SavingsGoalData, 'id'>) => void;
  onClose: () => void;
  initialData?: SavingsGoalData;
  remainingBalance: number;
}
//  // This component is responsible for adding or editing a savings goal in the application.
const AddSavingsGoalModal: React.FC<AddSavingsGoalModalProps> = ({
  onSave,
  onClose,
  initialData,
  remainingBalance
}) => {
  const [name, setName] = useState<string>(initialData?.name || '');
  const [target, setTarget] = useState<string>(initialData?.target?.toString() || '');
  const [saved, setSaved] = useState<string>(initialData?.saved?.toString() || '');
  const [error, setError] = useState<string>('');

  // This function handles the submission of the form. It validates the input values and calls the onSave function with the goal data.
  const handleSubmit = () => {
    const savedAmount = parseFloat(saved) || 0;
    const targetAmount = parseFloat(target) || 0;
    const initialSavedAmount = initialData ? initialData.saved : 0;
    const availableBalance = remainingBalance + initialSavedAmount;

    if (savedAmount > availableBalance) {
      setError(`You only have: ${availableBalance} remaining to spend for the saved amount.`);
      return;
    }

    if (savedAmount > targetAmount) {
      setError(`The saved amount cannot exceed the target amount (${targetAmount}).`);
      return;
    }

    if (name && target) {
      onSave({ name, target: targetAmount, saved: savedAmount });
      onClose();
    }
  };


  // This function handles the closing of the modal.
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-background p-6 rounded-md shadow-lg w-96">
        <h3 className="text-lg tex-text font-bold font-montserrat mb-4">
          {initialData ? 'Edit Goal' : 'Add Goal'}
        </h3>

        <label className="block mb-2 text-textLight font-bold font-montserrat">Goal Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="py-3 px-4 mb-3 w-80 bg-background text-[#333333] placeholder-[#777777] border border-secondary rounded-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
        />

        <label className="block mb-2 text-textLight font-bold font-montserrat">Target Amount</label>
        <input
          type="number"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="py-3 px-4 mb-3 w-80 bg-background text-[#333333] placeholder-[#777777] border border-secondary rounded-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
        />

        <label className="block mb-2 text-textLight font-bold font-montserrat">Saved Amount</label>
        <input
          type="number"
          value={saved}
          onChange={(e) => setSaved(e.target.value)}
          className="py-3 px-4 mb-3 w-80 bg-background text-[#333333] placeholder-[#777777] border border-secondary rounded-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <div className="flex justify-end">
          <button onClick={onClose} className="mr-4 text-textLight font-roboto">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-secondary text-background font-roboto px-4 py-2 rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSavingsGoalModal;
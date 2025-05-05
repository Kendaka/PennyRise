import React from 'react';

// Define prop types
interface ConfirmationModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// ConfirmationModal component
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-md shadow-lg w-72">
        <h3 className="text-lg text-text font-montserrat font-bold mb-4">{message}</h3>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 text-text px-4 py-2 rounded-md font-roboto"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="bg-secondary text-background px-4 py-2 rounded-md font-roboto"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

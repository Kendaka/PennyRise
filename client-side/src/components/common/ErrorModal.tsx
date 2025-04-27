import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

const ErrorModal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-md shadow-lg w-80">
        <div className="flex items-center mb-4">
          <FiAlertCircle className="text-red-500 mr-2" size={24} />
          <h3 className="text-lg text-text font-montserrat font-bold">Error</h3>
        </div>
        <p className="text-text font-roboto mb-4">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-secondary text-background px-4 py-2 rounded-md font-roboto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
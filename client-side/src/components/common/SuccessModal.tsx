import React from 'react';

// Define prop types
interface SuccessModalProps {
  message: string;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-md shadow-lg w-80">
        <h3 className="text-lg text-text font-montserrat font-bold mb-4">Success</h3>
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

export default SuccessModal;

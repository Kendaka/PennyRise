import React from 'react';


// LoadingSpinner component definition
const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="loader"></div>
    </div>
  );
};

export default LoadingSpinner;

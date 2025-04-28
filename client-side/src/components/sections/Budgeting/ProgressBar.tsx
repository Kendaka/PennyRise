import React from 'react';

interface ProgressBarProps {
  value: number;
  color: 'accent' | 'blue'; // You can extend this if you have more color options
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, color }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div
        className={`h-full rounded-full ${color === 'accent' ? 'bg-accent' : 'bg-blue-500'}`} 
        style={{
          width: `${value}%`,
        }}
      ></div>
    </div>
  );
};

export default ProgressBar;

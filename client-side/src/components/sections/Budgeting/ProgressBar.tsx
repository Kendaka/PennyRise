import React from 'react';

interface ProgressBarProps {
  value: number;
  color: 'accent' | 'blue'; // You can expand this if more colors are added later
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, color }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div
        className={`h-full rounded-full ${color === 'accent' ? 'bg-accent' : 'bg-accent'}`}
        style={{
          width: `${value}%`,
        }}
      ></div>
    </div>
  );
};

export default ProgressBar;

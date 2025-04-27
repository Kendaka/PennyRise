import React from 'react';

const ProgressBar = ({ value, color }) => {
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
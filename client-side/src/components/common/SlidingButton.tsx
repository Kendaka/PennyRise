import React from 'react';

// Define prop types
interface SlidingButtonProps {
  text: string;
  onClick: () => void;
}

const SlidingButton: React.FC<SlidingButtonProps> = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative group bg-background text-primary border border-primary font-roboto text-lg md:text-xl lg:text-2xl py-3 md:py-4 lg:py-5 px-10 md:px-12 lg:px-14 rounded-xl overflow-hidden w-64 md:w-72 lg:w-80 flex items-center justify-center"
    >
      <span className="absolute inset-0 bg-secondary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>

      <span className="relative z-10 flex items-center gap-2 group-hover:text-background transition-colors duration-500">
        {text}
      </span>
    </button>
  );
};

export default SlidingButton;

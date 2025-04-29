import React from 'react';

interface TransactionSearchProps {
  onSearch: (query: string) => void;
}

const TransactionSearch: React.FC<TransactionSearchProps> = ({ onSearch }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search transaction's name"
        onChange={(e) => onSearch(e.target.value)}
        className="w-full p-2 rounded-md bg-background text-[#333333] placeholder-[#777777] border border-secondary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
      />
    </div>
  );
};

export default TransactionSearch;

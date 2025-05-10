import React from 'react';

// This component is used to search for transactions by name
interface TransactionSearchProps {
  onSearch: (query: string) => void;
}

// This component renders a search input field
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

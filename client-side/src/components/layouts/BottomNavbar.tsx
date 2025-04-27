import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeIcon, ChartPieIcon, WalletIcon, UserIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import priseLogo from '../../assets/images/prise.png'; 

// Define component type as React.FC with no props
const BottomNavBar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 md:relative md:top-0 w-full bg-background shadow-md border-t md:border-b border-gray-200">
      <div className="flex justify-between items-center py-2 md:py-4 md:pr-8">
        <img src={priseLogo} alt="Prise Logo" className="hidden md:block md:w-24 md:ml-8 lg:w-30 lg:ml-20" />
        <div className="flex justify-around items-center w-full md:w-auto md:justify-end md:space-x-10 md:mt-2 lg:mr-20 xl:mr-24">
          <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center text-gray-600 md:flex-row md:space-x-2 hover:underline">
            <HomeIcon className="w-6 h-6 md:hidden" />
            <span className="text-xs font-roboto font-bold md:text-lg lg:text-xl">Dashboard</span>
          </button>

          <button onClick={() => navigate('/transactions')} className="flex flex-col items-center text-gray-600 md:flex-row md:space-x-2 hover:underline">
            <WalletIcon className="w-6 h-6 md:hidden" />
            <span className="text-xs font-roboto font-bold md:text-lg lg:text-xl">Transactions</span>
          </button>

          <button onClick={() => navigate('/budgeting')} className="flex flex-col items-center text-gray-600 md:flex-row md:space-x-2 hover:underline">
            <ChartPieIcon className="w-6 h-6 md:hidden" />
            <span className="text-xs font-roboto font-bold md:text-lg lg:text-xl">Budgeting</span>
          </button>

          <button onClick={() => navigate('/savings')} className="flex flex-col items-center text-gray-600 md:flex-row md:space-x-2 hover:underline">
            <BanknotesIcon className="w-6 h-6 md:hidden" />
            <span className="text-xs font-roboto font-bold md:text-lg lg:text-xl">Savings</span>
          </button>

          <button onClick={() => navigate('/profile')} className="flex flex-col items-center text-gray-600 md:flex-row md:space-x-2 hover:underline">
            <UserIcon className="w-6 h-6 md:hidden" />
            <span className="text-xs font-roboto font-bold md:text-lg lg:text-xl">Profile</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default BottomNavBar;

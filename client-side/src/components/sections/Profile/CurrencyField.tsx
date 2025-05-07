import React, { useState, useEffect } from 'react';
import Select, { SingleValue } from 'react-select';
import { currencyOptions } from '../../../utils/currencyOptions';

// Define the type for the currency options
interface CurrencyOption {
  value: string;
  label: string;
}

// Define the type for the props of the CurrencyField component
interface CurrencyFieldProps {
  onSave: (currency: CurrencyOption) => void;
}

// Define the CurrencyField component
const CurrencyField: React.FC<CurrencyFieldProps> = ({ onSave }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption>(currencyOptions[0]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user) {
      const userCurrency = currencyOptions.find(option => option.value === user.preferredCurrency);
      setSelectedCurrency(userCurrency || currencyOptions[0]);
    }
  }, []);

  //  Handle the save button click event
  const handleSave = () => {
    onSave(selectedCurrency);
  };

  // Handle the currency selection change event
  const handleCurrencyChange = (newValue: SingleValue<CurrencyOption>) => {
    if (newValue) {
      setSelectedCurrency(newValue);
    }
  };

  return (
    <div className="bg-background p-4 rounded-md shadow-md mt-2">
      <h3 className="text-lg text-text font-montserrat font-bold mb-4">Preferred Currency</h3>
      <Select
        value={selectedCurrency}
        onChange={handleCurrencyChange}
        options={currencyOptions}
        className="mb-4"
      />
      <div className="flex justify-end mt-2">
        <button
          onClick={handleSave}
          className="bg-secondary text-sm text-background px-3 py-2 font-roboto rounded-lg"
        >
          Save Currency
        </button>
      </div>
    </div>
  );
};

export default CurrencyField;
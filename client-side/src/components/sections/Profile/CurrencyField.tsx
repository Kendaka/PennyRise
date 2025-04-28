import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { currencyOptions } from '../../../utils/currencyOptions';

interface CurrencyFieldProps {
  onSave: (currency: { value: string; label: string }) => void;
}

const CurrencyField: React.FC<CurrencyFieldProps> = ({ onSave }) => {
  const [selectedCurrency, setSelectedCurrency] = useState(currencyOptions[0]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user) {
      const userCurrency = currencyOptions.find(option => option.value === user.preferredCurrency);
      setSelectedCurrency(userCurrency || currencyOptions[0]);
    }
  }, []);

  const handleSave = () => {
    onSave(selectedCurrency);
  };

  return (
    <div className="bg-background p-4 rounded-md shadow-md mt-2">
      <h3 className="text-lg text-text font-montserrat font-bold mb-4">Preferred Currency</h3>
      <Select
        value={selectedCurrency}
        onChange={setSelectedCurrency}
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

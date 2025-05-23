// This file contains the currency options for the currency select component.
export interface CurrencyOption {
  value: string;
  label: string;
}

// This array contains the currency options used in the application, each with a value and label.
export const currencyOptions: CurrencyOption[] = [
  { value: 'USD', label: 'USD - $' },
  { value: 'EUR', label: 'EUR - €' },
  { value: 'GBP', label: 'GBP - £' },
  { value: 'JPY', label: 'JPY - ¥' },
  { value: 'AUD', label: 'AUD - A$' },
  { value: 'CAD', label: 'CAD - C$' },
  { value: 'CHF', label: 'CHF - CHF' },
  { value: 'CNY', label: 'CNY - ¥' },
  { value: 'INR', label: 'INR - ₹' },
  { value: 'MXN', label: 'MXN - $' },
  { value: 'BRL', label: 'BRL - R$' },
  { value: 'ZAR', label: 'ZAR - R' },
  { value: 'PHP', label: 'PHP - ₱' },
];

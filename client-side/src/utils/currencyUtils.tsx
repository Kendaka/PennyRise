// This file contains utility functions for handling currency symbols and formatting.

export type CurrencyCode =
  | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD'
  | 'CAD' | 'CHF' | 'CNY' | 'INR' | 'MXN'
  | 'BRL' | 'ZAR' | 'PHP';

const currencySymbols: Record<CurrencyCode, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  AUD: 'A$',
  CAD: 'C$',
  CHF: 'CHF',
  CNY: '¥',
  INR: '₹',
  MXN: '$',
  BRL: 'R$',
  ZAR: 'R',
  PHP: '₱',
};

export const getCurrencySymbol = (currency: string): string => {
  return currencySymbols[currency as CurrencyCode] || '$';
};

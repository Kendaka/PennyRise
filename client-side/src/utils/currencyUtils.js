export const getCurrencySymbol = (currency) => {
    const currencySymbols = {
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
  
    return currencySymbols[currency] || '$';
};
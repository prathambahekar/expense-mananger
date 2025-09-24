import React, { createContext, useState, useMemo, useContext, PropsWithChildren } from 'react';
import { CURRENCIES } from '../constants';

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  formatCurrency: (valueInUsd: number) => string;
  // FIX: Add currencySymbol and convertToUsd to the context type.
  currencySymbol: string;
  convertToUsd: (valueInCurrentCurrency: number) => number;
}

export const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

type CurrencyProviderProps = PropsWithChildren<{}>;

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [currency, setCurrency] = useState('INR'); // Default to INR

  // FIX: Move all currency-dependent logic inside useMemo and provide the new values.
  const value = useMemo(() => {
    const selectedCurrency = CURRENCIES.find(c => c.code === currency) || CURRENCIES.find(c => c.code === 'USD')!;

    const formatCurrency = (valueInUsd: number) => {
      const convertedValue = valueInUsd * selectedCurrency.rate;
      return `${selectedCurrency.symbol}${convertedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const convertToUsd = (valueInCurrentCurrency: number) => {
      if (selectedCurrency.rate === 0) return 0;
      return valueInCurrentCurrency / selectedCurrency.rate;
    };

    const currencySymbol = selectedCurrency.symbol;

    return {
      currency,
      setCurrency,
      formatCurrency,
      currencySymbol,
      convertToUsd,
    };
  }, [currency]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
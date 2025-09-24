import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = {
    code: string;
    symbol: string;
    name: string;
};

const AVAILABLE_CURRENCIES: Currency[] = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' }
];

type SettingsContextType = {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    availableCurrencies: Currency[];
};

const defaultCurrency = AVAILABLE_CURRENCIES[0]; // INR is the default

const SettingsContext = createContext<SettingsContextType>({
    currency: defaultCurrency,
    setCurrency: () => { },
    availableCurrencies: AVAILABLE_CURRENCIES,
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currency, setCurrency] = useState<Currency>(defaultCurrency);

    useEffect(() => {
        const savedCurrency = localStorage.getItem('SEM_CURRENCY');
        if (savedCurrency) {
            const parsed = JSON.parse(savedCurrency);
            const found = AVAILABLE_CURRENCIES.find(c => c.code === parsed.code);
            if (found) {
                setCurrency(found);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('SEM_CURRENCY', JSON.stringify(currency));
    }, [currency]);

    return (
        <SettingsContext.Provider value={{
            currency,
            setCurrency,
            availableCurrencies: AVAILABLE_CURRENCIES
        }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
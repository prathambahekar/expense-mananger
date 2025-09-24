export const formatCurrency = (amount: number, currencyCode: string): string => {
    const localeMap: { [key: string]: string } = {
        'INR': 'en-IN',
        'USD': 'en-US',
        'EUR': 'en-EU',
        'GBP': 'en-GB'
    };

    return new Intl.NumberFormat(localeMap[currencyCode] || 'en-IN', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(amount);
};
export const getMeQueryKey = "getMe"; export const useGetMe = () => ({ data: null, isLoading: false });
import React, { createContext, useContext, useState } from 'react';

export type Currency = 'USD' | 'MAD';

const USD_TO_MAD = 10.2;

type CurrencyContextType = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (usdPrice: number) => string;
  symbol: string;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    return (localStorage.getItem('app-currency') as Currency) || 'USD';
  });

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('app-currency', c);
  };

  const formatPrice = (usdPrice: number): string => {
    if (currency === 'MAD') {
      const mad = usdPrice * USD_TO_MAD;
      return `${mad.toFixed(2)} MAD`;
    }
    return `$${usdPrice.toFixed(2)}`;
  };

  const symbol = currency === 'MAD' ? 'MAD' : '$';

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, symbol }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}

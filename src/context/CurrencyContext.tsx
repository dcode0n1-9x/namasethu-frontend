"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  CurrencyCode,
  CurrencyConfig,
  CURRENCY_CONFIG,
  formatCompactMoney,
  formatFullMoney,
  formatListingMoney,
  getCorridorCurrency,
} from "@/lib/currency";

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  activeConfig: CurrencyConfig;
  formatCompact: (rupees: number) => string;
  formatFull: (rupees: number) => string;
  formatListing: (paise: string | number, mode: "BUY" | "RENT", compact?: boolean) => string;
  syncForLocation: (location: string) => void;
}

const STORAGE_KEY = "amberstone_currency_pref";

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>("INR");

  // Hydrate from localStorage once mounted
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
      if (saved && CURRENCY_CONFIG[saved]) {
        setCurrencyState(saved);
      }
    } catch {
      // Ignore localStorage read errors in restricted contexts
    }
  }, []);

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(STORAGE_KEY, c);
    } catch {
      // Ignore write errors
    }
  };

  const syncForLocation = (location: string) => {
    const target = getCorridorCurrency(location);
    setCurrency(target);
  };

  const value: CurrencyContextValue = {
    currency,
    setCurrency,
    activeConfig: CURRENCY_CONFIG[currency],
    formatCompact: (rupees: number) => formatCompactMoney(rupees, currency),
    formatFull: (rupees: number) => formatFullMoney(rupees, currency),
    formatListing: (paise: string | number, mode: "BUY" | "RENT", compact = true) =>
      formatListingMoney(paise, mode, currency, compact),
    syncForLocation,
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export function useCurrency(): CurrencyContextValue {
  const context = useContext(CurrencyContext);
  if (!context) {
    // Fallback safe value for standalone components or test environments
    return {
      currency: "INR",
      setCurrency: () => {},
      activeConfig: CURRENCY_CONFIG.INR,
      formatCompact: (rupees: number) => formatCompactMoney(rupees, "INR"),
      formatFull: (rupees: number) => formatFullMoney(rupees, "INR"),
      formatListing: (paise: string | number, mode: "BUY" | "RENT", compact = true) =>
        formatListingMoney(paise, mode, "INR", compact),
      syncForLocation: () => {},
    };
  }
  return context;
}

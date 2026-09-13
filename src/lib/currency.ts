/**
 * Global Multi-Currency Formatting Engine
 * Seamless conversion and localized formatting across AED, INR, USD, and EUR.
 */

export type CurrencyCode = "INR" | "AED" | "USD" | "EUR";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  corridor: "INDIA" | "DUBAI" | "GLOBAL";
  native: string;
}

export const CURRENCY_CONFIG: Record<CurrencyCode, CurrencyConfig> = {
  INR: {
    code: "INR",
    symbol: "₹",
    label: "Indian Rupee",
    corridor: "INDIA",
    native: "₹ (INR)",
  },
  AED: {
    code: "AED",
    symbol: "AED",
    label: "UAE Dirham",
    corridor: "DUBAI",
    native: "د.إ (AED)",
  },
  USD: {
    code: "USD",
    symbol: "$",
    label: "US Dollar",
    corridor: "GLOBAL",
    native: "$ (USD)",
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    label: "Euro",
    corridor: "GLOBAL",
    native: "€ (EUR)",
  },
};

/** Canonical exchange rates: INR per 1 unit of foreign currency. */
export const INR_EXCHANGE_RATES: Record<CurrencyCode, number> = {
  INR: 1.0,
  AED: 22.80, // 1 AED = 22.80 INR
  USD: 83.75, // 1 USD = 83.75 INR
  EUR: 91.50, // 1 EUR = 91.50 INR
};

const PAISE_PER_RUPEE = 100;
const RUPEES_PER_LAKH = 1_00_000;
const RUPEES_PER_CRORE = 1_00_00_000;

export const paiseToRupees = (paise: string | number): number => {
  const num = Number(paise);
  return Number.isFinite(num) ? num / PAISE_PER_RUPEE : 0;
};

/**
 * Converts an INR amount to a specified target currency.
 */
export function convertINR(rupees: number, targetCurrency: CurrencyCode): number {
  if (!Number.isFinite(rupees)) return 0;
  if (targetCurrency === "INR") return rupees;
  const rate = INR_EXCHANGE_RATES[targetCurrency];
  return rupees / rate;
}

/**
 * Converts a target currency amount into INR.
 */
export function convertToINR(amount: number, fromCurrency: CurrencyCode): number {
  if (!Number.isFinite(amount)) return 0;
  if (fromCurrency === "INR") return amount;
  return amount * INR_EXCHANGE_RATES[fromCurrency];
}

/**
 * Converts an amount from one currency to another.
 */
export function convertBetween(amount: number, from: CurrencyCode, to: CurrencyCode): number {
  if (from === to) return amount;
  const inr = convertToINR(amount, from);
  return convertINR(inr, to);
}

/**
 * Formats a currency value with localized compact notation:
 * - INR: ₹1.92 Cr / ₹48.5 L / ₹80,000 / -₹1.50 Cr
 * - AED: AED 1.92M / AED 485K / AED 80,000 / -AED 1.50M
 * - USD: $1.92M / $485K / $80,000 / -$1.50M
 * - EUR: €1.92M / €485K / €80,000 / -€1.50M
 */
export function formatCompactMoney(rupees: number, currency: CurrencyCode = "INR"): string {
  const sym = CURRENCY_CONFIG[currency]?.symbol || (currency === "INR" ? "₹" : "$");
  const prefix = currency === "AED" ? `${sym} ` : sym;

  if (!Number.isFinite(rupees)) {
    return `${prefix}0`;
  }

  const isNegative = rupees < 0;
  const absRupees = Math.abs(rupees);
  const sign = isNegative ? "-" : "";

  if (currency === "INR") {
    if (absRupees >= RUPEES_PER_CRORE) return `${sign}₹${(absRupees / RUPEES_PER_CRORE).toFixed(2)} Cr`;
    if (absRupees >= RUPEES_PER_LAKH) return `${sign}₹${(absRupees / RUPEES_PER_LAKH).toFixed(2)} L`;
    return `${sign}₹${Math.round(absRupees).toLocaleString("en-IN")}`;
  }

  const converted = convertINR(absRupees, currency);

  if (converted >= 1_000_000) {
    return `${sign}${prefix}${(converted / 1_000_000).toFixed(2)}M`;
  }
  if (converted >= 1_000) {
    return `${sign}${prefix}${(converted / 1_000).toFixed(1)}K`;
  }
  return `${sign}${prefix}${Math.round(converted).toLocaleString("en-US")}`;
}

/**
 * Formats a full currency value with localized digit grouping.
 */
export function formatFullMoney(rupees: number, currency: CurrencyCode = "INR"): string {
  const sym = CURRENCY_CONFIG[currency]?.symbol || (currency === "INR" ? "₹" : "$");
  const prefix = currency === "AED" ? `${sym} ` : sym;

  if (!Number.isFinite(rupees)) {
    return `${prefix}0`;
  }

  const isNegative = rupees < 0;
  const absRupees = Math.abs(rupees);
  const sign = isNegative ? "-" : "";

  if (currency === "INR") {
    return `${sign}₹${Math.round(absRupees).toLocaleString("en-IN")}`;
  }
  const converted = convertINR(absRupees, currency);
  return `${sign}${prefix}${Math.round(converted).toLocaleString("en-US")}`;
}

/**
 * Formats a listing price (from paise or rupees) in the desired currency, appending /mo for rentals.
 */
export function formatListingMoney(
  amountPaise: string | number,
  mode: "BUY" | "RENT",
  currency: CurrencyCode = "INR",
  compact = true
): string {
  const rupees = paiseToRupees(amountPaise);
  if (mode === "RENT") {
    return `${formatFullMoney(rupees, currency)}/mo`;
  }
  return compact ? formatCompactMoney(rupees, currency) : formatFullMoney(rupees, currency);
}

/**
 * Detects whether a locality, city, or node belongs to the Dubai corridor or Indian corridor.
 */
export function detectCorridor(location: string): "DUBAI" | "INDIA" {
  const lower = (location || "").toLowerCase();
  const dubaiKeywords = [
    "dubai",
    "uae",
    "downtown",
    "palm jumeirah",
    "marina",
    "business bay",
    "difc",
    "dubai hills",
    "jlt",
    "jumeirah",
    "creek",
    "meydan",
    "al barsha",
    "burj",
    "emaar",
    "emirates",
    "abu dhabi",
    "sharjah",
    "sobha",
    "deira",
  ];
  if (dubaiKeywords.some((kw) => lower.includes(kw))) {
    return "DUBAI";
  }
  return "INDIA";
}

/**
 * Returns default corridor currency for auto-sync.
 */
export function getCorridorCurrency(corridorOrLocation: string): CurrencyCode {
  const corridor = detectCorridor(corridorOrLocation);
  return corridor === "DUBAI" ? "AED" : "INR";
}

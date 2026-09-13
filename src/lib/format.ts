export * from "./currency";

import { paiseToRupees, formatCompactMoney, formatFullMoney, formatListingMoney } from "./currency";

/** ₹1.92 Cr / ₹48.5 L / ₹80,000 — Indian compact notation. */
export function formatCompactINR(rupees: number): string {
  return formatCompactMoney(rupees, "INR");
}

/** ₹6,500 — full Indian digit grouping. */
export const formatINR = (rupees: number): string => formatFullMoney(rupees, "INR");

/** Formats a paise amount for a listing, appending "/mo" for rentals. */
export function formatListingAmount(paise: string | number, mode: "BUY" | "RENT"): string {
  return formatListingMoney(paise, mode, "INR");
}

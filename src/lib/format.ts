const PAISE_PER_RUPEE = 100;
const RUPEES_PER_LAKH = 1_00_000;
const RUPEES_PER_CRORE = 1_00_00_000;

export const paiseToRupees = (paise: string | number): number => Number(paise) / PAISE_PER_RUPEE;

/** ₹1.92 Cr / ₹48.5 L / ₹80,000 — Indian compact notation. */
export function formatCompactINR(rupees: number): string {
  if (rupees >= RUPEES_PER_CRORE) return `₹${(rupees / RUPEES_PER_CRORE).toFixed(2)} Cr`;
  if (rupees >= RUPEES_PER_LAKH) return `₹${(rupees / RUPEES_PER_LAKH).toFixed(2)} L`;
  return `₹${Math.round(rupees).toLocaleString("en-IN")}`;
}

/** ₹6,500 — full Indian digit grouping. */
export const formatINR = (rupees: number): string => `₹${Math.round(rupees).toLocaleString("en-IN")}`;

/** Formats a paise amount for a listing, appending "/mo" for rentals. */
export function formatListingAmount(paise: string | number, mode: "BUY" | "RENT"): string {
  const rupees = paiseToRupees(paise);
  return mode === "RENT" ? `${formatINR(rupees)}/mo` : formatCompactINR(rupees);
}

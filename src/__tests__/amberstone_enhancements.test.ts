import { describe, it, expect } from "bun:test";
import {
  convertINR,
  convertToINR,
  convertBetween,
  formatCompactMoney,
  formatFullMoney,
  formatListingMoney,
  detectCorridor,
  getCorridorCurrency,
  paiseToRupees,
} from "@/lib/currency";
import { DUAL_CORRIDOR_LOCALITIES } from "@/components/navigation/ExpandablePillSearch";

describe("Global Multi-Currency Formatting Engine", () => {
  const ONE_CRORE_RUPEES = 10_000_000;
  const FIFTY_LAKHS_RUPEES = 5_000_000;
  const SEVENTY_FIVE_THOUSAND_RUPEES = 75_000;

  it("should accurately convert INR to target foreign currencies", () => {
    // 1 AED = 22.80 INR
    const aed = convertINR(2_280_000, "AED");
    expect(Math.round(aed)).toBe(100_000);

    // 1 USD = 83.75 INR
    const usd = convertINR(8_375_000, "USD");
    expect(Math.round(usd)).toBe(100_000);

    // 1 EUR = 91.50 INR
    const eur = convertINR(9_150_000, "EUR");
    expect(Math.round(eur)).toBe(100_000);
  });

  it("should convert between non-INR currencies seamlessly", () => {
    // Convert 10,000 USD to AED via INR canonical base
    const aed = convertBetween(10_000, "USD", "AED");
    expect(aed).toBeGreaterThan(30_000);
    expect(aed).toBeLessThan(45_000);
  });

  it("should format compact representations correctly across all four currencies", () => {
    // INR compact notation
    expect(formatCompactMoney(ONE_CRORE_RUPEES, "INR")).toBe("₹1.00 Cr");
    expect(formatCompactMoney(FIFTY_LAKHS_RUPEES, "INR")).toBe("₹50.00 L");
    expect(formatCompactMoney(SEVENTY_FIVE_THOUSAND_RUPEES, "INR")).toBe("₹75,000");

    // AED compact notation (AED 10M INR / 22.80 = ~438.5K AED)
    const aedFormatted = formatCompactMoney(ONE_CRORE_RUPEES, "AED");
    expect(aedFormatted).toContain("AED");

    // USD compact notation
    const usdFormatted = formatCompactMoney(ONE_CRORE_RUPEES, "USD");
    expect(usdFormatted).toContain("$");

    // EUR compact notation
    const eurFormatted = formatCompactMoney(ONE_CRORE_RUPEES, "EUR");
    expect(eurFormatted).toContain("€");
  });

  it("should format rental listing amounts with /mo across currencies", () => {
    const rentPaise = "7500000"; // ₹75,000
    const inrRent = formatListingMoney(rentPaise, "RENT", "INR");
    expect(inrRent).toContain("/mo");
    expect(inrRent).toContain("₹75,000");

    const aedRent = formatListingMoney(rentPaise, "RENT", "AED");
    expect(aedRent).toContain("/mo");
    expect(aedRent).toContain("AED");
  });

  it("should detect corridor and auto-resolve appropriate default currency", () => {
    expect(detectCorridor("Downtown Dubai")).toBe("DUBAI");
    expect(detectCorridor("Palm Jumeirah")).toBe("DUBAI");
    expect(detectCorridor("DIFC Gate Precinct")).toBe("DUBAI");
    expect(detectCorridor("Dubai Hills Estate")).toBe("DUBAI");
    expect(detectCorridor("Business Bay")).toBe("DUBAI");
    expect(detectCorridor("Burj Crown")).toBe("DUBAI");
    expect(detectCorridor("Emaar Beachfront")).toBe("DUBAI");
    expect(detectCorridor("Abu Dhabi Marina")).toBe("DUBAI");

    expect(detectCorridor("HSR Layout, Bengaluru")).toBe("INDIA");
    expect(detectCorridor("Lower Parel, Mumbai")).toBe("INDIA");
    expect(detectCorridor("Kalyani Nagar, Pune")).toBe("INDIA");
    expect(detectCorridor("DLF Phase 5, Gurgaon")).toBe("INDIA");

    expect(getCorridorCurrency("Downtown Dubai")).toBe("AED");
    expect(getCorridorCurrency("Burj Khalifa")).toBe("AED");
    expect(getCorridorCurrency("Bengaluru")).toBe("INR");
  });

  it("should format negative money values cleanly across currencies", () => {
    // Negative compact INR
    expect(formatCompactMoney(-15_000_000, "INR")).toBe("-₹1.50 Cr");
    expect(formatCompactMoney(-5_000_000, "INR")).toBe("-₹50.00 L");
    expect(formatCompactMoney(-50_000, "INR")).toBe("-₹50,000");

    // Negative full money
    expect(formatFullMoney(-5_000, "INR")).toBe("-₹5,000");
    expect(formatFullMoney(-5_000, "USD")).toBe("-$60");
    expect(formatFullMoney(-5_000, "AED")).toBe("-AED 219");
    expect(formatFullMoney(-5_000, "EUR")).toBe("-€55");
  });

  it("should handle non-finite and edge case inputs gracefully", () => {
    expect(formatCompactMoney(NaN, "INR")).toBe("₹0");
    expect(formatCompactMoney(Infinity, "USD")).toBe("$0");
    expect(formatFullMoney(NaN, "AED")).toBe("AED 0");
    expect(convertINR(NaN, "USD")).toBe(0);
    expect(convertToINR(NaN, "USD")).toBe(0);
    expect(paiseToRupees("")).toBe(0);
    expect(paiseToRupees(undefined as unknown as string)).toBe(0);
  });
});

describe("Dual-Corridor Locality Intelligence", () => {
  it("should include all required Dubai Prime nodes with micro-market tags and inventory counts", () => {
    const dubaiNodes = DUAL_CORRIDOR_LOCALITIES.filter((l) => l.corridor === "Dubai Prime");
    expect(dubaiNodes.length).toBeGreaterThanOrEqual(6);

    const names = dubaiNodes.map((d) => d.name);
    expect(names).toContain("Downtown Dubai");
    expect(names).toContain("Palm Jumeirah");
    expect(names).toContain("Dubai Marina");
    expect(names).toContain("Business Bay");
    expect(names).toContain("DIFC");
    expect(names).toContain("Dubai Hills Estate");

    for (const node of dubaiNodes) {
      expect(node.defaultCurrency).toBe("AED");
      expect(node.inventoryCount).toBeGreaterThan(0);
      expect(node.microMarketTag.length).toBeGreaterThan(5);
    }
  });

  it("should include Indian Metros spanning Mumbai, Bengaluru, Pune, and NCR", () => {
    const indiaNodes = DUAL_CORRIDOR_LOCALITIES.filter((l) => l.corridor === "Indian Metros");
    expect(indiaNodes.length).toBeGreaterThanOrEqual(10);

    const metros = new Set(indiaNodes.map((n) => n.metroArea));
    expect(metros.has("Mumbai")).toBe(true);
    expect(metros.has("Bengaluru")).toBe(true);
    expect(metros.has("Pune")).toBe(true);
    expect(metros.has("NCR")).toBe(true);

    for (const node of indiaNodes) {
      expect(node.defaultCurrency).toBe("INR");
      expect(node.inventoryCount).toBeGreaterThan(0);
      expect(node.microMarketTag.length).toBeGreaterThan(5);
    }
  });
});

describe("Ownership Lens Net Yield Mathematics & Multi-Currency Price Band", () => {
  it("should calculate correct gross and net yield metrics", () => {
    const propertyPrice = 20_000_000; // 2 Cr
    const monthlyRent = 80_000;
    const annualGrossRent = monthlyRent * 12; // 9,60,000

    const grossYield = (annualGrossRent / propertyPrice) * 100;
    expect(grossYield).toBe(4.8);

    const vacancyRate = 0.05; // 5%
    const effectiveRent = annualGrossRent * (1 - vacancyRate); // 9,12,000

    const annualMaintenance = 10_000 * 12; // 1,20,000
    const annualTax = propertyPrice * 0.005; // 1,00,000
    const mgmtFee = effectiveRent * 0.04; // 36,480
    const totalCarry = annualMaintenance + annualTax + mgmtFee; // 2,56,480

    const netAnnualCashflow = effectiveRent - totalCarry; // 6,55,520
    const netYield = (netAnnualCashflow / propertyPrice) * 100;

    expect(netYield).toBeCloseTo(3.28, 2);
    expect(netYield).toBeLessThan(grossYield);
  });

  it("should support custom multi-currency formatters in priceComparison", () => {
    const mockProperty: any = {
      pricePaise: "2000000000", // 2 Cr INR
      listingMode: "BUY",
      valuation: {
        fairMarketPricePaise: "1950000000", // 1.95 Cr INR
        differencePercentage: 2.5,
      },
    };

    // Default INR formatter
    const { priceComparison } = require("@/components/pdp/ValuationCard");
    const inrComp = priceComparison(mockProperty);
    expect(inrComp.format(inrComp.fair)).toContain("₹");

    // Foreign currency formatter (AED)
    const formatAED = (rupees: number) => formatCompactMoney(rupees, "AED");
    const aedComp = priceComparison(mockProperty, formatAED);
    expect(aedComp.format(aedComp.fair)).toContain("AED");
  });

  it("should handle 0 property price and negative net cashflows without NaN", () => {
    const propertyPrice = 0;
    const grossYield = propertyPrice > 0 ? (120000 / propertyPrice) * 100 : 0;
    expect(grossYield).toBe(0);

    const negativeCashflow = -50000;
    const formattedNegative = formatCompactMoney(negativeCashflow, "AED");
    expect(formattedNegative).toContain("-AED");
  });
});

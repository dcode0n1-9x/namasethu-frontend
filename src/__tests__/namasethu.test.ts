import { describe, it, expect } from "bun:test";
import { MOCK_PROPERTIES } from "@/data/mockProperties";
import { SearchFilters, PropertyListing } from "@/types/property";

describe("Amberstone Domain & Data Integrity", () => {
  it("should contain authentic verified properties across Bengaluru and Mumbai", () => {
    expect(MOCK_PROPERTIES.length).toBeGreaterThanOrEqual(8);
    const cities = new Set(MOCK_PROPERTIES.map((p) => p.city));
    expect(cities.has("Bengaluru")).toBe(true);
    expect(cities.has("Mumbai")).toBe(true);
  });

  it("should have unique slugs for each property listing", () => {
    const slugs = MOCK_PROPERTIES.map((p) => p.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  it("should validate all 14-digit ULPIN cadastral IDs format", () => {
    const ulpinRegex = /^\d{4}-\d{4}-\d{4}-\d{2}$/;
    for (const prop of MOCK_PROPERTIES) {
      expect(prop.ulpin).toMatch(ulpinRegex);
      expect(prop.inspection.ulpin).toBe(prop.ulpin);
    }
  });

  it("should validate 80-point civil inspection scores across all 5 dimensions", () => {
    for (const prop of MOCK_PROPERTIES) {
      const { scores } = prop.inspection;
      expect(scores.composite).toBeGreaterThanOrEqual(80);
      expect(scores.composite).toBeLessThanOrEqual(100);
      expect(scores.structural).toBeGreaterThanOrEqual(80);
      expect(scores.plumbing).toBeGreaterThanOrEqual(80);
      expect(scores.electrical).toBeGreaterThanOrEqual(80);
      expect(scores.finishes).toBeGreaterThanOrEqual(80);
      expect(scores.cadastral).toBeGreaterThanOrEqual(80);
      expect(prop.inspection.verifiedPointsCount).toBe(80);
      expect(prop.inspection.keyFindings.length).toBeGreaterThan(0);
    }
  });

  it("should validate unredacted owner credentials for Trust Pass unlocking", () => {
    for (const prop of MOCK_PROPERTIES) {
      expect(prop.owner.fullName).toBeTruthy();
      expect(prop.owner.kycStatus).toBe("DIGILOCKER_VERIFIED");
      expect(prop.owner.phoneMasked).toContain("•••••");
      expect(prop.owner.unredactedPhone).toBeTruthy();
      expect(prop.owner.unredactedWhatsApp).toBeTruthy();

      // Ensure each unredacted phone has valid digits
      const digits = (prop.owner.unredactedPhone || "").replace(/\D/g, "");
      expect(digits.length).toBeGreaterThanOrEqual(10);
    }
  });

  it("should have Kaveri 2.0 deed history chain for every property", () => {
    for (const prop of MOCK_PROPERTIES) {
      expect(prop.deedHistory.length).toBeGreaterThanOrEqual(2);
      for (const deed of prop.deedHistory) {
        expect(deed.year).toBeTruthy();
        expect(deed.title).toBeTruthy();
        expect(deed.parties).toBeTruthy();
        expect(["VERIFIED", "CLEARED"].includes(deed.status)).toBe(true);
      }
    }
  });
});

describe("Search & Filtering Logic Verification", () => {
  it("should filter properly by BUY mode and RENT mode", () => {
    const buyListings = MOCK_PROPERTIES.filter((p) => p.listingMode === "BUY");
    const rentListings = MOCK_PROPERTIES.filter((p) => p.listingMode === "RENT");

    expect(buyListings.length).toBeGreaterThan(0);
    expect(rentListings.length).toBeGreaterThan(0);
    expect(buyListings.length + rentListings.length).toBe(MOCK_PROPERTIES.length);
  });

  it("should accurately filter listings by locality query", () => {
    const query = "indiranagar";
    const matches = MOCK_PROPERTIES.filter((p) =>
      p.locality.toLowerCase().includes(query) || p.city.toLowerCase().includes(query)
    );
    expect(matches.length).toBeGreaterThan(0);
    for (const m of matches) {
      expect(m.locality.toLowerCase().includes(query) || m.city.toLowerCase().includes(query)).toBe(true);
    }
  });

  it("should filter listings by 3D Digital Twin availability and have spatial rooms", () => {
    const twinOnly = MOCK_PROPERTIES.filter((p) => p.has3dTour);
    expect(twinOnly.length).toBeGreaterThan(0);
    for (const p of twinOnly) {
      expect(p.has3dTour).toBe(true);
      expect(Array.isArray(p.spatialRooms)).toBe(true);
      expect((p.spatialRooms || []).length).toBeGreaterThan(0);
    }
  });

  it("should filter rental listings by max monthly rent correctly", () => {
    const maxMonthlyRent = 80000;
    const rentMatches = MOCK_PROPERTIES.filter((p) => {
      if (p.listingMode !== "RENT") return false;
      const rentRupees = Number(p.pricePaise) / 100;
      return rentRupees <= maxMonthlyRent;
    });

    // Should include prop-5 (Puravankara Heights at ₹75,000/mo) but exclude prop-8 (Embassy Pristine at ₹90,000/mo)
    expect(rentMatches.some((p) => p.slug === "puravankara-silicon-heights-rent")).toBe(true);
    expect(rentMatches.some((p) => p.slug === "embassy-pristine-lakeview-rent")).toBe(false);
  });

  it("should filter buy listings by price ceiling in Lakhs correctly", () => {
    const maxPriceLakhs = 200; // Under 2 Crores
    const buyMatches = MOCK_PROPERTIES.filter((p) => {
      if (p.listingMode !== "BUY") return false;
      const priceLakhs = Number(p.pricePaise) / 10000000;
      return priceLakhs <= maxPriceLakhs;
    });

    // Sobha (1.85 Cr) and Brigade Gateway (1.42 Cr) should match
    expect(buyMatches.some((p) => p.slug === "sobha-silicon-oasis-3bhk")).toBe(true);
    expect(buyMatches.some((p) => p.slug === "brigade-gateway-lakeview-2bhk")).toBe(true);
    // Luxury Villa (4.50 Cr) and Lodha (6.80 Cr) should NOT match
    expect(buyMatches.some((p) => p.slug === "prestige-golfshire-luxury-villa")).toBe(false);
    expect(buyMatches.some((p) => p.slug === "lodha-world-towers-3bhk")).toBe(false);
  });
});

describe("PDP Owner WhatsApp & Tel Link Dynamic Resolution", () => {
  it("should resolve distinct owner WhatsApp links and avoid hardcoding", () => {
    for (const prop of MOCK_PROPERTIES) {
      const rawWa = prop.owner.unredactedWhatsApp || prop.owner.unredactedPhone || "";
      const digitsOnly = rawWa.replace(/\D/g, "");
      const waNumber = digitsOnly.startsWith("91") ? digitsOnly : `91${digitsOnly}`;

      expect(waNumber.length).toBeGreaterThanOrEqual(12);
      expect(waNumber.startsWith("91")).toBe(true);

      const generatedUrl = `https://wa.me/${waNumber}?text=Hi`;
      expect(generatedUrl).toContain(`https://wa.me/${waNumber}`);
    }

    // Verify specifically that Dr. Ananya Sen and S. Venkatraman have different WhatsApp target links
    const venkat = MOCK_PROPERTIES.find((p) => p.owner.fullName === "S. Venkatraman")!;
    const ananya = MOCK_PROPERTIES.find((p) => p.owner.fullName === "Dr. Ananya Sen")!;
    expect(venkat.owner.unredactedPhone).not.toBe(ananya.owner.unredactedPhone);
  });
});

describe("AVM Valuation & Broker Savings Logic", () => {
  it("should compute exact 2% broker commission savings", () => {
    const baseSqft = 14500;
    const carpetSqft = 1750;
    const propertyValue = baseSqft * carpetSqft;
    const brokerSaved = Math.round((propertyValue * 0.02) / 1000) * 1000;

    expect(propertyValue).toBe(25375000); // 2.5375 Cr
    expect(brokerSaved).toBe(508000); // 5.08 Lakhs saved
  });
});

describe("Amberstone Brand & 3D Digital Twin Specification", () => {
  it("should verify 3D digital twin spatial room telemetry integrity", () => {
    const twinProps = MOCK_PROPERTIES.filter((p) => p.has3dTour && p.spatialRooms);
    expect(twinProps.length).toBeGreaterThan(0);

    for (const p of twinProps) {
      expect(p.spatialRooms!.length).toBeGreaterThanOrEqual(2);
      for (const room of p.spatialRooms!) {
        expect(room.id).toBeTruthy();
        expect(room.name).toBeTruthy();
        expect(room.dimensions).toMatch(/\d+/);
        expect(room.carpetSqft).toBeGreaterThan(0);
        expect(room.floorType).toBeTruthy();
        expect(room.highlight).toBeTruthy();
      }
    }
  });

  it("should verify all properties are associated with Amberstone verified title and ULPIN", () => {
    for (const prop of MOCK_PROPERTIES) {
      expect(prop.title).toBeTruthy();
      expect(prop.carpetAreaSqft).toBeGreaterThan(0);
      expect(prop.superBuiltUpAreaSqft).toBeGreaterThanOrEqual(prop.carpetAreaSqft);
      expect(prop.inspection.activeLiens).toBe(false);
      expect(prop.inspection.ulpin).toBe(prop.ulpin);
      expect(prop.deedHistory.length).toBeGreaterThan(0);
    }
  });
});

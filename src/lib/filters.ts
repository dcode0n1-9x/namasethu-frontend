import { ListingMode, PropertyCategory, PropertyListing, SearchFilters } from "@/types/property";

/** Sentinels meaning "no ceiling" for the budget sliders. */
export const ANY_PRICE_LAKHS = 1000;
export const ANY_RENT_RUPEES = 200000;

export const INITIAL_FILTERS: SearchFilters = {
  mode: "BUY",
  query: "",
  city: "",
  locality: "",
  category: "ALL",
  timeline: "",
  bhk: [],
  propertyType: [],
  minPriceLakhs: 0,
  maxPriceLakhs: ANY_PRICE_LAKHS,
  maxRentRupees: ANY_RENT_RUPEES,
  facing: [],
  waterSupply: [],
  minTrustScore: 0,
  only3D: false,
  onlyDirectOwner: false,
};

export function filterProperties(
  properties: PropertyListing[],
  mode: ListingMode,
  category: PropertyCategory,
  filters: SearchFilters,
): PropertyListing[] {
  const query = filters.locality.toLowerCase().trim();

  return properties.filter((prop) => {
    if (mode === "RENT" && prop.listingMode !== "RENT") return false;
    if (mode === "BUY" && prop.listingMode !== "BUY") return false;
    if (mode === "3D_TWINS" && !prop.has3dTour) return false;

    if (category !== "ALL" && !prop.category.includes(category)) return false;

    if (
      query &&
      !(
        prop.locality.toLowerCase().includes(query) ||
        prop.city.toLowerCase().includes(query) ||
        prop.title.toLowerCase().includes(query) ||
        prop.ulpin.includes(query)
      )
    ) {
      return false;
    }

    if (filters.bhk.length > 0 && !filters.bhk.includes(prop.configuration)) return false;
    if (filters.propertyType.length > 0 && !filters.propertyType.includes(prop.propertyType)) return false;

    if (prop.listingMode === "BUY" && filters.maxPriceLakhs < ANY_PRICE_LAKHS) {
      const priceLakhs = Number(prop.pricePaise) / 10000000;
      if (priceLakhs > filters.maxPriceLakhs) return false;
    }
    if (prop.listingMode === "RENT" && filters.maxRentRupees && filters.maxRentRupees < ANY_RENT_RUPEES) {
      if (Number(prop.pricePaise) / 100 > filters.maxRentRupees) return false;
    }

    if (filters.minTrustScore > 0 && prop.trustScore < filters.minTrustScore) return false;
    if (filters.only3D && !prop.has3dTour) return false;
    if (filters.onlyDirectOwner && !prop.verifiedOwnerBadge) return false;
    if (filters.facing.length > 0 && !filters.facing.includes(prop.facing)) return false;
    if (filters.waterSupply.length > 0 && !filters.waterSupply.includes(prop.waterSupply)) return false;

    return true;
  });
}

export function countActiveFilters(filters: SearchFilters): number {
  return [
    filters.bhk.length > 0,
    filters.propertyType.length > 0,
    filters.maxPriceLakhs < ANY_PRICE_LAKHS,
    !!filters.maxRentRupees && filters.maxRentRupees < ANY_RENT_RUPEES,
    filters.minTrustScore > 0,
    filters.only3D,
    filters.onlyDirectOwner,
    filters.facing.length > 0,
    filters.waterSupply.length > 0,
  ].filter(Boolean).length;
}

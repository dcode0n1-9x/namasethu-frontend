export type ListingMode = "BUY" | "RENT" | "3D_TWINS" | "NEW_PROJECTS";

export type PropertyCategory =
  | "ALL"
  | "DIRECT_OWNER"
  | "DIGITAL_TWIN"
  | "TOP_AVM_DEALS"
  | "TRUST_PASS_ELITE"
  | "GATED_COMMUNITIES"
  | "RERA_APPROVED"
  | "VILLAS_PLOTS"
  | "HIGH_RENTAL_YIELD";

export interface InspectionScores {
  composite: number; // 0 to 100
  structural: number; // RCC, load bearing, NDT concrete
  plumbing: number; // moisture, dampness meter, zero leaks
  electrical: number; // DB panel, earth pit resistance
  finishes: number; // woodwork, glass, waterproofing
  cadastral: number; // 30-year deed chain, EC Form 15, ULPIN match
}

export interface InspectionDetail {
  id: string;
  inspectorName: string;
  inspectionDate: string;
  scores: InspectionScores;
  verifiedPointsCount: number; // e.g. 80
  seepageDetected: boolean;
  activeLiens: boolean;
  reraRegNumber?: string;
  ulpin: string; // 14-digit Unique Land Parcel Identification Number
  summary: string;
  keyFindings: Array<{
    category: string;
    status: "PASS" | "OPTIMAL" | "ATTENTION";
    detail: string;
  }>;
  pdfUrl?: string;
}

export interface ValuationData {
  fairMarketPricePaise: string; // Algorithmic AVM (LightGBM)
  listedPricePaise: string;
  differencePercentage: number; // e.g., -2.5% (buyer discount)
  marketPosition: "BELOW_AVM" | "FAIR_MARKET" | "PREMIUM";
  grossYieldPercentage?: number; // e.g. 4.8%
  monthlyRentalEstimatePaise?: string;
  projected5YrAppreciation: string;
  historicalTransactionsCount: number;
}

export interface DeedEvent {
  year: string;
  eventType: "SALE_DEED" | "KHATA_TRANSFER" | "ENCUMBRANCE_CLEARED" | "ULPIN_SEEDED" | "INSPECTION_AUDIT";
  title: string;
  parties: string;
  volumeNumber?: string;
  status: "VERIFIED" | "CLEARED";
  documentUrl?: string;
}

export interface SpatialRoom {
  id: string;
  name: string;
  dimensions: string; // e.g. "21' x 15'"
  carpetSqft: number;
  highlight: string;
  wallColor: string;
  floorType: string;
}

export interface OwnerProfile {
  id: string;
  fullName: string;
  avatarUrl: string;
  kycStatus: "DIGILOCKER_VERIFIED" | "PENDING";
  joinedDate: string;
  responseTime: string;
  phoneMasked: string;
  unredactedPhone?: string;
  unredactedWhatsApp?: string;
}

export interface PropertyListing {
  id: string;
  slug: string;
  title: string;
  locality: string;
  city: string;
  state: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  listingMode: "BUY" | "RENT";
  category: PropertyCategory[];
  propertyType: "Apartment" | "Villa" | "Penthouse" | "Independent Floor";
  configuration: "1 BHK" | "2 BHK" | "3 BHK" | "4 BHK" | "5+ BHK";
  bathrooms: number;
  carpetAreaSqft: number;
  superBuiltUpAreaSqft: number;
  floor: string; // e.g. "8th of 14 Floors"
  facing: "East" | "North-East" | "North" | "West" | "South";
  waterSupply: "Cauvery + Borewell" | "Cauvery Direct" | "Borewell + RO";
  pricePaise: string;
  formattedPrice: string; // e.g. "₹1.85 Cr" or "₹65,000/mo"
  pricePerSqft?: string; // e.g. "₹10,000 / sq.ft"
  maintenanceMonthlyPaise?: string;
  stampDutyEstimate?: string;
  registrationEstimate?: string;
  
  // Visuals
  images: string[];
  has3dTour: boolean;
  spatialRooms?: SpatialRoom[];

  // Trust & Verification
  trustScore: number; // 0-100 (Airbnb rating equivalent 4.92)
  verifiedOwnerBadge: boolean;
  topBadge?: string; // e.g. "Top 1% Trust Score", "Owner Verified", "5% Below AVM"
  inspection: InspectionDetail;
  valuation: ValuationData;
  deedHistory: DeedEvent[];
  owner: OwnerProfile;

  // Highlights & Specs
  amenities: string[];
  neighbourhood: {
    metroDistanceMeters: number;
    schoolsNearby: string[];
    hospitalNearby: string;
    waterSecurityIndex: string; // e.g. "High (92/100)"
  };
  availableFrom: string; // e.g. "Ready to Move" | "Immediate"
  ulpin: string;
  reraNumber?: string;
}

export interface SearchFilters {
  mode: ListingMode;
  query: string;
  city: string;
  locality: string;
  category: PropertyCategory;
  timeline: string;
  bhk: string[];
  propertyType: string[];
  minPriceLakhs: number;
  maxPriceLakhs: number;
  maxRentRupees?: number;
  facing: string[];
  waterSupply: string[];
  minTrustScore: number;
  only3D: boolean;
  onlyDirectOwner: boolean;
}

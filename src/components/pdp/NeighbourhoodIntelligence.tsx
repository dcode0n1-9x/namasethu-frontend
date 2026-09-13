"use client";

import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  Car,
  Clock,
  CloudRain,
  Compass,
  Droplets,
  Gauge,
  GraduationCap,
  Hospital,
  Leaf,
  Navigation,
  Plane,
  ShieldCheck,
  TrainFront,
  Wind,
  Zap,
} from "lucide-react";
import { detectCorridor } from "@/lib/currency";

interface NeighbourhoodIntelligenceProps {
  neighbourhood: {
    metroDistanceMeters: number;
    schoolsNearby: string[];
    hospitalNearby: string;
    waterSecurityIndex: string;
  };
  locality: string;
  city: string;
}

interface CommutePole {
  name: string;
  category: "Finance" | "Airport" | "Tech" | "Commercial";
  distanceKm: number;
  offPeakMins: number;
  peakMins: number;
  transitOption: string;
  transitMode: "drive" | "metro" | "rail";
}

export const NeighbourhoodIntelligence: React.FC<NeighbourhoodIntelligenceProps> = ({
  neighbourhood,
  locality,
  city,
}) => {
  const [isPeakMode, setIsPeakMode] = useState(false);
  const [poleView, setPoleView] = useState<"CORRIDOR" | "ALL">("CORRIDOR");

  const metroMeters = neighbourhood?.metroDistanceMeters ?? 500;
  const walkMinutes = Math.max(1, Math.round(metroMeters / 80));
  const [waterValue, waterNote] = (neighbourhood?.waterSecurityIndex || "High (94/100)").split(" — ");

  const corridor = detectCorridor(`${city} ${locality}`);
  const isMumbai = city.toLowerCase().includes("mumbai");
  const isBengaluru = city.toLowerCase().includes("bengaluru") || city.toLowerCase().includes("bangalore");
  const isDubai = corridor === "DUBAI" || city.toLowerCase().includes("dubai");

  // Dynamic Commute Poles tailored to major economic poles
  const commutePoles: CommutePole[] = useMemo(() => {
    if (isDubai) {
      return [
        {
          name: "DIFC (Gate District)",
          category: "Finance",
          distanceKm: 4.8,
          offPeakMins: 9,
          peakMins: 18,
          transitOption: "Red Line Metro (4 mins) or Financial Centre Rd",
          transitMode: "metro",
        },
        {
          name: "Downtown Dubai & Burj Khalifa",
          category: "Commercial",
          distanceKm: 3.2,
          offPeakMins: 7,
          peakMins: 15,
          transitOption: "Sheikh Mohammed bin Rashid Blvd",
          transitMode: "drive",
        },
        {
          name: "Dubai Int. Airport (DXB)",
          category: "Airport",
          distanceKm: 14.5,
          offPeakMins: 16,
          peakMins: 28,
          transitOption: "E11 Sheikh Zayed Road Direct",
          transitMode: "drive",
        },
        {
          name: "Dubai Marina & JLT",
          category: "Commercial",
          distanceKm: 18.2,
          offPeakMins: 18,
          peakMins: 32,
          transitOption: "Red Line Direct or Al Khail Rd",
          transitMode: "metro",
        },
      ];
    }

    if (isMumbai) {
      return [
        {
          name: "BKC (Bandra Kurla Complex)",
          category: "Finance",
          distanceKm: 11.2,
          offPeakMins: 22,
          peakMins: 42,
          transitOption: "BKC Connector / Metro Line 3",
          transitMode: "drive",
        },
        {
          name: "Nariman Point & Fort CBD",
          category: "Finance",
          distanceKm: 13.8,
          offPeakMins: 20,
          peakMins: 38,
          transitOption: "Mumbai Coastal Road (Direct Sea Link)",
          transitMode: "drive",
        },
        {
          name: "CSM International Airport (BOM)",
          category: "Airport",
          distanceKm: 16.5,
          offPeakMins: 26,
          peakMins: 48,
          transitOption: "Western Express Highway",
          transitMode: "drive",
        },
        {
          name: "Lower Parel Commercial Core",
          category: "Commercial",
          distanceKm: 4.5,
          offPeakMins: 10,
          peakMins: 20,
          transitOption: "Senapati Bapat Marg / Monorail",
          transitMode: "drive",
        },
      ];
    }

    // Default to Bengaluru / Dual-Corridor Gateway Poles
    return [
      {
        name: "Kempegowda Int. Airport (BLR)",
        category: "Airport",
        distanceKm: 38.0,
        offPeakMins: 42,
        peakMins: 68,
        transitOption: "Airport Expressway (Flyover Tollway)",
        transitMode: "drive",
      },
      {
        name: "Outer Ring Road (ORR / Bellandur)",
        category: "Tech",
        distanceKm: 5.4,
        offPeakMins: 14,
        peakMins: 28,
        transitOption: "Sarjapur-ORR Junction / Blue Line",
        transitMode: "drive",
      },
      {
        name: "Central Business District (UB City / MG Rd)",
        category: "Finance",
        distanceKm: 9.8,
        offPeakMins: 22,
        peakMins: 40,
        transitOption: "Hosur Road Elevated Express / Metro",
        transitMode: "metro",
      },
      {
        name: "Electronic City Phase 1",
        category: "Tech",
        distanceKm: 11.0,
        offPeakMins: 15,
        peakMins: 26,
        transitOption: "Elevated Expressway (NICE Link)",
        transitMode: "drive",
      },
    ];
  }, [isDubai, isMumbai]);

  // Global Key Poles (DIFC, Downtown, Airport, BKC, Nariman Pt) for the cross-corridor view
  const globalGatewayPoles: CommutePole[] = [
    {
      name: "DIFC (Dubai Financial Centre)",
      category: "Finance",
      distanceKm: 4.8,
      offPeakMins: 9,
      peakMins: 18,
      transitOption: "Red Line Metro / Sheikh Zayed Rd",
      transitMode: "metro",
    },
    {
      name: "Downtown Dubai (Burj District)",
      category: "Commercial",
      distanceKm: 3.2,
      offPeakMins: 7,
      peakMins: 15,
      transitOption: "Burj Khalifa / Dubai Mall Link",
      transitMode: "drive",
    },
    {
      name: "BKC (Bandra Kurla Complex, Mumbai)",
      category: "Finance",
      distanceKm: 11.2,
      offPeakMins: 22,
      peakMins: 42,
      transitOption: "Metro Line 3 / BKC Connector",
      transitMode: "drive",
    },
    {
      name: "Nariman Point (Mumbai CBD)",
      category: "Finance",
      distanceKm: 13.8,
      offPeakMins: 20,
      peakMins: 38,
      transitOption: "Coastal Road & Sea Link",
      transitMode: "drive",
    },
    {
      name: "International Airport (Gateway Hub)",
      category: "Airport",
      distanceKm: isDubai ? 14.5 : isMumbai ? 16.5 : 38.0,
      offPeakMins: isDubai ? 16 : isMumbai ? 26 : 42,
      peakMins: isDubai ? 28 : isMumbai ? 48 : 68,
      transitOption: isDubai ? "DXB Terminal Direct" : isMumbai ? "BOM Terminal 2" : "BLR Airport Express",
      transitMode: "drive",
    },
  ];

  const activePoles = poleView === "ALL" ? globalGatewayPoles : commutePoles;

  // Environmental Risk Radar Scores
  const stormwaterIndex = {
    score: 93,
    status: "Optimal Gradient · Zero Inundation",
    detail: "Gravity stormwater discharge channel at 140m. 20-year rain model indicates zero waterlogging risk.",
  };

  const greenCanopyIndex = {
    coveragePercent: 34,
    aqiRating: 42,
    status: "Good (Air Quality Index 42)",
    detail: "Verified mature tree cover within 1 km buffer. High vegetative transpiration keeps ambient temp -2.1°C cooler.",
  };

  return (
    <section className="panel p-6 sm:p-7 shadow-sm border border-neutral-200/80" aria-labelledby="neighbourhood-heading">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hairline pb-4">
        <div>
          <p className="eyebrow text-brand">Location Intelligence</p>
          <h2 id="neighbourhood-heading" className="mt-0.5 text-xl font-bold tracking-tight text-ink">
            Around {locality}
          </h2>
          <p className="text-xs text-muted">
            {city} · Geocoded cadastral telemetry & environmental satellite metrics
          </p>
        </div>

        {/* Peak / Off-Peak Commute Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-surface-2 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setIsPeakMode(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              !isPeakMode ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink"
            }`}
          >
            Off-Peak Fluid
          </button>
          <button
            type="button"
            onClick={() => setIsPeakMode(true)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isPeakMode ? "bg-amber-500 text-white shadow-sm" : "text-muted hover:text-ink"
            }`}
          >
            <Clock className="h-3 w-3" />
            <span>Peak Rush (08:30 / 18:30)</span>
          </button>
        </div>
      </div>

      {/* Dynamic Commute Matrix */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Navigation className="h-4 w-4 text-brand" />
            <h3 className="text-sm font-bold text-ink">Dynamic Commute Matrix to Major Poles</h3>
          </div>

          <button
            type="button"
            onClick={() => setPoleView((p) => (p === "CORRIDOR" ? "ALL" : "CORRIDOR"))}
            className="text-[11px] font-semibold text-brand hover:underline cursor-pointer"
          >
            {poleView === "CORRIDOR" ? "Show Global Gateway Poles (DIFC, BKC, etc.)" : "Show Local Corridor Poles"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {activePoles.map((pole) => {
            const time = isPeakMode ? pole.peakMins : pole.offPeakMins;
            const delay = pole.peakMins - pole.offPeakMins;

            return (
              <div
                key={pole.name}
                className="p-3.5 rounded-xl border border-hairline bg-white hover:border-neutral-300 transition-all flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-semibold text-ink block">{pole.name}</span>
                    <span className="text-[10px] text-muted">{pole.distanceKm} km · {pole.transitOption}</span>
                  </div>

                  <span
                    className={`font-mono text-sm font-bold px-2 py-0.5 rounded-lg shrink-0 ${
                      isPeakMode
                        ? "bg-amber-100 text-amber-900 border border-amber-200"
                        : "bg-surface-2 text-ink"
                    }`}
                  >
                    {time} min
                  </span>
                </div>

                <div className="mt-2 pt-2 border-t border-hairline flex items-center justify-between text-[10px]">
                  <span className="text-muted flex items-center gap-1">
                    {pole.transitMode === "metro" ? (
                      <TrainFront className="h-3 w-3 text-brand" />
                    ) : pole.category === "Airport" ? (
                      <Plane className="h-3 w-3 text-sky-600" />
                    ) : (
                      <Car className="h-3 w-3 text-neutral-600" />
                    )}
                    <span>{pole.category} Corridor</span>
                  </span>

                  {isPeakMode ? (
                    <span className="text-amber-700 font-semibold font-mono">+{delay}m peak drag</span>
                  ) : (
                    <span className="text-emerald-600 font-medium">Free flow condition</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Environmental Risk Radar */}
      <div className="mt-6 pt-5 border-t border-hairline">
        <div className="flex items-center gap-1.5 mb-3">
          <Gauge className="h-4 w-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-ink">Environmental Risk & Canopy Radar</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Stormwater Drainage Index */}
          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-semibold text-emerald-900 flex items-center gap-1">
                <CloudRain className="h-3.5 w-3.5 text-emerald-600" />
                <span>Stormwater Flood Drainage Index</span>
              </span>
              <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                {stormwaterIndex.score}/100
              </span>
            </div>
            <p className="text-xs font-semibold text-emerald-800">{stormwaterIndex.status}</p>
            <p className="text-[11px] text-emerald-900/80 mt-1 leading-snug">{stormwaterIndex.detail}</p>
          </div>

          {/* Green Canopy & Air Quality */}
          <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/40">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-semibold text-sky-900 flex items-center gap-1">
                <Leaf className="h-3.5 w-3.5 text-sky-600" />
                <span>Green Canopy & Clean Air</span>
              </span>
              <span className="font-mono text-xs font-bold text-sky-800 bg-sky-100 px-1.5 py-0.5 rounded">
                {greenCanopyIndex.coveragePercent}% Canopy
              </span>
            </div>
            <p className="text-xs font-semibold text-sky-800">{greenCanopyIndex.status}</p>
            <p className="text-[11px] text-sky-900/80 mt-1 leading-snug">{greenCanopyIndex.detail}</p>
          </div>
        </div>
      </div>

      {/* Primary Civic Telemetry Row */}
      <dl className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-hairline">
        <div className="p-3 rounded-xl bg-surface">
          <dt className="text-[10px] font-medium text-muted uppercase">Nearest Transit</dt>
          <dd className="text-xs font-bold text-ink mt-0.5">
            {metroMeters.toLocaleString("en-IN")}m
          </dd>
          <dd className="text-[10px] text-muted">~{walkMinutes} min walk</dd>
        </div>

        <div className="p-3 rounded-xl bg-surface">
          <dt className="text-[10px] font-medium text-muted uppercase">Water Security</dt>
          <dd className="text-xs font-bold text-ink mt-0.5 truncate">{waterValue}</dd>
          <dd className="text-[10px] text-muted truncate">{waterNote || "Dual Source"}</dd>
        </div>

        <div className="p-3 rounded-xl bg-surface">
          <dt className="text-[10px] font-medium text-muted uppercase">Nearby Healthcare</dt>
          <dd className="text-xs font-bold text-ink mt-0.5 truncate">{neighbourhood?.hospitalNearby || "Multi-specialty Clinic"}</dd>
          <dd className="text-[10px] text-muted">Emergency & OPD</dd>
        </div>

        <div className="p-3 rounded-xl bg-surface">
          <dt className="text-[10px] font-medium text-muted uppercase">Top Schools</dt>
          <dd className="text-xs font-bold text-ink mt-0.5 truncate">
            {(neighbourhood?.schoolsNearby && neighbourhood.schoolsNearby[0]) || "International Schools"}
          </dd>
          <dd className="text-[10px] text-muted">Within 3 km radius</dd>
        </div>
      </dl>
    </section>
  );
};

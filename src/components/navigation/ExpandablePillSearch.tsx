"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Calendar,
  Compass,
  DollarSign,
  Globe2,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { SearchFilters } from "@/types/property";
import { ANY_PRICE_LAKHS, ANY_RENT_RUPEES } from "@/lib/filters";
import { useCurrency } from "@/context/CurrencyContext";
import { CurrencyCode, getCorridorCurrency } from "@/lib/currency";

interface ExpandablePillSearchProps {
  filters: SearchFilters;
  onSearch: (updatedFilters: Partial<SearchFilters>) => void;
}

type Tab = "where" | "timeline" | "budget";
type CorridorFilter = "ALL" | "Dubai Prime" | "Indian Metros";

export interface CorridorLocality {
  name: string;
  city: string;
  metroArea: "Dubai" | "Mumbai" | "Bengaluru" | "Pune" | "NCR";
  corridor: "Dubai Prime" | "Indian Metros";
  inventoryCount: number;
  microMarketTag: string;
  defaultCurrency: CurrencyCode;
}

export const DUAL_CORRIDOR_LOCALITIES: CorridorLocality[] = [
  // Dubai Prime Nodes
  {
    name: "Downtown Dubai",
    city: "Dubai",
    metroArea: "Dubai",
    corridor: "Dubai Prime",
    inventoryCount: 42,
    microMarketTag: "Burj & Opera District · Prime Freehold",
    defaultCurrency: "AED",
  },
  {
    name: "Palm Jumeirah",
    city: "Dubai",
    metroArea: "Dubai",
    corridor: "Dubai Prime",
    inventoryCount: 18,
    microMarketTag: "Waterfront Villas · Ultra-Luxury Trophy",
    defaultCurrency: "AED",
  },
  {
    name: "Dubai Marina",
    city: "Dubai",
    metroArea: "Dubai",
    corridor: "Dubai Prime",
    inventoryCount: 56,
    microMarketTag: "Marina Promenade · 7.8% Gross Rental Yield",
    defaultCurrency: "AED",
  },
  {
    name: "Business Bay",
    city: "Dubai",
    metroArea: "Dubai",
    corridor: "Dubai Prime",
    inventoryCount: 39,
    microMarketTag: "Marasi Canal · Corporate Tech Epicenter",
    defaultCurrency: "AED",
  },
  {
    name: "DIFC",
    city: "Dubai",
    metroArea: "Dubai",
    corridor: "Dubai Prime",
    inventoryCount: 24,
    microMarketTag: "Gate Precinct · Blue-Chip Financial Freezone",
    defaultCurrency: "AED",
  },
  {
    name: "Dubai Hills Estate",
    city: "Dubai",
    metroArea: "Dubai",
    corridor: "Dubai Prime",
    inventoryCount: 31,
    microMarketTag: "Championship Golf Course · Family Prime",
    defaultCurrency: "AED",
  },

  // Indian Metros - Mumbai
  {
    name: "Lower Parel",
    city: "Mumbai",
    metroArea: "Mumbai",
    corridor: "Indian Metros",
    inventoryCount: 28,
    microMarketTag: "Financial Core · Lodha & World Towers",
    defaultCurrency: "INR",
  },
  {
    name: "BKC",
    city: "Mumbai",
    metroArea: "Mumbai",
    corridor: "Indian Metros",
    inventoryCount: 19,
    microMarketTag: "Central Business District · Diplomatic Enclave",
    defaultCurrency: "INR",
  },
  {
    name: "Borivali East",
    city: "Mumbai",
    metroArea: "Mumbai",
    corridor: "Indian Metros",
    inventoryCount: 15,
    microMarketTag: "National Park Vista · Western Express Transit",
    defaultCurrency: "INR",
  },

  // Indian Metros - Bengaluru
  {
    name: "HSR Layout",
    city: "Bengaluru",
    metroArea: "Bengaluru",
    corridor: "Indian Metros",
    inventoryCount: 34,
    microMarketTag: "Tech Unicorn Hub · Yellow Line Metro",
    defaultCurrency: "INR",
  },
  {
    name: "Indiranagar",
    city: "Bengaluru",
    metroArea: "Bengaluru",
    corridor: "Indian Metros",
    inventoryCount: 22,
    microMarketTag: "100ft Road Lifestyle · Purple Line Metro",
    defaultCurrency: "INR",
  },
  {
    name: "Whitefield",
    city: "Bengaluru",
    metroArea: "Bengaluru",
    corridor: "Indian Metros",
    inventoryCount: 48,
    microMarketTag: "ITPB Corridor · High Rental Yield",
    defaultCurrency: "INR",
  },
  {
    name: "Koramangala",
    city: "Bengaluru",
    metroArea: "Bengaluru",
    corridor: "Indian Metros",
    inventoryCount: 26,
    microMarketTag: "Agara Lakefront · Startup Ecosystem",
    defaultCurrency: "INR",
  },
  {
    name: "Malleshwaram",
    city: "Bengaluru",
    metroArea: "Bengaluru",
    corridor: "Indian Metros",
    inventoryCount: 16,
    microMarketTag: "Heritage Greenery · Orion Mall Enclave",
    defaultCurrency: "INR",
  },
  {
    name: "Devanahalli",
    city: "Bengaluru",
    metroArea: "Bengaluru",
    corridor: "Indian Metros",
    inventoryCount: 20,
    microMarketTag: "Aerotropolis Corridor · Prestige Golfshire",
    defaultCurrency: "INR",
  },

  // Indian Metros - Pune
  {
    name: "Kalyani Nagar",
    city: "Pune",
    metroArea: "Pune",
    corridor: "Indian Metros",
    inventoryCount: 17,
    microMarketTag: "Koregaon Park Node · Mula-Mutha Riverside",
    defaultCurrency: "INR",
  },
  {
    name: "Baner",
    city: "Pune",
    metroArea: "Pune",
    corridor: "Indian Metros",
    inventoryCount: 25,
    microMarketTag: "Hinjawadi IT Expressway · High-Rise Core",
    defaultCurrency: "INR",
  },

  // Indian Metros - NCR
  {
    name: "DLF Phase 5",
    city: "NCR / Gurgaon",
    metroArea: "NCR",
    corridor: "Indian Metros",
    inventoryCount: 21,
    microMarketTag: "Golf Course Road · Super-Luxury High-Rise",
    defaultCurrency: "INR",
  },
  {
    name: "Noida Expressway",
    city: "NCR / Noida",
    metroArea: "NCR",
    corridor: "Indian Metros",
    inventoryCount: 33,
    microMarketTag: "Sector 128 · Institutional & Tech Belts",
    defaultCurrency: "INR",
  },
];

const TIMELINES = [
  { label: "Ready to move", desc: "Inspection complete, keys available now" },
  { label: "Within 30 days", desc: "Current tenancy ending or registration pending" },
  { label: "Under construction", desc: "RERA / DLD registered, milestone payments" },
];

const BHK_OPTIONS = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"];

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "where", label: "Where", icon: <MapPin className="h-4 w-4" /> },
  { id: "timeline", label: "Move-in", icon: <Calendar className="h-4 w-4" /> },
  { id: "budget", label: "Size & budget", icon: <SlidersHorizontal className="h-4 w-4" /> },
];

export const ExpandablePillSearch: React.FC<ExpandablePillSearchProps> = ({ filters, onSearch }) => {
  const { currency, setCurrency, formatCompact, syncForLocation } = useCurrency();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("where");
  const [whereInput, setWhereInput] = useState(filters.locality || "");
  const [selectedTimeline, setSelectedTimeline] = useState(filters.timeline || "");
  const [selectedBhk, setSelectedBhk] = useState<string[]>(filters.bhk || []);
  const [maxBudgetLakhs, setMaxBudgetLakhs] = useState(filters.maxPriceLakhs || ANY_PRICE_LAKHS);
  const [maxRentRupees, setMaxRentRupees] = useState(filters.maxRentRupees || ANY_RENT_RUPEES);
  const [corridorFilter, setCorridorFilter] = useState<CorridorFilter>("ALL");
  const [lastAutoSyncedCurrency, setLastAutoSyncedCurrency] = useState<CurrencyCode | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const isRentMode = filters.mode === "RENT";

  useEffect(() => {
    setWhereInput(filters.locality || "");
    setSelectedTimeline(filters.timeline || "");
    setSelectedBhk(filters.bhk || []);
    if (filters.maxPriceLakhs) setMaxBudgetLakhs(filters.maxPriceLakhs);
    if (filters.maxRentRupees) setMaxRentRupees(filters.maxRentRupees);
  }, [filters]);

  useEffect(() => {
    if (!isExpanded) return;
    const handlePointer = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsExpanded(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsExpanded(false);
    };
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isExpanded]);

  const openAt = (tab: Tab) => {
    setActiveTab(tab);
    setIsExpanded(true);
  };

  const handleApplySearch = () => {
    if (whereInput.trim()) {
      syncForLocation(whereInput.trim());
      setLastAutoSyncedCurrency(getCorridorCurrency(whereInput.trim()));
    }
    onSearch({
      locality: whereInput,
      timeline: selectedTimeline,
      bhk: selectedBhk,
      maxPriceLakhs: maxBudgetLakhs,
      maxRentRupees,
    });
    setIsExpanded(false);
  };

  const handleReset = () => {
    setWhereInput("");
    setSelectedTimeline("");
    setSelectedBhk([]);
    setMaxBudgetLakhs(ANY_PRICE_LAKHS);
    setMaxRentRupees(ANY_RENT_RUPEES);
    setLastAutoSyncedCurrency(null);
    onSearch({ locality: "", timeline: "", bhk: [], maxPriceLakhs: ANY_PRICE_LAKHS, maxRentRupees: ANY_RENT_RUPEES });
  };

  const handleSelectLocality = (loc: CorridorLocality) => {
    setWhereInput(loc.name);
    // Auto-sync currency based on the selected corridor node
    setCurrency(loc.defaultCurrency);
    setLastAutoSyncedCurrency(loc.defaultCurrency);
    setActiveTab("timeline");
  };

  const toggleBhk = (bhk: string) =>
    setSelectedBhk((prev) => (prev.includes(bhk) ? prev.filter((b) => b !== bhk) : [...prev, bhk]));

  const filteredLocalities = useMemo(() => {
    const q = whereInput.trim().toLowerCase();
    return DUAL_CORRIDOR_LOCALITIES.filter((loc) => {
      // Corridor tab filter
      if (corridorFilter !== "ALL" && loc.corridor !== corridorFilter) {
        return false;
      }
      // Query filter
      if (!q) return true;
      return (
        loc.name.toLowerCase().includes(q) ||
        loc.city.toLowerCase().includes(q) ||
        loc.metroArea.toLowerCase().includes(q) ||
        loc.microMarketTag.toLowerCase().includes(q) ||
        loc.corridor.toLowerCase().includes(q)
      );
    });
  }, [whereInput, corridorFilter]);

  const budgetDisplay = isRentMode
    ? maxRentRupees >= ANY_RENT_RUPEES
      ? "Any rent"
      : `Up to ${formatCompact(maxRentRupees)}/mo`
    : maxBudgetLakhs >= ANY_PRICE_LAKHS
      ? "Any budget"
      : `Up to ${formatCompact(maxBudgetLakhs * 100000)}`;

  const sizeBudgetDisplay = selectedBhk.length > 0 ? `${selectedBhk.join(", ")} · ${budgetDisplay}` : budgetDisplay;

  return (
    <>
      {isExpanded && <div className="fixed inset-0 z-30 bg-black/25" aria-hidden="true" />}

      <div ref={containerRef} className="relative z-[35] mx-auto max-w-4xl px-4">
        {!isExpanded ? (
          <div className="floating-shadow mx-auto flex max-w-3xl items-center rounded-full border border-neutral-200 bg-white p-1.5 transition-shadow hover:shadow-lg">
            <Segment
              label="Where"
              value={whereInput || "Dubai Prime or Indian Metros"}
              muted={!whereInput}
              onClick={() => openAt("where")}
              className="flex-[1.4]"
            />
            <Divider />
            <Segment
              label="Move-in"
              value={selectedTimeline || "Any time"}
              muted={!selectedTimeline}
              onClick={() => openAt("timeline")}
              className="hidden flex-1 sm:flex"
            />
            <Divider className="hidden sm:block" />
            <Segment
              label={isRentMode ? "Size & rent" : "Size & budget"}
              value={sizeBudgetDisplay}
              muted={selectedBhk.length === 0 && (isRentMode ? maxRentRupees >= ANY_RENT_RUPEES : maxBudgetLakhs >= ANY_PRICE_LAKHS)}
              onClick={() => openAt("budget")}
              className="hidden flex-1 sm:flex"
            />
            <button
              type="button"
              onClick={() => openAt("where")}
              className="ml-1 flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-brand px-4 text-white transition-colors hover:bg-brand-hover cursor-pointer md:px-5"
              aria-label="Search homes"
            >
              <Search className="h-4 w-4" strokeWidth={2.5} />
              <span className="hidden text-sm font-semibold md:inline">Search</span>
            </button>
          </div>
        ) : (
          <div role="search" className="floating-shadow rounded-3xl border border-hairline bg-white p-4 sm:p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between border-b border-hairline pb-2">
              <div role="tablist" aria-label="Search options" className="flex items-center gap-1 sm:gap-4">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`-mb-px flex items-center gap-1.5 border-b-2 px-2 pb-3 pt-1 text-sm font-semibold transition-colors cursor-pointer ${
                      activeTab === tab.id ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="-mt-2 rounded-full p-2 text-muted transition-colors hover:bg-neutral-100 hover:text-ink cursor-pointer"
                aria-label="Close search"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div role="tabpanel" className="min-h-[220px]">
              {activeTab === "where" && (
                <div className="space-y-5">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    <input
                      type="search"
                      aria-label="Locality, corridor or ULPIN"
                      placeholder="Search Dubai Prime (Downtown, Palm, DIFC) or Indian Metros (Mumbai, BLR, Pune, NCR)"
                      value={whereInput}
                      onChange={(e) => setWhereInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleApplySearch();
                        }
                      }}
                      className="w-full rounded-xl border border-neutral-300 bg-white py-3.5 pl-11 pr-4 text-[15px] placeholder:text-neutral-400 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink shadow-sm"
                      autoFocus
                    />
                  </div>

                  {/* Corridor Filter Switcher */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-muted mr-1">Corridor:</span>
                      {(["ALL", "Dubai Prime", "Indian Metros"] as CorridorFilter[]).map((c) => {
                        const active = corridorFilter === c;
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setCorridorFilter(c)}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                              active
                                ? "bg-ink text-white"
                                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-ink"
                            }`}
                          >
                            {c === "ALL" ? "All Nodes" : c === "Dubai Prime" ? "Dubai Prime (AED)" : "Indian Metros (INR)"}
                          </button>
                        );
                      })}
                    </div>

                    {lastAutoSyncedCurrency && (
                      <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        <Sparkles className="h-3 w-3 text-amber-600" />
                        <span>Currency auto-synced to {lastAutoSyncedCurrency}</span>
                      </div>
                    )}
                  </div>

                  {/* Locality Intelligence Cards Grid */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="eyebrow">Verified Corridor Localities ({filteredLocalities.length})</p>
                      <span className="text-[11px] text-muted">Click to select & auto-sync currency</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[280px] overflow-y-auto pr-1">
                      {filteredLocalities.map((loc) => {
                        const isSelected = whereInput.toLowerCase() === loc.name.toLowerCase();
                        const isDubai = loc.corridor === "Dubai Prime";
                        return (
                          <button
                            key={loc.name}
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() => handleSelectLocality(loc)}
                            className={`group flex flex-col justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? "border-brand bg-brand-soft/20 shadow-sm"
                                : "border-neutral-200 hover:border-neutral-400 bg-white hover:bg-surface"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-semibold text-sm text-ink group-hover:text-brand transition-colors">
                                {loc.name}
                              </span>
                              <span
                                className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold shrink-0 ${
                                  isDubai
                                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                                    : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                }`}
                              >
                                {loc.defaultCurrency}
                              </span>
                            </div>

                            <p className="text-[11px] text-muted line-clamp-1 mt-1">{loc.microMarketTag}</p>

                            <div className="mt-2.5 flex items-center justify-between text-[11px] text-neutral-500 pt-1.5 border-t border-hairline">
                              <span>{loc.city}</span>
                              <span className="font-medium text-ink bg-neutral-100 px-1.5 py-0.2 rounded text-[10px]">
                                {loc.inventoryCount} units verified
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "timeline" && (
                <div>
                  <p className="eyebrow mb-3">When do you want to move in?</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {TIMELINES.map((item) => {
                      const selected = selectedTimeline === item.label;
                      return (
                        <button
                          key={item.label}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => setSelectedTimeline(selected ? "" : item.label)}
                          className={`rounded-2xl p-4 text-left transition-shadow cursor-pointer ${
                            selected
                              ? "shadow-[inset_0_0_0_2px_var(--color-ink)]"
                              : "shadow-[inset_0_0_0_1px_#dddddd] hover:shadow-[inset_0_0_0_1px_var(--color-ink)]"
                          }`}
                        >
                          <span className="block text-sm font-semibold text-ink">{item.label}</span>
                          <span className="mt-1 block text-sm text-muted">{item.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === "budget" && (
                <div className="space-y-6">
                  <div>
                    <p className="eyebrow mb-3">Bedrooms</p>
                    <div className="flex flex-wrap gap-2">
                      {BHK_OPTIONS.map((bhk) => (
                        <button key={bhk} type="button" aria-pressed={selectedBhk.includes(bhk)} onClick={() => toggleBhk(bhk)} className="chip">
                          {bhk}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <label htmlFor="pill-budget" className="eyebrow">
                        {isRentMode ? `Maximum monthly rent (${currency})` : `Maximum budget (${currency})`}
                      </label>
                      <span className="text-sm font-semibold tabular-nums text-ink">{budgetDisplay}</span>
                    </div>
                    {isRentMode ? (
                      <>
                        <input
                          id="pill-budget"
                          type="range"
                          min={20000}
                          max={ANY_RENT_RUPEES}
                          step={5000}
                          value={maxRentRupees}
                          onChange={(e) => setMaxRentRupees(Number(e.target.value))}
                          className="w-full cursor-pointer accent-brand"
                        />
                        <div className="mt-1 flex justify-between text-xs text-muted">
                          <span>{formatCompact(20000)}</span>
                          <span>{formatCompact(100000)}</span>
                          <span>{formatCompact(200000)}+</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <input
                          id="pill-budget"
                          type="range"
                          min={40}
                          max={ANY_PRICE_LAKHS}
                          step={20}
                          value={maxBudgetLakhs}
                          onChange={(e) => setMaxBudgetLakhs(Number(e.target.value))}
                          className="w-full cursor-pointer accent-brand"
                        />
                        <div className="mt-1 flex justify-between text-xs text-muted">
                          <span>{formatCompact(4000000)}</span>
                          <span>{formatCompact(50000000)}</span>
                          <span>{formatCompact(100000000)}+</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-hairline pt-4">
              <button type="button" onClick={handleReset} className="text-sm font-semibold text-ink underline underline-offset-4 cursor-pointer">
                Clear all
              </button>
              <button type="button" onClick={handleApplySearch} className="btn btn-primary">
                <Search className="h-4 w-4" strokeWidth={2.5} />
                Search
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const Segment: React.FC<{ label: string; value: string; muted: boolean; onClick: () => void; className?: string }> = ({
  label,
  value,
  muted,
  onClick,
  className = "",
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex min-w-0 flex-col items-start rounded-full px-5 py-2 text-left transition-colors hover:bg-neutral-100 cursor-pointer ${className}`}
  >
    <span className="text-xs font-semibold text-ink">{label}</span>
    <span className={`w-full truncate text-sm ${muted ? "text-muted" : "font-medium text-ink"}`}>{value}</span>
  </button>
);

const Divider: React.FC<{ className?: string }> = ({ className = "" }) => (
  <span aria-hidden="true" className={`h-8 w-px shrink-0 bg-neutral-200 ${className}`} />
);

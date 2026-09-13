"use client";

import React, { useEffect, useRef, useState } from "react";
import { Calendar, MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import { SearchFilters } from "@/types/property";
import { ANY_PRICE_LAKHS, ANY_RENT_RUPEES } from "@/lib/filters";

interface ExpandablePillSearchProps {
  filters: SearchFilters;
  onSearch: (updatedFilters: Partial<SearchFilters>) => void;
}

type Tab = "where" | "timeline" | "budget";

const TOP_LOCALITIES = [
  { name: "HSR Layout", city: "Bengaluru" },
  { name: "Indiranagar", city: "Bengaluru" },
  { name: "Whitefield", city: "Bengaluru" },
  { name: "Koramangala", city: "Bengaluru" },
  { name: "Malleshwaram", city: "Bengaluru" },
  { name: "Devanahalli", city: "Bengaluru" },
  { name: "Lower Parel", city: "Mumbai" },
  { name: "Borivali East", city: "Mumbai" },
];

const TIMELINES = [
  { label: "Ready to move", desc: "Inspection complete, keys available now" },
  { label: "Within 30 days", desc: "Current tenancy ending or registration pending" },
  { label: "Under construction", desc: "RERA-registered, milestone-linked payments" },
];

const BHK_OPTIONS = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"];

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "where", label: "Where", icon: <MapPin className="h-4 w-4" /> },
  { id: "timeline", label: "Move-in", icon: <Calendar className="h-4 w-4" /> },
  { id: "budget", label: "Size & budget", icon: <SlidersHorizontal className="h-4 w-4" /> },
];

export const ExpandablePillSearch: React.FC<ExpandablePillSearchProps> = ({ filters, onSearch }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("where");
  const [whereInput, setWhereInput] = useState(filters.locality || "");
  const [selectedTimeline, setSelectedTimeline] = useState(filters.timeline || "");
  const [selectedBhk, setSelectedBhk] = useState<string[]>(filters.bhk || []);
  const [maxBudgetLakhs, setMaxBudgetLakhs] = useState(filters.maxPriceLakhs || ANY_PRICE_LAKHS);
  const [maxRentRupees, setMaxRentRupees] = useState(filters.maxRentRupees || ANY_RENT_RUPEES);

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
    onSearch({ locality: "", timeline: "", bhk: [], maxPriceLakhs: ANY_PRICE_LAKHS, maxRentRupees: ANY_RENT_RUPEES });
  };

  const toggleBhk = (bhk: string) =>
    setSelectedBhk((prev) => (prev.includes(bhk) ? prev.filter((b) => b !== bhk) : [...prev, bhk]));

  const budgetDisplay = isRentMode
    ? maxRentRupees >= ANY_RENT_RUPEES
      ? "Any rent"
      : `Up to ₹${(maxRentRupees / 1000).toFixed(0)}k/mo`
    : maxBudgetLakhs >= ANY_PRICE_LAKHS
      ? "Any budget"
      : maxBudgetLakhs >= 100
        ? `Up to ₹${(maxBudgetLakhs / 100).toFixed(1)} Cr`
        : `Up to ₹${maxBudgetLakhs} L`;

  const sizeBudgetDisplay = selectedBhk.length > 0 ? `${selectedBhk.join(", ")} · ${budgetDisplay}` : budgetDisplay;

  return (
    <>
      {isExpanded && <div className="fixed inset-0 z-30 bg-black/25" aria-hidden="true" />}

      <div ref={containerRef} className="relative z-[35] mx-auto max-w-4xl px-4">
        {!isExpanded ? (
          <div className="floating-shadow mx-auto flex max-w-3xl items-center rounded-full border border-neutral-200 bg-white p-1.5 transition-shadow hover:shadow-lg">
            <Segment label="Where" value={whereInput || "Locality, city or ULPIN"} muted={!whereInput} onClick={() => openAt("where")} className="flex-[1.4]" />
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
          <div role="search" className="floating-shadow rounded-3xl border border-hairline bg-white p-4 sm:p-6">
            <div className="mb-5 flex items-center justify-between border-b border-hairline">
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

            <div role="tabpanel" className="min-h-[180px]">
              {activeTab === "where" && (
                <div className="space-y-5">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    <input
                      type="search"
                      aria-label="Locality, city or ULPIN"
                      placeholder="Search a locality, city or 14-digit ULPIN"
                      value={whereInput}
                      onChange={(e) => setWhereInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleApplySearch();
                        }
                      }}
                      className="w-full rounded-xl border border-neutral-300 bg-white py-3.5 pl-11 pr-4 text-[15px] placeholder:text-neutral-400 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                      autoFocus
                    />
                  </div>

                  <div>
                    <p className="eyebrow mb-3">Popular localities</p>
                    <div className="flex flex-wrap gap-2">
                      {TOP_LOCALITIES.map((loc) => (
                        <button
                          key={loc.name}
                          type="button"
                          aria-pressed={whereInput === loc.name}
                          onClick={() => {
                            setWhereInput(loc.name);
                            setActiveTab("timeline");
                          }}
                          className="chip"
                        >
                          {loc.name}
                          <span className="opacity-60">· {loc.city}</span>
                        </button>
                      ))}
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
                        {isRentMode ? "Maximum monthly rent" : "Maximum budget"}
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
                          <span>₹20k</span>
                          <span>₹1L</span>
                          <span>₹2L+</span>
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
                          <span>₹40 L</span>
                          <span>₹5 Cr</span>
                          <span>₹10 Cr+</span>
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

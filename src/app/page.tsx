"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { GlobalHeader } from "@/components/navigation/GlobalHeader";
import { ExpandablePillSearch } from "@/components/navigation/ExpandablePillSearch";
import { CategoryRail } from "@/components/navigation/CategoryRail";
import { FilterModal } from "@/components/navigation/FilterModal";
import { SiteFooter } from "@/components/navigation/SiteFooter";
import { PropertyGrid } from "@/components/listings/PropertyGrid";
import { MapSplitView } from "@/components/listings/MapSplitView";
import { MOCK_PROPERTIES } from "@/data/mockProperties";
import { countActiveFilters, filterProperties, INITIAL_FILTERS } from "@/lib/filters";
import { ListingMode, PropertyCategory, SearchFilters } from "@/types/property";
import { FileCheck2, HardHat, List, Map as MapIcon, UserCheck } from "lucide-react";

const MODE_HEADINGS: Record<ListingMode, string> = {
  BUY: "Verified homes for sale",
  RENT: "Verified homes for rent",
  "3D_TWINS": "Homes you can tour in 3D",
  NEW_PROJECTS: "New projects",
};

const TRUST_POINTS = [
  { icon: <UserCheck className="h-4 w-4" />, label: "Listed by owners" },
  { icon: <HardHat className="h-4 w-4" />, label: "80-point engineer inspection" },
  { icon: <FileCheck2 className="h-4 w-4" />, label: "Title checked" },
];

const isListingMode = (value: string | null): value is ListingMode =>
  value === "BUY" || value === "RENT" || value === "3D_TWINS";

function HomePageContent() {
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode");
  const initialMode: ListingMode = isListingMode(modeParam) ? modeParam : "BUY";

  const [activeMode, setActiveMode] = useState<ListingMode>(initialMode);
  const [selectedCategory, setSelectedCategory] = useState<PropertyCategory>("ALL");
  const [filters, setFilters] = useState<SearchFilters>({ ...INITIAL_FILTERS, mode: initialMode });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [showMapSplit, setShowMapSplit] = useState(false);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);

  const handleModeChange = (mode: ListingMode) => {
    setActiveMode(mode);
    if (mode === "RENT") {
      setFilters((prev) => ({ ...prev, mode: "RENT" }));
    } else if (mode === "3D_TWINS") {
      setFilters((prev) => ({ ...prev, mode: "BUY", only3D: true }));
      setSelectedCategory("DIGITAL_TWIN");
    } else {
      setFilters((prev) => ({ ...prev, mode: "BUY", only3D: false }));
    }
  };

  // Keep in sync with ?mode= (header links from other pages land here).
  useEffect(() => {
    if (isListingMode(modeParam)) handleModeChange(modeParam);
  }, [modeParam]);

  const filteredProperties = useMemo(
    () => filterProperties(MOCK_PROPERTIES, activeMode, selectedCategory, filters),
    [activeMode, selectedCategory, filters],
  );
  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  const handleApplyFilters = (updated: Partial<SearchFilters>) => setFilters((prev) => ({ ...prev, ...updated }));

  const handleResetAll = () => {
    setFilters({ ...INITIAL_FILTERS, mode: filters.mode });
    setSelectedCategory("ALL");
  };

  const resultsHeading = (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">{MODE_HEADINGS[activeMode]}</h1>
      <div className="mt-1.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
        <span>
          {filteredProperties.length} {filteredProperties.length === 1 ? "home" : "homes"}
          {filters.locality ? ` in ${filters.locality}` : " in Bengaluru & Mumbai"}
        </span>
        <span className="hidden h-4 w-px bg-neutral-300 md:block" aria-hidden="true" />
        <ul className="hidden items-center gap-5 md:flex">
          {TRUST_POINTS.map((point) => (
            <li key={point.label} className="flex items-center gap-1.5">
              <span className="text-verified">{point.icon}</span>
              {point.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <GlobalHeader activeMode={activeMode} onModeChange={handleModeChange} />
      <div className="h-20" />

      <div className="pb-4 pt-5">
        <ExpandablePillSearch filters={filters} onSearch={handleApplyFilters} />
      </div>

      <CategoryRail
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenFilterModal={() => setIsFilterModalOpen(true)}
        activeFilterCount={activeFilterCount}
      />

      <main className="mx-auto w-full max-w-[1760px] flex-1 px-4 py-8 sm:px-8 md:px-12">
        {!showMapSplit ? (
          <>
            {resultsHeading}
            <PropertyGrid
              properties={filteredProperties}
              layout="grid"
              highlightedId={hoveredPropertyId}
              onHoverProperty={setHoveredPropertyId}
              onResetFilters={handleResetAll}
            />
          </>
        ) : (
          <div className="flex h-[calc(100vh-240px)] flex-col items-start gap-8 lg:flex-row">
            <div className="h-full w-full overflow-y-auto pr-2 lg:w-7/12">
              {resultsHeading}
              <PropertyGrid
                properties={filteredProperties}
                layout="split"
                highlightedId={hoveredPropertyId}
                onHoverProperty={setHoveredPropertyId}
                onResetFilters={handleResetAll}
              />
            </div>
            <div className="sticky top-36 hidden h-full w-5/12 lg:block">
              <MapSplitView properties={filteredProperties} highlightedId={hoveredPropertyId} onHoverProperty={setHoveredPropertyId} />
            </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-8 left-1/2 z-30 -translate-x-1/2">
        <button
          type="button"
          onClick={() => setShowMapSplit((v) => !v)}
          className="flex items-center gap-2 rounded-full bg-ink px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.03] active:scale-95 cursor-pointer"
        >
          {showMapSplit ? <List className="h-4 w-4" /> : <MapIcon className="h-4 w-4" />}
          {showMapSplit ? "Show list" : "Show map"}
        </button>
      </div>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onApply={handleApplyFilters}
        countMatches={(draft) => filterProperties(MOCK_PROPERTIES, activeMode, selectedCategory, { ...filters, ...draft }).length}
      />

      {!showMapSplit && <SiteFooter />}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <HomePageContent />
    </Suspense>
  );
}

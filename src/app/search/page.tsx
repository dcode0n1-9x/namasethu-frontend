"use client";

import React, { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { GlobalHeader } from "@/components/navigation/GlobalHeader";
import { ExpandablePillSearch } from "@/components/navigation/ExpandablePillSearch";
import { CategoryRail } from "@/components/navigation/CategoryRail";
import { FilterModal } from "@/components/navigation/FilterModal";
import { PropertyGrid } from "@/components/listings/PropertyGrid";
import { MapSplitView } from "@/components/listings/MapSplitView";
import { MOCK_PROPERTIES } from "@/data/mockProperties";
import { countActiveFilters, filterProperties, INITIAL_FILTERS } from "@/lib/filters";
import { ListingMode, PropertyCategory, SearchFilters } from "@/types/property";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialLocality = searchParams.get("locality") || searchParams.get("q") || "";
  const initialMode = (searchParams.get("mode") as ListingMode) || "BUY";

  const [activeMode, setActiveMode] = useState<ListingMode>(initialMode);
  const [selectedCategory, setSelectedCategory] = useState<PropertyCategory>("ALL");
  const [showMap, setShowMap] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({ ...INITIAL_FILTERS, mode: initialMode, locality: initialLocality });

  const filteredProperties = useMemo(
    () => filterProperties(MOCK_PROPERTIES, activeMode, selectedCategory, filters),
    [activeMode, selectedCategory, filters],
  );

  const handleModeChange = (mode: ListingMode) => {
    setActiveMode(mode);
    setFilters((prev) => ({ ...prev, mode: mode === "RENT" ? "RENT" : "BUY" }));
  };

  const applyFilters = (updated: Partial<SearchFilters>) => setFilters((prev) => ({ ...prev, ...updated }));

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <GlobalHeader activeMode={activeMode} onModeChange={handleModeChange} />
      <div className="h-20" />

      <div className="pb-4 pt-5">
        <ExpandablePillSearch filters={filters} onSearch={applyFilters} />
      </div>

      <CategoryRail
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenFilterModal={() => setIsFilterModalOpen(true)}
        activeFilterCount={countActiveFilters(filters)}
      />

      <main className="mx-auto w-full max-w-[1760px] flex-1 px-4 py-6 sm:px-8 md:px-12">
        <div className="flex h-[calc(100vh-240px)] flex-col items-start gap-8 lg:flex-row">
          <div className={`h-full w-full overflow-y-auto pr-2 ${showMap ? "lg:w-7/12" : ""}`}>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted">
                <span className="font-semibold text-ink">{filteredProperties.length}</span>{" "}
                {filteredProperties.length === 1 ? "home" : "homes"}
                {filters.locality ? ` in ${filters.locality}` : ""}
              </p>
              <button
                type="button"
                onClick={() => setShowMap((v) => !v)}
                className="hidden text-sm font-semibold text-ink underline underline-offset-4 cursor-pointer lg:block"
              >
                {showMap ? "Hide map" : "Show map"}
              </button>
            </div>

            <PropertyGrid
              properties={filteredProperties}
              layout={showMap ? "split" : "grid"}
              highlightedId={hoveredId}
              onHoverProperty={setHoveredId}
              onResetFilters={() => {
                setFilters({ ...INITIAL_FILTERS, mode: filters.mode });
                setSelectedCategory("ALL");
              }}
            />
          </div>

          {showMap && (
            <div className="sticky top-36 hidden h-full w-5/12 lg:block">
              <MapSplitView properties={filteredProperties} highlightedId={hoveredId} onHoverProperty={setHoveredId} />
            </div>
          )}
        </div>
      </main>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onApply={applyFilters}
        countMatches={(draft) => filterProperties(MOCK_PROPERTIES, activeMode, selectedCategory, { ...filters, ...draft }).length}
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <SearchContent />
    </Suspense>
  );
}

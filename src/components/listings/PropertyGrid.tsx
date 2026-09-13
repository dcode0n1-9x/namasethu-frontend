"use client";

import React from "react";
import { PropertyListing } from "@/types/property";
import { PropertyCard } from "./PropertyCard";
import { SearchX } from "lucide-react";

interface PropertyGridProps {
  properties: PropertyListing[];
  highlightedId?: string | null;
  onHoverProperty?: (id: string | null) => void;
  onResetFilters?: () => void;
  layout?: "grid" | "split";
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  highlightedId,
  onHoverProperty,
  onResetFilters,
  layout = "grid",
}) => {
  if (properties.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-surface text-muted">
          <SearchX className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-semibold text-ink">No exact matches</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">
          Try widening your budget, changing the number of bedrooms, or removing a few filters.
        </p>
        {onResetFilters && (
          <button type="button" onClick={onResetFilters} className="btn btn-outline mt-6">
            Clear all filters
          </button>
        )}
      </div>
    );
  }

  const gridClass =
    layout === "split"
      ? "grid grid-cols-1 gap-x-6 gap-y-10 pb-20 sm:grid-cols-2"
      : "grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  return (
    <div className={gridClass}>
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          isHighlighted={highlightedId === property.id}
          onHover={onHoverProperty}
        />
      ))}
    </div>
  );
};

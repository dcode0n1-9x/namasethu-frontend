"use client";

import React from "react";
import { PropertyListing } from "@/types/property";

interface PriceMarkerProps {
  property: PropertyListing;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const PriceMarker: React.FC<PriceMarkerProps> = ({ property, isSelected, onClick, onMouseEnter, onMouseLeave }) => (
  <button
    type="button"
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    aria-label={`${property.locality}, ${property.formattedPrice}`}
    aria-pressed={isSelected}
    className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold tabular-nums shadow-[0_2px_6px_rgb(0_0_0/0.18)] transition-transform duration-150 cursor-pointer select-none ${
      isSelected ? "relative z-20 scale-110 bg-ink text-white" : "relative z-10 bg-white text-ink hover:scale-105"
    }`}
  >
    {property.formattedPrice.replace(" / mo", "/mo")}
  </button>
);

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PropertyListing } from "@/types/property";
import { PriceMarker } from "./PriceMarker";
import { Minus, Plus, ShieldCheck, X } from "lucide-react";

interface MapSplitViewProps {
  properties: PropertyListing[];
  highlightedId: string | null;
  onHoverProperty: (id: string | null) => void;
}

type City = "Bengaluru" | "Mumbai";

const BOUNDS: Record<City, { minLat: number; maxLat: number; minLng: number; maxLng: number }> = {
  Bengaluru: { minLat: 12.8, maxLat: 13.4, minLng: 77.5, maxLng: 77.76 },
  Mumbai: { minLat: 18.9, maxLat: 19.3, minLng: 72.78, maxLng: 72.95 },
};

const isCity = (city: string): city is City => city === "Bengaluru" || city === "Mumbai";

export const MapSplitView: React.FC<MapSplitViewProps> = ({ properties, highlightedId, onHoverProperty }) => {
  const [selectedCity, setSelectedCity] = useState<City>("Bengaluru");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activePopupProperty, setActivePopupProperty] = useState<PropertyListing | null>(null);

  // Follow the hovered card into its city.
  useEffect(() => {
    const prop = highlightedId ? properties.find((p) => p.id === highlightedId) : undefined;
    if (prop && isCity(prop.city) && prop.city !== selectedCity) setSelectedCity(prop.city);
  }, [highlightedId, properties, selectedCity]);

  // If every result is in the other city, switch to it.
  useEffect(() => {
    if (properties.length === 0 || properties.some((p) => p.city === selectedCity)) return;
    const first = properties.find((p) => isCity(p.city));
    if (first && isCity(first.city)) setSelectedCity(first.city);
  }, [properties, selectedCity]);

  const cityProperties = properties.filter((p) => p.city === selectedCity);

  const getRelativePosition = (lat: number, lng: number) => {
    const b = BOUNDS[selectedCity];
    const y = 100 - ((lat - b.minLat) / (b.maxLat - b.minLat)) * 100;
    const x = ((lng - b.minLng) / (b.maxLng - b.minLng)) * 100;
    return { x: Math.min(Math.max(x, 10), 90), y: Math.min(Math.max(y, 10), 90) };
  };

  const switchCity = (city: City) => {
    setSelectedCity(city);
    setActivePopupProperty(null);
  };

  return (
    <div className="relative h-full min-h-[600px] w-full select-none overflow-hidden rounded-2xl border border-hairline bg-[#ECEAE4]">
      <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <pattern id="map-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#E0DDD5" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#map-grid)" />

        {selectedCity === "Bengaluru" ? (
          <>
            <path d="M 520,380 Q 560,350 620,390 T 700,430 T 630,470 Z" fill="#C9E3EA" />
            <path d="M 480,480 Q 520,460 560,500 T 520,540 Z" fill="#C9E3EA" />
            <path d="M 280,180 Q 320,160 360,190 T 320,230 Z" fill="#C9E3EA" />
            <circle cx="500" cy="380" r="240" fill="none" stroke="#FFFFFF" strokeWidth="6" />
            <path d="M 100,320 L 800,340" stroke="#FFFFFF" strokeWidth="5" />
            <path d="M 450,80 L 460,700" stroke="#FFFFFF" strokeWidth="5" />
            <path d="M 100,320 L 800,340" stroke="#9B87D6" strokeWidth="2" strokeDasharray="8 5" />
            <path d="M 450,80 L 460,700" stroke="#5FB48C" strokeWidth="2" strokeDasharray="8 5" />
          </>
        ) : (
          <>
            <path d="M 0,0 L 250,0 Q 220,300 240,600 T 150,900 L 0,900 Z" fill="#C9E3EA" />
            <path d="M 260,850 Q 250,500 290,100" stroke="#FFFFFF" strokeWidth="6" fill="none" />
            <path d="M 320,850 Q 330,500 370,100" stroke="#FFFFFF" strokeWidth="5" fill="none" />
          </>
        )}
      </svg>

      <div className="absolute left-4 top-4 z-20 flex rounded-full bg-white p-1 shadow-md" role="group" aria-label="City">
        {(["Bengaluru", "Mumbai"] as City[]).map((city) => (
          <button
            key={city}
            type="button"
            aria-pressed={selectedCity === city}
            onClick={() => switchCity(city)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors cursor-pointer ${
              selectedCity === city ? "bg-ink text-white" : "text-muted hover:text-ink"
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      <div className="absolute right-4 top-4 z-20 flex flex-col overflow-hidden rounded-xl bg-white shadow-md">
        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
          className="border-b border-hairline p-2.5 text-ink transition-colors hover:bg-surface cursor-pointer"
          aria-label="Zoom in"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
          className="p-2.5 text-ink transition-colors hover:bg-surface cursor-pointer"
          aria-label="Zoom out"
        >
          <Minus className="h-4 w-4" />
        </button>
      </div>

      <div className="absolute inset-0 origin-center transition-transform duration-300" style={{ transform: `scale(${zoomLevel})` }}>
        {cityProperties.map((property) => {
          const { x, y } = getRelativePosition(property.coordinates.lat, property.coordinates.lng);
          return (
            <div key={property.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
              <PriceMarker
                property={property}
                isSelected={highlightedId === property.id || activePopupProperty?.id === property.id}
                onClick={() => setActivePopupProperty(property)}
                onMouseEnter={() => onHoverProperty(property.id)}
                onMouseLeave={() => onHoverProperty(null)}
              />
            </div>
          );
        })}
      </div>

      {cityProperties.length === 0 && (
        <div className="absolute inset-x-0 top-1/2 z-10 mx-auto w-fit -translate-y-1/2 rounded-full bg-white px-4 py-2 text-sm font-medium text-muted shadow-md">
          No matching homes in {selectedCity}
        </div>
      )}

      {activePopupProperty && (
        <div className="floating-shadow absolute bottom-5 right-5 z-30 w-72 overflow-hidden rounded-2xl bg-white">
          <div className="relative aspect-[16/10]">
            <img src={activePopupProperty.images[0]} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => setActivePopupProperty(null)}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-ink shadow cursor-pointer"
              aria-label="Close preview"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <Link href={`/property/${activePopupProperty.slug}`} className="block space-y-0.5 p-4 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate font-semibold text-ink">{activePopupProperty.locality}</span>
              <span className="flex shrink-0 items-center gap-1 font-medium">
                <ShieldCheck className="h-4 w-4 text-verified" />
                {activePopupProperty.trustScore}
              </span>
            </div>
            <p className="text-muted">
              {activePopupProperty.configuration} · {activePopupProperty.superBuiltUpAreaSqft.toLocaleString("en-IN")} sq ft
            </p>
            <p className="pt-1 font-semibold tabular-nums text-ink">{activePopupProperty.formattedPrice}</p>
          </Link>
        </div>
      )}
    </div>
  );
};

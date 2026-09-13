"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart, ShieldCheck, TriangleAlert, CircleCheck } from "lucide-react";
import { PropertyListing } from "@/types/property";

interface PropertyCardProps {
  property: PropertyListing;
  isHighlighted?: boolean;
  onHover?: (propertyId: string | null) => void;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, isHighlighted = false, onHover }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);

  const images = property.images?.length ? property.images : [FALLBACK_IMAGE];
  const href = `/property/${property.slug}`;

  const step = (delta: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImgIndex((prev) => (prev + delta + images.length) % images.length);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite((v) => !v);
    setIsHeartAnimating(true);
    setTimeout(() => setIsHeartAnimating(false), 300);
  };

  const badge = property.has3dTour ? "3D tour" : property.verifiedOwnerBadge ? "Owner listed" : null;
  const discount = property.valuation.differencePercentage;

  return (
    <article onMouseEnter={() => onHover?.(property.id)} onMouseLeave={() => onHover?.(null)} className="group relative flex flex-col">
      <div
        className={`relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-neutral-100 transition-shadow ${
          isHighlighted ? "ring-2 ring-ink ring-offset-2" : ""
        }`}
      >
        <Link href={href} tabIndex={-1} aria-hidden="true" className="absolute inset-0">
          <img
            src={images[currentImgIndex]}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            loading="lazy"
          />
        </Link>

        {badge && (
          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-ink shadow-sm">
            {badge}
          </span>
        )}

        <button
          type="button"
          onClick={toggleFavorite}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? "Remove from saved" : "Save home"}
          className={`absolute right-2 top-2 rounded-full p-2 transition-transform hover:scale-110 active:scale-95 cursor-pointer ${
            isHeartAnimating ? "animate-heart-pop" : ""
          }`}
        >
          <Heart
            className={`h-6 w-6 drop-shadow-sm ${isFavorite ? "fill-brand text-white" : "fill-black/40 text-white"}`}
            strokeWidth={2}
          />
        </button>

        {images.length > 1 && (
          <>
            <CarouselButton side="left" onClick={step(-1)} label="Previous photo" />
            <CarouselButton side="right" onClick={step(1)} label="Next photo" />
            <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
              {images.slice(0, 5).map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 w-1.5 rounded-full transition-opacity ${idx === currentImgIndex ? "bg-white" : "bg-white/55"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <Link href={href} className="block space-y-0.5 rounded-md text-[15px] leading-snug">
        <div className="flex items-start justify-between gap-3">
          <h3 className="truncate font-semibold text-ink">
            {property.locality}, {property.city}
          </h3>
          <span
            className="flex shrink-0 items-center gap-1 text-sm font-medium text-ink"
            title={`Inspection score ${property.trustScore} out of 100`}
          >
            <ShieldCheck className="h-4 w-4 text-verified" />
            {property.trustScore}
          </span>
        </div>

        <p className="truncate text-muted">
          {property.configuration} · {property.superBuiltUpAreaSqft.toLocaleString("en-IN")} sq ft · {property.propertyType}
        </p>

        <p className="flex items-center gap-1.5 truncate text-muted">
          {property.inspection.seepageDetected ? (
            <TriangleAlert className="h-3.5 w-3.5 shrink-0 text-amber-600" />
          ) : (
            <CircleCheck className="h-3.5 w-3.5 shrink-0 text-verified" />
          )}
          <span className="truncate">
            Inspected {property.inspection.inspectionDate}
            {property.inspection.seepageDetected ? " · minor repairs noted" : ""}
          </span>
        </p>

        <p className="pt-1.5">
          <span className="font-semibold tabular-nums text-ink">{property.formattedPrice}</span>
          {discount < 0 ? (
            <span className="ml-2 text-sm font-medium text-verified">{Math.abs(discount)}% below estimate</span>
          ) : (
            <span className="ml-2 text-sm text-muted">Fair price</span>
          )}
        </p>
      </Link>
    </article>
  );
};

const CarouselButton: React.FC<{ side: "left" | "right"; onClick: (e: React.MouseEvent) => void; label: string }> = ({
  side,
  onClick,
  label,
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className={`absolute top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-ink opacity-0 shadow-md transition-opacity hover:bg-white focus-visible:opacity-100 group-hover:opacity-100 cursor-pointer ${
      side === "left" ? "left-3" : "right-3"
    }`}
  >
    {side === "left" ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
  </button>
);

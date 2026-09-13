"use client";

import React, { useState } from "react";
import { BadgeCheck, Check, Copy, MapPin, ShieldCheck } from "lucide-react";
import { PropertyListing } from "@/types/property";
import { ContactActions } from "./ContactActions";
import { PriceBand, PriceStatus } from "./ValuationCard";
import { useCurrency } from "@/context/CurrencyContext";

interface PropertySummaryProps {
  property: PropertyListing;
  isUnlocked: boolean;
  onUnlockClick: () => void;
  onLaunch3d?: () => void;
}

export const PropertySummary: React.FC<PropertySummaryProps> = ({ property, isUnlocked, onUnlockClick, onLaunch3d }) => {
  const { formatListing } = useCurrency();
  const [copied, setCopied] = useState(false);

  const copyUlpin = () => {
    navigator.clipboard?.writeText(property.ulpin);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const specs = [
    { label: "Carpet area", value: `${property.carpetAreaSqft.toLocaleString("en-IN")} sq ft`, caption: `${property.superBuiltUpAreaSqft.toLocaleString("en-IN")} super built-up` },
    { label: "Floor", value: property.floor, caption: `${property.bathrooms} bathrooms` },
    { label: "Facing", value: property.facing, caption: property.waterSupply },
    { label: "Possession", value: property.availableFrom.split(" / ")[0], caption: property.reraNumber ? "RERA registered" : property.propertyType },
  ];

  return (
    <div className="panel flex h-full flex-col gap-5 p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="id-chip">
          <span className="text-slate-400">ULPIN</span>
          {property.ulpin}
          <button
            type="button"
            onClick={copyUlpin}
            className="-mr-1 rounded p-0.5 text-slate-300 transition-colors hover:text-white cursor-pointer"
            aria-label={copied ? "ULPIN copied" : "Copy ULPIN"}
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </span>
        <span className="pill-verified">
          <ShieldCheck className="h-3.5 w-3.5" />
          Inspection score {property.trustScore}/100
        </span>
      </div>

      <div>
        <h1 className="text-2xl font-bold leading-tight text-ink sm:text-[28px]">{property.title}</h1>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
          <MapPin className="h-4 w-4 shrink-0 text-brand" />
          {property.locality}, {property.city}, {property.state}
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-xl bg-surface p-3">
        <img src={property.owner.avatarUrl} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">Listed by {property.owner.fullName}</p>
          <p className="flex items-center gap-1 text-xs font-medium text-verified">
            <BadgeCheck className="h-3.5 w-3.5 shrink-0" />
            Verified owner · DigiLocker e-KYC
          </p>
        </div>
        <p className="hidden shrink-0 text-right text-xs text-muted sm:block">
          Responds
          <br />
          <span className="font-medium text-ink">{property.owner.responseTime}</span>
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-2">
        {specs.map((s) => (
          <div key={s.label} className="min-w-0 rounded-lg bg-surface px-3.5 py-3">
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted">{s.label}</dt>
            <dd className="mt-0.5 text-sm font-semibold leading-snug text-ink">{s.value}</dd>
            <dd className="text-xs text-muted">{s.caption}</dd>
          </div>
        ))}
      </dl>

      <div className="rounded-xl border border-hairline p-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-xs font-medium text-muted">{property.listingMode === "RENT" ? "Monthly rent" : "Asking price"}</p>
            <p className="font-display text-3xl font-bold tabular-nums leading-tight text-ink">{formatListing(property.pricePaise, property.listingMode, false)}</p>
            {property.pricePerSqft && <p className="text-xs text-muted">{property.pricePerSqft}</p>}
          </div>
          <PriceStatus diff={property.valuation.differencePercentage} />
        </div>
        <PriceBand property={property} />
      </div>

      <div className="mt-auto">
        <ContactActions property={property} isUnlocked={isUnlocked} onUnlockClick={onUnlockClick} onLaunch3d={onLaunch3d} />
      </div>
    </div>
  );
};

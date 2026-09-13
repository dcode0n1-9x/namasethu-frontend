"use client";

import React, { useState } from "react";
import { ArrowRight, Calculator } from "lucide-react";
import { formatINR } from "@/lib/format";

interface ValuationCalculatorProps {
  onStartListing?: () => void;
}

const LOCALITY_DATA: Record<string, { baseSqft: number; rentMultiplier: number }> = {
  "Indiranagar, Bengaluru": { baseSqft: 14500, rentMultiplier: 42 },
  "HSR Layout, Bengaluru": { baseSqft: 10500, rentMultiplier: 38 },
  "Whitefield, Bengaluru": { baseSqft: 9800, rentMultiplier: 35 },
  "Koramangala, Bengaluru": { baseSqft: 13800, rentMultiplier: 40 },
  "Lower Parel, Mumbai": { baseSqft: 36000, rentMultiplier: 90 },
  "Powai, Mumbai": { baseSqft: 22000, rentMultiplier: 65 },
  "Borivali East, Mumbai": { baseSqft: 18000, rentMultiplier: 52 },
};

const BHK_SIZES: Record<string, number> = {
  "1 BHK": 650,
  "2 BHK": 1150,
  "3 BHK": 1750,
  "4 BHK": 3400,
};

export const ValuationCalculator: React.FC<ValuationCalculatorProps> = ({ onStartListing }) => {
  const [selectedLocality, setSelectedLocality] = useState("Indiranagar, Bengaluru");
  const [selectedBhk, setSelectedBhk] = useState("3 BHK");

  const localityInfo = LOCALITY_DATA[selectedLocality] || { baseSqft: 11000, rentMultiplier: 36 };
  const carpetSqft = BHK_SIZES[selectedBhk] || 1500;

  const estimatedSaleLow = (localityInfo.baseSqft * carpetSqft * 0.95) / 10000000;
  const estimatedSaleHigh = (localityInfo.baseSqft * carpetSqft * 1.05) / 10000000;
  const estimatedRentLow = Math.round((localityInfo.rentMultiplier * carpetSqft * 0.92) / 1000) * 1000;
  const estimatedRentHigh = Math.round((localityInfo.rentMultiplier * carpetSqft * 1.08) / 1000) * 1000;
  const grossYield = ((localityInfo.rentMultiplier * 12) / localityInfo.baseSqft) * 100;
  // Typical 2% broker commission on the sale value.
  const brokerSavedRupees = Math.round((localityInfo.baseSqft * carpetSqft * 0.02) / 1000) * 1000;

  return (
    <div id="estimate" className="panel scroll-mt-28 p-6 shadow-lg sm:p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft text-brand">
          <Calculator className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-ink">What&apos;s your home worth?</h2>
          <p className="text-sm text-muted">Based on registered sales in your locality.</p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor="calc-locality" className="mb-1.5 block text-sm font-semibold text-ink">
            Locality
          </label>
          <select
            id="calc-locality"
            value={selectedLocality}
            onChange={(e) => setSelectedLocality(e.target.value)}
            className="w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-[15px] text-ink focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
          >
            {Object.keys(LOCALITY_DATA).map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <fieldset>
          <legend className="mb-1.5 text-sm font-semibold text-ink">Size</legend>
          <div className="grid grid-cols-4 gap-2">
            {Object.keys(BHK_SIZES).map((b) => (
              <button key={b} type="button" aria-pressed={selectedBhk === b} onClick={() => setSelectedBhk(b)} className="chip justify-center rounded-lg px-2">
                {b}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <dl className="mt-6 divide-y divide-hairline rounded-xl border border-hairline" aria-live="polite">
        <div className="p-4">
          <dt className="text-sm text-muted">Estimated sale value</dt>
          <dd className="font-display text-2xl font-bold tabular-nums text-ink">
            ₹{estimatedSaleLow.toFixed(2)} – {estimatedSaleHigh.toFixed(2)} Cr
          </dd>
          <dd className="text-xs text-muted">Around {formatINR(localityInfo.baseSqft)} per sq ft</dd>
        </div>
        <div className="grid grid-cols-2 divide-x divide-hairline">
          <div className="p-4">
            <dt className="text-sm text-muted">Estimated rent</dt>
            <dd className="text-lg font-semibold tabular-nums text-ink">
              {formatINR(estimatedRentLow)} – {formatINR(estimatedRentHigh)}
            </dd>
            <dd className="text-xs text-muted">per month · {grossYield.toFixed(1)}% gross yield</dd>
          </div>
          <div className="bg-verified-soft p-4">
            <dt className="text-sm text-verified">Brokerage you keep</dt>
            <dd className="text-lg font-semibold tabular-nums text-ink">₹{(brokerSavedRupees / 100000).toFixed(2)} L</dd>
            <dd className="text-xs text-muted">vs. a typical 2% commission</dd>
          </div>
        </div>
      </dl>

      <button type="button" onClick={onStartListing} className="btn btn-dark mt-6 w-full py-3.5 text-[15px]">
        List your property for free
        <ArrowRight className="h-4 w-4" />
      </button>
      <p className="mt-3 text-center text-xs text-muted">No listing fee · Engineer visit within 24 hours</p>
    </div>
  );
};

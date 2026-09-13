"use client";

import React, { useEffect, useState } from "react";
import { Home, Rotate3d } from "lucide-react";
import { SearchFilters } from "@/types/property";
import { ANY_PRICE_LAKHS, ANY_RENT_RUPEES } from "@/lib/filters";
import { Dialog } from "@/components/ui/Dialog";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onApply: (updated: Partial<SearchFilters>) => void;
  /** Number of homes the draft selection would return, for the live "Show N homes" button. */
  countMatches: (draft: Partial<SearchFilters>) => number;
}

const BHK_OPTIONS = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"];
const TYPE_OPTIONS = ["Apartment", "Villa", "Penthouse", "Independent Floor"];
const FACING_OPTIONS = ["East", "North-East", "North", "West", "South"];
const WATER_OPTIONS = ["Cauvery Direct", "Cauvery + Borewell", "Borewell + RO"];
const SCORE_OPTIONS = [
  { score: 0, label: "Any" },
  { score: 90, label: "90+" },
  { score: 95, label: "95+" },
];

const toggle = (list: string[], item: string) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);

export const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, filters, onApply, countMatches }) => {
  const [bhk, setBhk] = useState<string[]>(filters.bhk);
  const [propertyType, setPropertyType] = useState<string[]>(filters.propertyType);
  const [facing, setFacing] = useState<string[]>(filters.facing);
  const [waterSupply, setWaterSupply] = useState<string[]>(filters.waterSupply);
  const [maxPriceLakhs, setMaxPriceLakhs] = useState(filters.maxPriceLakhs || ANY_PRICE_LAKHS);
  const [maxRentRupees, setMaxRentRupees] = useState(filters.maxRentRupees || ANY_RENT_RUPEES);
  const [minTrustScore, setMinTrustScore] = useState(filters.minTrustScore);
  const [only3D, setOnly3D] = useState(filters.only3D);
  const [onlyDirectOwner, setOnlyDirectOwner] = useState(filters.onlyDirectOwner);

  useEffect(() => {
    if (!isOpen) return;
    setBhk(filters.bhk);
    setPropertyType(filters.propertyType);
    setFacing(filters.facing);
    setWaterSupply(filters.waterSupply);
    setMaxPriceLakhs(filters.maxPriceLakhs || ANY_PRICE_LAKHS);
    setMaxRentRupees(filters.maxRentRupees || ANY_RENT_RUPEES);
    setMinTrustScore(filters.minTrustScore);
    setOnly3D(filters.only3D);
    setOnlyDirectOwner(filters.onlyDirectOwner);
  }, [isOpen, filters]);

  const isRent = filters.mode === "RENT";
  const draft: Partial<SearchFilters> = {
    bhk,
    propertyType,
    facing,
    waterSupply,
    maxPriceLakhs,
    maxRentRupees,
    minTrustScore,
    only3D,
    onlyDirectOwner,
  };
  const matchCount = isOpen ? countMatches(draft) : 0;

  const handleClear = () => {
    setBhk([]);
    setPropertyType([]);
    setFacing([]);
    setWaterSupply([]);
    setMaxPriceLakhs(ANY_PRICE_LAKHS);
    setMaxRentRupees(ANY_RENT_RUPEES);
    setMinTrustScore(0);
    setOnly3D(false);
    setOnlyDirectOwner(false);
  };

  const handleSave = () => {
    onApply(draft);
    onClose();
  };

  const priceLabel = isRent
    ? maxRentRupees >= ANY_RENT_RUPEES
      ? "Any rent"
      : `Up to ₹${(maxRentRupees / 1000).toFixed(0)}k/mo`
    : maxPriceLakhs >= ANY_PRICE_LAKHS
      ? "Any price"
      : `Up to ₹${(maxPriceLakhs / 100).toFixed(2)} Cr`;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title="Filters"
      size="lg"
      footer={
        <div className="flex items-center justify-between">
          <button type="button" onClick={handleClear} className="text-sm font-semibold text-ink underline underline-offset-4 cursor-pointer">
            Clear all
          </button>
          <button type="button" onClick={handleSave} className="btn btn-dark" disabled={matchCount === 0}>
            {matchCount === 0 ? "No matching homes" : `Show ${matchCount} ${matchCount === 1 ? "home" : "homes"}`}
          </button>
        </div>
      }
    >
      <div className="divide-y divide-hairline px-6">
        <Section title={isRent ? "Monthly rent" : "Price"}>
          <div className="mb-3 flex items-center justify-between text-sm">
            <label htmlFor="filter-price" className="text-muted">
              Maximum
            </label>
            <span className="font-semibold tabular-nums">{priceLabel}</span>
          </div>
          {isRent ? (
            <input
              id="filter-price"
              type="range"
              min={20000}
              max={ANY_RENT_RUPEES}
              step={5000}
              value={maxRentRupees}
              onChange={(e) => setMaxRentRupees(Number(e.target.value))}
              className="w-full cursor-pointer accent-brand"
            />
          ) : (
            <input
              id="filter-price"
              type="range"
              min={50}
              max={ANY_PRICE_LAKHS}
              step={25}
              value={maxPriceLakhs}
              onChange={(e) => setMaxPriceLakhs(Number(e.target.value))}
              className="w-full cursor-pointer accent-brand"
            />
          )}
        </Section>

        <Section title="Verification">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ToggleCard
              checked={onlyDirectOwner}
              onChange={setOnlyDirectOwner}
              icon={<Home className="h-5 w-5" />}
              title="Owner listed only"
              description="Identity verified via DigiLocker"
            />
            <ToggleCard
              checked={only3D}
              onChange={setOnly3D}
              icon={<Rotate3d className="h-5 w-5" />}
              title="Has a 3D tour"
              description="Walk through before you visit"
            />
          </div>
        </Section>

        <Section title="Bedrooms">
          <ChipGroup options={BHK_OPTIONS} selected={bhk} onToggle={(v) => setBhk((l) => toggle(l, v))} />
        </Section>

        <Section title="Property type">
          <ChipGroup options={TYPE_OPTIONS} selected={propertyType} onToggle={(v) => setPropertyType((l) => toggle(l, v))} />
        </Section>

        <Section title="Inspection score" description="Composite of structure, plumbing, electrical, finishes and title checks.">
          <div className="flex flex-wrap gap-2">
            {SCORE_OPTIONS.map((item) => (
              <button
                key={item.score}
                type="button"
                aria-pressed={minTrustScore === item.score}
                onClick={() => setMinTrustScore(item.score)}
                className="chip min-w-16 justify-center"
              >
                {item.label}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Facing">
          <ChipGroup options={FACING_OPTIONS} selected={facing} onToggle={(v) => setFacing((l) => toggle(l, v))} />
        </Section>

        <Section title="Water supply">
          <ChipGroup options={WATER_OPTIONS} selected={waterSupply} onToggle={(v) => setWaterSupply((l) => toggle(l, v))} />
        </Section>
      </div>
    </Dialog>
  );
};

const Section: React.FC<{ title: string; description?: string; children: React.ReactNode }> = ({ title, description, children }) => (
  <section className="py-6">
    <h3 className="text-lg font-semibold text-ink">{title}</h3>
    {description && <p className="mt-1 text-sm text-muted">{description}</p>}
    <div className="mt-4">{children}</div>
  </section>
);

const ChipGroup: React.FC<{ options: string[]; selected: string[]; onToggle: (value: string) => void }> = ({ options, selected, onToggle }) => (
  <div className="flex flex-wrap gap-2">
    {options.map((option) => (
      <button key={option} type="button" aria-pressed={selected.includes(option)} onClick={() => onToggle(option)} className="chip">
        {option}
      </button>
    ))}
  </div>
);

const ToggleCard: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ checked, onChange, icon, title, description }) => (
  <label
    className={`flex cursor-pointer items-start gap-3 rounded-2xl p-4 transition-shadow ${
      checked ? "shadow-[inset_0_0_0_2px_var(--color-ink)]" : "shadow-[inset_0_0_0_1px_#dddddd] hover:shadow-[inset_0_0_0_1px_var(--color-ink)]"
    }`}
  >
    <span className="mt-0.5 text-ink">{icon}</span>
    <span className="flex-1">
      <span className="block text-sm font-semibold text-ink">{title}</span>
      <span className="block text-sm text-muted">{description}</span>
    </span>
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1 h-4 w-4 cursor-pointer accent-ink" />
  </label>
);

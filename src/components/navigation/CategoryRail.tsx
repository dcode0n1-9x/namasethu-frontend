"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Building,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  Home,
  LayoutGrid,
  Percent,
  Rotate3d,
  ShieldCheck,
  SlidersHorizontal,
  TrendingDown,
  Trees,
} from "lucide-react";
import { PropertyCategory } from "@/types/property";

interface CategoryRailProps {
  selectedCategory: PropertyCategory;
  onSelectCategory: (cat: PropertyCategory) => void;
  onOpenFilterModal: () => void;
  activeFilterCount: number;
}

interface CategoryItem {
  id: PropertyCategory;
  label: string;
  hint: string;
  icon: React.ReactNode;
}

const ICON = "h-6 w-6";

const CATEGORIES: CategoryItem[] = [
  { id: "ALL", label: "All homes", hint: "Every verified listing", icon: <LayoutGrid className={ICON} strokeWidth={1.75} /> },
  { id: "DIRECT_OWNER", label: "Owner listed", hint: "Listed by the owner, no broker", icon: <Home className={ICON} strokeWidth={1.75} /> },
  { id: "DIGITAL_TWIN", label: "3D tours", hint: "Walk through before you visit", icon: <Rotate3d className={ICON} strokeWidth={1.75} /> },
  { id: "TOP_AVM_DEALS", label: "Below estimate", hint: "Priced under our fair-value estimate", icon: <TrendingDown className={ICON} strokeWidth={1.75} /> },
  { id: "TRUST_PASS_ELITE", label: "Top rated", hint: "Inspection score of 95 or higher", icon: <ShieldCheck className={ICON} strokeWidth={1.75} /> },
  { id: "GATED_COMMUNITIES", label: "Gated communities", hint: "Security, clubhouse, power backup", icon: <Building className={ICON} strokeWidth={1.75} /> },
  { id: "RERA_APPROVED", label: "RERA approved", hint: "Registered with the state RERA", icon: <FileCheck2 className={ICON} strokeWidth={1.75} /> },
  { id: "VILLAS_PLOTS", label: "Villas & plots", hint: "Independent homes and land", icon: <Trees className={ICON} strokeWidth={1.75} /> },
  { id: "HIGH_RENTAL_YIELD", label: "High yield", hint: "Gross rental yield above 4.5%", icon: <Percent className={ICON} strokeWidth={1.75} /> },
];

export const CategoryRail: React.FC<CategoryRailProps> = ({
  selectedCategory,
  onSelectCategory,
  onOpenFilterModal,
  activeFilterCount,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scrollBy = (direction: -1 | 1) => scrollRef.current?.scrollBy({ left: direction * 320, behavior: "smooth" });

  return (
    <div className="sticky top-20 z-20  bg-white">
      <div className="mx-auto flex max-w-[1760px] items-center gap-6 px-4 sm:px-8 md:px-12">
        <div className="relative min-w-0 flex-1">
          {canScrollLeft && (
            <div className="absolute inset-y-0 left-0 z-10 flex items-center bg-gradient-to-r from-white from-60% to-transparent pr-8">
              <PaddleButton onClick={() => scrollBy(-1)} label="Previous categories">
                <ChevronLeft className="h-4 w-4" />
              </PaddleButton>
            </div>
          )}

          <div ref={scrollRef} onScroll={checkScroll} className="no-scrollbar flex items-center gap-8 overflow-x-auto pt-4">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  aria-pressed={isSelected}
                  title={cat.hint}
                  className={`group flex shrink-0 flex-col items-center gap-2 border-b-2 pb-3 transition-colors cursor-pointer ${
                    isSelected ? "border-ink text-ink" : "border-transparent text-muted hover:border-neutral-300 hover:text-ink"
                  }`}
                >
                  <span className={`transition-opacity ${isSelected ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}>{cat.icon}</span>
                  <span className={`whitespace-nowrap text-xs ${isSelected ? "font-semibold" : "font-medium"}`}>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {canScrollRight && (
            <div className="absolute inset-y-0 right-0 z-10 flex items-center bg-gradient-to-l from-white from-60% to-transparent pl-8">
              <PaddleButton onClick={() => scrollBy(1)} label="More categories">
                <ChevronRight className="h-4 w-4" />
              </PaddleButton>
            </div>
          )}
        </div>

        <button type="button" onClick={onOpenFilterModal} className="btn btn-outline btn-sm shrink-0">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[11px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

const PaddleButton: React.FC<{ onClick: () => void; label: string; children: React.ReactNode }> = ({ onClick, label, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 bg-white text-ink transition-shadow hover:shadow-md cursor-pointer"
  >
    {children}
  </button>
);

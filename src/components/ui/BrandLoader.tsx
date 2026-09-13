import React from "react";

type BrandLoaderVariant = "page" | "overlay" | "fill";

interface BrandLoaderProps {
  label?: string;
  /** `page`: full-height route loader · `overlay`: blocks the viewport while API calls run · `fill`: covers its positioned parent. */
  variant?: BrandLoaderVariant;
}

const SHELL: Record<BrandLoaderVariant, string> = {
  page: "min-h-screen w-full bg-white",
  overlay: "fixed inset-0 z-[150] bg-stone/85 backdrop-blur-sm",
  fill: "absolute inset-0 z-20 bg-stone",
};

export const BrandLoader: React.FC<BrandLoaderProps> = ({ label = "Loading", variant = "fill" }) => (
  <div role="status" aria-live="polite" className={`${SHELL[variant]} flex flex-col items-center justify-center gap-4`}>
    <svg viewBox="0 0 2333 2122" className="h-10 w-11 animate-pulse" aria-hidden="true">
      <path d="M631 1086L890 1538L552 2121H1L631 1086Z" className="fill-charcoal" />
      <path d="M1084 1L2330 2121H1765L1392 1505H1005L1231 1101L810 388L1084 1Z" className="fill-charcoal" />
    </svg>
    <div className="h-px w-32 overflow-hidden bg-charcoal/10">
      <div className="twin-loader-bar h-full w-1/3 bg-gold" />
    </div>
    <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-smoke">{label}</p>
  </div>
);

"use client";

import React from "react";
import NextLink from "next/link";

interface BrandLogoProps {
  className?: string;
  variant?: "dark" | "light" | "stacked" | "lockup" | "wordmark" | "tagline" | "monogram";
  collapsed?: boolean;
  isHeader?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = "",
  variant = "dark",
  collapsed = false,
  isHeader = false,
}) => {
  const isLight = variant === "light";

  if (variant === "stacked") {
    return (
      <NextLink
        href="/"
        className={`inline-flex flex-col items-start transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${className}`}
        aria-label="Amberstone home"
      >
        <img
          src={isLight ? "/brand/amberstone-stacked-light-web.png" : "/brand/amberstone-stacked-dark-web.png"}
          alt="Amberstone Real Estate"
          className="h-16 w-auto object-contain"
        />
      </NextLink>
    );
  }

  if (variant === "lockup") {
    return (
      <NextLink
        href="/"
        className={`inline-flex items-center transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${className}`}
        aria-label="Amberstone home"
      >
        <img
          src={isLight ? "/brand/amberstone-lockup-light-web.png" : "/brand/amberstone-lockup-dark-web.png"}
          alt="Amberstone Real Estate"
          className="h-10 w-auto object-contain"
        />
      </NextLink>
    );
  }

  if (variant === "wordmark") {
    return (
      <NextLink
        href="/"
        className={`inline-flex items-center transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${className}`}
        aria-label="Amberstone home"
      >
        <img
          src={isLight ? "/brand/amberstone-wordmark-light-web.png" : "/brand/amberstone-wordmark-dark-web.png"}
          alt="Amberstone Real Estate"
          className="h-8 w-auto object-contain"
        />
      </NextLink>
    );
  }

  if (variant === "tagline") {
    return (
      <img
        src={isLight ? "/brand/amberstone-tagline-light-web.png" : "/brand/amberstone-tagline-dark-web.png"}
        alt="Where trust finds an address"
        className={`h-3.5 w-auto object-contain ${className}`}
      />
    );
  }

  return (
    <NextLink
      href="/"
      className={`inline-flex items-center gap-3 rounded-lg transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${className}`}
      aria-label="Amberstone home"
    >
      {/* Brand Icon Mark — Serves as FLIP shared-element target if in header */}
      <div
        id={isHeader ? "header-brand-logo-mark" : undefined}
        className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl p-2 transition-transform ${
          isLight
            ? "bg-white/10 border border-white/15 shadow-sm"
            : "bg-[#F8F7F4] border border-[#E8E6DF] shadow-xs"
        }`}
      >
        <svg
          viewBox="0 0 2333 2122"
          className="h-6 w-6 object-contain"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M631 1086L890 1538L552 2121H1L631 1086Z"
            fill={isLight ? "#FFFFFF" : "#1A1A1A"}
          />
          <path
            d="M1084 1L2330 2121H1765L1392 1505H1005L1231 1101L810 388L1084 1Z"
            fill={isLight ? "#FFFFFF" : "#1A1A1A"}
          />
        </svg>
      </div>

      {!collapsed && variant !== "monogram" && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-[17px] font-bold tracking-[0.14em] uppercase ${
                isLight ? "text-white" : "text-[#1A1A1A]"
              }`}
            >
              AMBER STONE
            </span>
            <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-wider text-amber-800 border border-amber-500/30 uppercase">
              OS
            </span>
          </div>
          <span className="text-[9.5px] tracking-[0.2em] uppercase text-[#6B6F72] font-semibold mt-1">
            Real Estate Operating System
          </span>
        </div>
      )}
    </NextLink>
  );
};

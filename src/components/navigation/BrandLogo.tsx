import React from "react";
import NextLink from "next/link";

interface BrandLogoProps {
  className?: string;
  variant?: "dark" | "light";
  collapsed?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = "",
  variant = "dark",
  collapsed = false,
}) => {
  const isLight = variant === "light";
  const markSrc = isLight
    ? "/brand/amberstone-mark-light-web.png"
    : "/brand/amberstone-mark-dark-web.png";
  const logoSrc = isLight
    ? "/brand/amberstone-logo-light-web.png"
    : "/brand/amberstone-logo-dark-web.png";

  return (
    <NextLink
      href="/"
      className={`inline-flex items-center gap-3 rounded-lg transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${className}`}
      aria-label="Amberstone home"
    >
      {/* Brand Icon Mark */}
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ink shadow-sm overflow-hidden border border-hairline/60">
        <img
          src={markSrc}
          alt="Amberstone mark"
          className="h-6 w-6 object-contain"
        />
        {/* Amberstone signature gold dot */}
        <span
          className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-amber-500"
          aria-hidden="true"
        />
      </div>

      {!collapsed && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-center gap-1.5">
            <span className={`text-[19px] font-bold tracking-tight ${isLight ? "text-white" : "text-ink"}`}>
              AMBERSTONE
            </span>
            <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-semibold tracking-wider text-amber-700 uppercase">
              OS
            </span>
          </div>
          <span className="text-[10px] tracking-widest uppercase text-muted font-medium mt-0.5">
            Real Estate Operating System
          </span>
        </div>
      )}
    </NextLink>
  );
};

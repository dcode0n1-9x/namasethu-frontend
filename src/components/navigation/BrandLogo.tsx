import React from "react";
import NextLink from "next/link";
import { ShieldCheck } from "lucide-react";

export const BrandLogo: React.FC<{ className?: string }> = ({ className = "" }) => (
  <NextLink href="/" className={`inline-flex items-center gap-2 rounded-lg ${className}`} aria-label="Namasthetu home">
    <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-white">
      <ShieldCheck className="h-[18px] w-[18px]" strokeWidth={2.25} />
      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-brand" aria-hidden="true" />
    </span>
    <span className="text-lg font-semibold tracking-tight text-ink">Namasthetu</span>
  </NextLink>
);

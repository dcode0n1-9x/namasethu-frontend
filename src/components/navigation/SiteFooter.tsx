"use client";

import React from "react";
import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { Sparkles } from "lucide-react";

const COLUMNS = [
  {
    heading: "Explore",
    links: [
      { label: "Homes for sale", href: "/?mode=BUY" },
      { label: "Homes for rent", href: "/?mode=RENT" },
      { label: "Homes with 3D tours", href: "/?mode=3D_TWINS" },
      { label: "Map search", href: "/search" },
    ],
  },
  {
    heading: "For owners",
    links: [
      { label: "List your property", href: "/list-property" },
      { label: "Free price estimate", href: "/list-property#estimate" },
      { label: "How verification works", href: "/list-property#how-it-works" },
    ],
  },
  {
    heading: "Trust Pass",
    links: [
      { label: "Plans & pricing", href: "/trust-pass" },
      { label: "Accuracy guarantee", href: "/trust-pass#guarantee" },
      { label: "FAQ", href: "/trust-pass#faq" },
    ],
  },
];

export const SiteFooter: React.FC = () => {
  const replayIntro = () => {
    try {
      window.sessionStorage.removeItem("lux_intro_seen");
      const url = new URL(window.location.href);
      url.searchParams.set("intro", "1");
      window.location.href = url.toString();
    } catch {
      window.location.reload();
    }
  };

  return (
    <footer className="mt-24 border-t border-hairline bg-[#FAF9F6]">
      <div className="mx-auto max-w-[1760px] px-4 py-14 sm:px-8 md:px-12">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <BrandLogo variant="stacked" isHeader={false} />
            <div className="mt-3">
              <img
                src="/brand/amberstone-tagline-dark-web.png"
                alt="Where trust finds an address"
                className="h-3 w-auto object-contain opacity-85"
              />
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
              Institutional-grade real estate operating system bridging Indian Metros and Dubai Prime Freehold nodes. Every property is inspected on-site by a civil engineer, authenticated with 3D digital twins, and title-checked against state land records before escrow activation.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={replayIntro}
                className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-ink shadow-xs transition-colors hover:bg-neutral-50 hover:border-amber-500/50 cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                <span>Replay Brand Intro</span>
              </button>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="text-sm font-semibold text-ink">{col.heading}</h2>
              <ul className="mt-4 space-y-3 text-sm text-muted">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition-colors hover:text-ink hover:underline underline-offset-4">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-hairline pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Amberstone Technologies Pvt. Ltd. All rights reserved.</p>
          <p>Dubai Land Department (DLD) &bull; Kaveri 2.0 &bull; Mahabhulekh &bull; Real Estate Operating System &bull; DPDP Act 2023</p>
        </div>
      </div>
    </footer>
  );
};

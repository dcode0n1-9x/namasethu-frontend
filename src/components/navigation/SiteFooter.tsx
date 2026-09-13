import React from "react";
import Link from "next/link";
import { BrandLogo } from "./BrandLogo";

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

export const SiteFooter: React.FC = () => (
  <footer className="mt-24 border-t border-hairline bg-surface">
    <div className="mx-auto max-w-[1760px] px-4 py-14 sm:px-8 md:px-12">
      <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
        <div className="col-span-2">
          <BrandLogo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            Verified homes, listed directly by their owners. Every property is inspected on-site by a
            civil engineer and title-checked against state land records before it goes live.
          </p>
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
        <p>© 2026 Namasthetu Technologies Pvt. Ltd.</p>
        <p>Operating in Bengaluru &amp; Mumbai · RERA-compliant · DPDP Act 2023</p>
      </div>
    </div>
  </footer>
);

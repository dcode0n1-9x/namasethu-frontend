"use client";

import React from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { PropertyListing } from "@/types/property";
import { formatCompactINR, formatINR, paiseToRupees } from "@/lib/format";

/**
 * Half-width of the "likely range" shown around the AVM estimate.
 * Placeholder until the valuation API returns its own confidence interval.
 */
const ESTIMATE_BAND = 0.04;

export function priceComparison(property: PropertyListing) {
  const fair = paiseToRupees(property.valuation.fairMarketPricePaise);
  const listed = paiseToRupees(property.pricePaise);
  const format = (rupees: number) => (property.listingMode === "RENT" ? `${formatINR(rupees)}/mo` : formatCompactINR(rupees));
  return {
    fair,
    listed,
    low: fair * (1 - ESTIMATE_BAND),
    high: fair * (1 + ESTIMATE_BAND),
    diff: property.valuation.differencePercentage,
    format,
  };
}

export const PriceStatus: React.FC<{ diff: number }> = ({ diff }) => {
  if (diff <= -1) {
    return (
      <span className="pill-verified">
        <TrendingDown className="h-3.5 w-3.5" />
        {Math.abs(diff)}% below estimate
      </span>
    );
  }
  if (diff >= 1) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-semibold text-brand">
        <TrendingUp className="h-3.5 w-3.5" />
        {diff}% above estimate
      </span>
    );
  }
  return <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs font-semibold text-ink-soft">In line with estimate</span>;
};

/** Horizontal band: teal = likely range, navy pin = asking price. */
export const PriceBand: React.FC<{ property: PropertyListing }> = ({ property }) => {
  const { fair, listed, low, high, format } = priceComparison(property);
  const span = high - low;
  const min = low - span / 2;
  const max = high + span / 2;
  const pos = (value: number) => Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className="mt-4" aria-label={`Asking price ${format(listed)}; estimate ${format(fair)}, likely range ${format(low)} to ${format(high)}`}>
      <div className="relative h-2 rounded-full bg-surface-2">
        <div className="absolute inset-y-0 rounded-full bg-verified-strong/60" style={{ left: `${pos(low)}%`, width: `${pos(high) - pos(low)}%` }} />
        <div
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-ink shadow"
          style={{ left: `${pos(listed)}%` }}
          title={`Asking price ${format(listed)}`}
        />
      </div>
      <div className="relative mt-2 h-4 text-xs tabular-nums text-muted">
        <span className="absolute -translate-x-1/2" style={{ left: `${pos(low)}%` }}>
          {format(low)}
        </span>
        <span className="absolute -translate-x-1/2 font-medium text-ink" style={{ left: `${pos(fair)}%` }}>
          Est. {format(fair)}
        </span>
        <span className="absolute -translate-x-1/2" style={{ left: `${pos(high)}%` }}>
          {format(high)}
        </span>
      </div>
    </div>
  );
};

export const ValuationCard: React.FC<{ property: PropertyListing }> = ({ property }) => {
  const v = property.valuation;
  const isRent = property.listingMode === "RENT";
  const { fair, low, high, diff, format } = priceComparison(property);

  const [outlookValue, outlookNote] = v.projected5YrAppreciation.split(" (");

  const metrics = [
    !isRent && v.monthlyRentalEstimatePaise
      ? { label: "Estimated rent", value: `${formatINR(paiseToRupees(v.monthlyRentalEstimatePaise))}/mo` }
      : null,
    v.grossYieldPercentage ? { label: "Gross rental yield", value: `${v.grossYieldPercentage}%` } : null,
    { label: "5-year outlook", value: outlookValue, caption: outlookNote?.replace(/\)$/, "") },
    { label: "Comparable sales", value: String(v.historicalTransactionsCount), caption: "Registered nearby" },
  ].filter((m): m is { label: string; value: string; caption?: string } => m !== null);

  const costs = [
    property.stampDutyEstimate && { label: "Stamp duty (est.)", value: property.stampDutyEstimate },
    property.registrationEstimate && { label: "Registration fee (est.)", value: property.registrationEstimate },
    property.maintenanceMonthlyPaise && {
      label: "Society maintenance",
      value: `${formatINR(paiseToRupees(property.maintenanceMonthlyPaise))}/mo`,
    },
  ].filter((c): c is { label: string; value: string } => Boolean(c));

  return (
    <section className="panel flex flex-col p-6 sm:p-7" aria-labelledby="price-check-heading">
      <p className="eyebrow">Price check</p>
      <h2 id="price-check-heading" className="mt-1 text-xl font-semibold text-ink">
        Is the price fair?
      </h2>
      <p className="mt-1 text-sm text-muted">Estimated from registered sales of similar homes nearby.</p>

      <div className="mt-5 rounded-xl bg-surface p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted">Namasthetu estimate</p>
            <p className="font-display text-3xl font-bold tabular-nums text-ink">{format(fair)}</p>
            <p className="mt-1 text-sm tabular-nums text-muted">
              Likely range {format(low)} – {format(high)}
            </p>
          </div>
          <PriceStatus diff={diff} />
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl border border-hairline p-4">
            <dt className="text-xs font-medium text-muted">{m.label}</dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums text-ink">{m.value}</dd>
            {m.caption && <dd className="mt-0.5 line-clamp-2 text-xs text-muted">{m.caption}</dd>}
          </div>
        ))}
      </dl>

      {costs.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-ink">Other costs</h3>
          <dl className="mt-2 divide-y divide-hairline text-sm">
            {costs.map((c) => (
              <div key={c.label} className="flex justify-between gap-4 py-2.5">
                <dt className="text-muted">{c.label}</dt>
                <dd className="font-medium tabular-nums text-ink">{c.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </section>
  );
};

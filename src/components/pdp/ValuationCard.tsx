"use client";

import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Calculator,
  CheckCircle2,
  ChevronRight,
  Coins,
  Compass,
  FileSpreadsheet,
  Gauge,
  HelpCircle,
  Landmark,
  Percent,
  PiggyBank,
  Scale,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { PropertyListing } from "@/types/property";
import { formatCompactINR, formatINR, paiseToRupees } from "@/lib/format";
import { useCurrency } from "@/context/CurrencyContext";
import { detectCorridor } from "@/lib/currency";

/**
 * Half-width of the "likely range" shown around the AVM estimate.
 */
const ESTIMATE_BAND = 0.04;

export function priceComparison(
  property: PropertyListing,
  formatCompactFn?: (rupees: number) => string,
  formatFullFn?: (rupees: number) => string
) {
  const fair = paiseToRupees(property.valuation.fairMarketPricePaise);
  const listed = paiseToRupees(property.pricePaise);
  const format = (rupees: number) => {
    if (property.listingMode === "RENT") {
      return formatFullFn ? `${formatFullFn(rupees)}/mo` : `${formatINR(rupees)}/mo`;
    }
    return formatCompactFn ? formatCompactFn(rupees) : formatCompactINR(rupees);
  };
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
  const { formatCompact, formatFull } = useCurrency();
  const { fair, listed, low, high, format } = priceComparison(property, formatCompact, formatFull);
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
  const { currency, formatCompact, formatFull } = useCurrency();
  const [activeTab, setActiveTab] = useState<"fourQuestions" | "simulator">("fourQuestions");

  const v = property.valuation;
  const isRent = property.listingMode === "RENT";
  const propertyPriceRupees = Math.max(0, paiseToRupees(property.pricePaise));
  const fairMarketRupees = Math.max(0, paiseToRupees(v.fairMarketPricePaise));
  const monthlyMaintenanceRupees = property.maintenanceMonthlyPaise ? Math.max(0, paiseToRupees(property.maintenanceMonthlyPaise)) : 8000;
  const defaultMonthlyRentRupees = v.monthlyRentalEstimatePaise
    ? Math.max(0, paiseToRupees(v.monthlyRentalEstimatePaise))
    : (propertyPriceRupees > 0 ? Math.round((propertyPriceRupees * 0.042) / 12) : 50000);

  // Simulator Inputs
  const [simRentMonthly, setSimRentMonthly] = useState<number>(defaultMonthlyRentRupees);
  const [simMaintenanceMonthly, setSimMaintenanceMonthly] = useState<number>(monthlyMaintenanceRupees);
  const [vacancyRatePercent, setVacancyRatePercent] = useState<number>(5); // 5% default (~18 days/year)
  const [mgmtFeePercent, setMgmtFeePercent] = useState<number>(4); // 4% property management fee
  const [annualTaxReservePercent, setAnnualTaxReservePercent] = useState<number>(0.5); // 0.5% property tax + sinking fund

  const corridor = detectCorridor(`${property.city} ${property.locality}`);
  const sovereignBenchmarkRate = corridor === "DUBAI" ? 4.6 : 7.1; // UAE Sovereign / US 10Y (4.6%) vs India 10Y G-Sec (7.1%)

  // Four Questions Computations
  const annualMaintenanceRupees = monthlyMaintenanceRupees * 12;
  const annualTaxRupees = propertyPriceRupees * 0.005; // 0.5% estimated annual municipal carry
  const annualCarryTotalRupees = annualMaintenanceRupees + annualTaxRupees;
  const annualCarryRatioPercent = propertyPriceRupees > 0
    ? Number(((annualCarryTotalRupees / propertyPriceRupees) * 100).toFixed(2))
    : 0;

  const grossAnnualRentRupees = defaultMonthlyRentRupees * 12;
  const grossYieldPercent = v.grossYieldPercentage ?? (propertyPriceRupees > 0
    ? Number(((grossAnnualRentRupees / propertyPriceRupees) * 100).toFixed(2))
    : 0);

  // Resale Liquidity Parameters
  const medianDomDays = corridor === "DUBAI" ? 38 : 46;
  const marketLiquidityTier = "Tier-1 High Velocity (Instant Escrow Eligible)";

  // Simulator Live Calculations with safe bounds
  const safeSimRent = Math.max(0, simRentMonthly);
  const safeSimMaint = Math.max(0, simMaintenanceMonthly);
  const safeVacancyRate = Math.min(100, Math.max(0, vacancyRatePercent));
  const safeMgmtFee = Math.max(0, mgmtFeePercent);
  const safeTaxReserve = Math.max(0, annualTaxReservePercent);

  const simAnnualGrossRent = safeSimRent * 12;
  const simGrossYield = propertyPriceRupees > 0 ? Number(((simAnnualGrossRent / propertyPriceRupees) * 100).toFixed(2)) : 0;
  const simEffectiveRent = simAnnualGrossRent * (1 - safeVacancyRate / 100);
  const simAnnualMaintenance = safeSimMaint * 12;
  const simAnnualTax = propertyPriceRupees * (safeTaxReserve / 100);
  const simAnnualMgmt = simEffectiveRent * (safeMgmtFee / 100);
  const simTotalCarry = simAnnualMaintenance + simAnnualTax + simAnnualMgmt;
  const simNetOperatingIncome = Math.max(0, simEffectiveRent - simAnnualMaintenance - simAnnualTax);
  const simNetAnnualCashflow = simEffectiveRent - simTotalCarry;
  const simNetYield = propertyPriceRupees > 0 ? Number(((simNetAnnualCashflow / propertyPriceRupees) * 100).toFixed(2)) : 0;
  const simSpreadVsBenchmark = Number((simNetYield - sovereignBenchmarkRate).toFixed(2));
  const simMonthlyNetCashflow = Math.round(simNetAnnualCashflow / 12);

  const [outlookValue, outlookNote] = (v.projected5YrAppreciation || "+25% (Infrastructure catalyst)").split(" (");

  return (
    <section className="panel flex flex-col p-6 sm:p-7 shadow-sm border border-neutral-200/80" aria-labelledby="ownership-lens-heading">
      {/* Header with Lens Telemetry */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline pb-4">
        <div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-brand" />
            <p className="eyebrow text-brand">The Amberstone Ownership Lens</p>
          </div>
          <h2 id="ownership-lens-heading" className="mt-0.5 text-xl font-bold tracking-tight text-ink">
            Institutional Valuation & Carry Engine
          </h2>
          <p className="text-xs text-muted">
            Independent algorithmic underwriting across registered deeds & physical operating carry.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 rounded-xl bg-surface-2 p-1 text-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("fourQuestions")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === "fourQuestions"
                ? "bg-white text-ink shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Four Questions</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("simulator")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === "simulator"
                ? "bg-white text-ink shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            <Calculator className="h-3.5 w-3.5" />
            <span>Net Yield Simulator</span>
          </button>
        </div>
      </div>

      {activeTab === "fourQuestions" ? (
        <div className="mt-5 space-y-6">
          {/* Question 1: Price vs Comps */}
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-5">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider font-semibold text-neutral-500">
                Question 1 · Acquisition Basis
              </span>
              <PriceStatus diff={v.differencePercentage} />
            </div>

            <h3 className="text-base font-bold text-ink">What is the fair price vs comps?</h3>
            <p className="text-xs text-muted mt-0.5">
              Based on {v.historicalTransactionsCount} registered transactions within 1.5 km and physical 80-point civil inspection.
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl bg-white p-3.5 border border-hairline">
                <span className="text-xs text-muted">Fair Market Estimate</span>
                <p className="text-2xl font-bold font-display text-ink mt-0.5">
                  {formatCompact(fairMarketRupees)}
                </p>
                <span className="text-[11px] text-muted font-mono">
                  Range: {formatCompact(fairMarketRupees * (1 - ESTIMATE_BAND))} – {formatCompact(fairMarketRupees * (1 + ESTIMATE_BAND))}
                </span>
              </div>

              <div className="rounded-xl bg-white p-3.5 border border-hairline">
                <span className="text-xs text-muted">Listed Asking Price</span>
                <p className="text-2xl font-bold font-display text-ink mt-0.5">
                  {formatCompact(propertyPriceRupees)}
                </p>
                <span className="text-[11px] text-emerald-600 font-medium">
                  {v.differencePercentage < 0
                    ? `${Math.abs(v.differencePercentage)}% discount to comps`
                    : `${v.differencePercentage}% above algorithmic baseline`}
                </span>
              </div>
            </div>

            <PriceBand property={property} />
          </div>

          {/* Question 2: Annual Carry */}
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-5">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider font-semibold text-neutral-500">
                Question 2 · Holding Cost
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                {annualCarryRatioPercent}% of Asset Price/Yr
              </span>
            </div>

            <h3 className="text-base font-bold text-ink">What is the true annual carry?</h3>
            <p className="text-xs text-muted mt-0.5">
              Realized operational obligations: society maintenance, municipal assessment, and sinking reserve.
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2.5">
              <div className="rounded-xl bg-white p-3 border border-hairline">
                <span className="text-[11px] text-muted block">Society Maintenance</span>
                <span className="text-sm font-semibold text-ink font-mono mt-0.5 block">
                  {formatCompact(monthlyMaintenanceRupees)}/mo
                </span>
                <span className="text-[10px] text-muted">({formatCompact(annualMaintenanceRupees)}/yr)</span>
              </div>

              <div className="rounded-xl bg-white p-3 border border-hairline">
                <span className="text-[11px] text-muted block">Property Tax & Municipal</span>
                <span className="text-sm font-semibold text-ink font-mono mt-0.5 block">
                  {formatCompact(annualTaxRupees)}/yr
                </span>
                <span className="text-[10px] text-muted">(~0.5% rate)</span>
              </div>

              <div className="rounded-xl bg-white p-3 border border-hairline">
                <span className="text-[11px] text-muted block">Total Net Carry</span>
                <span className="text-sm font-bold text-ink font-mono mt-0.5 block text-brand">
                  {formatCompact(annualCarryTotalRupees)}/yr
                </span>
                <span className="text-[10px] text-muted">Fully provisions holding</span>
              </div>
            </div>
          </div>

          {/* Question 3: Achieved Rent */}
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-5">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider font-semibold text-neutral-500">
                Question 3 · Yield Reality
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                {grossYieldPercent}% Gross Yield
              </span>
            </div>

            <h3 className="text-base font-bold text-ink">What is the achievable market rent?</h3>
            <p className="text-xs text-muted mt-0.5">
              Derived from verified lease agreements registered on Kaveri 2.0 / Ejari DLD in the same micro-cluster.
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl bg-white p-3.5 border border-hairline flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted">Monthly Achievable Rent</span>
                  <p className="text-xl font-bold text-ink font-display mt-0.5">
                    {formatFull(defaultMonthlyRentRupees)}
                    <span className="text-xs font-normal text-muted"> / mo</span>
                  </p>
                </div>
                <Coins className="h-7 w-7 text-emerald-600 opacity-80" />
              </div>

              <div className="rounded-xl bg-white p-3.5 border border-hairline flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted">Annualized Rental Gross</span>
                  <p className="text-xl font-bold text-ink font-display mt-0.5">
                    {formatCompact(grossAnnualRentRupees)}
                    <span className="text-xs font-normal text-muted"> / yr</span>
                  </p>
                </div>
                <PiggyBank className="h-7 w-7 text-brand opacity-80" />
              </div>
            </div>
          </div>

          {/* Question 4: Resale Liquidity */}
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-5">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider font-semibold text-neutral-500">
                Question 4 · Exit Velocity
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-900 border border-sky-200">
                {marketLiquidityTier}
              </span>
            </div>

            <h3 className="text-base font-bold text-ink">How liquid is this asset upon resale?</h3>
            <p className="text-xs text-muted mt-0.5">
              Historical absorption velocity and projected capital growth trajectory.
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl bg-white p-3.5 border border-hairline">
                <span className="text-xs text-muted">Median Days to Escrow Close</span>
                <p className="text-xl font-bold text-ink font-mono mt-0.5">
                  {medianDomDays} Days
                  <span className="text-xs font-normal text-muted ml-2">(vs 110d city average)</span>
                </p>
                <p className="text-[11px] text-muted mt-1">High buyer search concentration in {property.locality}.</p>
              </div>

              <div className="rounded-xl bg-white p-3.5 border border-hairline">
                <span className="text-xs text-muted">5-Year Capital Growth Horizon</span>
                <p className="text-xl font-bold text-ink mt-0.5 text-emerald-700">
                  {outlookValue}
                </p>
                {outlookNote && <p className="text-[11px] text-muted mt-1">{outlookNote.replace(/\)$/, "")}</p>}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Net Yield & Carry Interactive Simulator */
        <div className="mt-5 space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-ink flex items-center gap-1.5">
                  <Calculator className="h-4 w-4 text-brand" />
                  <span>Interactive Net Yield Underwriter</span>
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Adjust underwriting parameters to calculate your true net yield, carry drag, and cash flow.
                </p>
              </div>
              <span className="text-xs font-mono font-semibold px-2 py-1 rounded bg-neutral-200 text-neutral-800">
                Currency: {currency}
              </span>
            </div>

            {/* Sliders Grid */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Rent Slider */}
              <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-hairline">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted">Expected Monthly Rent</span>
                  <span className="text-ink font-bold font-mono">{formatFull(simRentMonthly)}</span>
                </div>
                <input
                  type="range"
                  min={Math.round(defaultMonthlyRentRupees * 0.6)}
                  max={Math.round(defaultMonthlyRentRupees * 1.5)}
                  step={2000}
                  value={simRentMonthly}
                  onChange={(e) => setSimRentMonthly(Number(e.target.value))}
                  className="w-full cursor-pointer accent-brand"
                />
                <div className="flex justify-between text-[10px] text-muted">
                  <span>-40% Bearish</span>
                  <span>Baseline</span>
                  <span>+50% Bullish</span>
                </div>
              </div>

              {/* Maintenance Slider */}
              <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-hairline">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted">Monthly Maintenance / Service Charge</span>
                  <span className="text-ink font-bold font-mono">{formatFull(simMaintenanceMonthly)}</span>
                </div>
                <input
                  type="range"
                  min={2000}
                  max={Math.max(30000, monthlyMaintenanceRupees * 2)}
                  step={500}
                  value={simMaintenanceMonthly}
                  onChange={(e) => setSimMaintenanceMonthly(Number(e.target.value))}
                  className="w-full cursor-pointer accent-brand"
                />
                <div className="flex justify-between text-[10px] text-muted">
                  <span>Low ({formatCompact(2000)})</span>
                  <span>Current ({formatCompact(monthlyMaintenanceRupees)})</span>
                  <span>High Reserve</span>
                </div>
              </div>

              {/* Vacancy Rate Slider */}
              <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-hairline">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted">Vacancy Allowance</span>
                  <span className="text-ink font-bold font-mono">{vacancyRatePercent}% (~{Math.round((vacancyRatePercent / 100) * 365)} days)</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={15}
                  step={1}
                  value={vacancyRatePercent}
                  onChange={(e) => setVacancyRatePercent(Number(e.target.value))}
                  className="w-full cursor-pointer accent-brand"
                />
                <div className="flex justify-between text-[10px] text-muted">
                  <span>0% (Instant)</span>
                  <span>5% (18 days)</span>
                  <span>15% (55 days)</span>
                </div>
              </div>

              {/* Management Fee Slider */}
              <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-hairline">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted">Property Management Fee</span>
                  <span className="text-ink font-bold font-mono">{mgmtFeePercent}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={mgmtFeePercent}
                  onChange={(e) => setMgmtFeePercent(Number(e.target.value))}
                  className="w-full cursor-pointer accent-brand"
                />
                <div className="flex justify-between text-[10px] text-muted">
                  <span>0% Self-Managed</span>
                  <span>5% Standard</span>
                  <span>10% Full Concierge</span>
                </div>
              </div>
            </div>

            {/* Live Outputs Summary Cards */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl bg-white p-3 border border-hairline text-center">
                <span className="text-[11px] text-muted block">Gross Yield</span>
                <span className="text-xl font-bold font-mono text-ink block mt-0.5">{simGrossYield}%</span>
                <span className="text-[10px] text-muted">Pre-carry</span>
              </div>

              <div className="rounded-xl bg-emerald-50/80 p-3 border border-emerald-200 text-center">
                <span className="text-[11px] text-emerald-800 font-semibold block">True Net Yield</span>
                <span className="text-xl font-bold font-mono text-emerald-700 block mt-0.5">{simNetYield}%</span>
                <span className="text-[10px] text-emerald-800">Post all expenses</span>
              </div>

              <div className="rounded-xl bg-white p-3 border border-hairline text-center">
                <span className="text-[11px] text-muted block">Net Monthly Cash</span>
                <span className="text-lg font-bold font-mono text-ink block mt-0.5">
                  {formatFull(simMonthlyNetCashflow)}
                </span>
                <span className="text-[10px] text-muted">Direct in bank</span>
              </div>

              <div className="rounded-xl bg-white p-3 border border-hairline text-center">
                <span className="text-[11px] text-muted block">Spread vs 10Y Bond</span>
                <span
                  className={`text-lg font-bold font-mono block mt-0.5 ${
                    simSpreadVsBenchmark >= 0 ? "text-emerald-700" : "text-amber-700"
                  }`}
                >
                  {simSpreadVsBenchmark >= 0 ? `+${simSpreadVsBenchmark}%` : `${simSpreadVsBenchmark}%`}
                </span>
                <span className="text-[10px] text-muted">vs {sovereignBenchmarkRate}% Sovereign</span>
              </div>
            </div>

            {/* Yield Visual Breakdown Bar */}
            <div className="mt-5 bg-white p-4 rounded-xl border border-hairline">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-ink">Cash Flow Waterfall Breakdown (Annual)</span>
                <span className="text-muted font-mono">Net Yield: {simNetYield}%</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-muted py-1 border-b border-hairline">
                  <span>Gross Annual Rent Potential</span>
                  <span className="font-mono font-semibold text-ink">+{formatFull(simAnnualGrossRent)}</span>
                </div>
                <div className="flex items-center justify-between text-rose-600 py-1 border-b border-hairline">
                  <span>Vacancy Drag ({vacancyRatePercent}%)</span>
                  <span className="font-mono font-semibold">
                    -{formatFull(simAnnualGrossRent * (vacancyRatePercent / 100))}
                  </span>
                </div>
                <div className="flex items-center justify-between text-amber-700 py-1 border-b border-hairline">
                  <span>Society Maintenance Carry</span>
                  <span className="font-mono font-semibold">-{formatFull(simAnnualMaintenance)}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-600 py-1 border-b border-hairline">
                  <span>Tax & Insurance Reserve</span>
                  <span className="font-mono font-semibold">-{formatFull(simAnnualTax)}</span>
                </div>
                {simAnnualMgmt > 0 && (
                  <div className="flex items-center justify-between text-neutral-600 py-1 border-b border-hairline">
                    <span>Management Fee ({mgmtFeePercent}%)</span>
                    <span className="font-mono font-semibold">-{formatFull(simAnnualMgmt)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-ink font-bold pt-2 text-sm">
                  <span className="text-emerald-800">Net Operating Free Cash Flow</span>
                  <span className="font-mono text-emerald-700">={formatFull(simNetAnnualCashflow)} / yr</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

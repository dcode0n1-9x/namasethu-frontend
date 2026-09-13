"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, CircleCheck, FileText, Landmark, LoaderCircle, Phone, ShieldCheck, TrendingUp } from "lucide-react";
import { GlobalHeader } from "@/components/navigation/GlobalHeader";
import { SiteFooter } from "@/components/navigation/SiteFooter";
import { Faq } from "@/components/ui/Faq";

type Tier = "SINGLE" | "MONTHLY";

const TIERS: { id: Tier; name: string; price: string; period: string; description: string; features: string[]; recommended?: boolean }[] = [
  {
    id: "SINGLE",
    name: "Single home",
    price: "₹299",
    period: "one-time",
    description: "For when you've found the one and want the full picture.",
    features: ["Owner's phone and WhatsApp", "Full 20-page inspection report", "Title documents and land-record history", "Detailed price estimate"],
  },
  {
    id: "MONTHLY",
    name: "Trust Pass",
    price: "₹999",
    period: "per month",
    description: "For active searches across Bengaluru and Mumbai.",
    features: [
      "Everything in Single home, for every listing",
      "Engineer-accompanied site visits",
      "Room measurements in 3D tours",
      "Cancel any time",
    ],
    recommended: true,
  },
];

const UNLOCKS = [
  { icon: Phone, title: "Owner contact", body: "Call or WhatsApp the verified owner directly." },
  { icon: FileText, title: "Inspection report", body: "Every test, photo and defect our engineer recorded." },
  { icon: Landmark, title: "Title history", body: "Sale deeds, loan closures and the encumbrance certificate." },
  { icon: TrendingUp, title: "Price analysis", body: "Our estimate, likely range and comparable sales." },
];

const FAQS = [
  { question: "Can I cancel my monthly pass?", answer: "Yes. Cancel from your account in one click. There's no lock-in and you keep access until the end of the billing month." },
  {
    question: "How do you verify owners?",
    answer:
      "Every owner signs in with DigiLocker (Aadhaar-based), and we match their name against the sale deed and state land records — Kaveri 2.0 in Karnataka and Mahabhulekh in Maharashtra.",
  },
  {
    question: "What does the accuracy guarantee cover?",
    answer:
      "If you visit a home and find an active structural crack or water leak that our inspection report missed, we refund your pass within 24 hours.",
  },
  { question: "Is my payment secure?", answer: "Payments are processed by Razorpay. We never see or store your card or UPI details." },
];

export default function TrustPassPage() {
  const [processing, setProcessing] = useState<Tier | null>(null);
  const [purchased, setPurchased] = useState<Tier | null>(null);

  // Simulated checkout — replace with the live Razorpay SDK.
  const handlePurchase = (tier: Tier) => {
    setProcessing(tier);
    setTimeout(() => {
      setProcessing(null);
      setPurchased(tier);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white">
      <GlobalHeader />
      <div className="h-20" />

      <main className="mx-auto max-w-[1100px] px-4 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-brand">Trust Pass</p>
          <h1 className="mt-3 text-4xl font-bold leading-[1.1] text-ink sm:text-5xl">Know everything before you visit.</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            A broker typically charges 1–2% and checks nothing. Trust Pass gives you the owner&apos;s number, the engineer&apos;s
            report and the full title history — for a fraction of that.
          </p>
        </div>

        {purchased && (
          <div role="status" className="mx-auto mt-10 flex max-w-3xl flex-col items-start justify-between gap-4 rounded-2xl border border-verified/25 bg-verified-soft p-6 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <CircleCheck className="mt-0.5 h-6 w-6 shrink-0 text-verified" />
              <div>
                <p className="font-semibold text-ink">{purchased === "MONTHLY" ? "Trust Pass is active" : "Single home pass purchased"}</p>
                <p className="text-sm text-muted">Owner contacts and full reports are now unlocked.</p>
              </div>
            </div>
            <Link href="/" className="btn btn-dark btn-sm">
              Browse homes
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`relative flex flex-col rounded-2xl bg-white p-8 ${
                tier.recommended ? "shadow-[0_0_0_2px_var(--color-ink),0_20px_40px_-12px_rgb(15_23_42/0.18)]" : "border border-hairline"
              }`}
            >
              {tier.recommended && (
                <span className="absolute -top-3 left-8 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">Most popular</span>
              )}
              <h2 className="text-lg font-semibold text-ink">{tier.name}</h2>
              <p className="mt-1 text-sm text-muted">{tier.description}</p>
              <p className="mt-6 flex items-baseline gap-1.5">
                <span className="font-display text-5xl font-bold tracking-tight text-ink">{tier.price}</span>
                <span className="text-sm text-muted">{tier.period}</span>
              </p>
              <ul className="mt-6 flex-1 space-y-3 border-t border-hairline pt-6">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[15px] text-ink">
                    <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-verified" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => handlePurchase(tier.id)}
                disabled={processing !== null}
                className={`btn mt-8 w-full py-3.5 text-[15px] ${tier.recommended ? "btn-dark" : "btn-outline"}`}
              >
                {processing === tier.id && <LoaderCircle className="h-4 w-4 animate-spin" />}
                {processing === tier.id ? "Processing…" : tier.id === "MONTHLY" ? "Get Trust Pass" : "Buy for one home"}
              </button>
            </div>
          ))}
        </div>

        <section className="mt-20" aria-labelledby="unlock-heading">
          <h2 id="unlock-heading" className="text-center text-2xl font-bold text-ink">
            What you unlock
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {UNLOCKS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl bg-surface p-6">
                <Icon className="h-6 w-6 text-ink" />
                <h3 className="mt-4 font-semibold text-ink">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="guarantee" className="mt-16 scroll-mt-28">
          <div className="flex flex-col gap-5 rounded-2xl bg-ink p-8 text-white sm:flex-row sm:items-center">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <ShieldCheck className="h-6 w-6 text-teal-300" />
            </span>
            <div>
              <h2 className="text-xl font-bold">Inspection accuracy guarantee</h2>
              <p className="mt-1 max-w-2xl text-slate-300">
                If you find an active structural crack or water leak that our inspection report missed, we refund your pass within 24 hours.
              </p>
            </div>
          </div>
        </section>

        <section id="faq" className="mt-20 scroll-mt-28">
          <div className="grid gap-10 lg:grid-cols-3">
            <h2 className="text-2xl font-bold text-ink">Frequently asked questions</h2>
            <div className="lg:col-span-2">
              <Faq items={FAQS} />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

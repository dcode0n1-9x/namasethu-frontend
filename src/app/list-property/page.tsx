"use client";

import React, { useState } from "react";
import { ArrowRight, BadgeCheck, CircleCheck, FileCheck2, HardHat, Users } from "lucide-react";
import { GlobalHeader } from "@/components/navigation/GlobalHeader";
import { SiteFooter } from "@/components/navigation/SiteFooter";
import { ValuationCalculator } from "@/components/owner/ValuationCalculator";
import { ComparisonTable } from "@/components/owner/ComparisonTable";
import { Dialog } from "@/components/ui/Dialog";
import { Faq } from "@/components/ui/Faq";

const STEPS = [
  {
    icon: BadgeCheck,
    title: "Verify ownership",
    body: "Sign in with DigiLocker. We match your sale deed to state land records and link your home to its 14-digit ULPIN.",
  },
  {
    icon: HardHat,
    title: "Get inspected",
    body: "A certified civil engineer visits within 24 hours for an 80-point inspection and records a 3D walkthrough.",
  },
  {
    icon: Users,
    title: "Meet verified buyers",
    body: "Your listing goes live. Only identity-verified buyers can contact you, and token payments are held in escrow.",
  },
];

const HERO_POINTS = ["Free to list, no commission", "Your number stays private", "Inspection and 3D tour included"];

const FAQS = [
  {
    question: "Why is listing free for owners?",
    answer:
      "Buyers pay for Trust Pass to unlock owner contact and full reports. Keeping listings free for owners means we get genuine, owner-listed homes instead of broker inventory.",
  },
  {
    question: "Who can see my phone number?",
    answer:
      "Only buyers who have verified their identity through DigiLocker and bought a Trust Pass. Brokers and anonymous visitors never see it.",
  },
  {
    question: "What if the inspection finds problems?",
    answer:
      "Minor issues are listed in the report with an estimated repair cost. Buyers consistently respond better to an honest report than to surprises after booking.",
  },
  {
    question: "How long does it take to go live?",
    answer: "Most homes are live within 5 days: ownership verification the same day, inspection within 24 hours, and the report within 48 hours of the visit.",
  },
];

const AUDIT_SLOTS = ["Tomorrow, 10:00 AM", "Tomorrow, 2:30 PM", "Saturday, 11:00 AM", "Sunday, 3:00 PM"];

export default function ListPropertyPage() {
  const [onboardOpen, setOnboardOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [slot, setSlot] = useState(AUDIT_SLOTS[0]);
  const [submitted, setSubmitted] = useState(false);

  const startListing = () => {
    setStep(1);
    setSubmitted(false);
    setOnboardOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) setStep(2);
    else setSubmitted(true);
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-[15px] text-ink placeholder:text-slate-400 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink";

  return (
    <div className="min-h-screen bg-white">
      <GlobalHeader />
      <div className="h-20" />

      <section className="mx-auto grid max-w-[1200px] items-center gap-12 px-4 py-14 sm:px-8 lg:grid-cols-2 lg:py-20">
        <div>
          <p className="eyebrow text-brand">For owners</p>
          <h1 className="mt-3 text-4xl font-bold leading-[1.1] text-ink sm:text-5xl">Sell or rent your home without a broker.</h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
            We inspect your home, verify your title and build a 3D walkthrough, then connect you directly with buyers
            who have verified their identity.
          </p>
          <ul className="mt-6 space-y-2.5">
            {HERO_POINTS.map((point) => (
              <li key={point} className="flex items-center gap-2.5 text-[15px] text-ink">
                <CircleCheck className="h-5 w-5 text-verified" />
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={startListing} className="btn btn-dark px-6 py-3.5 text-[15px]">
              List your property
              <ArrowRight className="h-4 w-4" />
            </button>
            <a href="#how-it-works" className="btn btn-outline px-6 py-3.5 text-[15px]">
              How it works
            </a>
          </div>
        </div>

        <ValuationCalculator onStartListing={startListing} />
      </section>

      <section id="how-it-works" className="scroll-mt-20 border-y border-hairline bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-2 text-3xl font-bold text-ink">Live in about five days</h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="panel p-6">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-sm text-muted">0{i + 1}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-8 sm:py-20">
        <p className="eyebrow">Compare</p>
        <h2 className="mt-2 text-3xl font-bold text-ink">Why owners choose Amberstone</h2>
        <p className="mt-2 max-w-2xl text-[15px] text-muted">
          Portals and brokers earn from leads. We earn when buyers trust what they see, so every listing is verified first.
        </p>
        <div className="mt-8">
          <ComparisonTable />
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 pb-4 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-3">
          <div>
            <p className="eyebrow">FAQ</p>
            <h2 className="mt-2 text-3xl font-bold text-ink">Questions from owners</h2>
          </div>
          <div className="lg:col-span-2">
            <Faq items={FAQS} />
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-[1200px] px-4 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-ink px-8 py-10 text-white sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold">Ready to list?</h2>
            <p className="mt-1 text-slate-300">It takes about 3 minutes to start. No fees, no brokers.</p>
          </div>
          <button type="button" onClick={startListing} className="btn btn-primary px-6 py-3.5 text-[15px]">
            Start verification
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <SiteFooter />

      <Dialog
        open={onboardOpen}
        onClose={() => setOnboardOpen(false)}
        title={submitted ? "Application received" : step === 1 ? "Tell us about your property" : "Book your inspection"}
        description={submitted ? undefined : `Step ${step} of 2`}
        size="md"
      >
        {submitted ? (
          <div className="px-6 py-10 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-verified-soft text-verified">
              <CircleCheck className="h-7 w-7" />
            </span>
            <p className="mt-4 font-semibold text-ink">We&apos;ll call you within 2 hours</p>
            <p className="mt-1 text-sm text-muted">
              Our inspection coordinator will confirm your {slot} slot at {ownerPhone}.
            </p>
            <button type="button" onClick={() => setOnboardOpen(false)} className="btn btn-outline mt-6">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
            <div className="flex gap-2" aria-hidden="true">
              <span className="h-1 flex-1 rounded-full bg-ink" />
              <span className={`h-1 flex-1 rounded-full ${step === 2 ? "bg-ink" : "bg-surface-2"}`} />
            </div>

            {step === 1 ? (
              <>
                <div>
                  <label htmlFor="owner-name" className="mb-1.5 block text-sm font-semibold text-ink">
                    Full name (as on Aadhaar)
                  </label>
                  <input id="owner-name" autoComplete="name" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} required className={inputClass} />
                </div>
                <div>
                  <label htmlFor="owner-phone" className="mb-1.5 block text-sm font-semibold text-ink">
                    Mobile number
                  </label>
                  <input
                    id="owner-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+91 98450 12345"
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    required
                    className={inputClass}
                  />
                  <p className="mt-1 text-xs text-muted">We&apos;ll send a DigiLocker verification link to this number.</p>
                </div>
                <div>
                  <label htmlFor="owner-address" className="mb-1.5 block text-sm font-semibold text-ink">
                    Property address
                  </label>
                  <input
                    id="owner-address"
                    autoComplete="street-address"
                    placeholder="Building, flat number, locality, city"
                    value={propertyAddress}
                    onChange={(e) => setPropertyAddress(e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>
                <button type="submit" className="btn btn-dark w-full">
                  Continue
                </button>
              </>
            ) : (
              <>
                <div className="flex items-start gap-3 rounded-xl bg-surface p-4 text-sm text-muted">
                  <FileCheck2 className="mt-0.5 h-5 w-5 shrink-0 text-verified" />
                  <p>
                    By continuing, you authorise us to look up land records for{" "}
                    <span className="font-medium text-ink">{propertyAddress}</span> using your DigiLocker identity.
                  </p>
                </div>
                <fieldset>
                  <legend className="mb-2 text-sm font-semibold text-ink">Preferred inspection slot</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {AUDIT_SLOTS.map((s) => (
                      <button key={s} type="button" aria-pressed={slot === s} onClick={() => setSlot(s)} className="chip justify-center rounded-lg">
                        {s}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setStep(1)} className="btn btn-outline flex-1">
                    Back
                  </button>
                  <button type="submit" className="btn btn-dark flex-1">
                    Book inspection
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </Dialog>
    </div>
  );
}

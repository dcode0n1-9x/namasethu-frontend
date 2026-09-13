"use client";

import React, { useEffect, useState } from "react";
import { CircleCheck, LoaderCircle, Lock, ShieldCheck } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";

interface GatedUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle: string;
  ulpin: string;
  onSuccess: () => void;
}

type Plan = "SINGLE_PIP" | "TRUST_PASS_MONTHLY";

const PLANS: { id: Plan; name: string; price: string; period?: string; description: string; badge?: string }[] = [
  { id: "SINGLE_PIP", name: "This home", price: "₹299", description: "One-time. Lifetime access to this property." },
  { id: "TRUST_PASS_MONTHLY", name: "Trust Pass", price: "₹999", period: "/month", description: "Unlimited homes. Cancel any time.", badge: "Best for active search" },
];

const BENEFITS = [
  "Owner's phone number and WhatsApp",
  "Full 20-page inspection report with photos",
  "Title documents and land-record history",
  "Detailed price estimate and comparable sales",
];

export const GatedUnlockModal: React.FC<GatedUnlockModalProps> = ({ isOpen, onClose, propertyTitle, ulpin, onSuccess }) => {
  const [plan, setPlan] = useState<Plan>("SINGLE_PIP");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsDone(false);
      setIsProcessing(false);
    }
  }, [isOpen]);

  // Simulated Razorpay checkout — replace with the live SDK.
  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
      onSuccess();
    }, 1200);
  };

  const selected = PLANS.find((p) => p.id === plan)!;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title={isDone ? "You're all set" : "Unlock the full property record"}
      description={isDone ? undefined : propertyTitle}
      size="md"
      footer={
        isDone ? (
          <button type="button" onClick={onClose} className="btn btn-dark w-full">
            Continue
          </button>
        ) : (
          <div className="space-y-3">
            <button type="button" onClick={handleCheckout} disabled={isProcessing} className="btn btn-primary w-full py-3.5 text-[15px]">
              {isProcessing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              {isProcessing ? "Processing payment…" : `Pay ${selected.price} securely`}
            </button>
            <p className="flex items-center justify-center gap-1.5 text-xs text-muted">
              <ShieldCheck className="h-3.5 w-3.5 text-verified" />
              Payments by Razorpay · refund if our inspection was wrong
            </p>
          </div>
        )
      }
    >
      {isDone ? (
        <div className="px-6 py-10 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-verified-soft text-verified">
            <CircleCheck className="h-7 w-7" />
          </span>
          <p className="mt-4 font-semibold text-ink">Owner contact and full report unlocked</p>
          <p className="mt-1 text-sm text-muted">You can now call or WhatsApp the owner directly.</p>
        </div>
      ) : (
        <div className="space-y-6 px-6 py-6">
          <ul className="space-y-2.5">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-sm text-ink">
                <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-verified" />
                {b}
              </li>
            ))}
          </ul>

          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-ink">Choose an option</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {PLANS.map((p) => {
                const active = plan === p.id;
                return (
                  <label
                    key={p.id}
                    className={`relative cursor-pointer rounded-xl p-4 transition-shadow ${
                      active ? "shadow-[inset_0_0_0_2px_var(--color-ink)]" : "shadow-[inset_0_0_0_1px_#cbd5e1] hover:shadow-[inset_0_0_0_1px_var(--color-ink)]"
                    }`}
                  >
                    <input type="radio" name="unlock-plan" value={p.id} checked={active} onChange={() => setPlan(p.id)} className="sr-only" />
                    {p.badge && (
                      <span className="absolute -top-2.5 right-3 rounded-full bg-brand px-2 py-0.5 text-[10px] font-semibold text-white">{p.badge}</span>
                    )}
                    <span className="block text-sm font-medium text-muted">{p.name}</span>
                    <span className="mt-1 block font-display text-2xl font-bold text-ink">
                      {p.price}
                      {p.period && <span className="text-sm font-medium text-muted">{p.period}</span>}
                    </span>
                    <span className="mt-1 block text-xs text-muted">{p.description}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <p className="font-mono text-xs text-muted">ULPIN {ulpin}</p>
        </div>
      )}
    </Dialog>
  );
};

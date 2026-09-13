"use client";

import React, { useState } from "react";
import { CalendarCheck, CircleCheck, Lock, MessageCircle, Phone, Rotate3d, ShieldCheck } from "lucide-react";
import { PropertyListing } from "@/types/property";
import { Dialog } from "@/components/ui/Dialog";

interface ContactActionsProps {
  property: PropertyListing;
  isUnlocked: boolean;
  onUnlockClick: () => void;
  onLaunch3d?: () => void;
  /** Single-row layout for the sticky action bar. */
  compact?: boolean;
}

const VISIT_SLOTS = ["Tomorrow, 10:30 AM", "Tomorrow, 2:00 PM", "Saturday, 11:00 AM", "Sunday, 4:30 PM"];

export const ContactActions: React.FC<ContactActionsProps> = ({ property, isUnlocked, onUnlockClick, onLaunch3d, compact = false }) => {
  const [visitOpen, setVisitOpen] = useState(false);
  const [slot, setSlot] = useState(VISIT_SLOTS[2]);
  const [visitBooked, setVisitBooked] = useState(false);

  const ownerPhone = property.owner.unredactedPhone || "";
  const rawWa = property.owner.unredactedWhatsApp || property.owner.unredactedPhone || "";
  const digitsOnly = rawWa.replace(/\D/g, "");
  const waNumber = digitsOnly.startsWith("91") ? digitsOnly : `91${digitsOnly}`;
  const waText = encodeURIComponent(`Hi ${property.owner.fullName}, I'm interested in ${property.title} on Namasthetu.`);
  const waHref = `https://wa.me/${waNumber}?text=${waText}`;

  const openVisit = () => {
    setVisitBooked(false);
    setVisitOpen(true);
  };

  const visitDialog = (
    <Dialog
      open={visitOpen}
      onClose={() => setVisitOpen(false)}
      title="Book a site visit"
      description="A Namasthetu engineer joins you on the visit at no extra cost."
      size="sm"
    >
      {visitBooked ? (
        <div className="px-6 py-10 text-center">
          <CircleCheck className="mx-auto h-10 w-10 text-verified" />
          <p className="mt-3 font-semibold text-ink">Visit requested for {slot}</p>
          <p className="mt-1 text-sm text-muted">We&apos;ll confirm by SMS within 2 hours.</p>
          <button type="button" onClick={() => setVisitOpen(false)} className="btn btn-outline mt-6">
            Done
          </button>
        </div>
      ) : (
        <form
          className="space-y-5 px-6 py-6"
          onSubmit={(e) => {
            e.preventDefault();
            setVisitBooked(true);
          }}
        >
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-ink">Choose a slot</legend>
            <div className="grid grid-cols-2 gap-2">
              {VISIT_SLOTS.map((s) => (
                <button key={s} type="button" aria-pressed={slot === s} onClick={() => setSlot(s)} className="chip justify-center rounded-lg">
                  {s}
                </button>
              ))}
            </div>
          </fieldset>
          <div>
            <label htmlFor="visit-phone" className="mb-1.5 block text-sm font-semibold text-ink">
              Mobile number
            </label>
            <input
              id="visit-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+91 98765 43210"
              required
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
            />
          </div>
          <button type="submit" className="btn btn-dark w-full">
            Request visit
          </button>
        </form>
      )}
    </Dialog>
  );

  if (compact) {
    return (
      <div className="flex shrink-0 items-center gap-2">
        <button type="button" onClick={openVisit} className="btn btn-outline btn-sm hidden sm:inline-flex">
          <CalendarCheck className="h-4 w-4" />
          Book visit
        </button>
        {isUnlocked ? (
          <a href={waHref} target="_blank" rel="noreferrer" className="btn btn-sm bg-[#25D366] text-white hover:bg-[#1ebe5d]">
            <MessageCircle className="h-4 w-4" />
            WhatsApp owner
          </a>
        ) : (
          <button type="button" onClick={onUnlockClick} className="btn btn-dark btn-sm">
            <Lock className="h-4 w-4" />
            Contact owner
          </button>
        )}
        {visitDialog}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {isUnlocked ? (
        <div className="rounded-xl border border-verified/25 bg-verified-soft p-4">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-verified">
            <CircleCheck className="h-4 w-4" />
            Owner contact unlocked
          </p>
          <p className="mt-1 text-sm text-ink">
            {property.owner.fullName} · <span className="font-mono tabular-nums">{ownerPhone}</span>
          </p>
          <div className="mt-3 flex gap-2">
            <a href={waHref} target="_blank" rel="noreferrer" className="btn flex-1 bg-[#25D366] text-white hover:bg-[#1ebe5d]">
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
            <a href={`tel:${ownerPhone.replace(/\s+/g, "")}`} className="btn btn-outline" aria-label="Call owner">
              <Phone className="h-4 w-4" />
            </a>
          </div>
        </div>
      ) : (
        <button type="button" onClick={onUnlockClick} className="btn btn-dark w-full py-3.5 text-[15px]">
          <Lock className="h-4 w-4" />
          Unlock owner contact · ₹299
        </button>
      )}

      <div className={`grid gap-2 ${property.has3dTour && onLaunch3d ? "grid-cols-2" : "grid-cols-1"}`}>
        <button type="button" onClick={openVisit} className="btn btn-outline">
          <CalendarCheck className="h-4 w-4" />
          Book a visit
        </button>
        {property.has3dTour && onLaunch3d && (
          <button type="button" onClick={onLaunch3d} className="btn btn-outline">
            <Rotate3d className="h-4 w-4" />
            3D tour
          </button>
        )}
      </div>

      <p className="flex items-start gap-1.5 text-xs leading-relaxed text-muted">
        <ShieldCheck className="mt-px h-3.5 w-3.5 shrink-0 text-verified" />
        Refund guaranteed if our inspection missed a structural defect or leak.
      </p>
      {visitDialog}
    </div>
  );
};

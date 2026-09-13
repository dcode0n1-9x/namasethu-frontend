"use client";

import React, { useState } from "react";
import { Check, CircleCheck, Copy, FileCheck2, FileText, Landmark, Lock, ScrollText } from "lucide-react";
import { DeedEvent } from "@/types/property";
import { Dialog } from "@/components/ui/Dialog";

interface EncumbranceDeedChainProps {
  deedHistory: DeedEvent[];
  ulpin: string;
  hasActiveLiens?: boolean;
  reraNumber?: string;
  isUnlocked?: boolean;
  onUnlock?: () => void;
}

const EVENT_LABEL: Record<DeedEvent["eventType"], string> = {
  SALE_DEED: "Sale deed",
  KHATA_TRANSFER: "Khata transfer",
  ENCUMBRANCE_CLEARED: "Loan closure",
  ULPIN_SEEDED: "Land record digitised",
  INSPECTION_AUDIT: "Namasthetu inspection",
};

export const EncumbranceDeedChain: React.FC<EncumbranceDeedChainProps> = ({
  deedHistory,
  ulpin,
  hasActiveLiens = false,
  reraNumber,
  isUnlocked = false,
  onUnlock,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedDeed, setSelectedDeed] = useState<DeedEvent | null>(null);

  const copyUlpin = () => {
    navigator.clipboard?.writeText(ulpin);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="panel flex flex-col p-6 sm:p-7" aria-labelledby="title-heading">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Legal</p>
          <h2 id="title-heading" className="mt-1 text-xl font-semibold text-ink">
            Title and documents
          </h2>
        </div>
        {hasActiveLiens ? (
          <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">Loan on record</span>
        ) : (
          <span className="pill-verified shrink-0">Clear title</span>
        )}
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-xl bg-surface p-4">
        <Landmark className="mt-0.5 h-5 w-5 shrink-0 text-verified" />
        <p className="text-sm leading-relaxed text-muted">
          <span className="font-medium text-ink">
            {hasActiveLiens ? "A loan is registered against this property." : "No loans or legal claims are registered against this property."}
          </span>{" "}
          Ownership was traced through state land records back to the original sale deed.
        </p>
      </div>

      <ul className="mt-4 divide-y divide-hairline rounded-xl border border-hairline">
        <DocRow
          icon={<FileCheck2 className="h-4 w-4" />}
          title="Encumbrance certificate"
          meta="Covers the last 30 years"
          status={hasActiveLiens ? "Loan on record" : "Nil encumbrance"}
          warn={hasActiveLiens}
        />
        {reraNumber && (
          <DocRow icon={<ScrollText className="h-4 w-4" />} title="RERA registration" meta={reraNumber} status="Registered" mono />
        )}
        {deedHistory.map((deed) => (
          <DocRow
            key={deed.year + deed.eventType}
            icon={<FileText className="h-4 w-4" />}
            title={`${EVENT_LABEL[deed.eventType]} · ${deed.year}`}
            meta={deed.parties}
            status={deed.status === "CLEARED" ? "Cleared" : "Verified"}
            action={
              isUnlocked ? (
                <button type="button" onClick={() => setSelectedDeed(deed)} className="text-sm font-semibold text-ink underline underline-offset-4 cursor-pointer">
                  View
                </button>
              ) : (
                <button type="button" onClick={onUnlock} className="rounded-md p-1.5 text-muted transition-colors hover:bg-surface-2 hover:text-ink cursor-pointer" aria-label={`Unlock ${EVENT_LABEL[deed.eventType]}`}>
                  <Lock className="h-4 w-4" />
                </button>
              )
            }
          />
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
        <span>Checked against Kaveri 2.0 land records</span>
        <button type="button" onClick={copyUlpin} className="inline-flex items-center gap-1.5 font-mono text-ink hover:underline cursor-pointer" aria-label="Copy ULPIN">
          ULPIN {ulpin}
          {copied ? <Check className="h-3.5 w-3.5 text-verified" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>

      <Dialog
        open={selectedDeed !== null}
        onClose={() => setSelectedDeed(null)}
        title={selectedDeed ? EVENT_LABEL[selectedDeed.eventType] : "Document"}
        description={selectedDeed ? `Sub-registrar record · ${selectedDeed.year}` : undefined}
        size="md"
        footer={
          <div className="flex justify-end">
            <button type="button" onClick={() => setSelectedDeed(null)} className="btn btn-outline btn-sm">
              Close
            </button>
          </div>
        }
      >
        {selectedDeed && (
          <div className="space-y-4 px-6 py-6 text-sm">
            <dl className="divide-y divide-hairline rounded-xl border border-hairline">
              {[
                ["Document", selectedDeed.title],
                ["Parties", selectedDeed.parties],
                ["ULPIN", ulpin],
                ...(selectedDeed.volumeNumber ? [["Book & volume", selectedDeed.volumeNumber]] : []),
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-6 p-3.5">
                  <dt className="shrink-0 text-muted">{label}</dt>
                  <dd className="text-right font-medium text-ink">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="flex items-start gap-2 rounded-xl bg-verified-soft p-3.5 text-verified">
              <CircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
              Matches the sub-registrar&apos;s digital record.
            </p>
          </div>
        )}
      </Dialog>
    </section>
  );
};

const DocRow: React.FC<{
  icon: React.ReactNode;
  title: string;
  meta: string;
  status: string;
  warn?: boolean;
  mono?: boolean;
  action?: React.ReactNode;
}> = ({ icon, title, meta, status, warn = false, mono = false, action }) => (
  <li className="flex items-center gap-3 px-4 py-3.5">
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-ink">{icon}</span>
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-medium text-ink">{title}</p>
      <p className={`truncate text-xs text-muted ${mono ? "font-mono" : ""}`} title={meta}>
        {meta}
      </p>
    </div>
    <span className={`hidden shrink-0 text-xs font-semibold sm:inline ${warn ? "text-amber-700" : "text-verified"}`}>{status}</span>
    {action}
  </li>
);

import React from "react";
import { CalendarCheck, KeyRound, PenLine, Wallet } from "lucide-react";
import { PropertyListing } from "@/types/property";
import { formatCompactINR, formatINR, paiseToRupees } from "@/lib/format";

const BUY_STEPS = [
  { icon: KeyRound, title: "Contact the owner", body: "Unlock their number and the full report with Trust Pass." },
  { icon: CalendarCheck, title: "Visit with an engineer", body: "Our engineer joins your site visit to answer questions." },
  { icon: Wallet, title: "Pay a token into escrow", body: "Held by Razorpay escrow, refundable until you sign." },
  { icon: PenLine, title: "Sign and register", body: "Aadhaar e-Sign agreement, with registration support." },
];

const RENT_STEPS = [
  BUY_STEPS[0],
  BUY_STEPS[1],
  { icon: Wallet, title: "Pay the deposit into escrow", body: "Released to the owner on move-in day." },
  { icon: PenLine, title: "e-Sign the rental agreement", body: "State-format agreement, signed with Aadhaar." },
];

export const BuyingProcessCard: React.FC<{ property: PropertyListing }> = ({ property }) => {
  const isRent = property.listingMode === "RENT";
  const price = paiseToRupees(property.pricePaise);
  const saving = isRent ? formatINR(price) : formatCompactINR(price * 0.02);
  const steps = isRent ? RENT_STEPS : BUY_STEPS;

  return (
    <section className="panel flex flex-col p-6 sm:p-7" aria-labelledby="process-heading">
      <p className="eyebrow">Next steps</p>
      <h2 id="process-heading" className="mt-1 text-xl font-semibold text-ink">
        How {isRent ? "renting" : "buying"} works here
      </h2>
      <p className="mt-1 text-sm text-muted">You deal directly with the owner. No broker is involved at any step.</p>

      <ol className="mt-6 space-y-0">
        {steps.map(({ icon: Icon, title, body }, i) => (
          <li key={title} className="relative flex gap-4 pb-6 last:pb-0">
            {i < steps.length - 1 && <span className="absolute left-5 top-11 bottom-1 w-px bg-hairline" aria-hidden="true" />}
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-hairline bg-white text-ink">
              <Icon className="h-4 w-4" />
            </span>
            <div className="pt-1.5">
              <p className="text-sm font-semibold text-ink">
                <span className="mr-1.5 text-muted tabular-nums">{i + 1}.</span>
                {title}
              </p>
              <p className="mt-0.5 text-sm text-muted">{body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-auto pt-6">
        <div className="flex items-center justify-between gap-4 rounded-xl bg-ink px-5 py-4 text-white">
          <div>
            <p className="text-xs font-medium text-slate-400">Brokerage you don&apos;t pay</p>
            <p className="font-display text-2xl font-bold tabular-nums">{saving}</p>
          </div>
          <p className="max-w-[12rem] text-right text-xs text-slate-300">
            {isRent ? "A typical broker charges one month's rent." : "Based on the typical 2% broker commission."}
          </p>
        </div>
      </div>
    </section>
  );
};

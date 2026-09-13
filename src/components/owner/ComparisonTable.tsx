import React from "react";
import { Check, Minus } from "lucide-react";

const ROWS = [
  { feature: "Who can list", namasthetu: "Verified owners only", portals: "Anyone, including brokers", brokers: "The broker" },
  { feature: "Physical inspection", namasthetu: "80-point engineer inspection", portals: "None", brokers: "None" },
  { feature: "Title check", namasthetu: "Checked against state land records", portals: "None", brokers: "Photocopies" },
  { feature: "3D walkthrough", namasthetu: "Included", portals: "Phone photos", brokers: "In-person only" },
  { feature: "Unwanted calls", namasthetu: "Only verified buyers can contact you", portals: "Frequent broker calls", brokers: "Frequent" },
  { feature: "Commission", namasthetu: "0%", portals: "Paid ad packages", brokers: "1–2% of sale price" },
];

export const ComparisonTable: React.FC = () => (
  <div className="overflow-x-auto rounded-2xl border border-hairline">
    <table className="w-full min-w-[640px] border-collapse text-left text-sm">
      <caption className="sr-only">Namasthetu compared with listing portals and brokers</caption>
      <thead>
        <tr className="border-b border-hairline">
          <th scope="col" className="w-1/4 px-5 py-4 font-medium text-muted">
            &nbsp;
          </th>
          <th scope="col" className="w-1/3 bg-verified-soft px-5 py-4 font-semibold text-ink">
            Namasthetu
          </th>
          <th scope="col" className="px-5 py-4 font-medium text-muted">
            Listing portals
          </th>
          <th scope="col" className="px-5 py-4 font-medium text-muted">
            Local brokers
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-hairline">
        {ROWS.map((row) => (
          <tr key={row.feature}>
            <th scope="row" className="px-5 py-4 font-medium text-ink">
              {row.feature}
            </th>
            <td className="bg-verified-soft px-5 py-4 font-medium text-ink">
              <span className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-verified" />
                {row.namasthetu}
              </span>
            </td>
            <td className="px-5 py-4 text-muted">
              <span className="flex items-start gap-2">
                <Minus className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                {row.portals}
              </span>
            </td>
            <td className="px-5 py-4 text-muted">
              <span className="flex items-start gap-2">
                <Minus className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                {row.brokers}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

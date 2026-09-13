import React from "react";
import { ChevronDown } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

/** Accessible accordion built on native <details>/<summary>. */
export const Faq: React.FC<{ items: FaqItem[] }> = ({ items }) => (
  <div className="divide-y divide-hairline border-y border-hairline">
    {items.map((item) => (
      <details key={item.question} className="group py-5 [&_summary::-webkit-details-marker]:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-md text-left text-base font-semibold text-ink">
          {item.question}
          <ChevronDown className="h-5 w-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180" />
        </summary>
        <div className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted">{item.answer}</div>
      </details>
    ))}
  </div>
);

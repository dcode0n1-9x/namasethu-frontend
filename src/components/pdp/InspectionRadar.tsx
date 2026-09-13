"use client";

import React, { useState } from "react";
import { Building2, CircleCheck, Download, Droplets, FileText, Hammer, Lock, Scale, TriangleAlert, Zap } from "lucide-react";
import { InspectionDetail } from "@/types/property";
import { Dialog } from "@/components/ui/Dialog";

interface InspectionRadarProps {
  inspection: InspectionDetail;
  onUnlockReport?: () => void;
  isUnlocked?: boolean;
}

const STATUS_LABEL: Record<InspectionDetail["keyFindings"][number]["status"], string> = {
  PASS: "Passed",
  OPTIMAL: "Excellent",
  ATTENTION: "Needs attention",
};

const grade = (score: number) => (score >= 90 ? "Grade A" : score >= 80 ? "Grade B" : "Grade C");

const ScoreDial: React.FC<{ score: number }> = ({ score }) => (
  <div className="relative h-20 w-20 shrink-0">
    <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90" aria-hidden="true">
      <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#e2e8f0" strokeWidth="3.2" />
      <circle
        cx="18"
        cy="18"
        r="15.9155"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeDasharray={`${score} 100`}
        className={score >= 85 ? "text-verified-strong" : "text-amber-500"}
      />
    </svg>
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <span className="font-display text-2xl font-bold leading-none text-ink">{score}</span>
      <span className="text-[10px] font-medium text-muted">/ 100</span>
    </div>
  </div>
);

export const InspectionRadar: React.FC<InspectionRadarProps> = ({ inspection, onUnlockReport, isUnlocked = false }) => {
  const { scores } = inspection;
  const [reportOpen, setReportOpen] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const dimensions = [
    { name: "Structure", score: scores.structural, icon: Building2, detail: "Columns, beams and slabs tested for strength and cracks" },
    { name: "Plumbing & damp", score: scores.plumbing, icon: Droplets, detail: "Thermal moisture scan of every wet area" },
    { name: "Electrical", score: scores.electrical, icon: Zap, detail: "Earthing, breakers and wiring load checked" },
    { name: "Fittings & finishes", score: scores.finishes, icon: Hammer, detail: "Windows, doors, woodwork and tiling" },
    { name: "Title & land records", score: scores.cadastral, icon: Scale, detail: "Ownership chain and land record match" },
  ];

  return (
    <section className="panel flex flex-col p-6 sm:p-7" aria-labelledby="inspection-heading">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Inspection</p>
          <h2 id="inspection-heading" className="mt-1 text-xl font-semibold text-ink">
            {inspection.verifiedPointsCount}-point home inspection
          </h2>
        </div>
        <span className="pill-verified shrink-0">{grade(scores.composite)}</span>
      </div>

      <div className="mt-5 flex items-center gap-5 rounded-xl bg-surface p-5">
        <ScoreDial score={scores.composite} />
        <div className="min-w-0">
          <p className="font-semibold text-ink">Overall condition</p>
          <p className="mt-0.5 line-clamp-3 text-sm leading-relaxed text-muted">{inspection.summary}</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted">
        Inspected on <span className="font-medium text-ink">{inspection.inspectionDate}</span> by{" "}
        <span className="font-medium text-ink">{inspection.inspectorName}</span>
      </p>

      <ul className="mt-5 space-y-4">
        {dimensions.map(({ name, score, icon: Icon, detail }) => (
          <li key={name}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 font-medium text-ink">
                <Icon className="h-4 w-4 text-muted" />
                {name}
              </span>
              <span className="font-semibold tabular-nums text-ink">{score}</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
              <div className={`h-full rounded-full ${score >= 85 ? "bg-verified-strong" : "bg-amber-500"}`} style={{ width: `${score}%` }} />
            </div>
            <p className="mt-1 text-xs text-muted">{detail}</p>
          </li>
        ))}
      </ul>

      <div className="mt-6 border-t border-hairline pt-5">
        <h3 className="text-sm font-semibold text-ink">Key test results</h3>
        <ul className="mt-3 space-y-3">
          {inspection.keyFindings.map((finding) => (
            <li key={finding.category} className="flex gap-3 text-sm">
              {finding.status === "ATTENTION" ? (
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              ) : (
                <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-verified" />
              )}
              <p className="text-muted">
                <span className="font-medium text-ink">{finding.category}</span> — {finding.detail}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-xl border border-hairline p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-ink">
            <FileText className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">Full inspection report</p>
            <p className="text-xs text-muted">20 pages · photos, moisture scans, defect log</p>
          </div>
        </div>
        {isUnlocked ? (
          <button type="button" onClick={() => setReportOpen(true)} className="btn btn-dark btn-sm">
            View report
          </button>
        ) : (
          <button type="button" onClick={onUnlockReport} className="btn btn-outline btn-sm">
            <Lock className="h-3.5 w-3.5" />
            Unlock report
          </button>
        )}
      </div>

      <Dialog
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        title="Inspection report"
        description={`Report ${inspection.id} · ${inspection.inspectionDate}`}
        size="lg"
        footer={
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-muted">Digitally signed by the inspecting engineer</span>
            <button
              type="button"
              onClick={() => {
                setDownloaded(true);
                setTimeout(() => setDownloaded(false), 2500);
              }}
              className="btn btn-dark btn-sm"
            >
              {downloaded ? <CircleCheck className="h-4 w-4" /> : <Download className="h-4 w-4" />}
              {downloaded ? "Downloaded" : "Download PDF"}
            </button>
          </div>
        }
      >
        <div className="space-y-6 px-6 py-6 text-sm">
          <div className="flex items-center gap-4 rounded-xl bg-surface p-4">
            <ScoreDial score={scores.composite} />
            <div>
              <p className="font-semibold text-ink">{grade(scores.composite)} · {inspection.verifiedPointsCount} points checked</p>
              <p className="mt-0.5 text-muted">Inspected by {inspection.inspectorName}</p>
              <p className="mt-1 font-mono text-xs text-muted">ULPIN {inspection.ulpin}</p>
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-ink">Test log</h3>
            <div className="divide-y divide-hairline overflow-hidden rounded-xl border border-hairline">
              {inspection.keyFindings.map((item) => (
                <div key={item.category} className="flex items-start justify-between gap-4 p-4">
                  <div>
                    <p className="font-medium text-ink">{item.category}</p>
                    <p className="mt-0.5 text-muted">{item.detail}</p>
                  </div>
                  <span className={item.status === "ATTENTION" ? "shrink-0 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700" : "pill-verified shrink-0"}>
                    {STATUS_LABEL[item.status]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Dialog>
    </section>
  );
};

import React from "react";
import { Droplets, GraduationCap, Hospital, TrainFront } from "lucide-react";

interface NeighbourhoodIntelligenceProps {
  neighbourhood: {
    metroDistanceMeters: number;
    schoolsNearby: string[];
    hospitalNearby: string;
    waterSecurityIndex: string;
  };
  locality: string;
  city: string;
}

export const NeighbourhoodIntelligence: React.FC<NeighbourhoodIntelligenceProps> = ({ neighbourhood, locality, city }) => {
  const walkMinutes = Math.max(1, Math.round(neighbourhood.metroDistanceMeters / 80));
  const [waterValue, waterNote] = neighbourhood.waterSecurityIndex.split(" — ");

  const rows = [
    {
      icon: TrainFront,
      label: "Nearest metro",
      value: `${neighbourhood.metroDistanceMeters.toLocaleString("en-IN")} m`,
      note: `About ${walkMinutes} min on foot`,
    },
    { icon: Droplets, label: "Water supply", value: waterValue, note: waterNote },
    { icon: GraduationCap, label: "Schools within 3 km", value: neighbourhood.schoolsNearby.join(", ") },
    { icon: Hospital, label: "Nearest hospital", value: neighbourhood.hospitalNearby },
  ];

  return (
    <section className="panel p-6 sm:p-7" aria-labelledby="neighbourhood-heading">
      <p className="eyebrow">Location</p>
      <h2 id="neighbourhood-heading" className="mt-1 text-xl font-semibold text-ink">
        Around {locality}
      </h2>
      <p className="mt-1 text-sm text-muted">{city} · distances measured from the building entrance</p>

      <dl className="mt-5 divide-y divide-hairline">
        {rows.map(({ icon: Icon, label, value, note }) => (
          <div key={label} className="flex gap-4 py-4 first:pt-0 last:pb-0">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-ink">
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <dt className="text-xs font-medium text-muted">{label}</dt>
              <dd className="text-sm font-medium text-ink">{value}</dd>
              {note && <dd className="text-xs text-muted">{note}</dd>}
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
};

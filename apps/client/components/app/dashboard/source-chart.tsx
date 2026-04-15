"use client";

import Type from "@/components/type";

interface SourceChartProps {
  data: Array<{ source: string; count: number; percentage: number }>;
}

const sourceLabels: Record<string, string> = {
  organic: "Organic",
  referral: "Referral",
  social: "Social",
  email: "Email",
  paid_ads: "Paid Ads"
};

const ALL_SOURCES = ["organic", "referral", "social", "email", "paid_ads"];

const sourceColors: Record<string, string> = {
  organic: "bg-primary",
  referral: "bg-secondary",
  social: "bg-success",
  email: "bg-warning",
  paid_ads: "bg-danger"
};

export default function SourceChart({ data }: SourceChartProps) {
  const dataMap = new Map(data.map((d) => [d.source, d]));
  const fullData = ALL_SOURCES.map(
    (source) => dataMap.get(source) ?? { source, count: 0, percentage: 0 }
  );

  return (
    <div className="flex flex-col border bg-background h-full">
      <Type variant="h6" className="px-5 pr-10 py-3.5 border-b">
        Signups by Source
      </Type>

      <div className="flex flex-col gap-4 font-mono px-5 pr-10 py-[13.5px]">
        {fullData.map((item) => (
          <div key={item.source} className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground w-20 shrink-0">
              {sourceLabels[item.source] || item.source}
            </span>
            <div className="flex-1 h-5 bg-default-100 overflow-hidden">
              <div
                className={`h-full ${sourceColors[item.source] ?? "bg-primary"}`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground w-10 text-right">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

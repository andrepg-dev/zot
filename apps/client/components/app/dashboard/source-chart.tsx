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

export default function SourceChart({ data }: SourceChartProps) {
  return (
    <div className="flex flex-col border px-5 py-4.5 bg-background">
      <Type variant="h6" className="mb-6">
        Signups by Source
      </Type>

      <div className="flex flex-col gap-4">
        {data.map((item) => (
          <div key={item.source} className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground w-20 shrink-0">
              {sourceLabels[item.source] || item.source}
            </span>
            <div className="flex-1 h-5 bg-default-100 rounded-sm overflow-hidden">
              <div
                className="h-full rounded-sm bg-gradient-to-r from-primary to-primary/70"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground w-10 text-right">{item.percentage}%</span>
          </div>
        ))}

        {data.length === 0 && (
          <Type className="text-muted-foreground py-8 text-center">No source data yet.</Type>
        )}
      </div>
    </div>
  );
}

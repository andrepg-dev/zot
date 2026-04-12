"use client";

import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  change: number;
  suffix?: string;
}

export default function StatCard({ label, value, change, suffix = "%" }: StatCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="flex flex-col gap-3 border px-5 py-4.5 bg-background">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-3xl font-semibold tracking-tight">{value}</span>
      <span
        className={cn(
          "text-xs font-medium px-2 py-0.5 rounded-sm w-max",
          isPositive ? "bg-success/20 text-success" : "bg-danger/20 text-danger"
        )}
      >
        {isPositive ? "+" : ""}
        {change}
        {suffix}
      </span>
    </div>
  );
}

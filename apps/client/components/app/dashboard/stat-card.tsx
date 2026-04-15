"use client";

import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconColor: string;
  animated: boolean;
  lastDays?: string;
}

export default function StatCard({
  label,
  value,
  suffix,
  icon: Icon,
  iconColor,
  animated
}: StatCardProps) {
  return (
    <div className="relative border bg-background">
      <div className="px-5 py-4.5">
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline gap-1">
            <NumberFlow
              value={animated ? value : 0}
              format={{ minimumFractionDigits: value % 1 !== 0 ? 1 : 0 }}
              className="text-2xl font-semibold"
            />
            {suffix && (
              <span className="text-lg font-semibold text-muted-foreground">{suffix}</span>
            )}
          </div>

          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <Icon className={cn("size-4", iconColor)} />
              <p className="text-xs text-muted-foreground font-mono">{label}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Type from "@/components/type";
import GlobalTooltip from "@/components/global/tooltip";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

interface StatusChartProps {
  data: Array<{ status: string; count: number }>;
}

const STATUS_COLORS: Record<string, string> = {
  waiting: "#f97316",
  invited: "#eab308",
  converted: "#22c55e",
  churned: "#6b7280"
};

const STATUS_LABELS: Record<string, string> = {
  waiting: "Waiting",
  invited: "Invited",
  converted: "Converted",
  churned: "Churned"
};

const STATUS_DESCRIPTIONS: Record<string, string> = {
  waiting: "Users waiting in the queue for an invite.",
  invited: "Users who have been sent an invitation email.",
  converted: "Users who signed up for your product after being invited.",
  churned: "Users who were invited but never converted."
};

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return n.toString();
}

export default function StatusChart({ data }: StatusChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const hasData = total > 0;

  const chartData = hasData
    ? data.filter((d) => d.count > 0)
    : [{ status: "empty", count: 1 }];

  return (
    <div className="flex flex-col border px-5 py-4.5 bg-background">
      <Type variant="h6" className="mb-6">
        Waitlist Status
      </Type>

      <div className="flex items-center gap-6 font-mono">
        <div className="relative w-40 h-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="count"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={72}
                paddingAngle={hasData ? 2 : 0}
                strokeWidth={0}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={hasData ? STATUS_COLORS[entry.status] || "#6b7280" : "#27272a"}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-semibold">{formatCount(total)}</span>
            <span className="text-xs text-muted-foreground">Total</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {data.map((item) => (
            <div key={item.status} className="flex items-center gap-2 group">
              <span
                className="size-2.5 rounded-full shrink-0"
                style={{ backgroundColor: STATUS_COLORS[item.status] }}
              />
              <span className="text-sm text-muted-foreground">
                {STATUS_LABELS[item.status] || item.status}
              </span>
              <GlobalTooltip content={STATUS_DESCRIPTIONS[item.status]}>
                <InformationCircleIcon className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-help" />
              </GlobalTooltip>
              <span className="text-sm font-medium ml-auto">
                {item.count.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

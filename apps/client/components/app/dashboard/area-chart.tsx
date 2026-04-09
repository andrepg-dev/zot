"use client";

import type { DayCount, GeneralStats } from "@/actions/general-stats/general-stats.actions";
import useIsClient from "@/hooks/is-client";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const gridColor = "rgba(255, 255, 255, 0.09)";
const axisColor = "#b4b4b4";
const tooltipBg = "rgb(24, 24, 24)";
const tooltipBorder = "rgba(255, 255, 255, 0.06)";
const tooltipText = "#a1a1aa";

const series = [
  { key: "signups", label: "Signups", color: "#9353d3" },
  { key: "emails", label: "Emails sent", color: "#3b82f6" },
  { key: "blocked", label: "Users blocked", color: "#ef4444" },
  { key: "webhooks", label: "Webhooks sent", color: "#10b981" }
] as const;

interface AreaChartComponentProps {
  data?: GeneralStats;
  isPending?: boolean;
}

function formatDate(dateStr: string) {
  const [, month, day] = dateStr.split("-");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];

  return `${monthNames[Number(month) - 1]} ${Number(day)}`;
}

function toMap(items: DayCount[]) {
  return new Map(items.map((i) => [i.date, i.count]));
}

export default function AreaChartComponent({ data, isPending }: AreaChartComponentProps) {
  const { isClient } = useIsClient();

  const chartData = (() => {
    if (!data) return [];

    const signupsMap = toMap(data.signupsByDay ?? []);
    const emailsMap = toMap(data.emailsByDay ?? []);
    const blockedMap = toMap(data.blockedByDay ?? []);
    const webhooksMap = toMap(data.webhooksByDay ?? []);

    const allDates = new Set([
      ...Array.from(signupsMap.keys()),
      ...Array.from(emailsMap.keys()),
      ...Array.from(blockedMap.keys()),
      ...Array.from(webhooksMap.keys())
    ]);

    if (allDates.size === 0) return [];

    const sorted = Array.from(allDates).sort();
    const start = new Date(sorted[0]);
    const end = new Date(sorted[sorted.length - 1]);
    const result: Record<string, string | number>[] = [];

    for (const d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().slice(0, 10);
      result.push({
        date: formatDate(key),
        signups: signupsMap.get(key) ?? 0,
        emails: emailsMap.get(key) ?? 0,
        blocked: blockedMap.get(key) ?? 0,
        webhooks: webhooksMap.get(key) ?? 0
      });
    }

    return result;
  })();

  return (
    <div className="col-span-3 flex min-w-0 flex-col border border-dashed p-6 ">
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-medium">Activity overview</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Signups, emails, blocked users and webhooks over time
        </p>
      </div>
      <div className="h-64 min-h-[16rem] w-full min-w-0">
        {isClient && chartData.length === 0 && !isPending && (
          <div className="flex h-full w-full items-center justify-center rounded-sm border-2 border-dashed bg-default-50 text-xs text-muted-foreground">
            No data to display yet
          </div>
        )}
        {isClient && chartData.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 15, right: 10, left: -15, bottom: 0 }}>
              <defs>
                {series.map((s) => (
                  <linearGradient key={s.key} id={`gradient-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={s.color} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={s.color} stopOpacity={0.05} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid
                vertical
                horizontal
                strokeDasharray="3 3"
                stroke={gridColor}
                opacity={1}
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                stroke={axisColor}
                fontSize={12}
                tick={{ fill: axisColor }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                stroke={axisColor}
                fontSize={12}
                tick={{ fill: axisColor }}
              />
              <Tooltip
                cursor={false}
                animationDuration={0}
                contentStyle={{
                  backgroundColor: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: "4px",
                  color: tooltipText,
                  padding: "4px 8px",
                  fontSize: "11px",
                  fontFamily: "var(--font-mono)",
                  lineHeight: "1.4"
                }}
              />
              {series.map((s) => (
                <Area
                  key={s.key}
                  dataKey={s.key}
                  name={s.label}
                  fill={`url(#gradient-${s.key})`}
                  fillOpacity={0.4}
                  stroke={s.color}
                  strokeWidth={0.8}
                  strokeDasharray="3 3"
                  dot={{ fill: s.color, strokeWidth: 2, r: 4 }}
                  activeDot={{ fill: s.color, strokeWidth: 2, r: 4 }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

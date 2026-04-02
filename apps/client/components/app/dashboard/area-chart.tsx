"use client";

import type { GeneralStats } from "@/actions/general-stats/general-stats.actions";
import useIsClient from "@/hooks/is-client";
import { Skeleton } from "@heroui/react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const gridColor = "rgba(255, 255, 255, 0.1)";
const axisColor = "#b4b4b4";
const tooltipBg = "rgb(24, 24, 24)";
const tooltipBorder = "rgba(255, 255, 255, 0.06)";
const tooltipText = "#a1a1aa";
const signupsColor = "#9353d3";

interface AreaChartComponentProps {
  data?: GeneralStats["signupsByDay"];
  isPending: boolean;
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

export default function AreaChartComponent({ data, isPending }: AreaChartComponentProps) {
  const { isClient } = useIsClient();

  const chartData = (() => {
    if (!data?.length) return [];

    const dataMap = new Map(data.map((item) => [item.date, item.count]));
    const start = new Date(data[0].date);
    const end = new Date(data[data.length - 1].date);
    const result: { date: string; signups: number }[] = [];

    for (const d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().slice(0, 10);
      result.push({ date: formatDate(key), signups: dataMap.get(key) ?? 0 });
    }

    return result;
  })();

  return (
    <div className="col-span-3 flex min-w-0 flex-col rounded border border-dashed p-6 ">
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-medium">Signups overview</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Showing total registrations in your waitlists
        </p>
      </div>
      <div className="h-64 min-h-[16rem] w-full min-w-0">
        {!isClient || isPending ? (
          <Skeleton className="h-full w-full rounded-sm" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 15, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="gradient-chart-signups" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={signupsColor} stopOpacity={0.5} />
                  <stop offset="95%" stopColor={signupsColor} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical
                horizontal
                strokeDasharray="3 3"
                stroke={gridColor}
                opacity={0.5}
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
              <Area
                dataKey="signups"
                fill="url(#gradient-chart-signups)"
                fillOpacity={0.4}
                stroke={signupsColor}
                strokeWidth={0.8}
                strokeDasharray="3 3"
                dot={{ fill: signupsColor, strokeWidth: 2, r: 4 }}
                activeDot={{ fill: signupsColor, strokeWidth: 2, r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

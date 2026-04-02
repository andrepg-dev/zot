"use client";

import type { DayCount } from "@/actions/general-stats/general-stats.actions";
import useIsClient from "@/hooks/is-client";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import CustomGradientBar from "./custom-gradient-bar";

const axisColor = "#b4b4b4";
const tooltipBg = "rgb(24, 24, 24)";
const tooltipBorder = "rgba(255, 255, 255, 0.06)";
const tooltipText = "#a1a1aa";
const strokeColor = "#006fee";

interface BarChartComponentProps {
  data?: DayCount[];
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

export default function BarChartComponent({ data, isPending }: BarChartComponentProps) {
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
    <div className="col-span-2 flex min-w-0 flex-col rounded border border-dashed p-6 bg-background">
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-medium">Signups per day</h3>
        </div>
        <p className="text-sm text-muted-foreground">Daily registration count</p>
      </div>
      <div className="h-64 min-h-[16rem] w-full min-w-0">
        {isClient && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
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
              <Bar shape={<CustomGradientBar />} dataKey="signups" fill={strokeColor} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

"use client";

import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface DailySignUpsChartProps {
  data?: Array<{
    date: string;
    signups: number;
  }>;
}

const defaultData = [
  { date: "Jan 1", signups: 50 },
  { date: "Jan 2", signups: 65 },
  { date: "Jan 3", signups: 80 },
  { date: "Jan 4", signups: 60 },
  { date: "Jan 5", signups: 95 },
  { date: "Jan 6", signups: 110 },
  { date: "Jan 7", signups: 125 },
  { date: "Jan 8", signups: 115 },
  { date: "Jan 9", signups: 135 },
  { date: "Jan 10", signups: 150 },
  { date: "Jan 11", signups: 160 },
  { date: "Jan 12", signups: 175 },
  { date: "Jan 13", signups: 165 },
  { date: "Jan 14", signups: 185 }
];

const gridColor = "rgba(255, 255, 255, 0.1)";
const axisColor = "#b4b4b4";
const tooltipBg = "rgb(37, 37, 37)";
const tooltipBorder = "rgba(255, 255, 255, 0.1)";
const tooltipText = "#EDEEF0";
const chartColor = "#eab308";

export default function DailySignUpsChart({ data = defaultData }: DailySignUpsChartProps) {
  return (
    <div className="flex flex-col rounded-lg border border-dashed p-6 bg-background">
      <div className="flex flex-col gap-2 mb-4">
        <h3 className="text-base font-medium">Daily Sign Ups</h3>
        <p className="text-sm text-muted-foreground">Daily new sign ups to your waitlist</p>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 15, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid
              vertical={false}
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
              tick={{ fill: axisColor, fontFamily: "var(--font-mono)" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              stroke={axisColor}
              fontSize={12}
              tick={{ fill: axisColor, fontFamily: "var(--font-mono)" }}
            />
            <Tooltip
              cursor={false}
              animationDuration={0}
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: "4px",
                color: tooltipText,
                padding: "8px 12px",
                fontFamily: "var(--font-mono)"
              }}
            />
            <Line
              dataKey="signups"
              stroke={chartColor}
              strokeWidth={0.8}
              strokeDasharray="3 3"
              dot={{ fill: chartColor, r: 4, strokeWidth: 2, stroke: chartColor }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

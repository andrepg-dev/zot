"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import CustomGradientBar from "./custom-gradient-bar";

interface FakeUsersBlockedChartProps {
  data?: Array<{
    date: string;
    blocked: number;
  }>;
}

const defaultData = [
  { date: "Jan 1", blocked: 12 },
  { date: "Jan 2", blocked: 15 },
  { date: "Jan 3", blocked: 8 },
  { date: "Jan 4", blocked: 20 },
  { date: "Jan 5", blocked: 18 },
  { date: "Jan 6", blocked: 25 },
  { date: "Jan 7", blocked: 22 },
  { date: "Jan 8", blocked: 16 },
  { date: "Jan 9", blocked: 19 },
  { date: "Jan 10", blocked: 14 },
  { date: "Jan 11", blocked: 28 },
  { date: "Jan 12", blocked: 23 },
  { date: "Jan 13", blocked: 17 },
  { date: "Jan 14", blocked: 21 }
];

const axisColor = "#b4b4b4";
const tooltipBg = "rgb(37, 37, 37)";
const tooltipBorder = "rgba(255, 255, 255, 0.1)";
const tooltipText = "#EDEEF0";
const chartColor = "#a855f7";

export default function FakeUsersBlockedChart({ data = defaultData }: FakeUsersBlockedChartProps) {
  return (
    <div className="flex flex-col rounded-lg border border-dashed p-6 bg-background">
      <div className="flex flex-col gap-2 mb-4">
        <h3 className="text-base font-medium">Fake Users Blocked</h3>
        <p className="text-sm text-muted-foreground">Suspicious users blocked over time</p>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
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
                padding: "8px 12px"
              }}
            />
            <Bar shape={<CustomGradientBar />} dataKey="blocked" fill={chartColor} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

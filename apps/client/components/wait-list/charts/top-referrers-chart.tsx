"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AnimatedHorizontalBarCursor } from "./animated-cursor";
import CustomGradientBar from "./custom-gradient-bar";

interface TopReferrersChartProps {
  data?: Array<{
    name: string;
    referrals: number;
  }>;
}

const defaultData = [
  { name: "john.doe@email.com", referrals: 45 },
  { name: "jane.smith@email.com", referrals: 38 },
  { name: "mike.wilson@email.com", referrals: 32 },
  { name: "sarah.jones@email.com", referrals: 28 },
  { name: "alex.brown@email.com", referrals: 25 },
  { name: "emily.davis@email.com", referrals: 22 },
  { name: "chris.taylor@email.com", referrals: 19 },
  { name: "lisa.anderson@email.com", referrals: 17 },
  { name: "david.martin@email.com", referrals: 15 },
  { name: "rachel.garcia@email.com", referrals: 12 }
];

const gridColor = "rgba(255, 255, 255, 0.1)";
const axisColor = "#b4b4b4";
const tooltipBg = "rgb(24, 24, 24)";
const tooltipBorder = "rgba(255, 255, 255, 0.06)";
const tooltipText = "#a1a1aa";
const chartColor = "#f59e0b";

export default function TopReferrersChart({ data = defaultData }: TopReferrersChartProps) {
  return (
    <div className="flex flex-col rounded-sm border px-5 py-4.5 bg-background">
      <div className="flex flex-col gap-2 mb-4">
        <h3 className="text-base font-medium">Top Referrers</h3>
        <p className="text-sm text-muted-foreground">Users with the most referrals</p>
      </div>
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid
              horizontal={false}
              strokeDasharray="3 3"
              stroke={gridColor}
              opacity={0.5}
            />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              stroke={axisColor}
              fontSize={12}
              tick={{ fill: axisColor, fontFamily: "var(--font-mono)" }}
            />
            <YAxis
              type="category"
              dataKey="name"
              tickLine={false}
              axisLine={false}
              stroke={axisColor}
              fontSize={12}
              tick={{ fill: axisColor, fontFamily: "var(--font-mono)" }}
              width={150}
            />
            <Tooltip
              cursor={<AnimatedHorizontalBarCursor />}
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
            <Bar shape={<CustomGradientBar />} dataKey="referrals" fill={chartColor} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

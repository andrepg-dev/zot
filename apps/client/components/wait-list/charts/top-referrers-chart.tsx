"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
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

const axisColor = "#b4b4b4";
const tooltipBg = "rgb(37, 37, 37)";
const tooltipBorder = "rgba(255, 255, 255, 0.1)";
const tooltipText = "#EDEEF0";
const chartColor = "#f59e0b";

export default function TopReferrersChart({ data = defaultData }: TopReferrersChartProps) {
  return (
    <div className="flex flex-col rounded-lg border border-dashed p-6 bg-background">
      <div className="flex flex-col gap-2 mb-4">
        <h3 className="text-base font-medium">Top Referrers</h3>
        <p className="text-sm text-muted-foreground">Users with the most referrals</p>
      </div>
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              stroke={axisColor}
              fontSize={12}
              tick={{ fill: axisColor }}
            />
            <YAxis
              type="category"
              dataKey="name"
              tickLine={false}
              axisLine={false}
              stroke={axisColor}
              fontSize={12}
              tick={{ fill: axisColor }}
              width={150}
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
            <Bar shape={<CustomGradientBar />} dataKey="referrals" fill={chartColor} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

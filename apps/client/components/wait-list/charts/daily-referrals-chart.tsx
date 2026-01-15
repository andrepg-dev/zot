"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface DailyReferralsChartProps {
  data?: Array<{
    date: string;
    referrals: number;
  }>;
}

const defaultData = [
  { date: "Jan 1", referrals: 45 },
  { date: "Jan 2", referrals: 60 },
  { date: "Jan 3", referrals: 75 },
  { date: "Jan 4", referrals: 55 },
  { date: "Jan 5", referrals: 90 },
  { date: "Jan 6", referrals: 110 },
  { date: "Jan 7", referrals: 130 },
  { date: "Jan 8", referrals: 120 },
  { date: "Jan 9", referrals: 140 },
  { date: "Jan 10", referrals: 160 },
  { date: "Jan 11", referrals: 175 },
  { date: "Jan 12", referrals: 190 },
  { date: "Jan 13", referrals: 180 },
  { date: "Jan 14", referrals: 200 }
];

const gridColor = "rgba(255, 255, 255, 0.1)";
const axisColor = "#b4b4b4";
const tooltipBg = "rgb(37, 37, 37)";
const tooltipBorder = "rgba(255, 255, 255, 0.1)";
const tooltipText = "#EDEEF0";
const chartColor = "#10b981";

export default function DailyReferralsChart({ data = defaultData }: DailyReferralsChartProps) {
  return (
    <div className="flex flex-col rounded-lg border border-dashed p-6 bg-background">
      <div className="flex flex-col gap-2 mb-4">
        <h3 className="text-base font-medium">Daily Referrals</h3>
        <p className="text-sm text-muted-foreground">Daily referrals shared by users</p>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 15, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="gradient-referrals" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.5} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0.1} />
              </linearGradient>
            </defs>
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
            <Area
              dataKey="referrals"
              fill="url(#gradient-referrals)"
              fillOpacity={0.4}
              stroke={chartColor}
              strokeWidth={0.8}
              strokeDasharray="3 3"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

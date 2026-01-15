"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

interface DailyRegistrationsChartProps {
  data?: Array<{
    date: string;
    registrations: number;
    referrals: number;
  }>;
}

const defaultData = [
  { date: "Jan 1", registrations: 120, referrals: 45 },
  { date: "Jan 2", registrations: 150, referrals: 60 },
  { date: "Jan 3", registrations: 180, referrals: 75 },
  { date: "Jan 4", registrations: 140, referrals: 55 },
  { date: "Jan 5", registrations: 200, referrals: 90 },
  { date: "Jan 6", registrations: 250, referrals: 110 },
  { date: "Jan 7", registrations: 300, referrals: 130 },
  { date: "Jan 8", registrations: 280, referrals: 120 },
  { date: "Jan 9", registrations: 320, referrals: 140 },
  { date: "Jan 10", registrations: 350, referrals: 160 },
  { date: "Jan 11", registrations: 380, referrals: 175 },
  { date: "Jan 12", registrations: 420, referrals: 190 },
  { date: "Jan 13", registrations: 400, referrals: 180 },
  { date: "Jan 14", registrations: 450, referrals: 200 }
];

const gridColor = "rgba(255, 255, 255, 0.1)";
const axisColor = "#b4b4b4";
const tooltipBg = "rgb(37, 37, 37)";
const tooltipBorder = "rgba(255, 255, 255, 0.1)";
const tooltipText = "#EDEEF0";
const registrationsColor = "#3b82f6";
const referralsColor = "#10b981";

export default function DailyRegistrationsChart({
  data = defaultData
}: DailyRegistrationsChartProps) {
  return (
    <div className="flex flex-col rounded-lg border border-dashed p-6  bg-background">
      <div className="flex flex-col gap-2 mb-4">
        <h3 className="text-base font-medium">Daily Registrations & Referrals</h3>
        <p className="text-sm text-muted-foreground">
          Daily user registrations and referrals over time
        </p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 15, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="gradient-registrations" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={registrationsColor} stopOpacity={0.5} />
                <stop offset="95%" stopColor={registrationsColor} stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="gradient-referrals-combined" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={referralsColor} stopOpacity={0.5} />
                <stop offset="95%" stopColor={referralsColor} stopOpacity={0.1} />
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
            <Legend
              wrapperStyle={{
                paddingTop: "20px"
              }}
              iconType="circle"
            />
            <Area
              dataKey="referrals"
              fill="url(#gradient-referrals-combined)"
              fillOpacity={0.4}
              stroke={referralsColor}
              stackId="a"
              strokeWidth={0.8}
              strokeDasharray="3 3"
              dot={{ fill: referralsColor, r: 4, strokeWidth: 2, stroke: referralsColor }}
              activeDot={{ r: 6, strokeWidth: 2 }}
              name="Referrals"
            />
            <Area
              dataKey="registrations"
              fill="url(#gradient-registrations)"
              fillOpacity={0.4}
              stroke={registrationsColor}
              stackId="a"
              strokeWidth={0.8}
              strokeDasharray="3 3"
              dot={{ fill: registrationsColor, r: 4, strokeWidth: 2, stroke: registrationsColor }}
              activeDot={{ r: 6, strokeWidth: 2 }}
              name="Registrations"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

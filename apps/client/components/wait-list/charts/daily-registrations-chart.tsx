"use client";

import { useChartHoverStore } from "@/store/chart-hover";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import AnimatedCursor from "./animated-cursor";

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

const gridColor = "rgba(255, 255, 255, 0.06)";
const axisColor = "#b4b4b4";
const tooltipBg = "rgb(24, 24, 24)";
const tooltipBorder = "rgba(255, 255, 255, 0.06)";
const tooltipText = "#a1a1aa";
const registrationsColor = "#3b82f6";
const referralsColor = "#10b981";

const CHART_ID = "daily-registrations";

export default function DailyRegistrationsChart({
  data = defaultData
}: DailyRegistrationsChartProps) {
  const { hoveredChartId, activeLabel, setHover, clearHover } = useChartHoverStore();
  const isSource = hoveredChartId === CHART_ID;
  const isSynced = hoveredChartId != null && hoveredChartId !== CHART_ID && activeLabel != null;

  return (
    <div
      className="flex flex-col rounded-sm border px-5 py-4.5 bg-background"
      onMouseLeave={() => clearHover()}
    >
      <div className="flex flex-col gap-2 mb-4">
        <h3 className="text-base font-medium">Daily Registrations & Referrals</h3>
        <p className="text-sm text-muted-foreground">
          Daily user registrations and referrals over time
        </p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 15, right: 10, left: -15, bottom: 0 }}
            onMouseMove={(state) => {
              if (state?.activeLabel) {
                setHover(CHART_ID, String(state.activeLabel));
              }
            }}
          >
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
              cursor={<AnimatedCursor chartId={CHART_ID} />}
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
            {isSynced && (
              <ReferenceLine
                x={activeLabel}
                stroke="rgba(255, 255, 255, 0.3)"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
            )}
            <Legend
              wrapperStyle={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "#a1a1aa",
                paddingTop: "8px"
              }}
              iconSize={8}
              iconType="circle"
            />
            <Area
              type="linear"
              dataKey="referrals"
              fill="url(#gradient-referrals-combined)"
              fillOpacity={0.4}
              stroke={referralsColor}
              stackId="a"
              strokeWidth={1.5}
              strokeDasharray="3 3"
              dot={{ fill: referralsColor, r: 5, strokeWidth: 0 }}
              activeDot={false}
              name="Referrals"
            />
            <Area
              type="linear"
              dataKey="registrations"
              fill="url(#gradient-registrations)"
              fillOpacity={0.4}
              stroke={registrationsColor}
              stackId="a"
              strokeWidth={1.5}
              strokeDasharray="3 3"
              dot={{ fill: registrationsColor, r: 5, strokeWidth: 0 }}
              activeDot={false}
              name="Registrations"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

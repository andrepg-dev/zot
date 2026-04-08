"use client";

import { useChartHoverStore } from "@/store/chart-hover";
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import AnimatedCursor from "./animated-cursor";

interface ConversionRateChartProps {
  data?: Array<{
    date: string;
    rate: number;
  }>;
}

const defaultData = [
  { date: "Jan 1", rate: 12.5 },
  { date: "Jan 2", rate: 13.2 },
  { date: "Jan 3", rate: 14.8 },
  { date: "Jan 4", rate: 13.9 },
  { date: "Jan 5", rate: 15.6 },
  { date: "Jan 6", rate: 16.3 },
  { date: "Jan 7", rate: 17.8 },
  { date: "Jan 8", rate: 17.1 },
  { date: "Jan 9", rate: 18.4 },
  { date: "Jan 10", rate: 19.2 },
  { date: "Jan 11", rate: 20.1 },
  { date: "Jan 12", rate: 21.5 },
  { date: "Jan 13", rate: 20.8 },
  { date: "Jan 14", rate: 22.3 }
];

const gridColor = "rgba(255, 255, 255, 0.06)";
const axisColor = "#b4b4b4";
const tooltipBg = "rgb(24, 24, 24)";
const tooltipBorder = "rgba(255, 255, 255, 0.06)";
const tooltipText = "#a1a1aa";
const chartColor = "#06b6d4";

const CHART_ID = "conversion-rate";

export default function ConversionRateChart({ data = defaultData }: ConversionRateChartProps) {
  const { hoveredChartId, activeLabel, setHover, clearHover } = useChartHoverStore();
  const isSource = hoveredChartId === CHART_ID;
  const isSynced = hoveredChartId != null && hoveredChartId !== CHART_ID && activeLabel != null;

  return (
    <div
      className="flex flex-col border px-5 py-4.5 bg-background"
      onMouseLeave={() => clearHover()}
    >
      <div className="flex flex-col gap-2 mb-4">
        <h3 className="text-base font-medium">Conversion Rate Over Time</h3>
        <p className="text-sm text-muted-foreground">Conversion rate of visitors to sign ups</p>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 15, right: 10, left: -15, bottom: 0 }}
            onMouseMove={(state) => {
              if (state?.activeLabel) {
                setHover(CHART_ID, String(state.activeLabel));
              }
            }}
          >
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
              tickFormatter={(value) => `${value}%`}
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
              formatter={(value: number) => [`${value}%`, "Conversion Rate"]}
            />
            {isSynced && (
              <ReferenceLine
                x={activeLabel}
                stroke="rgba(255, 255, 255, 0.3)"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
            )}
            <Line
              type="linear"
              dataKey="rate"
              stroke={chartColor}
              strokeWidth={1.5}
              strokeDasharray="3 3"
              dot={false}
              activeDot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

"use client";

import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AnimatedHorizontalBarCursor } from "./animated-cursor";
import CustomGradientBar from "./custom-gradient-bar";

interface TopReferrersChartProps {
  data?: Array<{
    name: string;
    referrals: number;
  }>;
}

const defaultData = [
  { name: "Empty", referrals: 0 },
  { name: "Empty", referrals: 0 },
  { name: "Empty", referrals: 0 },
  { name: "Empty", referrals: 0 },
  { name: "Empty", referrals: 0 },
  { name: "Empty", referrals: 0 },
  { name: "Empty", referrals: 0 },
  { name: "Empty", referrals: 0 },
  { name: "Empty", referrals: 0 },
  { name: "Empty", referrals: 0 },
];

const gridColor = "rgba(255, 255, 255, 0.06)";
const axisColor = "#b4b4b4";
const tooltipBg = "rgb(24, 24, 24)";
const tooltipBorder = "rgba(255, 255, 255, 0.06)";
const tooltipText = "#a1a1aa";
const chartColor = "#f59e0b";
const emptyColor = "#525252";

function YAxisTick({ x, y, payload }: { x: number; y: number; payload: { value: string } }) {
  const isEmpty = payload.value.startsWith("Empty");
  return (
    <text
      x={x}
      y={y}
      textAnchor="end"
      fill={isEmpty ? emptyColor : axisColor}
      fontSize={12}
      fontFamily="var(--font-mono)"
      fontStyle={isEmpty ? "italic" : "normal"}
      dy={4}
    >
      {isEmpty ? "Empty" : payload.value}
    </text>
  );
}

export default function TopReferrersChart({ data = defaultData }: TopReferrersChartProps) {
  return (
    <div className="flex flex-col border px-5 py-4.5 bg-background">
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
              tick={<YAxisTick x={0} y={0} payload={{ value: "" }} />}
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
            <Bar shape={<CustomGradientBar />} dataKey="referrals" fill={chartColor} barSize={16}>
              <LabelList
                dataKey="referrals"
                position="center"
                style={{ fill: "#a1a1aa", fontSize: "10px", fontFamily: "var(--font-mono)" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

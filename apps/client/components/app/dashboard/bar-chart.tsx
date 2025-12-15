"use client";

import { Badge } from "@heroui/react";
import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import CustomGradientBar from "./custom-gradient-bar";

const barChartData = [
  { month: "January", desktop: 342 },
  { month: "February", desktop: 876 },
  { month: "March", desktop: 512 },
  { month: "April", desktop: 629 },
  { month: "May", desktop: 458 },
  { month: "June", desktop: 781 },
];

const axisColor = "#b4b4b4";
const tooltipBg = "rgb(37, 37, 37)";
const tooltipBorder = "rgba(255, 255, 255, 0.1)";
const tooltipText = "#EDEEF0";
const strokeColor = "#006fee";

export default function BarChartComponent() {
  return (
    <div className="col-span-2 flex flex-col rounded-lg border p-6 bg-background">
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-medium">Bar Chart</h3>
          <Badge
            variant="flat"
            className="text-green-500 bg-green-500/10 border-none flex items-center gap-1"
          >
            <ArrowTrendingUpIcon className="h-4 w-4" />
            <span>5.2%</span>
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          January - June 2025
        </p>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={barChartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              stroke={axisColor}
              fontSize={12}
              tick={{ fill: axisColor }}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <Tooltip
              cursor={false}
              animationDuration={0}
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: "8px",
                color: tooltipText,
              }}
            />
            <Bar
              shape={<CustomGradientBar />}
              dataKey="desktop"
              fill={strokeColor}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

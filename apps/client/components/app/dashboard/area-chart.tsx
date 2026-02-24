"use client";

import useIsClient from "@/hooks/is-client";
import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";
import { Badge } from "@heroui/react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const chartData = [
  { month: "January", desktop: 342, mobile: 245 },
  { month: "February", desktop: 876, mobile: 654 },
  { month: "March", desktop: 512, mobile: 387 },
  { month: "April", desktop: 629, mobile: 521 },
  { month: "May", desktop: 458, mobile: 412 },
  { month: "June", desktop: 781, mobile: 598 }
];

const gridColor = "rgba(255, 255, 255, 0.1)";
const axisColor = "#b4b4b4";
const tooltipBg = "rgb(37, 37, 37)";
const tooltipBorder = "rgba(255, 255, 255, 0.1)";
const tooltipText = "#EDEEF0";
const desktopColor = "#3b82f6";
const mobileColor = "#10b981";

export default function AreaChartComponent() {
  const { isClient } = useIsClient()

  return (
    <div className="col-span-3 flex min-w-0 flex-col rounded-lg border border-dashed p-6 ">
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-medium">Analitycs overview</h3>
          <Badge
            variant="flat"
            className="text-green-500 bg-green-500/10 border-none flex items-center gap-1"
          >
            <ArrowTrendingUpIcon className="h-4 w-4" />
            <span>5.2%</span>
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Showing total visitors for the last 6 months
        </p>
      </div>
      <div className="h-64 min-h-[16rem] w-full min-w-0">
        {isClient && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 15, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="gradient-chart-desktop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={desktopColor} stopOpacity={0.5} />
                  <stop offset="95%" stopColor={desktopColor} stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="gradient-chart-mobile" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={mobileColor} stopOpacity={0.5} />
                  <stop offset="95%" stopColor={mobileColor} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical
                horizontal
                strokeDasharray="3 3"
                stroke={gridColor}
                opacity={0.5}
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                stroke={axisColor}
                fontSize={12}
                tick={{ fill: axisColor }}
                tickFormatter={(value: string) => value.slice(0, 3)}
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
                dataKey="mobile"
                fill="url(#gradient-chart-mobile)"
                fillOpacity={0.4}
                stroke={mobileColor}
                stackId="a"
                strokeWidth={0.8}
                strokeDasharray="3 3"
                dot={{ fill: mobileColor, strokeWidth: 2, r: 4 }}
                activeDot={{ fill: mobileColor, strokeWidth: 2, r: 5 }}
              />
              <Area
                dataKey="desktop"
                fill="url(#gradient-chart-desktop)"
                fillOpacity={0.4}
                stroke={desktopColor}
                stackId="a"
                strokeWidth={0.8}
                strokeDasharray="3 3"
                dot={{ fill: desktopColor, strokeWidth: 2, r: 4 }}
                activeDot={{ fill: desktopColor, strokeWidth: 2, r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

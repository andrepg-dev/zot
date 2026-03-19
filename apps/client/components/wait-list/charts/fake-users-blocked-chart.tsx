"use client";

import { useChartHoverStore } from "@/store/chart-hover";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/react";
import { useParams } from "next/navigation";
import { Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import BlockedUsersTableDrawer from "../blocked-users-table-drawer";
import { AnimatedBarCursor } from "./animated-cursor";
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

const gridColor = "rgba(255, 255, 255, 0.06)";
const axisColor = "#b4b4b4";
const tooltipBg = "rgb(24, 24, 24)";
const tooltipBorder = "rgba(255, 255, 255, 0.06)";
const tooltipText = "#a1a1aa";
const chartColor = "#a855f7";

const CHART_ID = "fake-users-blocked";

export default function FakeUsersBlockedChart({ data = defaultData }: FakeUsersBlockedChartProps) {
  const { id } = useParams<{ id: string }>();
  const { hoveredChartId, activeLabel, setHover, clearHover } = useChartHoverStore();
  const isSource = hoveredChartId === CHART_ID;
  const isSynced = hoveredChartId != null && hoveredChartId !== CHART_ID && activeLabel != null;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div
      className="flex flex-col rounded-sm border px-5 py-4.5 bg-background"
      onMouseLeave={() => clearHover()}
    >
      <div className="flex justify-between">
        <div className="flex flex-col gap-2 mb-4">
          <h3 className="text-base font-medium">Fake Users Blocked</h3>
          <p className="text-sm text-muted-foreground">Suspicious users blocked over time</p>
        </div>

        <Button size="sm" variant="light" endContent={<ArrowTopRightOnSquareIcon className="size-3" />} className="text-muted-foreground" onPress={onOpen}>
          Show blocked users
        </Button>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
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
              tickMargin={10}
              axisLine={false}
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
              cursor={<AnimatedBarCursor chartId={CHART_ID} />}
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
            {isSynced && activeLabel && (
              <ReferenceLine
                x={activeLabel}
                stroke="rgba(255, 255, 255, 0.3)"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
            )}
            <Bar shape={<CustomGradientBar showLabel />} dataKey="blocked" fill={chartColor} barSize={20} activeBar={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <BlockedUsersTableDrawer waitlistId={id} isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
}

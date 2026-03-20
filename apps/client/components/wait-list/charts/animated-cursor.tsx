"use client";

import { useChartHoverStore } from "@/store/chart-hover";

interface AnimatedCursorProps {
  points?: Array<{ x: number; y: number }>;
  height?: number;
  top?: number;
  width?: number;
  left?: number;
  payloadIndex?: number;
  chartId?: string;
}

export default function AnimatedCursor({ points, height, top, chartId }: AnimatedCursorProps) {
  const hoveredChartId = useChartHoverStore((s) => s.hoveredChartId);
  const isSource = chartId != null && hoveredChartId === chartId;

  if (!points || points.length === 0) return null;

  const x = points[0].x;

  return (
    <g style={{ transition: isSource ? "transform 200ms ease-out" : "none", transform: `translateX(${x}px)` }}>
      <line
        x1={0}
        y1={top ?? 0}
        x2={0}
        y2={(top ?? 0) + (height ?? 0)}
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth={1}
        strokeDasharray="4 4"
      />
    </g>
  );
}

interface AnimatedBarCursorProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  chartId?: string;
}

export function AnimatedBarCursor({ x, y, width, height, chartId }: AnimatedBarCursorProps) {
  const hoveredChartId = useChartHoverStore((s) => s.hoveredChartId);
  const isSource = chartId != null && hoveredChartId === chartId;

  if (x == null || y == null || width == null || height == null) return null;

  return (
    <g style={{ transition: isSource ? "transform 200ms ease-out" : "none", transform: `translate(${x}px, ${y}px)` }}>
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="rgba(255, 255, 255, 0.05)"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth={1}
        strokeDasharray="4 4"
      />
    </g>
  );
}

interface AnimatedHorizontalBarCursorProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export function AnimatedHorizontalBarCursor({ x, y, width, height }: AnimatedHorizontalBarCursorProps) {
  if (x == null || y == null || width == null || height == null) return null;

  return (
    <g style={{ transition: "transform 200ms ease-out", transform: `translate(${x}px, ${y}px)` }}>
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="rgba(255, 255, 255, 0.05)"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth={1}
        strokeDasharray="4 4"
      />
    </g>
  );
}

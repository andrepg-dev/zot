"use client";

import { Cell, Legend, Pie, PieChart } from "recharts";

interface TrafficSourcesChartProps {
  data?: Array<{
    name: string;
    value: number;
  }>;
}

const defaultData = [
  { name: "Direct", value: 3500 },
  { name: "Referral", value: 2800 },
  { name: "Social Media", value: 2200 },
  { name: "Email", value: 1500 },
  { name: "Search", value: 1000 }
];

const COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#ec4899", "#a855f7"];

export default function TrafficSourcesChart({ data = defaultData }: TrafficSourcesChartProps) {
  return (
    <div className="flex flex-col rounded-lg border border-dashed p-6 bg-background">
      <div className="flex flex-col gap-2 mb-4">
        <h3 className="text-base font-medium">Traffic Sources</h3>
        <p className="text-sm text-muted-foreground">Distribution of sign up sources</p>
      </div>
      <div className="h-52 w-full flex items-end justify-center">
        <PieChart style={{ width: "100%", maxWidth: "600px", aspectRatio: 2 }} responsive>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            outerRadius="120%"
            fill="#8884d8"
            label
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={1}
            strokeDasharray="3 3"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeDasharray="3 3"
              />
            ))}
          </Pie>
          <Legend
            wrapperStyle={{
              paddingTop: "20px",
              fontFamily: "var(--font-mono)"
            }}
            iconType="circle"
          />
        </PieChart>
      </div>
    </div>
  );
}

"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TooltipProps } from "recharts";

interface BarData {
  period: string;
  value: number;
}

interface CommunicationSummaryChartProps {
  data?: BarData[];
}

const renderTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (!active || !payload?.length || !payload[0]?.payload) return null;
  const data = payload[0].payload as BarData;

  return (
    <div
      style={{
        backgroundColor: "#2563EB",
        color: "#FFFFFF",
        padding: "8px",
        borderRadius: "4px",
        fontSize: 12,
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      }}
    >
      <p>{`${data.period}: ${data.value}`}</p>
    </div>
  );
};

const CommunicationSummaryChart = ({
  data,
}: CommunicationSummaryChartProps) => {
  return (
    // Added h-85 to match the Report table height
    <Card className="flex h-85 w-full flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <CardHeader className="shrink-0 p-0 pb-4">
        <CardTitle className="text-base font-semibold text-gray-800">
          Communication Summary
        </CardTitle>
      </CardHeader>
      {/* h-full min-h-0 ensures the chart takes remaining height without overflow */}
      <CardContent className="h-full min-h-0 flex-1 p-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f0f0f0"
              vertical={false}
            />
            <XAxis
              dataKey="period"
              stroke="#9CA3AF"
              tick={{ fontSize: 10, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              dataKey="value"
              stroke="#9CA3AF"
              tick={{ fontSize: 10, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={renderTooltip} cursor={{ fill: "transparent" }} />
            <Bar
              dataKey="value"
              fill="#2563EB"
              radius={[10, 10, 10, 10]}
              barSize={12}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CommunicationSummaryChart;

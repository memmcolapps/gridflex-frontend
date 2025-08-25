"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { TooltipProps } from "recharts";
import type { Props as DefaultLegendContentProps } from "recharts/types/component/DefaultLegendContent";

// Define types for the data structures
interface LineData {
  hour: string;
  value: number;
}

interface PieData {
  name: string;
  value: number;
  fill?: string; // Optional for pie segment color
}

// Sample data
const lineData: LineData[] = [
  { hour: "4 hrs", value: 60 },
  { hour: "8 hrs", value: 30 },
  { hour: "12 hrs", value: 40 },
  { hour: "16 hrs", value: 35 },
  { hour: "20 hrs", value: 30 },
  { hour: "24 hrs", value: 80 },
];

const pieData: PieData[] = [
  { name: "Active Schedule", value: 95, fill: "#10B981" },
  { name: "Paused Schedule", value: 5, fill: "#C86900" },
];

const PIE_COLORS = ["#10B981", "#C86900"]; // Emerald green, darker orange

interface ChartCardProps {
  title: string;
  chartType: "line" | "pie";
  data?: LineData[] | PieData[];
}

// Define type for legend payload entries
interface LegendPayload {
  value: string;
  type?: string;
  id?: string;
  color?: string;
}

// Custom tooltip renderer
const renderTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (!active || !payload?.length || !payload[0]?.payload) {
    return null;
  }
  const data = payload[0].payload as PieData | LineData;
  const label = "name" in data ? data.name : ("hour" in data ? data.hour : "Unknown");
  const backgroundColor = "fill" in data ? data.fill : "#3b82f6";

  return (
    <div
      style={{
        backgroundColor, // Use fill for pie, fallback for line
        color: "#FFFFFF",
        padding: "8px",
        borderRadius: "4px",
        fontSize: 12,
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      }}
    >
      <p>{`${label}: ${data.value}%`}</p>
    </div>
  );
};

// Custom legend renderer
const renderCustomLegend = ({ payload }: DefaultLegendContentProps): React.ReactNode => {
  return (
    <ul
      style={{
        listStyle: "none",
        paddingLeft: 20,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      {payload?.map((entry: LegendPayload, index: number) => (
        <li
          key={`item-${index}`}
          style={{
            fontSize: 12,
            color: "#000000",
            marginBottom: 4,
            display: "flex",
            alignItems: "center",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: PIE_COLORS[index % PIE_COLORS.length],
              marginRight: 8,
              flexShrink: 0,
            }}
          />
          <span>{entry.value}</span>
        </li>
      ))}
    </ul>
  );
};

const ChartCard = ({ title, chartType, data }: ChartCardProps) => {
  const chartData = data ?? (chartType === "line" ? lineData : pieData);
  console.log("Chart Type:", chartType, "Data:", chartData); // Debug

  return (
    <Card className="w-full p-4 bg-white shadow-sm rounded-lg mt-4 overflow-visible border border-gray-200">
      <CardHeader>
        <CardTitle className="text-gray-800 font-semibold" style={{ fontSize: "14px" }}>
          {title}
        </CardTitle>
      </CardHeader>
      
        <div className="rounded-lg h-fit">
          <ResponsiveContainer width="100%" height="100%" style={{ position: "relative" }}>
            {chartType === "line" ? (
              <LineChart
                data={chartData as LineData[]}
                margin={{ top: 5, right: 5, left: -20, bottom: 5}}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                <XAxis dataKey="hour" stroke="#888" tick={{ fontSize: 12 }} />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 20, 40, 60, 80, 100]}
                  stroke="#888"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={renderTooltip} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 2, fill: "#FF0000" }}
                  activeDot={{ r: 4, fill: "#FF0000" }}
                />
              </LineChart>
            ) : chartType === "pie" ? (
              <PieChart>
                <Pie
                  data={chartData as PieData[]}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={0}
                  dataKey="value"              
                >
                  {(chartData as PieData[]).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill ?? PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={renderTooltip} />
                <Legend
                  content={renderCustomLegend}
                  layout="vertical"
                  align="right"
                  verticalAlign="top"
                  wrapperStyle={{ paddingLeft: 20 }}
                />
              </PieChart>
            ) : (
              <div>Invalid chart type</div>
            )}
          </ResponsiveContainer>
        </div>
    </Card>
  );
};

export default ChartCard;
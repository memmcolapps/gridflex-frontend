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

// Define types for the data structures
interface LineData {
  hour: string;
  value: number;
}

interface PieData {
  name: string;
  value: number;
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
  { name: "Active Schedule", value: 95 },
  { name: "Paused Schedule", value: 5 },
];

const PIE_COLORS = ["#10B981", "#C86900"]; // Emerald green, darker orange

interface ChartCardProps {
  title: string;
  chartType: "line" | "pie";
  data?: LineData[] | PieData[];
}

// Custom tooltip renderer
const renderTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: data.fill, // Match the pie segment color
          color: "#FFFFFF", // White text
          padding: "8px",
          borderRadius: "4px",
          fontSize: 12,
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        }}
      >
        <p>{`${data.name}: ${data.value}%`}</p>
      </div>
    );
  }
  return null;
};

// Custom legend renderer
const renderCustomLegend = ({ payload }: any) => {
  return (
    <ul
      style={{
        listStyle: "none",
        paddingLeft: 20,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start", // Align dots to the left for vertical alignment
      }}
    >
      {payload?.map((entry: any, index: number) => (
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
              backgroundColor: PIE_COLORS[index % PIE_COLORS.length], // Match pie colors
              marginRight: 8, // Consistent gap between dot and text
              flexShrink: 0, // Prevent dot from resizing
            }}
          />
          <span>{entry.value}</span>
        </li>
      ))}
    </ul>
  );
};
const ChartCard = ({ title, chartType, data }: ChartCardProps) => {
  const chartData = data || (chartType === "line" ? lineData : pieData);
  console.log("Chart Type:", chartType, "Data:", chartData); // Debug

  return (
    <Card className="w-full p-4 bg-white shadow-sm rounded-lg mt-4 overflow-visible border border-gray-500">
      <CardHeader>
        <CardTitle className="text-black font-light" style={{ fontSize: "14px" }}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-60">

        <ResponsiveContainer width="100%" height="100%" style={{ position: "relative" }}>
          {chartType === "line" ? (
            <LineChart
              data={chartData as LineData[]}
              margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
              <XAxis dataKey="hour" stroke="#888" tick={{ fontSize: 12 }} />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 20, 40, 60, 80, 100]}
                stroke="#888"
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 2, fill: "#FF0000" }} // Smaller red dots
                activeDot={{ r: 4, fill: "#FF0000" }} // Smaller active red dots
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

                strokeWidth={2}
              >
                {(chartData as PieData[]).map((_, index: number) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={renderTooltip} />
              <Legend content={renderCustomLegend} layout="vertical" align="right" verticalAlign="top" />
            </PieChart>
          ) : (
            <div>Invalid chart type</div>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ChartCard;
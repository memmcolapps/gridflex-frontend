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

const PIE_COLORS = ["#10B981", "#F59E0B"];

interface ChartCardProps {
  title: string;
  chartType: "line" | "pie";
  data?: LineData[] | PieData[];
}

const ChartCard = ({ title, chartType, data }: ChartCardProps) => {
  const chartData = data || (chartType === "line" ? lineData : pieData);
  console.log("Chart Type:", chartType, "Data:", chartData); // Debug

  return (
    <Card className="w-full p-4 bg-white shadow-sm rounded-lg mt-4 overflow-visible">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
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
                dot={{ r: 4, fill: "#3b82f6" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          ) : chartType === "pie" ? (
            <PieChart className="border-gray-500">
              <Pie
                data={chartData as PieData[]}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={1}
                dataKey="value"
              >
                {(chartData as PieData[]).map((_, index: number) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                wrapperStyle={{ fontSize: 12, paddingLeft: 20 }}
              />
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
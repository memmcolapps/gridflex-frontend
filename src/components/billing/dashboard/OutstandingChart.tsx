'use client';

import { useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { chartData } from '@/lib/dashboardData';

export const OutstandingChart = () => {
    const [activeChart, setActiveChart] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');

    const dataByType = {
        monthly: chartData,
        quarterly: [
            { month: 'Q1', value: 165 },
            { month: 'Q2', value: 85 },
            { month: 'Q3', value: 175 },
            { month: 'Q4', value: 245 },
        ],
        yearly: [
            { month: '2021', value: 600 },
            { month: '2022', value: 650 },
            { month: '2023', value: 670 },
        ],
    };

    const currentData = dataByType[activeChart];

    return (
      <Card className="w-full max-w-[1000px] border-none border-gray-100 bg-white shadow-xs">
        <CardHeader className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <CardTitle>Outstanding Over Time (Amount)</CardTitle>
          <div className="flex gap-2">
            <Button
              className={`cursor-pointer ${
                activeChart === "monthly"
                  ? "border border-gray-300 bg-gray-100"
                  : "border border-transparent hover:border-gray-100 hover:bg-gray-100"
              }`}
              variant={activeChart === "monthly" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveChart("monthly")}
            >
              Monthly
            </Button>
            <Button
              className={`cursor-pointer ${
                activeChart === "quarterly"
                  ? "border border-gray-300 bg-gray-100"
                  : "border border-transparent hover:border-gray-100 hover:bg-gray-100"
              }`}
              variant={activeChart === "quarterly" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveChart("quarterly")}
            >
              Quarterly
            </Button>
            <Button
              className={`cursor-pointer ${
                activeChart === "yearly"
                  ? "border border-gray-300 bg-gray-100"
                  : "border border-transparent hover:border-gray-100 hover:bg-gray-100"
              }`}
              variant={activeChart === "yearly" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveChart("yearly")}
            >
              Yearly
            </Button>
          </div>
        </CardHeader>
        <CardContent className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={currentData}
              margin={{ top: 5, right: 0, left: 10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: "#6b7280" }}
                tickMargin={12}
                padding={{ left: 20, right: 5 }}
              />
              <YAxis
                tick={{ fill: "#6b7280" }}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="rounded-md border bg-white p-3 shadow-sm">
                      <p className="font-medium">
                        {payload?.[0]?.payload?.month ?? "N/A"}
                      </p>
                      <p className="text-sm">
                        {payload[0]?.value ?? "N/A"} amount outstanding
                      </p>
                    </div>
                  );
                }}
              />
              <Line
                type="linear"
                dataKey="value"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{
                  stroke: "#fff",
                  strokeWidth: 2,
                  r: 4,
                  fill: "#3B82F6",
                }}
                activeDot={{
                  r: 6,
                  stroke: "#fff",
                  strokeWidth: 2,
                  fill: "#3B82F6",
                }}
                className="cursor-pointer"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
};
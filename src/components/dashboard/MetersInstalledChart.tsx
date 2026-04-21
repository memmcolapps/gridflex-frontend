"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useDashboard } from "@/hooks/use-dashboard";

export const MetersInstalledChart = () => {
  const [activeChart, setActiveChart] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const { data: dashboardData } = useDashboard(); // Uses unfiltered data
  // Determine if yearly data is sufficiently populated to enable the toggle
  // Yearly data count is derived from the loaded dashboard data
  const yearlyDataCount = dashboardData?.installedOverYear?.length ?? 0;
  const yearlyAvailable = yearlyDataCount > 2;
  const isMonthly = activeChart === "monthly";
  // If yearly data becomes unavailable, force switch back to monthly
  useEffect(() => {
    if (!yearlyAvailable && activeChart === "yearly") {
      setActiveChart("monthly");
    }
  }, [yearlyAvailable, activeChart]);

  const apiMonthlyData =
    dashboardData?.installedOverMonths?.map((item) => ({
      period: item.month,
      value: item.count,
    })) ?? [];

  const apiYearlyData =
    dashboardData?.installedOverYear?.map((item) => ({
      period: String(item.year),
      value: item.count,
    })) ?? [];

  const dataByType = {
    monthly: apiMonthlyData,
    yearly: apiYearlyData,
  };

  const currentData = dataByType[activeChart];

  return (
    <Card className="w-full max-w-full border-none border-gray-100 bg-transparent shadow-xs">
      <CardHeader className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <CardTitle>
          {activeChart === "monthly"
            ? "Meter installed over year"
            : "Meters Installed Over Time"}
        </CardTitle>
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
              activeChart === "yearly"
                ? "border border-gray-300 bg-gray-100"
                : "border border-transparent hover:border-gray-100 hover:bg-gray-100"
            }`}
            variant={activeChart === "yearly" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveChart("yearly")}
            disabled={!yearlyAvailable}
          >
            Yearly
          </Button>
        </div>
      </CardHeader>
      <CardContent className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          {activeChart === "monthly" ? (
            <LineChart
              data={currentData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                vertical={false}
              />
              <XAxis
                dataKey="period"
                tick={{ fill: "#6b7280" }}
                tickMargin={12}
              />
              <YAxis
                tick={{ fill: "#6b7280" }}
                domain={isMonthly ? [0, 4] : [0, 160]}
                ticks={
                  isMonthly
                    ? [0, 1, 2, 3, 4]
                    : [0, 20, 40, 60, 80, 100, 120, 140, 160]
                }
                interval={0}
                allowDecimals={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="rounded-md border bg-white p-3 shadow-sm">
                      <p className="font-medium">
                        {payload?.[0]?.payload?.period ?? "N/A"}
                      </p>
                      <p className="text-sm">
                        {payload[0]?.value ?? "N/A"} meters installed
                      </p>
                    </div>
                  );
                }}
              />
              <Line
                type="monotone"
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
          ) : (
            <BarChart
              data={currentData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                vertical={false}
              />
              <XAxis
                dataKey="period"
                tick={{ fill: "#6b7280" }}
                tickMargin={12}
              />
              <YAxis
                tick={{ fill: "#6b7280" }}
                domain={isMonthly ? [0, 4] : [0, 160]}
                ticks={
                  isMonthly
                    ? [0, 1, 2, 3, 4]
                    : [0, 20, 40, 60, 80, 100, 120, 140, 160]
                }
                interval={0}
                allowDecimals={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="rounded-md border bg-white p-3 shadow-sm">
                      <p className="font-medium">
                        {payload?.[0]?.payload?.period ?? "N/A"}
                      </p>
                      <p className="text-sm">
                        {payload[0]?.value ?? "N/A"} meters installed
                      </p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

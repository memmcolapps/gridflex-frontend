import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import React from "react";
interface CustomTooltipPayload {
  name: string;
  value: number;
  fill: string;
}

// Data for Token Distribution (ensure values sum to 100 for true percentages)
const tokenData = [
  { name: "Credit Token", value: 30 },
  { name: "Key Change Token", value: 20 },
  { name: "Clear Tamper Token", value: 15 },
  { name: "Cancellation Token", value: 10 },
  { name: "Compensation Token", value: 10 },
  { name: "Clear Credit Token", value: 10 },
  { name: "Arrears Payment Token", value: 5 },
];

const tokenColors = [
  "#166533", // Green
  "#1E4BAF", // Blue
  "#856D0E", // Yellow/Brown
  "#454545", // Deep Gray
  "#A50F0F", // Red
  "#626471", // Medium Gray
  "#84919D", // Light Gray
];

// Data for Transaction Status (Adjusted to sum to 100%)
const statusData = [
  { name: "Successful Transaction", value: 85 },
  { name: "Failed Transaction", value: 10 },
  { name: "Pending Transaction", value: 5 },
];

const statusColors = [
  "#10B981", // Emerald Green
  "#DC2626", // Red (more standard for failed)
  "#FACC15"  // Yellow
];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: CustomTooltipPayload; fill: string }[] }) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0];

    if (data?.payload) {
      const itemColor = data.fill || data.payload.fill;
      return (
        <div
          style={{
            backgroundColor: itemColor,
            padding: "8px",
            borderRadius: "4px",
            color: "#fff",
            border: `1px solid ${itemColor}`,
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            fontSize: "0.875rem",
            opacity: 0.95,
          }}
        >
          <p>{`${data.payload.name}: ${data.payload.value}%`}</p>
        </div>
      );
    }
  }
  return null;
};

export default function TokenTransactionCharts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-fit items-center w-full">
      {/* Token Distribution Card */}
      <Card className="rounded-2xl shadow-sm w-full h-fit border border-gray-200">
        <CardContent className="p-4 flex flex-col">
          <h2 className="text-md font-semibold mb-2">Token Distribution</h2>
          <div className="flex flex-row items-center justify-between w-full">
            {/* Token Data List on the Left */}
            <div className="flex flex-col gap-2 mt-4 sm:mt-0 sm:ml-4 flex-grow order-2 sm:order-1 min-w-[150px]">
              {tokenData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-sm">
                  <span
                    className="w-4 h-4 inline-block rounded-full flex-shrink-0"
                    style={{ backgroundColor: tokenColors[index % tokenColors.length] }}
                  ></span>
                  <span className="whitespace-nowrap">{entry.name}: {entry.value}%</span>
                </div>
              ))}
            </div>
            {/* Container for Pie Chart */}
            <div className="flex justify-center items-center order-1 sm:order-2 flex-grow-0">
              <PieChart width={200} height={200}>
                <Pie
                  data={tokenData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={0}
                >
                  {tokenData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={tokenColors[index % tokenColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={<CustomTooltip />}
                />
              </PieChart>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Status Card */}
      <Card className="rounded-2xl shadow-sm border border-gray-200 w-full h-fit">
        <CardContent className="p-4 flex flex-col">
          <h2 className="text-md font-semibold mb-2">Transaction Status</h2>
          <div className="flex flex-row justify-between w-full">
            {/* Container for Pie Chart */}
            <div className="flex justify-center items-center flex-grow-0 order-1 w-fit">
              <PieChart width={200} height={200}>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={0}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={statusColors[index % statusColors.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </div>
            {/* Status Data List on the Right */}
            <div className="flex flex-col gap-2 mt-4 ml-20 flex-grow order-2 min-w-[150px]">
              {statusData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-sm">
                  <span
                    className="w-4 h-4 inline-block rounded-full flex-shrink-0"
                    style={{ backgroundColor: statusColors[index % statusColors.length] }}
                  ></span>
                  <span className="whitespace-nowrap">{entry.name}: {entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
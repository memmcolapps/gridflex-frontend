import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

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
  "#856D0E", // Yellow
  "#454545", // Deep Gray
  "#A50F0F", // Red
  "#626471", // Gray
  "#84919D", // Light Gray
];

const statusData = [
  { name: "Successful Transaction", value: 95 },
  { name: "Failed Transaction", value: 5 },
];

const statusColors = ["#10B981", "#B22222"];

export default function TokenTransactionCharts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-fit items-center">
      <Card className="rounded-2xl shadow-sm w-fit h-fit border border-gray-200">
        <CardContent className="p-4">
          <h2 className="text-md font-semibold mb-2">Token Distribution</h2>
          <div className="flex flex-row items-start gap-6">
            {/* Token Data List on the Left */}
            <div className="flex flex-col gap-2 mt-8 ml-4">
              {tokenData.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm"
                >
                  <span
                    className="w-4 h-4 inline-block rounded-full"
                    style={{ backgroundColor: tokenColors[index % tokenColors.length] }}
                  ></span>
                  <span>{entry.name}: {entry.value}%</span>
                </div>
              ))}
            </div>
            {/* Container for Pie Chart and Credit Token Div */}
            <div className="flex flex-row items-start">
              {/* Pie Chart */}
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
                <Tooltip />
              </PieChart>
              {/* Credit Token: 30% Right Beside the Pie Chart, at the Top */}
              <div className="text-white bg-[#166533] rounded px-2 py-2 w-fit mt-6">
                <span>Credit Token: 30%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm border border-gray-200 w-fit h-fit">
        <CardContent className="p-4">
          <h2 className="text-md font-semibold mb-2">Transaction Status</h2>
          <div className="flex flex-row items-center justify-between w-fit">
            {/* Successful: 95% on the Left, Very Close to the Pie Chart */}
            <div className="flex flex-row">
              <div className="text-white bg-[#10B981] rounded px-2 py-2 w-fit h-fit mt-6 whitespace-nowrap">
                Successful: 95%
              </div>
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
                <Tooltip />
              </PieChart>
            </div>
            {/* Status Data List on the Extreme Right */}
            <div className="flex flex-col gap-2 items-start h-60 w-fit mr-16 mt-4 whitespace-nowrap">
              {statusData.map((entry, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <span
                    className="w-4 h-4 inline-block rounded-full"
                    style={{ backgroundColor: statusColors[index % statusColors.length] }}
                  ></span>
                  <span>{entry.name}: {entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
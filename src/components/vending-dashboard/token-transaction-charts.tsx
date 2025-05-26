import { Card, CardContent } from "@/components/ui/card"
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts"

const tokenData = [
  { name: "Credit Token", value: 30 },
  { name: "Key Change Token", value: 20 },
  { name: "Clear Tamper Token", value: 15 },
  { name: "Cancellation Token", value: 10 },
  { name: "Compensation Token", value: 10 },
  { name: "Clear Credit Token", value: 10 },
  { name: "Arrears Payment Token", value: 5 },
]

const tokenColors = [
  "#2E7D32",
  "#1E88E5",
  "#FBC02D",
  "#6D4C41",
  "#D32F2F",
  "#BDBDBD",
  "#009688",
]

const statusData = [
  { name: "Successful Transaction", value: 95 },
  { name: "Failed Transaction", value: 5 },
]

const statusColors = ["#26A69A", "#D32F2F"]

export default function TokenTransactionCharts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-4">
          <h2 className="text-md font-semibold mb-2">Token Distribution</h2>
          <PieChart width={300} height={240}>
            <Pie
              data={tokenData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
            >
              {tokenData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={tokenColors[index % tokenColors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
          <div className="mt-2 text-green-800 bg-green-100 rounded px-2 py-1 w-fit">
            Credit Token: 30%
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-4">
          <h2 className="text-md font-semibold mb-2">Transaction Status</h2>
          <PieChart width={300} height={240}>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={statusColors[index % statusColors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
          <div className="mt-2 text-teal-800 bg-teal-100 rounded px-2 py-1 w-fit">
            Successful: 95%
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
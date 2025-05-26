// components/MonthlyTransactionChart.tsx
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const monthlyData = [
  { month: "JAN", amount: 180, unit: 160, vat: 90 },
  { month: "FEB", amount: 130, unit: 60, vat: 30 },
  { month: "MAR", amount: 150, unit: 90, vat: 45 },
  { month: "APR", amount: 150, unit: 90, vat: 65 },
  { month: "MAY", amount: 180, unit: 110, vat: 80 },
  { month: "JUN", amount: 160, unit: 100, vat: 40 },
  { month: "JUL", amount: 170, unit: 120, vat: 60 },
  { month: "AUG", amount: 170, unit: 90, vat: 30 },
  { month: "SEP", amount: 150, unit: 50, vat: 10 },
  { month: "OCT", amount: 20, unit: 0, vat: 0 },
  { month: "NOV", amount: 150, unit: 60, vat: 20 },
  { month: "DEC", amount: 170, unit: 70, vat: 30 },
];

export default function MonthlyTransactionChart() {
  return (
    <Card className="rounded-2xl shadow-sm mt-4">
      <CardContent className="p-4">
        <h2 className="text-md font-semibold mb-2">Transactions Made Over Months</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#1E88E5" name="Amount Paid" />
            <Bar dataKey="unit" fill="#388E3C" name="Cost Of Unit" />
            <Bar dataKey="vat" fill="#D32F2F" name="VAT" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

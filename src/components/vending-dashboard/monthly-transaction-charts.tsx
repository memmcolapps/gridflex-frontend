import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { RectangleProps } from "recharts";
import type { TransactionOverMonth } from "@/types/vending";

const RoundedBar = (props: RectangleProps) => {
  const { x, y, width, height, fill } = props;
  const radius = 6;
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      rx={radius}
      ry={radius}
    />
  );
};

interface MonthlyTransactionChartProps {
  transactionOverMonths?: TransactionOverMonth[];
}

export default function MonthlyTransactionChart({ transactionOverMonths }: MonthlyTransactionChartProps) {
  const monthlyData = transactionOverMonths?.map(item => ({
    month: item.month.substring(0, 3).toUpperCase(),
    amount: item.transactionSum,
    unit: item.unitCostSum,
    vat: item.vatAmountSum,
  })) ?? [];
  return (
    <Card className="rounded-2xl shadow-sm mt-4 border border-gray-200 w-full">
      <CardContent className="p-4">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <h2 className="text-md font-semibold">Transactions Made Over Months</h2>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span>Amount Paid</span>
              <span className="w-2 h-2 bg-[#1E4BAF] rounded-full"></span>
            </div>
            <div className="flex items-center gap-2">
              <span>Cost Of Unit</span>
              <span className="w-2 h-2 bg-[#166533] rounded-full"></span>
            </div>
            <div className="flex items-center gap-2">
              <span>VAT</span>
              <span className="w-2 h-2 bg-[#991B1B] rounded-full"></span>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData} barCategoryGap={12} barGap={4}>
            <XAxis dataKey="month" />
            <YAxis domain={[0, 'dataMax + 20']} />
            <Tooltip />
            <Bar dataKey="amount" fill="#1E4BAF" name="Amount Paid" shape={<RoundedBar />} barSize={13} />
            <Bar dataKey="unit" fill="#166533" name="Cost Of Unit" shape={<RoundedBar />} barSize={13} />
            <Bar dataKey="vat" fill="#991B1B" name="VAT" shape={<RoundedBar />} barSize={13} />
            </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

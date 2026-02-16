import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUpIcon,
  TrendingDownIcon,
  Banknote,
  Zap,
  HandCoins,
  BadgePercent,
} from "lucide-react";
import type { CardData } from "@/types/vending";

interface SummaryCardsProps {
  cardData?: CardData;
}

const calculateChange = (current: number, previous: number) => {
  if (previous === 0) return { change: "0.00%", isPositive: true };
  const changeValue = ((current - previous) / previous) * 100;
  const change = `${changeValue >= 0 ? "+" : ""}${changeValue.toFixed(2)}%`;
  return { change, isPositive: changeValue >= 0 };
};

const formatValue = (value: number) => value.toLocaleString();
const formatPrevious = (value: number) => value.toLocaleString();

export default function SummaryCards({ cardData }: SummaryCardsProps) {
  const summaryData = [
    {
      title: "Total Amount Vended",
      value: formatValue(cardData?.transactionSum ?? 0),
      change: calculateChange(cardData?.transactionSum ?? 0, cardData?.previousTransactionSum ?? 0).change,
      previous: formatPrevious(cardData?.previousTransactionSum ?? 0),
      changeIcon: <TrendingUpIcon size={14} className="text-black" />,
      icon: <Banknote size={18} className="text-[#172A54] bg-[#BFD3FE] rounded-full p-2" />,
      color: "bg-[#DBE6FE] text-blue-800 border border-[#DBE6FE]",
    },
    {
      title: "Total Energy Vended (kWh)",
      value: formatValue(cardData?.unitCostSum ?? 0),
      change: calculateChange(cardData?.unitCostSum ?? 0, cardData?.previousUnitCostSum ?? 0).change,
      previous: formatPrevious(cardData?.previousUnitCostSum ?? 0),
      changeIcon: <TrendingUpIcon size={14} className="text-black" />,
      icon: <Zap size={18} className="text-[#052E14] bg-[#86EFAD] rounded-full p-2" />,
      color: "bg-[#DCFCE8] text-green-800 border border-[#DCFCE8]",
    },
    {
      title: "Highest B.Hub Transaction",
      value: formatValue(cardData?.totalProfit ?? 0),
      change: calculateChange(cardData?.totalProfit ?? 0, cardData?.previousTotalProfit ?? 0).change,
      previous: formatPrevious(cardData?.previousTotalProfit ?? 0),
      changeIcon: <TrendingDownIcon size={14} className="text-black" />,
      icon: <HandCoins size={18} className="bg-[#FEE78A] text-[#423606] rounded-full p-2" />,
      color: "bg-[#FEF2C3] text-yellow-800 border border-[#FEF2C3]",
    },
    {
      title: "Total No. Of Transactions",
      value: formatValue(cardData?.vatAmountSum ?? 0),
      change: calculateChange(cardData?.vatAmountSum ?? 0, cardData?.previousVatAmountSum ?? 0).change,
      previous: formatPrevious(cardData?.previousVatAmountSum ?? 0),
      changeIcon: <TrendingUpIcon size={14} className="text-black" />,
      icon: <BadgePercent size={18} className="bg-[#FECACA] rounded-full p-2 text-[#450A0A]" />,
      color: "bg-[#FEE2E2] text-red-800 border border-[#FEE2E2]",
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryData.map((item, idx) => (
        <Card key={idx} className={`rounded-2xl shadow-sm p-0 h-40 ${item.color}`}>
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start mt-4">
              <div>
                <p className="text-sm font-medium text-black mb-1">{item.title}</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-semibold text-black">{item.value}</span>
                  <span className="text-sm text-black">{item.change}</span>
                  {item.changeIcon}
                </div>
              </div>
              <div className="rounded-full p-2">
                {item.icon}
              </div>
            </div>
            <span className="w-full border-t border-gray-300" />
            <div className="flex justify-between text-sm text-gray-500 text-muted-foreground">
              <span>Previous Year</span>
              <span>{item.previous}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

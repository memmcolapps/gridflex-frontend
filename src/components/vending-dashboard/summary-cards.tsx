// components/SummaryCards.tsx
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Zap, Wallet, Percent } from "lucide-react";

const summaryData = [
  {
    title: "Total Sum Of Transaction",
    value: "1,000,000",
    change: "+11.01%",
    previous: "900,000",
    icon: <TrendingUp className="w-4 h-4" />, // Blue
    color: "bg-blue-100 text-blue-800",
  },
  {
    title: "Total Sum Of Units",
    value: "500,000",
    change: "+2.20%",
    previous: "488,000",
    icon: <Zap className="w-4 h-4" />, // Green
    color: "bg-green-100 text-green-800",
  },
  {
    title: "Total Sum Of Profit",
    value: "396,000",
    change: "-1.01%",
    previous: "400,000",
    icon: <Wallet className="w-4 h-4" />, // Yellow
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    title: "Total Sum Of VAT",
    value: "44,000",
    change: "+2.08%",
    previous: "12,000",
    icon: <Percent className="w-4 h-4" />, // Red
    color: "bg-red-100 text-red-800",
  },
];

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryData.map((item, idx) => (
        <Card key={idx} className={`rounded-2xl shadow-sm ${item.color}`}>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium">{item.title}</p>
              {item.icon}
            </div>
            <div className="text-xl font-semibold">{item.value}</div>
            <div className="text-sm flex justify-between mt-1">
              <span>{item.change}</span>
              <span className="text-muted-foreground">Previous Year</span>
            </div>
            <div className="text-sm text-muted-foreground">{item.previous}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

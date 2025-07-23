import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUpIcon,
  TrendingDownIcon,
  Banknote,
  Zap,
  Users,
  BadgePercent,
} from "lucide-react";

const summaryData = [
  {
    title: "Total Revenue",
    value: "1,000,000",
    change: "+11.01%",
    previous: "900,000",
    changeIcon: <TrendingUpIcon size={14} className="text-black" />,
    icon: (
      <Banknote
        size={18}
        className="rounded-full bg-[#BFD3FE] p-2 text-[#172A54]"
      />
    ),
    color: "bg-[#DBE6FE] text-blue-800 border border-[#DBE6FE]",
  },
  {
    title: "Total Billing Customers",
    value: "396,000",
    change: "-1.10%",
    previous: "400,000",
    changeIcon: <TrendingDownIcon size={14} className="text-black" />,
    icon: (
      <Users
        size={18}
        className="rounded-full bg-[#FEE78A] p-2 text-[#052E14]"
      />
    ),
    color: "bg-[#FEF2C3] text-green-800 border border-[#DCFCE8]",
  },
  { 
    title: "Total Energy Costs",
    value: "500,000",
    change: "+2.02%",
    previous: "488,000",
    changeIcon: <TrendingUpIcon size={14} className="text-black" />,
    icon: (
      <Zap size={18} className="rounded-full bg-[#86EFAD] p-2 text-[#052E14]" />
    ),

    color: "bg-[#DCFCE8] text-yellow-800 border border-[#FEF2C3]",
  },
  {
    title: "Total Net Outstanding",
    value: "44,000",
    change: "+2.08%",
    previous: "12,000",
    changeIcon: <TrendingUpIcon size={14} className="text-black" />,
    icon: (
      <BadgePercent
        size={18}
        className="rounded-full bg-[#FECACA] p-2 text-[#450A0A]"
      />
    ),
    color: "bg-[#FEE2E2] text-red-800 border border-[#FEE2E2]",
  },
];

export default function SummaryCards() {
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

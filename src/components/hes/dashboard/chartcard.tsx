// ChartCard.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import React from "react"; // Import React for type safety

interface ChartCardProps {
  title: string;
  chartType: "line" | "pie"; // Union type for allowed chart types
  data: any; // Placeholder type; refine based on actual data structure if known
}

const ChartCard = ({ title, chartType, data }: ChartCardProps) => {
  return (
    <Card className="w-full p-4 bg-white shadow-sm rounded-lg mt-4">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Placeholder for chart - replace with actual chart library (e.g., Chart.js) */}
        <div className="h-32">
          {chartType === "line" && <div>Line Chart Placeholder</div>}
          {chartType === "pie" && <div>Pie Chart Placeholder (95% Active)</div>}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartCard;
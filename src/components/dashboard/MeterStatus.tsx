'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useDashboard } from '@/hooks/use-dashboard';

export const MeterStatus = () => {
    const { data: dashboardData } = useDashboard();

    const chartData = [
        {
            name: "Assigned",
            value: dashboardData?.cardData?.assigned || 0,
            color: "#10B981",
            percentage: parseFloat(dashboardData?.percentData?.assigned || "0")
        },
        {
            name: "Inventory",
            value: dashboardData?.cardData?.inventory || 0,
            color: "#1E4BAF",
            percentage: parseFloat(dashboardData?.percentData?.inventory || "0")
        },
        {
            name: "Deactivated",
            value: dashboardData?.cardData?.deactivated || 0,
            color: "#B22222",
            percentage: parseFloat(dashboardData?.percentData?.deactivated || "0")
        },
        {
            name: "Allocated",
            value: dashboardData?.cardData?.allocated || 0,
            color: "#FFB000",
            percentage: parseFloat(dashboardData?.percentData?.allocated || "0")
        }
    ];

    return (
        <Card className="w-full max-w-full border-none bg-transparent shadow-sm rounded-lg border-gray-100">
            <CardHeader>
                <CardTitle>Meter Status</CardTitle>
            </CardHeader>
            <CardContent className="p-4 h-[200px]">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Legend List */}
                    <div className="w-full md:w-1/2 space-y-3">
                        {chartData.map((item, index) => (
                            <div key={index} className="flex items-center">
                                <span
                                    className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-sm text-gray-600 flex-grow">{item.name}</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {item.percentage.toFixed(1)}%
                                </span>
                            </div>
                        ))}
                        <div className="pt-3 mt-3 border-t border-gray-100 flex items-center">
                            <span className="text-sm font-medium text-gray-900">Total</span>
                            <span className="ml-auto text-sm font-medium text-gray-900">100%</span>
                        </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="w-full md:w-1/2 h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    paddingAngle={0}
                                    dataKey="value"
                                    className='cursor-pointer'
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (!active || !payload?.length) return null;
                                        const data = payload[0]?.payload ?? {};
                                        return (
                                            <div className="bg-white p-3 border rounded-md shadow-sm">
                                                <p className="font-medium">{data.name}</p>
                                                <p className="text-sm">
                                                    {data.percentage.toFixed(1)}% ({data.value} meters)
                                                </p>
                                            </div>
                                        );
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
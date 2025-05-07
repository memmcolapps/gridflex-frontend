'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { manufacturerData } from '@/lib/dashboardData';

export const ManufacturerDistribution = () => {
    const chartData = manufacturerData.labels.map((label, index) => ({
        name: label,
        value: manufacturerData.series[index],
    }));

    const total = manufacturerData.series.reduce((a, b) => a + b, 0);
    const barColor = '#769FCD';

    return (
        <Card className="w-full border-none bg-white shadow-sm rounded-lg border-gray-100">
            <CardHeader>
                <CardTitle>Manufacturer Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 20, bottom: 60, left: 40 }}
                            barSize={20}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                            <XAxis
                                dataKey="name"
                                angle={-45}
                                textAnchor="end"
                                height={60}
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                            />
                            <YAxis
                                tick={{ fill: '#6b7280' }}
                                tickFormatter={(value) => `${value}`}
                                domain={[0, 'auto']}
                            />
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (!active || !payload?.length) return null;
                                    const { name, value } = payload[0]?.payload ?? { name: '', value: 0 };
                                    const percentage = ((value / total) * 100).toFixed(1);

                                    return (
                                        <div className="bg-white p-3 border rounded-md shadow-sm">
                                            <p className="font-medium">{name}</p>
                                            <p className="text-sm">
                                                {percentage}% ({value} meters)
                                            </p>
                                        </div>
                                    );
                                }}
                            />
                            <Bar
                                dataKey="value"
                                name="Meters"
                                fill={barColor}
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};
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
import { useDashboard } from '@/hooks/use-dashboard';

export const ManufacturerDistribution = () => {
     const { data: dashboardData } = useDashboard(); // Uses unfiltered data

    // Use the manufacturers data directly from API response
    const chartData = dashboardData?.manufacturers?.map((manufacturer) => ({
        name: manufacturer.name,
        value: manufacturer.totalMeters,
    })) ?? [];

    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    const barColor = '#769FCD';

    return (
        <Card className="w-full border-none bg-transparent shadow-sm rounded-lg border-gray-100">
            <CardHeader>
                <CardTitle className='text-md'>Manufacturer Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{left: -30}}
                        barSize={30}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false}  className='h-90'/>
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
            </CardContent>
        </Card>
    );
};
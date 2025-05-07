import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { meterStatusData } from '@/lib/dashboardData';

ChartJS.register(ArcElement, Tooltip);

export const MeterStatus: React.FC = () => {
    return (
        <section className="bg-white p-5 rounded-xl shadow-xs border border-gray-100 w-[500px]">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Meter Status</h2>
            <div className="flex flex-row min-h-[16rem]">
                <div className="w-1/2 pr-4">
                    <ul className="space-y-2">
                        {meterStatusData.labels.map((label, index) => {
                            const total = meterStatusData.series.reduce((a, b) => a + b, 0);
                            const percentage = (((meterStatusData.series[index] ?? 0) / total) * 100).toFixed(1);
                            return (
                                <li key={index} className="flex items-center">
                                    <span
                                        className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                                        style={{ backgroundColor: meterStatusData.colors[index] }}
                                    ></span>
                                    <span className="text-sm text-gray-700 flex-grow">{label}</span>
                                    <span className="text-sm font-medium text-gray-900 ml-2 flex-shrink-0">{percentage}%</span>
                                </li>
                            );
                        })}
                        <li className="flex items-center pt-2 mt-2 border-t border-gray-100">
                            <span className="text-sm font-medium text-gray-900">Total</span>
                            <span className="ml-auto text-sm font-medium text-gray-900">100%</span>
                        </li>
                    </ul>
                </div>
                <div className="w-1/2">
                    {typeof window !== 'undefined' && (
                        <div className="h-full">
                            <Pie
                                data={{
                                    labels: meterStatusData.labels,
                                    datasets: [
                                        {
                                            data: meterStatusData.series,
                                            backgroundColor: meterStatusData.colors,
                                            borderWidth: 1,
                                            borderColor: '#fff',
                                        },
                                    ],
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { display: false },
                                        tooltip: {
                                            callbacks: {
                                                label: (context) => {
                                                    const label = context.label ?? '';
                                                    const value = context.raw ?? 0;
                                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                                    const percentage = Math.round((Number(value) / Number(total)) * 100);
                                                    return `${label}: ${percentage}% (${value})`;
                                                },
                                            },
                                        },
                                    },
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
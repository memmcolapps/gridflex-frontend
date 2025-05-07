import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { manufacturerData } from '@/lib/dashboardData';

ChartJS.register(ArcElement, Tooltip);

export const ManufacturerDistribution: React.FC = () => {
    return (
        <section className="bg-white p-5 rounded-xl shadow-xs border border-gray-100 w-[500px]">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Manufacturer Distribution</h2>
            <div className="flex flex-row min-h-[16rem]">
                <div className="w-1/2 pr-4 overflow-y-auto">
                    <ul className="space-y-2">
                        {manufacturerData.labels.map((label, index) => {
                            const total = manufacturerData.series.reduce((a, b) => a + b, 0);
                            const percentage = (((manufacturerData.series?.[index] ?? 0) / (total ?? 1)) * 100).toFixed(1);
                            return (
                                <li key={index} className="flex items-center">
                                    <span
                                        className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                                        style={{ backgroundColor: manufacturerData.colors[index] }}
                                    ></span>
                                    <span className="text-sm text-gray-700 flex-grow truncate">{label}</span>
                                    <span className="text-sm font-medium text-gray-900 ml-2 flex-shrink-0">{percentage}%</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className="w-1/2">
                    {typeof window !== 'undefined' && (
                        <div className="h-full">
                            <Doughnut
                                data={{
                                    labels: manufacturerData.labels,
                                    datasets: [
                                        {
                                            data: manufacturerData.series,
                                            backgroundColor: manufacturerData.colors,
                                            borderWidth: 1,
                                            borderColor: '#fff',
                                        },
                                    ],
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    cutout: '43%',
                                    plugins: {
                                        legend: { display: false },
                                        tooltip: {
                                            callbacks: {
                                                label: (context) => {
                                                    const label = context.label ?? '';
                                                    const value = context.raw ?? 0;
                                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                                    const percentage = ((Number(value) / Number(total)) * 100).toFixed(1);
                                                    return `${label}: ${percentage}%`;
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
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';
import { manufacturerData } from '@/lib/dashboardData';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

export const ManufacturerDistribution: React.FC = () => {
    return (
        <section className="bg-white p-5 rounded-xl shadow-xs border border-gray-100 w-[500px]">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Manufacturer Distribution</h2>
            <div className="min-h-[20rem]">
                {typeof window !== 'undefined' && (
                    <div className="h-full">
                        <Bar
                            data={{
                                labels: manufacturerData.labels,
                                datasets: [
                                    {
                                        label: 'Manufacturer Distribution',
                                        data: manufacturerData.series,
                                        backgroundColor: manufacturerData.colors,
                                        borderWidth: 1,
                                        borderColor: '#fff',
                                        barPercentage: 0.8,
                                        categoryPercentage: 0.9,
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false },
                                    tooltip: {
                                        backgroundColor: '#fff',
                                        titleColor: '#1f2937',
                                        bodyColor: '#1f2937',
                                        borderColor: '#e2e8f0',
                                        borderWidth: 1,
                                        padding: 12,
                                        callbacks: {
                                            label: (context) => {
                                                const label = context.label ?? '';
                                                const value = context.raw ?? 0;
                                                const total = (context.dataset.data as number[]).reduce((a, b) => (a ?? 0) + (b ?? 0), 0);
                                                const percentage = ((Number(value) / Number(total)) * 100).toFixed(1);
                                                return `${label}: ${percentage}% (${value})`;
                                            },
                                        },
                                    },
                                },
                                scales: {
                                    x: {
                                        grid: { display: false },
                                        ticks: {
                                            color: '#6b7280',
                                            maxRotation: 45,
                                            minRotation: 45,
                                            font: { size: 8 },
                                        },
                                    },
                                    y: {
                                        grid: { color: '#f0f0f0' },
                                        ticks: {
                                            color: '#6b7280',
                                            callback: (value) => `${value}`,
                                        },
                                        beginAtZero: true,
                                    },
                                },
                            }}
                        />
                    </div>
                )}
            </div>
        </section>
    );
};
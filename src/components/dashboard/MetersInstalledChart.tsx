import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
} from 'chart.js';
import { Button } from '@/components/ui/button';
import { chartData } from '@/lib/dashboardData';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

export const MetersInstalledChart: React.FC = () => {
    const [activeChart, setActiveChart] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');

    const dataByType = {
        monthly: chartData,
        quarterly: [
            { month: 'Q1', value: 165 },
            { month: 'Q2', value: 85 },
            { month: 'Q3', value: 175 },
            { month: 'Q4', value: 245 },
        ],
        yearly: [
            { month: '2021', value: 600 },
            { month: '2022', value: 650 },
            { month: '2023', value: 670 },
        ],
    };

    const currentData = dataByType[activeChart];

    return (
        <section className="bg-white p-5 rounded-xl shadow-xs border border-gray-100 w-[1000px]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-2 md:mb-0">Meters Installed Over Time</h2>
                <div className="flex gap-1">
                    <Button
                        onClick={() => setActiveChart('monthly')}
                        className={`px-3 py-1 text-sm rounded-lg ${activeChart === 'monthly' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Monthly
                    </Button>
                    <Button
                        onClick={() => setActiveChart('quarterly')}
                        className={`px-3 py-1 text-sm rounded-lg ${activeChart === 'quarterly' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Quarterly
                    </Button>
                    <Button
                        onClick={() => setActiveChart('yearly')}
                        className={`px-3 py-1 text-sm rounded-lg ${activeChart === 'yearly' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Yearly
                    </Button>
                </div>
            </div>
            <div className="min-h-[16rem]">
                {typeof window !== 'undefined' && (
                    <Line
                        data={{
                            labels: currentData.map((item) => item.month),
                            datasets: [
                                {
                                    label: 'Meters Installed',
                                    data: currentData.map((item) => item.value),
                                    borderColor: '#3B82F6',
                                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                    borderWidth: 2,
                                    pointBackgroundColor: '#3B82F6',
                                    pointBorderColor: '#fff',
                                    pointBorderWidth: 2,
                                    pointRadius: 4,
                                    pointHoverRadius: 6,
                                    tension: 0.1,
                                    fill: true,
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
                                        label: (context) => `${context.parsed.y} meters`,
                                    },
                                },
                            },
                            scales: {
                                x: {
                                    grid: { display: false },
                                    ticks: { color: '#6b7280' },
                                },
                                y: {
                                    grid: { color: '#f0f0f0', lineWidth: 0 },
                                    ticks: { color: '#6b7280' },
                                },
                            },
                        }}
                    />
                )}
            </div>
        </section>
    );
};
'use client'

import MonthlyTransactionChart from "@/components/vending-dashboard/monthly-transaction-charts";
import SummaryCards from "@/components/vending-dashboard/summary-cards";
import TokenTransactionCharts from "@/components/vending-dashboard/token-transaction-charts"
import { ContentHeader } from "../ui/content-header";
import { useState } from "react";
import { SearchAndFilters } from "../dashboard/SearchAndFilters";
import { useVendingDashboard } from "@/hooks/use-vending";
import { Skeleton } from "@/components/ui/skeleton";

export default function VendingDashboard() {
    const [selectedBand, setSelectedBand] = useState('Band');
    const [selectedYear, setSelectedYear] = useState('Year');
    const [selectedMeterCategory, setSelectedMeterCategory] = useState('Meter Category');

    const payload = {
        band: selectedBand !== 'Band' ? selectedBand : undefined,
        year: selectedYear !== 'Year' ? selectedYear : undefined,
        meterCategory: selectedMeterCategory !== 'Meter Category' ? selectedMeterCategory : undefined,
    };

    const { data: dashboardData, isLoading, error } = useVendingDashboard(payload);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-transparent px-4 sm:px-6 lg:px-8 py-6">
                <div className="w-full space-y-6 bg-transparent">
                    <div className="flex items-start justify-between bg-transparent">
                        <ContentHeader
                            title="Overview"
                            description="General overview of the vending management dashboard"
                        />
                    </div>

                    {/* Loading Skeleton for Filters */}
                    <section>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                                <div className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
                                <div className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
                                <div className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
                            </div>
                        </div>
                    </section>

                    {/* Loading Skeleton for Status Cards */}
                    <section>
                        <div className="grid h-40 w-full grid-cols-1 gap-4 bg-transparent sm:grid-cols-2 md:grid-cols-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                                        <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                                    </div>
                                    <div className="mt-4">
                                        <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-12 mt-2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Loading Skeleton for Charts */}
                    <section className="mt-10 rounded-lg bg-white pt-6 shadow-sm border border-gray-200">
                        <div className="px-6 mb-4">
                            <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
                        </div>
                        <div className="flex gap-2 mb-6 px-6">
                            <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
                            <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
                        </div>
                        <div className="h-[200px] bg-gray-100 rounded animate-pulse mx-6 mb-6"></div>
                    </section>

                    {/* Loading Skeleton for Bottom Section */}
                    <section className="px-4">
                        <div className="w-full">
                            <div className="grid grid-cols-1 gap-6 bg-transparent pt-6 md:grid-cols-2">
                                {/* Token Distribution Skeleton */}
                                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                                    <div className="p-6">
                                        <div className="h-6 bg-gray-200 rounded animate-pulse w-40 mb-4"></div>
                                        <div className="space-y-3">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <div key={i} className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div className="h-3 w-3 bg-gray-200 rounded-full mr-2 animate-pulse"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                                                    </div>
                                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Transaction Status Skeleton */}
                                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                                    <div className="p-6">
                                        <div className="h-6 bg-gray-200 rounded animate-pulse w-24 mb-4"></div>
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <div className="w-full md:w-1/2 space-y-3">
                                                {[1, 2, 3, 4].map((i) => (
                                                    <div key={i} className="flex items-center">
                                                        <div className="h-3 w-3 bg-gray-200 rounded-full mr-2 animate-pulse"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-16 flex-grow"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full md:w-1/2 h-[200px] bg-gray-100 rounded animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div>Error loading dashboard data: {error.message}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-screen-2xl space-y-6">
                <div className="flex justify-between items-start">
                    <ContentHeader
                        title="Overview"
                        description="General overview of the vending management dashboard"
                    />
                </div>
                <section>
                    <SearchAndFilters
                        selectedBand={selectedBand}
                        setSelectedBand={setSelectedBand}
                        selectedMeterCategory={selectedMeterCategory}
                        setSelectedMeterCategory={setSelectedMeterCategory}
                        selectedYear={selectedYear}
                        setSelectedYear={setSelectedYear}
                    />
                </section>

                <SummaryCards cardData={dashboardData?.cardData} />
                <TokenTransactionCharts
                    tokenDistribution={dashboardData?.tokenDistribution}
                    transactionStatus={dashboardData?.transactionStatus}
                />
                <MonthlyTransactionChart transactionOverMonths={dashboardData?.transactionOverMonths} />
            </div>
        </div>
    )
}

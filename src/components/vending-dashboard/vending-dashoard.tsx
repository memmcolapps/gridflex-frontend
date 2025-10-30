'use client'

import MonthlyTransactionChart from "@/components/vending-dashboard/monthly-transaction-charts";
import SummaryCards from "@/components/vending-dashboard/summary-cards";
import TokenTransactionCharts from "@/components/vending-dashboard/token-transaction-charts"
import { ContentHeader } from "../ui/content-header";
import { useState } from "react";
import { SearchAndFilters } from "../dashboard/SearchAndFilters";
import { useVendingDashboard } from "@/hooks/use-vending";

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
            <div className="min-h-screen flex items-center justify-center">
                <div>Loading dashboard data...</div>
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

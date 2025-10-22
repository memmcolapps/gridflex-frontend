'use client'

import MonthlyTransactionChart from "@/components/vending-dashboard/monthly-transaction-charts";
import SummaryCards from "@/components/vending-dashboard/summary-cards";
import TokenTransactionCharts from "@/components/vending-dashboard/token-transaction-charts"
import { ContentHeader } from "../ui/content-header";
import { useState } from "react";
import { SearchAndFilters } from "../dashboard/SearchAndFilters";

export default function VendingDashboard() {
    const [selectedBand, setSelectedBand] = useState('Band');
    const [selectedYear, setSelectedYear] = useState('Year');
    const [selectedMeterCategory, setSelectedMeterCategory] = useState('Meter Category');
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
                
                <SummaryCards />
                <TokenTransactionCharts />
                <MonthlyTransactionChart />
            </div>
        </div>
    )
}

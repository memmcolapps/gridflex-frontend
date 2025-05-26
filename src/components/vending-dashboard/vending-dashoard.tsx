'use client'
import { useState } from "react";
import { SearchAndFilters } from "../dashboard/SearchAndFilters";
import { ContentHeader } from "../ui/content-header";
import MonthlyTransactionChart from "./monthly-transaction-charts";
import SummaryCards from "./summary-cards";
import TokenTransactionCharts from "./token-transaction-charts";


export default function VendingDashboard() {
      const [searchTerm, setSearchTerm] = useState('');
      const [selectedBand, setSelectedBand] = useState('Band');
      const [selectedYear, setSelectedYear] = useState('Year');
      const [selectedMeterType, setSelectedMeterType] = useState('Meter Type');
    return (

        
        <div className="space-y-6 p-4">
               <ContentHeader
                        title="Overview"
                        description="General overview of Data Management Dashboard"
                      />
                      
                              <section>
                                <SearchAndFilters
                                  searchTerm={searchTerm}
                                  setSearchTerm={setSearchTerm}
                                  selectedBand={selectedBand}
                                  setSelectedBand={setSelectedBand}
                                  selectedYear={selectedYear}
                                  setSelectedYear={setSelectedYear}
                                  selectedMeterType={selectedMeterType}
                                  setSelectedMeterType={setSelectedMeterType}
                                />
                              </section>
            <SummaryCards />
            <TokenTransactionCharts />
            <MonthlyTransactionChart />
        </div>
    )
}

"use client";

import OverviewCard from "@/components/hes/dashboard/overviewcard";
import ChartCard from "@/components/hes/dashboard/chartcard";
import CommunicationReportTable from "@/components/hes/dashboard/communication-report-table";
import { hesStatusCards } from "@/lib/dashboardData";
import { ArrowUpDown, Ban, CircleAlert, CircleCheck, CircleCheckBig, CircleX, CircleXIcon } from "lucide-react"; // Import lucide-react icons
import React, { useState } from "react";
import { ContentHeader } from "@/components/ui/content-header";
import { SearchAndFilters } from "@/components/dashboard/SearchAndFilters";

export default function HESDashboardPage() {
    // Map icon names to components (assuming hesStatusCards uses string names for icons)
    const iconMap: { [key: string]: React.ReactNode } = {
        CircleCheckBig: <CircleCheckBig size={24} className="text-[#161CCA]" />, // Adjust size as needed
        CircleCheck: <CircleCheck size={24} className="text-[#22C55E]" />,
        Ban: <Ban size={24} className="text-[#EBA13E]" />,
        CircleXIcon: <CircleXIcon size={24} className="text-[#25272C]" />,
    };

    // const [searchTerm, setSearchTerm] = useState("");
    const [selectedBand, setSelectedBand] = useState("Band");
    const [selectedYear, setSelectedYear] = useState("Year");
    const [selectedMeterType, setSelectedMeterType] = useState("Meter Type");

    return (
        <div className="p-6 bg-gray-50">
            <div className="flex items-start justify-between pt-6 bg-transparent">
                <ContentHeader
                    title="Overview"
                    description="General overview of the HES dashboard"
                />
            </div>
            <section>
                <SearchAndFilters
                    // searchTerm={searchTerm}
                    selectedBand={selectedBand}
                    setSelectedBand={setSelectedBand}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    selectedMeterType={selectedMeterType}
                    setSelectedMeterType={setSelectedMeterType}
                />
            </section>
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                {/* Removed fixed h-40 to allow dynamic height based on content */}
                {hesStatusCards.map((card, index) => (
                    <OverviewCard
                        key={index}
                        title={card.title}
                        value={card.value}
                        status={card.status}
                        icon={iconMap[card.icon] || null} // Map the icon name to the component
                        bgColor={card.bgColor}
                        borderColor={card.borderColor} // Optional border color"
                        iconBgColor={card.iconBgColor}
                    />
                ))}
            </div>
            <div className="flex flex-col md:flex-row gap-4 mt-6">
                <ChartCard title="Real-time Communication Logs" chartType="line" data={{}} />
                <ChartCard title="Data Collection Scheduler Rate" chartType="pie" data={{ active: 95, paused: 5 }} />
            </div>
            <CommunicationReportTable />
        </div>
    );
}
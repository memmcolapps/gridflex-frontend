"use client";

import OverviewCard from "@/components/hes/dashboard/overviewcard";
import ChartCard from "@/components/hes/dashboard/chartcard";
import CommunicationReportTable from "@/components/hes/dashboard/communication-report-table";
import { hesStatusCards } from "@/lib/dashboardData";
import { ArrowUpDown, Ban, CircleAlert, CircleCheck, CircleCheckBig, CircleX, CircleXIcon } from "lucide-react";
import React, { useState } from "react";
import { ContentHeader } from "@/components/ui/content-header";
import { FiltersOnly } from "@/components/hes/dashboard/filtersonly";

// Define types for the data structures
interface LineData {
    hour: string;
    value: number;
}

interface PieData {
    name: string;
    value: number;
}

// Sample data
const lineData: LineData[] = [
    { hour: "4 hrs", value: 60 },
    { hour: "8 hrs", value: 30 },
    { hour: "12 hrs", value: 40 },
    { hour: "16 hrs", value: 35 },
    { hour: "20 hrs", value: 30 },
    { hour: "24 hrs", value: 80 },
];

const pieData: PieData[] = [
    { name: "Active Schedule", value: 95 },
    { name: "Paused Schedule", value: 5 },
];

export default function HESDashboardPage() {
    const iconMap: Record<string, React.ReactNode> = {
        CircleCheckBig: <CircleCheckBig size={24} className="text-[#161CCA]" />,
        CircleCheck: <CircleCheck size={24} className="text-[#22C55E]" />,
        Ban: <Ban size={24} className="text-[#EBA13E]" />,
        CircleXIcon: <CircleXIcon size={24} className="text-[#25272C]" />,
    };


    const [selectedBand, setSelectedBand] = useState("Band");
    const [selectedYear, setSelectedYear] = useState("Year");
    const [selectedMeterType, setSelectedMeterType] = useState("Meter Type");

    return (
        <div className="p-10 bg-transparent">
            <div className="flex items-start justify-between bg-transparent">
                <ContentHeader
                    title="Overview"
                    description="General overview of the HES dashboard"
                />
            </div>
            <section>
                <FiltersOnly
                    selectedBand={selectedBand}
                    setSelectedBand={setSelectedBand}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    selectedMeterType={selectedMeterType}
                    setSelectedMeterType={setSelectedMeterType}
                />
            </section>
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 mt-4">
                {hesStatusCards.map((card, index) => (
                    <OverviewCard
                        key={index}
                        title={card.title}
                        value={card.value}
                        status={card.status}
                        icon={iconMap[card.icon] ?? null}
                        bgColor={card.bgColor}
                        borderColor={card.borderColor}
                        iconBgColor={card.iconBgColor}
                    />
                ))}
            </div>
            <div className="flex flex-col md:flex-row gap-4 mt-6 h-fit w-full">
                <ChartCard title="Real-time Communication Logs" chartType="line" data={lineData} />
                <ChartCard title="Data Collection Scheduler Rate" chartType="pie" data={pieData} />
            </div>
            <CommunicationReportTable />
        </div>
    );
}
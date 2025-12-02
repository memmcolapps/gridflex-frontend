"use client";

import OverviewCard from "@/components/hes/dashboard/overviewcard";
import ChartCard from "@/components/hes/dashboard/chartcard";
import EventsTable from "@/components/hes/dashboard/events-table";
import CommunicationSummaryChart from "@/components/hes/dashboard/communication-summary-chart";
import SimpleCommunicationReport from "@/components/hes/dashboard/simple-communication-report";
import { Ban, CircleCheck, CircleCheckBig } from "lucide-react";
import React, { useState } from "react";
import { ContentHeader } from "@/components/ui/content-header";
import { FiltersOnly } from "@/components/hes/dashboard/filtersonly";
import { useHesDashboard } from "@/hooks/use-dashboard";
import type { CommunicationReport } from "@/types/dashboard";
import type { ReportData } from "@/components/hes/dashboard/simple-communication-report";

// Helper function to safely convert CommunicationReport to ReportData
const convertToReportData = (report: CommunicationReport, index: number): ReportData => {
  return {
    serialNumber: (index + 1).toString().padStart(2, '0'),
    meterNo: report.meterNo || 'N/A',
    meterModel: report.meterModel || 'Unknown',
    status: (report.status === 'Online' || report.status === 'Offline') 
      ? report.status as 'Online' | 'Offline' 
      : 'Offline' as const,
    lastSync: report.lastSync ? new Date(report.lastSync).toLocaleString() : 'Never'
  };
};

export default function HESDashboardPage() {
  const [selectedBand, setSelectedBand] = useState("Band");
  const [selectedYear, setSelectedYear] = useState("Year");
  const [selectedMeterType, setSelectedMeterType] = useState("Meter Type");
  // API call enabled with new JSON format
  const {data: hesDashboardData, isLoading } = useHesDashboard()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent px-4 sm:px-6 lg:px-8 py-6">
        <div className="w-full space-y-6 bg-transparent">
          <div className="flex items-start justify-between bg-transparent">
            <ContentHeader
              title="Overview"
              description="General overview of the HES dashboard"
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
            <div className="grid h-32 w-full grid-cols-1 gap-4 bg-transparent sm:grid-cols-2 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                  <div className="mt-4">
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Loading Skeleton for Charts and Tables */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm h-[300px]">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-48 mb-4"></div>
              <div className="h-[200px] bg-gray-100 rounded animate-pulse"></div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm h-[300px]">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-24 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 bg-gray-100 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </section>

          {/* Loading Skeleton for Bottom Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm h-[320px]">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-48 mb-4"></div>
              <div className="h-[240px] bg-gray-100 rounded animate-pulse"></div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm h-[320px]">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-40 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 bg-gray-100 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-0 bg-transparent p-6">
      <div className="flex items-start justify-between bg-transparent">
        <ContentHeader
          title="Overview"
          description="General overview of the HES dashboard"
        />
      </div>

      {/* Filters Section */}
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

      {/* Overview Cards - 3 cards in a row */}
      <div className="mt-6 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <OverviewCard
          title="Total Smart Meters"
          icon={<CircleCheckBig color="oklch(62.3% 0.214 259.815)" />}
          bgColor="bg-[#DBE6FE]"
          iconBgColor="bg-[#BFD3FE] rounded-full"
          value={hesDashboardData?.meterSummary?.totalSmartMeters?.toString() ?? "0"}
          status=""
          borderColor="border-[#DBE6FE]"
        />
        <OverviewCard
          title="Online"
          icon={<CircleCheck color="oklch(72.3% 0.219 149.579)" />}
          bgColor="bg-[#DCFCE8]"
          iconBgColor="bg-[rgba(134,239,172,0.5)]"
          value={hesDashboardData?.meterSummary?.online?.toString() ?? "0"}
          status=""
          borderColor="border-[#DCFCE8]"
        />
        <OverviewCard
          title="Offline"
          icon={<Ban color="oklch(79.5% 0.184 86.047)" />}
          bgColor="bg-[#FEF2C3]"
          iconBgColor="bg-[#FEE78A]"
          value={hesDashboardData?.meterSummary?.offline?.toString() ?? "0"}
          status=""
          borderColor="border-[#FEF2C3]"
        />
      </div>

      {/* Middle Section - Real-time Communication Logs and Events */}
      <div className="mt-6 grid w-full grid-cols-1 gap-6 md:grid-cols-2">
        <ChartCard
          title="Real-time Communication Logs"
          chartType="line"
          data={hesDashboardData?.communicationLogs}
        />
        <div className="mt-4">
          <EventsTable data={hesDashboardData?.eventLogs?.map((event, index: number) => ({
            serialNumber: (index + 1).toString().padStart(2, '0'),
            meterNo: event.meterNumber || 'N/A',
            time: event.eventTime ? new Date(event.eventTime).toLocaleString() : 'N/A',
            eventType: event.eventTypeName || 'Unknown',
            event: event.eventName || 'Unknown Event'
          })) ?? []} />
        </div>

      </div>

      {/* Bottom Section - Communication Summary and Communication Report */}
      <div className="mt-6 grid w-full grid-cols-1 gap-6 md:grid-cols-2">
        <CommunicationSummaryChart data={hesDashboardData?.communicationLogs?.map(log => ({
          period: log.timeLabel,
          value: log.value
        })) ?? [
          { period: "4 hrs", value: 0 },
          { period: "8 hrs", value: 0 },
          { period: "12 hrs", value: 0 },
          { period: "16 hrs", value: 0 },
          { period: "20 hrs", value: 0 },
          { period: "24 hrs", value: 0 }
        ]} />
        <SimpleCommunicationReport data={hesDashboardData?.communicationReport?.map(convertToReportData) ?? []} />
      </div>
    </div>
  );
}

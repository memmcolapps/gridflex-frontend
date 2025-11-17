"use client";

import OverviewCard from "@/components/hes/dashboard/overviewcard";
import ChartCard from "@/components/hes/dashboard/chartcard";
import CommunicationReportTable from "@/components/hes/dashboard/communication-report-table";
import { Ban, CircleCheck, CircleCheckBig, CircleXIcon } from "lucide-react";
import React, { useState } from "react";
import { ContentHeader } from "@/components/ui/content-header";
import { FiltersOnly } from "@/components/hes/dashboard/filtersonly";
import { useHesDashboard } from "@/hooks/use-dashboard";

export default function HESDashboardPage() {
  const [selectedBand, setSelectedBand] = useState("Band");
  const [selectedYear, setSelectedYear] = useState("Year");
  const [selectedMeterType, setSelectedMeterType] = useState("Meter Type");
  const {data: hesDashboardData, isLoading } = useHesDashboard()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent px-4 sm:px-6 lg:px-8 py-6">
        <div className="w-full space-y-6 bg-transparent">
          <div className="flex items-start justify-between bg-transparent">
            <ContentHeader
              title="Overview"
              description="General overview of Data Management Dashboard"
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

          {/* Loading Skeleton for Chart */}
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
                {/* Manufacturer Distribution Skeleton */}
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

                {/* Meter Status Skeleton */}
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

  return (
    <div className="mt-0 bg-transparent p-6">
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
      <div className="mt-4 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
         <OverviewCard
          title="Total Smart Meters"
          icon={<CircleCheckBig color="oklch(62.3% 0.214 259.815)"/>}
          bgColor={"bg-[#DBE6FE]"}
          iconBgColor={"bg-[#BFD3FE] rounded-full"}
          value={hesDashboardData?.meterSummary?.totalSmartMeters.toString() ?? ''}
          status=""
          borderColor="border-[#DBE6FE]"
        />
        <OverviewCard
          title="Online"
          icon={<CircleCheck color="oklch(72.3% 0.219 149.579)"/>}
          bgColor={"bg-[#DCFCE8]"}
          iconBgColor={"bg-[rgba(134,239,172,0.5)]"}
          value={hesDashboardData?.meterSummary?.online.toString() ?? ''}
          status=""
          borderColor="border-[#DCFCE8]"
        />
        <OverviewCard
          title="Offline"
          icon={<Ban color="oklch(79.5% 0.184 86.047)"/>}
          bgColor={"bg-[#FEF2C3]"}
          iconBgColor={"bg-[#FEE78A]"}
          value={hesDashboardData?.meterSummary?.offline.toString() ?? ''}
          status=""
          borderColor="border-[#FEF2C3]"
        />
        <OverviewCard
          title="Failed Commands"
          icon={<CircleXIcon color="oklch(55.1% 0.027 264.364)"/>}
          bgColor={"bg-[#D8DBDF]"}
          iconBgColor={"bg-[#B6BAC3]"}
          value={hesDashboardData?.meterSummary?.failedCommands.toString() ?? ''}
          status=""
          borderColor="border-[#D8DBDF]"
        />
      </div>
      <div className="mt-6 flex h-fit w-full flex-col gap-4 md:flex-row">
        <ChartCard
          title="Real-time Communication Logs"
          chartType="line"
          data={hesDashboardData?.communicationLogs}
        />
        <ChartCard
          title="Data Collection Scheduler Rate"
          chartType="pie"
          data={hesDashboardData?.schedulerRate}
        />
      </div>
      <CommunicationReportTable />
    </div>
  );
}

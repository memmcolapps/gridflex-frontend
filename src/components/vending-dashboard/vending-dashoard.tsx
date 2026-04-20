"use client";

import MonthlyTransactionChart from "@/components/vending-dashboard/monthly-transaction-charts";
import SummaryCards from "@/components/vending-dashboard/summary-cards";
import TokenTransactionCharts from "@/components/vending-dashboard/token-transaction-charts";
import { ContentHeader } from "../ui/content-header";
import { useState } from "react";
import { SearchAndFilters } from "../dashboard/SearchAndFilters";
import { useVendingDashboard } from "@/hooks/use-vending";

export default function VendingDashboard() {
  const [selectedBand, setSelectedBand] = useState("Band");
  const [selectedYear, setSelectedYear] = useState("Year");
  const [selectedMeterClass, setSelectedMeterClass] = useState<
    string | undefined
  >("Meter Class");

  const payload = {
    band: selectedBand !== "Band" ? selectedBand : undefined,
    year: selectedYear !== "Year" ? selectedYear : undefined,
    meterClass:
      selectedMeterClass !== "Meter Class" ? selectedMeterClass : undefined,
  };

  const {
    data: dashboardData,
    isLoading,
    error,
  } = useVendingDashboard(payload);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent px-4 py-6 sm:px-6 lg:px-8">
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
                <div className="h-10 animate-pulse rounded-md bg-gray-200"></div>
                <div className="h-10 animate-pulse rounded-md bg-gray-200"></div>
                <div className="h-10 animate-pulse rounded-md bg-gray-200"></div>
              </div>
            </div>
          </section>

          {/* Loading Skeleton for Status Cards */}
          <section>
            <div className="grid h-40 w-full grid-cols-1 gap-4 bg-transparent sm:grid-cols-2 md:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200"></div>
                  </div>
                  <div className="mt-4">
                    <div className="h-8 w-16 animate-pulse rounded bg-gray-200"></div>
                    <div className="mt-2 h-4 w-12 animate-pulse rounded bg-gray-200"></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Loading Skeleton for Charts */}
          <section className="mt-10 rounded-lg border border-gray-200 bg-white pt-6 shadow-sm">
            <div className="mb-4 px-6">
              <div className="h-6 w-48 animate-pulse rounded bg-gray-200"></div>
            </div>
            <div className="mb-6 flex gap-2 px-6">
              <div className="h-8 w-16 animate-pulse rounded bg-gray-200"></div>
              <div className="h-8 w-16 animate-pulse rounded bg-gray-200"></div>
            </div>
            <div className="mx-6 mb-6 h-[200px] animate-pulse rounded bg-gray-100"></div>
          </section>

          {/* Loading Skeleton for Bottom Section */}
          <section className="px-4">
            <div className="w-full">
              <div className="grid grid-cols-1 gap-6 bg-transparent pt-6 md:grid-cols-2">
                {/* Token Distribution Skeleton */}
                <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                  <div className="p-6">
                    <div className="mb-4 h-6 w-40 animate-pulse rounded bg-gray-200"></div>
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <div className="mr-2 h-3 w-3 animate-pulse rounded-full bg-gray-200"></div>
                            <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
                          </div>
                          <div className="h-4 w-8 animate-pulse rounded bg-gray-200"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Transaction Status Skeleton */}
                <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                  <div className="p-6">
                    <div className="mb-4 h-6 w-24 animate-pulse rounded bg-gray-200"></div>
                    <div className="flex flex-col gap-4 md:flex-row">
                      <div className="w-full space-y-3 md:w-1/2">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="flex items-center">
                            <div className="mr-2 h-3 w-3 animate-pulse rounded-full bg-gray-200"></div>
                            <div className="h-4 w-16 flex-grow animate-pulse rounded bg-gray-200"></div>
                            <div className="h-4 w-8 animate-pulse rounded bg-gray-200"></div>
                          </div>
                        ))}
                      </div>
                      <div className="h-[200px] w-full animate-pulse rounded bg-gray-100 md:w-1/2"></div>
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
      <div className="flex min-h-screen items-center justify-center">
        <div>Error loading dashboard data: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-screen-2xl space-y-6">
        <div className="flex items-start justify-between">
          <ContentHeader
            title="Overview"
            description="General overview of the vending management dashboard"
          />
        </div>
        <section>
          <SearchAndFilters
            selectedBand={selectedBand}
            setSelectedBand={setSelectedBand}
            selectedMeterClass={selectedMeterClass}
            setSelectedMeterClass={setSelectedMeterClass}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
          />
        </section>

        <SummaryCards cardData={dashboardData?.cardData} />
        <TokenTransactionCharts
          tokenDistribution={dashboardData?.tokenDistribution}
          transactionStatus={dashboardData?.transactionStatus}
        />
        <MonthlyTransactionChart
          transactionOverMonths={dashboardData?.transactionOverMonths}
        />
      </div>
    </div>
  );
}

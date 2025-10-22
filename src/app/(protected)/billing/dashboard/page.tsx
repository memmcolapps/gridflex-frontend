"use client";

import { useState } from "react";
import { ContentHeader } from "@/components/ui/content-header";
import SummaryCards from "@/components/billing/dashboard/summary-cards";
import { SearchAndFilters } from "@/components/billing/dashboard/SearchAndFilters";
import { OutstandingChart } from "@/components/billing/dashboard/OutstandingChart";
import { EnergyConsumedChart } from "@/components/billing/dashboard/EnergyConsumedChart";

export default function BillingDashboardPage() {
  const [selectedModeOfPayment, setSelectedModeOfPayment] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  return (
    <div className="min-h-screen bg-transparent p-6">
      <div className="max-w-screen-2xl space-y-6">
        <div className="flex items-start justify-between">
          <ContentHeader
            title="Overview"
            description="General overview of billing management dashboard"
          />
        </div>

        <section>
          <SearchAndFilters
            selectedModeOfPayment={selectedModeOfPayment}
            setSelectedModeOfPayment={setSelectedModeOfPayment}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
          />
        </section>

        <section>
          <SummaryCards />
        </section>

        <section className="mt-10 rounded-lg bg-transparent pt-6 shadow-sm">
          <EnergyConsumedChart />
        </section>

        <section className="bg-transparent">
          <OutstandingChart />
        </section>
      </div>
    </div>
  );
}

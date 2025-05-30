"use client";
import React, { useState } from "react";
import LiabilityTable from "@/components/debt-setting/liability-table";
import { ContentHeader } from "@/components/ui/content-header";
import AddPercentageRangeDialog from "@/components/debt-setting/percentage-range-dialog";
import AddLiabilityDialog from "@/components/debt-setting/liabilty-dialog";

type Liability = {
    sNo: number;
    liabilityName: string;
    liabilityCode: string;
    approvalStatus: "Pending" | "Rejected" | "Approved";
    deactivated?: boolean;
};

type PercentageRange = {
    sNo: number;
    percentage: string;
    percentageCode: string;
    band: string;
    amountStartRange: string;
    amountEndRange: string;
    approvalStatus: "Pending" | "Rejected" | "Approved";
    deactivated?: boolean;
};

type TableData = (Liability | PercentageRange) & { deactivated?: boolean };


export default function DebtSettingsPage() {
    const [view, setView] = useState<"liability" | "percentage">("liability");
    
    const handleDataChange = (_data: TableData[]) => {
        // Optional: Store data for display or other purposes
    };

    // Handle adding a percentage range (passed to LiabilityTable)
    const handleAddPercentageRange = (_range: { percentage: string; amountStartRange: string; amountEndRange: string }) => {
        // LiabilityTable will handle the addition internally
    };

    // Handle adding a liability (placeholder; implement in LiabilityTable if needed)
    const handleAddLiability = (newLiability: { liabilityName: string; liabilityCode: string }) => {
        console.log("Add Liability action triggered:", newLiability);
        // This would need to be implemented in LiabilityTable if you want to add liabilities
    };

    return (
        <div className="min-h-screen">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl space-y-6 border-none bg-white">
                <div className="flex justify-between items-start pt-6">
                    <ContentHeader
                        title="Debit Setting"
                        description="Set and Manage reasons for liability and percentage range here"
                    />
                    <div className="flex gap-2">
                        {view === "liability" ? (
                            <AddLiabilityDialog onAddLiability={handleAddLiability} />
                        ) : (
                            <AddPercentageRangeDialog onAddPercentageRange={handleAddPercentageRange} />
                        )}
                    </div>
                </div>
                <section>
                    <LiabilityTable
                        view={view}
                        onViewChange={setView}
                        onDataChange={handleDataChange}
                        onAddPercentageRange={handleAddPercentageRange}
                    />
                </section>
            </div>
        </div>
    );
}
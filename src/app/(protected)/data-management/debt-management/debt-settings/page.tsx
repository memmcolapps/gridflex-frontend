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
};

type PercentageRange = {
    sNo: number;
    percentage: string;
    amountRange: string;
    approvalStatus: "Pending" | "Rejected" | "Approved";
};

export default function DebtSettingsPage() {
    const [view, setView] = useState<"liability" | "percentage">("liability");
    const [liabilities, setLiabilities] = useState<Liability[]>([
        { sNo: 1, liabilityName: "Bypass", liabilityCode: "C90bqt", approvalStatus: "Pending" },
        { sNo: 2, liabilityName: "Meter Refund", liabilityCode: "C90bqt", approvalStatus: "Pending" },
        { sNo: 3, liabilityName: "Outstanding Debit", liabilityCode: "C90bqt", approvalStatus: "Rejected" },
        { sNo: 4, liabilityName: "Capme", liabilityCode: "C90bqt", approvalStatus: "Approved" },
        { sNo: 5, liabilityName: "Electricity Deficit", liabilityCode: "C90bqt", approvalStatus: "Approved" },
    ]);
    const [percentageRanges, setPercentageRanges] = useState<PercentageRange[]>([
        { sNo: 1, percentage: "2%", amountRange: "0-9.999", approvalStatus: "Pending" },
        { sNo: 2, percentage: "5%", amountRange: "10,000-99.999", approvalStatus: "Pending" },
        { sNo: 3, percentage: "10%", amountRange: "100,000-999.999", approvalStatus: "Approved" },
        { sNo: 4, percentage: "15%", amountRange: "1,000,000-9,999.999", approvalStatus: "Approved" },
        { sNo: 5, percentage: "20%", amountRange: "10,000,000-99,999.999", approvalStatus: "Approved" },
    ]);

    const handleAddLiability = (newLiability: { liabilityName: string; liabilityCode: string }) => {
        const newLiabilityEntry: Liability = {
            sNo: liabilities.length + 1,
            liabilityName: newLiability.liabilityName,
            liabilityCode: newLiability.liabilityCode,
            approvalStatus: "Pending",
        };
        setLiabilities([...liabilities, newLiabilityEntry]);
    };

    const handleAddPercentageRange = (range: { percentage: string; amountStartRange: string; amountEndRange: string }) => {
        const newRangeEntry: PercentageRange = {
            sNo: percentageRanges.length + 1,
            percentage: range.percentage,
            amountRange: `${range.amountStartRange}-${range.amountEndRange}`,
            approvalStatus: "Pending",
        };
        setPercentageRanges([...percentageRanges, newRangeEntry]);
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
                        data={view === "liability" ? liabilities : percentageRanges}
                        view={view}
                        onViewChange={setView}
                    />
                </section>
            </div>
        </div>
    );
}
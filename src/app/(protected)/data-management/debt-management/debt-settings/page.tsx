/* eslint-disable @typescript-eslint/no-empty-function */
"use client";
import React, { useState } from "react";
import LiabilityTable from "@/components/debt-setting/liability-table";
import { ContentHeader } from "@/components/ui/content-header";
import AddPercentageRangeDialog from "@/components/debt-setting/percentage-range-dialog";
import AddLiabilityDialog from "@/components/debt-setting/liabilty-dialog";
import { type TableData } from "@/types/credit-debit";
import { usePermissions } from "@/hooks/use-permissions";

export default function DebtSettingsPage() {
    const { canEdit } = usePermissions();
    const [view, setView] = useState<"liability" | "percentage">("liability");
    const handleDataChange = (_data: TableData[]) => {};

    const handleAddLiability = (newLiability: {
        liabilityName: string;
        liabilityCode: string;
    }) => {
        console.log("Add Liability action triggered:", newLiability);
    };

    return (
        <div className="min-h-screen bg-transparent p-6">
            <div className="mx-auto max-w-screen-2xl space-y-6 border-none bg-transparent">
                <div className="flex items-start justify-between bg-transparent">
                    <ContentHeader
                        title="Debt Setting"
                        description="Set and Manage reasons for liability and percentage range here"
                    />
                    {canEdit && (
                        <div className="flex gap-2">
                            {view === "liability" ? (
                                <AddLiabilityDialog onAddLiability={handleAddLiability} />
                            ) : (
                                <AddPercentageRangeDialog />
                            )}
                        </div>
                    )}
                </div>
                <section className="bg-transparent">
                    <LiabilityTable
                        view={view}
                        onViewChange={setView}
                        onDataChange={handleDataChange}
                    />
                </section>
            </div>
        </div>
    );
}
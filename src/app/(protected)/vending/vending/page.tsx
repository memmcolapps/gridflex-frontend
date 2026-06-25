"use client";
import { ContentHeader } from "@/components/ui/content-header";
import VendTokenDialog from "@/components/vending/vending-dialog";
import VendingTable from "@/components/vending/vending-table";
import { ExportButton } from "@/components/ui/export-button";
import { useState, useMemo } from "react";
import { usePermissions } from "@/hooks/use-permissions";
import { useVendingTransactions } from "@/hooks/use-vending";
import { FilterControl, SearchControl, SortControl } from "@/components/search-control";

export default function VendingPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({});
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
    const { canEdit } = usePermissions();

    const statusFilter = useMemo(() => {
        if (activeFilters.successful) return "Successful";
        if (activeFilters.pending) return "Pending";
        if (activeFilters.failed) return "Failed";
        return "";
    }, [activeFilters]);

    // Fetch transactions data for export
    const { data: rawTransactionsData } = useVendingTransactions({
        page: 1,
        size: 1000,
        search: searchQuery,
        status: statusFilter,
        sortDirection,
    });

    const transactionsData = useMemo(() => {
        return rawTransactionsData?.messages ?? [];
    }, [rawTransactionsData]);

    const filterSections = [
        {
            title: "Status",
            options: [
                { label: "Successful", id: "successful" },
                { label: "Pending", id: "pending" },
                { label: "Failed", id: "failed" },
            ],
        },
    ];

    // Export columns
    const exportColumns = [
        { key: 'meterAccountNumber', label: 'Account Number' },
        { key: 'meterNumber', label: 'Meter Number' },
        { key: 'tokenType', label: 'Token Type' },
        { key: 'tariffName', label: 'Tariff' },
        { key: 'initialAmount', label: 'Amount' },
        { key: 'unitCost', label: 'Unit Cost' },
        { key: 'vatAmount', label: 'VAT' },
        { key: 'unit', label: 'Units' },
        { key: 'status', label: 'Status' },
    ];

    return (
        <div className="p-6">
            {/* header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <ContentHeader
                    title="Vending"
                    description="Vend for all token types"
                />
                {canEdit && (
                    <div className="flex flex-col md:flex-row gap-2">
                        <VendTokenDialog />
                    </div>
                )}
            </div>
            {/* Search and filter section */}
            <div className="mb-8 flex items-center justify-between">
                <div className="mb-8 flex items-center gap-10">
                    <SearchControl
                        onSearchChange={setSearchQuery}
                        value={searchQuery}
                        placeholder="Search transactions..."
                    />
                    <div className="flex gap-2">
                        <FilterControl
                            sections={filterSections}
                            onApply={setActiveFilters}
                            onReset={() => setActiveFilters({})}
                        />
                        <SortControl
                            onSortChange={(direction) =>
                                setSortDirection(direction === "desc" ? "desc" : "asc")
                            }
                            currentSort={sortDirection}
                        />
                    </div>
                </div>
                <div className="flex gap-5">
                    <ExportButton
                        data={transactionsData}
                        columns={exportColumns}
                        fileName="vending_transactions"
                    />
                </div>
            </div>
            {/* Table section */}
            <VendingTable
                searchQuery={searchQuery}
                status={statusFilter}
                sortDirection={sortDirection}
            />
        </div>
    );
}

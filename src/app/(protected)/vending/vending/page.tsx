"use client";
import { Button } from "@/components/ui/button";
import { ContentHeader } from "@/components/ui/content-header";
import VendTokenDialog from "@/components/vending/vending-dialog";
import VendingTable from "@/components/vending/vending-table";
import { ExportButton } from "@/components/ui/export-button";
import { ArrowUpDown, ListFilter, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { usePermissions } from "@/hooks/use-permissions";
import { useVendingTransactions } from "@/hooks/use-vending";

export default function VendingPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const { canEdit } = usePermissions();

    // Fetch transactions data for export
    const { data: rawTransactionsData } = useVendingTransactions({
        page: 1,
        size: 1000,
    });

    const transactionsData = useMemo(() => {
        return rawTransactionsData?.messages ?? [];
    }, [rawTransactionsData]);

    // Filter transactions based on search query (same as table)
    const filteredTransactions = useMemo(() => {
        if (!searchQuery) return transactionsData;
        const searchLower = searchQuery.toLowerCase();
        return transactionsData.filter((transaction) =>
            transaction.meterAccountNumber?.toLowerCase().includes(searchLower) ||
            transaction.meterNumber?.toLowerCase().includes(searchLower) ||
            transaction.tokenType?.toLowerCase().includes(searchLower) ||
            transaction.tariffName?.toLowerCase().includes(searchLower) ||
            transaction.status?.toLowerCase().includes(searchLower)
        );
    }, [transactionsData, searchQuery]);

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
                    <div className="flex w-[219px] gap-2 rounded-md border border-[rgba(228,231,236,1)] px-3 py-2">
                        <Search
                            size={14}
                            strokeWidth={2.75}
                            className="ml-2 text-gray-500"
                        />
                        <input
                            type="text"
                            placeholder="Search by name, cont..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full flex-grow border-none text-sm text-[rgba(95,95,95,1)] placeholder-[rgba(95,95,95,1)] outline-none"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button className="flex cursor-pointer items-center gap-2 rounded-md border border-[rgba(228,231,236,1)] px-4 py-2 text-sm text-gray-700 focus:outline-none">
                            <ListFilter size={14} />
                            Filter
                        </Button>
                        <Button className="flex cursor-pointer items-center gap-2 rounded-md border border-[rgba(228,231,236,1)] px-4 py-2 text-sm text-gray-700 focus:outline-none">
                            <ArrowUpDown size={14} />
                            Sort
                        </Button>
                    </div>
                </div>
                <div className="flex gap-5">
                    <ExportButton
                        data={filteredTransactions}
                        columns={exportColumns}
                        fileName="vending_transactions"
                    />
                </div>
            </div>
            {/* Table section */}
            <VendingTable searchQuery={searchQuery} transactionsData={transactionsData} />
        </div>
    );
}
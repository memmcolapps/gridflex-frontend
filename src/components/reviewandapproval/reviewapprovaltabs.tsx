"use client";
import React, { useState } from "react";
import { Check, SquareArrowOutUpRight } from "lucide-react";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";
import { ContentHeader } from "../ui/content-header";
import PercentageRangeTable from "./percentagerangetable";
import { FilterControl, SearchControl, SortControl } from "@/components/search-control";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import LiabilityCauseTable from "./liabilitycausetable";
import BandTable from "./bandtable";
import TariffTable from "./tarifftable";
import MeterTable from "./metertable";
import { useMeters } from "@/hooks/use-ReviewApproval";
import { useBulkApproveBands } from "@/hooks/use-band";
import { useBulkApproveTariffs } from "@/hooks/use-tarrif";
import { useBulkApproveLiabilityCauses, useBulkApprovePercentageRanges } from "@/hooks/use-debit-settings";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

export function ReviewApprovalTabs() {
    const [activeTab, setActiveTab] = useState("percentage");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
    const [, setActiveFilters] = useState({});
    const [selectedMeterNumbers, setSelectedMeterNumbers] = useState<string[]>([]);
    const [selectedBandNames, setSelectedBandNames] = useState<string[]>([]);
    const [selectedTariffNames, setSelectedTariffNames] = useState<string[]>([]);
    const [selectedPercentageRangeCodes, setSelectedPercentageRangeCodes] = useState<string[]>([]);
    const [selectedLiabilityCauseNames, setSelectedLiabilityCauseNames] = useState<string[]>([]);
    const [isBulkApproveResultDialogOpen, setIsBulkApproveResultDialogOpen] = useState(false);
    const [bulkApproveResult, setBulkApproveResult] = useState<{
      successCount: number;
      failedCount: number;
      totalRecords: number;
      failedRecords: string[];
    } | null>(null);

    // Use the useMeters hook to get the bulkApproveMutation
    const { bulkApproveMutation } = useMeters({
        page: 1,
        pageSize: 10,
        searchTerm: '',
        sortBy: null,
        sortDirection: null,
        type: 'pending-state',
    });

    // Use the useBulkApproveBands hook for band bulk approve
    const bulkApproveBandsMutation = useBulkApproveBands();

    // Use the useBulkApproveTariffs hook for tariff bulk approve
    const bulkApproveTariffsMutation = useBulkApproveTariffs();

    // Use the useBulkApprovePercentageRanges hook for percentage range bulk approve
    const bulkApprovePercentageRangesMutation = useBulkApprovePercentageRanges();

    // Use the useBulkApproveLiabilityCauses hook for liability cause bulk approve
    const bulkApproveLiabilityCausesMutation = useBulkApproveLiabilityCauses();

    const filterSections = [
        {
            title: "Status",
            options: [
                { label: "Approved", id: "approved" },
                { label: "Pending", id: "pending" },
                { label: "Rejected", id: "rejected" },
            ],
        },
        // Add more filter sections as needed
    ];

    const changeTab = (value: string) => {
        setActiveTab(value);
        // Clear selected meter numbers when switching tabs
        if (value !== "meter") {
            setSelectedMeterNumbers([]);
        }
        // Clear selected band names when switching tabs
        if (value !== "band") {
            setSelectedBandNames([]);
        }
        // Clear selected tariff names when switching tabs
        if (value !== "tariff") {
            setSelectedTariffNames([]);
        }
        // Clear selected percentage range codes when switching tabs
        if (value !== "percentage") {
            setSelectedPercentageRangeCodes([]);
        }
        // Clear selected liability cause names when switching tabs
        if (value !== "liability cause") {
            setSelectedLiabilityCauseNames([]);
        }
    };

    const handleBulkApprove = async () => {
        if (activeTab === "meter") {
            if (selectedMeterNumbers.length === 0) {
                toast.error("Please select at least one meter to approve.");
                return;
            }

            const meterNumbersPayload = selectedMeterNumbers.map(meterNumber => ({ meterNumber }));

            try {
                await bulkApproveMutation.mutateAsync(meterNumbersPayload);
                toast.success(`Successfully approved ${selectedMeterNumbers.length} meter(s).`);
                setSelectedMeterNumbers([]);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                toast.error(errorMessage);
            }
        } else if (activeTab === "band") {
            if (selectedBandNames.length === 0) {
                toast.error("Please select at least one band to approve.");
                return;
            }

            const bandNamesPayload = selectedBandNames.map(name => ({ name }));

            try {
                await bulkApproveBandsMutation.mutateAsync(bandNamesPayload);
                toast.success(`Successfully approved ${selectedBandNames.length} band(s).`);
                setSelectedBandNames([]);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                toast.error(errorMessage);
            }
        } else if (activeTab === "tariff") {
            if (selectedTariffNames.length === 0) {
                toast.error("Please select at least one tariff to approve.");
                return;
            }

            const tariffNamesPayload = selectedTariffNames.map(name => ({ name }));

            try {
                await bulkApproveTariffsMutation.mutateAsync(tariffNamesPayload);
                toast.success(`Successfully approved ${selectedTariffNames.length} tariff(s).`);
                setSelectedTariffNames([]);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                toast.error(errorMessage);
            }
        } else if (activeTab === "percentage") {
            if (selectedPercentageRangeCodes.length === 0) {
                toast.error("Please select at least one percentage range to approve.");
                return;
            }

            const percentageRangeCodesPayload = selectedPercentageRangeCodes.map(code => ({ code }));

            try {
                const result = await bulkApprovePercentageRangesMutation.mutateAsync(percentageRangeCodesPayload);
                if (result.success) {
                    setBulkApproveResult(result.data);
                    setIsBulkApproveResultDialogOpen(true);
                    setSelectedPercentageRangeCodes([]);
                } else {
                    throw new Error(result.error);
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                toast.error(errorMessage);
            }
        } else if (activeTab === "liability cause") {
            if (selectedLiabilityCauseNames.length === 0) {
                toast.error("Please select at least one liability cause to approve.");
                return;
            }

            const liabilityCauseNamesPayload = selectedLiabilityCauseNames.map(name => ({ name }));

            try {
                const result = await bulkApproveLiabilityCausesMutation.mutateAsync(liabilityCauseNamesPayload);
                if (result.success) {
                    setBulkApproveResult(result.data);
                    setIsBulkApproveResultDialogOpen(true);
                    setSelectedLiabilityCauseNames([]);
                } else {
                    throw new Error(result.error);
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                toast.error(errorMessage);
            }
        }
    };

    const handleSortChange = (sortBy: string) => {
        const [keyRaw, directionRaw] = sortBy.split(' ');
        const key = keyRaw ?? '';
        const direction = directionRaw ?? 'asc';
        setSortConfig({ key, direction });
    };

    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
    };


    return (
        <div className="p-6 max-h-screen overflow-auto bg-transparent">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4 bg-transparent">
                <ContentHeader
                    title="Review & Approval"
                    description="Check submissions and approve or reject meters"
                />
                <div className="flex flex-col md:flex-row gap-2">
                    <Button
                        className="flex items-center gap-2 border font-medium border-green-500 text-white w-full md:w-auto cursor-pointer bg-green-500 h-12"
                        variant="outline"
                        size="lg"
                        onClick={handleBulkApprove}
                        disabled={bulkApproveMutation.isPending || bulkApproveBandsMutation.isPending || bulkApproveTariffsMutation.isPending || bulkApprovePercentageRangesMutation.isPending || bulkApproveLiabilityCausesMutation.isPending}
                    >
                        <Check size={18} strokeWidth={2.3} className="h-4 w-4" />
                        <span className="text-sm md:text-base text-white">
                            {bulkApproveMutation.isPending || bulkApproveBandsMutation.isPending || bulkApproveTariffsMutation.isPending || bulkApprovePercentageRangesMutation.isPending || bulkApproveLiabilityCausesMutation.isPending ? "Approving..." : "Bulk Approve"}
                        </span>
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="gap-2 border border-[#161CCA] text-[#161CCA] font-medium w-full lg:w-auto cursor-pointer mt-1"
                    >
                        <SquareArrowOutUpRight className="text-[#161CCA]" size={15} strokeWidth={2.3} />
                        <span className="text-sm lg:text-base font-medium">Export</span>
                    </Button>
                </div>
            </div>


            <Card className="p-4 mb-4 border-none shadow-none bg-transparent">
                <Tabs value={activeTab} onValueChange={(v) => changeTab(v)}>
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <TabsList style={{ border: '2px solid #161CCA' }} className="h-12 w-fit">
                            <TabsTrigger
                                value="percentage"
                                className="data-[state=active]:bg-[#161CCA] cursor-pointer data-[state=active]:text-white p-4"
                            >
                                Percentage Range
                            </TabsTrigger>
                            <TabsTrigger
                                value="liability cause"
                                className="data-[state=active]:bg-[#161CCA] cursor-pointer data-[state=active]:text-white p-4"
                            >
                                Liability Cause
                            </TabsTrigger>
                            <TabsTrigger
                                value="band"
                                className="data-[state=active]:bg-[#161CCA] cursor-pointer data-[state=active]:text-white p-4"
                            >
                                Band
                            </TabsTrigger>
                            <TabsTrigger
                                value="tariff"
                                className="data-[state=active]:bg-[#161CCA] cursor-pointer data-[state=active]:text-white p-4"
                            >
                                Tariff
                            </TabsTrigger>
                            <TabsTrigger
                                value="meter"
                                className="data-[state=active]:bg-[#161CCA] cursor-pointer data-[state=active]:text-white p-4"
                            >
                                Meter
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex items-center gap-2 w-full lg:w-auto">
                            <SearchControl
                                onSearchChange={handleSearchChange}
                                value={searchTerm}
                                placeholder="Search by percentage, code, or description..."
                            />
                            <FilterControl
                                sections={filterSections}
                                onApply={(filters) => setActiveFilters(filters)}
                                onReset={() => setActiveFilters({})}
                            />
                            <SortControl
                                onSortChange={handleSortChange}
                                currentSort={sortConfig.key ? `${sortConfig.key} (${sortConfig.direction})` : ''}
                            />

                        </div>
                    </div>
                    <TabsContent value="percentage" className="overflow-x-hidden">
                        <PercentageRangeTable
                            selectedPercentageRangeCodes={selectedPercentageRangeCodes}
                            setSelectedPercentageRangeCodes={setSelectedPercentageRangeCodes}
                        />
                    </TabsContent>
                    <TabsContent value="liability cause" className="overflow-x-hidden">
                        <LiabilityCauseTable
                            selectedLiabilityCauseNames={selectedLiabilityCauseNames}
                            setSelectedLiabilityCauseNames={setSelectedLiabilityCauseNames}
                        />
                    </TabsContent>
                    <TabsContent value="band" className="overflow-x-hidden">
                        <BandTable
                            selectedBandNames={selectedBandNames}
                            setSelectedBandNames={setSelectedBandNames}
                        />
                    </TabsContent>
                    <TabsContent value="tariff" className="overflow-x-hidden">
                        <TariffTable
                            selectedTariffNames={selectedTariffNames}
                            setSelectedTariffNames={setSelectedTariffNames}
                        />
                    </TabsContent>
                    <TabsContent value="meter" className="overflow-x-hidden">
                        <MeterTable
                            selectedMeterNumbers={selectedMeterNumbers}
                            setSelectedMeterNumbers={setSelectedMeterNumbers}
                        />
                    </TabsContent>
                </Tabs>
            </Card>

        </div>
    );

    return (
        <div className="p-6 max-h-screen overflow-auto bg-transparent">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4 bg-transparent">
                <ContentHeader
                    title="Review & Approval"
                    description="Check submissions and approve or reject meters"
                />
                <div className="flex flex-col md:flex-row gap-2">
                    <Button
                        className="flex items-center gap-2 border font-medium border-green-500 text-white w-full md:w-auto cursor-pointer bg-green-500 h-12"
                        variant="outline"
                        size="lg"
                        onClick={handleBulkApprove}
                        disabled={bulkApproveMutation.isPending || bulkApproveBandsMutation.isPending || bulkApproveTariffsMutation.isPending || bulkApprovePercentageRangesMutation.isPending || bulkApproveLiabilityCausesMutation.isPending}
                    >
                        <Check size={18} strokeWidth={2.3} className="h-4 w-4" />
                        <span className="text-sm md:text-base text-white">
                            {bulkApproveMutation.isPending || bulkApproveBandsMutation.isPending || bulkApproveTariffsMutation.isPending || bulkApprovePercentageRangesMutation.isPending || bulkApproveLiabilityCausesMutation.isPending ? "Approving..." : "Bulk Approve"}
                        </span>
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="gap-2 border border-[#161CCA] text-[#161CCA] font-medium w-full lg:w-auto cursor-pointer mt-1"
                    >
                        <SquareArrowOutUpRight className="text-[#161CCA]" size={15} strokeWidth={2.3} />
                        <span className="text-sm lg:text-base font-medium">Export</span>
                    </Button>
                </div>
            </div>


            <Card className="p-4 mb-4 border-none shadow-none bg-transparent">
                <Tabs value={activeTab} onValueChange={(v) => changeTab(v)}>
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <TabsList style={{ border: '2px solid #161CCA' }} className="h-12 w-fit">
                            <TabsTrigger
                                value="percentage"
                                className="data-[state=active]:bg-[#161CCA] cursor-pointer data-[state=active]:text-white p-4"
                            >
                                Percentage Range
                            </TabsTrigger>
                            <TabsTrigger
                                value="liability cause"
                                className="data-[state=active]:bg-[#161CCA] cursor-pointer data-[state=active]:text-white p-4"
                            >
                                Liability Cause
                            </TabsTrigger>
                            <TabsTrigger
                                value="band"
                                className="data-[state=active]:bg-[#161CCA] cursor-pointer data-[state=active]:text-white p-4"
                            >
                                Band
                            </TabsTrigger>
                            <TabsTrigger
                                value="tariff"
                                className="data-[state=active]:bg-[#161CCA] cursor-pointer data-[state=active]:text-white p-4"
                            >
                                Tariff
                            </TabsTrigger>
                            <TabsTrigger
                                value="meter"
                                className="data-[state=active]:bg-[#161CCA] cursor-pointer data-[state=active]:text-white p-4"
                            >
                                Meter
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex items-center gap-2 w-full lg:w-auto">
                            <SearchControl
                                onSearchChange={handleSearchChange}
                                value={searchTerm}
                                placeholder="Search by percentage, code, or description..."
                            />
                            <FilterControl
                                sections={filterSections}
                                onApply={(filters) => setActiveFilters(filters)}
                                onReset={() => setActiveFilters({})}
                            />
                            <SortControl
                                onSortChange={handleSortChange}
                                currentSort={sortConfig.key ? `${sortConfig.key} (${sortConfig.direction})` : ''}
                            />

                        </div>
                    </div>
                    <TabsContent value="percentage" className="overflow-x-hidden">
                        <PercentageRangeTable
                            selectedPercentageRangeCodes={selectedPercentageRangeCodes}
                            setSelectedPercentageRangeCodes={setSelectedPercentageRangeCodes}
                        />
                    </TabsContent>
                    <TabsContent value="liability cause" className="overflow-x-hidden">
                        <LiabilityCauseTable
                            selectedLiabilityCauseNames={selectedLiabilityCauseNames}
                            setSelectedLiabilityCauseNames={setSelectedLiabilityCauseNames}
                        />
                    </TabsContent>
                    <TabsContent value="band" className="overflow-x-hidden">
                        <BandTable
                            selectedBandNames={selectedBandNames}
                            setSelectedBandNames={setSelectedBandNames}
                        />
                    </TabsContent>
                    <TabsContent value="tariff" className="overflow-x-hidden">
                        <TariffTable
                            selectedTariffNames={selectedTariffNames}
                            setSelectedTariffNames={setSelectedTariffNames}
                        />
                    </TabsContent>
                    <TabsContent value="meter" className="overflow-x-hidden">
                        <MeterTable
                            selectedMeterNumbers={selectedMeterNumbers}
                            setSelectedMeterNumbers={setSelectedMeterNumbers}
                        />
                    </TabsContent>
                </Tabs>
            </Card>

            {bulkApproveResult && (
                <AlertDialog open={isBulkApproveResultDialogOpen} onOpenChange={setIsBulkApproveResultDialogOpen}>
                    <AlertDialogContent className="max-w-2xl max-h-[80vh] border-none overflow-y-auto">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                                {bulkApproveResult!.successCount === bulkApproveResult!.totalRecords ? (
                                    <>
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        Bulk Approve Completed Successfully
                                    </>
                                ) : bulkApproveResult!.successCount === 0 ? (
                                    <>
                                        <XCircle className="h-5 w-5 text-red-500" />
                                        Bulk Approve Failed
                                    </>
                                ) : (
                                    <>
                                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                                        Bulk Approve Completed with Issues
                                    </>
                                )}
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-left">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-gray-900">{bulkApproveResult!.totalRecords}</div>
                                            <div className="text-sm text-gray-600">Total Records</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">{bulkApproveResult!.successCount}</div>
                                            <div className="text-sm text-gray-600">Successful</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-red-600">{bulkApproveResult!.failedCount}</div>
                                            <div className="text-sm text-gray-600">Failed</div>
                                        </div>
                                    </div>

                                    {bulkApproveResult!.successCount > 0 && (
                                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                            <div className="flex items-center gap-2 text-green-800">
                                                <CheckCircle className="h-4 w-4" />
                                                <span className="font-medium">Success</span>
                                            </div>
                                            <p className="text-sm text-green-700 mt-1">
                                                {bulkApproveResult!.successCount} item{bulkApproveResult!.successCount !== 1 ? 's' : ''} approved successfully.
                                            </p>
                                        </div>
                                    )}

                                    {bulkApproveResult!.failedCount > 0 && (
                                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                            <div className="flex items-center gap-2 text-red-800">
                                                <XCircle className="h-4 w-4" />
                                                <span className="font-medium">Failed Records</span>
                                            </div>
                                            <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                                                {bulkApproveResult!.failedRecords.map((record, index) => (
                                                    <div key={index} className="text-sm text-red-700 bg-red-100 p-2 rounded border-l-4 border-red-400">
                                                        {record}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <Button
                                onClick={() => {
                                    setIsBulkApproveResultDialogOpen(false);
                                    setBulkApproveResult(null);
                                }}
                                className="bg-[#161CCA] hover:bg-[#121eb3] text-white"
                            >
                                Close
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
}
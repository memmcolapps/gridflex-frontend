// EnergyImportPage.tsx
"use client";
import { BulkUploadDialog } from "@/components/meter-management/bulk-upload";
import { SortControl } from "@/components/search-control";
import { Button } from "@/components/ui/button";
import { ContentHeader } from "@/components/ui/content-header";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Search,
    CirclePlus,
    SquareArrowOutUpRight,
} from "lucide-react";
import { useState } from "react";
import ExportEnergyImportDialog from "@/components/billing/energy-import/export-energy-import-dialog";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import AddReadings from "@/components/billing/md-energy-import/add-readings-dialog";
import EnergyImportTable from "@/components/billing/md-energy-import/emergy-import";

interface EnergyImportData {
    id: number;
    feederName: string;
    assetId: string;
    feederConsumption: string;
    prepaidConsumption: string;
    postpaidConsumption: string;
    mdVirtual: string;
    nonMdVirtual: string;
    month: string; // Required to match AddReadings
    year: string;
    technicalLoss: string;
    commercialLoss: string;
}

export default function EnergyImportPage() {
    const [isLoading] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [isBulkUploadDialogOpen, setIsBulkUploadDialogOpen] = useState(false);
    const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
    const [isAddReadingsDialogOpen, setIsAddReadingsDialogOpen] = useState(false);
    const [sortConfig, setSortConfig] = useState<string>("");
    const [selectedMonth, setSelectedMonth] = useState<string>("June");
    const [selectedYear, setSelectedYear] = useState<string>("2025");
    const [selectedRowIds, setSelectedRowIds] = useState<Set<number>>(new Set());
    const [allData, setAllData] = useState<EnergyImportData[]>([
        {
            id: 1,
            feederName: "Molara",
            assetId: "6201021223",
            feederConsumption: "250488930.789",
            prepaidConsumption: "250488930.789",
            postpaidConsumption: "250488930.789",
            mdVirtual: "313111.349",
            nonMdVirtual: "NOT SET",
            month: selectedMonth || "6", // June
            year: selectedYear || "2025",
            technicalLoss: "0",
            commercialLoss: "0",
        },
        {
            id: 2,
            feederName: "Ijeun",
            assetId: "6201021224",
            feederConsumption: "250488930.789",
            prepaidConsumption: "125244445.395",
            postpaidConsumption: "9393334.046",
            mdVirtual: "313111.349",
            nonMdVirtual: "NOT SET",
            month: selectedMonth || "6",
            year: selectedYear || "2025",
            technicalLoss: "0",
            commercialLoss: "0",
        },
        // ... other data entries (add month, year, technicalLoss, commercialLoss to all)
        {
            id: 3,
            feederName: "Sagamu",
            assetId: "6201021225",
            feederConsumption: "250488930.789",
            prepaidConsumption: "125244445.395",
            postpaidConsumption: "9393334.046",
            mdVirtual: "313111.349",
            nonMdVirtual: "NOT SET",
            month: selectedMonth || "6",
            year: selectedYear || "2025",
            technicalLoss: "0",
            commercialLoss: "0",
        },
        {
            id: 4,
            feederName: "Olowotedo",
            assetId: "6201021226",
            feederConsumption: "250488930.789",
            prepaidConsumption: "125244445.395",
            postpaidConsumption: "9393334.046",
            mdVirtual: "313111.349",
            nonMdVirtual: "NOT SET",
            month: selectedMonth || "6",
            year: selectedYear || "2025",
            technicalLoss: "0",
            commercialLoss: "0",
        },
        {
            id: 5,
            feederName: "Isofo",
            assetId: "6201021227",
            feederConsumption: "250488930.789",
            prepaidConsumption: "125244445.395",
            postpaidConsumption: "9393334.046",
            mdVirtual: "313111.349",
            nonMdVirtual: "NOT SET",
            month: selectedMonth || "6",
            year: selectedYear || "2025",
            technicalLoss: "0",
            commercialLoss: "0",
        },
        {
            id: 6,
            feederName: "Mowe",
            assetId: "6201021228",
            feederConsumption: "250488930.789",
            prepaidConsumption: "125244445.395",
            postpaidConsumption: "9393334.046",
            mdVirtual: "313111.349",
            nonMdVirtual: "NOT SET",
            month: selectedMonth || "6",
            year: selectedYear || "2025",
            technicalLoss: "0",
            commercialLoss: "0",
        },
        {
            id: 7,
            feederName: "Asese",
            assetId: "6201021229",
            feederConsumption: "250488930.789",
            prepaidConsumption: "125244445.395",
            postpaidConsumption: "9393334.046",
            mdVirtual: "313111.349",
            nonMdVirtual: "NOT SET",
            month: selectedMonth || "6",
            year: selectedYear || "2025",
            technicalLoss: "0",
            commercialLoss: "0",
        },
        {
            id: 8,
            feederName: "Berger",
            assetId: "6201021230",
            feederConsumption: "250488930.789",
            prepaidConsumption: "125244445.395",
            postpaidConsumption: "9393334.046",
            mdVirtual: "313111.349",
            nonMdVirtual: "NOT SET",
            month: selectedMonth || "6",
            year: selectedYear || "2025",
            technicalLoss: "0",
            commercialLoss: "0",
        },
        {
            id: 9,
            feederName: "Orimuramu",
            assetId: "6201021231",
            feederConsumption: "250488930.789",
            prepaidConsumption: "125244445.395",
            postpaidConsumption: "9393334.046",
            mdVirtual: "313111.349",
            nonMdVirtual: "NOT SET",
            month: selectedMonth || "6",
            year: selectedYear || "2025",
            technicalLoss: "0",
            commercialLoss: "0",
        },
        {
            id: 10,
            feederName: "Abeokuta",
            assetId: "6201021232",
            feederConsumption: "250488930.789",
            prepaidConsumption: "125244445.395",
            postpaidConsumption: "9393334.046",
            mdVirtual: "313111.349",
            nonMdVirtual: "NOT SET",
            month: selectedMonth || "6",
            year: selectedYear || "2025",
            technicalLoss: "0",
            commercialLoss: "0",
        },
    ]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setInputValue(e.target.value);

    const handleBulkUpload = (_data: unknown) => {
        setIsBulkUploadDialogOpen(false);
    };

    const handleSortChange = (sortBy: string) => {
        setSortConfig(sortBy);
    };

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 6 }, (_, i) =>
        (currentYear - i).toString(),
    );

    const handleMonthChange = (month: string) => {
        setSelectedMonth(month);
    };

    const handleYearChange = (year: string) => {
        setSelectedYear(year);
    };

    const handleExport = () => {
        setIsExportDialogOpen(true);
    };

    const handleSaveReadings = (formData: {
        assetId: string;
        month: string;
        year: string;
        technicalLoss: string;
        commercialLoss: string;
        feederConsumption: string;
    }) => {
        // Generate a new ID (e.g., max existing ID + 1)
        const newId = allData.length > 0 ? Math.max(...allData.map(item => item.id)) + 1 : 1;
        // Create a new entry with default values for fields not in formData
        const newEntry: EnergyImportData = {
            id: newId,
            feederName: formData.assetId, // Use assetId as feederName for new entries (adjust as needed)
            assetId: formData.assetId,
            feederConsumption: formData.feederConsumption,
            prepaidConsumption: "0", // Default value (adjust based on your logic)
            postpaidConsumption: "0", // Default value
            mdVirtual: "0", // Default value
            nonMdVirtual: "NOT SET", // Default value
            month: formData.month,
            year: formData.year,
            technicalLoss: formData.technicalLoss,
            commercialLoss: formData.commercialLoss,
        };
        setAllData([...allData, newEntry]);
        setIsAddReadingsDialogOpen(false);
    };

    return (
        <div className="p-6">
            <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
                <ContentHeader
                    title="Energy Import"
                    description="Set and manage feeder readings to track electricity usage and generate bills"
                />
                <div className="flex flex-col gap-2 md:flex-row">
                    <Button
                        className="flex w-full cursor-pointer items-center gap-2 border border-[#161CCA] font-medium text-[#161CCA] md:w-auto"
                        variant="outline"
                        size="lg"
                        onClick={() => setIsBulkUploadDialogOpen(true)}
                    >
                        <CirclePlus size={14} strokeWidth={2.3} className="h-4 w-4" />
                        <span className="text-sm md:text-base">Bulk Upload</span>
                    </Button>
                    <Button
                        className="flex w-full cursor-pointer items-center gap-2 bg-[#161CCA] font-medium text-white md:w-auto"
                        variant="secondary"
                        size="lg"
                        onClick={() => setIsAddReadingsDialogOpen(true)}
                    >
                        <CirclePlus size={14} strokeWidth={2.3} className="h-4 w-4" />
                        <span className="text-sm md:text-base">Add Readings</span>
                    </Button>
                </div>
            </div>

            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="relative w-full lg:w-[300px]">
                        <Search
                            size={14}
                            className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400"
                        />
                        <Input
                            type="text"
                            placeholder="Search by meter no., feeder, cont..."
                            value={inputValue}
                            onChange={handleChange}
                            className="w-full border-gray-300 pl-10 text-sm focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50 lg:text-base"
                        />
                    </div>
                    <div className="flex gap-2">
                        <SortControl
                            onSortChange={handleSortChange}
                            currentSort={sortConfig}
                        />
                        <Select value={selectedMonth} onValueChange={handleMonthChange}>
                            <SelectTrigger className="w-[100px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {months.map((month, index) => (
                                    <SelectItem key={month} value={(index + 1).toString()}>
                                        {month}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={selectedYear} onValueChange={handleYearChange}>
                            <SelectTrigger className="w-[80px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map((year) => (
                                    <SelectItem key={year} value={year}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="flex cursor-pointer items-center gap-2 border-[#161CCA] font-medium text-[#161CCA]"
                        onClick={handleExport}
                    >
                        <SquareArrowOutUpRight size={14} />
                        Export
                    </Button>
                </div>
            </div>

            <div className="flex-1 bg-white">
                {isLoading ? (
                    <div className="flex items-center justify-center p-8">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
                    </div>
                ) : (
                    <EnergyImportTable
                        searchQuery={inputValue}
                        sortConfig={sortConfig}
                        selectedMonth={selectedMonth}
                        selectedYear={selectedYear}
                        onSelectionChange={setSelectedRowIds}
                        allData={allData} // Pass allData to EnergyImportTable
                        setAllData={function (): void {
                            throw new Error("Function not implemented.");
                        }}
                    />
                )}
            </div>

            <BulkUploadDialog
                isOpen={isBulkUploadDialogOpen}
                onClose={() => setIsBulkUploadDialogOpen(false)}
                onSave={handleBulkUpload}
                title="Bulk Upload Energy Import"
                requiredColumns={[
                    "feederName",
                    "assetId",
                    "feederConsumption",
                    "prepaidConsumption",
                    "postpaidConsumption",
                    "mdVirtual",
                    "nonMdVirtual",
                ]}
                templateUrl="/templates/energy-import-template.xlsx"
            />

            <ExportEnergyImportDialog
                open={isExportDialogOpen}
                onClose={() => setIsExportDialogOpen(false)}
                selectedRowIds={selectedRowIds}
                allData={allData}
            />

            <Dialog open={isAddReadingsDialogOpen} onOpenChange={setIsAddReadingsDialogOpen}>
                <DialogContent className="w-full max-w-2xl bg-white p-6 h-fit">
                    <DialogHeader>
                        <DialogTitle>Add Readings</DialogTitle>
                        <p className="text-sm text-gray-500">Enter asset ID and add readings.</p>
                    </DialogHeader>
                    <AddReadings
                        onClose={() => setIsAddReadingsDialogOpen(false)}
                        onSave={handleSaveReadings}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
"use client";

import { Button } from "@/components/ui/button";
import { ContentHeader } from "@/components/ui/content-header";
import { usePermissions } from "@/hooks/use-permissions";
import { Ban, Eye, MoreVertical, Send, Settings2 } from "lucide-react";
import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ConfigureAPNDialog from "@/components/hes/controlsconfigs/meter-remote-config/configure-apn-dialog";
import ConfigureCTVTRatioDialog from "@/components/hes/controlsconfigs/meter-remote-config/configure-ctv-ratio-dialog";
import ChangeRelayModeDialog from "@/components/hes/controlsconfigs/meter-remote-config/change-relay-mode-dialog";
import SetDateTimeDialog from "@/components/hes/controlsconfigs/meter-remote-config/set-date-time-dialog";
import ConfigureIPDialog from "@/components/hes/controlsconfigs/meter-remote-config/configure-ip-dialog";
import ViewDetailsDialog from "@/components/hes/controlsconfigs/meter-remote-config/view-details-dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { FilterControl } from "@/components/search-control";
import { ChevronDown } from "lucide-react";
import OfflineDialog from "@/components/hes/controlsconfigs/meter-remote-config/offline-meter-dialog";
import SendTokenDialog from "@/components/hes/dashboard/send-token-dialog";
import type { Meter } from "@/types/meter";
import { Card } from "@/components/ui/card";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
} from "@/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { BulkUploadDialog } from "@/components/meter-management/bulk-upload";
import { toast } from "sonner";

// Define the possible dialog types
type DialogType = "apn" | "ctvt" | "relay" | "datetime" | "ip" | "viewDetails" | "sendToken";

// Define filter sections
const filterSections = [
    {
        title: "Meter Class",
        options: [
            { label: "Single Phase", id: "singlePhase" },
            { label: "Three Phase", id: "threePhase" },
            { label: "MD", id: "md" },
        ],
    },
    {
        title: "Meter Category",
        options: [
            { label: "Prepaid", id: "prepaid" },
            { label: "Postpaid", id: "postpaid" },
        ],
    },
    {
        title: "Status",
        options: [
            { label: "Online", id: "online" },
            { label: "Offline", id: "offline" },
        ],
    },
];

// Initial meter data
const initialMeterData: Meter[] = [
    {
        sN: "01",
        meterNumber: "61245269523",
        simNo: "89000497699707079",
        businessHub: "ljeun",
        class: "MD",
        category: "Prepaid",
        manufacturer: "Momas",
        model: "MX-300",
        status: "Online",
        region: "Ogun",
        serviceCenter: "ljeun",
        feeder: "ljeun",
        transformer: "Olowotedo",
        lastSync: "01:00 am",
    },
    {
        sN: "02",
        meterNumber: "61245269523",
        simNo: "89000497699707079",
        businessHub: "ljeun",
        class: "Single Phase",
        category: "Prepaid",
        manufacturer: "Momas",
        model: "MX-300",
        status: "Online",
        region: "Ogun",
        serviceCenter: "ljeun",
        feeder: "ljeun",
        transformer: "Olowotedo",
        lastSync: "01:00 am",
    },
    {
        sN: "03",
        meterNumber: "61245269523",
        simNo: "89000497699707079",
        businessHub: "ljeun",
        class: "Three Phase",
        category: "Prepaid",
        manufacturer: "Momas",
        model: "MX-300",
        status: "Offline",
        region: "Ogun",
        serviceCenter: "ljeun",
        feeder: "ljeun",
        transformer: "Olowotedo",
        lastSync: "01:00 am",
    },
    {
        sN: "04",
        meterNumber: "61245269523",
        simNo: "89000497699707079",
        businessHub: "ljeun",
        class: "MD",
        category: "Postpaid",
        manufacturer: "Momas",
        model: "MX-300",
        status: "Offline",
        region: "Ogun",
        serviceCenter: "ljeun",
        feeder: "ljeun",
        transformer: "Olowotedo",
        lastSync: "01:00 am",
    },
    {
        sN: "05",
        meterNumber: "61245269523",
        simNo: "89000497699707079",
        businessHub: "ljeun",
        class: "MD",
        category: "Postpaid",
        manufacturer: "Momas",
        model: "MX-300",
        status: "Online",
        region: "Ogun",
        serviceCenter: "ljeun",
        feeder: "ljeun",
        transformer: "Olowotedo",
        lastSync: "01:00 am",
    },
    {
        sN: "06",
        meterNumber: "61245269523",
        simNo: "89000497699707079",
        businessHub: "ljeun",
        class: "MD",
        category: "Postpaid",
        manufacturer: "Momas",
        model: "MX-300",
        status: "Offline",
        region: "Ogun",
        serviceCenter: "ljeun",
        feeder: "ljeun",
        transformer: "Olowotedo",
        lastSync: "01:00 am",
    },
    {
        sN: "07",
        meterNumber: "61245269523",
        simNo: "89000497699707079",
        businessHub: "ljeun",
        class: "MD",
        category: "Postpaid",
        manufacturer: "Momas",
        model: "MX-300",
        status: "Offline",
        region: "Ogun",
        serviceCenter: "ljeun",
        feeder: "ljeun",
        transformer: "Olowotedo",
        lastSync: "01:00 am",
    },
    {
        sN: "08",
        meterNumber: "61245269523",
        simNo: "89000497699707079",
        businessHub: "ljeun",
        class: "MD",
        category: "Postpaid",
        manufacturer: "Momas",
        model: "MX-300",
        status: "Online",
        region: "Ogun",
        serviceCenter: "ljeun",
        feeder: "ljeun",
        transformer: "Olowotedo",
        lastSync: "01:00 am",
    },
    {
        sN: "09",
        meterNumber: "61245269523",
        simNo: "89000497699707079",
        businessHub: "ljeun",
        class: "MD",
        category: "Postpaid",
        manufacturer: "Momas",
        model: "MX-300",
        status: "Online",
        region: "Ogun",
        serviceCenter: "ljeun",
        feeder: "ljeun",
        transformer: "Olowotedo",
        lastSync: "01:00 am",
    },
    {
        sN: "10",
        meterNumber: "61245269523",
        simNo: "89000497699707079",
        businessHub: "ljeun",
        class: "MD",
        category: "Postpaid",
        manufacturer: "Momas",
        model: "MX-300",
        status: "Online",
        region: "Ogun",
        serviceCenter: "ljeun",
        feeder: "ljeun",
        transformer: "Olowotedo",
        lastSync: "01:00 am",
    },
];

export default function MeterRemoteConfigPage() {
    const [selectedMeter, setSelectedMeter] = useState<Meter | undefined>(undefined);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState<DialogType | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Meter;
        direction: "asc" | "desc";
    }>({ key: "sN", direction: "asc" });
    const [selectedMeters, setSelectedMeters] = useState<string[]>([]);
    const [selectedConfigOption, setSelectedConfigOption] = useState<DialogType | null>(null);
    const [showOfflineDialog, setShowOfflineDialog] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
    const [meterData, setMeterData] = useState<Meter[]>(initialMeterData);

    const handleConfigureAction = (type: DialogType) => {
        if (selectedMeters.length === 0) {
            return;
        }

        const offlineMeters = meterData.filter(m => selectedMeters.includes(m.sN) && m.status === "Offline");
        if (offlineMeters.length > 0) {
            setShowOfflineDialog(true);
            setIsDialogOpen(false);
        } else {
            // For now, we'll configure the first selected meter.
            // A more complex implementation would handle bulk configurations.
            const meterToConfigure = meterData.find(m => m.sN === selectedMeters[0]);
            if (meterToConfigure) {
                setSelectedMeter(meterToConfigure);
                setDialogType(type);
                setIsDialogOpen(true);
                setSelectedConfigOption(type);
            }
        }
    };

    const handleViewDetails = (meter: Meter) => {
        setSelectedMeter(meter);
        setDialogType("viewDetails");
        setIsDialogOpen(true);
        setShowOfflineDialog(false);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setSelectedMeter(undefined);
        setDialogType(null);
        setShowOfflineDialog(false);
        setSelectedConfigOption(null);
    };

    // Handle bulk upload save
    const handleBulkUploadSave = (data: File | Meter[]) => {
        if (data instanceof File) {
            // Handle raw file if sendRawFile is true, but currently it's false
            console.warn("Raw file received, but not handled");
        } else {
            setMeterData((prevData) => [
                ...prevData,
                ...data.map((item, index) => ({
                    ...item,
                    sN: (prevData.length + index + 1).toString().padStart(2, "0"),
                })),
            ]);
            setCurrentPage(1);
            setIsBulkUploadOpen(false);
        }
    };

    // Apply search filter
    const filteredData = meterData.filter((meter) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            meter.sN.toLowerCase().includes(searchLower) ||
            meter.meterNumber.toLowerCase().includes(searchLower) ||
            meter.simNo.toLowerCase().includes(searchLower) ||
            meter.businessHub.toLowerCase().includes(searchLower) ||
            meter.class.toLowerCase().includes(searchLower) ||
            meter.category.toLowerCase().includes(searchLower) ||
            meter.manufacturer.toLowerCase().includes(searchLower) ||
            meter.model.toLowerCase().includes(searchLower) ||
            meter.status.toLowerCase().includes(searchLower) ||
            meter.region.toLowerCase().includes(searchLower) ||
            meter.serviceCenter.toLowerCase().includes(searchLower) ||
            meter.feeder.toLowerCase().includes(searchLower) ||
            meter.transformer.toLowerCase().includes(searchLower) ||
            meter.lastSync.toLowerCase().includes(searchLower)
        );
    });

    // Apply sorting
    const sortedData = [...filteredData].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (typeof aValue === "string" && typeof bValue === "string") {
            return sortConfig.direction === "asc"
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }
        return 0;
    });

    // Calculate paginated data
    const totalPages = Math.ceil(sortedData.length / rowsPerPage);
    const paginatedData = sortedData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage,
    );

    const handlePrevious = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNext = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handleRowsPerPageChange = (value: string) => {
        setRowsPerPage(Number(value));
        setCurrentPage(1);
    };

    const handleSortChange = (key: keyof Meter, direction: "asc" | "desc") => {
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    const toggleMeterSelection = (sN: string) => {
        setSelectedMeters((prev) =>
            prev.includes(sN) ? prev.filter((id) => id !== sN) : [...prev, sN]
        );
    };

    const toggleSelectAll = () => {
        if (selectedMeters.length === paginatedData.length && paginatedData.length > 0) {
            setSelectedMeters([]);
        } else {
            setSelectedMeters(paginatedData.map((meter) => meter.sN));
        }
    };

    const handleSetActiveFilters = (filters: Record<string, string | boolean>) => {
        console.log("Filters applied:", filters);
        setCurrentPage(1);
    };

    const isConfigureButtonDisabled = selectedMeters.length === 0;

    return (
        <div className="p-6 overflow-y-auto h-screen w-full flex flex-col">
            <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
                <ContentHeader
                    title="Meter Remote Configuration"
                    description="Enable remote setup and management of meter settings for efficient monitoring."
                />
                <div className="flex gap-2">
                    <Button
                        className="flex w-full cursor-pointer items-center gap-2 border bg-white font-medium text-[#161CCA] md:w-auto"
                        variant="outline"
                        size="lg"
                        onClick={() => setIsBulkUploadOpen(true)}
                    >
                        <Settings2 size={14} strokeWidth={2.3} className="h-4 w-4 text-[#161CCA]" />
                        <span className="text-sm md:text-base">Bulk Upload</span>
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                className="flex w-full cursor-pointer items-center gap-2 border bg-[#161CCA] font-medium text-white md:w-auto"
                                variant="outline"
                                size="lg"
                                disabled={isConfigureButtonDisabled}
                            >
                                <Settings2 size={14} strokeWidth={2.3} className="h-4 w-4 text-white" />
                                <span className="text-sm md:text-base">Configure Meter</span>
                                <ChevronDown size={14} className="h-4 w-4 text-white" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[200px]">
                            <DropdownMenuItem
                                onClick={() => handleConfigureAction("ip")}
                                className="flex items-center justify-between cursor-pointer"
                            >
                                <span>Configure IP Address</span>
                                {selectedConfigOption === "ip" && <span className="text-black">✓</span>}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleConfigureAction("apn")}
                                className="flex items-center justify-between cursor-pointer"
                            >
                                <span>Configure APN</span>
                                {selectedConfigOption === "apn" && <span className="text-black">✓</span>}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleConfigureAction("ctvt")}
                                className="flex items-center justify-between cursor-pointer"
                            >
                                <span>Configure CT & VT Ratio</span>
                                {selectedConfigOption === "ctvt" && <span className="text-black">✓</span>}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleConfigureAction("relay")}
                                className="flex items-center justify-between cursor-pointer"
                            >
                                <span>Change Relay Mode</span>
                                {selectedConfigOption === "relay" && <span className="text-black">✓</span>}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleConfigureAction("datetime")}
                                className="flex items-center justify-between cursor-pointer"
                            >
                                <span>Set Date and Time</span>
                                {selectedConfigOption === "datetime" && <span className="text-black">✓</span>}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="mb-4 flex w-full flex-col items-center gap-4 md:flex-row">
                <div className="relative w-full md:w-[300px]">
                    <Search
                        size={14}
                        className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400"
                    />
                    <Input
                        type="text"
                        placeholder="Search by meter no., sim no, etc..."
                        className="w-full border-gray-300 pl-10 focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <FilterControl
                    sections={filterSections}
                    onApply={handleSetActiveFilters}
                    onReset={() => handleSetActiveFilters({})}
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full cursor-pointer gap-2 border-gray-300 sm:w-auto"
                        >
                            <ArrowUpDown className="text-gray-500" size={14} />
                            <span className="hidden text-gray-800 sm:inline">Sort</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-48">
                        <DropdownMenuItem
                            onClick={() => handleSortChange("sN", "asc")}
                            className="cursor-pointer text-sm hover:bg-gray-100"
                        >
                            S/N (A-Z)
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleSortChange("sN", "desc")}
                            className="cursor-pointer text-sm hover:bg-gray-100"
                        >
                            S/N (Z-A)
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleSortChange("meterNumber", "asc")}
                            className="cursor-pointer text-sm hover:bg-gray-100"
                        >
                            Meter Number (A-Z)
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleSortChange("meterNumber", "desc")}
                            className="cursor-pointer text-sm hover:bg-gray-100"
                        >
                            Meter Number (Z-A)
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleSortChange("status", "asc")}
                            className="cursor-pointer text-sm hover:bg-gray-100"
                        >
                            Status (A-Z)
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleSortChange("status", "desc")}
                            className="cursor-pointer text-sm hover:bg-gray-100"
                        >
                            Status (Z-A)
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Card className="overflow-x-auto border-none bg-transparent shadow-none">
                <Table className="w-full table-auto">
                    <TableHeader>
                        <TableRow className="bg-gray-200">
                            <TableHead className="w-[70px] p-2 text-left text-sm font-medium text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        checked={selectedMeters.length === paginatedData.length && paginatedData.length > 0}
                                        onCheckedChange={toggleSelectAll}
                                        className="border-gray-300"
                                    />
                                    <span>S/N</span>
                                </div>
                            </TableHead>
                            <TableHead className="p-2 text-left text-sm font-medium text-gray-600">Meter Number</TableHead>
                            <TableHead className="p-2 text-left text-sm font-medium text-gray-600">SIM No</TableHead>
                            <TableHead className="p-2 text-left text-sm font-medium text-gray-600">Business Hub</TableHead>
                            <TableHead className="p-2 text-left text-sm font-medium text-gray-600">Class</TableHead>
                            <TableHead className="p-2 text-left text-sm font-medium text-gray-600">Category</TableHead>
                            <TableHead className="p-2 text-left text-sm font-medium text-gray-600">Manufacturer</TableHead>
                            <TableHead className="p-2 text-left text-sm font-medium text-gray-600">Model</TableHead>
                            <TableHead className="p-2 text-left text-sm font-medium text-gray-600">Status</TableHead>
                            <TableHead className="p-2 text-left text-sm font-medium text-gray-600">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={10}
                                    className="h-24 text-center text-sm text-gray-500"
                                >
                                    No data available
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedData.map((meter, index) => (
                                <TableRow key={meter.sN} className="cursor-pointer hover:bg-gray-50">
                                    <TableCell className="p-2 text-sm text-gray-800">
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                checked={selectedMeters.includes(meter.sN)}
                                                onCheckedChange={() => toggleMeterSelection(meter.sN)}
                                                className="border-gray-300"
                                            />
                                            <span>{index + 1 + (currentPage - 1) * rowsPerPage}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="p-2 text-sm text-gray-800">{meter.meterNumber}</TableCell>
                                    <TableCell className="p-2 text-sm text-gray-800">{meter.simNo}</TableCell>
                                    <TableCell className="p-2 text-sm text-gray-800">{meter.businessHub}</TableCell>
                                    <TableCell className="p-2 text-sm text-gray-800">{meter.class}</TableCell>
                                    <TableCell className="p-2 text-sm text-gray-800">{meter.category}</TableCell>
                                    <TableCell className="p-2 text-sm text-gray-800">{meter.manufacturer}</TableCell>
                                    <TableCell className="p-2 text-sm text-gray-800">{meter.model}</TableCell>
                                    <TableCell className="p-2 text-sm">
                                        <span
                                            className={`px-2 py-1 rounded ${meter.status === "Online"
                                                    ? "bg-[#E9FBF0] text-[#059E40] rounded-full"
                                                    : "bg-[#FBE9E9] text-[#F50202] rounded-full"
                                                }`}
                                        >
                                            {meter.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="p-2 text-sm text-gray-800">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    className="cursor-pointer border-gray-200 focus:ring-gray-500/0"
                                                    onClick={() => setSelectedMeter(meter)}
                                                >
                                                    <MoreVertical size={16} className="border-gray-200 text-gray-500" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onSelect={() => handleViewDetails(meter)}>
                                                    <div className="flex items-center w-full gap-2">
                                                        <Eye size={14} />
                                                        <span className="cursor-pointer">View Meter</span>
                                                    </div>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onSelect={() => {
                                                    const action = meter.status === "Online" ? "disconnected" : "connected";
                                                    toast.success(`Meter ${meter.meterNumber} relay ${action} successfully`);
                                                }}>
                                                    <div className="flex items-center w-full gap-2">
                                                        <Ban size={14} />
                                                        <span className="cursor-pointer">
                                                            {meter.status === "Online" ? "Disconnect Relay" : "Connect Relay"}
                                                        </span>
                                                    </div>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onSelect={() => {
                                                    setSelectedMeter(meter);
                                                    setDialogType("sendToken");
                                                    setIsDialogOpen(true);
                                                }}>
                                                    <div className="flex items-center w-full gap-2">
                                                        <Send size={14} />
                                                        <span className="cursor-pointer">Send Token</span>
                                                    </div>
                                                </DropdownMenuItem>

                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                <Pagination className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">Rows per page</span>
                        <Select
                            value={rowsPerPage.toString()}
                            onValueChange={handleRowsPerPageChange}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={rowsPerPage.toString()} />
                            </SelectTrigger>
                            <SelectContent
                                position="popper"
                                side="top"
                                align="center"
                                className="mb-1 ring-gray-50"
                            >
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="24">24</SelectItem>
                                <SelectItem value="48">48</SelectItem>
                            </SelectContent>
                        </Select>
                        <span className="text-sm font-medium">
                            {(currentPage - 1) * rowsPerPage + 1}-
                            {Math.min(currentPage * rowsPerPage, sortedData.length)} of{" "}
                            {sortedData.length}
                        </span>
                    </div>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handlePrevious();
                                }}
                                aria-disabled={currentPage === 1}
                                className={
                                    currentPage === 1
                                        ? "pointer-events-none opacity-50"
                                        : "cursor-pointer"
                                }
                            />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleNext();
                                }}
                                aria-disabled={currentPage === totalPages}
                                className={
                                    currentPage === totalPages
                                        ? "pointer-events-none opacity-50"
                                        : "cursor-pointer"
                                }
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </Card>

            {/* Bulk Upload Dialog */}
            <BulkUploadDialog<Meter>
                isOpen={isBulkUploadOpen}
                onClose={() => setIsBulkUploadOpen(false)}
                onSave={handleBulkUploadSave}
                title="Bulk Upload Meters"
                description="Click the link to download the required document format. Please ensure your file follows the structure before uploading."
                requiredColumns={[
                    "sN",
                    "meterNumber",
                    "simNo",
                    "businessHub",
                    "class",
                    "category",
                    "manufacturer",
                    "model",
                    "status",
                    "region",
                    "serviceCenter",
                    "feeder",
                    "transformer",
                    "lastSync",
                ]}
                templateUrl="/meter-template.xlsx"
                maxFileSizeMb={10}
            />

            {isDialogOpen && dialogType === "apn" && selectedMeter && (
                <ConfigureAPNDialog
                    isOpen={true}
                    onClose={closeDialog}
                    meter={selectedMeter}
                />
            )}
            {isDialogOpen && dialogType === "ctvt" && selectedMeter && (
                <ConfigureCTVTRatioDialog
                    isOpen={true}
                    onClose={closeDialog}
                    meter={selectedMeter}
                />
            )}
            {isDialogOpen && dialogType === "relay" && selectedMeter && (
                <ChangeRelayModeDialog
                    isOpen={true}
                    onClose={closeDialog}
                    meter={selectedMeter}
                />
            )}
            {isDialogOpen && dialogType === "datetime" && selectedMeter && (
                <SetDateTimeDialog
                    isOpen={true}
                    onClose={closeDialog}
                    meter={selectedMeter}
                />
            )}
            {isDialogOpen && dialogType === "ip" && selectedMeter && (
                <ConfigureIPDialog
                    isOpen={true}
                    onClose={closeDialog}
                    meter={selectedMeter}
                />
            )}
            {isDialogOpen && dialogType === "viewDetails" && selectedMeter && (
                <ViewDetailsDialog
                    isOpen={true}
                    onClose={closeDialog}
                    meter={selectedMeter}
                />
            )}
            {isDialogOpen && dialogType === "sendToken" && selectedMeter && (
                <SendTokenDialog
                    isOpen={true}
                    onClose={closeDialog}
                    onSubmit={(token) => {
                        console.log("Sending token to meter:", selectedMeter.meterNumber, "Token:", token);
                        closeDialog();
                    }}
                />
            )}
            {showOfflineDialog && (
                <OfflineDialog
                    isOpen={true}
                    onClose={closeDialog}
                />
            )}
        </div>
    );
}
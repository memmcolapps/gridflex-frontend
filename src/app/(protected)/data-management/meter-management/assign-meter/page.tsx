"use client";
import { FilterControl } from "@/components/search-control";
import { Button } from "@/components/ui/button";
import { ContentHeader } from "@/components/ui/content-header";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    ArrowUpDown,
    CirclePlus,
    Search,
    MoreVertical,
    Pencil,
    SquareArrowOutUpRight,
    Navigation,
    Unlink,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import CustomerIdDialog from "@/components/meter-management/customer-id-dialog";
import { AssignMeterDialog } from "@/components/meter-management/assign-meter-dialog";
import type { MeterInventoryItem } from "@/types/meter-inventory";
import type { VirtualMeterData } from "@/types/meter";
import { EditCustomerDetailsDialog } from "@/components/meter-management/edit-customer-details-dialog";
import { SetPaymentModeDialog } from "@/components/meter-management/set-payment-mode-dialog";
import { DeactivateVirtualMeterDialog } from "@/components/meter-management/deactivate-virtual-meter-dialog";
import { ConfirmationModalDialog } from "@/components/meter-management/confirmation-modal-dialog";
import { MigrateMeterDialog } from "@/components/meter-management/migrate-meter-dialog";
import { DetachMeterDialog } from "@/components/meter-management/detach-meter-dialog";
import { DetachConfirmationDialog } from "@/components/meter-management/detach-confirmation-dialog";
import { BulkUploadDialog } from "@/components/meter-management/bulk-upload";
import { cn } from "@/lib/utils";
import { getStatusStyle } from "@/components/status-style";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
        title: "Meter Type",
        options: [
            { label: "Prepaid", id: "prepaid" },
            { label: "Postpaid", id: "postPaid" },
        ],
    },
];

// Updated mock data with payment plans set to "3"
const initialMeterData: MeterInventoryItem[] = [];

export default function AssignMeterPage() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isCustomerIdModalOpen, setIsCustomerIdModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isSetPaymentModalOpen, setIsSetPaymentModalOpen] = useState(false);
    const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isMigrateModalOpen, setIsMigrateModalOpen] = useState(false);
    const [progress, setProgress] = useState(50);
    const [phone, setPhone] = useState<string>("");
    const [selectedCustomer, setSelectedCustomer] = useState<MeterInventoryItem | VirtualMeterData | null>(null);
    const [editCustomer, setEditCustomer] = useState<MeterInventoryItem | null>(null);
    const [migrateCustomer, setMigrateCustomer] = useState<MeterInventoryItem | null>(null);
    const [customerIdInput, setCustomerIdInput] = useState<string>("");
    const [filteredCustomerIds, setFilteredCustomerIds] = useState<string[]>([]);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [meterData, setMeterData] = useState<MeterInventoryItem[]>(initialMeterData);
    const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({});
    const [sortConfig, setSortConfig] = useState<{
        key: keyof MeterInventoryItem | null;
        direction: "asc" | "desc";
    }>({ key: null, direction: "asc" });
    const [meterNumber, setMeterNumber] = useState("");
    const [cin, setCin] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [tariff, setTariff] = useState("");
    const [feeder, setFeeder] = useState("");
    const [category, setCategory] = useState("");
    const [dss, setDss] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [streetName, setStreetName] = useState("");
    const [houseNo, setHouseNo] = useState("");
    const [debitMop, setDebitMop] = useState("");
    const [creditMop, setCreditMop] = useState("");
    const [debitPaymentPlan, setDebitPaymentPlan] = useState("");
    const [creditPaymentPlan, setCreditPaymentPlan] = useState("");
    const [migrateToCategory, setMigrateToCategory] = useState("");
    const [migrateDebitMop, setMigrateDebitMop] = useState("");
    const [migrateDebitPaymentPlan, setMigrateDebitPaymentPlan] = useState("");
    const [migrateCreditMop, setMigrateCreditMop] = useState("");
    const [migrateCreditPaymentPlan, setMigrateCreditPaymentPlan] = useState("");
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [isDetachModalOpen, setIsDetachModalOpen] = useState(false);
    const [detachReason, setDetachReason] = useState("");
    const [customerToDetach, setCustomerToDetach] = useState<MeterInventoryItem | null>(null);
    const [isDetachConfirmModalOpen, setIsDetachConfirmModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);

    // Calculate pagination values
    const [processedData] = useState<MeterInventoryItem[]>(initialMeterData);
    const totalRows = Math.ceil(processedData.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentPageData = meterData.slice(startIndex, endIndex);

    // Reset payment fields when Set Payment Mode modal closes
    useEffect(() => {
        if (!isSetPaymentModalOpen) {
            setDebitMop("");
            setCreditMop("");
            setDebitPaymentPlan("");
            setCreditPaymentPlan("");
        }
    }, [isSetPaymentModalOpen]);

    // Reset migrate fields when Migrate modal closes
    useEffect(() => {
        if (!isMigrateModalOpen) {
            setMigrateToCategory("");
            setMigrateDebitMop("");
            setMigrateDebitPaymentPlan("");
            setMigrateCreditMop("");
            setMigrateCreditPaymentPlan("");
            setMigrateCustomer(null);
        }
    }, [isMigrateModalOpen]);

    const handleOpenCustomerIdModal = () => {
        setCustomerIdInput("");
        setFilteredCustomerIds([]);
        setIsCustomerIdModalOpen(true);
    };

    const handleCustomerIdChange = (value: string) => {
        setCustomerIdInput(value);
        if (value.trim() === "") {
            setFilteredCustomerIds([]);
        } else {
            const filtered = meterData
                .filter((customer) =>
                    customer.customerId?.toLowerCase().includes(value.toLowerCase())
                )
                .map((customer) => customer.customerId!); // Still safe due to filter
            setFilteredCustomerIds(filtered);
        }
    };

    const handleCustomerIdSelect = (customerId: string) => {
        const customer = meterData.find((item) => item.customerId === customerId);
        if (customer) {
            setSelectedCustomer(customer);
            setCustomerIdInput(customerId);
            setFilteredCustomerIds([]);
            setIsCustomerIdModalOpen(false);
            setIsAssignModalOpen(true);
            setProgress(50);
            setMeterNumber("");
            setCin("");
            setAccountNumber("");
            setTariff("");
            setFeeder("");
            setDss("");
            setState("");
            setCity("");
            setStreetName("");
            setHouseNo("");
            setDebitMop("");
            setCreditMop("");
            setDebitPaymentPlan("");
            setCreditPaymentPlan("");
        }
    };

    const handleProceedFromAssign = () => {
        setSelectedCustomer((prev) => ({
            ...prev,
            meterNumber,
            cin,
            accountNumber,
            tariff,
            feederLine: feeder,
            dss,
            state,
            city,
            streetName,
            houseNo,
        } as MeterInventoryItem));
        setIsAssignModalOpen(false);
        setProgress(100);
        if (selectedCustomer?.category === "Prepaid") {
            setIsSetPaymentModalOpen(true);
        } else if (selectedCustomer?.category === "Postpaid") {
            setIsDeactivateModalOpen(true);
        }
    };

    const handleProceedFromSetPayment = () => {
        setIsSetPaymentModalOpen(false);
        setIsDeactivateModalOpen(true);
    };

    const handleProceedFromDeactivate = () => {
        setIsDeactivateModalOpen(false);
        setIsConfirmationModalOpen(true);
    };

    const handleConfirmAssignment = () => {
        setIsConfirmationModalOpen(false);
        alert(`Meter assigned successfully for ${(selectedCustomer?.category ?? "").toLowerCase()} customer!`);
    };

    const handleCancelConfirmation = () => {
        setIsConfirmationModalOpen(false);
    };

    const handleEditDetails = (customer: MeterInventoryItem) => {
        setEditCustomer({
            ...customer,
            tariff: customer.tariff ?? "",
            feederLine: customer.feederLine ?? "",
            dss: customer.dss ?? "",
            state: customer.state ?? "",
            city: customer.city ?? "",
            streetName: customer.streetName ?? "",
            houseNo: customer.houseNo ?? ""
        });
        setMeterNumber(customer.meterNumber ?? "");
        setCin(customer.cin ?? "");
        setAccountNumber(customer.accountNumber ?? "");
        setTariff(customer.tariff ?? "");
        setFeeder(customer.feederLine ?? "");
        setDss(customer.dss ?? "");
        setState(customer.state ?? "");
        setCity(customer.city ?? "");
        setStreetName(customer.streetName ?? "");
        setHouseNo(customer.houseNo ?? "");
        setDebitMop(customer.debitMop ?? "");
        setCreditMop(customer.creditMop ?? "");
        setDebitPaymentPlan(customer.debitPaymentPlan ?? "");
        setCreditPaymentPlan(customer.creditPaymentPlan ?? "");
        setProgress(50);
        setIsEditModalOpen(true);
    };

    const handleProceedFromEdit = () => {
        if (editCustomer) {
            setEditCustomer((prev) => ({
                ...prev!,
                meterNumber,
                cin,
                accountNumber,
                tariff,
                feeder,
                dss,
                state,
                city,
                streetName,
                houseNo,
            }));
            setMeterData((prev) =>
                prev.map((item) =>
                    item.customerId === editCustomer.customerId
                        ? { ...item, meterNumber, cin, accountNumber, tariff, feeder, dss, state, city, streetName, houseNo }
                        : item
                )
            );
            setIsEditModalOpen(false);
            setProgress(100);
            if (editCustomer.category === "Prepaid") {
                setDebitMop(editCustomer.debitMop ?? "");
                setCreditMop(editCustomer.creditMop ?? "");
                setDebitPaymentPlan(editCustomer.debitPaymentPlan ?? "");
                setCreditPaymentPlan(editCustomer.creditPaymentPlan ?? "");
                setIsSetPaymentModalOpen(true);
            } else {
                alert(`Details updated successfully for postpaid customer ${editCustomer.customerId}!`);
            }
        }
    };

    const handleConfirmEditFromSetPayment = () => {
        if (!editCustomer?.customerId) {
            alert("No valid customer selected for editing payment mode.");
            return;
        }
        setMeterData((prev) =>
            prev.map((item) =>
                item.customerId === editCustomer.customerId
                    ? {
                        ...item,
                        debitMop: debitMop ?? item.debitMop,
                        creditMop: creditMop ?? item.creditMop,
                        debitPaymentPlan: debitMop === "one-off" ? "" : (debitPaymentPlan ?? item.debitPaymentPlan),
                        creditPaymentPlan: creditMop === "one-off" ? "" : (creditPaymentPlan ?? item.creditPaymentPlan),
                    }
                    : item
            )
        );
        setIsSetPaymentModalOpen(false);
        alert(`Details and payment mode updated successfully for prepaid customer ${editCustomer.customerId}!`);
    };

    const handleDetachMeter = (customer: MeterInventoryItem) => {
        setCustomerToDetach(customer);
        setIsDetachModalOpen(true);
    };

    const handleProceedFromDetach = () => {
        if (customerToDetach) {
            setMeterData((prev) =>
                prev.map((item) =>
                    item.customerId === customerToDetach.customerId
                        ? { ...item, meterStage: "Pending-detached" }
                        : item
                )
            );
        }
        setIsDetachModalOpen(false);
        setIsDetachConfirmModalOpen(true);
    };

    const handleConfirmDetach = () => {
        if (customerToDetach) {
            alert(`Meter detachment process confirmed for customer ${customerToDetach.customerId}! Reason: ${detachReason}`);
            setIsDetachConfirmModalOpen(false);
            setDetachReason("");
            setCustomerToDetach(null);
        }
    };

    const handleCancelDetach = () => {
        setIsDetachModalOpen(false);
        setDetachReason("");
        setCustomerToDetach(null);
    };

    const handleMigrateMeter = (customer: MeterInventoryItem) => {
        setMigrateCustomer(customer);
        setMigrateToCategory(customer.category === "Postpaid" ? "Prepaid" : "Postpaid");
        setMigrateDebitMop(customer.debitMop ?? "");
        setMigrateDebitPaymentPlan(customer.debitPaymentPlan ?? "");
        setMigrateCreditMop(customer.creditMop ?? "");
        setMigrateCreditPaymentPlan(customer.creditPaymentPlan ?? "");
        setIsMigrateModalOpen(true);
    };

    const handleConfirmMigrate = () => {
        if (!migrateCustomer?.customerId) {
            alert("No valid customer selected for migration.");
            return;
        }
        setMeterData((prev) =>
            prev.map((item) =>
                item.customerId === migrateCustomer.customerId
                    ? {
                        ...item,
                        meterStage: "Pending-migrated",
                        category: migrateToCategory ?? item.category,
                        ...(migrateToCategory === "Prepaid" && {
                            debitMop: migrateDebitMop,
                            debitPaymentPlan: migrateDebitMop === "monthly" ? migrateDebitPaymentPlan : "",
                            creditMop: migrateCreditMop,
                            creditPaymentPlan: migrateCreditMop === "monthly" ? migrateCreditPaymentPlan : "",
                        }),
                        ...(migrateToCategory === "Postpaid" && {
                            debitMop: "",
                            debitPaymentPlan: "",
                            creditMop: "",
                            creditPaymentPlan: "",
                        }),
                    }
                    : item
            )
        );
        setIsMigrateModalOpen(false);
        alert(`Meter migrated successfully for customer ${migrateCustomer.customerId} to ${migrateToCategory}!`);
    };

    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
        applyFiltersAndSort(term, sortConfig.key, sortConfig.direction);
    };

    const handleSortChange = (key: keyof MeterInventoryItem) => {
        const newDirection = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
        setSortConfig({ key, direction: newDirection });
        applyFiltersAndSort(searchTerm, key, newDirection);
    };

    const applyFiltersAndSort = (
        term: string,
        sortBy: keyof MeterInventoryItem | null,
        direction: "asc" | "desc"
    ) => {
        let results = initialMeterData;

        if (term.trim() !== "") {
            results = results.filter(item =>
                [
                    item.customerId?.toLowerCase().includes(term.toLowerCase()),
                    item.meterNumber?.toLowerCase().includes(term.toLowerCase()),
                    item.accountNumber?.toLowerCase().includes(term.toLowerCase()),
                    item.cin?.toLowerCase().includes(term.toLowerCase()),
                ].some(result => result === true) ?? false
            );
        }

        results = results.filter((meter) => {
            const classOptions = [
                { active: activeFilters.singlePhase, value: "single phase" },
                { active: activeFilters.threePhase, value: "three phase" },
                { active: activeFilters.md, value: "md" },
            ];
            const classMatch =
                !activeFilters.singlePhase && !activeFilters.threePhase && !activeFilters.md
                    ? true
                    : classOptions.some(
                        ({ active, value }) => active && meter.meterClass?.toLowerCase().includes(value)
                    );

            const typeOptions = [
                { active: activeFilters.prepaid, value: "prepaid" },
                { active: activeFilters.postPaid, value: "postpaid" },
            ];
            const typeMatch =
                !activeFilters.prepaid && !activeFilters.postPaid
                    ? true
                    : typeOptions.some(
                        ({ active, value }) => active && meter.category?.toLowerCase() === value
                    );

            return classMatch && typeMatch;
        });

        if (sortBy) {
            results = [...results].sort((a, b) => {
                const aValue = (a as MeterInventoryItem)[sortBy!] ?? "";
                const bValue = (b as MeterInventoryItem)[sortBy!] ?? "";
                if (aValue < bValue) return direction === "asc" ? -1 : 1;
                if (aValue > bValue) return direction === "asc" ? 1 : -1;
                return 0;
            });
        }

        setMeterData(results);
        setCurrentPage(1);
    };

    const handleSetActiveFilters = (filters: Record<string, boolean>) => {
        setActiveFilters(filters);
        applyFiltersAndSort(searchTerm, sortConfig.key, sortConfig.direction);
    };

    const isFormComplete: boolean =
        tariff !== "" &&
        feeder !== "" &&
        dss !== "" &&
        state !== "" &&
        city.trim() !== "" &&
        streetName.trim() !== "" &&
        houseNo.trim() !== "" &&
        (selectedCustomer?.customerId ?? editCustomer?.customerId) !== undefined &&
        meterNumber.trim() !== "" &&
        accountNumber.trim() !== "";

    const isPaymentFormComplete = debitMop !== "" && creditMop !== "";

    const isMigrateFormComplete: boolean =
        migrateToCategory !== "Prepaid" ||
        (migrateDebitMop !== "" &&
            migrateCreditMop !== "" &&
            (migrateDebitMop !== "monthly" || migrateDebitPaymentPlan !== "") &&
            (migrateCreditMop !== "monthly" || migrateCreditPaymentPlan !== ""));

    const handleBulkUploadSave = (data: MeterInventoryItem[]) => {
        setMeterData((prev) => [...prev, ...data]);
    };

    const handleRowsPerPageChange = (value: string) => {
        setRowsPerPage(Number(value));
        setCurrentPage(1);
    };

    const handlePrevious = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNext = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalRows));
    };

    return (
        <div className="p-6 max-h-screen overflow-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <ContentHeader
                    title="Assigned Meter"
                    description="View assigned meters and migrate between postpaid and prepaid accounts"
                />
                {/* <div className="flex flex-col md:flex-row gap-2">
                    <Button
                        className="flex items-center gap-2 border font-medium border-[#161CCA] text-[#161CCA] w-full md:w-auto cursor-pointer"
                        variant="outline"
                        size="lg"
                        onClick={() => setIsBulkUploadModalOpen(true)}
                    >
                        <CirclePlus size={14} strokeWidth={2.3} className="h-4 w-4" />
                        <span className="text-sm md:text-base">Bulk Upload</span>
                    </Button>
                    <Button
                        className="flex items-center gap-2 bg-[#161CCA] text-white font-medium w-full md:w-auto cursor-pointer"
                        variant="secondary"
                        size="lg"
                        onClick={handleOpenCustomerIdModal}
                    >
                        <CirclePlus size={14} strokeWidth={2.3} className="h-4 w-4" />
                        <span className="text-sm md:text-base">Assign Meter</span>
                    </Button>
                </div> */}
            </div>
            <div className="flex justify-between">
                <div className="flex items-center gap-2 w-full md:w-auto mb-4">
                    <div className="relative w-full md:w-[300px]">
                        <Search
                            size={14}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                        />
                        <Input
                            type="text"
                            placeholder="Search by meter no., account no..."
                            className="pl-10 w-full border-gray-300 focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50"
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                    </div>
                    <FilterControl
                        sections={filterSections}
                        onApply={handleSetActiveFilters}
                        onReset={() => handleSetActiveFilters({})}
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2 border-gray-300 w-full sm:w-auto cursor-pointer">
                                <ArrowUpDown className="text-gray-500" size={14} />
                                <span className="hidden sm:inline text-gray-800">Sort</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" className="w-48">
                            <DropdownMenuItem
                                onClick={() => handleSortChange("customerId")}
                                className="text-sm cursor-pointer hover:bg-gray-100"
                            >
                                Ascending - Descending
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleSortChange("customerId")}
                                className="text-sm cursor-pointer hover:bg-gray-100"
                            >
                                Descending - Ascending
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div>
                    <Button
                        variant="outline"
                        size="lg"
                        className="gap-2 border border-[#161CCA] text-[#161CCA] font-medium w-full lg:w-auto cursor-pointer"
                    >
                        <SquareArrowOutUpRight className="text-[#161CCA]" size={15} strokeWidth={2.3} />
                        <span className="text-sm lg:text-base font-medium">Export</span>
                    </Button>
                </div>
            </div>
            <Table>
                <TableHeader className="bg-transparent">
                    <TableRow>
                        <TableHead className="bg-transparent">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={selectedRows.length === meterData.length}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedRows(meterData.map((_, index) => index));
                                        } else {
                                            setSelectedRows([]);
                                        }
                                    }}
                                />
                                <span>S/N</span>
                            </div>
                        </TableHead>
                        <TableHead>Customer ID</TableHead>
                        <TableHead>Meter No</TableHead>
                        <TableHead>Account No</TableHead>
                        <TableHead>CIN</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Debit MOP</TableHead>
                        <TableHead className="px-4 py-3 text-center">Payment Plan</TableHead>
                        <TableHead>Credit MOP</TableHead>
                        <TableHead className="px-4 py-3 text-center">Payment Plan</TableHead>
                        <TableHead className="text-center">Meter Stage</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentPageData.map((meter, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.includes(index)}
                                        onChange={() => {
                                            setSelectedRows((prev) =>
                                                prev.includes(index)
                                                    ? prev.filter((i) => i !== index)
                                                    : [...prev, index]
                                            );
                                        }}
                                    />
                                    <span>{index + 1}</span>
                                </div>
                            </TableCell>
                            <TableCell>{meter.customerId}</TableCell>
                            <TableCell>{meter.meterNumber}</TableCell>
                            <TableCell>{meter.accountNumber}</TableCell>
                            <TableCell>{meter.cin}</TableCell>
                            <TableCell>{meter.category}</TableCell>
                            <TableCell>{meter.debitMop}</TableCell>
                            <TableCell className="px-4 py-3 text-center">{meter.debitPaymentPlan}</TableCell>
                            <TableCell>{meter.creditMop}</TableCell>
                            <TableCell className="px-4 py-3 text-center">{meter.creditPaymentPlan}</TableCell>
                            <TableCell className="px-4 py-3 text-center">
                                <span className={cn("inline-block text-sm font-medium", getStatusStyle(meter.meterStage))}>
                                    {meter.meterStage ?? "N/A"}
                                </span>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                                            <MoreVertical size={14} className="cursor-pointer" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="whitespace-nowrap">
                                        <DropdownMenuItem
                                            onClick={() => handleEditDetails(meter)}
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <Pencil size={14} />
                                            Edit Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => handleDetachMeter(meter)}
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <Unlink size={14} />
                                            Detach Meter
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => handleMigrateMeter(meter)}
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <Navigation size={14} />
                                            Migrate Meter
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
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
                            <SelectValue />
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
                        {Math.min(currentPage * rowsPerPage, processedData.length)} of {processedData.length}
                    </span>
                </div>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={e => {
                                e.preventDefault();
                                handlePrevious();
                            }}
                            aria-disabled={currentPage === 1}
                        />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={e => {
                                e.preventDefault();
                                handleNext();
                            }}
                            aria-disabled={currentPage === totalRows}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
            <CustomerIdDialog
                isOpen={isCustomerIdModalOpen}
                onOpenChange={setIsCustomerIdModalOpen}
                customerIdInput={customerIdInput}
                onCustomerIdChange={handleCustomerIdChange}
                filteredCustomerIds={filteredCustomerIds}
                onCustomerSelect={handleCustomerIdSelect}
            />
            <AssignMeterDialog
                isOpen={isAssignModalOpen}
                onOpenChange={setIsAssignModalOpen}
                selectedCustomer={selectedCustomer}
                meterNumber={meterNumber}
                setMeterNumber={setMeterNumber}
                cin={cin}
                setCin={setCin}
                accountNumber={accountNumber}
                setAccountNumber={setAccountNumber}
                tariff={tariff}
                setTariff={setTariff}
                feeder={feeder}
                setFeeder={setFeeder}
                dss={dss}
                setDss={setDss}
                state={state}
                setState={setState}
                city={city}
                setCity={setCity}
                streetName={streetName}
                setStreetName={setStreetName}
                houseNo={houseNo}
                setHouseNo={setHouseNo}
                category={category}
                setCategory={setCategory}
                onProceed={handleProceedFromAssign}
                isFormComplete={isFormComplete}
                progress={progress}
                phone={phone}
                setPhone={setPhone}
            />
            <EditCustomerDetailsDialog
                isOpen={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                editCustomer={editCustomer}
                meterNumber={meterNumber}
                setMeterNumber={setMeterNumber}
                cin={cin}
                setCin={setCin}
                accountNumber={accountNumber}
                setAccountNumber={setAccountNumber}
                tariff={tariff}
                setTariff={setTariff}
                feeder={feeder}
                setFeeder={setFeeder}
                dss={dss}
                setDss={setDss}
                state={state}
                setState={setState}
                city={city}
                setCity={setCity}
                streetName={streetName}
                setStreetName={setStreetName}
                houseNo={houseNo}
                setHouseNo={setHouseNo}
                phone={phone}
                setPhone={setPhone}
                progress={progress}
                isFormComplete={isFormComplete}
                onProceed={handleProceedFromEdit}
            />
            <SetPaymentModeDialog
                isOpen={isSetPaymentModalOpen}
                onOpenChange={setIsSetPaymentModalOpen}
                debitMop={debitMop}
                setDebitMop={setDebitMop}
                creditMop={creditMop}
                setCreditMop={setCreditMop}
                debitPaymentPlan={debitPaymentPlan}
                setDebitPaymentPlan={setDebitPaymentPlan}
                creditPaymentPlan={creditPaymentPlan}
                setCreditPaymentPlan={setCreditPaymentPlan}
                progress={progress}
                isPaymentFormComplete={isPaymentFormComplete}
                editCustomer={editCustomer}
                onProceed={editCustomer ? handleConfirmEditFromSetPayment : handleProceedFromSetPayment}
            />
            <DeactivateVirtualMeterDialog
                isOpen={isDeactivateModalOpen}
                onOpenChange={setIsDeactivateModalOpen}
                onProceed={handleProceedFromDeactivate}
            />
            <ConfirmationModalDialog
                isOpen={isConfirmationModalOpen}
                onOpenChange={setIsConfirmationModalOpen}
                selectedCustomer={selectedCustomer}
                onConfirm={handleConfirmAssignment}
                onCancel={handleCancelConfirmation}
            />
            <MigrateMeterDialog
                isOpen={isMigrateModalOpen}
                onOpenChange={setIsMigrateModalOpen}
                migrateCustomer={migrateCustomer}
                migrateToCategory={migrateToCategory}
                setMigrateToCategory={setMigrateToCategory}
                migrateDebitMop={migrateDebitMop}
                setMigrateDebitMop={setMigrateDebitMop}
                migrateDebitPaymentPlan={migrateDebitPaymentPlan}
                setMigrateDebitPaymentPlan={setMigrateDebitPaymentPlan}
                migrateCreditMop={migrateCreditMop}
                setMigrateCreditMop={setMigrateCreditMop}
                migrateCreditPaymentPlan={migrateCreditPaymentPlan}
                setMigrateCreditPaymentPlan={setMigrateCreditPaymentPlan}
                isMigrateFormComplete={isMigrateFormComplete}
                onConfirm={handleConfirmMigrate}
            />
            <DetachMeterDialog
                isOpen={isDetachModalOpen}
                onOpenChange={setIsDetachModalOpen}
                detachReason={detachReason}
                setDetachReason={setDetachReason}
                onProceed={handleProceedFromDetach}
                onCancel={handleCancelDetach}
            />
            <DetachConfirmationDialog
                isOpen={isDetachConfirmModalOpen}
                onOpenChange={setIsDetachConfirmModalOpen}
                customerToDetach={customerToDetach}
                onConfirm={handleConfirmDetach}
                onCancel={() => setIsDetachConfirmModalOpen(false)}
            />
            <BulkUploadDialog<MeterInventoryItem>
                isOpen={isBulkUploadModalOpen}
                onClose={() => setIsBulkUploadModalOpen(false)}
                onSave={handleBulkUploadSave}
                title="Bulk Upload"
                description="Click the link to download the required document format for meter assignments. Ensure your file includes all necessary columns before uploading."
                requiredColumns={[
                    "customerId",
                    "meterNumber",
                    "accountNumber",
                    "cin",
                    "category",
                    "debitMop",
                    "debitPaymentPlan",
                    "creditMop",
                    "creditPaymentPlan",
                    "approvedStatus",
                ]}
                templateUrl="/templates/assign-meter-template.xlsx"
                maxFileSizeMb={20}
            />
        </div>
    );
}
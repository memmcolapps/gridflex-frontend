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
import type { VirtualMeterData } from "@/types/meter";
import { EditCustomerDetailsDialog } from "@/components/meter-management/edit-customer-details-dialog";
import { SetPaymentModeDialog } from "@/components/meter-management/set-payment-mode-dialog";
import { DeactivateVirtualMeterDialog } from "@/components/meter-management/deactivate-virtual-meter-dialog";
import { ConfirmationModalDialog } from "@/components/meter-management/confirmation-modal-dialog";
import { MigrateMeterDialog } from "@/components/meter-management/migrate-meter-dialog";
import { DetachMeterDialog } from "@/components/meter-management/detach-meter-dialog";
import { DetachConfirmationDialog } from "@/components/meter-management/detach-confirmation-dialog";

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
const initialMeterData = [
    {
        customerId: "C-0123456790",
        meterNumber: "62010229441",
        accountNumber: "20250129544",
        cin: "C0123456790",
        category: "Prepaid",
        debitMop: "monthly",
        debitPaymentPlan: "3",
        creditMop: "percentage",
        creditPaymentPlan: "3",
        approvedStatus: "Pending",
        class: "Single Phase",
        firstName: "Shina",
        lastName: "Tiger",
        phoneNumber: "08098765343",
    },
    {
        customerId: "C-1234567891",
        meterNumber: "62010229442",
        accountNumber: "20250129545",
        cin: "C1234567891",
        category: "Postpaid",
        debitMop: "one-off",
        debitPaymentPlan: "3",
        creditMop: "one-off",
        creditPaymentPlan: "3",
        approvedStatus: "Approved",
        class: "Three Phase",
        firstName: "Seun",
        lastName: "Tope",
        phoneNumber: "09043216161",
    },
    {
        customerId: "C-2345678902",
        meterNumber: "62010229443",
        accountNumber: "20250129546",
        cin: "C2345678902",
        category: "Prepaid",
        debitMop: "monthly",
        debitPaymentPlan: "3",
        creditMop: "monthly",
        creditPaymentPlan: "3",
        approvedStatus: "Pending",
        class: "MD",
        firstName: "",
        lastName: "",
        phoneNumber: "",
    },
    {
        customerId: "C-3456789013",
        meterNumber: "62010229444",
        accountNumber: "20250129547",
        cin: "C3456789013",
        category: "Postpaid",
        debitMop: "one-off",
        debitPaymentPlan: "3",
        creditMop: "percentage",
        creditPaymentPlan: "3",
        approvedStatus: "Approved",
        class: "Single Phase",
        firstName: "",
        lastName: "",
        phoneNumber: "",
    },
    {
        customerId: "C-4567890124",
        meterNumber: "62010229445",
        accountNumber: "20250129548",
        cin: "C4567890124",
        category: "Prepaid",
        debitMop: "monthly",
        debitPaymentPlan: "3",
        creditMop: "one-off",
        creditPaymentPlan: "3",
        approvedStatus: "Pending",
        class: "Three Phase",
        firstName: "",
        lastName: "",
        phoneNumber: "",
    },
    {
        customerId: "C-5678901235",
        meterNumber: "62010229446",
        accountNumber: "20250129549",
        cin: "C5678901235",
        category: "Postpaid",
        debitMop: "one-off",
        debitPaymentPlan: "3",
        creditMop: "monthly",
        creditPaymentPlan: "3",
        approvedStatus: "Approved",
        class: "MD",
        firstName: "",
        lastName: "",
        phoneNumber: "",
    },
    {
        customerId: "C-6678901236",
        meterNumber: "62010229446",
        accountNumber: "20250179549",
        cin: "C5678901235",
        category: "Postpaid",
        debitMop: "one-off",
        debitPaymentPlan: "3",
        creditMop: "monthly",
        creditPaymentPlan: "3",
        approvedStatus: "Approved",
        class: "Single Phase",
        firstName: "",
        lastName: "",
        phoneNumber: "",
    },
    {
        customerId: "C-7678901235",
        meterNumber: "62010229446",
        accountNumber: "20250129559",
        cin: "C5678901235",
        category: "Postpaid",
        debitMop: "one-off",
        debitPaymentPlan: "3",
        creditMop: "monthly",
        creditPaymentPlan: "3",
        approvedStatus: "Approved",
        class: "Three Phase",
        firstName: "",
        lastName: "",
        phoneNumber: "",
    },
    {
        customerId: "C-8678901235",
        meterNumber: "62010229446",
        accountNumber: "20250129249",
        cin: "C5678901235",
        category: "Postpaid",
        debitMop: "one-off",
        debitPaymentPlan: "3",
        creditMop: "monthly",
        creditPaymentPlan: "3",
        approvedStatus: "Approved",
        class: "MD",
        firstName: "",
        lastName: "",
        phoneNumber: "",
    },
];

export interface MeterData {

    customerId: string;
    meterNumber: string;
    accountNumber: string;
    cin: string;
    category: string;
    debitMop: string;
    debitPaymentPlan: string;
    creditMop: string;
    creditPaymentPlan: string;
    approvedStatus: string;
    class: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    tariff?: string;
    feeder?: string;
    dss?: string;
    state?: string;
    city?: string;
    streetName?: string;
    houseNo?: string;
}

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
    const [selectedCustomer, setSelectedCustomer] = useState<MeterData | VirtualMeterData | null>(null);
    const [editCustomer, setEditCustomer] = useState<MeterData | null>(null);
    const [migrateCustomer, setMigrateCustomer] = useState<MeterData | null>(null);
    const [customerIdInput, setCustomerIdInput] = useState<string>("");
    const [filteredCustomerIds, setFilteredCustomerIds] = useState<string[]>([]);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [meterData, setMeterData] = useState<MeterData[]>(initialMeterData);
    const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({});
    const [sortConfig, setSortConfig] = useState<{
        key: keyof MeterData | null;
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
    const [customerToDetach, setCustomerToDetach] = useState<MeterData | null>(null);
    const [isDetachConfirmModalOpen, setIsDetachConfirmModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);


    // Calculate pagination values
    const totalRows = meterData.length;
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
                    customer.customerId.toLowerCase().includes(value.toLowerCase())
                )
                .map((customer) => customer.customerId);
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
            setMeterNumber(customer.meterNumber ?? "");
            setCin(customer.cin ?? "");
            setAccountNumber(customer.accountNumber ?? "");
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
            feeder,
            dss,
            state,
            city,
            streetName,
            houseNo,
        } as MeterData));
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

    const handleEditDetails = (customer: MeterData) => {
        setEditCustomer({
            ...customer,
            tariff: customer.tariff ?? "",
            feeder: customer.feeder ?? "",
            dss: customer.dss ?? "",
            state: customer.state ?? "",
            city: customer.city ?? "",
            streetName: customer.streetName ?? "",
            houseNo: customer.houseNo ?? ""
        });
        setMeterNumber(customer.meterNumber ?? "");
        setCin(customer.cin ?? "");
        setAccountNumber(customer.accountNumber?? "");
        setTariff(customer.tariff ?? "");
        setFeeder(customer.feeder ?? "");
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
        if (editCustomer) {
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
        }
    };

    const handleDetachMeter = (customer: MeterData) => {
        setCustomerToDetach(customer);
        setIsDetachModalOpen(true);
    };

    const handleProceedFromDetach = () => {
        setIsDetachModalOpen(false);
        setIsDetachConfirmModalOpen(true);
    };

    const handleConfirmDetach = () => {
        if (customerToDetach) {
            // Here you would typically make an API call to actually detach the meter
            alert(`Meter detached successfully for customer ${customerToDetach.customerId}! Reason: ${detachReason}`);
            setIsDetachConfirmModalOpen(false);
            setDetachReason(""); // Reset the reason
            setCustomerToDetach(null); // Reset the customer
        }
    };

    const handleCancelDetach = () => {
        setIsDetachModalOpen(false);
        setDetachReason("");
        setCustomerToDetach(null);
    };


    const handleMigrateMeter = (customer: MeterData) => {
        setMigrateCustomer(customer);
        setMigrateToCategory(customer.category === "Postpaid" ? "Prepaid" : "Postpaid");
        setMigrateDebitMop(customer.debitMop ?? "");
        setMigrateDebitPaymentPlan(customer.debitPaymentPlan ?? "");
        setMigrateCreditMop(customer.creditMop ?? "");
        setMigrateCreditPaymentPlan(customer.creditPaymentPlan ?? "");
        setIsMigrateModalOpen(true);
    };

    const handleConfirmMigrate = () => {
        if (migrateCustomer) {
            setMeterData((prev) =>
                prev.map((item) =>
                    item.customerId === migrateCustomer.customerId
                        ? {
                            ...item,
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
        }
    };

    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
        applyFiltersAndSort(term, sortConfig.key, sortConfig.direction);
    };

    const handleSortChange = (key: keyof MeterData) => {
        const newDirection = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
        setSortConfig({ key, direction: newDirection });
        applyFiltersAndSort(searchTerm, key, newDirection);
    };
    const applyFiltersAndSort = (
        term: string,
        sortBy: keyof MeterData | null,
        direction: "asc" | "desc"
    ) => {
        let results = initialMeterData;

        // Apply search term filter
        if (term.trim() !== "") {
            results = results.filter(item =>
                item.customerId.toLowerCase().includes(term.toLowerCase()) ??
                item.meterNumber.toLowerCase().includes(term.toLowerCase()) ??
                item.accountNumber.toLowerCase().includes(term.toLowerCase()) ??
                item.cin.toLowerCase().includes(term.toLowerCase())
            );
        }

        // Apply class and type filters
        results = results.filter((meter) => {
            const classMatch =
                (!activeFilters.singlePhase && !activeFilters.threePhase && !activeFilters.md) ??
                (activeFilters.singlePhase && meter.class.toLowerCase().includes("single phase")) ??
                (activeFilters.threePhase && meter.class.toLowerCase().includes("three phase")) ??
                (activeFilters.md && meter.class.toLowerCase().includes("md"));

            const typeMatch =
                (!activeFilters.prepaid && !activeFilters.postPaid) ??
                (activeFilters.prepaid && meter.category.toLowerCase() === "prepaid") ??
                (activeFilters.postPaid && meter.category.toLowerCase() === "postpaid");

            return classMatch && typeMatch;
        });

        // Apply sorting
        if (sortBy) {
            results = [...results].sort((a, b) => {
                const aValue = (a as MeterData)[sortBy!] ?? "";
                const bValue = (b as MeterData)[sortBy!] ?? "";
                if (aValue < bValue) return direction === "asc" ? -1 : 1;
                if (aValue > bValue) return direction === "asc" ? 1 : -1;
                return 0;
            });
        }

        // Update state and reset to first page
        setMeterData(results);
        setCurrentPage(1); // Reset pagination to first page when filters/sorting changes
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
        Boolean(selectedCustomer?.customerId ?? editCustomer?.customerId) &&
        meterNumber.trim() !== "" &&
        accountNumber.trim() !== "";

    const isPaymentFormComplete = debitMop !== "" && creditMop !== "";

    const isMigrateFormComplete =
        migrateToCategory !== "" &&
        (migrateToCategory !== "Prepaid" ||
            (migrateDebitMop !== "" &&
                migrateCreditMop !== "" &&
                (migrateDebitMop !== "monthly" || migrateDebitPaymentPlan !== "") &&
                (migrateCreditMop !== "monthly"  || migrateCreditPaymentPlan !== "")));

    return (
        <div className="p-6 h-screen overflow-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <ContentHeader
                    title="Assign Meter"
                    description="Easily assign meters to customers and switch between postpaid and prepaid accounts."
                />
                <div className="flex flex-col md:flex-row gap-2">
                    <Button
                        className="flex items-center gap-2 border font-medium border-[#161CCA] text-[#161CCA] w-full md:w-auto cursor-pointer"
                        variant="outline"
                        size="lg"
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
                </div>
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
                            <Button variant="outline" className="gap-2 border-gray-300 w-full sm:w-auto">
                                <ArrowUpDown className="text-gray-500" size={14} />
                                <span className="hidden sm:inline text-gray-800">Sort</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" className="w-48">

                            <DropdownMenuItem
                                onClick={() => handleSortChange("customerId")}
                                className="text-sm cursor-pointer hover:bg-gray-100"
                            >
                                Oldest - Newest
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleSortChange("customerId")}
                                className="text-sm cursor-pointer hover:bg-gray-100"
                            >
                                Newest - Oldest
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
                <TableHeader>
                    <TableRow>
                        <TableHead>
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
                        <TableHead>Payment Plan</TableHead>
                        <TableHead>Credit MOP</TableHead>
                        <TableHead>Payment Plan</TableHead>
                        <TableHead>Approval Status</TableHead>
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
                            <TableCell>{meter.debitPaymentPlan}</TableCell>
                            <TableCell>{meter.creditMop}</TableCell>
                            <TableCell>{meter.creditPaymentPlan}</TableCell>
                            <TableCell>
                                <span
                                    className={`${meter.approvedStatus === "Pending"
                                        ? "text-[#C86900] bg-[#FFF5EA] rounded-full px-2 py-1"
                                        : "text-[#1A73E8] bg-[#E9F6FF] rounded-full px-2 py-1"
                                        }`}
                                >
                                    {meter.approvedStatus}
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
            <div className="sticky bottom-0 bg-white border-t border-gray-200 flex items-center justify-between px-4 py-3 mt-4 z-10">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Rows per page</span>
                    <select
                        value={rowsPerPage}
                        onChange={(e) => {
                            setRowsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                    >
                        {[5, 10, 12, 20, 50].map((num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </select>
                </div>
                <span className="text-sm text-gray-600 ml-4">
                    {startIndex + 1}-{Math.min(endIndex, totalRows)} of {totalRows} rows
                </span>

                <div className="flex items-center gap-2">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm text-black-600 disabled:opacity-50 cursor-pointer"
                    >
                        Previous
                    </button>
                    <button
                        disabled={endIndex >= totalRows}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm text-black-600 disabled:opacity-50 cursor-pointer"
                    >
                        Next
                    </button>
                </div>
            </div>


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

            {/* Detach Meter Modal */}
            <DetachMeterDialog
                isOpen={isDetachModalOpen}
                onOpenChange={setIsDetachModalOpen}
                detachReason={detachReason}
                setDetachReason={setDetachReason}
                onProceed={handleProceedFromDetach}
                onCancel={handleCancelDetach}
            />

            {/* Detach Confirmation Modal */}
            <DetachConfirmationDialog
                isOpen={isDetachConfirmModalOpen}
                onOpenChange={setIsDetachConfirmModalOpen}
                customerToDetach={customerToDetach}
                onConfirm={handleConfirmDetach}
                onCancel={() => setIsDetachConfirmModalOpen(false)}
            />
        </div>
    );
}
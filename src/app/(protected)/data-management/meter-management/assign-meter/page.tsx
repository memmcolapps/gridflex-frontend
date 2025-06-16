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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ArrowUpDown,
    CirclePlus,
    Search,
    MoreVertical,
    Pencil,
    SquareArrowOutUpRight,
    Navigation,
    Unlink,
    AlertTriangle,
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
import { Progress } from "@/components/ui/progress";

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

interface MeterData {
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
    phoneNumber?: string;
    tariff?: string;
    feederLine?: string;
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
    const [selectedCustomer, setSelectedCustomer] = useState<MeterData | null>(null);
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
    const [feederLine, setFeederLine] = useState("");
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
            setMeterNumber(customer.meterNumber || "");
            setCin(customer.cin || "");
            setAccountNumber(customer.accountNumber || "");
            setTariff("");
            setFeederLine("");
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
            feederLine,
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
        alert(`Meter assigned successfully for ${selectedCustomer?.category.toLowerCase()} customer!`);
    };

    const handleCancelConfirmation = () => {
        setIsConfirmationModalOpen(false);
    };

    const handleEditDetails = (customer: MeterData) => {
        setEditCustomer({
            ...customer,
            tariff: customer.tariff || "",
            feederLine: customer.feederLine || "",
            dss: customer.dss || "",
            state: customer.state || "",
            city: customer.city || "",
            streetName: customer.streetName || "",
            houseNo: customer.houseNo || "",
        });
        setMeterNumber(customer.meterNumber || "");
        setCin(customer.cin || "");
        setAccountNumber(customer.accountNumber || "");
        setTariff(customer.tariff || "");
        setFeederLine(customer.feederLine || "");
        setDss(customer.dss || "");
        setState(customer.state || "");
        setCity(customer.city || "");
        setStreetName(customer.streetName || "");
        setHouseNo(customer.houseNo || "");
        setDebitMop(customer.debitMop || "");
        setCreditMop(customer.creditMop || "");
        setDebitPaymentPlan(customer.debitPaymentPlan || "");
        setCreditPaymentPlan(customer.creditPaymentPlan || "");
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
                feederLine,
                dss,
                state,
                city,
                streetName,
                houseNo,
            }));
            setMeterData((prev) =>
                prev.map((item) =>
                    item.customerId === editCustomer.customerId
                        ? { ...item, meterNumber, cin, accountNumber, tariff, feederLine, dss, state, city, streetName, houseNo }
                        : item
                )
            );
            setIsEditModalOpen(false);
            setProgress(100);
            if (editCustomer.category === "Prepaid") {
                setDebitMop(editCustomer.debitMop || "");
                setCreditMop(editCustomer.creditMop || "");
                setDebitPaymentPlan(editCustomer.debitPaymentPlan || "");
                setCreditPaymentPlan(editCustomer.creditPaymentPlan || "");
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
                            debitMop: debitMop || item.debitMop,
                            creditMop: creditMop || item.creditMop,
                            debitPaymentPlan: debitMop === "one-off" ? "" : (debitPaymentPlan || item.debitPaymentPlan),
                            creditPaymentPlan: creditMop === "one-off" ? "" : (creditPaymentPlan || item.creditPaymentPlan),
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
        setMigrateDebitMop(customer.debitMop || "");
        setMigrateDebitPaymentPlan(customer.debitPaymentPlan || "");
        setMigrateCreditMop(customer.creditMop || "");
        setMigrateCreditPaymentPlan(customer.creditPaymentPlan || "");
        setIsMigrateModalOpen(true);
    };

    const handleConfirmMigrate = () => {
        if (migrateCustomer) {
            setMeterData((prev) =>
                prev.map((item) =>
                    item.customerId === migrateCustomer.customerId
                        ? {
                            ...item,
                            category: migrateToCategory || item.category,
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
                item.customerId.toLowerCase().includes(term.toLowerCase()) ||
                item.meterNumber.toLowerCase().includes(term.toLowerCase()) ||
                item.accountNumber.toLowerCase().includes(term.toLowerCase()) ||
                item.cin.toLowerCase().includes(term.toLowerCase())
            );
        }

        // Apply class and type filters
        results = results.filter((meter) => {
            const classMatch =
                (!activeFilters.singlePhase && !activeFilters.threePhase && !activeFilters.md) ||
                (activeFilters.singlePhase && meter.class.toLowerCase().includes("single phase")) ||
                (activeFilters.threePhase && meter.class.toLowerCase().includes("three phase")) ||
                (activeFilters.md && meter.class.toLowerCase().includes("md"));

            const typeMatch =
                (!activeFilters.prepaid && !activeFilters.postPaid) ||
                (activeFilters.prepaid && meter.category.toLowerCase() === "prepaid") ||
                (activeFilters.postPaid && meter.category.toLowerCase() === "postpaid");

            return classMatch && typeMatch;
        });

        // Apply sorting
        if (sortBy) {
            results = [...results].sort((a, b) => {
                const aValue = (a as MeterData)[sortBy!] || "";
                const bValue = (b as MeterData)[sortBy!] || "";
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

    const isFormComplete =
        tariff !== "" &&
        feederLine !== "" &&
        dss !== "" &&
        state !== "" &&
        city.trim() !== "" &&
        streetName.trim() !== "" &&
        houseNo.trim() !== "" &&
        (selectedCustomer?.customerId || editCustomer?.customerId) &&
        meterNumber.trim() !== "" &&
        accountNumber.trim() !== "";

    const isPaymentFormComplete = debitMop !== "" && creditMop !== "";

    const isMigrateFormComplete =
        migrateToCategory !== "" &&
        (migrateToCategory !== "Prepaid" ||
            (migrateDebitMop !== "" &&
                migrateCreditMop !== "" &&
                (migrateDebitMop !== "monthly" || migrateDebitPaymentPlan !== "") &&
                (migrateCreditMop !== "monthly" || migrateCreditPaymentPlan !== "")));

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
                                Newest - Oldest
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleSortChange("customerId")}
                                className="text-sm cursor-pointer hover:bg-gray-100"
                            >
                                Oldest - Newest
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

            <Dialog
                open={isCustomerIdModalOpen}
                onOpenChange={setIsCustomerIdModalOpen}
            >
                <DialogContent className="bg-white text-black h-fit max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Assign Meter to Customer</DialogTitle>
                        <p className="text-sm">Select customer name to assign meter</p>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Customer ID <span className="text-red-500">*</span></Label>
                            <Input
                                value={customerIdInput}
                                onChange={(e) => handleCustomerIdChange(e.target.value)}
                                placeholder="Enter Customer ID"
                            />
                            {filteredCustomerIds.length > 0 && (
                                <ul className="w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-[200px] overflow-y-auto">
                                    {filteredCustomerIds.map((id) => (
                                        <li
                                            key={id}
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleCustomerIdSelect(id)}
                                        >
                                            {id}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
                <DialogContent className="bg-white text-black h-fit">
                    {selectedCustomer?.category === "Prepaid" && <Progress value={progress} className="w-full" />}
                    <DialogHeader>
                        <DialogTitle>Assign meter to customer</DialogTitle>
                        <p className="text-sm">Fill all compulsory fields</p>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Customer ID<span className="text-red-700">*</span></Label>
                                <Input
                                    value={selectedCustomer?.customerId ?? ""}
                                    readOnly
                                    placeholder="Enter Customer ID"
                                    className="border-gray-200 text-gray-600"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>First Name<span className="text-red-700">*</span></Label>
                                <Input
                                    value={selectedCustomer?.firstName ?? ""}
                                    readOnly
                                    placeholder="Enter First Name"
                                    className="border-gray-200 text-gray-600"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Last Name<span className="text-red-700">*</span></Label>
                                <Input
                                    value={selectedCustomer?.lastName ?? ""}
                                    readOnly
                                    placeholder="Enter Last Name"
                                    className="border-gray-200 text-gray-600"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone Number<span className="text-red-700">*</span></Label>
                                <Input
                                    value={selectedCustomer?.phoneNumber ?? ""}
                                    readOnly
                                    placeholder="Enter Phone Number"
                                    className="border-gray-200 text-gray-600"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Meter Number<span className="text-red-700">*</span></Label>
                                <Input
                                    value={meterNumber}
                                    onChange={(e) => setMeterNumber(e.target.value)}
                                    placeholder="Enter Meter Number"
                                    className="border-gray-200 text-gray-600"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>CIN</Label>
                                <Input
                                    value={cin}
                                    onChange={(e) => setCin(e.target.value)}
                                    placeholder="Enter CIN"
                                    className="border-gray-200 text-gray-600"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Account Number<span className="text-red-700">*</span></Label>
                                <Input
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    placeholder="Enter Account Number"
                                    className="border-gray-200 text-gray-600"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Tariff<span className="text-red-700">*</span></Label>
                                <Select onValueChange={setTariff}>
                                    <SelectTrigger className="border-gray-200 text-gray-600 w-full">
                                        <SelectValue placeholder="Select Tariff" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="tariff1">Tariff 1</SelectItem>
                                        <SelectItem value="tariff2">Tariff 2</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Feeder Line<span className="text-red-700">*</span></Label>
                                <Select onValueChange={setFeederLine}>
                                    <SelectTrigger className="border-gray-100 text-gray-600 w-full">
                                        <SelectValue placeholder="Select Feeder Line" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="feeder1">Feeder 1</SelectItem>
                                        <SelectItem value="feeder2">Feeder 2</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Distribution Substation (DSS)<span className="text-red-700">*</span></Label>
                                <Select onValueChange={setDss}>
                                    <SelectTrigger className="border-gray-100 text-gray-600 w-full">
                                        <SelectValue placeholder="Select DSS" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="dss1">DSS 1</SelectItem>
                                        <SelectItem value="dss2">DSS 2</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>State<span className="text-red-700">*</span></Label>
                                <Select onValueChange={setState}>
                                    <SelectTrigger className="border-gray-100 text-gray-600 w-full">
                                        <SelectValue placeholder="Select State" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="state1">State 1</SelectItem>
                                        <SelectItem value="state2">State 2</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>City<span className="text-red-700">*</span></Label>
                                <Input
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="Enter City"
                                    className="border-gray-100 text-gray-600"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Street Name<span className="text-red-700">*</span></Label>
                                <Input
                                    value={streetName}
                                    onChange={(e) => setStreetName(e.target.value)}
                                    placeholder="Enter Street Name"
                                    className="border-gray-100 text-gray-600"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>House No. <span className="text-red-700">*</span></Label>
                                <Input
                                    value={houseNo}
                                    onChange={(e) => setHouseNo(e.target.value)}
                                    placeholder="Enter House No"
                                    className="border-gray-100 text-gray-600"
                                />
                            </div>
                            <DialogFooter className="w-115">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsAssignModalOpen(false)}
                                    className="border-[#161CCA] text-[#161CCA] cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleProceedFromAssign}
                                    disabled={!isFormComplete}
                                    className={
                                        isFormComplete
                                            ? "bg-[#161CCA] text-white cursor-pointer"
                                            : "bg-blue-200 text-white cursor-not-allowed"
                                    }
                                >
                                    Proceed
                                </Button>
                            </DialogFooter>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="bg-white text-black h-fit">
                    {editCustomer?.category === "Prepaid" && <Progress value={progress} className="w-full" />}
                    <DialogHeader>
                        <DialogTitle>Edit Customer Details</DialogTitle>
                        <p className="text-sm">Fill all compulsory fields</p>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Customer ID<span className="text-red-700">*</span></Label>
                                <Input
                                    value={editCustomer?.customerId ?? ""}
                                    readOnly
                                    disabled
                                    placeholder="Enter Customer ID"
                                    className="border-gray-200 text-gray-600 bg-gray-100 cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>First Name<span className="text-red-700">*</span></Label>
                                <Input
                                    value={editCustomer?.firstName ?? ""}
                                    readOnly
                                    placeholder="Enter First Name"
                                    className="border-gray-200 text-gray-600"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Last Name<span className="text-red-700">*</span></Label>
                                <Input
                                    value={editCustomer?.lastName ?? ""}
                                    readOnly
                                    placeholder="Enter Last Name"
                                    className="border-gray-200 text-gray-600"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone Number<span className="text-red-700">*</span></Label>
                                <Input
                                    value={editCustomer?.phoneNumber ?? ""}
                                    readOnly
                                    placeholder="Enter Phone Number"
                                    className="border-gray-200 text-gray-600"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Meter Number<span className="text-red-700">*</span></Label>
                                <Input
                                    value={meterNumber}
                                    onChange={(e) => setMeterNumber(e.target.value)}
                                    placeholder="Enter Meter Number"
                                    className="border-gray-200 text-gray-600"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>CIN</Label>
                                <Input
                                    value={cin}
                                    onChange={(e) => setCin(e.target.value)}
                                    placeholder="Enter CIN"
                                    className="border-gray-200 text-gray-600"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Account Number<span className="text-red-700">*</span></Label>
                                <Input
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    placeholder="Enter Account Number"
                                    className="border-gray-200 text-gray-600"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Tariff<span className="text-red-700">*</span></Label>
                                <Select onValueChange={setTariff} value={tariff}>
                                    <SelectTrigger className="border-gray-200 text-gray-600 w-full">
                                        <SelectValue placeholder="Select Tariff" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="tariff1">Tariff 1</SelectItem>
                                        <SelectItem value="tariff2">Tariff 2</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Feeder Line<span className="text-red-700">*</span></Label>
                                <Select onValueChange={setFeederLine} value={feederLine}>
                                    <SelectTrigger className="border-gray-100 text-gray-600 w-full">
                                        <SelectValue placeholder="Select Feeder Line" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="feeder1">Feeder 1</SelectItem>
                                        <SelectItem value="feeder2">Feeder 2</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Distribution Substation (DSS)<span className="text-red-700">*</span></Label>
                                <Select onValueChange={setDss} value={dss}>
                                    <SelectTrigger className="border-gray-100 text-gray-600 w-full">
                                        <SelectValue placeholder="Select DSS" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="dss1">DSS 1</SelectItem>
                                        <SelectItem value="dss2">DSS 2</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>State<span className="text-red-700">*</span></Label>
                                <Select onValueChange={setState} value={state}>
                                    <SelectTrigger className="border-gray-100 text-gray-600 w-full">
                                        <SelectValue placeholder="Select State" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="state1">State 1</SelectItem>
                                        <SelectItem value="state2">State 2</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>City<span className="text-red-700">*</span></Label>
                                <Input
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="Enter City"
                                    className="border-gray-100 text-gray-600"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Street Name<span className="text-red-700">*</span></Label>
                                <Input
                                    value={streetName}
                                    onChange={(e) => setStreetName(e.target.value)}
                                    placeholder="Enter Street Name"
                                    className="border-gray-100 text-gray-600"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>House No. <span className="text-red-700">*</span></Label>
                                <Input
                                    value={houseNo}
                                    onChange={(e) => setHouseNo(e.target.value)}
                                    placeholder="Enter House No"
                                    className="border-gray-100 text-gray-600"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditModalOpen(false)}
                            className="border-[#161CCA] text-[#161CCA] cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleProceedFromEdit}
                            disabled={editCustomer ? false : !isFormComplete}
                            className={
                                editCustomer || isFormComplete
                                    ? "bg-[#161CCA] text-white cursor-pointer"
                                    : "bg-blue-200 text-white cursor-not-allowed"
                            }
                        >
                            Proceed
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog
                open={isSetPaymentModalOpen}
                onOpenChange={setIsSetPaymentModalOpen}
            >
                <DialogContent className="bg-white text-black h-fit">
                    <DialogHeader>
                        <Progress value={progress} className="w-full" />
                        <DialogTitle className="mt-2 text-xl">Set Payment Mode</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div>
                                    <Label className="font-bold text-xl">Debit</Label><br />
                                    <p className="text-sm">Mode of payment <span className="text-red-600">*</span></p>
                                </div>
                                <div>
                                    <Select onValueChange={setDebitMop} value={debitMop}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select mode of payment" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="monthly">Monthly</SelectItem>
                                            <SelectItem value="one-off">One off</SelectItem>
                                            <SelectItem value="percentage">Percentage</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <Label className="font-bold text-xl">Credit</Label><br />
                                    <p className="text-sm">Mode of payment <span className="text-red-600">*</span></p>
                                </div>
                                <div>
                                    <Select onValueChange={setCreditMop} value={creditMop}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select mode of payment" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="monthly">Monthly</SelectItem>
                                            <SelectItem value="one-off">One off</SelectItem>
                                            <SelectItem value="percentage">Percentage</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Payment Plan</Label>
                                <Select
                                    onValueChange={setDebitPaymentPlan}
                                    disabled={debitMop === "one-off" || debitMop === "percentage"}
                                    value={debitPaymentPlan}
                                >
                                    <SelectTrigger
                                        className={`w-full ${debitMop === "one-off" || debitMop === "percentage" ? "bg-gray-100 cursor-not-allowed text-gray-300" : ""}`}
                                    >
                                        <SelectValue placeholder="Select payment plan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="6">6</SelectItem>
                                        <SelectItem value="3">3</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Payment Plan</Label>
                                <Select
                                    onValueChange={setCreditPaymentPlan}
                                    disabled={creditMop === "one-off" || creditMop === "percentage"}
                                    value={creditPaymentPlan}
                                >
                                    <SelectTrigger
                                        className={`w-full ${creditMop === "one-off" || creditMop === "percentage" ? "bg-gray-100 cursor-not-allowed text-gray-300" : ""}`}
                                    >
                                        <SelectValue placeholder="Select payment plan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="6">6</SelectItem>
                                        <SelectItem value="3">3</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsSetPaymentModalOpen(false)}
                            className="text-[#161CCA] border-[#161CCA] cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={editCustomer ? handleConfirmEditFromSetPayment : handleProceedFromSetPayment}
                            disabled={editCustomer ? false : !isPaymentFormComplete}
                            className={
                                editCustomer || isPaymentFormComplete
                                    ? "bg-[#161CCA] text-white cursor-pointer"
                                    : "bg-blue-200 text-white cursor-not-allowed"
                            }
                        >
                            Proceed
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog
                open={isDeactivateModalOpen}
                onOpenChange={setIsDeactivateModalOpen}
            >
                <DialogContent className="h-fit bg-white text-black" style={{ width: '500px', maxWidth: 'none' }}>
                    <DialogHeader>
                        <DialogTitle className="font-semibold">Deactivate Virtual Meter</DialogTitle>
                        <DialogDescription>
                            Deactivate any existing virtual meters at <span className="font-bold"> "5, Glorious Orimerumnu, Obafemi Owode, Ogun State" </span>before assigning an actual meter, or proceed if not applicable.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div>
                            <Label className="font-medium">Virtual meters <span className="text-red-600">*</span> </Label>
                            <Select>
                                <SelectTrigger className="mt-2 w-full">
                                    <SelectValue placeholder="Select meter" />
                                </SelectTrigger>
                                <SelectContent className="w-full">
                                    <SelectItem value="V-201021223-5" className="flex items-center gap-4 w-full">
                                        <div className="flex items-center justify-between flex-1 gap-12">
                                            <span>V-201021223</span>
                                            <span>5, Glorious Orimerumnu, Obafemi Owode, Ogun State</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="V-201021223-6" className="flex items-center gap-4 w-full">
                                        <div className="flex items-center justify-between flex-1 gap-12">
                                            <span>V-201021223</span>
                                            <span>6, Glorious Orimerumnu, Obafemi Owode, Ogun State</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="V-201021223-7" className="flex items-center gap-4 w-full">
                                        <div className="flex items-center justify-between flex-1 gap-12">
                                            <span>V-201021223</span>
                                            <span>7, Glorious Orimerumnu, Obafemi Owode, Ogun State</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeactivateModalOpen(false)}
                            className="border border-[#161CCA] text-[#161CCA] cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleProceedFromDeactivate} className="bg-[#161CCA] text-white cursor-pointer">Proceed</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog
                open={isConfirmationModalOpen}
                onOpenChange={setIsConfirmationModalOpen}
            >
                <DialogContent className="bg-white text-black h-fit" style={{ width: '400px', maxWidth: 'none' }}>
                    <DialogHeader>
                        <div className="flex justify-items-start mb-4">
                            <div className="bg-blue-100 rounded-full p-3">
                                <AlertTriangle size={24} className="text-[#161CCA]" />
                            </div>
                        </div>
                        <DialogTitle className="font-semibold">Assign meter</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to assign actual meter to <br />
                            <span>{selectedCustomer?.customerId}</span>?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={handleCancelConfirmation}
                            className="border border-[#161CCA] text-[#161CCA] cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmAssignment}
                            className="bg-[#161CCA] text-white cursor-pointer"
                        >
                            Assign
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog
                open={isMigrateModalOpen}
                onOpenChange={setIsMigrateModalOpen}
            >
                <DialogContent className="bg-white text-black h-fit w-lg" >
                    <DialogHeader>
                        <DialogTitle className="font-semibold text-xl">Migrate Meter</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Migrate from <span className="text-red-600">*</span></Label>
                                    <Input
                                        value={migrateCustomer?.category ?? ""}
                                        disabled
                                        className="w-full h-10 bg-gray-100 text-gray-600 cursor-not-allowed border-gray-200 focus:ring-0"
                                    />
                                </div>
                                {migrateToCategory === "Prepaid" && (
                                    <>
                                        <h2 className="font-bold">Debit</h2>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium"> Mode of Payment <span className="text-red-600">*</span></Label>
                                            <Select onValueChange={setMigrateDebitMop} value={migrateDebitMop}>
                                                <SelectTrigger className="w-full h-10 border-gray-200 focus:ring-[#161CCA]/50">
                                                    <SelectValue placeholder="Select mode of payment" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="percentage">Percentage</SelectItem>
                                                    <SelectItem value="monthly">Monthly</SelectItem>
                                                    <SelectItem value="one-off">One off</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Payment Plan</Label>
                                            <Select
                                                onValueChange={setMigrateDebitPaymentPlan}
                                                disabled={migrateDebitMop === "percentage" || migrateDebitMop === "one-off"}
                                                value={migrateDebitPaymentPlan}
                                            >
                                                <SelectTrigger
                                                    className={`w-full h-10 border-gray-200 focus:ring-[#161CCA]/50 ${migrateDebitMop === "percentage" || migrateDebitMop === "one-off" ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "text-gray-600"}`}
                                                >
                                                    <SelectValue placeholder="Select payment plan" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="6">6</SelectItem>
                                                    <SelectItem value="3">3</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Migrate to <span className="text-red-600">*</span></Label>
                                    <Select onValueChange={setMigrateToCategory} value={migrateToCategory}>
                                        <SelectTrigger className="w-full h-10 border-gray-200 focus:ring-[#161CCA]/50">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {migrateCustomer?.category === "Postpaid" && <SelectItem value="Prepaid">Prepaid</SelectItem>}
                                            {migrateCustomer?.category === "Prepaid" && <SelectItem value="Postpaid">Postpaid</SelectItem>}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {migrateToCategory === "Prepaid" && (
                                    <>
                                        <h2 className="font-bold">Credit</h2>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium"> Mode of Payment <span className="text-red-600">*</span></Label>
                                            <Select onValueChange={setMigrateCreditMop} value={migrateCreditMop}>
                                                <SelectTrigger className="w-full h-10 border-gray-200 focus:ring-[#161CCA]/50">
                                                    <SelectValue placeholder="Select mode of payment" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="percentage">Percentage</SelectItem>
                                                    <SelectItem value="monthly">Monthly</SelectItem>
                                                    <SelectItem value="one-off">One off</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium"> Payment Plan</Label>
                                            <Select
                                                onValueChange={setMigrateCreditPaymentPlan}
                                                disabled={migrateCreditMop === "percentage" || migrateCreditMop === "one-off"}
                                                value={migrateCreditPaymentPlan}
                                            >
                                                <SelectTrigger
                                                    className={`w-full h-10 border-gray-200 focus:ring-[#161CCA]/50 ${migrateCreditMop === "percentage" || migrateCreditMop === "one-off" ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "text-gray-600"}`}
                                                >
                                                    <SelectValue placeholder="Select payment plan" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="6">6</SelectItem>
                                                    <SelectItem value="3">3</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsMigrateModalOpen(false)}
                            className="border-[#161CCA] text-[#161CCA] hover:bg-[#161CCA]/10 h-10 px-4 cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmMigrate}
                            disabled={!isMigrateFormComplete}
                            className={
                                isMigrateFormComplete
                                    ? "bg-[#161CCA] text-white hover:bg-[#161CCA]/90 h-10 px-4 cursor-pointer"
                                    : "bg-blue-200 text-white cursor-not-allowed h-10 px-4"
                            }
                        >
                            Migrate
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Detach Meter Modal */}
            <Dialog open={isDetachModalOpen} onOpenChange={setIsDetachModalOpen}>
                <DialogContent className="bg-white text-black h-fit">
                    <DialogHeader>
                        <DialogTitle>Detach Meter</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Reason <span className="text-red-500">*</span></Label>
                            <Input
                                value={detachReason}
                                onChange={(e) => setDetachReason(e.target.value)}
                                placeholder="Enter reason for detaching meter"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={handleCancelDetach}
                            className="border-[#F50202] text-[#F50202] bg-white cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleProceedFromDetach}
                            disabled={!detachReason.trim()}
                            className={
                                detachReason.trim()
                                    ? "bg-[#F50202] text-white cursor-pointer"
                                    : "bg-red-200 text-white cursor-not-allowed"
                            }
                        >
                            Detach
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Detach Confirmation Modal */}
            <Dialog open={isDetachConfirmModalOpen} onOpenChange={setIsDetachConfirmModalOpen}>
                <DialogContent className="bg-white text-black h-fit" style={{ width: '350px', maxWidth: 'none' }}>
                    <DialogHeader>
                        <div className="flex justify-items-start mb-4">
                            <div className="bg-red-100 rounded-full p-3">
                                <AlertTriangle size={24} className="text-red-600" />
                            </div>
                        </div>
                        <DialogTitle className="font-semibold">Detach Meter</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to detach meter from <br />
                            <span className="font-bold">{customerToDetach?.customerId}</span>?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDetachConfirmModalOpen(false)}
                            className="border border-[#F50202] text-[#F50202] cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmDetach}
                            className="bg-[#F50202] text-white hover:bg-red-700 cursor-pointer"
                        >
                            Detach
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
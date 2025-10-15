/* eslint-disable */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import {
    CirclePlus,
    SquareArrowOutUpRight,
    MoreVertical,
    Ban,
    Pencil,
    CheckCircle,
    Eye,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AddMeterDialog } from "@/components/meter-management/add-edit-meter-dialog";
import { BulkUploadDialog } from "@/components/meter-management/bulk-upload";
import { FilterControl, SearchControl } from "@/components/search-control";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ViewMeterDetailsDialog } from "@/components/meter-management/view-meters-details-dialog";
import { ViewVirtualMeterDetailsDialog } from "@/components/meter-management/view-virtual-details-dialog";
import { AssignMeterDialog } from "@/components/meter-management/assign-meter-dialog";
import CustomerIdDialog from "@/components/meter-management/customer-id-dialog";
import { ConfirmationModalDialog } from "@/components/meter-management/confirmation-modal-dialog";
import type { VirtualMeterData } from "@/types/meter";
import type { MeterInventoryItem } from "@/types/meter-inventory";
import { getStatusStyle } from "@/components/status-style";
import { cn } from "@/lib/utils";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    useMeters,
    useAssignMeter,
    useChangeMeterState,
    type AssignMeterPayload,
    type ChangeMeterStatePayload,
} from "@/hooks/use-assign-meter";
import { useCustomerRecordQuery } from "@/hooks/use-customer";
import { toast } from "sonner";



export default function MeterManagementPage() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedTariffs, setSelectedTariffs] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isBulkUploadDialogOpen, setIsBulkUploadDialogOpen] = useState(false);
    const [editMeter, setEditMeter] = useState<MeterInventoryItem | VirtualMeterData | undefined>(undefined);
    const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
    const [selectedMeter, setSelectedMeter] = useState<MeterInventoryItem | VirtualMeterData | null>(null);
    const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({});
    const [activeTab, setActiveTab] = useState<"actual" | "virtual">("actual");
    const [sortConfig, setSortConfig] = useState<{
        key: keyof MeterInventoryItem | keyof VirtualMeterData | null;
        direction: "asc" | "desc";
    }>({ key: null, direction: "asc" });
    const [processedData, setProcessedData] = useState<(MeterInventoryItem | VirtualMeterData)[]>([]);

    // Add Virtual Meter flow states
    const [isAddVirtualMeterOpen, setIsAddVirtualMeterOpen] = useState(false);
    const [isDeactivatePhysicalOpen, setIsDeactivatePhysicalOpen] = useState(false);
    const [isVirtualConfirmOpen, setIsVirtualConfirmOpen] = useState(false);
    const [selectedPhysicalMeter, setSelectedPhysicalMeter] = useState<string>("");
    const [customerIdInput, setCustomerIdInput] = useState("");
    const [filteredCustomerIds, setFilteredCustomerIds] = useState<string[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<VirtualMeterData | null>(null);
    const [accountNumber, setAccountNumber] = useState("");
    const [cin, setCin] = useState("");
    const [feeder, setFeeder] = useState("");
    const [dss, setDss] = useState("");
    const [tariff, setTariff] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [streetName, setStreetName] = useState("");
    const [houseNo, setHouseNo] = useState("");
    const [energyType, setEnergyType] = useState("");
    const [fixedEnergy, setFixedEnergy] = useState("");
    const [isEditVirtualMeterOpen, setIsEditVirtualMeterOpen] = useState(false);
    const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
    const [viewMeter, setViewMeter] = useState<MeterInventoryItem | null>(null);
    const [isCustomerIdModalOpen, setIsCustomerIdModalOpen] = useState(false);
    const [meterData, setMeterData] = useState<MeterInventoryItem[]>([]);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [progress, setProgress] = useState(50);
    const [meterNumber, setMeterNumber] = useState("");
    const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
    const [debitMop, setDebitMop] = useState("");
    const [creditMop, setCreditMop] = useState("");
    const [debitPaymentPlan, setDebitPaymentPlan] = useState("");
    const [creditPaymentPlan, setCreditPaymentPlan] = useState("");
    const [isSetPaymentModalOpen, setIsSetPaymentModalOpen] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [category, setCategory] = useState("");
    const [phone, setPhone] = useState<string>("");
    const [editCustomer] = useState<MeterInventoryItem | null>(null);
    const [isUploadImageOpen, setIsUploadImageOpen] = useState(false);
    const [isConfirmImageOpen, setIsConfirmImageOpen] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [viewVirtualMeter, setViewVirtualMeter] = useState<VirtualMeterData | null>(null);
    const [isViewActualDetailsOpen, setIsViewActualDetailsOpen] = useState(false);
    const [isViewVirtualDetailsOpen, setIsViewVirtualDetailsOpen] = useState(false);

    // --- HOOKS ---
    const { data: metersData, isLoading, isError } = useMeters({
        page: currentPage,
        pageSize: rowsPerPage,
        searchTerm,
        sortBy: sortConfig.key as any,
        sortDirection: sortConfig.direction,
        type: activeTab === "actual" ? "allocated" : "virtual",
    });

    const { data: customerRecordData, isLoading: isCustomerRecordLoading } = useCustomerRecordQuery(customerIdInput);

    // --- MUTATIONS ---
    const assignMeterMutation = useAssignMeter();
    const changeStateMutation = useChangeMeterState();

    // interface MeterData {
    //     customerId?: string;
    //     id: string;
    //     meterNumber: string;
    //     simNo: string;
    //     class: string;
    //     category: string;
    //     meterType: string;
    //     oldTariffIndex: string;
    //     newTariffIndex: string;
    //     manufactureName: string;
    //     accountNumber: string;
    //     oldSgc: string;
    //     oldKrn: string;
    //     newKrn: string;
    //     newSgc: string;
    //     tariff: string;
    //     assignedStatus: string;
    //     status: string;
    //     // Add address fields to match VirtualMeterData
    //     feeder?: string;
    //     dss?: string;
    //     cin?: string;
    //     firstName?: string;
    //     lastName?: string;
    //     phone?: string;
    //     state?: string;
    //     city?: string;
    //     streetName?: string;
    //     houseNo?: string;
    //     // Add missing properties to match imported MeterData
    //     debitMop?: string;
    //     debitPaymentPlan?: string;
    //     creditMop?: string;
    //     creditPaymentPlan?: string;
    //     approvedStatus?: string;
    //     Image?: File | null;
    //     smartMeter?: string
    // }

    // Remove local VirtualMeterData interface, use imported one

    const handleOpenCustomerIdModal = () => {
        setCustomerIdInput("");
        setFilteredCustomerIds([]);
        setIsCustomerIdModalOpen(true);
    };


    const handleCustomerIdChange = (value: string) => {
        console.log("handleCustomerIdChange called with value:", value);
        setCustomerIdInput(value);
        if (value.trim() === "") {
            setFilteredCustomerIds([]);
        } else {
            const currentData = activeTab === "actual" ? (metersData?.actualMeters || []) : (metersData?.virtualMeters || []);
            const filtered = Array.from(
                new Set(
                    currentData
                        .filter((customer) =>
                            customer.customerId
                                ? customer.customerId.toLowerCase().includes(value.toLowerCase())
                                : false
                        )
                        .map((customer) => customer.customerId as string)
                )
            );
            console.log("Filtered unique customer IDs:", filtered);
            setFilteredCustomerIds(filtered);
        }
    };

    const handleCustomerIdSelect = (customerId: string) => {
        const currentData = activeTab === "actual" ? (metersData?.actualMeters || []) : (metersData?.virtualMeters || []);
        const customer = currentData.find((item) => item.customerId === customerId);
        if (customer && customer.customerId) {
            setSelectedCustomer({
                // id: customer.id ?? "",
                customerId: customer.customerId, // Ensure customerId is a string
                meterNumber: "",
                cin: "",
                accountNumber: "",
                tariff: "",
                feeder: "",
                dss: "",
                state: "",
                city: "",
                streetName: "",
                houseNo: "",
                status: "Assigned",
                firstName: customer.firstName ?? "",
                lastName: customer.lastName ?? "",
                phone: customer.phone ?? "",
                image: null,
                consumptionType: "Non-MD", // Required by VirtualMeterData
                category: customer.category ?? "",
            } as VirtualMeterData);
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
            setIsAddVirtualMeterOpen(false);
            setIsDeactivatePhysicalOpen(false);
            setIsVirtualConfirmOpen(false);
            setSelectedPhysicalMeter("");
            setEnergyType("");
            setFixedEnergy("");
            setCategory(customer.category ?? "");
        } else {
            console.log("Customer not found or invalid customerId for ID:", customerId);
        }
    };

    const handleProceedFromAssign = () => {
        if (!selectedCustomer?.customerId) {
            console.error("No valid customer selected or customerId is missing");
            return;
        }

        // Prepare the payload for the backend
        const assignPayload = {
            meterNumber,
            customerId: selectedCustomer.customerId,
            tariffId: tariff, // This should be the tariff ID, not name
            dssAssetId: dss,
            feederAssetId: feeder,
            cin,
            accountNumber,
            state,
            city,
            houseNo,
            streetName,
            creditPaymentMode: debitMop,
            debitPaymentMode: creditMop,
            creditPaymentPlan: debitPaymentPlan,
            debitPaymentPlan: creditPaymentPlan,
        };

        // Call the assign meter mutation
        assignMeterMutation.mutate(assignPayload, {
            onSuccess: () => {
                setIsAssignModalOpen(false);
                setIsUploadImageOpen(true);
                setProgress(60);
                // Reset form fields
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
                setSelectedCustomer(null);
            },
            onError: (error) => {
                console.error("Failed to assign meter:", error);
            },
        });
    };

    const handleProceedFromCustomerIdDialog = () => {
        if (!customerIdInput.trim()) {
            return;
        }

        // Fetch customer record using the hook
        // The hook will automatically fetch when customerIdInput changes
        if (customerRecordData) {
            const customer = customerRecordData.customer;
            setSelectedCustomer({
                id: customer.customerId,
                customerId: customer.customerId,
                meterNumber: "",
                cin: customerRecordData.GeneratedVirtualMeterNo || "",
                accountNumber: customerRecordData.GeneratedAccountNumber || "",
                tariff: "",
                feeder: "",
                dss: "",
                state: customer.state || "",
                city: customer.city || "",
                streetName: customer.streetName || "",
                houseNo: customer.houseNo || "",
                status: "Assigned",
                firstName: customer.firstname || "",
                lastName: customer.lastname || "",
                phone: customer.phoneNumber || "",
                image: null,
                consumptionType: "Non-MD",
                category: "",
            } as VirtualMeterData);
            setCustomerIdInput(customer.customerId);
            setFilteredCustomerIds([]);
            setIsCustomerIdModalOpen(false);
            setIsAssignModalOpen(true);
            setProgress(50);
            setMeterNumber("");
            setCin(customerRecordData.GeneratedVirtualMeterNo || "");
            setAccountNumber(customerRecordData.GeneratedAccountNumber || "");
            setTariff("");
            setFeeder("");
            setDss("");
            setState(customer.state || "");
            setCity(customer.city || "");
            setStreetName(customer.streetName || "");
            setHouseNo(customer.houseNo || "");
            setDebitMop("");
            setCreditMop("");
            setDebitPaymentPlan("");
            setCreditPaymentPlan("");
            setIsAddVirtualMeterOpen(false);
            setIsDeactivatePhysicalOpen(false);
            setIsVirtualConfirmOpen(false);
            setSelectedPhysicalMeter("");
            setEnergyType("");
            setFixedEnergy("");
            setCategory("");
        } else if (isCustomerRecordLoading) {
            // Still loading
        } else {
        }
    };

    const handleProceedFromUploadImage = (image: File | null) => {
        setUploadedImage(image);
        setSelectedCustomer((prev) => (prev ? { ...prev, image } : prev));
        setIsUploadImageOpen(false);
        setIsConfirmImageOpen(true);
        setProgress(70);
    };

    const handleProceedFromConfirmImage = () => {
        setIsConfirmImageOpen(false);
        if (selectedCustomer?.category === "Prepaid") {
            setIsSetPaymentModalOpen(true);
            setProgress(80);
        } else if (selectedCustomer?.category === "Postpaid") {
            setIsDeactivateModalOpen(true);
            setProgress(80);
        }
    };

    const isPaymentFormComplete = debitMop !== "" && creditMop !== "";

    const handleProceedFromSetPayment = () => {
        console.log("handleProceedFromSetPayment: selectedCustomer.category =", selectedCustomer?.category);
        setIsSetPaymentModalOpen(false);
        if (selectedCustomer?.category === "Prepaid") {
            setIsDeactivateModalOpen(true);
            setProgress(90); // Increment progress to reflect additional step
        } else {
            setIsConfirmationModalOpen(true);
            setProgress(100);
        }
    };

    const handleProceedFromDeactivate = () => {
        setIsDeactivateModalOpen(false);
        setIsConfirmationModalOpen(true);
        setProgress(100);
    };

    const handleConfirmAssignment = () => {
        setIsConfirmationModalOpen(false);
    };

    const handleCancelConfirmation = () => {
        setIsConfirmationModalOpen(false);
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
                            image: uploadedImage ?? item.Image,
                        }
                        : item
                )
            );
            setIsSetPaymentModalOpen(false);
        }
    };
    const actualFilterSections = [
        {
            title: "Status",
            options: [

                { id: "assigned", label: "Assigned" },
                { id: "unassigned", label: "Unassigned" },
            ],
        },
        {
            title: "Meter Class",
            options: [
                { id: "singlePhase", label: "Single phase" },
                { id: "threePhase", label: "Three Phase" },
                { id: "mdMeter", label: "MD Meter" },
            ],
        },
    ];

    const virtualFilterSections = [
        {
            title: "Status",
            options: [
                { id: "assigned", label: "Assigned" },
                { id: "deactivated", label: "Deactivated" },
            ],
        },
    ];


    const [data, setData] = useState<MeterInventoryItem[]>([]);

    const [virtualData, setVirtualData] = useState<VirtualMeterData[]>([]);

    const nigerianStates = [
        "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa",
        "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo",
        "Ekiti", "Enugu", "FCT", "Gombe", "Imo", "Jigawa",
        "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
        "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
        "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
    ];

    const customerTypes =
        ["Non-MD", "MD"]

    // NEW: Initialize form fields for Edit Virtual Meter dialog
    useEffect(() => {
        if (editMeter && "customerId" in editMeter && isEditVirtualMeterOpen) {
            const virtualMeter = editMeter as VirtualMeterData;
            setAccountNumber(virtualMeter.accountNumber ?? "");
            setCin(virtualMeter.cin ?? "");
            setTariff(virtualMeter.tariff ?? "");
            setPhone(virtualMeter.phone ?? "");
            setState(virtualMeter.state ?? "");
            setCity(virtualMeter.city ?? "");
            setStreetName(virtualMeter.streetName ?? "");
            setHouseNo(virtualMeter.houseNo ?? "");
        }
    }, [editMeter, isEditVirtualMeterOpen]);

    useEffect(() => {
        const actualMeters = metersData?.actualMeters || [];
        const virtualMeters = metersData?.virtualMeters || [];
        setProcessedData(activeTab === "actual" ? actualMeters : virtualMeters);
    }, [metersData, activeTab]);

    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
        applyFiltersAndSort(term, sortConfig.key, sortConfig.direction);
    };

    const handleSortChange = () => {
        const sortKey: keyof MeterInventoryItem | keyof VirtualMeterData = sortConfig.key ?? (activeTab === "actual" ? "meterNumber" : "meterNumber");
        const newDirection = sortConfig.direction === "asc" ? "desc" : "asc";
        setSortConfig({ key: sortKey, direction: newDirection });
        applyFiltersAndSort(searchTerm, sortKey, newDirection);
    };

    useEffect(() => {
        applyFiltersAndSort(searchTerm, sortConfig.key, sortConfig.direction);
    }, [data, virtualData, activeTab, activeFilters, searchTerm, sortConfig.key, sortConfig.direction]);

    const applyFiltersAndSort = (
        term: string,
        sortBy: keyof MeterInventoryItem | keyof VirtualMeterData | null,
        direction: "asc" | "desc"
    ) => {
        let results: (MeterInventoryItem | VirtualMeterData)[] = activeTab === "actual" ? (metersData?.actualMeters || []) : (metersData?.virtualMeters || []);

        // Apply filters
        if (Object.keys(activeFilters).length > 0) {
            results = results.filter((item) => {
                if (activeTab === "actual") {
                    const meter = item as MeterInventoryItem;

                    // Status filter: Match if no status filters are selected or any selected status matches
                    const statusFilters = [
                        { id: "assigned", value: activeFilters.assigned, status: "Assigned" },
                        { id: "deactivated", value: activeFilters.deactivated, status: "Unassigned" },
                    ];
                    const statusMatch =
                        statusFilters.every((f) => !f.value) ||
                        statusFilters.some((filter) => filter.value && meter.status === filter.status);

                    // Class filter: Match if no class filters are selected or any selected class matches
                    const classFilters = [
                        { id: "singlePhase", value: activeFilters.singlePhase, class: "Single phase" },
                        { id: "threePhase", value: activeFilters.threePhase, class: "Three Phase" },
                        { id: "mdMeter", value: activeFilters.mdMeter, class: "MD" },
                    ];
                    const classMatch =
                        classFilters.every((f) => !f.value) ||
                        classFilters.some((filter) => filter.value && meter.meterClass === filter.class);

                    return statusMatch && classMatch;
                } else {
                    const meter = item as VirtualMeterData;

                    // Virtual meter status filter
                    const statusFilters = [
                        { id: "active", value: activeFilters.assigned, status: "Active" },
                        { id: "deactivated", value: activeFilters.deactivated, status: "Deactivated" },
                    ];
                    return (
                        statusFilters.every((f) => !f.value) ||
                        statusFilters.some((filter) => filter.value && meter.status === filter.status)
                    );
                }
            });
        }

        // Apply search
        if (term.trim() !== "") {
            results = results.filter((item) =>
                activeTab === "actual"
                    ? ([
                        item.meterNumber,
                        (item as MeterInventoryItem).assignedStatus ?? "",
                        item.status,
                        (item as MeterInventoryItem).meterClass ?? "",
                    ] as string[]).some((value) => value.toLowerCase().includes(term.toLowerCase()))
                    : ([
                        item.meterNumber,
                        (item as VirtualMeterData).customerId ?? "",
                        (item as VirtualMeterData).accountNumber ?? "",
                        (item as VirtualMeterData).tariff ?? "",
                        item.status,
                    ] as string[]).some((value) => value.toLowerCase().includes(term.toLowerCase()))
            );
        }

        // Apply sorting
        if (sortBy) {
            results = [...results].sort((a, b) => {
                let aValue: string | undefined;
                let bValue: string | undefined;

                if (activeTab === "actual") {
                    const meterA = a as MeterInventoryItem;
                    const meterB = b as MeterInventoryItem;
                    aValue = String(meterA[sortBy as keyof MeterInventoryItem] ?? "");
                    bValue = String(meterB[sortBy as keyof MeterInventoryItem] ?? "");
                } else {
                    const meterA = a as VirtualMeterData;
                    const meterB = b as VirtualMeterData;
                    aValue = String(meterA[sortBy as keyof VirtualMeterData] ?? "");
                    bValue = String(meterB[sortBy as keyof VirtualMeterData] ?? "");
                }

                if (aValue === undefined || bValue === undefined) {
                    return 0;
                }

                return direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            });
        }
        setProcessedData(results);
    };

    const toggleSelection = (id: string) => {
        setSelectedTariffs(
            selectedTariffs.includes(id)
                ? selectedTariffs.filter((selectedId) => selectedId !== id)
                : [...selectedTariffs, id]
        );
    };

    const toggleSelectAll = () => {
        const currentData = activeTab === "actual" ? (metersData?.actualMeters || []) : (metersData?.virtualMeters || []);
        if (selectedTariffs.length === currentData.length) {
            setSelectedTariffs([]);
        } else {
            setSelectedTariffs(currentData.map((item) => item.id || item.customerId) as string[]);
        }
    };

    const handleSaveMeter = (updatedMeter: MeterInventoryItem | VirtualMeterData) => {
        if (editMeter) {
            if (activeTab === "actual" && "manufactureName" in updatedMeter) {
                setData((prev) =>
                    prev.map((meter) => (meter.customerId === updatedMeter.customerId ? updatedMeter as MeterInventoryItem : meter))
                );
            } else if (activeTab === "virtual" && "customerId" in updatedMeter) {
                setVirtualData((prev) =>
                    prev.map((meter) => (meter.id === updatedMeter.customerId ? updatedMeter as VirtualMeterData : meter))
                );
            }
            setEditMeter(undefined);
        } else {
            if (activeTab === "actual" && "manufactureName" in updatedMeter) {
                setData((prev) => [...prev, updatedMeter as MeterInventoryItem]);
            } else if (activeTab === "virtual" && "customerId" in updatedMeter) {
                setVirtualData((prev) => [...prev, updatedMeter as VirtualMeterData]);
            }
        }
    };

    const handleSaveMeterForActual = (meter: MeterInventoryItem) => {
        handleSaveMeter(meter);
    };


    const handleActivate = () => {
        if (selectedMeter) {
            if (activeTab === "actual" && "manufactureName" in selectedMeter) {
                setData((prev) =>
                    prev.map((meter) =>
                        meter.customerId === selectedMeter.customerId
                            ? { ...meter, assignedStatus: "Active", reason: undefined }
                            : meter
                    )
                );
            } else if (activeTab === "virtual" && "customerId" in selectedMeter) {
                setVirtualData((prev) =>
                    prev.map((meter) =>
                        meter.id === selectedMeter.customerId ? { ...meter, status: "Assigned", reason: undefined } : meter
                    )
                );
            }
            setIsDeactivateDialogOpen(false);
            setSelectedMeter(null);
        }
    };

    const handleDeactivate = (reason?: string) => {
        if (selectedMeter) {
            if (activeTab === "actual" && "manufactureName" in selectedMeter) {
                setData((prev) =>
                    prev.map((meter) =>
                        meter.customerId === selectedMeter.customerId
                            ? { ...meter, assignedStatus: "Deactivated", reason }
                            : meter
                    )
                );
            } else if (activeTab === "virtual" && "customerId" in selectedMeter) {
                setVirtualData((prev) =>
                    prev.map((meter) =>
                        meter.id === selectedMeter.customerId ? { ...meter, status: "Deactivated", reason } : meter
                    )
                );
            }
            setIsDeactivateDialogOpen(false); // Close DeactivateDialog
            setSelectedMeter(null);
        }
    };


    const handleAssign = (data: {
        firstName: string;
        lastName: string;
        accountNumber: string;
        nin: string;
        phone: string;
        email: string;
        state: string;
        city: string;
        streetName: string;
        houseNo: string;
    }) => {
        if (selectedMeter) {
            if (activeTab === "actual" && "manufactureName" in selectedMeter) {
                setData((prev) =>
                    prev.map((meter) =>
                        meter.customerId === selectedMeter.customerId ? { ...meter, status: "Assigned", ...data } : meter
                    )
                );
            } else if (activeTab === "virtual" && "customerId" in selectedMeter) {
                setVirtualData((prev) =>
                    prev.map((meter) =>
                        meter.id === selectedMeter.customerId ? { ...meter, status: "Assigned", ...data } : meter
                    )
                );
            }
        }
    };


    const handleBulkUpload = (newData: (MeterInventoryItem | VirtualMeterData)[]) => {
        if (activeTab === "actual") {
            setData((prev) => [...prev, ...(newData.filter((item) => "manufactureName" in item) as MeterInventoryItem[])]);
        } else {
            setVirtualData((prev) => [...prev, ...(newData.filter((item) => "customerId" in item) as VirtualMeterData[])]);
        }
    };

    // MODIFIED: Handle saving edited virtual meter
    const handleSaveVirtualMeter = () => {
        if (editMeter && "customerId" in editMeter && typeof editMeter.customerId === "string") {
            const virtualMeter = editMeter as VirtualMeterData;
            const updatedMeter: VirtualMeterData = {
                id: virtualMeter.id,
                customerId: virtualMeter.customerId,
                meterNumber: virtualMeter.meterNumber ?? "",
                accountNumber,
                cin,
                tariff,
                feeder: virtualMeter.feeder ?? "",
                dss: virtualMeter.dss ?? "",
                status: virtualMeter.status ?? "Assigned",
                firstName: virtualMeter.firstName ?? "",
                lastName: virtualMeter.lastName ?? "",
                phone: phone ?? virtualMeter.phone ?? "",
                state,
                city,
                streetName,
                houseNo,
                image: virtualMeter.image ?? null,
                consumptionType: virtualMeter.consumptionType ?? "Non-MD",
                // Include optional fields if required by VirtualMeterData
                energyType: virtualMeter.energyType ?? "",
                fixedEnergy: virtualMeter.fixedEnergy ?? "",
            };
            setVirtualData((prev) =>
                prev.map((meter) => (meter.id === editMeter.customerId ? updatedMeter : meter))
            );
            setIsEditVirtualMeterOpen(false);
            setEditMeter(undefined);
            setSelectedMeter(null);
            // Reset form fields
            setAccountNumber("");
            setCin("");
            setTariff("");
            setPhone("");
            setState("");
            setCity("");
            setStreetName("");
            setHouseNo("");
        } else {
            console.error("Invalid editMeter: Must be VirtualMeterData with a valid customerId");
        }
    };

    const handleOpenAddVirtualMeter = () => {
        setCustomerIdInput("");
        setFilteredCustomerIds([]);
        setSelectedCustomer(null);
        setSelectedPhysicalMeter("");
        setIsAddVirtualMeterOpen(true);
    };

    // const handleCustomerIdChange = (value: string) => {
    //     setCustomerIdInput(value);
    //     if (value.trim() === "") {
    //         setFilteredCustomerIds([]);
    //     } else {
    //         const uniqueCustomerIds = Array.from(
    //             new Set(
    //                 virtualData
    //                     .filter((item) => item.customerId?.toLowerCase().includes(value.toLowerCase()))
    //                     .map((item) => item.customerId)
    //             )
    //         );
    //         setFilteredCustomerIds(uniqueCustomerIds.filter((id): id is string => id != null));
    //     }
    // };
    const handleCustomerSelect = (customerId: string) => {
        console.log("handleCustomerSelect called with customerId:", customerId);
        const currentData = metersData?.virtualMeters || [];
        const customer = currentData.find((c) => c.customerId === customerId);
        if (customer) {
            console.log("Found customer:", customer);
            setSelectedCustomer({
                id: "",
                customerId: customer.customerId,
                meterNumber: "",
                accountNumber: "",
                feeder: "",
                dss: "",
                cin: "",
                tariff: "",
                status: "Assigned",
                firstName: customer.firstName ?? "",
                lastName: customer.lastName ?? "",
                phone: customer.phone ?? "",
                state: customer.state ?? "",
                city: customer.city ?? "",
                streetName: customer.streetName ?? "",
                houseNo: customer.houseNo ?? "",
                category: customer.category ?? "", // Use category
            });
            setCustomerIdInput(customerId);
            setFilteredCustomerIds([]);
            setIsAddVirtualMeterOpen(false); // Close SelectCustomerDialog
            // Reset actual meter-specific states
            setIsCustomerIdModalOpen(false);
            setIsAssignModalOpen(false);
            setIsSetPaymentModalOpen(false);
            setIsDeactivateModalOpen(false);
            setIsConfirmationModalOpen(false);
            // Reset form fields
            setAccountNumber("");
            setCin("");
            setFeeder("");
            setDss("");
            setTariff("");
            setState("");
            setCity("");
            setStreetName("");
            setHouseNo("");
            setEnergyType("");
            setFixedEnergy("");
            setCategory("");
            setPhone("");
            console.log("AddVirtualMeterDetailsDialog should open with selectedCustomer:", {
                selectedCustomer: {
                    id: "",
                    customerId: customer.customerId,
                    meterNumber: "",
                    accountNumber: "",
                    feeder: "",
                    dss: "",
                    cin: "",
                    tariff: "",
                    status: "Assigned",
                    firstName: customer.firstName ?? "",
                    lastName: customer.lastName ?? "",
                    phone: customer.phone ?? "",
                    state: customer.state ?? "",
                    city: customer.city ?? "",
                    streetName: customer.streetName ?? "",
                    houseNo: customer.houseNo ?? "",
                    category: customer.category ?? "",
                },
                activeTab,
                isAddVirtualMeterOpen: false,
                isDeactivatePhysicalOpen,
                isVirtualConfirmOpen,
            });
        } else {
            console.log("Customer not found for ID:", customerId);
        }
    };
    const handleProceedToDeactivate = () => {
        setIsAddVirtualMeterOpen(false);
        setIsDeactivatePhysicalOpen(true)
        // setIsVirtualConfirmOpen(false)
    };

    const handleDeactivationComplete = () => {
        if (selectedPhysicalMeter) {
            console.log("Deactivating physical meter:", selectedPhysicalMeter);
            // Optionally update the physical meter status in data
            setData((prev) =>
                prev.map((meter) =>
                    meter.customerId === selectedPhysicalMeter ? { ...meter, status: "Deactivated" } : meter
                )
            );
        }
        setIsDeactivatePhysicalOpen(false); // Close DeactivatePhysicalMeterDialog
        setIsVirtualConfirmOpen(true); // Open VirtualMeterConfirmDialog
    };

    const handleConfirmVirtualMeter = () => {
        if (selectedCustomer) {
            const newVirtualMeter: VirtualMeterData = {
                id: `VM-${virtualData.length + 1000}`,
                customerId: selectedCustomer.customerId,
                meterNumber: `V-${Math.floor(100000000 + Math.random() * 900000000)}`,
                accountNumber,
                feeder: feeder,
                dss,
                cin,
                tariff,
                status: "Assigned",
                firstName: selectedCustomer.firstName ?? "",
                lastName: selectedCustomer.lastName ?? "",
                phone: selectedCustomer.phone ?? "",
                state: state ?? selectedCustomer.state,
                city: city ?? selectedCustomer.city,
                streetName: streetName ?? selectedCustomer.streetName,
                houseNo: houseNo ?? selectedCustomer.houseNo,
                category: category ?? "",
            };

            setVirtualData((prev) => [...prev, newVirtualMeter]);
            setIsVirtualConfirmOpen(false);
            setSelectedCustomer(null);
            setIsDeactivatePhysicalOpen(false);
            // Reset form fields
            setAccountNumber("");
            setCin("");
            setFeeder("");
            setDss("");
            setTariff("");
            setState("");
            setCity("");
            setStreetName("");
            setHouseNo("");
            setEnergyType("");
            setFixedEnergy("");
            setCategory("");
        }
    };

    const isFormComplete =
        meterNumber.trim() !== "" &&
        cin.trim() !== "" &&
        accountNumber.trim() !== "" &&
        tariff.trim() !== "" &&
        feeder.trim() !== "" &&
        dss.trim() !== "" &&
        state.trim() !== "" &&
        city.trim() !== "" &&
        streetName.trim() !== "" &&
        houseNo.trim() !== "" &&
        selectedCustomer?.phone?.trim() !== "";
    // category.trim() !== "";

    // Update useEffect for debugging
    useEffect(() => {
        console.log("Form State:", {
            isFormComplete,
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
            phone: selectedCustomer?.phone,
            // category,
        });
    }, [isFormComplete, meterNumber, cin, accountNumber, tariff, feeder, dss, state, city, streetName, houseNo, selectedCustomer]);

    const isVirtualFormComplete =
        cin.trim() !== "" &&
        accountNumber.trim() !== "" &&
        tariff.trim() !== "" &&
        feeder.trim() !== "" &&
        dss.trim() !== "" &&
        state.trim() !== "" &&
        city.trim() !== "" &&
        streetName.trim() !== "" &&
        houseNo.trim() !== "" &&
        customerTypes.length > 0 &&
        selectedCustomer?.phone?.trim() !== "";

    const totalPages = Math.ceil((activeTab === "actual" ? (metersData?.actualMeters?.length || 0) : (metersData?.virtualMeters?.length || 0)) / rowsPerPage);
    const paginatedData = processedData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const changeTab = (tab: "actual" | "virtual") => {
        setActiveTab(tab);
        setSelectedTariffs([]);
        setCurrentPage(1);
        setActiveFilters({}); // Reset filters when switching tabs
        setSelectedCustomer(null); // Reset selectedCustomer to avoid dialog conflicts
        setCustomerIdInput(""); // Reset customer ID input
        setFilteredCustomerIds([]); // Reset filtered customer IDs
        // Reset form fields to prevent stale data
        setAccountNumber("");
        setCin("");
        setFeeder("");
        setDss("");
        setTariff("");
        setState("");
        setCity("");
        setStreetName("");
        setHouseNo("");
        setEnergyType("");
        setFixedEnergy("");
        setCategory(""); // Reset customerType
        // Reset dialog states
        setIsCustomerIdModalOpen(false);
        setIsAssignModalOpen(false);
        setIsSetPaymentModalOpen(false);
        setIsDeactivateModalOpen(false);
        setIsConfirmationModalOpen(false);
        setIsAddVirtualMeterOpen(false);
        setIsDeactivatePhysicalOpen(false);
        setIsVirtualConfirmOpen(false);
        setSelectedPhysicalMeter("");
    };

    // const handleRowClick = (item: MeterData, event: React.MouseEvent<HTMLTableRowElement>) => {
    //     if ((event.target as HTMLElement).closest('input[type="checkbox"], button')) {
    //         return;
    //     }
    //     setViewMeter(item);
    //     setIsViewDetailsOpen(true);
    // };

    const handleRowsPerPageChange = (value: string) => {
        setRowsPerPage(Number(value));
        setCurrentPage(1);
    };


    const handlePrevious = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNext = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    return (
        <div className="p-6 h-screen overflow-x-hidden bg-transparent">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4 bg-transparent">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold">Meter Management</h1>
                </div>
                <div className="flex flex-col md:flex-row gap-2 bg-transparent">
                    <Button
                        className="flex items-center gap-2 border font-medium border-[#161CCA] text-[#161CCA] w-full md:w-auto cursor-pointer"
                        variant="outline"
                        size="lg"
                        onClick={() => setIsBulkUploadDialogOpen(true)}
                    >
                        <CirclePlus size={14} strokeWidth={2.3} className="h-4 w-4" />
                        <span className="text-sm md:text-base">Bulk Upload</span>
                    </Button>
                    {activeTab === "actual" && (
                        <Button
                            className="flex items-center gap-2 bg-[#161CCA] text-white font-medium w-full md:w-auto cursor-pointer"
                            variant="secondary"
                            size="lg"
                            onClick={handleOpenCustomerIdModal}
                        >
                            <CirclePlus size={14} strokeWidth={2.3} className="h-4 w-4" />
                            <span className="text-sm md:text-base">Assign Meter</span>
                        </Button>
                    )}
                    {activeTab === "virtual" && (
                        <Button
                            className="flex items-center gap-2 bg-[#161CCA] text-white font-medium w-full md:w-auto cursor-pointer"
                            variant="secondary"
                            size="lg"
                            onClick={handleOpenAddVirtualMeter}
                        >
                            <CirclePlus size={14} strokeWidth={2.3} className="h-4 w-4" />
                            <span className="text-sm md:text-base">Add Virtual Meter</span>
                        </Button>
                    )}
                </div>
            </div>

            <Card className="p-4 mb-4 border-none shadow-none bg-transparent">
                <Tabs value={activeTab} onValueChange={(v) => changeTab(v as "actual" | "virtual")}>
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <TabsList style={{ border: "2px solid #161CCA" }} className="h-12">
                            <TabsTrigger
                                value="actual"
                                className="data-[state=active]:bg-[#161CCA] cursor-pointer data-[state=active]:text-white p-4"
                            >
                                Actual Meters
                            </TabsTrigger>
                            <TabsTrigger
                                value="virtual"
                                className="data-[state=active]:bg-[#161CCA] cursor-pointer data-[state=active]:text-white p-4"
                            >
                                Virtual Meters
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex items-center gap-2 w-full lg:w-auto">
                            <SearchControl
                                onSearchChange={handleSearchChange}
                                value={searchTerm}
                                placeholder="Search by Meter Number, SIM Number, or Status"
                            />
                            <FilterControl
                                sections={activeTab === "actual" ? actualFilterSections : virtualFilterSections}
                                filterType={activeTab === "actual" ? "multi-section" : "status"}
                                onApply={(filters) => setActiveFilters(filters)}
                                onReset={() => setActiveFilters({})}
                            />
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
                    <TabsContent value="actual" className="overflow-x-hidden">
                        <Card className="border-none shadow-none bg-transparent overflow-x-auto min-h-[calc(100vh-300px)]">
                            <Table className="table-auto w-full bg-transparent">
                                <TableHeader className="bg-transparent">
                                    <TableRow>
                                        <TableHead className="px-4 py-3 w-[100px]">
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    className="h-4 w-4 border-gray-500"
                                                    checked={selectedTariffs.length === (metersData?.actualMeters?.length || 0) && (metersData?.actualMeters?.length || 0) > 0}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setSelectedTariffs((metersData?.actualMeters || []).map(item => item.id || item.customerId) as string[]);
                                                        } else {
                                                            setSelectedTariffs([]);
                                                        }
                                                    }}
                                                />
                                                <span className="text-sm font-medium text-gray-900">S/N</span>
                                            </div>
                                        </TableHead>
                                        <TableHead className="px-4 py-3 text-sm font-medium text-gray-900">Meter Number</TableHead>
                                        <TableHead className="px-4 py-3 text-sm font-medium text-gray-900">SIM Number</TableHead>
                                        <TableHead className="px-4 py-3 text-sm font-medium text-gray-900">Old SGC</TableHead>
                                        <TableHead className="px-4 py-3 text-sm font-medium text-gray-900">New SGC</TableHead>
                                        <TableHead className="px-4 py-3 text-sm font-medium text-gray-900">Manufacturer</TableHead>
                                        <TableHead className="px-4 py-3 text-sm font-medium text-gray-900">Class</TableHead>
                                        <TableHead className="px-4 py-3 text-sm font-medium text-gray-900">Category</TableHead>
                                        <TableHead className="px-4 py-3 text-sm font-medium text-gray-900 text-center">Meter Stage</TableHead>
                                        <TableHead className="px-4 py-3 text-sm font-medium text-gray-900 text-left">Activation Status</TableHead>
                                        <TableHead className="px-4 py-3 text-sm font-medium text-gray-900 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={11} className="h-24 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                                                    <span className="text-sm text-gray-500">Loading meters...</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : isError ? (
                                        <TableRow>
                                            <TableCell colSpan={11} className="h-24 text-center">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <div className="text-red-500">
                                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-sm text-gray-500">Failed to load meters</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (metersData?.actualMeters?.length || 0) === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={11} className="h-24 text-center">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <div className="text-gray-400">
                                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-sm text-gray-500">No meters available</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        paginatedData.map((item, index) =>
                                            "manufacturer" in item ? (
                                                <TableRow
                                                    key={item.id || item.customerId || `actual-${index}`}
                                                    className="hover:bg-gray-50 cursor-pointer"
                                                // onClick={(event) => handleRowClick(item, event)}
                                                >
                                                    <TableCell className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <Checkbox
                                                                className="h-4 w-4 border-gray-500"
                                                                id={`select-${item.customerId}`}
                                                                checked={selectedTariffs.includes(item.id || item.customerId || "")}
                                                                onCheckedChange={() => toggleSelection(item.id || item.customerId || "")}
                                                            />
                                                            <span className="text-sm text-gray-900">
                                                                {index + 1 + (currentPage - 1) * rowsPerPage}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.meterNumber}</TableCell>
                                                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.simNumber}</TableCell>
                                                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.oldSgc}</TableCell>
                                                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.newSgc}</TableCell>
                                                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.manufacturer?.name}</TableCell>
                                                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.meterClass}</TableCell>
                                                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.meterCategory}</TableCell>
                                                    <TableCell className="px-4 py-3 text-center">
                                                        <span className={cn("inline-block text-sm font-medium", getStatusStyle(item.meterStage))}>
                                                            {item.meterStage}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3">
                                                        <span className={cn("inline-block text-sm font-medium", getStatusStyle(item.status))}>
                                                            {item.status}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3 text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 cursor-pointer">
                                                                    <MoreVertical size={14} className="text-gray-500" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-fit bg-white shadow-lg">
                                                                <DropdownMenuItem
                                                                    className="flex items-center gap-2 cursor-pointer"
                                                                    onClick={(event) => {
                                                                        event.stopPropagation();
                                                                        setViewMeter(item as MeterInventoryItem);
                                                                        setIsViewActualDetailsOpen(true); // Updated to use actual-specific state
                                                                    }}
                                                                >
                                                                    <Eye size={14} />
                                                                    <span className="text-sm text-gray-700">View Details</span>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    className="flex items-center gap-2 cursor-pointer"
                                                                    onClick={(event) => {
                                                                        event.stopPropagation();
                                                                        setSelectedMeter(item);
                                                                        setEditMeter(item);
                                                                        setIsAddDialogOpen(true);
                                                                    }}
                                                                >
                                                                    <Pencil size={14} />
                                                                    <span className="text-sm text-gray-700">Edit Meter</span>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    className="flex items-center gap-2 cursor-pointer"
                                                                    onClick={(event) => {
                                                                        event.stopPropagation();
                                                                        console.log("Selected Meter for Actual:", item);
                                                                        setSelectedMeter(item);
                                                                        setIsDeactivateDialogOpen(true);
                                                                    }}
                                                                >
                                                                    {item.assignedStatus === "Deactivated" ? (
                                                                        <>
                                                                            <CheckCircle size={14} />
                                                                            <span className="text-sm text-gray-700">Activate</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Ban size={14} />
                                                                            <span className="text-sm text-gray-700">Deactivate</span>
                                                                        </>
                                                                    )}
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ) : null
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </Card>
                    </TabsContent>
                    <TabsContent value="virtual">
                        <Card className="border-none shadow-none bg-transparent min-h-[calc(100vh-300px)]">
                            <div className="overflow-x-auto">
                                <Table className="w-full table-auto">
                                    <TableHeader className="bg-transparent">
                                        <TableRow className="bg-transparent hover:bg-gray-50">
                                            <TableHead className="w-20 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        className="h-4 w-4 border-gray-500"
                                                        id="select-all-virtual"
                                                        checked={(metersData?.virtualMeters?.length || 0) > 0 && selectedTariffs.length === (metersData?.virtualMeters?.length || 0)}
                                                        onCheckedChange={toggleSelectAll}
                                                    />
                                                    <Label htmlFor="select-all-virtual" className="text-sm font-semibold text-gray-700">
                                                        S/N
                                                    </Label>
                                                </div>
                                            </TableHead>
                                            <TableHead className="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-normal">
                                                Customer ID
                                            </TableHead>
                                            <TableHead className="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-normal">
                                                Meter Number
                                            </TableHead>
                                            <TableHead className="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-normal">
                                                Account Number
                                            </TableHead>
                                            <TableHead className="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-normal">
                                                Feeder
                                            </TableHead>
                                            <TableHead className="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-normal">
                                                DSS
                                            </TableHead>
                                            <TableHead className="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-normal">
                                                CIN
                                            </TableHead>
                                            <TableHead className="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-normal">
                                                Tariff
                                            </TableHead>
                                            <TableHead className="px-4 py-3 text-center text-sm font-semibold text-gray-700 whitespace-normal">
                                                Status
                                            </TableHead>
                                            <TableHead className="w-20 px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isLoading ? (
                                            <TableRow>
                                                <TableCell colSpan={10} className="h-24 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                                                        <span className="text-sm text-gray-500">Loading virtual meters...</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : isError ? (
                                            <TableRow>
                                                <TableCell colSpan={10} className="h-24 text-center">
                                                    <div className="flex flex-col items-center justify-center gap-2">
                                                        <div className="text-red-500">
                                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-sm text-gray-500">Failed to load virtual meters</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (metersData?.virtualMeters?.length || 0) === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={10} className="h-24 text-center">
                                                    <div className="flex flex-col items-center justify-center gap-2">
                                                        <div className="text-gray-400">
                                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-sm text-gray-500">No virtual meters available</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            paginatedData.map((item, index) =>
                                                "customerId" in item ? (
                                                    <TableRow key={item.id || item.customerId || `virtual-${index}`} className="hover:bg-gray-50">
                                                        <TableCell className="px-4 py-3">
                                                            <div className="flex items-center gap-2">
                                                                <Checkbox
                                                                    className="h-4 w-4 border-gray-500"
                                                                    id={`select-${item.customerId}`}
                                                                    checked={selectedTariffs.includes(item.id || item.customerId || "")}
                                                                    onCheckedChange={() => toggleSelection(item.id || item.customerId || "")}
                                                                />
                                                                <span className="text-sm text-gray-900">
                                                                    {index + 1 + (currentPage - 1) * rowsPerPage}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="px-4 py-3 text-sm text-gray-900 break-words">
                                                            {item.customerId}
                                                        </TableCell>
                                                        <TableCell className="px-4 py-3 text-sm text-gray-900 break-words">
                                                            {item.meterNumber}
                                                        </TableCell>
                                                        <TableCell className="px-4 py-3 text-sm text-gray-900 break-words">
                                                            {item.accountNumber}
                                                        </TableCell>
                                                        <TableCell className="px-4 py-3 text-sm text-gray-900 break-words">
                                                            {/* {item.feeder} */}
                                                        </TableCell>
                                                        <TableCell className="px-4 py-3 text-sm text-gray-900 break-words">
                                                            {item.dss}
                                                        </TableCell>
                                                        <TableCell className="px-4 py-3 text-sm text-gray-900 break-words">
                                                            {item.cin}
                                                        </TableCell>
                                                        <TableCell className="px-4 py-3 text-sm text-gray-900 break-words">
                                                            {item.tariff}
                                                        </TableCell>
                                                        <TableCell className="px-4 py-3 text-center">
                                                            <span className={cn("inline-block text-sm font-medium", getStatusStyle(item.status))}>
                                                                {item.status}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="px-4 py-3 text-right">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 cursor-pointer">
                                                                        <MoreVertical size={14} className="text-gray-500" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="w-fit bg-white shadow-lg">
                                                                    <DropdownMenuItem
                                                                        className="flex items-center gap-2 cursor-pointer"
                                                                        onClick={(event) => {
                                                                            event.stopPropagation();
                                                                            setViewVirtualMeter(item as VirtualMeterData);
                                                                            setIsViewVirtualDetailsOpen(true); // Updated to use virtual-specific state
                                                                        }}
                                                                    >
                                                                        <Eye size={14} />
                                                                        <span className="text-sm text-gray-700">View Details</span>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        className="flex items-center gap-2 cursor-pointer"
                                                                        onClick={(event) => {
                                                                            event.stopPropagation();
                                                                            setSelectedMeter(item);
                                                                            setEditMeter(item);
                                                                            setIsEditVirtualMeterOpen(true);
                                                                        }}
                                                                    >
                                                                        <Pencil size={14} />
                                                                        <span className="text-sm text-gray-700">Edit Meter</span>
                                                                    </DropdownMenuItem>

                                                                    <DropdownMenuItem
                                                                        className="flex items-center gap-2 cursor-pointer"
                                                                        onClick={(event) => {
                                                                            event.stopPropagation();
                                                                            setSelectedMeter(item);
                                                                            setIsDeactivateDialogOpen(true);
                                                                        }}
                                                                    >
                                                                        {item.status === "Deactivated" ? (
                                                                            <>
                                                                                <CheckCircle size={14} />
                                                                                <span className="text-sm text-gray-700">Activate</span>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <Ban size={14} />
                                                                                <span className="text-sm text-gray-700">Deactivate</span>
                                                                            </>
                                                                        )}
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                ) : null
                                            )
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>
            </Card>
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
                            aria-disabled={currentPage === totalPages}
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
                onProceed={handleProceedFromCustomerIdDialog}
                isLoading={isCustomerRecordLoading}
            />
            <AssignMeterDialog
                isOpen={isAssignModalOpen}
                onOpenChange={setIsAssignModalOpen}
                customer={selectedCustomer}
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
                isFormComplete={!!isFormComplete}
                progress={progress}
                phone={phone}
                setPhone={setPhone}
                onConfirmAssignment={handleConfirmAssignment}
            />

            <BulkUploadDialog<MeterInventoryItem >
                isOpen={isBulkUploadDialogOpen}
                onClose={() => setIsBulkUploadDialogOpen(false)}
                onSave={handleBulkUpload}
                title="Bulk Upload Meters"
                requiredColumns={[
                    "id",
                    "meterNumber",
                    "simNumber",
                    "class",
                    "meterType",
                    "oldTariffIndex",
                    "newTariffIndex",
                    "manufactureName",
                    "accountNumber",
                    "oldSgc",
                    "oldKrn",
                    "newKrn",
                    "newSgc",
                    "tariff",
                    "approvalStatus",
                    "status",
                ]}
                templateUrl="/templates/meter-template.xlsx"
            />
            <ViewMeterDetailsDialog
                isOpen={isViewActualDetailsOpen}
                onClose={() => {
                    setIsViewActualDetailsOpen(false);
                    setViewMeter(null);
                }}
                meter={viewMeter}
            />
            <ViewVirtualMeterDetailsDialog
                isOpen={isViewVirtualDetailsOpen}
                onClose={() => {
                    setIsViewVirtualDetailsOpen(false);
                    setViewVirtualMeter(null);
                }}
                meter={viewVirtualMeter}
            />
            <ConfirmationModalDialog
                isOpen={isConfirmationModalOpen}
                onOpenChange={setIsConfirmationModalOpen}
                selectedCustomer={selectedCustomer}
                onConfirm={handleConfirmAssignment}
                onCancel={handleCancelConfirmation}
                isSubmitting={false}
            />
        </div>
    );
}
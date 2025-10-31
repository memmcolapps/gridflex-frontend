/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { CirclePlus, SquareArrowOutUpRight, MoreVertical, Ban, Pencil, CheckCircle, Eye } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BulkUploadDialog } from "@/components/meter-management/bulk-upload";
import { FilterControl, SearchControl } from "@/components/search-control";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ViewMeterDetailsDialog } from "@/components/meter-management/view-meters-details-dialog";
import { ViewVirtualMeterDetailsDialog } from "@/components/meter-management/view-virtual-details-dialog";
import { AssignMeterDialog } from "@/components/meter-management/assign-meter-dialog";
import { DeactivateDialog } from "@/components/meter-management/meter-dialogs";
import CustomerIdDialog from "@/components/meter-management/customer-id-dialog";
import SelectCustomerDialog from "@/components/meter-management/select-customer-dialog";
import AddVirtualMeterDetailsDialog from "@/components/meter-management/add-virtual-meter-dialog";
import { ConfirmationModalDialog } from "@/components/meter-management/confirmation-modal-dialog";
import { AddMeterDialog } from "@/components/meter-management/add-edit-meter-dialog";
import DeactivatePhysicalMeterDialog from "@/components/meter-management/deactivate-physical-meter-dialog";
import VirtualMeterConfirmDialog from "@/components/meter-management/virtual-meter-confirm-dialog";
import type { VirtualMeterData } from "@/types/meter";
import type { MeterInventoryItem } from "@/types/meter-inventory";
import { getStatusStyle } from "@/components/status-style";
import { cn } from "@/lib/utils";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { useMeters, useAssignMeter, useChangeMeterState } from "@/hooks/use-assign-meter";
import { useCustomerRecordQuery } from "@/hooks/use-customer";
import type { AssignMeterPayload } from "@/service/assign-meter-service";

export default function MeterManagementPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTariffs, setSelectedTariffs] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isAddMeterDialogOpen, setIsAddMeterDialogOpen] = useState(false);
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
    const [isAddVirtualMeterOpen, setIsAddVirtualMeterOpen] = useState(false);
    const [isDeactivatePhysicalOpen, setIsDeactivatePhysicalOpen] = useState(false);
    const [isVirtualConfirmOpen, setIsVirtualConfirmOpen] = useState(false);
    const [selectedPhysicalMeter, setSelectedPhysicalMeter] = useState("");
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
    const [virtualData, setVirtualData] = useState<VirtualMeterData[]>([]);
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
    const [phone, setPhone] = useState("");
    const [isUploadImageOpen, setIsUploadImageOpen] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [viewVirtualMeter, setViewVirtualMeter] = useState<VirtualMeterData | null>(null);
    const [isViewActualDetailsOpen, setIsViewActualDetailsOpen] = useState(false);
    const [isViewVirtualDetailsOpen, setIsViewVirtualDetailsOpen] = useState(false);
    const [isSelectVirtualCustomerOpen, setIsSelectVirtualCustomerOpen] = useState(false);
    const [virtualCustomerIdInput, setVirtualCustomerIdInput] = useState("");
    const [filteredVirtualCustomerIds, setFilteredVirtualCustomerIds] = useState<string[]>([]);
    const [selectedVirtualCustomer, setSelectedVirtualCustomer] = useState<VirtualMeterData | null>(null);

    const { data: metersData, isLoading, isError } = useMeters({
        page: currentPage,
        pageSize: rowsPerPage,
        searchTerm,
        sortDirection: sortConfig.direction,
        type: activeTab === "actual" ? "allocated" : "virtual",
    });


    const { data: customerRecordData, isLoading: isCustomerRecordLoading } = useCustomerRecordQuery(customerIdInput);
    const { data: virtualCustomerRecordData, isLoading: isVirtualCustomerRecordLoading } = useCustomerRecordQuery(virtualCustomerIdInput);

    const assignMeterMutation = useAssignMeter();
    const changeStateMutation = useChangeMeterState();

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
            const currentData = activeTab === "actual" ? (metersData?.actualMeters ?? []) : (metersData?.virtualMeters ?? []);
            const filtered = Array.from(
                new Set(
                    currentData
                        .filter((customer) => customer.customerId?.toLowerCase().includes(value.toLowerCase()))
                        .map((customer) => customer.customerId)
                        .filter((id): id is string => id != null)
                )
            ) as string[];
            setFilteredCustomerIds(filtered);
        }
    };

    const handleCustomerIdSelect = (customerId: string) => {
        const currentData = activeTab === "actual" ? (metersData?.actualMeters ?? []) : (metersData?.virtualMeters ?? []);
        const customer = currentData.find((item) => item.customerId === customerId);
        if (customer?.customerId) {
            setSelectedCustomer({
                id: customer.customerId,
                customerId: customer.customerId,
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
                consumptionType: "Non-MD",
                category: customer.category ?? "",
            });
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
        }
    };

    const handleProceedFromAssign = () => {
        if (!selectedCustomer?.customerId) return;

        const assignPayload = {
            meterNumber,
            customerId: selectedCustomer.customerId,
            tariffId: tariff,
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

        assignMeterMutation.mutate(assignPayload, {
            onSuccess: () => {
                setIsAssignModalOpen(false);
                setIsUploadImageOpen(true);
                setProgress(60);
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
        });
    };

    const handleProceedFromCustomerIdDialog = () => {
        if (!customerIdInput.trim()) return;

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
                state: "",
                city: "",
                streetName: "",
                houseNo: "",
                status: "Assigned",
                firstName: customer.firstname || "",
                lastName: customer.lastname || "",
                phone: customer.phoneNumber || "",
                image: null,
                consumptionType: "Non-MD",
                category: "",
            });
            setCustomerIdInput(customer.customerId);
            setFilteredCustomerIds([]);
            setIsCustomerIdModalOpen(false);
            setIsAssignModalOpen(true);
            setProgress(50);
            setMeterNumber("");
            setCin("");
            setAccountNumber(customerRecordData.GeneratedAccountNumber || "");
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
            setCategory("");
        }
    };

    const handleProceedFromUploadImage = (image: File | null) => {
        setUploadedImage(image);
        setSelectedCustomer((prev) => (prev ? { ...prev, image } : prev));
        setIsUploadImageOpen(false);
        setIsDeactivateModalOpen(true);
        setProgress(80);
    };


    const isPaymentFormComplete = debitMop !== "" && creditMop !== "";

    const handleProceedFromSetPayment = () => {
        setIsSetPaymentModalOpen(false);
        if (selectedCustomer?.category === "Prepaid") {
            setIsDeactivateModalOpen(true);
            setProgress(90);
        } else {
            setIsConfirmationModalOpen(true);
            setProgress(100);
        }
    };

    const handleProceedFromDeactivateVirtual = () => {
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
        if (editMeter && "customerId" in editMeter) {
            setMeterData((prev) =>
                prev.map((item) =>
                    item.customerId === editMeter.customerId
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
        }
        setIsSetPaymentModalOpen(false);
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

    const nigerianStates = [
        "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa",
        "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo",
        "Ekiti", "Enugu", "FCT", "Gombe", "Imo", "Jigawa",
        "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
        "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
        "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
    ];

    const customerTypes = ["Non-MD", "MD"];

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
        const actualMeters = metersData?.actualMeters ?? [];
        const virtualMeters = metersData?.virtualMeters ?? [];
        setProcessedData(activeTab === "actual" ? actualMeters : virtualMeters);
    }, [metersData, activeTab]);

    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
        applyFiltersAndSort(term, sortConfig.key, sortConfig.direction);
    };

    const handleSortChange = () => {
        const sortKey: keyof MeterInventoryItem | keyof VirtualMeterData = sortConfig.key ?? (activeTab === "actual" ? "meterNumber" : "meterNumber");
        const newDirection: "asc" | "desc" = sortConfig.direction === "asc" ? "desc" : "asc";
        setSortConfig({ key: sortKey, direction: newDirection });
        applyFiltersAndSort(searchTerm, sortKey, newDirection);
    };

    const applyFiltersAndSort = (
        term: string,
        sortBy: keyof MeterInventoryItem | keyof VirtualMeterData | null,
        direction: "asc" | "desc"
    ) => {
        let results: (MeterInventoryItem | VirtualMeterData)[] = activeTab === "actual" ? (metersData?.actualMeters ?? []) : (metersData?.virtualMeters ?? []);

        if (Object.keys(activeFilters).length > 0) {
            results = results.filter((item) => {
                if (activeTab === "actual") {
                    const meter = item as MeterInventoryItem;
                    const statusFilters = [
                        { id: "assigned", value: activeFilters.assigned, status: "Assigned" },
                        { id: "deactivated", value: activeFilters.deactivated, status: "Unassigned" },
                    ];
                    const statusMatch =
                        statusFilters.every((f) => !f.value) ||
                        statusFilters.some((filter) => filter.value && meter.status === filter.status);

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
        const currentData = activeTab === "actual" ? (metersData?.actualMeters ?? []) : (metersData?.virtualMeters ?? []);
        if (selectedTariffs.length === currentData.length) {
            setSelectedTariffs([]);
        } else {
            setSelectedTariffs(currentData.map((item) => item.id ?? item.customerId) as string[]);
        }
    };

    const handleSaveMeter = (updatedMeter: MeterInventoryItem | VirtualMeterData) => {
        if (editMeter) {
            if (activeTab === "actual" && "manufacturer" in updatedMeter) {
                setMeterData((prev) =>
                    prev.map((meter) => (meter.customerId === updatedMeter.customerId ? updatedMeter as MeterInventoryItem : meter))
                );
            } else if (activeTab === "virtual" && "customerId" in updatedMeter) {
                setVirtualData((prev) =>
                    prev.map((meter) => (meter.id === updatedMeter.customerId ? updatedMeter as VirtualMeterData : meter))
                );
            }
            setEditMeter(undefined);
        } else {
            if (activeTab === "actual" && "manufacturer" in updatedMeter) {
                setMeterData((prev) => [...prev, updatedMeter as MeterInventoryItem]);
            } else if (activeTab === "virtual" && "customerId" in updatedMeter) {
                setVirtualData((prev) => [...prev, updatedMeter as VirtualMeterData]);
            }
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
            if (activeTab === "actual" && "manufacturer" in selectedMeter) {
                setMeterData((prev) =>
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

    const handleBulkUpload = (data: File | (MeterInventoryItem | VirtualMeterData)[]) => {
        if (data instanceof File) {
            // Handle raw file if sendRawFile is true, but currently it's false
            console.warn("Raw file received, but not handled");
        } else {
            if (activeTab === "actual") {
                setMeterData((prev) => [...prev, ...(data.filter((item) => "manufacturer" in item) as MeterInventoryItem[])]);
            } else {
                setVirtualData((prev) => [...prev, ...(data.filter((item) => "customerId" in item) as VirtualMeterData[])]);
            }
        }
    };

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
                energyType: virtualMeter.energyType ?? "",
                fixedEnergy: virtualMeter.fixedEnergy ?? "",
            };
            setVirtualData((prev) =>
                prev.map((meter) => (meter.id === editMeter.customerId ? updatedMeter : meter))
            );
            setIsEditVirtualMeterOpen(false);
            setEditMeter(undefined);
            setSelectedMeter(null);
            setAccountNumber("");
            setCin("");
            setTariff("");
            setPhone("");
            setState("");
            setCity("");
            setStreetName("");
            setHouseNo("");
        }
    };

    const handleOpenAddVirtualMeter = () => {
        setVirtualCustomerIdInput("");
        setFilteredVirtualCustomerIds([]);
        setSelectedVirtualCustomer(null);
        setSelectedPhysicalMeter("");
        setIsSelectVirtualCustomerOpen(true);
    };

    const handleVirtualCustomerIdChange = (value: string) => {
        setVirtualCustomerIdInput(value);
        if (value.trim() === "") {
            setFilteredVirtualCustomerIds([]);
        } else {
            const currentData = metersData?.virtualMeters ?? [];
            const filtered = Array.from(
                new Set(
                    currentData
                        .filter((customer) => customer.customerId?.toLowerCase().includes(value.toLowerCase()))
                        .map((customer) => customer.customerId)
                        .filter((id): id is string => id != null)
                )
            ) as string[];
            setFilteredVirtualCustomerIds(filtered);
        }
    };

    const handleVirtualCustomerIdSelect = (customerId: string) => {
        const currentData = metersData?.virtualMeters ?? [];
        const customer = currentData.find((item) => item.customerId === customerId);
        if (customer?.customerId) {
            setSelectedVirtualCustomer({
                id: customer.customerId,
                customerId: customer.customerId,
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
                consumptionType: "Non-MD",
                category: customer.category ?? "",
            });
            setVirtualCustomerIdInput(customerId);
            setFilteredVirtualCustomerIds([]);
            setIsSelectVirtualCustomerOpen(false);
            setIsAddVirtualMeterOpen(true);
            setProgress(50);
            setAccountNumber("");
            setCin("");
            setTariff("");
            setFeeder("");
            setDss("");
            setState("");
            setCity("");
            setStreetName("");
            setHouseNo("");
            setEnergyType("");
            setFixedEnergy("");
            setCategory(customer.category ?? "");
        }
    };

    const handleProceedFromVirtualCustomerIdDialog = () => {
        if (!virtualCustomerIdInput.trim()) return;

        if (virtualCustomerRecordData) {
            const customer = virtualCustomerRecordData.customer;
            setSelectedVirtualCustomer({
                id: customer.customerId,
                customerId: customer.customerId,
                meterNumber: "",
                cin: virtualCustomerRecordData.GeneratedVirtualMeterNo || "",
                accountNumber: virtualCustomerRecordData.GeneratedAccountNumber || "",
                tariff: "",
                feeder: "",
                dss: "",
                state: "",
                city: "",
                streetName: "",
                houseNo: "",
                status: "Assigned",
                firstName: customer.firstname || "",
                lastName: customer.lastname || "",
                phone: customer.phoneNumber || "",
                image: null,
                consumptionType: "Non-MD",
                category: "",
            });
            setVirtualCustomerIdInput(customer.customerId);
            setFilteredVirtualCustomerIds([]);
            setIsSelectVirtualCustomerOpen(false);
            setIsAddVirtualMeterOpen(true);
            setProgress(50);
            setAccountNumber(virtualCustomerRecordData.GeneratedAccountNumber || "");
            setCin("");
            setTariff("");
            setFeeder("");
            setDss("");
            setState("");
            setCity("");
            setStreetName("");
            setHouseNo("");
            setEnergyType("");
            setFixedEnergy("");
            setCategory("");
        }
    };

    const handleCustomerSelect = (customerId: string) => {
        const currentData = metersData?.virtualMeters ?? [];
        const customer = currentData.find((c) => c.customerId === customerId);
        if (customer?.customerId) {
            setSelectedCustomer({
                id: customer.customerId,
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
                state: "",
                city: "",
                streetName: "",
                houseNo: "",
                category: customer.category ?? "",
            });
            setCustomerIdInput(customerId);
            setFilteredCustomerIds([]);
            setIsAddVirtualMeterOpen(false);
            setIsCustomerIdModalOpen(false);
            setIsAssignModalOpen(false);
            setIsSetPaymentModalOpen(false);
            setIsDeactivateModalOpen(false);
            setIsConfirmationModalOpen(false);
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
        }
    };

    const handleProceedToDeactivate = () => {
        setIsAddVirtualMeterOpen(false);
        setIsDeactivatePhysicalOpen(true);
    };

    const handleDeactivationComplete = () => {
        if (selectedPhysicalMeter) {
            setMeterData((prev) =>
                prev.map((meter) =>
                    meter.customerId === selectedPhysicalMeter ? { ...meter, status: "Deactivated" } : meter
                )
            );
        }
        setIsDeactivatePhysicalOpen(false);
        setIsVirtualConfirmOpen(true);
    };

    const handleConfirmVirtualMeter = () => {
        if (selectedVirtualCustomer) {
            // Close the current dialog and open deactivate physical meter dialog
            setIsAddVirtualMeterOpen(false);
            setIsDeactivatePhysicalOpen(true);
        }
    };

    const handleConfirmVirtualMeterCreation = () => {
        if (selectedVirtualCustomer) {
            // Use the GeneratedVirtualMeterNo from customer record as meterNumber
            const meterNumber = virtualCustomerRecordData?.GeneratedVirtualMeterNo ?? "";

            const virtualMeterPayload: AssignMeterPayload = {
                meterNumber,
                customerId: selectedVirtualCustomer.customerId,
                tariffId: tariff,
                dssAssetId: dss,
                feederAssetId: feeder,
                cin,
                accountNumber,
                state,
                city,
                houseNo,
                streetName,
                creditPaymentMode: "",
                debitPaymentMode: "",
                creditPaymentPlan: "",
                debitPaymentPlan: "",
                meterClass: category,
            };

            assignMeterMutation.mutate(virtualMeterPayload, {
                onSuccess: () => {
                    setIsVirtualConfirmOpen(false);
                    setSelectedVirtualCustomer(null);
                    // Reset all form fields
                    setAccountNumber("");
                    setCin("");
                    setTariff("");
                    setFeeder("");
                    setDss("");
                    setState("");
                    setCity("");
                    setStreetName("");
                    setHouseNo("");
                    setEnergyType("");
                    setFixedEnergy("");
                    setCategory("");
                },
            });
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

    const totalPages = Math.ceil((activeTab === "actual" ? (metersData?.actualMeters?.length ?? 0) : (metersData?.virtualMeters?.length ?? 0)) / rowsPerPage);
    const paginatedData = processedData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const changeTab = (value: string) => {
        const tab = value as "actual" | "virtual";
        setActiveTab(tab);
        setSelectedTariffs([]);
        setCurrentPage(1);
        setActiveFilters({});
        setSelectedCustomer(null);
        setCustomerIdInput("");
        setFilteredCustomerIds([]);
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
        setIsCustomerIdModalOpen(false);
        setIsAssignModalOpen(false);
        setIsSetPaymentModalOpen(false);
        setIsDeactivateModalOpen(false);
        setIsConfirmationModalOpen(false);
        setIsAddVirtualMeterOpen(false);
        setIsDeactivatePhysicalOpen(false);
        setIsVirtualConfirmOpen(false);
        setSelectedPhysicalMeter("");
        setIsAddMeterDialogOpen(false);
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setRowsPerPage(newPageSize);
        setCurrentPage(1);
    };

    // Helper function to check if meter is in pending state
    const isPendingState = (status: string) => {
        return [
            "pending-activated",
            "pending-deactivated",
            "pending-assign",
        ].includes(status.toLowerCase());
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
                <Tabs value={activeTab} onValueChange={changeTab}>
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
                                                    checked={selectedTariffs.length === (metersData?.actualMeters?.length ?? 0) && (metersData?.actualMeters?.length ?? 0) > 0}
                                                    onCheckedChange={toggleSelectAll}
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
                                        <TableHead className="px-4 py-3 text-sm font-medium text-gray-900 text-center">Activation Status</TableHead>
                                        <TableHead className="px-4 py-3 text-sm font-medium text-gray-900 text-left">Meter Stage</TableHead>
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
                                    ) : (metersData?.actualMeters?.length ?? 0) === 0 ? (
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
                                                    key={item.id ?? item.customerId ?? `actual-${index}`}
                                                    className={cn(
                                                        "hover:bg-gray-50 cursor-pointer",
                                                        isPendingState(item.assignedStatus ?? item.status ?? "") ? "bg-gray-100 opacity-50" : ""
                                                    )}
                                                >
                                                    <TableCell className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <Checkbox
                                                                className="h-4 w-4 border-gray-500"
                                                                id={`select-${item.customerId}`}
                                                                checked={selectedTariffs.includes(item.id ?? item.customerId ?? "")}
                                                                onCheckedChange={() => toggleSelection(item.id ?? item.customerId ?? "")}
                                                                disabled={isPendingState(item.assignedStatus ?? item.status ?? "")}
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
                                                        <span className={cn("inline-block text-sm font-medium", getStatusStyle(item.status))}>
                                                            {item.status}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3">
                                                        <span className={cn("inline-block text-sm font-medium", getStatusStyle(item.meterStage))}>
                                                            {item.meterStage}
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
                                                                {isPendingState(item.assignedStatus ?? item.status ?? "") ? (
                                                                    <DropdownMenuItem disabled className="flex items-center gap-2">
                                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                                                                        <span className="text-sm text-gray-500">Waiting for Approval</span>
                                                                    </DropdownMenuItem>
                                                                ) : (
                                                                    <>
                                                                        <DropdownMenuItem
                                                                            className="flex items-center gap-2 cursor-pointer"
                                                                            onClick={(event) => {
                                                                                event.stopPropagation();
                                                                                setViewMeter(item as MeterInventoryItem);
                                                                                setIsViewActualDetailsOpen(true);
                                                                            }}
                                                                        >
                                                                            <Eye size={14} />
                                                                            <span className="text-sm text-gray-700">View Details</span>
                                                                        </DropdownMenuItem>
                                                                        {item.status !== "Unassigned" && (
                                                                            <DropdownMenuItem
                                                                                className="flex items-center gap-2 cursor-pointer"
                                                                                onClick={(event) => {
                                                                                    event.stopPropagation();
                                                                                    setSelectedMeter(item);
                                                                                    setEditMeter(item as MeterInventoryItem);
                                                                                    setIsAddMeterDialogOpen(true);
                                                                                }}
                                                                            >
                                                                                <Pencil size={14} />
                                                                                <span className="text-sm text-gray-700">Edit Meter</span>
                                                                            </DropdownMenuItem>
                                                                        )}
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
                                                                    </>
                                                                )}
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
                                                        checked={(metersData?.virtualMeters?.length ?? 0) > 0 && selectedTariffs.length === (metersData?.virtualMeters?.length ?? 0)}
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
                                                Category
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
                                        ) : (metersData?.virtualMeters?.length ?? 0) === 0 ? (
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
                                                    <TableRow
                                                        key={item.id ?? item.customerId ?? `virtual-${index}`}
                                                        className={cn(
                                                            "hover:bg-gray-50",
                                                            isPendingState(item.status ?? "") ? "bg-gray-100 opacity-50" : ""
                                                        )}
                                                    >
                                                        <TableCell className="px-4 py-3">
                                                            <div className="flex items-center gap-2">
                                                                <Checkbox
                                                                    className="h-4 w-4 border-gray-500"
                                                                    id={`select-${item.customerId}`}
                                                                    checked={selectedTariffs.includes(item.id ?? item.customerId ?? "")}
                                                                    onCheckedChange={() => toggleSelection(item.id ?? item.customerId ?? "")}
                                                                    disabled={isPendingState(item.status ?? "")}
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
                                                            {item.meterCategory}
                                                        </TableCell>
                                                        <TableCell className="px-4 py-3 text-sm text-gray-900 break-words">
                                                            {item.dssInfo?.name ?? item.dss}
                                                        </TableCell>
                                                        <TableCell className="px-4 py-3 text-sm text-gray-900 break-words">
                                                            {item.cin}
                                                        </TableCell>
                                                        <TableCell className="px-4 py-3 text-sm text-gray-900 break-words">
                                                            {(item as any).tariffInfo?.name ?? item.tariff}
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
                                                                    {isPendingState(item.status ?? "") ? (
                                                                        <DropdownMenuItem disabled className="flex items-center gap-2">
                                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                                                                            <span className="text-sm text-gray-500">Waiting for Approval</span>
                                                                        </DropdownMenuItem>
                                                                    ) : (
                                                                        <>
                                                                            <DropdownMenuItem
                                                                                className="flex items-center gap-2 cursor-pointer"
                                                                                onClick={(event) => {
                                                                                    event.stopPropagation();
                                                                                    setViewVirtualMeter(item as VirtualMeterData);
                                                                                    setIsViewVirtualDetailsOpen(true);
                                                                                }}
                                                                            >
                                                                                <Eye size={14} />
                                                                                <span className="text-sm text-gray-700">View Details</span>
                                                                            </DropdownMenuItem>
                                                                            {item.status !== "Deactivated" && (
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
                                                                            )}
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
                                                                        </>
                                                                    )}
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
            <PaginationControls
                currentPage={currentPage}
                totalItems={processedData.length}
                pageSize={rowsPerPage}
                onPageChange={setCurrentPage}
                onPageSizeChange={handlePageSizeChange}
            />

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
            <SelectCustomerDialog
                isOpen={isSelectVirtualCustomerOpen}
                onOpenChange={setIsSelectVirtualCustomerOpen}
                customerIdInput={virtualCustomerIdInput}
                onCustomerIdChange={handleVirtualCustomerIdChange}
                filteredCustomerIds={filteredVirtualCustomerIds}
                onCustomerSelect={handleVirtualCustomerIdSelect}
                onProceed={handleProceedFromVirtualCustomerIdDialog}
                isLoading={isVirtualCustomerRecordLoading}
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
            <BulkUploadDialog
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
            <DeactivateDialog
                isOpen={isDeactivateDialogOpen}
                onClose={() => {
                    setIsDeactivateDialogOpen(false);
                    setSelectedMeter(null);
                }}
                meterId={selectedMeter?.id ?? ""}
                meterNumber={selectedMeter?.meterNumber ?? ""}
                action={selectedMeter && (selectedMeter.assignedStatus === "Deactivated" || selectedMeter.status === "Deactivated") ? "activate" : "deactivate"}
            />
            <AddMeterDialog
                isOpen={isAddMeterDialogOpen}
                onClose={() => setIsAddMeterDialogOpen(false)}
                onSaveMeter={handleSaveMeter}
                editMeter={editMeter as MeterInventoryItem}
            />
            <DeactivatePhysicalMeterDialog
                isOpen={isDeactivatePhysicalOpen}
                onOpenChange={setIsDeactivatePhysicalOpen}
                onProceed={handleDeactivationComplete}
                onMeterSelect={(meterId) => setSelectedPhysicalMeter(meterId)}
                meters={meterData.filter(meter =>
                    meter.customerId === selectedVirtualCustomer?.customerId &&
                    meter.status === "Assigned"
                ).map(meter => ({
                    id: meter.customerId ?? "",
                    number: meter.meterNumber,
                    address: `${meter.state}, ${meter.city}, ${meter.streetName} ${meter.houseNo}`
                }))}
                address={`${selectedVirtualCustomer?.state}, ${selectedVirtualCustomer?.city}, ${selectedVirtualCustomer?.streetName} ${selectedVirtualCustomer?.houseNo}`}
            />
            <AddVirtualMeterDetailsDialog
                isOpen={isEditVirtualMeterOpen}
                onOpenChange={setIsEditVirtualMeterOpen}
                selectedCustomer={editMeter as VirtualMeterData}
                setSelectedCustomer={(customer: VirtualMeterData | null) => setEditMeter(customer ?? undefined)}
                accountNumber={accountNumber}
                setAccountNumber={setAccountNumber}
                cin={cin}
                setCin={setCin}
                feeder={feeder}
                setFeeder={setFeeder}
                dss={dss}
                setDss={setDss}
                tariff={tariff}
                setTariff={setTariff}
                state={state}
                setState={setState}
                city={city}
                setCity={setCity}
                streetName={streetName}
                setStreetName={setStreetName}
                houseNo={houseNo}
                setHouseNo={setHouseNo}
                energyType={energyType}
                setEnergyType={setEnergyType}
                custoType={category}
                setCustomerType={setCategory}
                fixedEnergy={fixedEnergy}
                setFixedEnergy={setFixedEnergy}
                onProceed={handleSaveVirtualMeter}
                isFormComplete={isVirtualFormComplete}
                nigerianStates={nigerianStates}
                customerTypes={customerTypes}
            />
            <VirtualMeterConfirmDialog
                isOpen={isVirtualConfirmOpen}
                onOpenChange={setIsVirtualConfirmOpen}
                customerId={selectedVirtualCustomer?.customerId}
                onConfirm={handleConfirmVirtualMeterCreation}
            />
            <AddVirtualMeterDetailsDialog
                isOpen={isAddVirtualMeterOpen}
                onOpenChange={setIsAddVirtualMeterOpen}
                selectedCustomer={selectedVirtualCustomer}
                setSelectedCustomer={setSelectedVirtualCustomer}
                accountNumber={accountNumber}
                setAccountNumber={setAccountNumber}
                cin={cin}
                setCin={setCin}
                feeder={feeder}
                setFeeder={setFeeder}
                dss={dss}
                setDss={setDss}
                tariff={tariff}
                setTariff={setTariff}
                state={state}
                setState={setState}
                city={city}
                setCity={setCity}
                streetName={streetName}
                setStreetName={setStreetName}
                houseNo={houseNo}
                setHouseNo={setHouseNo}
                energyType={energyType}
                setEnergyType={setEnergyType}
                custoType={category}
                setCustomerType={setCategory}
                fixedEnergy={fixedEnergy}
                setFixedEnergy={setFixedEnergy}
                onProceed={handleConfirmVirtualMeter}
                isFormComplete={isVirtualFormComplete}
                nigerianStates={nigerianStates}
                customerTypes={customerTypes}
            />
        </div>
    );
}
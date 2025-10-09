/* eslint-disable */
"use client";
import { ContentHeader } from "@/components/ui/content-header";
import { useEffect, useState, useMemo } from "react";
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
import { DeactivateDialog } from "@/components/meter-management/meter-dialogs";
import { BulkUploadDialog } from "@/components/meter-management/bulk-upload";
import { FilterControl, SearchControl, SortControl } from "@/components/search-control";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ViewMeterDetailsDialog } from "@/components/meter-management/view-meters-details-dialog";
import { EditVirtualMeterDialog } from "@/components/meter-management/edit-virtual-meter-dialog";
import VirtualMeterConfirmDialog from "@/components/meter-management/virtual-meter-confirm-dialog";
import DeactivatePhysicalMeterDialog from "@/components/meter-management/deactivate-physical-meter-dialog";
import AddVirtualMeterDetailsDialog from "@/components/meter-management/add-virtual-meter-dialog";
import SelectCustomerDialog from "@/components/meter-management/select-customer-dialog";
import type { VirtualMeterData } from "@/types/meter";
import type { MeterInventoryItem } from "@/types/meter-inventory";
import { getStatusStyle } from "@/components/status-style";
import { cn } from "@/lib/utils";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AssignMeterDialog } from "@/components/meter-management/assign-meter-dialog";
import CustomerIdDialog from "@/components/meter-management/customer-id-dialog";
import { SetPaymentModeDialog } from "@/components/meter-management/set-payment-mode-dialog";
import { DeactivateVirtualMeterDialog } from "@/components/meter-management/deactivate-virtual-meter-dialog";
import { ConfirmationModalDialog } from "@/components/meter-management/confirmation-modal-dialog";
import UploadImageDialog from "@/components/meter-management/upload-image-dialog";
import ConfirmImageDialog from "@/components/meter-management/confirm-image-dialog";
import { ViewVirtualMeterDetailsDialog } from "@/components/meter-management/view-virtual-details-dialog";
import { Customer } from "@/types/customer-types";
import { useCustomerRecordQuery } from "@/hooks/use-customer";
import {
    useMeters,
    useSaveMeter,
    useActivateMeter,
    useDeactivateMeter,
    useAssignMeter,
    useBulkUploadMeters,
    useSaveVirtualMeter,
    useDeactivatePhysicalMeter,
    useCreateVirtualMeter,
} from "@/hooks/use-assign-meter";
import { toast } from "sonner";
import { nigerianStates, customerTypes } from "@/constants";

export default function MeterManagementPage() {
    const [mounted, setMounted] = useState(false);
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
    const [isViewActualDetailsOpen, setIsViewActualDetailsOpen] = useState(false);
    const [isViewVirtualDetailsOpen, setIsViewVirtualDetailsOpen] = useState(false);
    const [viewMeter, setViewMeter] = useState<MeterInventoryItem | null>(null);
    const [viewVirtualMeter, setViewVirtualMeter] = useState<VirtualMeterData | null>(null);
    const [isCustomerIdModalOpen, setIsCustomerIdModalOpen] = useState(false);
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
    const [selectedCustomerId, setSelectedCustomerId] = useState("");
    const [fetchedCustomerData, setFetchedCustomerData] = useState<Customer | null>(null);
    const [generatedAccountNumber, setGeneratedAccountNumber] = useState("");
    const [generatedVirtualMeterNo, setGeneratedVirtualMeterNo] = useState("");
    const [flowCustomerData, setFlowCustomerData] = useState<VirtualMeterData | null>(null);
    const [selectedVirtualCustomerId, setSelectedVirtualCustomerId] = useState("");
    // Set mounted state to true after component mounts on client
    useEffect(() => {
        setMounted(true);
    }, []);
    // --- TANSTACK QUERY HOOK ---
    const {
        data: customerRecord,
        isFetching,
        isFetched,
        isError,
        error,
    } = useCustomerRecordQuery(selectedCustomerId);
    const {
        data: virtualCustomerRecord,
        isFetching: isFetchingVirtual,
        isFetched: isFetchedVirtual,
        isError: isErrorVirtual,
        error: errorVirtual,
    } = useCustomerRecordQuery(selectedVirtualCustomerId);
    // --- METERS HOOK ---
    const { data: metersData, isLoading } = useMeters({
        page: currentPage,
        pageSize: rowsPerPage,
        searchTerm,
        sortBy: sortConfig.key as any,
        sortDirection: sortConfig.direction,
    });
    const { actualMeters = [], virtualMeters = [], totalData = 0 } = metersData || {};
    // --- MUTATIONS ---
    const saveMeterMutation = useSaveMeter();
    const activateMeterMutation = useActivateMeter();
    const deactivateMeterMutation = useDeactivateMeter();
    const assignMeterMutation = useAssignMeter();
    const bulkUploadMutation = useBulkUploadMeters();
    const saveVirtualMeterMutation = useSaveVirtualMeter();
    const deactivatePhysicalMutation = useDeactivatePhysicalMeter();
    const createVirtualMeterMutation = useCreateVirtualMeter();
    // --- CORE FLOW EFFECT: Handle transition after fetch ---
    useEffect(() => {
        if (isFetched && customerRecord && mounted) {
            setFetchedCustomerData(customerRecord.customer);
            setGeneratedAccountNumber(customerRecord.GeneratedAccountNumber);
            setGeneratedVirtualMeterNo(customerRecord.GeneratedVirtualMeterNo);
            setAccountNumber(customerRecord.GeneratedAccountNumber);
            setCin(customerRecord.customer.nin || customerRecord.customer.customerId);
            setState(customerRecord.customer.state);
            setCity(customerRecord.customer.city);
            setStreetName(customerRecord.customer.streetName);
            setHouseNo(customerRecord.customer.houseNo);
            setPhone(customerRecord.customer.phoneNumber);
            setFlowCustomerData({
                id: customerRecord.customer.id,
                customerId: customerRecord.customer.customerId,
                firstName: customerRecord.customer.firstName || customerRecord.customer.firstname,
                lastName: customerRecord.customer.lastName || customerRecord.customer.lastname,
                phone: customerRecord.customer.phoneNumber,
                cin: customerRecord.customer.nin || customerRecord.customer.customerId,
                accountNumber: customerRecord.GeneratedAccountNumber,
                state: customerRecord.customer.state,
                city: customerRecord.customer.city,
                streetName: customerRecord.customer.streetName,
                houseNo: customerRecord.customer.houseNo,
                meterNumber: "",
                tariff: "",
                feeder: "",
                dss: "",
                status: "Assigned",
                image: null,
                consumptionType: "Non-MD",
                category: "",
            } as VirtualMeterData);
            setIsCustomerIdModalOpen(false);
            setIsAssignModalOpen(true);
            setProgress(50);
            setSelectedCustomerId("");
            setCustomerIdInput("");
        }
        if (isError && mounted) {
            const errorMessage = error instanceof Error ? error.message : "An unexpected fetch error occurred.";
            toast.error(`Customer search failed: ${errorMessage}`);
        }
    }, [isFetched, customerRecord, isError, error, mounted]);
    // --- VIRTUAL CUSTOMER FETCH EFFECT ---
    useEffect(() => {
        if (isFetchedVirtual && virtualCustomerRecord && mounted) {
            setFetchedCustomerData(virtualCustomerRecord.customer);
            setGeneratedAccountNumber(virtualCustomerRecord.GeneratedAccountNumber);
            setGeneratedVirtualMeterNo(virtualCustomerRecord.GeneratedVirtualMeterNo);
            setAccountNumber(virtualCustomerRecord.GeneratedAccountNumber);
            setCin(virtualCustomerRecord.customer.nin || virtualCustomerRecord.customer.customerId);
            setState(virtualCustomerRecord.customer.state);
            setCity(virtualCustomerRecord.customer.city);
            setStreetName(virtualCustomerRecord.customer.streetName);
            setHouseNo(virtualCustomerRecord.customer.houseNo);
            setPhone(virtualCustomerRecord.customer.phoneNumber);
            setSelectedCustomer({
                id: "",
                customerId: virtualCustomerRecord.customer.customerId,
                meterNumber: "",
                cin: virtualCustomerRecord.customer.nin || virtualCustomerRecord.customer.customerId,
                accountNumber: virtualCustomerRecord.GeneratedAccountNumber,
                state: virtualCustomerRecord.customer.state,
                city: virtualCustomerRecord.customer.city,
                streetName: virtualCustomerRecord.customer.streetName,
                houseNo: virtualCustomerRecord.customer.houseNo,
                phone: virtualCustomerRecord.customer.phoneNumber,
                firstName: virtualCustomerRecord.customer.firstName || virtualCustomerRecord.customer.firstname,
                lastName: virtualCustomerRecord.customer.lastName || virtualCustomerRecord.customer.lastname,
                tariff: "",
                feeder: "",
                dss: "",
                status: "Assigned",
                image: null,
                consumptionType: "Non-MD",
                category: "",
            } as VirtualMeterData);
            setIsAddVirtualMeterOpen(true);
            setProgress(50);
            setSelectedVirtualCustomerId("");
            setCustomerIdInput("");
        }
        if (isErrorVirtual && mounted) {
            const errorMessage = errorVirtual instanceof Error ? errorVirtual.message : "An unexpected fetch error occurred.";
            toast.error(`Customer search failed: ${errorMessage}`);
        }
    }, [isFetchedVirtual, virtualCustomerRecord, isErrorVirtual, errorVirtual, mounted]);
    // --- Handlers ---
    const handleCustomerProceed = () => {
        if (customerIdInput) {
            setSelectedCustomerId(customerIdInput);
        }
    };
    const handleProceedFromAssign = () => {
        if (!flowCustomerData) {
            toast.error("Customer data is missing. Please search again.");
            return;
        }
        const updatedCustomer: VirtualMeterData = {
            ...flowCustomerData,
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
            category,
            phone,
        };
        setFlowCustomerData(updatedCustomer);
        setIsAssignModalOpen(false);
        setIsUploadImageOpen(true);
        setProgress(60);
    };
    const handleProceedFromUploadImage = (image: File | null) => {
        setUploadedImage(image);
        setFlowCustomerData((prev) => (prev ? { ...prev, image } as VirtualMeterData : prev));
        setIsUploadImageOpen(false);
        setIsConfirmImageOpen(true);
        setProgress(70);
    };
    const handleProceedFromConfirmImage = () => {
        setIsConfirmImageOpen(false);
        if (category === "Prepaid") {
            setIsSetPaymentModalOpen(true);
            setProgress(80);
        } else if (category === "Postpaid") {
            setIsDeactivateModalOpen(true);
            setProgress(80);
        }
    };
    const handleProceedFromSetPayment = () => {
        setIsSetPaymentModalOpen(false);
        setIsDeactivateModalOpen(true);
        setProgress(90);
    };
    const handleProceedFromDeactivate = () => {
        setIsDeactivateModalOpen(false);
        setIsConfirmationModalOpen(true);
        setProgress(100);
    };
    const handleConfirmAssignment = () => {
        setIsConfirmationModalOpen(false);
        toast.success(`Meter assigned successfully for ${(category || "").toLowerCase()} customer!`);
        setFetchedCustomerData(null);
        setFlowCustomerData(null);
        setMeterNumber("");
        setCategory("");
        setProgress(0);
    };
    const isAssignFormComplete = !!meterNumber && !!tariff && !!feeder && !!dss && !!category;
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
            const filtered = Array.from(
                new Set(
                    (activeTab === "actual" ? actualMeters : virtualMeters)
                        .filter((customer) =>
                            customer.customerId
                                ? customer.customerId.toLowerCase().includes(value.toLowerCase())
                                : false
                        )
                        .map((customer) => customer.customerId as string)
                )
            );
            setFilteredCustomerIds(filtered);
        }
    };
    const handleCustomerIdSelect = (customerId: string) => {
        const customer = (activeTab === "actual" ? actualMeters : virtualMeters).find(
            (item) => item.customerId === customerId
        );
        if (customer && customer.customerId) {
            setSelectedCustomer({
                id: customer.id ?? "",
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
            toast.error("Customer search failed: Customer not found");
        }
    };
    const handleConfirmEditFromSetPayment = () => {
        if (editCustomer) {
            toast.success(`Details and payment mode updated successfully for prepaid customer ${editCustomer.customerId}!`);
        }
    };
    const isPaymentFormComplete = debitMop !== "" && creditMop !== "";
    const handleCancelConfirmation = () => {
        setIsConfirmationModalOpen(false);
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
    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
    };
    const handleSortChange = () => {
        const sortKey: keyof MeterInventoryItem | keyof VirtualMeterData = sortConfig.key ?? (activeTab === "actual" ? "meterNumber" : "meterNumber");
        const newDirection = sortConfig.direction === "asc" ? "desc" : "asc";
        setSortConfig({ key: sortKey, direction: newDirection });
    };
    const processedData = useMemo(() => {
        let results: (MeterInventoryItem | VirtualMeterData)[] = activeTab === "actual" ? actualMeters : virtualMeters;
        if (Object.keys(activeFilters).length > 0) {
            results = results.filter((item) => {
                if (activeTab === "actual") {
                    const meter = item as MeterInventoryItem;
                    const statusFilters = [
                        { id: "assigned", value: activeFilters.assigned, status: "Assigned" },
                        { id: "unassigned", value: activeFilters.unassigned, status: "Unassigned" },
                    ];
                    const statusMatch =
                        statusFilters.every((f) => !f.value) ||
                        statusFilters.some((filter) => filter.value && meter.status === filter.status);
                    const classFilters = [
                        { id: "singlePhase", value: activeFilters.singlePhase, class: "Single phase" },
                        { id: "threePhase", value: activeFilters.threePhase, class: "Three Phase" },
                        { id: "mdMeter", value: activeFilters.mdMeter, class: "MD Meter" },
                    ];
                    const classMatch =
                        classFilters.every((f) => !f.value) ||
                        classFilters.some((filter) => filter.value && meter.meterClass === filter.class);
                    return statusMatch && classMatch;
                } else {
                    const meter = item as VirtualMeterData;
                    const statusFilters = [
                        { id: "assigned", value: activeFilters.assigned, status: "Assigned" },
                        { id: "deactivated", value: activeFilters.deactivated, status: "Deactivated" },
                    ];
                    return (
                        statusFilters.every((f) => !f.value) ||
                        statusFilters.some((filter) => filter.value && meter.status === filter.status)
                    );
                }
            });
        }
        if (searchTerm.trim() !== "") {
            if (activeTab === "actual") {
                results = results.filter((item) => {
                    const meter = item as MeterInventoryItem;
                    return [
                        meter.meterNumber,
                        meter.status || "",
                        meter.meterClass,
                    ].some((value) => value.toLowerCase().includes(searchTerm.toLowerCase()));
                });
            } else {
                results = results.filter((item) => {
                    const meter = item as VirtualMeterData;
                    return [
                        meter.meterNumber,
                        meter.customerId || "",
                        meter.accountNumber || "",
                        meter.tariff || "",
                        meter.status || "",
                    ].some((value) => value.toLowerCase().includes(searchTerm.toLowerCase()));
                });
            }
        }
        if (sortConfig.key) {
            results = [...results].sort((a, b) => {
                let aValue: string | undefined;
                let bValue: string | undefined;
                if (activeTab === "actual") {
                    const meterA = a as MeterInventoryItem;
                    const meterB = b as MeterInventoryItem;
                    aValue = String(meterA[sortConfig.key as keyof MeterInventoryItem] ?? "");
                    bValue = String(meterB[sortConfig.key as keyof MeterInventoryItem] ?? "");
                } else {
                    const meterA = a as VirtualMeterData;
                    const meterB = b as VirtualMeterData;
                    aValue = String(meterA[sortConfig.key as keyof VirtualMeterData] ?? "");
                    bValue = String(meterB[sortConfig.key as keyof VirtualMeterData] ?? "");
                }
                if (aValue === undefined || bValue === undefined) {
                    return 0;
                }
                return sortConfig.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            });
        }
        return results;
    }, [activeTab, actualMeters, virtualMeters, activeFilters, searchTerm, sortConfig.key, sortConfig.direction]);
    const toggleSelection = (id: string) => {
        setSelectedTariffs(
            selectedTariffs.includes(id)
                ? selectedTariffs.filter((selectedId) => selectedId !== id)
                : [...selectedTariffs, id]
        );
    };
    const toggleSelectAll = () => {
        const currentData = activeTab === "actual" ? actualMeters : virtualMeters;
        if (selectedTariffs.length === currentData.length) {
            setSelectedTariffs([]);
        } else {
            setSelectedTariffs(currentData.map((item) => item.id));
        }
    };
    const handleSaveMeter = (updatedMeter: MeterInventoryItem | VirtualMeterData) => {
        saveMeterMutation.mutate(updatedMeter);
    };
    const handleSaveMeterForActual = (meter: MeterInventoryItem) => {
        handleSaveMeter(meter);
    };
    const handleActivate = () => {
        if (selectedMeter) {
            activateMeterMutation.mutate(selectedMeter.id, {
                onSuccess: () => {
                    setIsDeactivateDialogOpen(false);
                    setSelectedMeter(null);
                },
            });
        }
    };
    const handleDeactivate = (reason?: string) => {
        if (selectedMeter) {
            deactivateMeterMutation.mutate({ id: selectedMeter.id, reason }, {
                onSuccess: () => {
                    setIsDeactivateDialogOpen(false);
                    setSelectedMeter(null);
                },
            });
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
            assignMeterMutation.mutate({ id: selectedMeter.id, data });
        }
    };
    const handleBulkUpload = (newData: (MeterInventoryItem | VirtualMeterData)[]) => {
        bulkUploadMutation.mutate(newData);
    };
    const handleSaveVirtualMeter = () => {
        if (editMeter && isVirtualMeter(editMeter)) {
            saveVirtualMeterMutation.mutate({ id: editMeter.id, meter: editMeter }, {
                onSuccess: () => {
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
                },
            });
        } else {
            alert("Cannot save meter: Invalid or missing customer data.");
        }
    };
    const handleOpenAddVirtualMeter = () => {
        setCustomerIdInput("");
        setFilteredCustomerIds([]);
        setSelectedCustomer(null);
        setSelectedPhysicalMeter("");
        setIsAddVirtualMeterOpen(true);
    };
    const handleCustomerSelect = (customerId: string) => {
        setCustomerIdInput(customerId);
        setFilteredCustomerIds([]);
    };
    const handleProceedFromSelectCustomer = () => {
        if (customerIdInput) {
            setSelectedVirtualCustomerId(customerIdInput);
        }
    };
    const handleProceedToDeactivate = () => {
        setIsAddVirtualMeterOpen(false);
        setIsDeactivatePhysicalOpen(true);
    };
    const handleDeactivationComplete = () => {
        if (selectedPhysicalMeter) {
            deactivatePhysicalMutation.mutate(selectedPhysicalMeter, {
                onSuccess: () => {
                    setIsDeactivatePhysicalOpen(false);
                    setIsVirtualConfirmOpen(true);
                },
            });
        } else {
            setIsDeactivatePhysicalOpen(false);
            setIsVirtualConfirmOpen(true);
        }
    };
    const handleConfirmVirtualMeter = () => {
        if (selectedCustomer) {
            createVirtualMeterMutation.mutate(selectedCustomer, {
                onSuccess: () => {
                    setIsVirtualConfirmOpen(false);
                    setSelectedCustomer(null);
                    setIsDeactivatePhysicalOpen(false);
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
        (cin || "").trim() !== "" &&
        (accountNumber || "").trim() !== "" &&
        (tariff || "").trim() !== "" &&
        (feeder || "").trim() !== "" &&
        (dss || "").trim() !== "" &&
        (state || "").trim() !== "" &&
        (city || "").trim() !== "" &&
        (streetName || "").trim() !== "" &&
        (houseNo || "").trim() !== "" &&
        customerTypes.length > 0 &&
        (selectedCustomer?.phone || "").trim() !== "";
    const totalPages = Math.ceil(totalData / rowsPerPage);
    const paginatedData = processedData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );
    const isVirtualMeter = (item: MeterInventoryItem | VirtualMeterData): item is VirtualMeterData => "customerId" in item;
    const changeTab = (tab: "actual" | "virtual") => {
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
        setSelectedVirtualCustomerId("");
    };
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
    // Show loading state until component is mounted and data is loaded
    if (!mounted || isLoading) {
        return (
            <div className="p-6 h-screen overflow-x-hidden bg-transparent">
                <ContentHeader
                    title="Meters"
                    description="Manage and Access All Meter Records."
                />
                <div>Loading...</div>
            </div>
        );
    }
    return (
        <div className="p-6 h-screen overflow-hidden bg-transparent">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4 bg-transparent">
                <ContentHeader
                    title="Meters"
                    description="Manage and Access All Meter Records."
                />
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
                            <SortControl
                                onSortChange={handleSortChange}
                                currentSort={sortConfig.key ? `${sortConfig.key} (${sortConfig.direction})` : ""}
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
                                                    checked={selectedTariffs.length === actualMeters.length && actualMeters.length > 0}
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
                                        <TableHead className="px-4 py-3 text-sm font-medium text-gray-900 text-center">Meter Stage</TableHead>
                                        <TableHead className="px-4 py-3 text-sm font-medium text-gray-900 text-left">Activation Status</TableHead>
                                        <TableHead className="px-4 py-3 text-sm font-medium text-gray-900 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedData.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={11} className="h-24 text-center text-sm text-gray-500">
                                                No data available
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        paginatedData.map((item, index) =>
                                            "meterManufacturer" in item ? (
                                                <TableRow
                                                    key={item.id}
                                                    className="hover:bg-gray-50 cursor-pointer"
                                                >
                                                    <TableCell className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <Checkbox
                                                                className="h-4 w-4 border-gray-500"
                                                                id={`select-${item.id}`}
                                                                checked={selectedTariffs.includes(item.id)}
                                                                onCheckedChange={() => toggleSelection(item.id)}
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
                                                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.meterManufacturer}</TableCell>
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
                                                                        setIsViewActualDetailsOpen(true);
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
                                                        checked={virtualMeters.length > 0 && selectedTariffs.length === virtualMeters.length}
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
                                            <TableHead className="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-normal">
                                                Category
                                            </TableHead>
                                            <TableHead className="px-4 py-3 text-center text-sm font-semibold text-gray-700 whitespace-normal">
                                                Activation Status
                                            </TableHead>
                                            <TableHead className="w-20 px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedData.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={11} className="h-24 text-center text-sm text-gray-500">
                                                    No virtual meter available
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            paginatedData.map((item, index) =>
                                                isVirtualMeter(item) ? (
                                                    <TableRow key={item.id} className="hover:bg-gray-50">
                                                        <TableCell className="px-4 py-3">
                                                            <div className="flex items-center gap-2">
                                                                <Checkbox
                                                                    className="h-4 w-4 border-gray-500"
                                                                    id={`select-${item.id}`}
                                                                    checked={selectedTariffs.includes(item.id)}
                                                                    onCheckedChange={() => toggleSelection(item.id)}
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
                                                            {item.feeder || ''}
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
                                                        <TableCell className="px-4 py-3 text-sm text-gray-900 break-words">
                                                            {item.category || 'N/A'}
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
                                                                            setIsViewVirtualDetailsOpen(true);
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
                        {Math.min(currentPage * rowsPerPage, processedData.length)} of {totalData}
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
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
            <CustomerIdDialog
                isOpen={isCustomerIdModalOpen}
                onOpenChange={setIsCustomerIdModalOpen}
                customerIdInput={customerIdInput}
                onCustomerIdChange={setCustomerIdInput}
                filteredCustomerIds={filteredCustomerIds}
                onCustomerSelect={setCustomerIdInput}
                onProceed={handleCustomerProceed}
                isLoading={isFetching}
            />
            <AssignMeterDialog
                isOpen={isAssignModalOpen}
                onOpenChange={setIsAssignModalOpen}
                customer={fetchedCustomerData}
                meterNumber={meterNumber}
                setMeterNumber={setMeterNumber}
                tariff={tariff}
                setTariff={setTariff}
                feeder={feeder}
                setFeeder={setFeeder}
                dss={dss}
                setDss={setDss}
                category={category}
                setCategory={setCategory}
                cin={cin}
                setCin={setCin}
                accountNumber={accountNumber}
                setAccountNumber={setAccountNumber}
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
                onProceed={handleProceedFromAssign}
                isFormComplete={isAssignFormComplete}
                progress={progress}
            />
            <UploadImageDialog
                isOpen={isUploadImageOpen}
                onOpenChange={(open) => {
                    setIsUploadImageOpen(open);
                    if (!open) setUploadedImage(null);
                }}
                onProceed={handleProceedFromUploadImage}
                onCancel={() => setIsUploadImageOpen(false)}
            />
            <ConfirmImageDialog
                isOpen={isConfirmImageOpen}
                onOpenChange={(open) => {
                    setIsConfirmImageOpen(open);
                    if (!open) setUploadedImage(null);
                }}
                image={uploadedImage}
                onProceed={handleProceedFromConfirmImage}
                onCancel={() => setIsConfirmImageOpen(false)}
            />
            <SelectCustomerDialog
                isOpen={isAddVirtualMeterOpen}
                onOpenChange={setIsAddVirtualMeterOpen}
                customerIdInput={customerIdInput}
                onCustomerIdChange={handleCustomerIdChange}
                filteredCustomerIds={filteredCustomerIds}
                onCustomerSelect={handleCustomerSelect}
                onProceed={handleProceedFromSelectCustomer}
                isLoading={isFetchingVirtual}
            />
            <AddVirtualMeterDetailsDialog
                isOpen={isAddVirtualMeterOpen && selectedCustomer !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedCustomer(null);
                        setIsAddVirtualMeterOpen(false);
                    }
                }}
                selectedCustomer={selectedCustomer}
                setSelectedCustomer={setSelectedCustomer}
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
                fixedEnergy={fixedEnergy}
                setFixedEnergy={setFixedEnergy}
                onProceed={handleProceedToDeactivate}
                isFormComplete={isVirtualFormComplete}
                nigerianStates={nigerianStates}
                customerTypes={customerTypes}
            />
            <DeactivatePhysicalMeterDialog
                isOpen={isDeactivatePhysicalOpen}
                onOpenChange={(open) => {
                    setIsDeactivatePhysicalOpen(open);
                    if (!open) {
                        setSelectedPhysicalMeter("");
                    }
                }}
                onProceed={handleDeactivationComplete}
                onMeterSelect={setSelectedPhysicalMeter}
                meters={actualMeters.map((m) => ({
                    id: m.id,
                    number: m.meterNumber,
                    address: `${m.streetName || "N/A"}, ${m.city || "N/A"}, ${m.state || "N/A"}`,
                }))}
                address=""
            />
            <VirtualMeterConfirmDialog
                isOpen={isVirtualConfirmOpen}
                onOpenChange={setIsVirtualConfirmOpen}
                customerId={selectedCustomer?.customerId}
                onConfirm={handleConfirmVirtualMeter}
            />
            <EditVirtualMeterDialog
                isOpen={isEditVirtualMeterOpen}
                onClose={() => {
                    setIsEditVirtualMeterOpen(false);
                    setEditMeter(undefined);
                    setSelectedMeter(null);
                }}
                onSave={handleSaveVirtualMeter}
                meter={
                    editMeter && isVirtualMeter(editMeter)
                        ? {
                            id: editMeter.id,
                            customerId: editMeter.customerId,
                            meterNumber: editMeter.meterNumber ?? "",
                            accountNumber: editMeter.accountNumber ?? "",
                            dss: editMeter.dss ?? "",
                            cin: editMeter.cin ?? "",
                            tariff: editMeter.tariff ?? "",
                            status: editMeter.status ?? "Assigned",
                            firstName: editMeter.firstName ?? "",
                            lastName: editMeter.lastName ?? "",
                            phone: editMeter.phone ?? "",
                            state: editMeter.state ?? "",
                            city: editMeter.city ?? "",
                            streetName: editMeter.streetName ?? "",
                            houseNo: editMeter.houseNo ?? "",
                            custoType: editMeter.custoType ?? "",
                            energyType: editMeter.energyType ?? "",
                            fixedEnergy: editMeter.fixedEnergy ?? "",
                        } as VirtualMeterData
                        : null
                }
            />
            <AddMeterDialog
                isOpen={isAddDialogOpen}
                onClose={() => {
                    setIsAddDialogOpen(false);
                    setEditMeter(undefined);
                    setSelectedMeter(null);
                }}
                onSaveMeter={handleSaveMeterForActual}
                editMeter={
                    activeTab === "actual" && editMeter && "meterManufacturer" in editMeter
                        ? editMeter as MeterInventoryItem
                        : undefined
                }
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
            <DeactivateDialog
                isOpen={isDeactivateDialogOpen}
                onClose={() => setIsDeactivateDialogOpen(false)}
                onDeactivate={
                    selectedMeter
                        ? activeTab === "actual" && "meterManufacturer" in selectedMeter
                            ? selectedMeter.status === "Deactivated"
                                ? handleActivate
                                : handleDeactivate
                            : selectedMeter.status === "Deactivated"
                                ? handleActivate
                                : handleDeactivate
                        : handleDeactivate
                }
                meterNumber={selectedMeter?.meterNumber ?? ""}
                action={
                    selectedMeter
                        ? activeTab === "actual" && "meterManufacturer" in selectedMeter
                            ? selectedMeter.status === "Deactivated"
                                ? "activate"
                                : "deactivate"
                            : selectedMeter.status === "Deactivated"
                                ? "activate"
                                : "deactivate"
                        : "deactivate"
                }
            />
            <DeactivateVirtualMeterDialog
                isOpen={isDeactivateModalOpen}
                onOpenChange={setIsDeactivateModalOpen}
                onProceed={handleProceedFromDeactivate}
            />
            <BulkUploadDialog<MeterInventoryItem>
                isOpen={isBulkUploadDialogOpen}
                onClose={() => setIsBulkUploadDialogOpen(false)}
                onSave={handleBulkUpload}
                title="Bulk Upload Meters"
                requiredColumns={[
                    "id",
                    "meterNumber",
                    "simNumber",
                    "meterClass",
                    "meterType",
                    "oldTariffIndex",
                    "newTariffIndex",
                    "meterManufacturer",
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
            />
        </div>
    );
}
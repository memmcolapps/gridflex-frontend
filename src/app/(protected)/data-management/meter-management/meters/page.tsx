"use client";
import { ContentHeader } from "@/components/ui/content-header";
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
import { getStatusStyle } from "@/components/status-style";
import { cn } from "@/lib/utils";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function MeterManagementPage() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedTariffs, setSelectedTariffs] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isBulkUploadDialogOpen, setIsBulkUploadDialogOpen] = useState(false);
    const [editMeter, setEditMeter] = useState<MeterData | VirtualMeterData | undefined>(undefined);
    const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
    const [selectedMeter, setSelectedMeter] = useState<MeterData | VirtualMeterData | null>(null);
    const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({});
    const [activeTab, setActiveTab] = useState<"actual" | "virtual">("actual");
    const [sortConfig, setSortConfig] = useState<{
        key: keyof MeterData | keyof VirtualMeterData | null;
        direction: "asc" | "desc";
    }>({ key: null, direction: "asc" });
    const [processedData, setProcessedData] = useState<(MeterData | VirtualMeterData)[]>([]);

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
    const [feederLine, setFeederLine] = useState("");
    const [dss, setDss] = useState("");
    const [tariff, setTariff] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [streetName, setStreetName] = useState("");
    const [houseNo, setHouseNo] = useState("");
    const [energyType, setEnergyType] = useState(""); // <-- Added this line
    const [fixedEnergy, setFixedEnergy] = useState(""); // <-- Added for fixedEnergy
    const [isEditVirtualMeterOpen, setIsEditVirtualMeterOpen] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
    const [viewMeter, setViewMeter] = useState<MeterData | null>(null);



    interface MeterData {
        id: string;
        meterNumber: string;
        simNumber: string;
        class: string;
        category?: string;
        meterType: string;
        oldTariffIndex: string;
        newTariffIndex: string;
        meterManufacturer: string;
        accountNumber: string;
        oldsgc: string;
        oldkrn: string;
        newkrn: string;
        newsgc: string;
        tariff: string;
        approvalStatus: string;
        status: string;
    }

    // Remove local VirtualMeterData interface, use imported one

    const actualFilterSections = [
        {
            title: "Status",
            options: [
                { id: "inStock", label: "InStock" },
                { id: "assigned", label: "Assigned" },
                { id: "deactivated", label: "Deactivated" },
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


    const meters = [
        { id: "PM-0159000000302-1", number: "0159000000302", address: "5, Glorious Orimerumnu, Obafemi Owode, Ogun State" },
        { id: "PM-0159000000302-2", number: "0159000000303", address: "6, Glorious Orimerumnu, Obafemi Owode, Ogun State" },
        { id: "PM-0159000000302-3", number: "0159000000304", address: "7, Glorious Orimerumnu, Obafemi Owode, Ogun State" },
    ];

    const [data, setData] = useState<MeterData[]>([
        {
            id: "MT-1001",
            meterNumber: "64533729273",
            meterType: "Electricity",
            oldTariffIndex: "1",
            newTariffIndex: "2",
            simNumber: "SIM-895623",
            oldsgc: "999962",
            newsgc: "600094",
            oldkrn: "900009",
            newkrn: "900876",
            meterManufacturer: "Momas",
            class: "MD",
            category: "Prepaid",
            accountNumber: "001/654321",
            tariff: "Residential",
            approvalStatus: "Approved",
            status: "Assigned",
        },

        {
            id: "MT-1002",
            meterNumber: "64533729273",
            meterType: "Electricity",
            oldTariffIndex: "1",
            newTariffIndex: "2",
            simNumber: "SIM-895623",
            oldsgc: "999962",
            newsgc: "600094",
            oldkrn: "900009",
            newkrn: "906544",
            meterManufacturer: "MOMAS",
            class: "MD",
            category: "Postpaid",
            accountNumber: "001/654321",
            tariff: "Residential",
            approvalStatus: "Approved",
            status: "Assigned",
        },
        {
            id: "MT-1003",
            meterNumber: "64533729273",
            meterType: "Electricity",
            oldTariffIndex: "1",
            newTariffIndex: "2",
            simNumber: "SIM-895623",
            oldsgc: "999962",
            newsgc: "600094",
            oldkrn: "900876",
            newkrn: "987654",
            meterManufacturer: "MOMAS",
            class: "MD",
            category: "Prepaid",
            accountNumber: "001/654321",
            tariff: "Residential",
            approvalStatus: "Approved",
            status: "InStock",
        },

        {
            id: "MT-1004",
            meterNumber: "64533729273",
            meterType: "Electricity",
            oldTariffIndex: "1",
            newTariffIndex: "2",
            simNumber: "SIM-895623",
            oldsgc: "999962",
            newsgc: "600094",
            oldkrn: "",
            newkrn: "",
            meterManufacturer: "MOMAS",
            class: "MD",
            category: "Prepaid",
            accountNumber: "001/654321",
            tariff: "Residential",
            approvalStatus: "Approved",
            status: "Unassigned",
        },

        {
            id: "MT-1005",
            meterNumber: "64533729273",
            meterType: "Electricity",
            oldTariffIndex: "1",
            newTariffIndex: "2",
            simNumber: "SIM-895623",
            oldsgc: "999962",
            newsgc: "600094",
            oldkrn: "908765",
            newkrn: "609865",
            meterManufacturer: "MOMAS",
            class: "MD",
            category: "Prepaid",
            accountNumber: "001/654321",
            tariff: "Residential",
            approvalStatus: "Approved",
            status: "Assigned",
        },
        {
            id: "MT-1006",
            meterNumber: "64533729273",
            meterType: "Electricity",
            oldTariffIndex: "1",
            newTariffIndex: "2",
            simNumber: "SIM-895623",
            oldsgc: "999962",
            newsgc: "600094",
            oldkrn: "986543",
            newkrn: "900865",
            meterManufacturer: "MOMAS",
            class: "MD",
            category: "Postpaid",
            accountNumber: "001/654321",
            tariff: "Residential",
            approvalStatus: "Rejected",
            status: "Assigned",
        },
        {
            id: "MT-1007",
            meterNumber: "64533729273",
            meterType: "Electricity",
            oldTariffIndex: "1",
            newTariffIndex: "2",
            simNumber: "SIM-895623",
            oldsgc: "999962",
            newsgc: "600094",
            oldkrn: "908766",
            newkrn: "908765",
            meterManufacturer: "MOMAS",
            class: "MD",
            category: "Prepaid",
            accountNumber: "001/654321",
            tariff: "Residential",
            approvalStatus: "Pending",
            status: "Assigned",
        },
        {
            id: "MT-1008",
            meterNumber: "64533729273",
            meterType: "Electricity",
            oldTariffIndex: "1",
            newTariffIndex: "2",
            simNumber: "SIM-895623",
            oldsgc: "999962",
            newsgc: "600094",
            oldkrn: "898790",
            newkrn: "998866",
            meterManufacturer: "MOMAS",
            class: "MD",
            category: "Prepaid",
            accountNumber: "001/654321",
            tariff: "Residential",
            approvalStatus: "Pending",
            status: "InStock",
        },
        {
            id: "MT-1009",
            meterNumber: "64533729273",
            meterType: "Electricity",
            oldTariffIndex: "1",
            newTariffIndex: "2",
            simNumber: "SIM-895623",
            oldsgc: "999962",
            newsgc: "600094",
            oldkrn: "909878",
            newkrn: "998888",
            meterManufacturer: "MOMAS",
            class: "MD",
            category: "Prepaid",
            accountNumber: "001/654321",
            tariff: "Residential",
            approvalStatus: "Pending",
            status: "Unassigned",
        },
        {
            id: "MT-1018",
            meterNumber: "64533729273",
            meterType: "Electricity",
            oldTariffIndex: "1",
            newTariffIndex: "2",
            simNumber: "SIM-895623",
            oldsgc: "999962",
            newsgc: "600094",
            oldkrn: "898790",
            newkrn: "998866",
            meterManufacturer: "MOMAS",
            class: "MD",
            category: "Prepaid",
            accountNumber: "001/654321",
            tariff: "Residential",
            approvalStatus: "Pending",
            status: "InStock",
        },
        {
            id: "MT-1019",
            meterNumber: "64533729273",
            meterType: "Electricity",
            oldTariffIndex: "1",
            newTariffIndex: "2",
            simNumber: "SIM-895623",
            oldsgc: "999962",
            newsgc: "600094",
            oldkrn: "909878",
            newkrn: "998765",
            meterManufacturer: "MOMAS",
            class: "MD",
            category: "Prepaid",
            accountNumber: "001/654321",
            tariff: "Residential",
            approvalStatus: "Pending",
            status: "Unassigned",
        },
    ]);

    const [virtualData, setVirtualData] = useState<VirtualMeterData[]>([
        {
            id: "VM-001",
            customerId: "C-65443359001",
            meterNumber: "V-65433729273",
            accountNumber: "00288778123456",
            feeder: "Ijeun",
            dss: "Ijeun",
            cin: "1234556778",
            tariff: "Tariff A1",
            status: "Assigned",
            firstName: "John",
            lastName: "Doe",
            phone: "08012345678",
            state: "Lagos",
            city: "Lagos",
            custoType: "Residential",
            streetName: "olaiya",
            houseNo: "28",
        },
        {
            id: "VM-002",
            customerId: "C-65443359002",
            meterNumber: "V-65433729274",
            accountNumber: "00288778123457",
            feeder: "Ijeun",
            dss: "Ijeun",
            cin: "1234556779",
            tariff: "Tariff A1",
            status: "Assigned",
            firstName: "Jane",
            lastName: "Smith",
            phone: "08087654321",
            state: "lagos",
            city: "Lagos",
            streetName: "olaiya",
            houseNo: "28",
        },
        {
            id: "VM-003",
            customerId: "C-65443359003",
            meterNumber: "V-65433729275",
            accountNumber: "00288778123458",
            feeder: "Ijeun",
            dss: "Ijeun",
            cin: "1234556780",
            tariff: "Tariff A1",
            status: "Deactivated",
            firstName: "Alice",
            lastName: "Johnson",
            phone: "08055555555",
            state: "lagos",
            city: "Lagos",
            streetName: "olaiya",
            houseNo: "28",
        },
        {
            id: "VM-004",
            customerId: "C-65443359001",
            meterNumber: "V-65433729276",
            accountNumber: "00288778123459",
            feeder: "Ijeun",
            dss: "Ijeun",
            cin: "1234556781",
            tariff: "Tariff A1",
            status: "Assigned",
            firstName: "John",
            lastName: "Doe",
            phone: "08012345678",
            state: "Lagos",
            city: "Lagos",
            streetName: "olaiya",
            houseNo: "28",
        },
        {
            id: "VM-005",
            customerId: "C-65443359002",
            meterNumber: "V-65433729277",
            accountNumber: "00288778123460",
            feeder: "Ijeun",
            dss: "Ijeun",
            cin: "1234556782",
            tariff: "Tariff A1",
            status: "Assigned",
            firstName: "Jane",
            lastName: "Smith",
            phone: "08087654321",
            state: "lagos",
            city: "Lagos",
            streetName: "olaiya",
            houseNo: "28",
        },
        {
            id: "VM-006",
            customerId: "C-65443359003",
            meterNumber: "V-65433729278",
            accountNumber: "00288778123461",
            feeder: "Ijeun",
            dss: "Ijeun",
            cin: "1234556783",
            tariff: "Tariff A1",
            status: "Deactivated",
            firstName: "Alice",
            lastName: "Johnson",
            phone: "08055555555",
            state: "lagos",
            city: "Lagos",
            streetName: "olaiya",
            houseNo: "28",
        },
        {
            id: "VM-007",
            customerId: "C-65443359001",
            meterNumber: "V-65433729279",
            accountNumber: "00288778123462",
            feeder: "Ijeun",
            dss: "Ijeun",
            cin: "1234556784",
            tariff: "Tariff A1",
            status: "Assigned",
            firstName: "John",
            lastName: "Doe",
            phone: "08012345678",
            state: "Lagos",
            city: "Lagos",
            streetName: "olaiya",
            houseNo: "28",
        },
        {
            id: "VM-008",
            customerId: "C-65443359002",
            meterNumber: "V-65433729280",
            accountNumber: "00288778123463",
            feeder: "Ijeun",
            dss: "Ijeun",
            cin: "1234556785",
            tariff: "Tariff A1",
            status: "Deactivated",
            firstName: "Jane",
            lastName: "Smith",
            phone: "08087654321",
            state: "Lagos",
            city: "Lagos",
            streetName: "olaiya",
            houseNo: "28",
        },
    ]);

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
            setPhoneNumber(virtualMeter.phone ?? "");
            setState(virtualMeter.state ?? "");
            setCity(virtualMeter.city ?? "");
            setStreetName(virtualMeter.streetName ?? "");
            setHouseNo(virtualMeter.houseNo ?? "");
        }
    }, [editMeter, isEditVirtualMeterOpen]);

    useEffect(() => {
        setProcessedData(activeTab === "actual" ? data : virtualData);
    }, [data, virtualData, activeTab]);

    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
        applyFiltersAndSort(term, sortConfig.key, sortConfig.direction);
    };

    const handleSortChange = () => {
        const sortKey: keyof MeterData | keyof VirtualMeterData = sortConfig.key ?? (activeTab === "actual" ? "meterNumber" : "meterNumber");
        const newDirection = sortConfig.direction === "asc" ? "desc" : "asc";
        setSortConfig({ key: sortKey, direction: newDirection });
        applyFiltersAndSort(searchTerm, sortKey, newDirection);
    };

    useEffect(() => {
        applyFiltersAndSort(searchTerm, sortConfig.key, sortConfig.direction);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, virtualData, activeTab, activeFilters, searchTerm, sortConfig.key, sortConfig.direction]);

    const applyFiltersAndSort = (
        term: string,
        sortBy: keyof MeterData | keyof VirtualMeterData | null,
        direction: "asc" | "desc"
    ) => {
        let results: (MeterData | VirtualMeterData)[] = activeTab === "actual" ? data : virtualData;

        // Apply filters
        if (Object.keys(activeFilters).length > 0) {
            results = results.filter((item) => {
                if (activeTab === "actual") {
                    const meter = item as MeterData;

                    // Status filter: Check if no status filters are selected or any selected status matches
                    const statusFilters = [
                        { id: "inStock", value: activeFilters.inStock ?? false, status: "InStock" },
                        { id: "assigned", value: activeFilters.assigned ?? false, status: "Assigned" },
                        { id: "deactivated", value: activeFilters.deactivated ?? false, status: "Deactivated" },
                    ];
                    const statusMatch =
                        statusFilters.every((f) => !f.value) ||
                        statusFilters.some((filter) => filter.value && meter.status === filter.status);

                    // Class filter: Check if no class filters are selected or any selected class matches
                    const classFilters = [
                        { id: "singlePhase", value: activeFilters.singlePhase ?? false, class: "Single phase" },
                        { id: "threePhase", value: activeFilters.threePhase ?? false, class: "Three Phase" },
                        { id: "mdMeter", value: activeFilters.mdMeter ?? false, class: "MD" },
                    ];
                    const classMatch =
                        classFilters.every((f) => !f.value) ||
                        classFilters.some((filter) => filter.value && meter.class === filter.class);

                    return statusMatch && classMatch;
                } else {
                    const meter = item as VirtualMeterData;

                    // Virtual meter status filter
                    const statusFilters = [
                        { id: "assigned", value: activeFilters.assigned ?? false, status: "Assigned" },
                        { id: "deactivated", value: activeFilters.deactivated ?? false, status: "Deactivated" },
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
                    ? [
                        item.meterNumber,
                        (item as MeterData).approvalStatus,
                        item.status,
                        (item as MeterData).class,
                    ]
                        .filter((value): value is string => value != null)
                        .some((value) => value.toLowerCase().includes(term.toLowerCase()))
                    : [
                        item.meterNumber,
                        (item as VirtualMeterData).customerId,
                        (item as VirtualMeterData).accountNumber,
                        (item as VirtualMeterData).tariff,
                        item.status,
                    ]
                        .filter((value): value is string => value != null)
                        .some((value) => value.toLowerCase().includes(term.toLowerCase()))
            );
        }

        // Apply sorting
        if (sortBy) {
            results = [...results].sort((a, b) => {
                let aValue = ""; // Removed : string
                let bValue = ""; // Removed : string

                if (activeTab === "actual") {
                    const meterA = a as MeterData;
                    const meterB = b as MeterData;
                    aValue = (meterA[sortBy as keyof MeterData] ?? "") as string;
                    bValue = (meterB[sortBy as keyof MeterData] ?? "") as string;
                } else {
                    const meterA = a as VirtualMeterData;
                    const meterB = b as VirtualMeterData;
                    aValue = (meterA[sortBy as keyof VirtualMeterData] ?? "") as string;
                    bValue = (meterB[sortBy as keyof VirtualMeterData] ?? "") as string;
                }

                if (aValue < bValue) return direction === "asc" ? -1 : 1;
                if (aValue > bValue) return direction === "asc" ? 1 : -1;
                return 0;
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
        const currentData = activeTab === "actual" ? data : virtualData;
        if (selectedTariffs.length === currentData.length) {
            setSelectedTariffs([]);
        } else {
            setSelectedTariffs(currentData.map((item) => item.id));
        }
    };

    const handleSaveMeter = (updatedMeter: MeterData | VirtualMeterData) => {
        if (editMeter) {
            if (activeTab === "actual" && "meterManufacturer" in updatedMeter) {
                setData((prev) =>
                    prev.map((meter) => (meter.id === updatedMeter.id ? updatedMeter as MeterData : meter))
                );
            } else if (activeTab === "virtual" && "customerId" in updatedMeter) {
                setVirtualData((prev) =>
                    prev.map((meter) => (meter.id === updatedMeter.id ? updatedMeter as VirtualMeterData : meter))
                );
            }
            setEditMeter(undefined);
        } else {
            if (activeTab === "actual" && "meterManufacturer" in updatedMeter) {
                setData((prev) => [...prev, updatedMeter as MeterData]);
            } else if (activeTab === "virtual" && "customerId" in updatedMeter) {
                setVirtualData((prev) => [...prev, updatedMeter as VirtualMeterData]);
            }
        }
    };

    const handleSaveMeterForActual = (meter: MeterData) => {
        handleSaveMeter(meter);
    };


    const handleActivate = () => {
        if (selectedMeter) {
            if (activeTab === "actual" && "meterManufacturer" in selectedMeter) {
                setData((prev) =>
                    prev.map((meter) =>
                        meter.id === selectedMeter.id ? { ...meter, status: "InStock", reason: undefined } : meter
                    )
                );
            } else if (activeTab === "virtual" && "customerId" in selectedMeter) {
                setVirtualData((prev) =>
                    prev.map((meter) =>
                        meter.id === selectedMeter.id ? { ...meter, status: "Assigned", reason: undefined } : meter
                    )
                );
            }
            setIsDeactivateDialogOpen(false);
            setSelectedMeter(null);
        }
    };

    const handleDeactivate = (reason?: string) => {
        if (selectedMeter) {
            if (activeTab === "actual" && "meterManufacturer" in selectedMeter) {
                setData((prev) =>
                    prev.map((meter) =>
                        meter.id === selectedMeter.id ? { ...meter, status: "Deactivated", reason } : meter
                    )
                );
            } else if (activeTab === "virtual" && "customerId" in selectedMeter) {
                setVirtualData((prev) =>
                    prev.map((meter) =>
                        meter.id === selectedMeter.id ? { ...meter, status: "Deactivated", reason } : meter
                    )
                );
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
            if (activeTab === "actual" && "meterManufacturer" in selectedMeter) {
                setData((prev) =>
                    prev.map((meter) =>
                        meter.id === selectedMeter.id ? { ...meter, status: "Assigned", ...data } : meter
                    )
                );
            } else if (activeTab === "virtual" && "customerId" in selectedMeter) {
                setVirtualData((prev) =>
                    prev.map((meter) =>
                        meter.id === selectedMeter.id ? { ...meter, status: "Assigned", ...data } : meter
                    )
                );
            }
        }
    };


    const handleBulkUpload = (newData: (MeterData | VirtualMeterData)[]) => {
        if (activeTab === "actual") {
            setData((prev) => [...prev, ...(newData.filter((item) => "meterManufacturer" in item) as MeterData[])]);
        } else {
            setVirtualData((prev) => [...prev, ...(newData.filter((item) => "customerId" in item) as VirtualMeterData[])]);
        }
    };

    // MODIFIED: Handle saving edited virtual meter
    const handleSaveVirtualMeter = () => {
        if (editMeter && "customerId" in editMeter) {
            const updatedMeter: VirtualMeterData = {
                ...editMeter,
                accountNumber,
                cin,
                tariff,
                phone: phoneNumber,
                state,
                city,
                streetName,
                houseNo,
                status: editMeter.status, // Preserve existing status
            };
            setVirtualData((prev) =>
                prev.map((meter) => (meter.id === editMeter.id ? updatedMeter : meter))
            );
            setIsEditVirtualMeterOpen(false);
            setEditMeter(undefined);
            setSelectedMeter(null);
            // Reset form fields
            setAccountNumber("");
            setCin("");
            setTariff("");
            setPhoneNumber("");
            setState("");
            setCity("");
            setStreetName("");
            setHouseNo("");
        }
    };

    const handleOpenAddVirtualMeter = () => {
        setCustomerIdInput("");
        setFilteredCustomerIds([]);
        setSelectedCustomer(null);
        setSelectedPhysicalMeter("");
        setIsAddVirtualMeterOpen(true);
    };

    const handleCustomerIdChange = (value: string) => {
        setCustomerIdInput(value);
        if (value.trim() === "") {
            setFilteredCustomerIds([]);
        } else {
            const uniqueCustomerIds = Array.from(
                new Set(
                    virtualData
                        .filter((item) => item.customerId?.toLowerCase().includes(value.toLowerCase()))
                        .map((item) => item.customerId)
                )
            );
            setFilteredCustomerIds(uniqueCustomerIds.filter((id): id is string => id != null));
        }
    };
    const handleCustomerSelect = (customerId: string) => {
        const customer = virtualData.find((c) => c.customerId === customerId);
        if (customer) {
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
            });
            setCustomerIdInput(customerId);
            setFilteredCustomerIds([]);
            setIsAddVirtualMeterOpen(false);
            setAccountNumber("");
            setCin("");
            setFeederLine("");
            setDss("");
            setTariff("");
            setState("");
            setCity("");
            setStreetName("");
            setHouseNo("");
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
                    meter.id === selectedPhysicalMeter ? { ...meter, status: "Deactivated" } : meter
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
                feeder: feederLine,
                dss,
                cin,
                tariff,
                status: "Assigned",
                firstName: selectedCustomer.firstName ?? "",
                lastName: selectedCustomer.lastName ?? "",
                phone: selectedCustomer.phone ?? "",
            };

            setVirtualData((prev) => [...prev, newVirtualMeter]);
            setIsVirtualConfirmOpen(false);
            setSelectedCustomer(null);
            setIsDeactivatePhysicalOpen(false);
        }
    };

    const isFormComplete =
        accountNumber &&
        cin &&
        feederLine &&
        dss &&
        tariff &&
        state &&
        city &&
        streetName &&
        houseNo;

    const totalPages = Math.ceil((activeTab === "actual" ? data.length : virtualData.length) / rowsPerPage);
    const paginatedData = processedData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const changeTab = (tab: "actual" | "virtual") => {
        setActiveTab(tab);
        setSelectedTariffs([]);
        setCurrentPage(1);
        setActiveFilters({}); // Reset filters when switching tabs
    };

    const handleRowClick = (item: MeterData, event: React.MouseEvent<HTMLTableRowElement>) => {
        if ((event.target as HTMLElement).closest('input[type="checkbox"], button')) {
            return;
        }
        setViewMeter(item);
        setIsViewDetailsOpen(true);
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

    return (
        <div className="p-6 h-screen overflow-x-hidden">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <ContentHeader
                    title="Meters"
                    description="Manage and Access All Meter Records."
                />
                <div className="flex flex-col md:flex-row gap-2">
                    <Button
                        className="flex items-center gap-2 border font-medium border-[#161CCA] text-[#161CCA] w-full md:w-auto cursor-pointer"
                        variant="outline"
                        size="lg"
                        onClick={() => setIsBulkUploadDialogOpen(true)}
                    >
                        <CirclePlus size={14} strokeWidth={2.3} className="h-4 w-4" />
                        <span className="text-sm md:text-base">Bulk Upload</span>
                    </Button>
                    <Button
                        className="flex items-center gap-2 bg-[#161CCA] text-white font-medium w-full md:w-auto cursor-pointer"
                        variant="secondary"
                        size="lg"
                        onClick={() => {
                            if (activeTab === "actual") {
                                setEditMeter(undefined);
                                setIsAddDialogOpen(true);
                            } else {
                                handleOpenAddVirtualMeter();
                            }
                        }}
                    >
                        <CirclePlus size={14} strokeWidth={2.3} className="h-4 w-4" />
                        <span className="text-sm md:text-base">
                            {activeTab === "actual" ? "Add New Meter" : "Add Virtual Meter"}
                        </span>
                    </Button>
                </div>
            </div>

            <Card className="p-4 mb-4 border-none shadow-none bg-white">
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
                        <Card className="border-none shadow-none bg-white overflow-x-auto min-h-[calc(100vh-300px)]">
                            <Table className="table-auto w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="px-4 py-3 w-[100px]">
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    className="h-4 w-4 border-gray-500"

                                                    checked={selectedTariffs.length === data.length && data.length > 0}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setSelectedTariffs(data.map(item => item.id));
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
                                        <TableHead className="px-4 py-3 text-sm font-medium text-gray-900 text-center">Status</TableHead>
                                        <TableHead className="px-4 py-3 text-sm font-medium text-gray-900">Approval Status</TableHead>
                                        <TableHead className="px-4 py-3 text-sm font-medium text-gray-900 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.length === 0 ? (
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
                                                    onClick={(event) => handleRowClick(item, event)}
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
                                                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.oldsgc}</TableCell>
                                                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.newsgc}</TableCell>
                                                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.meterManufacturer}</TableCell>
                                                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.class}</TableCell>
                                                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.category}</TableCell>
                                                    <TableCell className="px-4 py-3 text-center">
                                                        <span className={cn("inline-block text-sm font-medium", getStatusStyle(item.status))}>
                                                            {item.status}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3">
                                                        <span className={cn("inline-block text-sm font-medium", getStatusStyle(item.approvalStatus))}>
                                                            {item.approvalStatus}
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
                        <Card className="border-none shadow-none bg-white min-h-[calc(100vh-300px)]">
                            <div className="overflow-x-auto">
                                <Table className="w-full table-auto">
                                    <TableHeader>
                                        <TableRow className="bg-gray-50 hover:bg-gray-50">
                                            <TableHead className="w-20 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        className="h-4 w-4 border-gray-500"
                                                        id="select-all-virtual"
                                                        checked={virtualData.length > 0 && selectedTariffs.length === virtualData.length}
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
                                        {virtualData.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={10} className="h-24 text-center text-sm text-gray-500">
                                                    No virtual meter available
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            paginatedData.map((item, index) =>
                                                "customerId" in item ? (
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
                                                            {item.feeder}
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

            <SelectCustomerDialog
                isOpen={isAddVirtualMeterOpen}
                onOpenChange={setIsAddVirtualMeterOpen}
                customerIdInput={customerIdInput}
                onCustomerIdChange={handleCustomerIdChange}
                filteredCustomerIds={filteredCustomerIds}
                onCustomerSelect={handleCustomerSelect}
            />

            <AddVirtualMeterDetailsDialog
                isOpen={
                    !isAddVirtualMeterOpen &&
                    selectedCustomer !== null &&
                    !isDeactivatePhysicalOpen &&
                    !isVirtualConfirmOpen
                }
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedCustomer(null);
                    }
                }}
                selectedCustomer={selectedCustomer}
                setSelectedCustomer={setSelectedCustomer}
                accountNumber={accountNumber}
                setAccountNumber={setAccountNumber}
                cin={cin}
                setCin={setCin}
                feederLine={feederLine}
                setFeederLine={setFeederLine}
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
                isFormComplete={!!isFormComplete}
                nigerianStates={nigerianStates}
                customerTypes={customerTypes}
            />

            <DeactivatePhysicalMeterDialog
                isOpen={isDeactivatePhysicalOpen}
                onOpenChange={(open) => {
                    setIsDeactivatePhysicalOpen(open);
                    if (!open) {
                        setSelectedPhysicalMeter(""); // Reset selected meter when closing
                    }
                }}
                onProceed={handleDeactivationComplete} // Use new handler
                onMeterSelect={setSelectedPhysicalMeter}
                meters={meters}
                address="5, Glorious Orimerumnu, Obafemi Owode, Ogun State"
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
                    editMeter && "customerId" in editMeter
                        ? {
                            ...editMeter,
                            feeder: editMeter.feeder ?? "",
                            dss: editMeter.dss ?? "",
                            cin: editMeter.cin ?? "",
                            tariff: editMeter.tariff ?? "",
                            status: editMeter.status ?? "",
                            firstName: editMeter.firstName ?? "",
                            lastName: editMeter.lastName ?? "",
                            phone: editMeter.phone ?? "",
                            state: editMeter.state ?? "",
                            city: editMeter.city ?? "",
                            streetName: editMeter.streetName ?? "",
                            houseNo: editMeter.houseNo ?? "",
                        }
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
                        ? editMeter as MeterData
                        : undefined
                }
            />
            <DeactivateDialog
                isOpen={isDeactivateDialogOpen}
                onClose={() => setIsDeactivateDialogOpen(false)}
                onDeactivate={selectedMeter?.status === "Deactivated" ? handleActivate : handleDeactivate}
                meterNumber={selectedMeter?.meterNumber ?? ""}
                action={selectedMeter?.status === "Deactivated" ? "activate" : "deactivate"}
            />
            {/* <ApproveDialog
                isOpen={isApproveDialogOpen}
                onClose={() => setIsApproveDialogOpen(false)}
                onApprove={handleApprove}
                meterNumber={selectedMeter?.meterNumber ?? ""}
            /> */}
            {/* <AssignDialog
                isOpen={isAssignDialogOpen}
                onClose={() => setIsAssignDialogOpen(false)}
                onAssign={handleAssign}
                meterNumber={selectedMeter?.meterNumber ?? ""}
            /> */}
            <BulkUploadDialog<MeterData>
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
                    "meterManufacturer",
                    "accountNumber",
                    "oldsgc",
                    "oldkrn",
                    "newkrn",
                    "newsgc",
                    "tariff",
                    "approvalStatus",
                    "status",
                ]}
                templateUrl="/templates/meter-template.xlsx"
            />
            <ViewMeterDetailsDialog
                isOpen={isViewDetailsOpen}
                onClose={() => setIsViewDetailsOpen(false)}
                meter={viewMeter}
            />
        </div>
    );
}
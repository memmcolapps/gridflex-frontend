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

} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AddMeterDialog } from "@/components/meter-management/add-edit-meter-dialog";
import { ApproveDialog, AssignDialog, DeactivateDialog } from "@/components/meter-management/meter-dialogs";
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

export default function MeterManagementPage() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedTariffs, setSelectedTariffs] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState<number>(12);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isBulkUploadDialogOpen, setIsBulkUploadDialogOpen] = useState(false);
    const [editMeter, setEditMeter] = useState<MeterData | VirtualMeterData | undefined>(undefined);
    const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
    const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
    const [selectedMeter, setSelectedMeter] = useState<MeterData | VirtualMeterData | null>(null);
    const [, setActiveFilters] = useState({});
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

    const filterSections = [
        {
            title: "Status",
            options: [
                { id: "inStock", label: "In-stock" },
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
            meterManufacturer: "MOMAS",
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
            status: "In-Stock",
        },
        {
            id: "MT-1004", meterNumber: "64533729273", meterType: "Electricity",
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
            status: "In-Stock",
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
            newkrn: "",
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
            state: "",
            city: "",
            streetName: "",
            houseNo: "",
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
            state: "",
            city: "",
            streetName: "",
            houseNo: "",
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
            state: "",
            city: "",
            streetName: "",
            houseNo: "",
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
            state: "",
            city: "",
            streetName: "",
            houseNo: "",
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
            state: "",
            city: "",
            streetName: "",
            houseNo: "",
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
            state: "",
            city: "",
            streetName: "",
            houseNo: "",
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
            state: "",
            city: "",
            streetName: "",
            houseNo: "",
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
            state: "",
            city: "",
            streetName: "",
            houseNo: "",
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
    const applyFiltersAndSort = (
        term: string,
        sortBy: keyof MeterData | keyof VirtualMeterData | null,
        direction: "asc" | "desc"
    ) => {
        if (activeTab === "actual") {
            let results = data;
            if (term.trim() !== "") {
                results = data.filter((item) =>
                    [
                        item.meterNumber,
                        item.approvalStatus,
                        item.status,
                        item.class,
                    ]
                        .filter((value): value is string => value != null)
                        .some((value) => value.toLowerCase().includes(term.toLowerCase()))
                );
            }

            if (sortBy) {
                results = [...results].sort((a, b) => {
                    const aValue = a[sortBy as keyof MeterData] ?? "";
                    const bValue = b[sortBy as keyof MeterData] ?? "";
                    if (aValue < bValue) return direction === "asc" ? -1 : 1;
                    if (aValue > bValue) return direction === "asc" ? 1 : -1;
                    return 0;
                });
            }

            setProcessedData(results);
        } else {
            let results = virtualData;
            if (term.trim() !== "") {
                results = virtualData.filter((item) =>
                    [
                        item.meterNumber,
                        item.customerId,
                        item.accountNumber,
                        item.tariff,
                        item.status,
                    ]
                        .filter((value): value is string => value != null)
                        .some((value) => value.toLowerCase().includes(term.toLowerCase()))
                );
            }

            if (sortBy) {
                results = [...results].sort((a, b) => {
                    const aValue = a[sortBy as keyof VirtualMeterData] ?? "";
                    const bValue = b[sortBy as keyof VirtualMeterData] ?? "";
                    if (aValue < bValue) return direction === "asc" ? -1 : 1;
                    if (aValue > bValue) return direction === "asc" ? 1 : -1;
                    return 0;
                });
            }

            setProcessedData(results);
        }
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

    const handleDeactivate = (reason: string) => {
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

    const handleApprove = () => {
        if (selectedMeter) {
            if (activeTab === "actual" && "meterManufacturer" in selectedMeter) {
                setData((prev) =>
                    prev.map((meter) =>
                        meter.id === selectedMeter.id ? { ...meter, approvalStatus: "Approved" } : meter
                    )
                );
            } else if (activeTab === "virtual" && "customerId" in selectedMeter) {
                setVirtualData((prev) =>
                    prev.map((meter) =>
                        meter.id === selectedMeter.id ? { ...meter, status: "Approved" } : meter
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
        if (selectedPhysicalMeter) {
            console.log("Deactivating physical meter:", selectedPhysicalMeter);
        }
        setIsDeactivatePhysicalOpen(false);
        setIsVirtualConfirmOpen(true);
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
    };

    const handleRowClick = (item: MeterData, event: React.MouseEvent<HTMLTableRowElement>) => {
        if ((event.target as HTMLElement).closest('input[type="checkbox"], button')) {
            return;
        }
        setViewMeter(item);
        setIsViewDetailsOpen(true);
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
                            />
                            <FilterControl
                                sections={filterSections}
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
                                                        <span className="inline-block px-3 py-1 rounded-2xl text-sm font-medium">
                                                            {item.status === "Assigned" && (
                                                                <span className="text-green-600 bg-green-100 p-1 rounded-full">Assigned</span>
                                                            )}
                                                            {item.status === "In-Stock" && (
                                                                <span className="text-blue-600 bg-[#E9F6FF] p-1 rounded-full">In-Stock</span>
                                                            )}
                                                            {item.status === "Unassigned" && (
                                                                <span className="text-yellow-500 bg-[#FFF5EA] p-1 rounded-full">Unassigned</span>
                                                            )}
                                                            {item.status !== "Assigned" && item.status !== "In-Stock" && item.status !== "Unassigned" && (
                                                                <span className="text-gray-900">{item.status}</span>
                                                            )}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3">
                                                        <span className="inline-block px-3 py-1 rounded-2xl text-sm font-medium">
                                                            {item.approvalStatus === "Approved" && (
                                                                <span className="text-blue-600 bg-[#E9F6FF] p-1 rounded-full">Approved</span>
                                                            )}
                                                            {item.approvalStatus === "Rejected" && (
                                                                <span className="text-red-600 bg-red-100 p-1 rounded-full">Rejected</span>
                                                            )}
                                                            {item.approvalStatus === "Pending" && (
                                                                <span className="text-yellow-500 bg-[#FFF5EA] p-1 rounded-full">Pending</span>
                                                            )}
                                                            {item.approvalStatus !== "Approved" && item.approvalStatus !== "Rejected" && item.approvalStatus !== "Pending" && (
                                                                <span className="text-gray-900">{item.approvalStatus}</span>
                                                            )}
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
                                                                    disabled={item.status === "Deactivated"}
                                                                    onClick={(event) => {
                                                                        event.stopPropagation();
                                                                        setSelectedMeter(item);
                                                                        setIsDeactivateDialogOpen(true);
                                                                    }}
                                                                >
                                                                    <Ban size={14} />
                                                                    <span className="text-sm text-gray-700">Deactivate</span>
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
                        <Card className="border-none shadow-none bg-white overflow-x-auto min-h-[calc(100vh-300px)]">
                            <Table className="table-auto w-full">
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
                                        <TableHead className="min-w-[120px] px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer ID</TableHead>
                                        <TableHead className="min-w-[120px] px-4 py-3 text-left text-sm font-semibold text-gray-700">Meter Number</TableHead>
                                        <TableHead className="min-w-[120px] px-4 py-3 text-left text-sm font-semibold text-gray-700">Account Number</TableHead>
                                        <TableHead className="min-w-[100px] px-4 py-3 text-left text-sm font-semibold text-gray-700">Feeder</TableHead>
                                        <TableHead className="min-w-[100px] px-4 py-3 text-left text-sm font-semibold text-gray-700">DSS</TableHead>
                                        <TableHead className="min-w-[120px] px-4 py-3 text-left text-sm font-semibold text-gray-700">CIN</TableHead>
                                        <TableHead className="min-w-[100px] px-4 py-3 text-left text-sm font-semibold text-gray-700">Tariff</TableHead>
                                        <TableHead className="min-w-[100px] px-4 py-3 text-center text-sm font-semibold text-gray-700">Status</TableHead>
                                        <TableHead className="w-20 px-4 py-3 text-right text-sm font-semibold text-gray-700">Actions</TableHead>
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
                                                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.customerId}</TableCell>
                                                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.meterNumber}</TableCell>
                                                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.accountNumber}</TableCell>
                                                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.feeder}</TableCell>
                                                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.dss}</TableCell>
                                                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.cin}</TableCell>
                                                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.tariff}</TableCell>
                                                    <TableCell className="px-4 py-3 text-center">
                                                        <span className="inline-block px-3 py-1 rounded-2xl text-sm font-medium">
                                                            {item.status === "Assigned" && (
                                                                <span className="text-green-600 bg-green-100 p-1 rounded-full">Assigned</span>
                                                            )}
                                                            {item.status === "Deactivated" && (
                                                                <span className="text-red-600 bg-red-100 p-1 rounded-full">Deactivated</span>
                                                            )}
                                                            {item.status !== "Assigned" && item.status !== "Deactivated" && (
                                                                <span className="text-gray-900">{item.status}</span>
                                                            )}
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
                                                                    onClick={() => {
                                                                        setSelectedMeter(item);
                                                                        setEditMeter(item);
                                                                        setIsEditVirtualMeterOpen(true); // MODIFIED: Open Edit Virtual Meter dialog
                                                                    }}
                                                                >
                                                                    <Pencil size={14} />
                                                                    <span className="text-sm text-gray-700">Edit Meter</span>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    className="flex items-center gap-2 cursor-pointer"
                                                                    disabled={item.status === "Deactivated"}
                                                                    onClick={() => {
                                                                        setSelectedMeter(item);
                                                                        setIsDeactivateDialogOpen(true);
                                                                    }}
                                                                >
                                                                    <Ban size={14} />
                                                                    <span className="text-sm text-gray-700">Deactivate</span>
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
                </Tabs>
            </Card>

            <div className="flex justify-between items-center py-4 px-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <span>Rows per page</span>
                    <select
                        value={rowsPerPage}
                        onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
                        className="w-16 border-gray-300 rounded-md text-sm"
                    >
                        <option value="12">12</option>
                        <option value="24">24</option>
                        <option value="48">48</option>
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <span>
                        {(activeTab === "actual" ? data.length : virtualData.length) > 0
                            ? `1-${paginatedData.length} of ${activeTab === "actual" ? data.length : virtualData.length}`
                            : "0-0 of 0"} rows
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages || (activeTab === "actual" ? data.length : virtualData.length) === 0}
                    >
                        Next
                    </Button>
                </div>
            </div>

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
                onProceed={handleProceedToDeactivate}
                isFormComplete={!!isFormComplete}
                nigerianStates={nigerianStates}
            />

            <DeactivatePhysicalMeterDialog
                isOpen={isDeactivatePhysicalOpen}
                onOpenChange={setIsDeactivatePhysicalOpen}
                onProceed={handleProceedToDeactivate}
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
                onDeactivate={handleDeactivate}
                meterNumber={selectedMeter?.meterNumber ?? ""}
            />
            <ApproveDialog
                isOpen={isApproveDialogOpen}
                onClose={() => setIsApproveDialogOpen(false)}
                onApprove={handleApprove}
                meterNumber={selectedMeter?.meterNumber ?? ""}
            />
            <AssignDialog
                isOpen={isAssignDialogOpen}
                onClose={() => setIsAssignDialogOpen(false)}
                onAssign={handleAssign}
                meterNumber={selectedMeter?.meterNumber ?? ""}
            />
            <BulkUploadDialog
                isOpen={isBulkUploadDialogOpen}
                onClose={() => setIsBulkUploadDialogOpen(false)}
                onSave={handleBulkUpload}
            />
            <ViewMeterDetailsDialog
                isOpen={isViewDetailsOpen}
                onClose={() => setIsViewDetailsOpen(false)}
                meter={viewMeter}
            />
        </div>
    );
}

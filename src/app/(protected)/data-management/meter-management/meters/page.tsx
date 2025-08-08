

/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style, @typescript-eslint/prefer-optional-chain */


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
import type { MeterData, VirtualMeterData } from "@/types/meter";
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



const initialMeterData = [
    {
        id: "MT-0001",
        customerId: "C-0123456790",
        meterNumber: "62010229441",
        simNo: "SIM-0001",
        class: "Single Phase",
        category: "Prepaid",
        meterType: "Electricity",
        oldTariffIndex: "1",
        newTariffIndex: "2",
        manufactureName: "Momas",
        accountNumber: "20250129544",
        oldSgc: "SGC-0001",
        oldKrn: "KRN-0001",
        newKrn: "KRN-1001",
        newSgc: "SGC-1001",
        tariff: "Residential",
        assignedStatus: "Pending",
        status: "InStock",
        cin: "C0123456790",
        firstName: "Shina",
        lastName: "Tiger",
        phone: "08098765343",
        image: null,
    },
    {
        id: "MT-0002",
        customerId: "C-1234567891",
        meterNumber: "62010229442",
        simNo: "SIM-0002",
        class: "Three Phase",
        category: "Postpaid",
        meterType: "Electricity",
        oldTariffIndex: "1",
        newTariffIndex: "2",
        manufactureName: "Momas",
        accountNumber: "20250129545",
        oldSgc: "SGC-0002",
        oldKrn: "KRN-0002",
        newKrn: "KRN-1002",
        newSgc: "SGC-1002",
        tariff: "Residential",
        assignedStatus: "Approved",
        status: "Assigned",
        cin: "C1234567891",
        firstName: "Seun",
        lastName: "Tope",
        phone: "09043216161",
        image: null,
    },
    {
        id: "MT-0003",
        customerId: "C-2345678902",
        meterNumber: "62010229443",
        simNo: "SIM-0003",
        class: "MD",
        category: "Prepaid",
        meterType: "Electricity",
        oldTariffIndex: "1",
        newTariffIndex: "2",
        manufactureName: "Momas",
        accountNumber: "20250129546",
        oldSgc: "SGC-0003",
        oldKrn: "KRN-0003",
        newKrn: "KRN-1003",
        newSgc: "SGC-1003",
        tariff: "Residential",
        assignedStatus: "Pending",
        status: "InStock",
        cin: "C2345678902",
        firstName: "",
        lastName: "",
        phone: "08098765343",
        image: null,
    },
    {
        id: "MT-0004",
        customerId: "C-3456789013",
        meterNumber: "62010229444",
        simNo: "SIM-0004",
        class: "Single Phase",
        category: "Postpaid",
        meterType: "Electricity",
        oldTariffIndex: "1",
        newTariffIndex: "2",
        manufactureName: "Momas",
        accountNumber: "20250129547",
        oldSgc: "SGC-0004",
        oldKrn: "KRN-0004",
        newKrn: "KRN-1004",
        newSgc: "SGC-1004",
        tariff: "Residential",
        assignedStatus: "Approved",
        status: "Assigned",
        cin: "C3456789013",
        firstName: "",
        lastName: "",
        phone: "08098765343",
        image: null,
    },
    {
        id: "MT-0005",
        customerId: "C-4567890124",
        meterNumber: "62010229445",
        simNo: "SIM-0005",
        class: "Three Phase",
        category: "Prepaid",
        meterType: "Electricity",
        oldTariffIndex: "1",
        newTariffIndex: "2",
        manufactureName: "Momas",
        accountNumber: "20250129548",
        oldSgc: "SGC-0005",
        oldKrn: "KRN-0005",
        newKrn: "KRN-1005",
        newSgc: "SGC-1005",
        tariff: "Residential",
        assignedStatus: "Pending",
        status: "InStock",
        cin: "C4567890124",
        firstName: "",
        lastName: "",
        phone: "08098765343",
        image: null,
    },
    {
        id: "MT-0006",
        customerId: "C-5678901235",
        meterNumber: "62010229446",
        simNo: "SIM-0006",
        class: "MD",
        category: "Postpaid",
        meterType: "Electricity",
        oldTariffIndex: "1",
        newTariffIndex: "2",
        manufactureName: "Momas",
        accountNumber: "20250129549",
        oldSgc: "SGC-0006",
        oldKrn: "KRN-0006",
        newKrn: "KRN-1006",
        newSgc: "SGC-1006",
        tariff: "Residential",
        assignedStatus: "Approved",
        status: "Assigned",
        cin: "C5678901235",
        firstName: "",
        lastName: "",
        phone: "08098765343",
        image: null,
    },
    {
        id: "MT-0007",
        customerId: "C-6678901236",
        meterNumber: "62010229446",
        simNo: "SIM-0007",
        class: "Single Phase",
        category: "Postpaid",
        meterType: "Electricity",
        oldTariffIndex: "1",
        newTariffIndex: "2",
        manufactureName: "Momas",
        accountNumber: "20250179549",
        oldSgc: "SGC-0007",
        oldKrn: "KRN-0007",
        newKrn: "KRN-1007",
        newSgc: "SGC-1007",
        tariff: "Residential",
        assignedStatus: "Approved",
        status: "Assigned",
        cin: "C5678901235",
        firstName: "",
        lastName: "",
        phone: "08098765343",
        image: null,
    },
    {
        id: "MT-0008",
        customerId: "C-7678901235",
        meterNumber: "62010229446",
        simNo: "SIM-0008",
        class: "Three Phase",
        category: "Postpaid",
        meterType: "Electricity",
        oldTariffIndex: "1",
        newTariffIndex: "2",
        manufactureName: "Momas",
        accountNumber: "20250129559",
        oldSgc: "SGC-0008",
        oldKrn: "KRN-0008",
        newKrn: "KRN-1008",
        newSgc: "SGC-1008",
        tariff: "Residential",
        assignedStatus: "Approved",
        status: "Assigned",
        cin: "C5678901235",
        firstName: "",
        lastName: "",
        phone: "08098765343",
        image: null,
    },
    {
        id: "MT-0009",
        customerId: "C-8678901235",
        meterNumber: "62010229446",
        simNo: "SIM-0009",
        class: "MD",
        category: "Postpaid",
        meterType: "Electricity",
        oldTariffIndex: "1",
        newTariffIndex: "2",
        manufactureName: "Momas",
        accountNumber: "20250129249",
        oldSgc: "SGC-0009",
        oldKrn: "KRN-0009",
        newKrn: "KRN-1009",
        newSgc: "SGC-1009",
        tariff: "Residential",
        assignedStatus: "Approved",
        status: "Assigned",
        cin: "C5678901235",
        firstName: "",
        lastName: "",
        phone: "08098765343",
        image: null,
    },
];


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
    const [feeder, setFeeder] = useState("");
    const [dss, setDss] = useState("");
    const [tariff, setTariff] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [streetName, setStreetName] = useState("");
    const [houseNo, setHouseNo] = useState("");
    const [energyType, setEnergyType] = useState(""); // <-- Added this line
    const [fixedEnergy, setFixedEnergy] = useState(""); // <-- Added for fixedEnergy
    const [isEditVirtualMeterOpen, setIsEditVirtualMeterOpen] = useState(false);
    // const [phoneNumber, setPhoneNumber] = useState("");
    const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
    const [viewMeter, setViewMeter] = useState<MeterData | null>(null);
    const [isCustomerIdModalOpen, setIsCustomerIdModalOpen] = useState(false);
    const [meterData, setMeterData] = useState<MeterData[]>(initialMeterData);
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
    const [editCustomer, setEditCustomer] = useState<MeterData | null>(null);
    const [isUploadImageOpen, setIsUploadImageOpen] = useState(false);
    const [isConfirmImageOpen, setIsConfirmImageOpen] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [viewVirtualMeter, setViewVirtualMeter] = useState<VirtualMeterData | null>(null);
    const [isViewActualDetailsOpen, setIsViewActualDetailsOpen] = useState(false);
    const [isViewVirtualDetailsOpen, setIsViewVirtualDetailsOpen] = useState(false);

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
            const filtered = Array.from(
                new Set(
                    (activeTab === "actual" ? meterData : virtualData)
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
        const customer = meterData.find((item) => item.customerId === customerId);
        if (customer && customer.customerId) {
            setSelectedCustomer({
                id: customer.id ?? "",
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
            alert("Customer not found or no valid customer ID. Please select a valid customer ID.");
        }
    };

    const handleProceedFromAssign = () => {
        setSelectedCustomer((prev) => {
            if (!prev?.customerId) {
                console.error("No valid customer selected or customerId is missing");
                alert("Please select a valid customer before proceeding.");
                return prev; // Return unchanged state to avoid errors
            }

            const updatedCustomer: VirtualMeterData = {
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
                category: category ?? prev?.category ?? "",
                consumptionType: prev?.consumptionType ?? "Non-MD", // Required by VirtualMeterData
                // Include optional fields if needed
                phone: prev?.phone ?? "",
                firstName: prev?.firstName ?? "",
                lastName: prev?.lastName ?? "",
                image: prev?.image ?? null,
                status: prev?.status ?? "Assigned",
            };
            setIsAssignModalOpen(false);
            setIsUploadImageOpen(true);
            setProgress(60);
            return updatedCustomer;
        });
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
        alert(`Meter assigned successfully for ${(selectedCustomer?.category ?? "").toLowerCase()} customer!`);
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
            alert(`Details and payment mode updated successfully for prepaid customer ${editCustomer.customerId}!`);
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
            simNo: "SIM-895623",
            oldSgc: "999962",
            newSgc: "600094",
            oldKrn: "900009",
            newKrn: "900876",
            manufactureName: "Momas",
            class: "MD",
            category: "Prepaid",
            accountNumber: "001/654321",
            tariff: "Residential",
            assignedStatus: "Deactivated",
            status: "Assigned",
            customerId: undefined,
            smartMeter: 'Smart'
        },

        {
            id: "MT-1002",
            meterNumber: "64533729273",
            meterType: "Electricity",
            oldTariffIndex: "1",
            newTariffIndex: "2",
            simNo: "SIM-895623",
            oldSgc: "999962",
            newSgc: "600094",
            oldKrn: "900009",
            newKrn: "906544",
            manufactureName: "MOMAS",
            class: "MD",
            category: "Postpaid",
            accountNumber: "001/654321",
            tariff: "Residential",
            assignedStatus: "Deactivated",
            status: "Assigned",
            customerId: undefined,
            smartMeter: 'Smart'
        },
        {
            id: "MT-1003",
            meterNumber: "64533729273",
            meterType: "Electricity",
            oldTariffIndex: "1",
            newTariffIndex: "2",
            simNo: "SIM-895623",
            oldSgc: "999962",
            newSgc: "600094",
            oldKrn: "900876",
            newKrn: "987654",
            manufactureName: "MOMAS",
            class: "MD",
            category: "Prepaid",
            accountNumber: "001/654321",
            tariff: "Residential",
            assignedStatus: "Active",
            status: "Unassigned",
            customerId: undefined
        },

        {
            id: "MT-1004",
            meterNumber: "64533729273",
            meterType: "Electricity",
            oldTariffIndex: "1",
            newTariffIndex: "2",
            simNo: "SIM-895623",
            oldSgc: "999962",
            newSgc: "600094",
            oldKrn: "",
            newKrn: "",
            manufactureName: "MOMAS",
            class: "MD",
            category: "Prepaid",
            accountNumber: "001/654321",
            tariff: "Residential",
            assignedStatus: "Active",
            status: "Unassigned",
            customerId: undefined
        },

        {
            id: "MT-1005",
            meterNumber: "64533729273",
            meterType: "Electricity",
            oldTariffIndex: "1",
            newTariffIndex: "2",
            simNo: "SIM-895623",
            oldSgc: "999962",
            newSgc: "600094",
            oldKrn: "908765",
            newKrn: "609865",
            manufactureName: "MOMAS",
            class: "MD",
            category: "Prepaid",
            accountNumber: "001/654321",
            tariff: "Residential",
            assignedStatus: "Active",
            status: "Assigned",
            customerId: undefined
        },
        {
            id: "MT-1006",
            meterNumber: "64533729273",
            meterType: "Electricity",
            oldTariffIndex: "1",
            newTariffIndex: "2",
            simNo: "SIM-895623",
            oldSgc: "999962",
            newSgc: "600094",
            oldKrn: "986543",
            newKrn: "900865",
            manufactureName: "MOMAS",
            class: "MD",
            category: "Postpaid",
            accountNumber: "001/654321",
            tariff: "Residential",
            assignedStatus: "Deactivated",
            status: "Assigned",
            customerId: undefined
        },
        {
            id: "MT-1007",
            meterNumber: "64533729273",
            meterType: "Electricity",
            oldTariffIndex: "1",
            newTariffIndex: "2",
            simNo: "SIM-895623",
            oldSgc: "999962",
            newSgc: "600094",
            oldKrn: "908766",
            newKrn: "908765",
            manufactureName: "MOMAS",
            class: "MD",
            category: "Prepaid",
            accountNumber: "001/654321",
            tariff: "Residential",
            assignedStatus: "Active",
            status: "Assigned",
            customerId: undefined
        },
        {
            id: "MT-1008",
            meterNumber: "64533729273",
            meterType: "Electricity",
            oldTariffIndex: "1",
            newTariffIndex: "2",
            simNo: "SIM-895623",
            oldSgc: "999962",
            newSgc: "600094",
            oldKrn: "898790",
            newKrn: "998866",
            manufactureName: "MOMAS",
            class: "MD",
            category: "Prepaid",
            accountNumber: "001/654321",
            tariff: "Residential",
            assignedStatus: "Active",
            status: "Unassigned",
            customerId: undefined
        },
        {
            id: "MT-1009",
            meterNumber: "64533729273",
            meterType: "Electricity",
            oldTariffIndex: "1",
            newTariffIndex: "2",
            simNo: "SIM-895623",
            oldSgc: "999962",
            newSgc: "600094",
            oldKrn: "909878",
            newKrn: "998888",
            manufactureName: "MOMAS",
            class: "MD",
            category: "Prepaid",
            accountNumber: "001/654321",
            tariff: "Residential",
            assignedStatus: "Deactivated",
            status: "Unassigned",
            customerId: undefined
        },
        {
            id: "MT-1018",
            meterNumber: "64533729273",
            meterType: "Electricity",
            oldTariffIndex: "1",
            newTariffIndex: "2",
            simNo: "SIM-895623",
            oldSgc: "999962",
            newSgc: "600094",
            oldKrn: "898790",
            newKrn: "998866",
            manufactureName: "MOMAS",
            class: "MD",
            category: "Prepaid",
            accountNumber: "001/654321",
            tariff: "Residential",
            assignedStatus: "Deactivated",
            status: "Unassigned",
            customerId: undefined
        },
        {
            id: "MT-1019",
            meterNumber: "64533729273",
            meterType: "Electricity",
            oldTariffIndex: "1",
            newTariffIndex: "2",
            simNo: "SIM-895623",
            oldSgc: "999962",
            newSgc: "600094",
            oldKrn: "909878",
            newKrn: "998765",
            manufactureName: "MOMAS",
            class: "MD",
            category: "Prepaid",
            accountNumber: "001/654321",
            tariff: "Residential",
            assignedStatus: "Pending",
            status: "Unassigned",
            customerId: undefined
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
            image: null, // Optional, for image upload
            consumptionType: 'Non-MD',
            energyType: 'Fixed',
            fixedEnergy: '200Kwh' // Optional, for fixed energy
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
            image: null,
            consumptionType: 'Non-MD',
            energyType: 'Fixed',
            fixedEnergy: '200Kwh'
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
            image: null,
            consumptionType: 'Non-MD',
            energyType: 'Fixed',
            fixedEnergy: '200Kwh'
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
            image: null,
            consumptionType: 'Non-MD',
            energyType: 'Fixed',
            fixedEnergy: '200Kwh'
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
            image: null,
            consumptionType: 'Non-MD',
            energyType: 'Fixed',
            fixedEnergy: '200Kwh'
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
            image: null,
            consumptionType: 'Non-MD',
            energyType: 'Fixed',
            fixedEnergy: '200Kwh'
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
            image: null,
            consumptionType: 'Non-MD',
            energyType: 'Fixed',
            fixedEnergy: '200Kwh'
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
            image: null,
            consumptionType: 'Non-MD'
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
            setPhone(virtualMeter.phone ?? "");
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

    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
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
                        classFilters.some((filter) => filter.value && meter.class === filter.class);

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
                        (item as MeterData).assignedStatus ?? "",
                        item.status,
                        (item as MeterData).class ?? "",
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
                    const meterA = a as MeterData;
                    const meterB = b as MeterData;
                    aValue = String(meterA[sortBy as keyof MeterData] ?? "");
                    bValue = String(meterB[sortBy as keyof MeterData] ?? "");
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
        const currentData = activeTab === "actual" ? data : virtualData;
        if (selectedTariffs.length === currentData.length) {
            setSelectedTariffs([]);
        } else {
            setSelectedTariffs(currentData.map((item) => item.id));
        }
    };

    const handleSaveMeter = (updatedMeter: MeterData | VirtualMeterData) => {
        if (editMeter) {
            if (activeTab === "actual" && "manufactureName" in updatedMeter) {
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
            if (activeTab === "actual" && "manufactureName" in updatedMeter) {
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
            if (activeTab === "actual" && "manufactureName" in selectedMeter) {
                setData((prev) =>
                    prev.map((meter) =>
                        meter.id === selectedMeter.id
                            ? { ...meter, assignedStatus: "Active", reason: undefined }
                            : meter
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
            if (activeTab === "actual" && "manufactureName" in selectedMeter) {
                setData((prev) =>
                    prev.map((meter) =>
                        meter.id === selectedMeter.id
                            ? { ...meter, assignedStatus: "Deactivated", reason }
                            : meter
                    )
                );
            } else if (activeTab === "virtual" && "customerId" in selectedMeter) {
                setVirtualData((prev) =>
                    prev.map((meter) =>
                        meter.id === selectedMeter.id ? { ...meter, status: "Deactivated", reason } : meter
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
            setData((prev) => [...prev, ...(newData.filter((item) => "manufactureName" in item) as MeterData[])]);
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
                prev.map((meter) => (meter.id === editMeter.id ? updatedMeter : meter))
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
        const customer = virtualData.find((c) => c.customerId === customerId);
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
            alert("Customer not found. Please select a valid customer ID.");
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
                                        <TableHead className="px-4 py-3 text-sm font-medium text-gray-900 text-center">Assigned Status</TableHead>
                                        <TableHead className="px-4 py-3 text-sm font-medium text-gray-900">Activation Status</TableHead>
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
                                            "manufactureName" in item ? (
                                                <TableRow
                                                    key={item.id}
                                                    className="hover:bg-gray-50 cursor-pointer"
                                                // onClick={(event) => handleRowClick(item, event)}
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
                                                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.simNo}</TableCell>
                                                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.oldSgc}</TableCell>
                                                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.newSgc}</TableCell>
                                                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.manufactureName}</TableCell>
                                                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.class}</TableCell>
                                                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.category}</TableCell>
                                                    <TableCell className="px-4 py-3 text-center">
                                                        <span className={cn("inline-block text-sm font-medium", getStatusStyle(item.status))}>
                                                            {item.status}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3">
                                                        <span className={cn("inline-block text-sm font-medium", getStatusStyle(item.assignedStatus))}>
                                                            {item.assignedStatus}
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
                                                                        setViewMeter(item);
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
                isFormComplete={!!isFormComplete}
                progress={progress}
                phone={phone}
                setPhone={setPhone}
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
            />

            <AddVirtualMeterDetailsDialog
                isOpen={
                    activeTab === "virtual" &&
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
                    editMeter && "customerId" in editMeter && typeof editMeter.customerId === "string"
                        ? {
                            id: editMeter.id,
                            customerId: editMeter.customerId,
                            meterNumber: editMeter.meterNumber ?? "",
                            accountNumber: editMeter.accountNumber ?? "",
                            feeder: editMeter.feeder ?? "",
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
                            custoType: (editMeter as VirtualMeterData).custoType ?? "",
                            energyType: (editMeter as VirtualMeterData).energyType ?? "",
                            fixedEnergy: (editMeter as VirtualMeterData).fixedEnergy ?? "",
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
                    activeTab === "actual" && editMeter && "manufactureName" in editMeter
                        ? editMeter as MeterData
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
                        ? activeTab === "actual" && "manufactureName" in selectedMeter
                            ? selectedMeter.assignedStatus === "Deactivated"
                                ? handleActivate
                                : handleDeactivate
                            : selectedMeter.status === "Deactivated"
                                ? handleActivate
                                : handleDeactivate
                        : handleDeactivate // Fallback for null selectedMeter
                }
                meterNumber={selectedMeter?.meterNumber ?? ""}
                action={
                    selectedMeter
                        ? activeTab === "actual" && "manufactureName" in selectedMeter
                            ? selectedMeter.assignedStatus === "Deactivated"
                                ? "activate"
                                : "deactivate"
                            : selectedMeter.status === "Deactivated"
                                ? "activate"
                                : "deactivate"
                        : "deactivate" // Fallback for null selectedMeter
                }
            />

            <DeactivateVirtualMeterDialog
                isOpen={isDeactivateModalOpen}
                onOpenChange={setIsDeactivateModalOpen}
                onProceed={handleProceedFromDeactivate}
            />

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
            />
        </div>
    );
}



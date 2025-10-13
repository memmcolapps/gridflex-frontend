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
    useChangeMeterState, 
    type AssignMeterPayload, 
    type ChangeMeterStatePayload, 
} from "@/hooks/use-assign-meter";
import { toast } from "sonner";
import { nigerianStates, customerTypes } from "@/constants";

const ITEMS_PER_PAGE = 10;

// Placeholder/Mock Type
interface MeterData {
    id: string;
    number: string;
    address: string;
}

export default function MeterManagementPage() {
    const [mounted, setMounted] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<keyof MeterInventoryItem | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState("actual");
    const [pageSize, setPageSize] = useState(ITEMS_PER_PAGE);

    // Dialog States
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
    const [isViewActualDetailsOpen, setIsViewActualDetailsOpen] = useState(false);
    const [isViewVirtualDetailsOpen, setIsViewVirtualDetailsOpen] = useState(false);
    const [isEditVirtualDialogOpen, setIsEditVirtualDialogOpen] = useState(false);
    const [isVirtualConfirmOpen, setIsVirtualConfirmOpen] = useState(false);
    const [isDeactivatePhysicalOpen, setIsDeactivatePhysicalOpen] = useState(false);
    const [isAddVirtualDetailsOpen, setIsAddVirtualDetailsOpen] = useState(false);
    const [isSelectCustomerOpen, setIsSelectCustomerOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isCustomerIdModalOpen, setIsCustomerIdModalOpen] = useState(false);
    const [isSetPaymentModalOpen, setIsSetPaymentModalOpen] = useState(false);
    const [isDeactivateVirtualOpen, setIsDeactivateVirtualOpen] = useState(false);
    const [isUploadImageOpen, setIsUploadImageOpen] = useState(false);
    const [isConfirmImageOpen, setIsConfirmImageOpen] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

    // Data States
    const [viewMeter, setViewMeter] = useState<MeterInventoryItem | null>(null);
    const [editMeter, setEditMeter] = useState<MeterInventoryItem | null>(null);
    const [viewVirtualMeter, setViewVirtualMeter] = useState<VirtualMeterData | null>(null);
    const [editVirtualMeter, setEditVirtualMeter] = useState<VirtualMeterData | null>(null);
    const [currentVirtualMeter, setCurrentVirtualMeter] = useState<VirtualMeterData | null>(null);

    // Assign Flow States
    const [flowCustomerData, setFlowCustomerData] = useState<Customer | null>(null);
    const [meterNumber, setMeterNumber] = useState("");
    const [cin, setCin] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [tariff, setTariff] = useState("");
    const [feeder, setFeeder] = useState("");
    const [dss, setDss] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [streetName, setStreetName] = useState("");
    const [houseNo, setHouseNo] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | MeterInventoryItem | VirtualMeterData | null>(null);
    const [category, setCategory] = useState("");
    
    // NEW STATE FOR CHANGE STATE LOGIC
    const [isChangeStateModalOpen, setIsChangeStateModalOpen] = useState(false);
    const [meterToChangeState, setMeterToChangeState] = useState<MeterInventoryItem | null>(null);
    const [targetState, setTargetState] = useState<'Activate' | 'Deactivate' | ''>('');
    // END NEW STATE

    const [phone, setPhone] = useState<string>("");
    const [virtualData, setVirtualData] = useState<VirtualMeterData[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Set mounted state to true after component mounts on client
    useEffect(() => {
        setMounted(true);
    }, []);

    // --- HOOKS ---
    const { data, isLoading, isError } = useMeters({
        page: currentPage,
        pageSize: pageSize,
        searchTerm,
        sortBy,
        sortDirection,
        type: activeTab === "actual" ? "NON-VIRTUAL" : "VIRTUAL",
    });

    const { data: customerRecordData } = useCustomerRecordQuery(phone); 

    // --- MUTATIONS ---
    const saveMeterMutation = useSaveMeter();
    const activateMeterMutation = useActivateMeter();
    const deactivateMeterMutation = useDeactivateMeter();
    const assignMeterMutation = useAssignMeter(); // Used for assignment
    const bulkUploadMutation = useBulkUploadMeters();
    const saveVirtualMeterMutation = useSaveVirtualMeter();
    const deactivatePhysicalMutation = useDeactivatePhysicalMeter();
    const createVirtualMeterMutation = useCreateVirtualMeter();
    const changeStateMutation = useChangeMeterState(); // Used for Activate/Deactivate

    // --- MOCK DATA/FETCHING ---
    useEffect(() => {
        if (customerRecordData) {
            setFlowCustomerData(customerRecordData as Customer);
        }
    }, [customerRecordData]);

    // --- HANDLERS ---

    // Handler to open the confirmation dialog for Activate/Deactivate
    const handleOpenChangeState = (meter: MeterInventoryItem, action: 'Activate' | 'Deactivate') => {
        setMeterToChangeState(meter);
        setTargetState(action);
        setIsChangeStateModalOpen(true);
    };

    // Handler to execute the state change mutation
    const handleConfirmChangeState = async () => {
        if (!meterToChangeState || !targetState) return;

        const payload: ChangeMeterStatePayload = {
            meterNumber: meterToChangeState.meterNumber,
            status: targetState,
        };

        try {
            await changeStateMutation.mutateAsync(payload);
        } catch (e: any) {
            toast.error(e.message || `Failed to ${targetState.toLowerCase()} meter.`);
        } finally {
            setIsChangeStateModalOpen(false);
            setMeterToChangeState(null);
            setTargetState('');
        }
    };

    // Assign Meter Confirmation Handler
    const handleConfirmAssignment = async () => {
        if (!flowCustomerData || !meterNumber || !category || !cin || !tariff || !feeder || !dss || !accountNumber || !state || !city || !streetName || !houseNo) {
            toast.error("Missing required assignment data.");
            return;
        }

        // Prepare the payload for the new POST /meter/service/cin/assign API
        const payload: AssignMeterPayload = {
            meterNumber: meterNumber,
            cin: cin,
            tariff: tariff,
            feeder: feeder,
            dss: dss,
            accountNumber: accountNumber,
            category: category,
            state: state,
            city: city,
            streetName: streetName,
            houseNo: houseNo,
            latitude: "0", 
            longitude: "0", 
        };

        try {
            await assignMeterMutation.mutateAsync(payload);
            toast.success(`Meter ${meterNumber} assigned to CIN ${cin} successfully!`);
            // Reset states for the assignment flow
            setIsConfirmationModalOpen(false);
            setIsAssignModalOpen(false); 
            setMeterNumber("");
        } catch (e: any) {
            toast.error(e.message || "Failed to assign meter.");
        }
    };
    
    // Handler to cancel assignment flow and reset states
    const handleCancelConfirmation = () => {
        setIsConfirmationModalOpen(false);
        setMeterNumber("");
        setFlowCustomerData(null);
        setSelectedCustomer(null);
        // Reset all assign flow states
        setCin("");
        setAccountNumber("");
        setTariff("");
        setFeeder("");
        setDss("");
        setState("");
        setCity("");
        setStreetName("");
        setHouseNo("");
        setCategory("");
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handlePageSizeChange = (size: string) => {
        setPageSize(Number(size));
        setCurrentPage(1); // Reset to first page when page size changes
    };

    const handleSort = (key: keyof MeterInventoryItem) => {
        if (sortBy === key) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortBy(key);
            setSortDirection("asc");
        }
    };

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };

    // --- RENDER FUNCTIONS ---

    // Function to render the action dropdown with conditional logic
    const renderActionDropdown = (meter: MeterInventoryItem) => {
        // Normalize status strings to upper case for reliable comparison
        const status = meter.status?.toUpperCase() || '';
        const meterStage = meter.meterStage?.toUpperCase() || '';

        const isActive = status === "ACTIVE";
        const isInactive = status === "INACTIVE";

        const isAssigned = meterStage === "ASSIGNED";
        const isPending = meterStage === "PENDING APPROVAL";
        
        // Show Assign only if not assigned and not pending
        const showAssign = !isAssigned && !isPending;
        
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    
                    {/* View Details (Always visible) */}
                    <DropdownMenuItem
                        onClick={() => {
                            setViewMeter(meter);
                            setIsViewActualDetailsOpen(true);
                        }}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <Eye className="h-4 w-4" />
                        View Details
                    </DropdownMenuItem>

                    {isPending && (
                        // PENDING: Only show Wait for Approval (disabled/informative)
                        <DropdownMenuItem disabled className="text-yellow-600">
                            Wait for Approval
                        </DropdownMenuItem>
                    )}

                    {showAssign && (
                        // UNASSIGNED: Show Assign Meter
                        <DropdownMenuItem
                            onClick={() => {
                                // Logic to start the assignment flow: set meter, open customer ID dialog
                                setMeterNumber(meter.meterNumber);
                                setIsCustomerIdModalOpen(true);
                                setFlowCustomerData(null);
                            }}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <Pencil className="h-4 w-4" />
                            Assign Meter
                        </DropdownMenuItem>
                    )}

                    {isAssigned && isActive && (
                        // ACTIVE METER: Show Edit and Deactivate
                        <>
                            <DropdownMenuItem
                                onClick={() => {
                                    setEditMeter(meter);
                                    setIsAddDialogOpen(true);
                                }}
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <Pencil className="h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleOpenChangeState(meter, 'Deactivate')}
                                className="flex items-center gap-2 cursor-pointer text-red-600"
                            >
                                <Ban className="h-4 w-4" />
                                Deactivate
                            </DropdownMenuItem>
                        </>
                    )}
                    
                    {isAssigned && isInactive && (
                        // DEACTIVATED METER: Show Activate
                        <DropdownMenuItem
                            onClick={() => handleOpenChangeState(meter, 'Activate')}
                            className="flex items-center gap-2 cursor-pointer text-green-600"
                        >
                            <CheckCircle className="h-4 w-4" />
                            Activate
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        );
    };

    const renderVirtualActionDropdown = (meter: VirtualMeterData) => {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={() => {
                            setViewVirtualMeter(meter);
                            setIsViewVirtualDetailsOpen(true);
                        }}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <Eye className="h-4 w-4" />
                        View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            setEditVirtualMeter(meter);
                            setIsEditVirtualDialogOpen(true);
                        }}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <Pencil className="h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    };

    const renderRow = (meter: MeterInventoryItem | VirtualMeterData) => {
        const isVirtual = "dss" in meter; 

        const displayMeter = meter as MeterInventoryItem;
        const statusStyle = getStatusStyle(displayMeter.status);
        const stageStyle = getStatusStyle(displayMeter.meterStage);

        return (
            <TableRow key={meter.id}>
                <TableCell>
                    <Checkbox />
                </TableCell>
                <TableCell className="font-medium">{displayMeter.meterNumber}</TableCell>
                <TableCell>{displayMeter.meterType}</TableCell>
                <TableCell>{displayMeter.meterManufacturer}</TableCell>
                <TableCell>{displayMeter.meterCategory}</TableCell>
                <TableCell>
                    <div className={cn("px-2 py-0.5 rounded-full text-xs font-medium w-fit", statusStyle.className)}>
                        {displayMeter.status}
                    </div>
                </TableCell>
                <TableCell>
                    <div className={cn("px-2 py-0.5 rounded-full text-xs font-medium w-fit", stageStyle.className)}>
                        {displayMeter.meterStage}
                    </div>
                </TableCell>
                <TableCell>
                    {isVirtual ? renderVirtualActionDropdown(meter as VirtualMeterData) : renderActionDropdown(displayMeter)}
                </TableCell>
            </TableRow>
        );
    };


    const actualMeters = data?.actualMeters || [];
    const virtualMeters = data?.virtualMeters || [];
    const totalData = data?.totalData || 0;
    const totalPages = Math.ceil(totalData / pageSize);

    if (!mounted) {
        return null;
    }

    return (
        <div className="space-y-6 p-6">
            <ContentHeader
                title="Meter Management"
                actions={
                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsBulkUploadOpen(true)}
                            className="text-[#161CCA] border-[#161CCA] hover:bg-[#161CCA]/10"
                        >
                            <SquareArrowOutUpRight className="mr-2 h-4 w-4" /> Bulk Upload
                        </Button>
                        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-[#161CCA] text-white hover:bg-[#161CCA]/90">
                            <CirclePlus className="mr-2 h-4 w-4" /> Add Meter
                        </Button>
                    </div>
                }
            />

            <Tabs defaultValue="actual" onValueChange={(value) => {
                setActiveTab(value);
                setCurrentPage(1); 
            }}>
                <TabsList className="bg-white border-b border-gray-200">
                    <TabsTrigger value="actual" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#161CCA] data-[state=active]:text-[#161CCA]">
                        Actual Meters
                    </TabsTrigger>
                    <TabsTrigger value="virtual" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#161CCA] data-[state=active]:text-[#161CCA]">
                        Virtual Meters
                    </TabsTrigger>
                </TabsList>

                <div className="flex justify-between items-center py-4">
                    <div className="flex gap-4">
                        <SearchControl
                            placeholder="Search by meter number, SIM number..."
                            searchTerm={searchTerm}
                            onSearch={handleSearch}
                        />
                        <FilterControl
                            filters={[
                                { key: "category", label: "Category", options: ["Prepaid", "Postpaid"] },
                                { key: "status", label: "Status", options: ["Active", "Inactive"] },
                            ]}
                            onApply={(key, value) => { /* Handle filter application */ }}
                        />
                    </div>
                </div>

                <TabsContent value="actual" className="mt-0">
                    <Card className="p-4">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            <Checkbox />
                                        </TableHead>
                                        <TableHead onClick={() => handleSort("meterNumber" as keyof MeterInventoryItem)} className="cursor-pointer">Meter Number</TableHead>
                                        <TableHead onClick={() => handleSort("meterType" as keyof MeterInventoryItem)} className="cursor-pointer">Type</TableHead>
                                        <TableHead onClick={() => handleSort("meterManufacturer" as keyof MeterInventoryItem)} className="cursor-pointer">Manufacturer</TableHead>
                                        <TableHead onClick={() => handleSort("meterCategory" as keyof MeterInventoryItem)} className="cursor-pointer">Category</TableHead>
                                        <TableHead onClick={() => handleSort("status" as keyof MeterInventoryItem)} className="cursor-pointer">Status</TableHead>
                                        <TableHead onClick={() => handleSort("meterStage" as keyof MeterInventoryItem)} className="cursor-pointer">Stage</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center">Loading meters...</TableCell>
                                        </TableRow>
                                    ) : isError ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center text-red-500">Error loading meters.</TableCell>
                                        </TableRow>
                                    ) : actualMeters.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center">No actual meters found.</TableCell>
                                        </TableRow>
                                    ) : (
                                        actualMeters.map(renderRow)
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex items-center justify-between space-x-2 py-4">
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <span>Rows per page:</span>
                                <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
                                    <SelectTrigger className="h-8 w-[70px]">
                                        <SelectValue placeholder={pageSize} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="20">20</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        />
                                    </PaginationItem>
                                    <div className="text-sm text-muted-foreground px-4 flex items-center h-9">
                                        Page {currentPage} of {totalPages}
                                    </div>
                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages || totalPages === 0}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="virtual" className="mt-0">
                    <Card className="p-4">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            <Checkbox />
                                        </TableHead>
                                        <TableHead>Meter Number</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Manufacturer</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Stage</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center">Loading meters...</TableCell>
                                        </TableRow>
                                    ) : isError ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center text-red-500">Error loading meters.</TableCell>
                                        </TableRow>
                                    ) : virtualMeters.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center">No virtual meters found.</TableCell>
                                        </TableRow>
                                    ) : (
                                        virtualMeters.map(renderRow)
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex items-center justify-between space-x-2 py-4">
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <span>Rows per page:</span>
                                <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
                                    <SelectTrigger className="h-8 w-[70px]">
                                        <SelectValue placeholder={pageSize} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="20">20</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        />
                                    </PaginationItem>
                                    <div className="text-sm text-muted-foreground px-4 flex items-center h-9">
                                        Page {currentPage} of {totalPages}
                                    </div>
                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages || totalPages === 0}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* --- Dialogs --- */}

            <AddMeterDialog
                isOpen={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                meterToEdit={editMeter}
                onSave={() => { /* Handle meter save logic */ }}
            />

            <BulkUploadDialog
                isOpen={isBulkUploadOpen}
                onOpenChange={setIsBulkUploadOpen}
                expectedFields={[
                    "meterNumber", "simNumber", "meterCategory", "meterClass", "meterType", 
                    "oldTariffIndex", "newTariffIndex", "meterManufacturer", "accountNumber", 
                    "oldSgc", "oldKrn", "newKrn", "newSgc", "tariff", "approvalStatus", "status",
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

            {/* Dialog for getting Customer ID/Phone */}
            <CustomerIdDialog
                isOpen={isCustomerIdModalOpen}
                onOpenChange={setIsCustomerIdModalOpen}
                phone={phone}
                setPhone={setPhone}
                onProceed={() => {
                    setIsCustomerIdModalOpen(false);
                    setIsAssignModalOpen(true);
                }}
            />

            {/* Dialog for entering assignment details */}
            <AssignMeterDialog
                isOpen={isAssignModalOpen}
                onOpenChange={setIsAssignModalOpen}
                customer={flowCustomerData}
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
                onProceed={() => {
                    setSelectedCustomer(flowCustomerData);
                    setIsAssignModalOpen(false);
                    setIsConfirmationModalOpen(true);
                }}
            />

            {/* Dialog for Assign Confirmation (uses Assign Meter API) */}
            <ConfirmationModalDialog
                isOpen={isConfirmationModalOpen}
                onOpenChange={setIsConfirmationModalOpen}
                selectedCustomer={selectedCustomer}
                onConfirm={handleConfirmAssignment} 
                onCancel={handleCancelConfirmation}
            />

            {/* Dialog for Change State Confirmation (uses Change State API) */}
            {meterToChangeState && (
                <ConfirmationModalDialog
                    isOpen={isChangeStateModalOpen}
                    onOpenChange={setIsChangeStateModalOpen}
                    // Reusing ConfirmationModalDialog
                    selectedCustomer={{
                        ...meterToChangeState,
                        customerId: meterToChangeState.meterNumber, 
                    } as Customer}
                    onConfirm={handleConfirmChangeState} 
                    onCancel={() => {
                        setIsChangeStateModalOpen(false);
                        setMeterToChangeState(null);
                        setTargetState('');
                    }}
                />
            )}
        </div>
    );
}
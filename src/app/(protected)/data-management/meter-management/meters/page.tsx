/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import {
  CirclePlus,
  SquareArrowOutUpRight,
  MoreVertical,
  Ban,
  Pencil,
  CheckCircle,
  Eye,
  XCircle,
  AlertTriangle,
  ArrowUpDown,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BulkUploadDialog } from "@/components/meter-management/bulk-upload";
import { FilterControl, SearchControl } from "@/components/search-control";
import { ViewMeterDetailsDialog } from "@/components/meter-management/view-meters-details-dialog";
import { AssignMeterDialog } from "@/components/meter-management/assign-meter-dialog";
import { DeactivateDialog } from "@/components/meter-management/meter-dialogs";
import CustomerIdDialog from "@/components/meter-management/customer-id-dialog";
import { ConfirmationModalDialog } from "@/components/meter-management/confirmation-modal-dialog";
import { AddMeterDialog } from "@/components/meter-management/add-edit-meter-dialog";
import type { MeterInventoryItem } from "@/types/meter-inventory";
import { getStatusStyle } from "@/components/status-style";
import { cn } from "@/lib/utils";
import { PaginationControls } from "@/components/ui/pagination-controls";
import {
  useMeters,
  useAssignMeter,
  useChangeMeterState,
} from "@/hooks/use-assign-meter";
import { useCustomerRecordQuery } from "@/hooks/use-customer";
import type { AssignMeterPayload } from "@/service/assign-meter-service";
import { fetchCustomerRecord } from "@/service/customer-service";
import { LoadingAnimation } from "@/components/ui/loading-animation";
import {
  useDownloadAssignCsvTemplate,
  useDownloadAssignExcelTemplate,
  useBulkAssignMeters,
  useExportActualMeters,
} from "@/hooks/use-meter-bulk";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/use-permissions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { ContentHeader } from "@/components/ui/content-header";

export default function MeterManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTariffs, setSelectedTariffs] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAddMeterDialogOpen, setIsAddMeterDialogOpen] = useState(false);
  const [isBulkUploadDialogOpen, setIsBulkUploadDialogOpen] = useState(false);
  const [editMeter, setEditMeter] = useState<MeterInventoryItem | undefined>(
    undefined,
  );
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [selectedMeter, setSelectedMeter] = useState<MeterInventoryItem | null>(
    null,
  );
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>(
    {},
  );
  const [sortConfig, setSortConfig] = useState<{
    key: keyof MeterInventoryItem | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });
  const [processedData, setProcessedData] = useState<MeterInventoryItem[]>([]);
  const [customerIdInput, setCustomerIdInput] = useState("");
  const [filteredCustomerIds, setFilteredCustomerIds] = useState<string[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [cin, setCin] = useState("");
  const [feeder, setFeeder] = useState("");
  const [dss, setDss] = useState("");
  const [tariff, setTariff] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [streetName, setStreetName] = useState("");
  const [houseNo, setHouseNo] = useState("");
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
  const [paymentType, setPaymentType] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [paymentPlan, setPaymentPlan] = useState("");
  const [isSetPaymentModalOpen, setIsSetPaymentModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [phone, setPhone] = useState("");
  const [isUploadImageOpen, setIsUploadImageOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isViewActualDetailsOpen, setIsViewActualDetailsOpen] = useState(false);
  const [isBulkAssignDialogOpen, setIsBulkAssignDialogOpen] = useState(false);
  const [isAssignTemplateDropdownOpen, setIsAssignTemplateDropdownOpen] =
    useState(false);
  const [isAssignResultDialogOpen, setIsAssignResultDialogOpen] =
    useState(false);
  const [assignResult, setAssignResult] = useState<{
    successCount: number;
    failedCount: number;
    totalRecords: number;
    failedRecords: string[];
  } | null>(null);

  const {
    data: metersData,
    isLoading,
    isError,
  } = useMeters({
    page: currentPage,
    pageSize: rowsPerPage,
    searchTerm,
    sortDirection: sortConfig.direction,
    type: "allocated",
  });

  const { canEdit } = usePermissions();

  const { data: customerRecordData, isLoading: isCustomerRecordLoading } =
    useCustomerRecordQuery(customerIdInput);

  const assignMeterMutation = useAssignMeter();
  const changeStateMutation = useChangeMeterState();
  const bulkAssignMutation = useBulkAssignMeters();
  const downloadAssignCsvTemplateMutation = useDownloadAssignCsvTemplate();
  const downloadAssignExcelTemplateMutation = useDownloadAssignExcelTemplate();
  const exportActualMetersMutation = useExportActualMeters();

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
      const currentData = metersData?.actualMeters ?? [];
      const filtered = Array.from(
        new Set(
          currentData
            .filter((customer) =>
              customer.customerId?.toLowerCase().includes(value.toLowerCase()),
            )
            .map((customer) => customer.customerId)
            .filter((id): id is string => id != null),
        ),
      ) as string[];
      setFilteredCustomerIds(filtered);
    }
  };

  const handleCustomerIdSelect = async (customerId: string) => {
    try {
      // Fetch the customer record from API to get generated account number
      const customerRecord = await fetchCustomerRecord(customerId);

      if (customerRecord?.customer?.customerId) {
        const customer = customerRecord.customer;
        setSelectedCustomer({
          id: customer.customerId,
          customerId: customer.customerId,
          meterNumber: "",
          cin: "",
          accountNumber: customerRecord.GeneratedAccountNumber || "",
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
        setCustomerIdInput(customerId);
        setFilteredCustomerIds([]);
        setIsCustomerIdModalOpen(false);
        setIsAssignModalOpen(true);
        setProgress(50);
        setMeterNumber("");
        setCin("");
        setAccountNumber(customerRecord.GeneratedAccountNumber || "");
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
        setPaymentType("");
        setPaymentMode("");
        setPaymentPlan("");
        setCategory("");
      }
    } catch (error) {
      console.error("Failed to fetch customer record:", error);
      toast.error("Failed to fetch customer details. Please try again.");
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
      paymentType,
      paymentMode,
      paymentPlan,
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
        cin: "",
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
      setPaymentType("");
      setPaymentMode("");
      setPaymentPlan("");
      setCategory("");
    }
  };

  const handleProceedFromUploadImage = (image: File | null) => {
    setUploadedImage(image);
    setSelectedCustomer((prev: any) => (prev ? { ...prev, image } : prev));
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
                debitPaymentPlan:
                  debitMop === "one-off"
                    ? ""
                    : (debitPaymentPlan ?? item.debitPaymentPlan),
                creditPaymentPlan:
                  creditMop === "one-off"
                    ? ""
                    : (creditPaymentPlan ?? item.creditPaymentPlan),
                image: uploadedImage ?? item.image,
              }
            : item,
        ),
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

  const nigerianStates = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ];

  const customerTypes = ["Non-MD", "MD"];

  useEffect(() => {
    const actualMeters = metersData?.actualMeters ?? [];
    setProcessedData(actualMeters);
  }, [metersData]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    applyFiltersAndSort(term, sortConfig.key, sortConfig.direction);
  };

  const handleSortChange = () => {
    const sortKey: keyof MeterInventoryItem = sortConfig.key ?? "meterNumber";
    const newDirection: "asc" | "desc" =
      sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key: sortKey, direction: newDirection });
    applyFiltersAndSort(searchTerm, sortKey, newDirection);
  };

  const applyFiltersAndSort = (
    term: string,
    sortBy: keyof MeterInventoryItem | null,
    direction: "asc" | "desc",
  ) => {
    let results: MeterInventoryItem[] = metersData?.actualMeters ?? [];

    if (Object.keys(activeFilters).length > 0) {
      results = results.filter((item) => {
        const meter = item as MeterInventoryItem;
        const statusFilters = [
          {
            id: "assigned",
            value: activeFilters.assigned,
            status: "Assigned",
          },
          {
            id: "deactivated",
            value: activeFilters.deactivated,
            status: "Unassigned",
          },
        ];
        const statusMatch =
          statusFilters.every((f) => !f.value) ||
          statusFilters.some(
            (filter) => filter.value && meter.status === filter.status,
          );

        const classFilters = [
          {
            id: "singlePhase",
            value: activeFilters.singlePhase,
            class: "Single phase",
          },
          {
            id: "threePhase",
            value: activeFilters.threePhase,
            class: "Three Phase",
          },
          { id: "mdMeter", value: activeFilters.mdMeter, class: "MD" },
        ];
        const classMatch =
          classFilters.every((f) => !f.value) ||
          classFilters.some(
            (filter) => filter.value && meter.meterClass === filter.class,
          );

        return statusMatch && classMatch;
      });
    }

    if (term.trim() !== "") {
      results = results.filter((item) =>
        (
          [
            item.meterNumber,
            item.assignedStatus ?? "",
            item.status,
            item.meterClass ?? "",
          ] as string[]
        ).some((value) => value.toLowerCase().includes(term.toLowerCase())),
      );
    }

    if (sortBy) {
      results = [...results].sort((a, b) => {
        const aValue = String(a[sortBy] ?? "");
        const bValue = String(b[sortBy] ?? "");

        return direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });
    }
    setProcessedData(results);
  };

  const toggleSelection = (id: string) => {
    setSelectedTariffs(
      selectedTariffs.includes(id)
        ? selectedTariffs.filter((selectedId) => selectedId !== id)
        : [...selectedTariffs, id],
    );
  };

  const toggleSelectAll = () => {
    const currentData = metersData?.actualMeters ?? [];
    if (selectedTariffs.length === currentData.length) {
      setSelectedTariffs([]);
    } else {
      setSelectedTariffs(
        currentData.map((item) => item.id ?? item.customerId) as string[],
      );
    }
  };

  const handleSaveMeter = (updatedMeter: MeterInventoryItem) => {
    if (editMeter) {
      setMeterData((prev) =>
        prev.map((meter) =>
          meter.customerId === updatedMeter.customerId ? updatedMeter : meter,
        ),
      );
      setEditMeter(undefined);
    } else {
      setMeterData((prev) => [...prev, updatedMeter]);
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
      setMeterData((prev) =>
        prev.map((meter) =>
          meter.customerId === selectedMeter.customerId
            ? { ...meter, status: "Assigned", ...data }
            : meter,
        ),
      );
    }
  };

  const handleBulkUpload = (data: File | MeterInventoryItem[]) => {
    if (data instanceof File) {
      // Handle raw file if sendRawFile is true, but currently it's false
      console.warn("Raw file received, but not handled");
    } else {
      setMeterData((prev) => [...prev, ...data]);
    }
  };

  const handleBulkAssign = (data: File | MeterInventoryItem[]) => {
    if (data instanceof File) {
      bulkAssignMutation.mutate(data, {
        onSuccess: (response: unknown) => {
          const res = response as {
            responsecode: string;
            responsedesc: string;
            responsedata: {
              totalRecords: number;
              failedCount: number;
              failedRecords: string[];
              successCount: number;
            };
          };

          setIsBulkAssignDialogOpen(false);
          setIsAssignTemplateDropdownOpen(false);

          // Store result for detailed dialog
          setAssignResult(res.responsedata);
          setIsAssignResultDialogOpen(true);

          // Show brief success toast if any succeeded
          if (res.responsedata.successCount > 0) {
            toast.success(
              `${res.responsedata.successCount} of ${res.responsedata.totalRecords} meters assigned successfully!`,
            );
          }
        },
        onError: (error: unknown) => {
          console.error("Bulk assign failed:", error);
          const err = error as { message?: string };
          toast.error(err?.message ?? "Bulk assign failed");
          setIsBulkAssignDialogOpen(false);
          setIsAssignTemplateDropdownOpen(false);
        },
      });
    } else {
      setIsBulkAssignDialogOpen(false);
      setIsAssignTemplateDropdownOpen(false);
    }
  };

  const handleDownloadAssignCsvTemplate = () => {
    downloadAssignCsvTemplateMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Assign CSV template downloaded successfully");
      },
      onError: (error: unknown) => {
        const err = error as { message?: string };
        console.error("Assign CSV template download failed:", error);
        toast.error(err?.message ?? "Failed to download assign CSV template");
      },
    });
  };

  const handleDownloadAssignExcelTemplate = () => {
    downloadAssignExcelTemplateMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Assign Excel template downloaded successfully");
      },
      onError: (error: unknown) => {
        const err = error as { message?: string };
        console.error("Assign Excel template download failed:", error);
        toast.error(err?.message ?? "Failed to download assign Excel template");
      },
    });
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

  const totalPages = Math.ceil(
    (metersData?.actualMeters?.length ?? 0) / rowsPerPage,
  );
  const paginatedData = processedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

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
    <div className="h-screen overflow-x-hidden bg-transparent p-6">
      <div className="mb-4 flex flex-col items-center justify-between gap-4 bg-transparent md:flex-row">
        <ContentHeader
          title="Meters"
          description="Manage and access meter records."
        />
        {canEdit && (
          <div className="flex flex-col gap-2 bg-transparent md:flex-row">
            <Button
              className="flex w-full cursor-pointer items-center gap-2 border border-[#161CCA] font-medium text-[#161CCA] md:w-auto"
              variant="outline"
              size="lg"
              onClick={() => setIsBulkAssignDialogOpen(true)}
            >
              <CirclePlus size={14} strokeWidth={2.3} className="h-4 w-4" />
              <span className="text-sm md:text-base">Assign in Bulk</span>
            </Button>
            <Button
              className="flex w-full cursor-pointer items-center gap-2 bg-[#161CCA] font-medium text-white md:w-auto"
              variant="secondary"
              size="lg"
              onClick={handleOpenCustomerIdModal}
            >
              <CirclePlus size={14} strokeWidth={2.3} className="h-4 w-4" />
              <span className="text-sm md:text-base">Assign Meter</span>
            </Button>
          </div>
        )}
      </div>

      <Card className="mb-4 border-none bg-transparent p-4 shadow-none">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex w-full items-center gap-2 md:w-auto">
            <div className="relative">
              <SearchControl
                onSearchChange={handleSearchChange}
                value={searchTerm}
                placeholder="Search by Meter Number, SIM Number, or Status"
              />
            </div>
            <FilterControl
              sections={actualFilterSections}
              filterType="multi-section"
              onApply={(filters) => setActiveFilters(filters)}
              onReset={() => setActiveFilters({})}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full cursor-pointer gap-2 border-gray-300 sm:w-auto"
                >
                  <ArrowUpDown className="text-gray-500" size={14} />
                  <span className="hidden text-gray-800 sm:inline">Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={handleSortChange}
                  className="cursor-pointer text-sm hover:bg-gray-100"
                >
                  Ascending - Descending
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSortChange}
                  className="cursor-pointer text-sm hover:bg-gray-100"
                >
                  Descending - Ascending
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button
            variant="outline"
            size="lg"
            className="cursor-pointer gap-2 border border-[#161CCA] font-medium text-[#161CCA]"
            onClick={() => {
              exportActualMetersMutation.mutate(undefined, {
                onSuccess: () => {
                  toast.success("Actual meters exported successfully");
                },
                onError: (error) => {
                  console.error("Export failed:", error);
                  toast.error("Failed to export actual meters");
                },
              });
            }}
            disabled={exportActualMetersMutation.isPending}
          >
            <SquareArrowOutUpRight
              className="text-[#161CCA]"
              size={12}
              strokeWidth={2.3}
            />
            <span className="text-sm font-medium lg:text-base">
              {exportActualMetersMutation.isPending ? "Exporting..." : "Export"}
            </span>
          </Button>
        </div>
        <Card className="min-h-[calc(100vh-300px)] overflow-x-auto border-none bg-transparent shadow-none">
          <Table className="w-full table-auto bg-transparent">
            <TableHeader className="bg-transparent">
              <TableRow>
                <TableHead className="w-[100px] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      className="h-4 w-4 border-gray-500"
                      checked={
                        selectedTariffs.length ===
                          (metersData?.actualMeters?.length ?? 0) &&
                        (metersData?.actualMeters?.length ?? 0) > 0
                      }
                      onCheckedChange={toggleSelectAll}
                    />
                    <span className="text-sm font-medium text-gray-900">
                      S/N
                    </span>
                  </div>
                </TableHead>
                <TableHead className="px-4 py-3 text-sm font-medium text-gray-900">
                  Meter Number
                </TableHead>
                <TableHead className="px-4 py-3 text-sm font-medium text-gray-900">
                  SIM Number
                </TableHead>
                <TableHead className="px-4 py-3 text-sm font-medium text-gray-900">
                  Old SGC
                </TableHead>
                <TableHead className="px-4 py-3 text-sm font-medium text-gray-900">
                  New SGC
                </TableHead>
                <TableHead className="px-4 py-3 text-sm font-medium text-gray-900">
                  Manufacturer
                </TableHead>
                <TableHead className="px-4 py-3 text-sm font-medium text-gray-900">
                  Class
                </TableHead>

                <TableHead className="px-4 py-3 text-center text-sm font-medium text-gray-900">
                  Activation Status
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                  Meter Stage
                </TableHead>
                <TableHead className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={11} className="h-24 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-gray-900"></div>
                      <span className="text-sm text-gray-500">
                        Loading meters...
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={11} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="text-red-500">
                        <svg
                          className="h-8 w-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-500">
                        Failed to load meters
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (metersData?.actualMeters?.length ?? 0) === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="text-gray-400">
                        <svg
                          className="h-8 w-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-500">
                        No meters available
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item, index) => (
                  <TableRow
                    key={item.id ?? item.customerId ?? `actual-${index}`}
                    className={cn(
                      "cursor-pointer hover:bg-gray-50",
                      isPendingState(item.assignedStatus ?? item.status ?? "")
                        ? "bg-gray-100 opacity-50"
                        : "",
                    )}
                  >
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          className="h-4 w-4 border-gray-500"
                          id={`select-${item.customerId}`}
                          checked={selectedTariffs.includes(
                            item.id ?? item.customerId ?? "",
                          )}
                          onCheckedChange={() =>
                            toggleSelection(item.id ?? item.customerId ?? "")
                          }
                          disabled={isPendingState(
                            item.assignedStatus ?? item.status ?? "",
                          )}
                        />
                        <span className="text-sm text-gray-900">
                          {index + 1 + (currentPage - 1) * rowsPerPage}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-900">
                      {item.meterNumber}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-900">
                      {item.simNumber}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-900">
                      {item.oldSgc}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-900">
                      {item.newSgc}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-900">
                      {item.manufacturer?.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-900">
                      {item.meterClass}
                    </TableCell>
                   
                    <TableCell className="px-4 py-3 text-center">
                      <span
                        className={cn(
                          "inline-block text-sm font-medium",
                          getStatusStyle(item.status),
                        )}
                      >
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-block text-sm font-medium",
                          getStatusStyle(item.meterStage),
                        )}
                      >
                        {item.meterStage}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 cursor-pointer p-0"
                          >
                            <MoreVertical size={14} className="text-gray-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-fit bg-white shadow-lg"
                        >
                          {isPendingState(
                            item.assignedStatus ?? item.status ?? "",
                          ) ? (
                            <DropdownMenuItem
                              disabled
                              className="flex items-center gap-2"
                            >
                              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-gray-500"></div>
                              <span className="text-sm text-gray-500">
                                Waiting for Approval
                              </span>
                            </DropdownMenuItem>
                          ) : (
                            <>
                              <DropdownMenuItem
                                className="flex cursor-pointer items-center gap-2"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setViewMeter(item);
                                  setIsViewActualDetailsOpen(true);
                                }}
                              >
                                <Eye size={14} />
                                <span className="text-sm text-gray-700">
                                  View Details
                                </span>
                              </DropdownMenuItem>
                              {canEdit && item.status !== "Unassigned" && (
                                <DropdownMenuItem
                                  className="flex cursor-pointer items-center gap-2"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setSelectedMeter(item);
                                    setEditMeter(item);
                                    setIsAddMeterDialogOpen(true);
                                  }}
                                >
                                  <Pencil size={14} />
                                  <span className="text-sm text-gray-700">
                                    Edit Meter
                                  </span>
                                </DropdownMenuItem>
                              )}
                              {canEdit && (
                                <DropdownMenuItem
                                  className="flex cursor-pointer items-center gap-2"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setSelectedMeter(item);
                                    setIsDeactivateDialogOpen(true);
                                  }}
                                >
                                  {item.status === "Deactivated" ? (
                                    <>
                                      <CheckCircle size={14} />
                                      <span className="text-sm text-gray-700">
                                        Activate
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <Ban size={14} />
                                      <span className="text-sm text-gray-700">
                                        Deactivate
                                      </span>
                                    </>
                                  )}
                                </DropdownMenuItem>
                              )}
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
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
      <BulkUploadDialog
        isOpen={isBulkAssignDialogOpen}
        onClose={() => setIsBulkAssignDialogOpen(false)}
        onSave={handleBulkAssign}
        title="Bulk Assign Meters"
        sendRawFile={true}
        templateUrl="#"
        onTemplateClick={() => {
          setIsBulkAssignDialogOpen(false);
          setIsAssignTemplateDropdownOpen(true);
        }}
        requiredColumns={[
          "meterNumber",
          "customerId",
          "tariffId",
          "dssAssetId",
          "feederAssetId",
          "cin",
          "accountNumber",
          "state",
          "city",
          "houseNo",
          "streetName",
          "creditPaymentMode",
          "debitPaymentMode",
          "creditPaymentPlan",
          "debitPaymentPlan",
        ]}
      />

      {/* Assign Template Selection Dialog */}
      <Dialog
        open={isAssignTemplateDropdownOpen}
        onOpenChange={(open) => {
          setIsAssignTemplateDropdownOpen(open);
          if (!open) {
            // Close all other dialogs when template dialog closes
            setIsBulkAssignDialogOpen(false);
          }
        }}
      >
        <DialogContent className="h-fit max-w-sm bg-white">
          <DialogHeader>
            <DialogTitle>Select Assign Template Format</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Button
              onClick={() => {
                handleDownloadAssignCsvTemplate();
                setIsAssignTemplateDropdownOpen(false);
              }}
              className="w-full bg-[#161CCA] text-white hover:bg-[#121eb3]"
              disabled={downloadAssignCsvTemplateMutation.isPending}
            >
              {downloadAssignCsvTemplateMutation.isPending
                ? "Downloading..."
                : "Download CSV Template"}
            </Button>
            <Button
              onClick={() => {
                handleDownloadAssignExcelTemplate();
                setIsAssignTemplateDropdownOpen(false);
              }}
              variant="outline"
              className="w-full border-[#161CCA] text-[#161CCA] hover:bg-[#161CCA] hover:text-white"
              disabled={downloadAssignExcelTemplateMutation.isPending}
            >
              {downloadAssignExcelTemplateMutation.isPending
                ? "Downloading..."
                : "Download Excel Template"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Result Dialog */}
      {assignResult && (
        <AlertDialog
          open={isAssignResultDialogOpen}
          onOpenChange={setIsAssignResultDialogOpen}
        >
          <AlertDialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto border-none">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                {assignResult.successCount === assignResult.totalRecords ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Bulk Assign Completed Successfully
                  </>
                ) : assignResult.successCount === 0 ? (
                  <>
                    <XCircle className="h-5 w-5 text-red-500" />
                    Bulk Assign Failed
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    Bulk Assign Completed with Issues
                  </>
                )}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-left">
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 rounded-lg bg-gray-50 p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {assignResult.totalRecords}
                      </div>
                      <div className="text-sm text-gray-600">Total Records</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {assignResult.successCount}
                      </div>
                      <div className="text-sm text-gray-600">Successful</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {assignResult.failedCount}
                      </div>
                      <div className="text-sm text-gray-600">Failed</div>
                    </div>
                  </div>

                  {assignResult.successCount > 0 && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                      <div className="flex items-center gap-2 text-green-800">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium">Success</span>
                      </div>
                      <p className="mt-1 text-sm text-green-700">
                        {assignResult.successCount} meter
                        {assignResult.successCount !== 1 ? "s" : ""} assigned
                        successfully.
                      </p>
                    </div>
                  )}

                  {assignResult.failedCount > 0 && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                      <div className="flex items-center gap-2 text-red-800">
                        <XCircle className="h-4 w-4" />
                        <span className="font-medium">Failed Records</span>
                      </div>
                      <div className="mt-2 max-h-60 space-y-2 overflow-y-auto">
                        {assignResult.failedRecords.map((record, index) => (
                          <div
                            key={index}
                            className="rounded border-l-4 border-red-400 bg-red-100 p-2 text-sm text-red-700"
                          >
                            {record}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button
                onClick={() => {
                  setIsAssignResultDialogOpen(false);
                  setAssignResult(null);
                }}
                className="bg-[#161CCA] text-white hover:bg-[#121eb3]"
              >
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      <ViewMeterDetailsDialog
        isOpen={isViewActualDetailsOpen}
        onClose={() => {
          setIsViewActualDetailsOpen(false);
          setViewMeter(null);
        }}
        meter={viewMeter}
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
        action={
          selectedMeter &&
          (selectedMeter.assignedStatus === "Deactivated" ||
            selectedMeter.status === "Deactivated")
            ? "activate"
            : "deactivate"
        }
      />
      <AddMeterDialog
        isOpen={isAddMeterDialogOpen}
        onClose={() => setIsAddMeterDialogOpen(false)}
        onSaveMeter={handleSaveMeter}
        editMeter={editMeter}
      />
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-unused-vars */
// page.tsx

"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  ArrowRightLeft,
  ArrowUpDown,
  Eye,
  MoreVertical,
  Pencil,
  Search,
  Loader2,
  CirclePlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ContentHeader } from "@/components/ui/content-header";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilterControl } from "@/components/search-control";
import { BulkUploadDialog } from "@/components/meter-management/bulk-upload";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { AddMeterDialog } from "@/components/meter-management/add-edit-meter-dialog";
import { ViewMeterInfoDialog } from "@/components/meter-management/view-meter-info-dialog";
import type { MeterInventoryItem } from "@/types/meter-inventory";
import { getStatusStyle } from "@/components/status-style";
import { useMeterInventory, useBusinessHubs, useAllocateMeter } from "@/hooks/use-meter";
import type { MeterInventoryFilters, BusinessHub } from "@/types/meter-inventory";
import { useAuth } from '@/context/auth-context';
import { useBulkUploadMeters, useDownloadMeterCsvTemplate, useDownloadMeterExcelTemplate, useDownloadAllocateCsvTemplate, useDownloadAllocateExcelTemplate, useBulkAllocateMeters } from "@/hooks/use-meter-bulk";
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
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { LoadingAnimation } from "@/components/ui/loading-animation";

// Toast utility is now imported from sonner


const filterSections = [
  {
    title: "Meter Class",
    options: [
      { label: "Single-Phase", id: "singlePhase" },
      { label: "Three-Phase", id: "threePhase" },
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

const mapFiltersToApi = (uiFilters: Record<string, boolean>): Partial<MeterInventoryFilters> => {
  const apiFilters: Partial<MeterInventoryFilters> = {};
  if (uiFilters.singlePhase) apiFilters.meterClass = "Single-phase";
  else if (uiFilters.threePhase) apiFilters.meterClass = "Three-phase";
  else if (uiFilters.md) apiFilters.meterClass = "MD";
  if (uiFilters.prepaid) apiFilters.category = "Prepaid";
  else if (uiFilters.postPaid) apiFilters.category = "Postpaid";
  return apiFilters;
};

const mapMeterInventoryToMeterData = (meter: MeterInventoryItem): MeterInventoryItem => ({
  ...meter,
  smartStatus: meter.smartStatus,
  smartMeterInfo: meter.smartMeterInfo,
  status: meter.status ?? "",
});

export default function MeterInventoryPage() {
  const { user } = useAuth();
  const { canEdit } = usePermissions();

  const userOrgId = user?.orgId;

  const [selectedMeters, setSelectedMeters] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedMeter, setSelectedMeter] = useState<MeterInventoryItem | null>(null);

  // State for the selected Business Hub (will hold the hub's name, used as regionId)
  const [selectedHubId, setSelectedHubId] = useState<string>("");
  const [hubSearchTerm, setHubSearchTerm] = useState<string>(""); // <-- added for select search
  const [isBulkUploadDialogOpen, setIsBulkUploadDialogOpen] = useState(false);
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false);
  const [isUploadResultDialogOpen, setIsUploadResultDialogOpen] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    successCount: number;
    failedCount: number;
    totalRecords: number;
    failedRecords: string[];
  } | null>(null);
  const [isBulkAllocateDialogOpen, setIsBulkAllocateDialogOpen] = useState(false);
  const [isAllocateTemplateDropdownOpen, setIsAllocateTemplateDropdownOpen] = useState(false);
  const [isAllocateResultDialogOpen, setIsAllocateResultDialogOpen] = useState(false);
  const [allocateResult, setAllocateResult] = useState<{
    successCount: number;
    failedCount: number;
    totalRecords: number;
    failedRecords: string[];
  } | null>(null);
  const [meterNumberInput, setMeterNumberInput] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAddMeterDialogOpen, setIsAddMeterDialogOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [viewInfoDialogOpen, setViewInfoDialogOpen] = useState(false);
  const [apiFilters, setApiFilters] = useState<Partial<MeterInventoryFilters>>({});
  const [sortConfig, setSortConfig] = useState<{
    key: keyof MeterInventoryItem | null;
    direction: "asc" | "desc";
  }>({ key: "dateAdded", direction: "desc" });

  const bulkUploadMutation = useBulkUploadMeters();
  const downloadCsvTemplateMutation = useDownloadMeterCsvTemplate();
  const downloadExcelTemplateMutation = useDownloadMeterExcelTemplate();
  const bulkAllocateMutation = useBulkAllocateMeters();
  const downloadAllocateCsvTemplateMutation = useDownloadAllocateCsvTemplate();
  const downloadAllocateExcelTemplateMutation = useDownloadAllocateExcelTemplate();

  const filters: MeterInventoryFilters = useMemo(() => ({
    page: currentPage - 1,
    size: rowsPerPage,
    meterNumber: searchTerm ?? undefined,
    ...apiFilters,
  }), [currentPage, rowsPerPage, searchTerm, apiFilters]);

  const { data, isLoading, isError, error, refetch } = useMeterInventory(filters);

  const {
    data: businessHubs = [],
    isLoading: isHubsLoading,
    isError: isHubsError
  } = useBusinessHubs(userOrgId ?? '');

  const {
    mutate: allocate,
    isPending: isAllocating
  } = useAllocateMeter();


  const meters = useMemo(() => data?.data ?? [], [data]);
  const totalPages = data?.totalPages ?? 1;
  const totalData = data?.totalData ?? 0;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMeters(meters.map((meter) => meter.meterNumber));
    } else {
      setSelectedMeters([]);
    }
  };

  const handleSelectItem = (checked: boolean, meterNumber: string) => {
    if (checked) {
      setSelectedMeters([...selectedMeters, meterNumber]);
    } else {
      setSelectedMeters(selectedMeters.filter((meterId) => meterId !== meterNumber));
    }
  };

  const handleSaveMeter = (meter: MeterInventoryItem) => {
    setIsAddMeterDialogOpen(false);
    setSelectedMeter(null);
  };

  const handleSaveBulkAllocate = (data: File | MeterInventoryItem[]) => {
      if (data instanceof File) {
          bulkAllocateMutation.mutate(data, {
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

                  setIsBulkAllocateDialogOpen(false);
                  setIsAllocateTemplateDropdownOpen(false);

                  // Store result for detailed dialog
                  setAllocateResult(res.responsedata);
                  setIsAllocateResultDialogOpen(true);

                  // Show brief success toast if any succeeded
                  if (res.responsedata.successCount > 0) {
                      toast.success(`${res.responsedata.successCount} of ${res.responsedata.totalRecords} meters allocated successfully!`);
                      refetch();
                  }
              },
              onError: (error) => {
                  console.error("Bulk allocate failed:", error);
                  const err = error as { message?: string };
                  toast.error(err?.message ?? "Bulk allocate failed");
                  setIsBulkAllocateDialogOpen(false);
                  setIsAllocateTemplateDropdownOpen(false);
              },
          });
      } else {
          setIsBulkAllocateDialogOpen(false);
          setIsAllocateTemplateDropdownOpen(false);
      }
  };

  const isAllSelected = meters.length > 0 && selectedMeters.length === meters.length;

  // MODIFIED: Handle meter number change and set selected meter for allocation/autocomplete
  const handleMeterNumberChange = (value: string) => {
    setMeterNumberInput(value);

    // Normalize the input value by removing extra spaces for matching
    const normalizedValue = value.trim().replace(/\s+/g, ' ');
    
    const meter = meters.find((m) => {
      // Normalize both the stored meter number and input for comparison
      const normalizedMeterNumber = m.meterNumber.trim().replace(/\s+/g, ' ');
      return normalizedMeterNumber === normalizedValue;
    });
    
    if (meter) {
      setSelectedMeter(mapMeterInventoryToMeterData(meter));
    } else {
      setSelectedMeter(null);
    }
  };

  const handleAllocate = () => {
    if (isAllocating) return;

    // Normalize the meter number input to handle spaces
    const meterNumber = meterNumberInput.trim().replace(/\s+/g, ' ');
    // The API requires regionId, which is mapped from the selectedHubId (Business Hub Name)
    const regionId = selectedHubId;

    if (!meterNumber) {
      toast.error("Please enter a Meter Number.");
      return;
    }

    // Validation: Ensure meter number matches an existing meter using normalized comparison
    if (!selectedMeter) {
      toast.error("The entered Meter Number is invalid or not found in the current inventory. Please ensure the meter number exists.");
      return;
    }

    // Normalize the selected meter number for comparison
    const normalizedSelectedMeterNumber = selectedMeter.meterNumber.trim().replace(/\s+/g, ' ');
    if (normalizedSelectedMeterNumber !== meterNumber) {
      toast.error("The entered Meter Number is invalid or not found in the current inventory. Please ensure the meter number exists.");
      return;
    }

    if (!regionId) {
      toast.error("Please select an Organization ID.");
      return;
    }
    // Call the mutation
    allocate({ meterNumber, regionId }, {
      onSuccess: () => {
        toast.success(`Meter ${meterNumber} allocated to hub ${regionId}.`);
        // Reset fields on success
        setSelectedHubId("");
        setMeterNumberInput("");
        setSelectedMeter(null);
        setHubSearchTerm("");
      },
      onError: (error: unknown) => {
        const err = error as Error;
        const errorDescription = err.message?.includes('Failed to allocate meter')
          ? `API Error: ${err.message}`
          : err.message || "An unknown error occurred during allocation.";

        toast.error(errorDescription);
      }

    });
  };

  const handleBulkUpload = (data: unknown) => {
      if (data instanceof File) {
          bulkUploadMutation.mutate(data, {
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

                  setIsBulkUploadDialogOpen(false);
                  setIsTemplateDropdownOpen(false);

                  // Store result for detailed dialog
                  setUploadResult(res.responsedata);
                  setIsUploadResultDialogOpen(true);

                  // Show brief success toast if any succeeded
                  if (res.responsedata.successCount > 0) {
                      toast.success(`${res.responsedata.successCount} of ${res.responsedata.totalRecords} meters uploaded successfully!`);
                      refetch();
                  }
              },
              onError: (error) => {
                  console.error("Bulk upload failed:", error);
                  const err = error as { message?: string };
                  toast.error(err?.message ?? "Bulk upload failed");
                  setIsBulkUploadDialogOpen(false);
                  setIsTemplateDropdownOpen(false);
              },
          });
      } else {
          setIsBulkUploadDialogOpen(false);
          setIsTemplateDropdownOpen(false);
      }
  };

  const handleDownloadCsvTemplate = () => {
      downloadCsvTemplateMutation.mutate(undefined, {
          onSuccess: () => {
              toast.success("CSV template downloaded successfully");
          },
          onError: (error: unknown) => {
              const err = error as { message?: string };
              console.error("CSV template download failed:", error);
              toast.error(err?.message ?? "Failed to download CSV template");
          },
      });
  };

  const handleDownloadExcelTemplate = () => {
      downloadExcelTemplateMutation.mutate(undefined, {
          onSuccess: () => {
              toast.success("Excel template downloaded successfully");
          },
          onError: (error: unknown) => {
              const err = error as { message?: string };
              console.error("Excel template download failed:", error);
              toast.error(err?.message ?? "Failed to download Excel template");
          },
      });
  };

  const handleDownloadAllocateCsvTemplate = () => {
      downloadAllocateCsvTemplateMutation.mutate(undefined, {
          onSuccess: () => {
              toast.success("Allocate CSV template downloaded successfully");
          },
          onError: (error: unknown) => {
              const err = error as { message?: string };
              console.error("Allocate CSV template download failed:", error);
              toast.error(err?.message ?? "Failed to download allocate CSV template");
          },
      });
  };

  const handleDownloadAllocateExcelTemplate = () => {
      downloadAllocateExcelTemplateMutation.mutate(undefined, {
          onSuccess: () => {
              toast.success("Allocate Excel template downloaded successfully");
          },
          onError: (error: unknown) => {
              const err = error as { message?: string };
              console.error("Allocate Excel template download failed:", error);
              toast.error(err?.message ?? "Failed to download allocate Excel template");
          },
      });
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleSetActiveFilters = (filters: Record<string, boolean>) => {
    setCurrentPage(1);
    setApiFilters(mapFiltersToApi(filters));
  };

  const handleSortChange = () => {
    const sortKey: keyof MeterInventoryItem = sortConfig.key ?? "meterNumber";
    const newDirection = sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key: sortKey, direction: newDirection });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setRowsPerPage(newPageSize);
    setCurrentPage(1);
  };

  const handleEditMeter = (meter: MeterInventoryItem) => {
    setSelectedMeter(meter);
    setIsAddMeterDialogOpen(true);
  };

  const handleViewInfo = (meter: MeterInventoryItem) => {
    setSelectedMeter(meter);
    setViewInfoDialogOpen(true);
  };

  const sortedMeters = useMemo(() => {
    const sortableItems = [...meters];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key! as keyof typeof a] ?? "";
        const bValue = b[sortConfig.key! as keyof typeof b] ?? "";
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [meters, sortConfig]);

  const startRange = totalData > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0;
  const endRange = Math.min(currentPage * rowsPerPage, totalData);

  const SelectHubTrigger = () => {
    if (!userOrgId) {
      return <span className="text-sm text-yellow-600">Org ID not available</span>;
    }
    if (isHubsLoading) {
      return (
        <div className="flex items-center text-sm text-gray-500">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading Hubs...
        </div>
      );
    }
    if (isHubsError) {
      return <span className="text-sm text-red-500">Failed to load hubs</span>;
    }
    return <SelectValue placeholder="Select Organization ID" />;
  };

  // Filter hubs based on hubSearchTerm (search both name and regionId/id)
  const filteredHubs = useMemo(() => {
    const term = (hubSearchTerm ?? "").trim().toLowerCase();
    if (!term) return businessHubs;
    return businessHubs.filter((hub: BusinessHub) => {
      const regionId = (hub.regionId ?? hub.id)?.toString().toLowerCase();
      const name = (hub.name ?? "").toString().toLowerCase();
      return name.includes(term) ?? regionId.includes(term);
    });
  }, [businessHubs, hubSearchTerm]);

  return (
    <div className="h-fit p-6">
      <div className="mb-4 flex items-center justify-between">
        <ContentHeader
          title="Meter Inventory"
          description="Add Meters and Allocate meter to respective organization"
        />
        {canEdit && (
          <div className="mb-4 flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                className="flex w-full cursor-pointer items-center gap-2 border bg-white font-medium text-[#161CCA] md:w-auto"
                variant="outline"
                size="lg"
                onClick={() => setIsBulkUploadDialogOpen(true)}
              >
                <CirclePlus size={14} strokeWidth={2.3} className="h-4 w-4 text-[161CCA]" />
                <span className="text-sm md:text-base">Bulk Upload New Meters</span>
              </Button>
              <Button
                size="lg"
                onClick={() => {
                  setSelectedMeter(null);
                  setIsAddMeterDialogOpen(true);
                }}
                className="flex w-full cursor-pointer items-center gap-2 bg-[#161CCA] font-medium text-white hover:bg-[#1e2abf] md:w-auto"
              >
                <CirclePlus size={14} strokeWidth={2.3} className="h-4 w-4" />
                <span className="text-sm md:text-base">Add Meter</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      <Card className="mb-4 border-none bg-transparent p-4 shadow-none">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex w-full items-center gap-2 md:w-auto">
            <div className="relative w-full md:w-[300px]">
              <Search
                size={14}
                className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400"
              />
              <Input
                type="text"
                placeholder="Search by meter no., sim no..."
                className="w-full border-gray-300 pl-10 focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50"
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
        </div>

        {/* REVERTED: Allocation Section to previous UI layout */}
        {canEdit && (
          <div className="flex items-center gap-4 py-4">
            <div className="flex-1">
              <Label
                htmlFor="meterNumber"
                className="mb-2 text-sm font-medium text-gray-700"
              >
                Meter Number
              </Label>
              <Input
                id="meterNumber"
                value={meterNumberInput}
                onChange={(e) => handleMeterNumberChange(e.target.value)}
                placeholder="Enter Meter Number"
                className="w-full border-gray-300 focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50"
              />
            </div>
            <div className="flex h-16 w-16 items-center justify-center">
              {isAllocating ? (
                <Loader2 className="h-7 w-7 animate-spin" strokeWidth={2.75} />
              ) : (
                <ArrowRightLeft onClick={handleAllocate} size={28} strokeWidth={2.75} className="w-full px-6 py-3 bg-green-500 text-white rounded-3xl cursor-pointer" />
              )}
            </div>
            <div className="flex-1">
              <Label
                htmlFor="organizationId"
                className="mb-2 text-sm font-medium text-gray-700"
              >
                Organization ID <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedHubId}
                onValueChange={setSelectedHubId}
                disabled={isHubsLoading || isHubsError || !userOrgId || isAllocating}
              >
                <SelectTrigger className="w-full border-gray-300 focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50">
                  <SelectHubTrigger />
                </SelectTrigger>

                <SelectContent>
                  {/* Search box inside SelectContent */}
                  <div className="p-2">
                    <Input
                      placeholder="Search hubs..."
                      value={hubSearchTerm}
                      onChange={(e) => setHubSearchTerm(e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>

                  <div className="h-px bg-gray-100 my-1" />

                  {/* Filtered list */}
                  {filteredHubs.length > 0 ? (
                    filteredHubs.map((hub: BusinessHub) => {
                      const regionId = hub.regionId ?? hub.id;
                      const displayName = `${hub.name} (${regionId})`;

                      return (
                        <SelectItem key={regionId} value={regionId}>
                          {displayName}
                        </SelectItem>
                      );
                    })
                  ) : (
                    <div className="p-2 text-sm text-gray-500">No results found</div>
                  )}

                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => setIsBulkAllocateDialogOpen(true)}
              size="lg"
              className="mt-7 flex w-full cursor-pointer items-center gap-2 bg-green-500 px-6 py-3 text-white hover:bg-green-600 sm:w-auto"
            >
              <ArrowRightLeft size={12} strokeWidth={2.75} />
              Bulk Allocate
            </Button>
            <BulkUploadDialog
              isOpen={isBulkAllocateDialogOpen}
              onClose={() => setIsBulkAllocateDialogOpen(false)}
              onSave={handleSaveBulkAllocate}
              title="Bulk Allocate Meters"
              sendRawFile={true}
              templateUrl="#"
              onTemplateClick={() => {
                setIsBulkAllocateDialogOpen(false);
                setIsAllocateTemplateDropdownOpen(true);
              }}
              requiredColumns={[
                "meterNumber",
                "regionId",
              ]}
            />
          </div>
        )}
      </Card>

      <Card className="h-4/6 rounded-md border-none">
        <Table>
          <TableHeader className="bg-transparent">
            <TableRow>
              <TableHead className="w-[80px] px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <Checkbox
                    className="border-gray-500"
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all meters"
                  />
                  <Label
                    htmlFor="select-all"
                    className="text-sm font-semibold text-gray-700"
                  >
                    S/N
                  </Label>
                </div>
              </TableHead>
              <TableHead>Meter Number</TableHead>
              <TableHead>SIM No</TableHead>
              <TableHead>Old SGC</TableHead>
              <TableHead>New SGC</TableHead>
              <TableHead>Manufacture</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead>Meter Stage</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={11} className="py-8">
                  <LoadingAnimation variant="spinner" message="Loading Meters..." size="md" />
                </TableCell>
              </TableRow>
            )}
            {isError && (
              <TableRow>
                <TableCell colSpan={11} className="py-4 text-center text-red-500">
                  Error fetching meters: {error instanceof Error ? error.message : "An unknown error occurred"}
                </TableCell>
              </TableRow>
            )}
            {!isLoading && sortedMeters.length > 0 ? (
              sortedMeters.map((meter, index) => (
                <TableRow key={meter.meterNumber}>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        className="border-gray-500"
                        checked={selectedMeters.includes(meter.meterNumber)}
                        onCheckedChange={(checked) =>
                          handleSelectItem(checked as boolean, meter.meterNumber)
                        }
                        aria-label={`Select meter ${meter.meterNumber}`}
                      />
                      <span className="text-sm text-gray-900">
                        {index + 1 + (currentPage - 1) * rowsPerPage}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{meter.meterNumber}</TableCell>
                  <TableCell>{meter.simNumber}</TableCell>
                  <TableCell>{meter.oldSgc}</TableCell>
                  <TableCell>{meter.newSgc}</TableCell>
                  <TableCell className="text-sm">{meter.manufacturer?.name}</TableCell>
                  <TableCell>{meter.meterClass}</TableCell>
                  <TableCell>{meter.createdAt ? meter.createdAt.split(' ')[0] : meter.dateAdded ?? 'N/A'}</TableCell>
                  <TableCell>
                    <span className={getStatusStyle(meter.meterStage)}>
                      {meter.meterStage}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 cursor-pointer p-0">
                          <MoreVertical size={14} className="text-gray-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewInfo(mapMeterInventoryToMeterData(meter))}
                          className="cursor-pointer">
                          <Eye size={14} />
                          View Details
                        </DropdownMenuItem>
                        {canEdit && (
                          <DropdownMenuItem
                            onClick={() => handleEditMeter(mapMeterInventoryToMeterData(meter))}
                            className="cursor-pointer text-sm hover:bg-gray-100"
                          >
                            <Pencil size={14} />
                            Edit Meter
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              !isLoading && (
                <TableRow>
                  <TableCell colSpan={11} className="py-4 text-center text-gray-500">
                    No meters found.
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </Card>

      <PaginationControls
        currentPage={currentPage}
        totalItems={totalData}
        pageSize={rowsPerPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
      />

      <BulkUploadDialog<MeterInventoryItem>
        isOpen={isBulkUploadDialogOpen}
        onClose={() => setIsBulkUploadDialogOpen(false)}
        onSave={handleBulkUpload}
        title="Bulk Upload Meters"
        sendRawFile={true}
        templateUrl="#"
        onTemplateClick={() => {
          setIsBulkUploadDialogOpen(false);
          setIsTemplateDropdownOpen(true);
        }}
        requiredColumns={[
          "id",
          "meterNumber",
          "manufactureName",
          "class",
          "meterId",
          "meterType",
          "category",
          "dateAdded",
          "status",
        ]}
      />

      {/* Template Selection Dialog */}
      <Dialog open={isTemplateDropdownOpen} onOpenChange={(open) => {
        setIsTemplateDropdownOpen(open);
        if (!open) {
          // Close all other dialogs when template dialog closes
          setIsBulkUploadDialogOpen(false);
          setIsAddMeterDialogOpen(false);
          setViewInfoDialogOpen(false);
        }
      }}>
        <DialogContent className="max-w-sm bg-white h-fit">
          <DialogHeader>
            <DialogTitle>Select Template Format</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Button
              onClick={() => {
                handleDownloadCsvTemplate();
                setIsTemplateDropdownOpen(false);
              }}
              className="w-full bg-[#161CCA] hover:bg-[#121eb3] text-white"
              disabled={downloadCsvTemplateMutation.isPending}
            >
              {downloadCsvTemplateMutation.isPending ? "Downloading..." : "Download CSV Template"}
            </Button>
            <Button
              onClick={() => {
                handleDownloadExcelTemplate();
                setIsTemplateDropdownOpen(false);
              }}
              variant="outline"
              className="w-full border-[#161CCA] text-[#161CCA] hover:bg-[#161CCA] hover:text-white"
              disabled={downloadExcelTemplateMutation.isPending}
            >
              {downloadExcelTemplateMutation.isPending ? "Downloading..." : "Download Excel Template"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Allocate Template Selection Dialog */}
      <Dialog open={isAllocateTemplateDropdownOpen} onOpenChange={(open) => {
        setIsAllocateTemplateDropdownOpen(open);
        if (!open) {
          // Close all other dialogs when template dialog closes
          setIsBulkAllocateDialogOpen(false);
          setIsAddMeterDialogOpen(false);
          setViewInfoDialogOpen(false);
        }
      }}>
        <DialogContent className="max-w-sm bg-white h-fit">
          <DialogHeader>
            <DialogTitle>Select Allocate Template Format</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Button
              onClick={() => {
                handleDownloadAllocateCsvTemplate();
                setIsAllocateTemplateDropdownOpen(false);
              }}
              className="w-full bg-[#161CCA] hover:bg-[#121eb3] text-white"
              disabled={downloadAllocateCsvTemplateMutation.isPending}
            >
              {downloadAllocateCsvTemplateMutation.isPending ? "Downloading..." : "Download CSV Template"}
            </Button>
            <Button
              onClick={() => {
                handleDownloadAllocateExcelTemplate();
                setIsAllocateTemplateDropdownOpen(false);
              }}
              variant="outline"
              className="w-full border-[#161CCA] text-[#161CCA] hover:bg-[#161CCA] hover:text-white"
              disabled={downloadAllocateExcelTemplateMutation.isPending}
            >
              {downloadAllocateExcelTemplateMutation.isPending ? "Downloading..." : "Download Excel Template"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload Result Dialog */}
      {uploadResult && (
        <AlertDialog open={isUploadResultDialogOpen} onOpenChange={setIsUploadResultDialogOpen}>
          <AlertDialogContent className="max-w-2xl max-h-[80vh] border-none overflow-y-auto">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                {uploadResult.successCount === uploadResult.totalRecords ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Bulk Upload Completed Successfully
                  </>
                ) : uploadResult.successCount === 0 ? (
                  <>
                    <XCircle className="h-5 w-5 text-red-500" />
                    Bulk Upload Failed
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    Bulk Upload Completed with Issues
                  </>
                )}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-left">
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{uploadResult.totalRecords}</div>
                      <div className="text-sm text-gray-600">Total Records</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{uploadResult.successCount}</div>
                      <div className="text-sm text-gray-600">Successful</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{uploadResult.failedCount}</div>
                      <div className="text-sm text-gray-600">Failed</div>
                    </div>
                  </div>

                  {uploadResult.successCount > 0 && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-800">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium">Success</span>
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        {uploadResult.successCount} meter{uploadResult.successCount !== 1 ? 's' : ''} uploaded successfully.
                      </p>
                    </div>
                  )}

                  {uploadResult.failedCount > 0 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-red-800">
                        <XCircle className="h-4 w-4" />
                        <span className="font-medium">Failed Records</span>
                      </div>
                      <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                        {uploadResult.failedRecords.map((record, index) => (
                          <div key={index} className="text-sm text-red-700 bg-red-100 p-2 rounded border-l-4 border-red-400">
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
                  setIsUploadResultDialogOpen(false);
                  setUploadResult(null);
                }}
                className="bg-[#161CCA] hover:bg-[#121eb3] text-white"
              >
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Allocate Result Dialog */}
      {allocateResult && (
        <AlertDialog open={isAllocateResultDialogOpen} onOpenChange={setIsAllocateResultDialogOpen}>
          <AlertDialogContent className="max-w-2xl max-h-[80vh] border-none overflow-y-auto">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                {allocateResult.successCount === allocateResult.totalRecords ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Bulk Allocate Completed Successfully
                  </>
                ) : allocateResult.successCount === 0 ? (
                  <>
                    <XCircle className="h-5 w-5 text-red-500" />
                    Bulk Allocate Failed
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    Bulk Allocate Completed with Issues
                  </>
                )}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-left">
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{allocateResult.totalRecords}</div>
                      <div className="text-sm text-gray-600">Total Records</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{allocateResult.successCount}</div>
                      <div className="text-sm text-gray-600">Successful</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{allocateResult.failedCount}</div>
                      <div className="text-sm text-gray-600">Failed</div>
                    </div>
                  </div>

                  {allocateResult.successCount > 0 && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-800">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium">Success</span>
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        {allocateResult.successCount} meter{allocateResult.successCount !== 1 ? 's' : ''} allocated successfully.
                      </p>
                    </div>
                  )}

                  {allocateResult.failedCount > 0 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-red-800">
                        <XCircle className="h-4 w-4" />
                        <span className="font-medium">Failed Records</span>
                      </div>
                      <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                        {allocateResult.failedRecords.map((record, index) => (
                          <div key={index} className="text-sm text-red-700 bg-red-100 p-2 rounded border-l-4 border-red-400">
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
                  setIsAllocateResultDialogOpen(false);
                  setAllocateResult(null);
                }}
                className="bg-[#161CCA] hover:bg-[#121eb3] text-white"
              >
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <AddMeterDialog
        isOpen={isAddMeterDialogOpen}
        onClose={() => {
          setIsAddMeterDialogOpen(false);
          setSelectedMeter(null);
        }}
        onSaveMeter={handleSaveMeter}
        editMeter={selectedMeter}
      />

      <ViewMeterInfoDialog
        isOpen={viewInfoDialogOpen}
        onClose={() => setViewInfoDialogOpen(false)}
        meter={selectedMeter}
      />
    </div>
  );
}

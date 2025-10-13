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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { AddMeterDialog } from "@/components/meter-management/add-edit-meter-dialog";
import { ViewMeterInfoDialog } from "@/components/meter-management/view-meter-info-dialog";
import type { MeterInventoryItem } from "@/types/meter-inventory";
import { getStatusStyle } from "@/components/status-style";
import { useMeterInventory, useBusinessHubs, useAllocateMeter } from "@/hooks/use-meter";
import type { MeterInventoryFilters } from "@/types/meter-inventory";
import { useAuth } from '@/context/auth-context';

// Placeholder for toast utility
const toast = (props: { title: string, description?: string, variant?: 'default' | 'destructive' }) => {
  console.log(`[TOAST] ${props.title}: ${props.description ?? ''} (Variant: ${props.variant})`);
};


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

  const userOrgId = user?.orgId;

  const [selectedMeters, setSelectedMeters] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedMeter, setSelectedMeter] = useState<MeterInventoryItem | null>(null);

  // State for the selected Business Hub (will hold the hub's name, used as regionId)
  const [selectedHubId, setSelectedHubId] = useState<string>("");
  const [hubSearchTerm, setHubSearchTerm] = useState<string>(""); // <-- added for select search
  const [isBulkUploadDialogOpen, setIsBulkUploadDialogOpen] = useState(false);
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

  const handleSaveBulkAllocate = (data: MeterInventoryItem[]) => {
    console.log("Saved data:", data);
  };

  const isAllSelected = meters.length > 0 && selectedMeters.length === meters.length;

  // MODIFIED: Handle meter number change and set selected meter for allocation/autocomplete
  const handleMeterNumberChange = (value: string) => {
    setMeterNumberInput(value);

    const _meter = meters.find((m) => m.meterNumber === value);
    if (_meter) {
      setSelectedMeter(mapMeterInventoryToMeterData(_meter));
    } else {
      setSelectedMeter(null);
    }
  };

  const handleAllocate = () => {
    if (isAllocating) return;

    const meterNumber = meterNumberInput.trim();
    // The API requires regionId, which is mapped from the selectedHubId (Business Hub Name)
    const regionId = selectedHubId;

    if (!meterNumber) {
      toast({
        title: "Allocation Failed",
        description: "Please enter a Meter Number.",
        variant: 'destructive'
      });
      return;
    }

    // Validation: Ensure meter number matches an existing meter
    if (!selectedMeter || selectedMeter.meterNumber !== meterNumber) {
      toast({
        title: "Allocation Failed",
        description: "The entered Meter Number is invalid or not found in the current inventory. Please ensure exact match.",
        variant: 'destructive'
      });
      return;
    }

    if (!regionId) {
      toast({
        title: "Allocation Failed",
        description: "Please select an Organization ID.",
        variant: 'destructive'
      });
      return;
    }
    // Call the mutation
    allocate({ meterNumber, regionId }, {
      onSuccess: () => {
        toast({
          title: "Allocation Successful",
          description: `Meter ${meterNumber} allocated to hub ${regionId}.`,
          variant: 'default'
        });
        // Reset fields on success
        setSelectedHubId("");
        setMeterNumberInput("");
        setSelectedMeter(null);
        setHubSearchTerm("");
      },
      onError: (error: any) => {
        const errorDescription = error.message?.includes('Failed to allocate meter') ?
          `API Error: ${error.message}` :
          error.message || "An unknown error occurred during allocation.";

        toast({
          title: "Allocation Error",
          description: errorDescription,
          variant: 'destructive'
        });
      }
    });
  };

  const handleBulkUpload = (_newData: MeterInventoryItem[]) => {
    refetch();
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
    const term = hubSearchTerm.trim().toLowerCase();
    if (!term) return businessHubs;
    return businessHubs.filter((hub: any) => {
      const regionId = (hub.regionId ?? hub.id)?.toString().toLowerCase();
      const name = (hub.name ?? "").toString().toLowerCase();
      return name.includes(term) || regionId.includes(term);
    });
  }, [businessHubs, hubSearchTerm]);

  return (
    <div className="h-fit p-6">
      <div className="mb-4 flex items-center justify-between">
        <ContentHeader
          title="Meter Inventory"
          description="Add Meters and Allocate meter to respective organization"
        />
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              className="flex w-full cursor-pointer items-center gap-2 border bg-white font-medium text-[#161CCA] md:w-auto"
              variant="outline"
              size="lg"
              onClick={() => setIsBulkUploadDialogOpen(true)}
            >
              <CirclePlus size={14} strokeWidth={2.3} className="h-4 w-4 text-[161CCA]" />
              <span className="text-sm md:text-base">Bulk Upload</span>
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
                  filteredHubs.map((hub: any) => {
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
            onClick={() => setIsOpen(true)}
            size="lg"
            className="mt-7 flex w-full cursor-pointer items-center gap-2 bg-green-500 px-6 py-3 text-white hover:bg-green-600 sm:w-auto"
          >
            <ArrowRightLeft size={12} strokeWidth={2.75} />
            Bulk Allocate
          </Button>
          <BulkUploadDialog
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onSave={handleSaveBulkAllocate}
            title="Upload File"
            requiredColumns={[
              "meterNumber",
              "simNo",
              "oldSgc",
              "newSgc",
              "manufactureName",
              "class",
              "meterStage",
              "category",
            ]}
          />
        </div>
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
              <TableHead>Category</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead>Meter Stage</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={11} className="py-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-[#161CCA]">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-sm font-medium">Loading Meters...</span>
                  </div>
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
                  <TableCell>{meter.meterCategory}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleViewInfo(mapMeterInventoryToMeterData(meter))}>
                          <Eye size={14} />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEditMeter(mapMeterInventoryToMeterData(meter))}
                          className="cursor-pointer text-sm hover:bg-gray-100"
                        >
                          <Pencil size={14} />
                          Edit Meter
                        </DropdownMenuItem>
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

      <Pagination className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Rows per page</span>
          <Select value={rowsPerPage.toString()} onValueChange={handleRowsPerPageChange}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" side="top" align="center" className="mb-1 ring-gray-50">
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="24">24</SelectItem>
              <SelectItem value="48">48</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm font-medium">
            {startRange}-{endRange} of {totalData}
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
              aria-disabled={currentPage === 1 || totalPages === 0}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNext();
              }}
              aria-disabled={currentPage === totalPages || totalPages === 0}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <BulkUploadDialog<MeterInventoryItem>
        isOpen={isBulkUploadDialogOpen}
        onClose={() => setIsBulkUploadDialogOpen(false)}
        onSave={handleBulkUpload}
        title="Bulk Upload Meters"
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
        templateUrl="/templates/meter-template.xlsx"
      />

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

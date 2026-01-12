"use client";

import { useState } from "react";
import { FilterControl } from "@/components/search-control";
import { Button } from "@/components/ui/button";
import { ContentHeader } from "@/components/ui/content-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  ArrowUpDown,
  CirclePause,
  MoreVertical,
  Pencil,
  RefreshCcw,
  Search,
  Trash2,
  Play,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SetSyncScheduleDialog from "@/components/hes/controlsconfigs/data-collection-schedule/set-sync-schedule-dialog";
import { ConfirmDialog } from "@/components/hes/controlsconfigs/data-collection-schedule/confirm-dialog";
import EditSyncScheduleDialog from "@/components/hes/controlsconfigs/data-collection-schedule/edit-sync-schedule";

// Define the shape of the filter object using Record
type FilterType = Record<string, string | boolean>;

// Define the shape of the sync schedule data
interface SyncScheduleData {
  eventType: string;
  timeInterval: string;
  unit: string;
  activeDays: string;
}

// Define the shape of the table data
interface TableData {
  sNo: string;
  eventType: string;
  timeInterval: string;
  unit: string;
  activeDays: string;
  status: "Active" | "Paused";
}

// Map eventType values to display labels using Record
const eventTypeLabels: Record<string, string> = {
  standardEventLog: "Standard Event Log",
  relayControlLog: "Relay Control Log",
  powerQualityLog: "Power Quality Log",
  communicationLog: "Communication Log",
  tokenEventProfile: "Token Event Profile",
  energyProfile: "Energy Profile",
  instantDataProfile: "Instant Data Profile",
  billingData: "Billing Data",
  fraudEventLog: "Fraud Event Log",
};

// Map activeDays values to display labels using Record
const activeDaysLabels: Record<string, string> = {
  repeatDaily: "Repeat Daily",
  repeatMonFri: "Repeat (Mon-Fri)",
  // repeatOnly: "Repeat Only",
};

const filterSections = [
  {
    title: "Meter Class",
    options: [
      { label: "Single Phase", id: "singlePhase" },
      { label: "Three Phase", id: "threePhase" },
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

export default function DataCollScheduler() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [editData, setEditData] = useState<TableData | null>(null);
  const [data, setData] = useState<TableData[]>([
    {
      sNo: "01",
      eventType: "standardEventLog",
      timeInterval: "30 mins",
      unit: "min",
      activeDays: "repeatDaily",
      status: "Active",
    },
    {
      sNo: "02",
      eventType: "relayControlLog",
      timeInterval: "30 mins",
      unit: "min",
      activeDays: "repeatMonFri",
      status: "Paused",
    },
    {
      sNo: "03",
      eventType: "powerQualityLog",
      timeInterval: "2 mins",
      unit: "min",
      activeDays: "repeatDaily",
      status: "Active",
    },
    {
      sNo: "04",
      eventType: "communicationLog",
      timeInterval: "30 mins",
      unit: "min",
      activeDays: "repeatMonFri",
      status: "Active",
    },
    {
      sNo: "05",
      eventType: "powerQualityLog",
      timeInterval: "30 mins",
      unit: "min",
      activeDays: "repeatDaily",
      status: "Active",
    },
    {
      sNo: "06",
      eventType: "tokenEventProfile",
      timeInterval: "30 mins",
      unit: "min",
      activeDays: "repeatMonFri",
      status: "Active",
    },
    {
      sNo: "07",
      eventType: "energyProfile",
      timeInterval: "10 mins",
      unit: "min",
      activeDays: "repeatDaily",
      status: "Active",
    },
    {
      sNo: "08",
      eventType: "instantDataProfile",
      timeInterval: "12 mins",
      unit: "min",
      activeDays: "repeatMonFri",
      status: "Paused",
    },
    // {
    //   sNo: "09",
    //   eventType: "billingData",
    //   timeInterval: "30 mins",
    //   unit: "min",
    //   activeDays: "repeatOnly",
    //   status: "Paused",
    // },
    {
      sNo: "09",
      eventType: "fraudEventLog",
      timeInterval: "30 mins",
      unit: "min",
      activeDays: "repeatDaily",
      status: "Paused",
    },
    {
      sNo: "10",
      eventType: "fraudEventLog",
      timeInterval: "30 mins",
      unit: "min",
      activeDays: "repeatDaily",
      status: "Paused",
    },
  ]);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: "pause" | "continue" | "delete" | null;
    sNo: string | null;
  }>({ isOpen: false, type: null, sNo: null });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  }>({ key: "", direction: "asc" });

  // Apply search and filters
  const filteredData = data.filter((item) => {
    const matchesSearch = searchTerm
      ? (item.sNo.toLowerCase().includes(searchTerm.toLowerCase()) ??
        eventTypeLabels[item.eventType]
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ??
        item.timeInterval.toLowerCase().includes(searchTerm.toLowerCase()) ??
        activeDaysLabels[item.activeDays]
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ??
        item.status.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;
    return matchesSearch;
  });

  // Apply sorting
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key as keyof TableData] ?? "";
    const bValue = b[sortConfig.key as keyof TableData] ?? "";
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(bValue);
    }
    return 0;
  });

  // Calculate paginated data
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handleSetActiveFilters = (filters: FilterType) => {
    console.log("Filters applied:", filters);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleSortChange = (sortType: string) => {
    console.log("Sort by:", sortType);
    setSortConfig({ key: "sNo", direction: sortType }); // Example: sort by sNo; adjust key as needed
    setCurrentPage(1); // Reset to first page on sort change
  };

  const handleDialogSubmit = (formData: SyncScheduleData) => {
    console.log("Sync schedule set:", formData);
    setData((prevData) => [
      ...prevData,
      {
        sNo: (prevData.length + 1).toString().padStart(2, "0"),
        eventType: formData.eventType,
        timeInterval: `${formData.timeInterval} ${formData.unit}`,
        unit: formData.unit,
        activeDays: formData.activeDays,
        status: "Active",
      },
    ]);
    setCurrentPage(1); // Reset to first page on new data addition
  };

  const handleEditDialogSubmit = (formData: SyncScheduleData) => {
    if (editData?.sNo) {
      setData((prevData) =>
        prevData.map((item) =>
          item.sNo === editData.sNo
            ? {
                ...item,
                eventType: formData.eventType,
                timeInterval: `${formData.timeInterval} ${formData.unit}`,
                unit: formData.unit,
                activeDays: formData.activeDays,
              }
            : item,
        ),
      );
      setIsEditDialogOpen(false);
      setEditData(null);
    }
  };

  const handleToggleStatus = (sNo: string) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.sNo === sNo
          ? { ...item, status: item.status === "Active" ? "Paused" : "Active" }
          : item,
      ),
    );
  };

  const handleDelete = (sNo: string) => {
    setData((prevData) => prevData.filter((item) => item.sNo !== sNo));
    if (paginatedData.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1); // Go to previous page if last item on page is deleted
    }
  };

  const openConfirmDialog = (
    type: "pause" | "continue" | "delete",
    sNo: string,
  ) => {
    setConfirmDialog({ isOpen: true, type, sNo });
  };

  const openEditDialog = (sNo: string) => {
    const item = data.find((d) => d.sNo === sNo);
    if (item) {
      setEditData(item);
      setIsEditDialogOpen(true);
    }
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({ isOpen: false, type: null, sNo: null });
  };

  const handleConfirm = () => {
    if (confirmDialog.sNo) {
      if (confirmDialog.type === "pause" || confirmDialog.type === "continue") {
        handleToggleStatus(confirmDialog.sNo);
      } else if (confirmDialog.type === "delete") {
        handleDelete(confirmDialog.sNo);
      }
    }
    closeConfirmDialog();
  };

  const getConfirmDialogProps = () => {
    switch (confirmDialog.type) {
      case "pause":
        return {
          title: "Pause Sync Schedule",
          description: "Are you sure you want to pause this sync schedule?",
          confirmText: "Pause",
          backgroundColor: "bg-white",
          alertTriangleColor: "text-[#C86900] bg-[#FFF5EA] rounded-full p-2",
          confirmButtonColor: "bg-[#C86900] text-white",
          cancelButtonColor:
            "bg-white hover:bg-yellow-200 text-[#C86900] border-[#C86900]",
        };
      case "continue":
        return {
          title: "Continue Sync Schedule",
          description: "Are you sure you want to continue this sync schedule?",
          confirmText: "Continue",
          backgroundColor: "bg-white",
          alertTriangleColor: "text-[#161CCA] bg-blue-100 rounded-full p-2",
          confirmButtonColor: "bg-[#161CCA] text-white",
          cancelButtonColor:
            "bg-white hover:bg-green-200 text-[#161CCA] border-[#161CCA]",
        };
      case "delete":
        return {
          title: "Delete Sync Schedule",
          description: "Are you sure you want to delete this sync schedule?",
          confirmText: "Delete",
          backgroundColor: "bg-white",
          alertTriangleColor: "text-[#F50202] bg-[#FEE2E2] rounded-full p-2",
          confirmButtonColor: "bg-red-600 hover:bg-red-700 text-white",
          cancelButtonColor: "bg-white text-[#F50202] border-[#F50202]",
        };
      default:
        return {
          title: "",
          description: "",
          confirmText: "",
          backgroundColor: "",
          alertTriangleColor: "",
          confirmButtonColor: "",
          cancelButtonColor: "",
        };
    }
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-y-auto p-6">
      <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
        <ContentHeader
          title="Data Collection Scheduler"
          description="Set meter sync intervals and configure communication settings for efficient data transmission"
        />
        <Button
          className="flex w-full cursor-pointer items-center gap-2 border bg-[#161CCA] font-medium text-white md:w-auto"
          variant="outline"
          size="lg"
          onClick={() => setIsDialogOpen(true)}
        >
          <RefreshCcw
            size={14}
            strokeWidth={2.3}
            className="h-4 w-4 text-white"
          />
          <span className="text-sm md:text-base">Set Sync Schedule</span>
        </Button>
      </div>

      <div className="mb-4 flex w-full flex-col items-center gap-4 md:flex-row">
        <div className="relative w-full md:w-[300px]">
          <Search
            size={14}
            className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400"
          />
          <Input
            type="text"
            placeholder="Search by meter no., account no..."
            className="w-full border-gray-300 pl-10 focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
          <DropdownMenuContent align="center" className="w-48">
            <DropdownMenuItem
              onClick={() => handleSortChange("asc")}
              className="cursor-pointer text-sm hover:bg-gray-100"
            >
              Ascending
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleSortChange("desc")}
              className="cursor-pointer text-sm hover:bg-gray-100"
            >
              Descending
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card className="overflow-x-auto border-none bg-transparent shadow-none">
        <Table className="w-full table-auto">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="p-2 text-left text-sm font-medium text-gray-600">
                S/N
              </TableHead>
              <TableHead className="p-2 text-left text-sm font-medium text-gray-600">
                Event/Profile Type
              </TableHead>
              <TableHead className="p-2 text-left text-sm font-medium text-gray-600">
                Time Interval
              </TableHead>
              <TableHead className="p-2 text-left text-sm font-medium text-gray-600">
                Active Days
              </TableHead>
              <TableHead className="p-2 text-left text-sm font-medium text-gray-600">
                Status
              </TableHead>
              <TableHead className="p-2 text-left text-sm font-medium text-gray-600">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-sm text-gray-500"
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => (
                <TableRow
                  key={item.sNo}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <TableCell className="p-2 text-sm text-gray-800">
                    {index + 1 + (currentPage - 1) * rowsPerPage}
                  </TableCell>
                  <TableCell className="p-2 text-sm text-gray-800">
                    {eventTypeLabels[item.eventType] ?? item.eventType}
                  </TableCell>
                  <TableCell className="p-2 text-sm text-gray-800">
                    {item.timeInterval}
                  </TableCell>
                  <TableCell className="p-2 text-sm text-[#161CCA]">
                    {activeDaysLabels[item.activeDays] ?? item.activeDays}
                  </TableCell>
                  <TableCell className="p-2 text-sm">
                    <span
                      className={`rounded-full px-2 py-1 ${
                        item.status === "Active"
                          ? "bg-[#E9FBF0] text-[#059E40]"
                          : "bg-[#FFF5EA] text-[#C86900]"
                      }`}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="p-2 text-sm text-gray-800">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="default"
                          size="sm"
                          className="cursor-pointer border-gray-200 focus:ring-gray-500/0"
                        >
                          <MoreVertical
                            size={16}
                            className="border-gray-200 text-gray-500"
                          />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="center"
                        className="w-48 bg-white shadow-lg"
                      >
                        <DropdownMenuItem
                          className="flex cursor-pointer items-center gap-2"
                          onClick={() =>
                            openConfirmDialog(
                              item.status === "Paused" ? "continue" : "pause",
                              item.sNo,
                            )
                          }
                        >
                          {item.status === "Paused" ? (
                            <>
                              <Play size={14} className="text-gray-500" />
                              <span className="text-sm text-black">
                                Continue Schedule
                              </span>
                            </>
                          ) : (
                            <>
                              <CirclePause
                                size={14}
                                className="text-gray-500"
                              />
                              <span className="text-sm text-black">
                                Pause Schedule
                              </span>
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="flex cursor-pointer items-center gap-2"
                          onClick={() => openEditDialog(item.sNo)}
                        >
                          <Pencil size={14} className="text-gray-500" />
                          <span className="text-sm text-black">
                            Edit Sync Schedule
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="flex cursor-pointer items-center gap-2"
                          onClick={() => openConfirmDialog("delete", item.sNo)}
                        >
                          <Trash2 size={14} className="text-gray-500" />
                          <span className="text-sm whitespace-nowrap text-black">
                            Delete Sync Schedule
                          </span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Pagination className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Rows per page</span>
            <Select
              value={rowsPerPage.toString()}
              onValueChange={handleRowsPerPageChange}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={rowsPerPage.toString()} />
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
              {Math.min(currentPage * rowsPerPage, sortedData.length)} of{" "}
              {sortedData.length}
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
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
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
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </Card>

      <SetSyncScheduleDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleDialogSubmit}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        onConfirm={handleConfirm}
        {...getConfirmDialogProps()}
      />

      <EditSyncScheduleDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditData(null);
        }}
        onSubmit={handleEditDialogSubmit}
        initialData={
          editData ?? {
            sNo: "",
            eventType: "",
            timeInterval: "",
            unit: "min",
            activeDays: "",
          }
        }
      />
    </div>
  );
}

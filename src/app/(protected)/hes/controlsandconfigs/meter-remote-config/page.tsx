"use client";

import { Button } from "@/components/ui/button";
import { ContentHeader } from "@/components/ui/content-header";
import {
  Ban,
  CircleCheck,
  Eye,
  MoreVertical,
  Send,
  Settings2,
  Search as SearchIcon,
} from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ConfigureAPNDialog from "@/components/hes/controlsconfigs/meter-remote-config/configure-apn-dialog";
import ConfigureCTVTRatioDialog from "@/components/hes/controlsconfigs/meter-remote-config/configure-ctv-ratio-dialog";
import ChangeRelayModeDialog from "@/components/hes/controlsconfigs/meter-remote-config/change-relay-mode-dialog";
import SetDateTimeDialog from "@/components/hes/controlsconfigs/meter-remote-config/set-date-time-dialog";
import ConfigureIPDialog from "@/components/hes/controlsconfigs/meter-remote-config/configure-ip-dialog";
import ViewDetailsDialog from "@/components/hes/controlsconfigs/meter-remote-config/view-details-dialog";
import ReadIPDialog from "@/components/hes/controlsconfigs/meter-remote-config/read-ip-dialog";
import ReadAPNDialog from "@/components/hes/controlsconfigs/meter-remote-config/read-apn-dialog";
import ReadCTVTRatioDialog from "@/components/hes/controlsconfigs/meter-remote-config/read-ctv-ratio-dialog";
import ReadRelayModeDialog from "@/components/hes/controlsconfigs/meter-remote-config/read-relay-mode-dialog";
import ReadRelayStatusDialog from "@/components/hes/controlsconfigs/meter-remote-config/read-relay-status-dialog";
import ReadDateTimeDialog from "@/components/hes/controlsconfigs/meter-remote-config/read-date-time-dialog";
import ReadCreditBalanceDialog from "@/components/hes/controlsconfigs/meter-remote-config/read-credit-balance-dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { FilterControl } from "@/components/search-control";
import { ChevronDown } from "lucide-react";
import OfflineDialog from "@/components/hes/controlsconfigs/meter-remote-config/offline-meter-dialog";
import SendTokenDialog from "@/components/hes/dashboard/send-token-dialog";
import type { Meter } from "@/types/meter";
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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  useMeterConfigurations,
  useRelayControl,
  useSetToken,
} from "@/hooks/use-configure-meter";

// Define the possible dialog types
type DialogType =
  | "apn"
  | "ctvt"
  | "relay"
  | "datetime"
  | "ip"
  | "viewDetails"
  | "sendToken"
  | "readIp"
  | "readApn"
  | "readCtv"
  | "readRelay"
  | "readDatetime"
  | "readRelayStatus"
  | "readCreditBalance";

// Define filter sections
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
    title: "Status",
    options: [
      { label: "Online", id: "online" },
      { label: "Offline", id: "offline" },
    ],
  },
];

export default function MeterRemoteConfigPage() {
  const [selectedMeter, setSelectedMeter] = useState<Meter | undefined>(
    undefined,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Meter;
    direction: "asc" | "desc";
  }>({ key: "sN", direction: "asc" });
  const [activeFilters, setActiveFilters] = useState<
    Record<string, string | boolean>
  >({});
  const [selectedMeters, setSelectedMeters] = useState<string[]>([]);
  const [selectedConfigOption, setSelectedConfigOption] =
    useState<DialogType | null>(null);
  const [showOfflineDialog, setShowOfflineDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const selectedClasses = [
    activeFilters.singlePhase && "single-phase",
    activeFilters.threePhase && "three-phase",
    activeFilters.md && "MD",
  ]
    .filter(Boolean)
    .join(",");
  const selectedStatuses = [
    activeFilters.online && "ONLINE",
    activeFilters.offline && "OFFLINE",
  ]
    .filter(Boolean)
    .join(",");
  const { data, isLoading, error, refetch } = useMeterConfigurations({
    page: currentPage - 1,
    size: rowsPerPage,
    search: searchTerm.trim() || undefined,
    meterClass: selectedClasses || undefined,
    status: selectedStatuses || undefined,
    sortBy: sortConfig.key as "sN" | "meterNumber" | "status",
    sortDirection: sortConfig.direction,
  });
  const meterData = data?.meters ?? [];
  const totalData = data?.totalData ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const relayControlMutation = useRelayControl();
  const setTokenMutation = useSetToken();

  const handleConfigureAction = (type: DialogType) => {
    if (selectedMeters.length === 0) {
      return;
    }

    const offlineMeters = meterData.filter(
      (m) => selectedMeters.includes(m.sN) && m.status === "Offline",
    );
    if (offlineMeters.length > 0) {
      setShowOfflineDialog(true);
      setIsDialogOpen(false);
    } else {
      // For now, we'll configure the first selected meter.
      // A more complex implementation would handle bulk configurations.
      const meterToConfigure = meterData.find(
        (m) => m.sN === selectedMeters[0],
      );
      if (meterToConfigure) {
        setSelectedMeter(meterToConfigure);
        setDialogType(type);
        setIsDialogOpen(true);
        setSelectedConfigOption(type);
      }
    }
  };

  const handleViewDetails = (meter: Meter) => {
    setSelectedMeter(meter);
    setDialogType("viewDetails");
    setIsDialogOpen(true);
    setShowOfflineDialog(false);
  };

  const handleReadAction = (meter: Meter, type: DialogType) => {
    setSelectedMeter(meter);
    setDialogType(type);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedMeter(undefined);
    setDialogType(null);
    setShowOfflineDialog(false);
    setSelectedConfigOption(null);
  };

  // Handle bulk upload save
  // const handleBulkUploadSave = (data: File | Meter[]) => {
  //     if (data instanceof File) {
  //         // Handle raw file if sendRawFile is true, but currently it's false
  //         console.warn("Raw file received, but not handled");
  //     } else {
  //         setMeterData((prevData) => [
  //             ...prevData,
  //             ...data.map((item, index) => ({
  //                 ...item,
  //                 sN: (prevData.length + index + 1).toString().padStart(2, "0"),
  //             })),
  //         ]);
  //         setCurrentPage(1);
  //     }
  // };

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

  const handleSortChange = (key: keyof Meter, direction: "asc" | "desc") => {
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const toggleMeterSelection = (sN: string) => {
    setSelectedMeters((prev) =>
      prev.includes(sN) ? prev.filter((id) => id !== sN) : [...prev, sN],
    );
  };

  const toggleSelectAll = () => {
    if (selectedMeters.length === meterData.length && meterData.length > 0) {
      setSelectedMeters([]);
    } else {
      setSelectedMeters(meterData.map((meter) => meter.sN));
    }
  };

  const handleSetActiveFilters = (
    filters: Record<string, string | boolean>,
  ) => {
    setActiveFilters(filters);
    setCurrentPage(1);
  };

  const isConfigureButtonDisabled = selectedMeters.length === 0;

  return (
    <div className="flex h-screen w-full flex-col overflow-y-auto p-6">
      <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
        <ContentHeader
          title="Meter Remote Configuration"
          description="Enable remote setup and management of meter settings for efficient monitoring."
        />
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="flex w-full cursor-pointer items-center gap-2 border bg-[#161CCA] font-medium text-white md:w-auto"
                variant="outline"
                size="lg"
                disabled={isConfigureButtonDisabled}
              >
                <Settings2
                  size={14}
                  strokeWidth={2.3}
                  className="h-4 w-4 text-white"
                />
                <span className="text-sm md:text-base">Configure Meter</span>
                <ChevronDown size={14} className="h-4 w-4 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]">
              <DropdownMenuItem
                onClick={() => handleConfigureAction("ip")}
                className="flex cursor-pointer items-center justify-between"
              >
                <span>Configure IP Address</span>
                {selectedConfigOption === "ip" && (
                  <span className="text-black">✓</span>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleConfigureAction("apn")}
                className="flex cursor-pointer items-center justify-between"
              >
                <span>Configure APN</span>
                {selectedConfigOption === "apn" && (
                  <span className="text-black">✓</span>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleConfigureAction("ctvt")}
                className="flex cursor-pointer items-center justify-between"
              >
                <span>Configure CT & VT Ratio</span>
                {selectedConfigOption === "ctvt" && (
                  <span className="text-black">✓</span>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleConfigureAction("relay")}
                className="flex cursor-pointer items-center justify-between"
              >
                <span>Change Relay Mode</span>
                {selectedConfigOption === "relay" && (
                  <span className="text-black">✓</span>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleConfigureAction("datetime")}
                className="flex cursor-pointer items-center justify-between"
              >
                <span>Set Date and Time</span>
                {selectedConfigOption === "datetime" && (
                  <span className="text-black">✓</span>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mb-4 flex w-full flex-col items-center gap-4 md:flex-row">
        <div className="relative w-full md:w-[300px]">
          <Search
            size={14}
            className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400"
          />
          <Input
            type="text"
            placeholder="Search by meter no., sim no, etc..."
            className="w-full border-gray-300 pl-10 focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
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
              onClick={() => handleSortChange("sN", "asc")}
              className="cursor-pointer text-sm hover:bg-gray-100"
            >
              S/N (A-Z)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleSortChange("sN", "desc")}
              className="cursor-pointer text-sm hover:bg-gray-100"
            >
              S/N (Z-A)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleSortChange("meterNumber", "asc")}
              className="cursor-pointer text-sm hover:bg-gray-100"
            >
              Meter Number (A-Z)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleSortChange("meterNumber", "desc")}
              className="cursor-pointer text-sm hover:bg-gray-100"
            >
              Meter Number (Z-A)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleSortChange("status", "asc")}
              className="cursor-pointer text-sm hover:bg-gray-100"
            >
              Status (A-Z)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleSortChange("status", "desc")}
              className="cursor-pointer text-sm hover:bg-gray-100"
            >
              Status (Z-A)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card className="overflow-x-auto border-none bg-transparent shadow-none">
        <Table className="w-full table-auto">
          <TableHeader>
            <TableRow className="bg-gray-200">
              <TableHead className="w-[70px] p-2 text-left text-sm font-medium text-gray-600">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={
                      selectedMeters.length === meterData.length &&
                      meterData.length > 0
                    }
                    onCheckedChange={toggleSelectAll}
                    className="border-gray-300"
                  />
                  <span>S/N</span>
                </div>
              </TableHead>
              <TableHead className="p-2 text-left text-sm font-medium text-gray-600">
                Meter Number
              </TableHead>
              <TableHead className="p-2 text-left text-sm font-medium text-gray-600">
                SIM No
              </TableHead>
              <TableHead className="p-2 text-left text-sm font-medium text-gray-600">
                Business Hub
              </TableHead>
              <TableHead className="p-2 text-left text-sm font-medium text-gray-600">
                Class
              </TableHead>
              <TableHead className="p-2 text-left text-sm font-medium text-gray-600">
                Category
              </TableHead>
              <TableHead className="p-2 text-left text-sm font-medium text-gray-600">
                Manufacturer
              </TableHead>
              <TableHead className="p-2 text-left text-sm font-medium text-gray-600">
                Model
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Loading meters…</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : meterData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="h-24 text-center text-sm text-gray-500"
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              meterData.map((meter, index) => (
                <TableRow
                  key={meter.sN}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <TableCell className="p-2 text-sm text-gray-800">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedMeters.includes(meter.sN)}
                        onCheckedChange={() => toggleMeterSelection(meter.sN)}
                        className="border-gray-300"
                      />
                      <span>{index + 1 + (currentPage - 1) * rowsPerPage}</span>
                    </div>
                  </TableCell>
                  <TableCell className="p-2 text-sm text-gray-800">
                    {meter.meterNumber}
                  </TableCell>
                  <TableCell className="p-2 text-sm text-gray-800">
                    {meter.simNo}
                  </TableCell>
                  <TableCell className="p-2 text-sm text-gray-800">
                    {meter.businessHub}
                  </TableCell>
                  <TableCell className="p-2 text-sm text-gray-800">
                    {meter.class}
                  </TableCell>
                  <TableCell className="p-2 text-sm text-gray-800">
                    {meter.category}
                  </TableCell>
                  <TableCell className="p-2 text-sm text-gray-800">
                    {meter.manufacturer}
                  </TableCell>
                  <TableCell className="p-2 text-sm text-gray-800">
                    {meter.model}
                  </TableCell>
                  <TableCell className="p-2 text-sm">
                    <span
                      className={`rounded-full px-2 py-1 ${
                        meter.status === "Online"
                          ? "bg-[#E9FBF0] text-[#059E40]"
                          : "bg-[#FBE9E9] text-[#F50202]"
                      }`}
                    >
                      {meter.status}
                    </span>
                  </TableCell>
                  <TableCell className="p-2 text-sm text-gray-800">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="default"
                          size="sm"
                          className="cursor-pointer border-gray-200 focus:ring-gray-500/0"
                          onClick={() => setSelectedMeter(meter)}
                        >
                          <MoreVertical
                            size={16}
                            className="border-gray-200 text-gray-500"
                          />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onSelect={() => handleViewDetails(meter)}
                        >
                          <div className="flex w-full items-center gap-2">
                            <Eye size={14} />
                            <span className="cursor-pointer">View Meter</span>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={(e) => {
                            e.preventDefault();
                            console.log(
                              "Connect relay clicked for meter:",
                              meter.sN,
                            );
                            relayControlMutation.mutate({
                              serial: meter.sN,
                              state: 1,
                              type: "connect",
                            });
                          }}
                          disabled={relayControlMutation.isPending}
                        >
                          <div className="flex w-full items-center gap-2">
                            <CircleCheck size={14} />
                            <span className="cursor-pointer">
                              Connect Relay
                            </span>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={(e) => {
                            e.preventDefault();
                            console.log(
                              "Disconnect relay clicked for meter:",
                              meter.sN,
                            );
                            relayControlMutation.mutate({
                              serial: meter.sN,
                              state: 0,
                              type: "disconnect",
                            });
                          }}
                          disabled={relayControlMutation.isPending}
                        >
                          <div className="flex w-full items-center gap-2">
                            <Ban size={14} />
                            <span className="cursor-pointer">
                              Disconnect Relay
                            </span>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => {
                            setSelectedMeter(meter);
                            setDialogType("sendToken");
                            setIsDialogOpen(true);
                          }}
                        >
                          <div className="flex w-full items-center gap-2">
                            <Send size={14} />
                            <span className="cursor-pointer">Send Token</span>
                          </div>
                        </DropdownMenuItem>

                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex w-full items-center gap-2">
                            <SearchIcon
                              size={14}
                              strokeWidth={2.3}
                              className="h-4 w-4"
                            />
                            <span className="text-sm md:text-base">
                              Read Meter
                            </span>
                          </DropdownMenuSubTrigger>

                          <DropdownMenuSubContent className="w-[200px] space-y-2 border-0 bg-white text-gray-700">
                            <DropdownMenuItem
                              onClick={() => handleReadAction(meter, "readIp")}
                              className="flex cursor-pointer items-center justify-between"
                            >
                              <span>Read IP Address</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleReadAction(meter, "readApn")}
                              className="flex cursor-pointer items-center justify-between"
                            >
                              <span>Read APN</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleReadAction(meter, "readCtv")}
                              className="flex cursor-pointer items-center justify-between"
                            >
                              <span>Read CT & VT Ratio</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleReadAction(meter, "readRelay")
                              }
                              className="flex cursor-pointer items-center justify-between"
                            >
                              <span>Read Relay Mode</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleReadAction(meter, "readRelayStatus")
                              }
                              className="flex cursor-pointer items-center justify-between"
                            >
                              <span>Read Relay Status</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleReadAction(meter, "readDatetime")
                              }
                              className="flex cursor-pointer items-center justify-between"
                            >
                              <span>Read Date and Time</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleReadAction(meter, "readCreditBalance")
                              }
                              className="flex cursor-pointer items-center justify-between"
                            >
                              <span>Read Credit Balance</span>
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
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
              {totalData === 0
                ? "0"
                : `${(currentPage - 1) * rowsPerPage + 1}–${Math.min(
                    currentPage * rowsPerPage,
                    totalData,
                  )}`}{" "}
              of {totalData}
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

      {isDialogOpen && dialogType === "apn" && selectedMeter && (
        <ConfigureAPNDialog
          isOpen={true}
          onClose={closeDialog}
          meter={selectedMeter}
        />
      )}
      {isDialogOpen && dialogType === "ctvt" && selectedMeter && (
        <ConfigureCTVTRatioDialog
          isOpen={true}
          onClose={closeDialog}
          meter={selectedMeter}
        />
      )}
      {isDialogOpen && dialogType === "relay" && selectedMeter && (
        <ChangeRelayModeDialog
          isOpen={true}
          onClose={closeDialog}
          meter={selectedMeter}
        />
      )}
      {isDialogOpen && dialogType === "datetime" && selectedMeter && (
        <SetDateTimeDialog
          isOpen={true}
          onClose={closeDialog}
          meter={selectedMeter}
        />
      )}
      {isDialogOpen && dialogType === "ip" && selectedMeter && (
        <ConfigureIPDialog
          isOpen={true}
          onClose={closeDialog}
          meter={selectedMeter}
        />
      )}
      {isDialogOpen && dialogType === "viewDetails" && selectedMeter && (
        <ViewDetailsDialog
          isOpen={true}
          onClose={closeDialog}
          meter={selectedMeter}
        />
      )}
      {isDialogOpen && dialogType === "sendToken" && selectedMeter && (
        <SendTokenDialog
          isOpen={true}
          onClose={closeDialog}
          meterNumber={selectedMeter.meterNumber}
          onSubmit={(token) => {
            return new Promise<void>((resolve, reject) => {
              setTokenMutation.mutate(
                { serial: selectedMeter.meterNumber, credit: token },
                {
                  onSuccess: () => resolve(),
                  onError: (error) => reject(error),
                }
              );
            });
          }}
        />
      )}
      {isDialogOpen && dialogType === "readIp" && selectedMeter && (
        <ReadIPDialog
          isOpen={true}
          onClose={closeDialog}
          meter={selectedMeter}
        />
      )}
      {isDialogOpen && dialogType === "readApn" && selectedMeter && (
        <ReadAPNDialog
          isOpen={true}
          onClose={closeDialog}
          meter={selectedMeter}
        />
      )}
      {isDialogOpen && dialogType === "readCtv" && selectedMeter && (
        <ReadCTVTRatioDialog
          isOpen={true}
          onClose={closeDialog}
          meter={selectedMeter}
        />
      )}
      {isDialogOpen && dialogType === "readRelay" && selectedMeter && (
        <ReadRelayModeDialog
          isOpen={true}
          onClose={closeDialog}
          meter={selectedMeter}
        />
      )}
      {isDialogOpen && dialogType === "readDatetime" && selectedMeter && (
        <ReadDateTimeDialog
          isOpen={true}
          onClose={closeDialog}
          meter={selectedMeter}
        />
      )}
      {isDialogOpen && dialogType === "readRelayStatus" && selectedMeter && (
        <ReadRelayStatusDialog
          isOpen={true}
          onClose={closeDialog}
          meter={selectedMeter}
        />
      )}
      {isDialogOpen && dialogType === "readCreditBalance" && selectedMeter && (
        <ReadCreditBalanceDialog
          isOpen={true}
          onClose={closeDialog}
          meter={selectedMeter}
        />
      )}
      {showOfflineDialog && (
        <OfflineDialog isOpen={true} onClose={closeDialog} />
      )}
    </div>
  );
}

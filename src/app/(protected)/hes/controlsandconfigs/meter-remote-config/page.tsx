"use client";

import { Button } from "@/components/ui/button";
import { ContentHeader } from "@/components/ui/content-header";
import { Eye, MoreVertical, Settings2 } from "lucide-react";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ConfigureAPNDialog from "@/components/hes/controlsconfigs/meter-remote-config/configure-apn-dialog";
import ConfigureCTVTRatioDialog from "@/components/hes/controlsconfigs/meter-remote-config/configure-ctv-ratio-dialog";
import ChangeRelayModeDialog from "@/components/hes/controlsconfigs/meter-remote-config/change-relay-mode-dialog";
import SetDateTimeDialog from "@/components/hes/controlsconfigs/meter-remote-config/set-date-time-dialog";
import ConfigureIPDialog from "@/components/hes/controlsconfigs/meter-remote-config/configure-ip-dialog";
import ViewDetailsDialog from "@/components/hes/controlsconfigs/meter-remote-config/view-details-dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { FilterControl } from "@/components/search-control";
import { ChevronDown } from "lucide-react";
import OfflineDialog from "@/components/hes/controlsconfigs/meter-remote-config/offline-meter-dialog";

// Define the type for meter data
interface Meter {
  sN: string;
  meterNumber: string;
  simNo: string;
  businessHub: string;
  class: string;
  category: string;
  manufacturer: string;
  model: string;
  status: string;
  region: string;
  serviceCenter: string;
  feeder: string;
  transformer: string;
  lastSync: string;
}

// Define the possible dialog types
type DialogType = "apn" | "ctvt" | "relay" | "datetime" | "ip" | "viewDetails";

// Define filter sections similar to UserManagement and DataCollScheduler
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
    title: "Meter Category",
    options: [
      { label: "Prepaid", id: "prepaid" },
      { label: "Postpaid", id: "postpaid" },
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

const meterData: Meter[] = [
  {
    sN: "01",
    meterNumber: "61245269523",
    simNo: "89000497699707079",
    businessHub: "ljeun",
    class: "MD",
    category: "Prepaid",
    manufacturer: "Momas",
    model: "MX-300",
    status: "Online",
    region: "Ogun",
    serviceCenter: "ljeun",
    feeder: "ljeun",
    transformer: "Olowotedo",
    lastSync: "01:00 am",
  },
  {
    sN: "02",
    meterNumber: "61245269523",
    simNo: "89000497699707079",
    businessHub: "ljeun",
    class: "Single Phase",
    category: "Prepaid",
    manufacturer: "Momas",
    model: "MX-300",
    status: "Online",
    region: "Ogun",
    serviceCenter: "ljeun",
    feeder: "ljeun",
    transformer: "Olowotedo",
    lastSync: "01:00 am",
  },
  {
    sN: "03",
    meterNumber: "61245269523",
    simNo: "89000497699707079",
    businessHub: "ljeun",
    class: "Three Phase",
    category: "Prepaid",
    manufacturer: "Momas",
    model: "MX-300",
    status: "Offline",
    region: "Ogun",
    serviceCenter: "ljeun",
    feeder: "ljeun",
    transformer: "Olowotedo",
    lastSync: "01:00 am",
  },
  {
    sN: "04",
    meterNumber: "61245269523",
    simNo: "89000497699707079",
    businessHub: "ljeun",
    class: "MD",
    category: "Postpaid",
    manufacturer: "Momas",
    model: "MX-300",
    status: "Offline",
    region: "Ogun",
    serviceCenter: "ljeun",
    feeder: "ljeun",
    transformer: "Olowotedo",
    lastSync: "01:00 am",
  },
  {
    sN: "05",
    meterNumber: "61245269523",
    simNo: "89000497699707079",
    businessHub: "ljeun",
    class: "MD",
    category: "Postpaid",
    manufacturer: "Momas",
    model: "MX-300",
    status: "Online",
    region: "Ogun",
    serviceCenter: "ljeun",
    feeder: "ljeun",
    transformer: "Olowotedo",
    lastSync: "01:00 am",
  },
  {
    sN: "06",
    meterNumber: "61245269523",
    simNo: "89000497699707079",
    businessHub: "ljeun",
    class: "MD",
    category: "Postpaid",
    manufacturer: "Momas",
    model: "MX-300",
    status: "Offline",
    region: "Ogun",
    serviceCenter: "ljeun",
    feeder: "ljeun",
    transformer: "Olowotedo",
    lastSync: "01:00 am",
  },
  {
    sN: "07",
    meterNumber: "61245269523",
    simNo: "89000497699707079",
    businessHub: "ljeun",
    class: "MD",
    category: "Postpaid",
    manufacturer: "Momas",
    model: "MX-300",
    status: "Offline",
    region: "Ogun",
    serviceCenter: "ljeun",
    feeder: "ljeun",
    transformer: "Olowotedo",
    lastSync: "01:00 am",
  },
  {
    sN: "08",
    meterNumber: "61245269523",
    simNo: "89000497699707079",
    businessHub: "ljeun",
    class: "MD",
    category: "Postpaid",
    manufacturer: "Momas",
    model: "MX-300",
    status: "Online",
    region: "Ogun",
    serviceCenter: "ljeun",
    feeder: "ljeun",
    transformer: "Olowotedo",
    lastSync: "01:00 am",
  },
  {
    sN: "09",
    meterNumber: "61245269523",
    simNo: "89000497699707079",
    businessHub: "ljeun",
    class: "MD",
    category: "Postpaid",
    manufacturer: "Momas",
    model: "MX-300",
    status: "Online",
    region: "Ogun",
    serviceCenter: "ljeun",
    feeder: "ljeun",
    transformer: "Olowotedo",
    lastSync: "01:00 am",
  },
  {
    sN: "10",
    meterNumber: "61245269523",
    simNo: "89000497699707079",
    businessHub: "ljeun",
    class: "MD",
    category: "Postpaid",
    manufacturer: "Momas",
    model: "MX-300",
    status: "Online",
    region: "Ogun",
    serviceCenter: "ljeun",
    feeder: "ljeun",
    transformer: "Olowotedo",
    lastSync: "01:00 am",
  },
];

export default function MeterRemoteConfigPage() {
  const [selectedMeter, setSelectedMeter] = useState<Meter | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Meter;
    direction: "asc" | "desc";
  }>({ key: "sN", direction: "asc" });
  const [selectedMeters, setSelectedMeters] = useState<string[]>([]);
  const [selectedConfigOption, setSelectedConfigOption] = useState<DialogType | null>(null);
  const [showOfflineDialog, setShowOfflineDialog] = useState(false); // New state for offline dialog

  const handleConfigureAction = (type: DialogType) => {
    // Check if any of the selected meters are offline
    const areAnyMetersOffline = selectedMeters.some(sN => {
      const meter = meterData.find(m => m.sN === sN);
      return meter && meter.status === "Offline";
    });

    if (areAnyMetersOffline) {
      setShowOfflineDialog(true);
      setIsDialogOpen(false); // Make sure other dialogs are not open
    } else {
      // If all selected meters are online, proceed
      setDialogType(type);
      setIsDialogOpen(true);
      setSelectedConfigOption(type);
      setShowOfflineDialog(false); // Make sure offline dialog is not open
    }
  };

  const handleViewDetails = (meter: Meter) => {
    setSelectedMeter(meter);
    setDialogType("viewDetails");
    setIsDialogOpen(true);
    setShowOfflineDialog(false);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedMeter(null);
    setDialogType(null);
    setShowOfflineDialog(false);
  };

  // Apply search filter
  const filteredData = meterData.filter((meter) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      meter.sN.toLowerCase().includes(searchLower) ||
      meter.meterNumber.toLowerCase().includes(searchLower) ||
      meter.simNo.toLowerCase().includes(searchLower) ||
      meter.businessHub.toLowerCase().includes(searchLower) ||
      meter.class.toLowerCase().includes(searchLower) ||
      meter.category.toLowerCase().includes(searchLower) ||
      meter.manufacturer.toLowerCase().includes(searchLower) ||
      meter.model.toLowerCase().includes(searchLower) ||
      meter.status.toLowerCase().includes(searchLower) ||
      meter.region.toLowerCase().includes(searchLower) ||
      meter.serviceCenter.toLowerCase().includes(searchLower) ||
      meter.feeder.toLowerCase().includes(searchLower) ||
      meter.transformer.toLowerCase().includes(searchLower) ||
      meter.lastSync.toLowerCase().includes(searchLower)
    );
  });

  // Apply sorting
  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    return 0;
  });

  const handleSortChange = (key: keyof Meter, direction: "asc" | "desc") => {
    setSortConfig({ key, direction });
  };

  const toggleMeterSelection = (sN: string) => {
    setSelectedMeters((prev) =>
      prev.includes(sN) ? prev.filter((id) => id !== sN) : [...prev, sN]
    );
  };

  const toggleSelectAll = () => {
    if (selectedMeters.length === sortedData.length) {
      setSelectedMeters([]);
    } else {
      setSelectedMeters(sortedData.map((meter) => meter.sN));
    }
  };

  const handleSetActiveFilters = (filters: Record<string, string | boolean>) => {
    console.log("Filters applied:", filters);
    // Implement filter logic here if needed
  };

  return (
    <div className="p-6 overflow-y-hidden h-screen w-full flex flex-col">
      <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
        <ContentHeader
          title="Meter Remote Configuration"
          description="Enable remote setup and management of meter settings for efficient monitoring."
        />
        <div className="flex gap-2">
          <Button
            className="flex w-full cursor-pointer items-center gap-2 border bg-white font-medium text-[#161CCA] md:w-auto"
            variant="outline"
            size="lg"
          >
            <Settings2 size={14} strokeWidth={2.3} className="h-4 w-4 text-[#161CCA]" />
            <span className="text-sm md:text-base">Bulk Upload</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="flex w-full cursor-pointer items-center gap-2 border bg-[#161CCA] font-medium text-white md:w-auto"
                variant="outline"
                size="lg"
              >
                <Settings2 size={14} strokeWidth={2.3} className="h-4 w-4 text-white" />
                <span className="text-sm md:text-base">Configure Meter</span>
                <ChevronDown size={14} className="h-4 w-4 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]">
              <DropdownMenuItem
                onClick={() => handleConfigureAction("ip")}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>Configure IP Address</span>
                {selectedConfigOption === "ip" && <span className="text-black">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleConfigureAction("apn")}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>Configure APN</span>
                {selectedConfigOption === "apn" && <span className="text-black">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleConfigureAction("ctvt")}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>Configure CT & VT Ratio</span>
                {selectedConfigOption === "ctvt" && <span className="text-black">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleConfigureAction("relay")}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>Change Relay Mode</span>
                {selectedConfigOption === "relay" && <span className="text-black">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleConfigureAction("datetime")}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>Set Date and Time</span>
                {selectedConfigOption === "datetime" && <span className="text-black">✓</span>}
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
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-200">
              <TableHead className="w-[70px]">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedMeters.length === sortedData.length && sortedData.length > 0}
                    onCheckedChange={toggleSelectAll}
                    className="border-gray-300"
                  />
                  <span>S/N</span>
                </div>
              </TableHead>
              <TableHead>Meter Number</TableHead>
              <TableHead>SIM No</TableHead>
              <TableHead>Business Hub</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Manufacturer</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((meter) => (
              <TableRow key={meter.sN}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedMeters.includes(meter.sN)}
                      onCheckedChange={() => toggleMeterSelection(meter.sN)}
                      className="border-gray-300"
                    />
                    <span>{meter.sN}</span>
                  </div>
                </TableCell>
                <TableCell>{meter.meterNumber}</TableCell>
                <TableCell>{meter.simNo}</TableCell>
                <TableCell>{meter.businessHub}</TableCell>
                <TableCell>{meter.class}</TableCell>
                <TableCell>{meter.category}</TableCell>
                <TableCell>{meter.manufacturer}</TableCell>
                <TableCell>{meter.model}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded ${meter.status === "Online"
                        ? "bg-[#E9FBF0] text-[#059E40] rounded-full"
                        : "bg-[#FBE9E9] text-[#F50202] rounded-full"
                      }`}
                  >
                    {meter.status}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="default"
                        size="sm"
                        className="cursor-pointer border-gray-200 focus:ring-gray-500/0"
                        onClick={() => setSelectedMeter(meter)} // Set selected meter on button click
                      >
                        <MoreVertical size={16} className="border-gray-200 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onSelect={() => handleViewDetails(meter)}>
                        <div className="flex items-center w-full gap-2">
                          <Eye size={14} />
                          <span className="cursor-pointer">View Meter</span>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {isDialogOpen && dialogType === "apn" && (
        <ConfigureAPNDialog
          isOpen={true}
          onClose={closeDialog}
          meter={selectedMeter}
        />
      )}
      {isDialogOpen && dialogType === "ctvt" && (
        <ConfigureCTVTRatioDialog
          isOpen={true}
          onClose={closeDialog}
          meter={selectedMeter}
        />
      )}
      {isDialogOpen && dialogType === "relay" && (
        <ChangeRelayModeDialog
          isOpen={true}
          onClose={closeDialog}
          meter={selectedMeter}
        />
      )}
      {isDialogOpen && dialogType === "datetime" && (
        <SetDateTimeDialog
          isOpen={true}
          onClose={closeDialog}
          meter={selectedMeter}
        />
      )}
      {isDialogOpen && dialogType === "ip" && (
        <ConfigureIPDialog
          isOpen={true}
          onClose={closeDialog}
          meter={selectedMeter}
        />
      )}
      {showOfflineDialog && (
        <OfflineDialog isOpen={true} onClose={closeDialog} />
      )}
      {isDialogOpen && dialogType === "viewDetails" && (
        <ViewDetailsDialog
          isOpen={true}
          onClose={closeDialog}
          meter={selectedMeter}
        />
      )}
    </div>
  );
}
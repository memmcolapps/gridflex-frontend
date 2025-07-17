// src/app/(protected)/billing/md-prebilling/energy-import/[feederId]/page.tsx
"use client";
import { Button } from "@/components/ui/button";
import { ContentHeader } from "@/components/ui/content-header";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Check, RefreshCw, Percent } from "lucide-react";
import { useState, useCallback, use, useEffect, useMemo } from "react";
import FeederDetailsTable from "@/components/billing/energy-import/feeder-details-table";
import { ConfirmationDialog } from "@/components/billing/energy-import/confirmation-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface FeederDetailsPageProps {
  params: Promise<{
    feederId: string;
  }>;
}

interface FeederDetailsData {
  id: number;
  tariffType: string;
  previousConsumption: string;
  noOfVirtualMeters: number;
  totalConsumption: string;
  consumptionMeter: string;
}

interface EnergyImportData {
  id: number;
  feederName: string;
  assetId: string;
  feederConsumption: string;
  prepaidConsumption: string;
  postpaidConsumption: string;
  mdVirtual: string;
  nonMdVirtual: string;
}

export default function FeederDetailsPage({ params }: FeederDetailsPageProps) {
  const { feederId } = use(params);
  const router = useRouter();

  const [inputValue, setInputValue] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<string>("June");
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const [sortConfig, setSortConfig] = useState<string>("");
  const [currentData, setCurrentData] = useState<FeederDetailsData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [replicationAction, setReplicationAction] = useState<string>("");
  const [feederInfo, setFeederInfo] = useState<{
    feederName: string;
    assetId: string;
  } | null>(null);

  // Move the data outside the component or use useMemo to prevent re-creation
  const energyImportData: EnergyImportData[] = useMemo(
    () => [
      {
        id: 1,
        feederName: "Molara",
        assetId: "6201021223",
        feederConsumption: "250488930.789",
        prepaidConsumption: "250488930.789",
        postpaidConsumption: "250488930.789",
        mdVirtual: "313111.349",
        nonMdVirtual: "NOT SET",
      },
      {
        id: 2,
        feederName: "Ijeun",
        assetId: "6201021224",
        feederConsumption: "250488930.789",
        prepaidConsumption: "125244445.395",
        postpaidConsumption: "9393334.046",
        mdVirtual: "313111.349",
        nonMdVirtual: "NOT SET",
      },
      {
        id: 3,
        feederName: "Sagamu",
        assetId: "6201021225",
        feederConsumption: "250488930.789",
        prepaidConsumption: "125244445.395",
        postpaidConsumption: "9393334.046",
        mdVirtual: "313111.349",
        nonMdVirtual: "NOT SET",
      },
      {
        id: 4,
        feederName: "Olowotedo",
        assetId: "6201021226",
        feederConsumption: "250488930.789",
        prepaidConsumption: "125244445.395",
        postpaidConsumption: "9393334.046",
        mdVirtual: "313111.349",
        nonMdVirtual: "NOT SET",
      },
      {
        id: 5,
        feederName: "Isofo",
        assetId: "6201021227",
        feederConsumption: "250488930.789",
        prepaidConsumption: "125244445.395",
        postpaidConsumption: "9393334.046",
        mdVirtual: "313111.349",
        nonMdVirtual: "NOT SET",
      },
      {
        id: 6,
        feederName: "Mowe",
        assetId: "6201021228",
        feederConsumption: "250488930.789",
        prepaidConsumption: "125244445.395",
        postpaidConsumption: "9393334.046",
        mdVirtual: "313111.349",
        nonMdVirtual: "NOT SET",
      },
      {
        id: 7,
        feederName: "Asese",
        assetId: "6201021229",
        feederConsumption: "250488930.789",
        prepaidConsumption: "125244445.395",
        postpaidConsumption: "9393334.046",
        mdVirtual: "313111.349",
        nonMdVirtual: "NOT SET",
      },
      {
        id: 8,
        feederName: "Berger",
        assetId: "6201021230",
        feederConsumption: "250488930.789",
        prepaidConsumption: "125244445.395",
        postpaidConsumption: "9393334.046",
        mdVirtual: "313111.349",
        nonMdVirtual: "NOT SET",
      },
      {
        id: 9,
        feederName: "Orimuramu",
        assetId: "6201021231",
        feederConsumption: "250488930.789",
        prepaidConsumption: "125244445.395",
        postpaidConsumption: "9393334.046",
        mdVirtual: "313111.349",
        nonMdVirtual: "NOT SET",
      },
      {
        id: 10,
        feederName: "Abeokuta",
        assetId: "6201021232",
        feederConsumption: "250488930.789",
        prepaidConsumption: "125244445.395",
        postpaidConsumption: "9393334.046",
        mdVirtual: "313111.349",
        nonMdVirtual: "NOT SET",
      },
    ],
    [],
  );

  // Find the feeder info based on the feederId (which is the assetId)
  useEffect(() => {
    const foundFeeder = energyImportData.find(
      (feeder) => feeder.assetId === feederId,
    );

    if (foundFeeder) {
      setFeederInfo({
        feederName: foundFeeder.feederName,
        assetId: foundFeeder.assetId,
      });
    } else {
      setFeederInfo({
        feederName: "Unknown Feeder",
        assetId: feederId,
      });
    }
  }, [feederId, energyImportData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputValue(e.target.value);

  // List of months for dropdown - also memoize this
  const months = useMemo(
    () => [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    [],
  );

  // Generate years (current year and past 5 years) - memoize this too
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => (currentYear - i).toString());
  }, []);

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
  };

  // Handle data changes from the table
  const handleDataChange = useCallback((data: FeederDetailsData[]) => {
    setCurrentData(data);
  }, []);

  // Show confirmation dialog when Apply button is clicked
  const handleApplyClick = () => {
    // Validate that all total consumption fields are filled
    const emptyFields = currentData.filter(
      (item) => !item.totalConsumption || item.totalConsumption.trim() === "",
    );

    if (emptyFields.length > 0) {
      toast.error(
        `Please fill in total consumption for all rows. Missing: ${emptyFields.map((item) => item.tariffType).join(", ")}`,
      );
      return;
    }

    // Validate that all values are positive numbers
    const invalidFields = currentData.filter((item) => {
      const value = parseFloat(item.totalConsumption);
      return isNaN(value) || value < 0;
    });

    if (invalidFields.length > 0) {
      toast.error(
        `Please enter valid positive numbers for: ${invalidFields.map((item) => item.tariffType).join(", ")}`,
      );
      return;
    }

    // Show confirmation dialog
    setShowConfirmDialog(true);
  };

  // Apply functionality - validates and processes the data
  const handleApplyConfirm = async () => {
    setShowConfirmDialog(false);
    setIsLoading(true);

    try {
      // Simulate API call for applying changes
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Calculate efficiency score or perform other business logic
      const totalConsumption = currentData.reduce(
        (sum, item) => sum + parseFloat(item.totalConsumption),
        0,
      );

      toast.success(
        `Applied successfully! Total consumption: ${totalConsumption.toLocaleString()} kwh`,
      );
    } catch {
      toast.error("Failed to apply changes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel confirmation dialog
  const handleApplyCancel = () => {
    setShowConfirmDialog(false);
  };

  // Update the API call simulation to use feederId
  const handleSave = async () => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate to the energy import page
      router.push("/billing/non-md-prebilling/energy-import");

      // Show success toast after navigation
      setTimeout(() => {
        toast.success("Non-MD Virtual Consumption successfully Added");
      }, 100);
    } catch {
      toast.error("Failed to save data. Please try again.");
      setIsLoading(false);
    }
  };

  // Handle replication actions
  const handleReplicationClick = (type: string) => {
    setReplicationAction(type);
    setShowConfirmDialog(true);
  };

  // Get confirmation dialog content based on action
  const getConfirmationContent = () => {
    if (replicationAction.includes("10%")) {
      return {
        title: "Confirm Consumption Data",
        description:
          "Please confirm that you would like to use the previous month's consumption for the current month, with a 10% increase applied",
      };
    } else if (replicationAction.includes("15%")) {
      return {
        title: "Confirm Consumption Data",
        description:
          "Please confirm that you would like to use the previous month's consumption for the current month, with a 15% increase applied",
      };
    } else if (replicationAction.includes("-10%")) {
      return {
        title: "Confirm Consumption Data",
        description:
          "Please confirm that you would like to use the previous month's consumption for the current month, with a 10% decrease applied",
      };
    } else if (replicationAction.includes("-15%")) {
      return {
        title: "Confirm Consumption Data",
        description:
          "Please confirm that you would like to use the previous month's consumption for the current month, with a 15% decrease applied",
      };
    } else {
      return {
        title: "Confirm Consumption Data",
        description:
          "Please confirm you would like to apply the previous month's consumption data to the current month",
      };
    }
  };

  const handleReplicationConfirm = async () => {
    setShowConfirmDialog(false);

    // Add your replication logic here based on replicationAction
    toast.info(`${replicationAction} applied`);

    setReplicationAction("");
  };

  const handleReplicationCancel = () => {
    setShowConfirmDialog(false);
    setReplicationAction("");
  };

  // Show loading state while feeder info is being determined
  if (!feederInfo) {
    return (
      <div className="p-6">
        <div className="flex h-32 items-center justify-center">
          <div className="text-lg">Loading feeder information...</div>
        </div>
      </div>
    );
  }

  // Use sortConfig to pass to table
  console.log(sortConfig);

  return (
    <div className="p-6">
      {/* Content Header - Now dynamically shows the clicked feeder's info */}
      <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
        <ContentHeader
          title={`${feederInfo.feederName} Feeder`}
          description={`Asset ID: ${feederInfo.assetId}`}
        />
        <div className="flex flex-col gap-2 md:flex-row">
          <Button
            className="flex w-full cursor-pointer items-center gap-2 border border-[#161CCA] font-medium text-[#161CCA] md:w-auto"
            variant="outline"
            size="lg"
            onClick={handleApplyClick}
            disabled={isLoading}
          >
            <Check size={14} strokeWidth={2.3} className="h-4 w-4" />
            <span className="text-sm md:text-base">
              {isLoading ? "Applying..." : "Apply"}
            </span>
          </Button>
          <Button
            className="flex w-full cursor-pointer items-center gap-2 bg-[#161CCA] font-medium text-white md:w-auto"
            variant="secondary"
            size="lg"
            onClick={handleSave}
            disabled={isLoading}
          >
            <span className="text-sm md:text-base">
              {isLoading ? "Saving..." : "Save"}
            </span>
          </Button>
        </div>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-full lg:w-[300px]">
            <Search
              size={14}
              className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400"
            />
            <Input
              type="text"
              placeholder="Search by meter no., feeder, cont..."
              value={inputValue}
              onChange={handleChange}
              className="w-full border-gray-300 pl-10 text-sm focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50 lg:text-base"
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedMonth} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-[100px] cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem
                    key={month}
                    value={month}
                    className="cursor-pointer"
                  >
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={handleYearChange}>
              <SelectTrigger className="w-[80px] cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem
                    key={year}
                    value={year}
                    className="cursor-pointer"
                  >
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-8">
          {/* Refresh Button with Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 cursor-pointer rounded-full bg-green-500 text-white hover:bg-green-600"
              >
                <RefreshCw size={16} className="text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuItem
                onClick={() =>
                  handleReplicationClick("Replicate Previous Consumption")
                }
                className="cursor-pointer"
              >
                <RefreshCw size={16} className="mr-2" />
                Replicate Previous Consumption
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleReplicationClick("Replicate last consumption +10%")
                }
                className="cursor-pointer"
              >
                <Percent size={16} className="mr-2" />
                Replicate last consumption +10%
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleReplicationClick("Replicate last consumption +15%")
                }
                className="cursor-pointer"
              >
                <Percent size={16} className="mr-2" />
                Replicate last consumption +15%
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleReplicationClick("Replicate last consumption -10%")
                }
                className="cursor-pointer"
              >
                <Percent size={16} className="mr-2" />
                Replicate last consumption -10%
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleReplicationClick("Replicate last consumption -15%")
                }
                className="cursor-pointer"
              >
                <Percent size={16} className="mr-2" />
                Replicate last consumption -15%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Efficiency Score */}
          <div className="text-sm text-gray-600">
            <div>Efficiency Score:</div>
            <div className="text-center text-2xl font-bold">0</div>
          </div>
        </div>
      </div>

      <div className="flex-1 rounded-lg border border-gray-200 bg-white">
        <FeederDetailsTable
          feederId={feederId}
          searchQuery={inputValue}
          sortConfig={sortConfig}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onDataChange={handleDataChange}
          onApply={handleApplyConfirm}
        />
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={
          replicationAction ? handleReplicationConfirm : handleApplyConfirm
        }
        onCancel={
          replicationAction ? handleReplicationCancel : handleApplyCancel
        }
        title={getConfirmationContent().title}
        description={getConfirmationContent().description}
        confirmText="Confirm"
        cancelText="Cancel"
        isLoading={isLoading}
      />
    </div>
  );
}

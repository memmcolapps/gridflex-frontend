"use client";
import { cn } from "@/lib/utils";
import { NotificationBar } from "@/components/notificationbar";
import { TariffTable } from "@/components/tariff/tariff-table";
import { Button } from "@/components/ui/button";
import { ContentHeader } from "@/components/ui/content-header";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  ArrowUpDown,
  CirclePlusIcon,
  ListFilter,
  Search,
  SquareArrowOutUpRight,
  CalendarIcon,
  Loader2,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { useBand } from "@/hooks/use-band";
import { usePermissions } from "@/hooks/use-permissions";
import {
  useCreateTariff,
  useTariff,
  useExportTariff,
} from "@/hooks/use-tarrif";
import { LoadingAnimation } from "@/components/ui/loading-animation";

export default function TariffManagementPage() {
  const { canEdit } = usePermissions();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTariffs, setSelectedTariffs] = useState<string[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    effectiveDate: null as Date | null,
    bandCode: "",
    tariffRate: "",
    status: "",
    approvalStatus: "pending",
  });

  const { bands, isLoading: bandsLoading, error: bandsError } = useBand();
  const { tariffs, isLoading, error: tariffError } = useTariff();
  const { mutate: createTariff } = useCreateTariff();
  const { mutate: exportTariff, isPending: isExporting } = useExportTariff();

  const handleInputChange = (field: string, value: string | Date | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    handleInputChange("effectiveDate", date ?? null);
    setIsCalendarOpen(false);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      effectiveDate: null,
      bandCode: "",
      tariffRate: "",
      status: "inactive",
      approvalStatus: "pending",
    });
  };

  const handleBulkApprove = async () => {
    try {
      const success = true;
      if (success) {
        setSelectedTariffs([]);
        toast.success("Bulk approve successful");
      }
    } catch (error) {
      console.error("Bulk approve error:", error);
      toast.error("Failed to bulk approve tariffs");
    }
  };

  const handleExport = () => {
    exportTariff(
      {},
      {
        onSuccess: (blob) => {
          // Create a download link for the Excel file
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `tariff_export_${new Date().toISOString().split("T")[0]}.xlsx`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          toast.success("Tariff export downloaded successfully!");
        },
        onError: (error) => {
          toast.error(
            error.message || "Failed to export tariff data. Please try again.",
          );
          console.error("Export error:", error);
        },
      },
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);

    const newTariff = {
      name: formData.name,
      tariff_type: formData.type,
      effective_date: formData.effectiveDate?.toISOString().split("T")[0] ?? "",
      band_id: formData.bandCode,
      tariff_rate: formData.tariffRate,
    };

    createTariff(newTariff, {
      onSuccess: () => {
        resetForm();
        toast.success("Tariff created successfully");
        setIsDialogOpen(false);
      },
      onError: (error) => {
        console.error("Failed to create tariff:", error);
        toast.error("Failed to create tariff");
      },
      onSettled: () => {
        setIsSubmitting(false);
      },
    });
  };

  const isFormValid =
    formData.name.trim() &&
    formData.type &&
    formData.effectiveDate &&
    formData.bandCode &&
    formData.tariffRate.trim();

  const addTarriffDisabled = bands && bands.length === 0;

  return (
    <div className="min-h-screen p-6">
      <NotificationBar
        title="Tariff Management"
        bgColor="bg-[rgba(22,28,202,1)]"
        textColor="text-white"
        isTopBanner={true}
      />
      <NotificationBar
        title2="How to use"
        description={
          <div className="mt-2 flex items-center gap-2">
            <span>At least one band must be created</span>
          </div>
        }
        bgColor="bg-[rgba(219,230,254,1)]"
        textColor="text-[rgba(22,28,202,1)]"
        closable={true}
        showIcon={true}
        isTopBanner={false}
      />

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-8 flex items-start justify-between">
          <ContentHeader
            title={"Tariff"}
            description={"Set and manage tariff plans here"}
          />
          {canEdit && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="flex h-fit cursor-pointer items-center gap-2 bg-[rgb(22,28,202)] px-6 py-2 text-sm text-white"
                  size={"sm"}
                  disabled={addTarriffDisabled}
                >
                  <CirclePlusIcon strokeWidth={2.75} size={15} />
                  Add tariff
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-md bg-white">
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  Add New Tariff
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600">
                  Create a new tariff plan with the required information below.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Tariff Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g. Residential Basic Plan"
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="type"
                    className="text-sm font-medium text-gray-700"
                  >
                    Tariff Type *
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: string) =>
                      handleInputChange("type", value)
                    }
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select tariff type" />
                    </SelectTrigger>
                    <SelectContent>
                      {["R1", "R2", "R3", "C1", "C2"].map((type) => (
                        <SelectItem key={type} value={type}>
                          {type} -{" "}
                          {type.startsWith("R") ? "Residential" : "Commercial"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Effective Date *
                  </Label>
                  <Popover
                    open={isCalendarOpen}
                    onOpenChange={setIsCalendarOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start border-gray-300 text-left font-normal hover:bg-gray-50",
                          !formData.effectiveDate && "text-muted-foreground",
                        )}
                        disabled={isSubmitting}
                      >
                        <CalendarIcon className="mr-2 h-3 w-3" size={12} />
                        {formData.effectiveDate ? (
                          format(formData.effectiveDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto bg-white p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={formData.effectiveDate ?? undefined}
                        onSelect={handleDateSelect}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="band-code"
                    className="text-sm font-medium text-gray-700"
                  >
                    Band Code *
                  </Label>
                  <Select
                    value={formData.bandCode}
                    onValueChange={(value: string) =>
                      handleInputChange("bandCode", value)
                    }
                    disabled={bandsLoading ?? isSubmitting}
                  >
                    <SelectTrigger
                      className={cn(
                        "w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500",
                        bandsError && "border-red-500",
                      )}
                    >
                      <SelectValue
                        placeholder={
                          bandsLoading
                            ? "Loading bands..."
                            : bandsError
                              ? "Failed to load bands"
                              : "Select band code"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {bands && bands.length > 0 ? (
                        bands
                          .filter((band) => band.approveStatus === "Approved")
                          .map((band) => (
                            <SelectItem
                              key={band.id}
                              value={band.id ?? band.name}
                            >
                              {band.name}
                            </SelectItem>
                          ))
                      ) : (
                        <SelectItem value="" disabled>
                          {bandsError
                            ? "Error loading bands"
                            : "No bands available"}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {bandsError && (
                    <p className="text-sm text-red-600">{bandsError.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="tariff-rate"
                    className="text-sm font-medium text-gray-700"
                  >
                    Tariff Rate *
                  </Label>
                  <Input
                    id="tariff-rate"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    value={formData.tariffRate}
                    onChange={(e) =>
                      handleInputChange("tariffRate", e.target.value)
                    }
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-gray-500">
                    Enter rate in local currency per unit
                  </p>
                </div>

                <DialogFooter className="gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                    disabled={isSubmitting}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className="bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Tariff"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          )}
        </div>

        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search
                size={16}
                className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400"
              />
              <Input
                type="text"
                placeholder="Search by name, type..."
                className="w-64 border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <ListFilter size={14} />
                Filter
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <ArrowUpDown size={14} />
                Sort
              </Button>
            </div>
          </div>

          <div className="flex gap-3">
            {selectedTariffs.length > 0 && (
              <Button
                onClick={handleBulkApprove}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                Approve Selected ({selectedTariffs.length})
              </Button>
            )}
            <Button
              variant="outline"
              className="flex cursor-pointer items-center gap-2 border-green-500 text-green-500 hover:bg-gray-50"
              onClick={handleExport}
              disabled={isExporting}
            >
              <SquareArrowOutUpRight size={14} />
              {isExporting ? "Exporting..." : "Export"}
            </Button>
          </div>
        </div>

        <div className="flex-1 rounded-lg border border-gray-200 bg-white shadow-sm">
          {isLoading ? (
            <div className="flex min-h-96 items-center justify-center p-12">
              <LoadingAnimation
                variant="spinner"
                message="Loading tariffs..."
                size="lg"
              />
            </div>
          ) : tariffError ? (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <p className="mb-2 text-sm text-red-600">
                  Failed to load tariffs
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : (
            <TariffTable
              tariffs={tariffs ?? []}
              selectedTariffs={selectedTariffs}
              setSelectedTariffs={setSelectedTariffs}
            />
          )}
        </div>
      </div>
    </div>
  );
}

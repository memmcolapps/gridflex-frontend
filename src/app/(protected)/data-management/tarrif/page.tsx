"use client";
import { cn } from "@/lib/utils";
import { NotificationBar } from "@/components/notificationbar";
import { TariffTable } from "@/components/tariff/tariff-table";
import { Button } from "@/components/ui/button";
import { ContentHeader } from "@/components/ui/content-header";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TariffDatePicker } from "@/components/tarrif-datepicker";
import {
  ArrowUpDown,
  CirclePlusIcon,
  ListFilter,
  Search,
  SquareArrowOutUpRight,
} from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import {
  createTariff,
  fetchTariffs,
  type Tariff,
} from "@/service/tarriff-service";
import { fetchBands, type Band } from "@/service/band-service";
import { toast } from "react-toastify";

export default function TariffManagementPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [selectedTariffs, setSelectedTariffs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bands, setBands] = useState<Band[]>([]);
  const [isBandsLoading, setIsBandsLoading] = useState(false);
  const [bandsError, setBandsError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    effectiveDate: null as Date | null,
    bandCode: "",
    tariffRate: "",
    status: "inactive" as "active" | "inactive",
    approvalStatus: "pending" as "Approved" | "pending" | "rejected",
  });

  useEffect(() => {
    const loadTariffs = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTariffs();
        setTariffs(Array.isArray(data) ? data : []); // Ensure we always set an array
      } catch (error) {
        console.error("Error loading tariffs:", error);
        setTariffs([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    loadTariffs();
  }, []);

  useEffect(() => {
    const loadBands = async () => {
      setIsBandsLoading(true);
      setBandsError(null);
      try {
        const fetchedBands = await fetchBands();
        setBands(fetchedBands);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch bands";
        setBandsError(errorMessage);
        console.error("Failed to fetch bands:", error);
      } finally {
        setIsBandsLoading(false);
      }
    };

    loadBands();
  }, []);

  const handleInputChange = (field: string, value: string | Date | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateTariff = useCallback(
    (id: string, updates: Partial<Tariff>) => {
      setTariffs((prev) =>
        prev.map((tariff) =>
          tariff.id.toString() === id ? { ...tariff, ...updates } : tariff,
        ),
      );
    },
    [],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const newTariff = {
      name: formData.name,
      tariff_index: 0, // Set this to the appropriate index value as needed
      tariff_type: formData.type,
      effective_date: formData.effectiveDate?.toISOString().split("T")[0] ?? "",
      band: formData.bandCode,
      tariff_rate: formData.tariffRate,
    };

    const success = await createTariff(newTariff);

    if (success) {
      const fetchedTariffs = await fetchTariffs();
      setTariffs(fetchedTariffs);
      setIsDialogOpen(false);

      setFormData({
        name: "",
        type: "",
        effectiveDate: null,
        bandCode: "",
        tariffRate: "",
        status: "inactive",
        approvalStatus: "pending",
      });
    }
  };

  const isFormValid =
    formData.name &&
    formData.type &&
    formData.effectiveDate &&
    formData.bandCode &&
    formData.tariffRate;

  const refreshTariffs = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log("Starting tariff refresh..."); // Debug log
      const fetchedTariffs = await fetchTariffs();
      console.log("Fetched tariffs:", fetchedTariffs); // Debug log

      if (!Array.isArray(fetchedTariffs)) {
        console.error("Invalid tariffs data received");
        toast.error("Failed to load tariffs: Invalid data format");
        return;
      }

      setTariffs(fetchedTariffs);
    } catch (error) {
      console.error("Error refreshing tariffs:", error);
      toast.error("Failed to refresh tariffs");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Use useEffect for initial load
  useEffect(() => {
    refreshTariffs();
  }, [refreshTariffs]);

  return (
    <div className="p-6 flex min-h-screen flex-col font-sans">
      <NotificationBar
        title="Tariff Management"
        bgColor="bg-[rgba(22,28,202,1)]"
        textColor="text-white"
        isTopBanner={true}
      />
      <NotificationBar
        title2="How to use"
        description="Note: At least one band must be created"
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="flex h-fit cursor-pointer items-center gap-2 bg-[rgba(22,28,202,0.4)] px-6 py-2 text-sm text-white hover:bg-[rgb(22,28,202)]"
                size={"sm"}
              >
                <CirclePlusIcon strokeWidth={2.75} size={15} />
                Add tariff
              </Button>
            </DialogTrigger>
            <DialogContent className="h-fit bg-white sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">
                  Add Tariff
                </DialogTitle>
              </DialogHeader>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6 py-4"
              >
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Tariff Name
                  </label>
                  <Input
                    id="name"
                    placeholder="Enter tariff name"
                    className="border-gray-300 focus:border-[rgba(22,28,202,1)] focus:ring-[rgba(22,28,202,1)]"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="type"
                    className="text-sm font-medium text-gray-700"
                  >
                    Tariff Type
                  </label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: string) =>
                      handleInputChange("type", value)
                    }
                  >
                    <SelectTrigger className="w-full border-gray-300 focus:border-[rgba(22,28,202,1)] focus:ring-[rgba(22,28,202,1)]">
                      <SelectValue placeholder="Select tariff type" />
                    </SelectTrigger>
                    <SelectContent>
                      {["R1", "R2", "R3", "C1", "C2"].map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium超过了最大字符数限制。以下是继续的代码部分：

```typescript
text-gray-700">
                    Tariff Effective Date
                  </label>
                  <TariffDatePicker
                    value={
                      formData.effectiveDate instanceof Date
                        ? formData.effectiveDate.toISOString()
                        : undefined
                    }
                    onChange={(date) => {
                      const currentDate =
                        formData.effectiveDate instanceof Date
                          ? formData.effectiveDate.toISOString()
                          : null;
                      if (currentDate !== date) {
                        handleInputChange(
                          "effectiveDate",
                          date ? new Date(date) : null,
                        );
                      }
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="band-code"
                    className="text-sm font-medium text-gray-700"
                  >
                    Band Code
                  </label>
                  <Select
                    value={formData.bandCode}
                    onValueChange={(value: string) =>
                      handleInputChange("bandCode", value)
                    }
                    disabled={isBandsLoading}
                  >
                    <SelectTrigger
                      className={cn(
                        "w-full border-gray-300 focus:border-[rgba(22,28,202,1)] focus:ring-[rgba(22,28,202,1)]",
                        bandsError && "border-red-500",
                      )}
                    >
                      <SelectValue
                        placeholder={
                          isBandsLoading
                            ? "Loading bands..."
                            : bandsError
                              ? "Failed to load bands"
                              : "Select band code"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {bands.length > 0 ? (
                        bands.map((band) => (
                          <SelectItem key={band.id} value={band.name}>
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
                    <span className="text-sm text-red-500">{bandsError}</span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="tariff-rate"
                    className="text-sm font-medium text-gray-700"
                  >
                    Tariff Rate
                  </label>
                  <Input
                    id="tariff-rate"
                    placeholder="Enter tariff rate"
                    className="border-gray-300 focus:border-[rgba(22,28,202,1)] focus:ring-[rgba(22,28,202,1)]"
                    value={formData.tariffRate}
                    onChange={(e) =>
                      handleInputChange("tariffRate", e.target.value)
                    }
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                    className="border-gray-300 text-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className={`bg-[rgba(22,28,202,1)] text-white hover:bg-[rgba(22,28,202,0.9)] ${isFormValid ? "" : "cursor-not-allowed opacity-40"}`}
                    disabled={!isFormValid}
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <div className="mb-8 flex items-center gap-10">
            <div className="flex w-[219px] gap-2 rounded-md border border-[rgba(228,231,236,1)] px-3 py-2">
              <Search
                size={14}
                strokeWidth={2.75}
                className="ml-2 text-gray-500"
              />
              <input
                type="text"
                placeholder="Search by name, cont..."
                className="w-full flex-grow border-none text-sm text-[rgba(95,95,95,1)] placeholder-[rgba(95,95,95,1)] outline-none"
              />
            </div>
            <div className="flex gap-2">
              <Button className="flex cursor-pointer items-center gap-2 rounded-md border border-[rgba(228,231,236,1)] px-4 py-2 text-sm text-gray-700 focus:outline-none">
                <ListFilter size={14} />
                Filter
              </Button>
              <Button className="flex cursor-pointer items-center gap-2 rounded-md border border-[rgba(228,231,236,1)] px-4 py-2 text-sm text-gray-700 focus:outline-none">
                <ArrowUpDown size={14} />
                Sort
              </Button>
            </div>
          </div>
          <div className="flex gap-5">
            <Button
              variant={"default"}
              className="text-md cursor-pointer gap-2 border px-8 py-5 font-semibold text-[rgba(22,28,202,1)]"
            >
              <SquareArrowOutUpRight size={14} />
              Export
            </Button>
          </div>
        </div>

        <div className="flex-1 rounded-lg border border-gray-200 bg-white">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <TariffTable
              tariffs={tariffs}
              onUpdateTariff={handleUpdateTariff}
              selectedTariffs={selectedTariffs}
              setSelectedTariffs={setSelectedTariffs}
              onRefresh={refreshTariffs}
            />
          )}
        </div>
      </div>
    </div>
  );
}
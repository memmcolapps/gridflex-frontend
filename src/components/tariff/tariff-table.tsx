/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  updateTariff,
  type UpdateTariffPayload,
  type Tariff,
} from "@/service/tarriff-service";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Ban, MoreVertical, Pencil, UserCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { TariffDatePicker } from "../tarrif-datepicker";
import { getStatusStyle } from "../status-style";
import { useBand } from "@/hooks/use-band";
import { DeactivateTariffDialog } from "./deactivate-tarrif-dialog";
import { useChangeTariffStatus, useUpdateTariff } from "@/hooks/use-tarrif";

interface TariffTableProps {
  tariffs: Tariff[];
  selectedTariffs: string[];
  setSelectedTariffs: (ids: string[]) => void;
}

export function TariffTable({
  tariffs,
  selectedTariffs,
  setSelectedTariffs,
}: TariffTableProps) {
  const { bands, isLoading: isBandsLoading, error: bandsError } = useBand();
  const { mutate: changeTariffStatus } = useChangeTariffStatus();
  const { mutate: updateTariff } = useUpdateTariff();

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    action: () => void | Promise<void>;
  }>({
    isOpen: false,
    title: "",
    description: "",
    action: () => console.log("No action specified"),
  });

  const [editDialog, setEditDialog] = useState<{
    isOpen: boolean;
    tariff: Tariff | null;
  }>({
    isOpen: false,
    tariff: null,
  });

  const [statusDialog, setStatusDialog] = useState<{
    isOpen: boolean;
    tariff: Tariff | null;
  }>({
    isOpen: false,
    tariff: null,
  });

  const [isStatusLoading, setIsStatusLoading] = useState(false);

  const [formData, setFormData] = useState<{
    name: string;
    type: string;
    effectiveDate: Date | null;
    bandCode: string;
    tariffRate: string;
  }>({
    name: "",
    type: "",
    effectiveDate: null,
    bandCode: "",
    tariffRate: "",
  });

  const isFormValid = useMemo(() => {
    return (
      formData.name.trim() !== "" &&
      formData.type !== "" &&
      formData.effectiveDate !== null &&
      formData.bandCode !== "" &&
      formData.tariffRate.trim() !== ""
    );
  }, [formData]);

  const toggleSelection = (id: string) => {
    setSelectedTariffs(
      selectedTariffs.includes(id)
        ? selectedTariffs.filter((selectedId) => selectedId !== id)
        : [...selectedTariffs, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedTariffs.length === tariffs.length) {
      setSelectedTariffs([]);
    } else {
      setSelectedTariffs(tariffs.map((tariff) => tariff.id?.toString() ?? ""));
    }
  };

  const handleEditTariff = (tariff: Tariff) => {
    setEditDialog({ isOpen: true, tariff });
    setFormData({
      name: tariff.name || "",
      type: tariff.tariff_type || "",
      effectiveDate: tariff.effective_date
        ? new Date(tariff.effective_date)
        : null,
      bandCode: tariff.band.id || "",
      tariffRate: tariff.tariff_rate?.toString() || "",
    });
  };

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | Date | null,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDialog.tariff?.id || !isFormValid) return;

    updateTariff(
      {
        t_id: editDialog.tariff.id,
        name: formData.name,
        tariff_type: formData.type,
        effective_date:
          formData.effectiveDate?.toISOString().split("T")[0] ?? "",
        tariff_rate: formData.tariffRate.trim(),
        band_id: formData.bandCode,
      },
      {
        onSuccess: () => {
          toast.success("Tariff updated successfully");
          setEditDialog({ isOpen: false, tariff: null });
        },
        onError: (error) => {
          console.error("Error updating tariff:", error);
          toast.error(`Failed to update tariff: ${error.message || error}`);
        },
      },
    );
  };
  const handleToggleTariffStatus = (tariff: Tariff) => {
    setStatusDialog({ isOpen: true, tariff });
  };

  const handleActivateAndDeactivateTariff = async (
    tariff: Tariff,
    newStatus: boolean,
  ) => {
    try {
      changeTariffStatus(
        { tariffId: tariff.id, status: newStatus },
        {
          onSuccess: () => {
            toast.success(
              `Tariff ${newStatus ? "activated" : "deactivated"} successfully`,
            );
            setStatusDialog({ isOpen: false, tariff: null });
          },
          onError: (error) => {
            console.error("Error changing tariff status:", error);
            toast.error(
              `Failed to ${
                newStatus ? "activate" : "deactivate"
              } tariff: ${error.message || error}`,
            );
          },
          onSettled: () => {
            setIsStatusLoading(false);
          },
        },
      );
    } catch (error) {
      console.error("Error updating tariff status:", error);
      toast.error("Failed to update tariff status");
    } finally {
      setIsStatusLoading(false);
    }
  };

  const confirmToggleTariffStatus = () => {
    if (statusDialog.tariff) {
      const newStatus = statusDialog.tariff.status === false;
      handleActivateAndDeactivateTariff(statusDialog.tariff, newStatus);
    }
  };

  const validTariffs = useMemo(() => {
    return Array.isArray(tariffs) ? tariffs : [];
  }, [tariffs]);

  return (
    <div className="bg-transparent">
      <Table className="bg-transparent">
        <TableHeader className="bg-transparent">
          <TableRow>
            <TableHead className="flex w-[50px] items-center gap-2 px-4 py-3">
              <Checkbox
                checked={
                  tariffs.length > 0 &&
                  selectedTariffs.length === tariffs.length
                }
                onCheckedChange={toggleSelectAll}
              />
              <span className="mt-1">S/N</span>
            </TableHead>
            <TableHead>Tariff Name</TableHead>
            <TableHead>Tariff Type</TableHead>
            <TableHead>Band Code</TableHead>
            <TableHead>Tariff Rate</TableHead>
            <TableHead>Effective Date</TableHead>
            <TableHead>Approval Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-transparent">
          {validTariffs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="py-4 text-center">
                No tariffs found
              </TableCell>
            </TableRow>
          ) : (
            validTariffs.map((tariff) => (
              <TableRow key={tariff.id}>
                <TableCell className="flex items-center gap-2 px-4 py-3">
                  <Checkbox
                    checked={selectedTariffs.includes(
                      tariff.id?.toString() ?? "",
                    )}
                    onCheckedChange={() =>
                      toggleSelection(tariff.id?.toString() ?? "")
                    }
                  />
                  <span className="text-sm text-gray-900 lg:text-base">
                    {/* Replace index and pagination logic as needed */}
                    {String(
                      validTariffs.findIndex((t) => t.id === tariff.id) + 1,
                    ).padStart(2, "0")}
                  </span>
                </TableCell>
                <TableCell>{tariff.name}</TableCell>
                <TableCell>{tariff.tariff_type}</TableCell>
                <TableCell>{tariff.band.name}</TableCell>
                <TableCell>{tariff.tariff_rate}</TableCell>
                <TableCell>{tariff.effective_date}</TableCell>
                <TableCell>
                  <span className={getStatusStyle(tariff.approve_status)}>
                    {tariff.approve_status}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 cursor-pointer p-2"
                      >
                        <MoreVertical size={14} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="center"
                      className="cursor-pointer bg-white"
                    >
                      <DropdownMenuItem
                        onSelect={() => {
                          handleEditTariff(tariff);
                        }}
                      >
                        <div className="flex w-full items-center gap-2 p-2">
                          <Pencil size={14} />
                          <span className="cursor-pointer">Edit Tariff</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => {
                          handleToggleTariffStatus(tariff);
                        }}
                      >
                        <div className="flex w-full items-center gap-2 p-2">
                          {tariff.status !== false ? (
                            <Ban size={14} />
                          ) : (
                            <UserCheck size={14} />
                          )}
                          <span>
                            {tariff.status !== false
                              ? "Deactivate"
                              : "Activate"}
                          </span>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.action}
        title={confirmDialog.title}
        description={confirmDialog.description}
      />

      {/* Edit Dialog */}
      <Dialog
        open={editDialog.isOpen}
        onOpenChange={(open) =>
          setEditDialog((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <DialogContent className="h-fit bg-white sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Edit Tariff
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleEditSubmit}
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
              <label className="text-sm font-medium text-gray-700">
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
                    bands
                      .filter((band) => band.approveStatus === "Approved")
                      .map((band) => (
                        <SelectItem key={band.id} value={band.id ?? band.name}>
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
                <span className="text-sm text-red-500">
                  {bandsError.message}
                </span>
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
                onClick={() =>
                  setEditDialog((prev) => ({ ...prev, isOpen: false }))
                }
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

      {/* Status Toggle Dialog */}
      <DeactivateTariffDialog
        open={statusDialog.isOpen}
        onOpenChange={(open: boolean) =>
          setStatusDialog((prev) => ({ ...prev, isOpen: open }))
        }
        tariff={statusDialog.tariff}
        onConfirm={confirmToggleTariffStatus}
        isLoading={isStatusLoading}
      />
    </div>
  );
}

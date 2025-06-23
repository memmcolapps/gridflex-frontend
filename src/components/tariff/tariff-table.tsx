"use client";

import { changeTariffApprovalStatus, type Tariff } from "@/service/tarriff-service";
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
import { MoreVertical } from "lucide-react";
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
import { useAuth } from "@/context/auth-context";
import { checkUserPermission } from "@/utils/permissions";
import { changeTariffStatus } from "@/service/tarriff-service";
import { TariffDatePicker } from "../tarrif-datepicker";

interface TariffTableProps {
  tariffs: Tariff[];
  onUpdateTariff: (id: string, updates: Partial<Tariff>) => void;
  selectedTariffs: string[];
  setSelectedTariffs: (ids: string[]) => void;
  onRefresh: () => Promise<void>;
}

export function TariffTable({
  tariffs,
  selectedTariffs,
  setSelectedTariffs,
  onRefresh,
}: TariffTableProps) {
  const { user } = useAuth();
  const canApprove = checkUserPermission(user, "approve");

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

  // Placeholder for band data (replace with actual data fetching logic)
  const bands = [
    { id: "1", name: "A" },
    { id: "2", name: "B" },
    { id: "3", name: "C" },
  ];
  const isBandsLoading = false;
  const bandsError = null;

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

  const handleStatusChange = async (tariffId: string, newStatus: boolean) => {
    if (!canApprove) {
      toast.error("You don't have permission to change tariff status");
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: `${newStatus ? "Activate" : "Deactivate"} Tariff`,
      description: `Are you sure you want to ${newStatus ? "activate" : "deactivate"} this tariff?`,
      action: async () => {
        const success = await changeTariffStatus(tariffId, newStatus);
        if (success) {
          await updateTariff(tariffId, { status: newStatus });
        }
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleApprovalChange = async (
    tariffId: string,
    newStatus: "Approved" | "Rejected",
  ) => {
    if (!canApprove) {
      toast.error("You don't have permission to change approval status");
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: `${newStatus} Tariff`,
      description: `Are you sure you want to ${newStatus.toLowerCase()} this tariff?`,
      action: async () => {
        const success = await changeTariffApprovalStatus(tariffId, newStatus);
        if (success) {
          await onRefresh(); // Refresh after successful approval change
        }
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleStatusToggle = async (
    tariffId: string,
    currentStatus: boolean,
  ) => {
    if (!canApprove) {
      toast.error("You don't have permission to change tariff status");
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: `${currentStatus ? "Deactivate" : "Activate"} Tariff`,
      description: `Are you sure you want to ${currentStatus ? "deactivate" : "activate"
        } this tariff?`,
      action: async () => {
        try {
          const success = await changeTariffStatus(tariffId, !currentStatus);
          if (success) {
            await onRefresh();
          }
        } catch (error) {
          console.error("Error in status toggle:", error);
          toast.error("Failed to update tariff status");
        } finally {
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleEditTariff = (tariff: Tariff) => {
    setEditDialog({ isOpen: true, tariff });
    setFormData({
      name: tariff.name || "",
      type: tariff.tariff_type || "",
      effectiveDate: tariff.effective_date
        ? new Date(tariff.effective_date)
        : null,
      bandCode: tariff.band || "",
      tariffRate: tariff.tariff_rate?.toString() || "",
    });
  };

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | Date | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDialog.tariff?.id || !isFormValid) return;

    try {
      const updates: Partial<Tariff> = {
        name: formData.name,
        tariff_type: formData.type,
        effective_date: formData.effectiveDate?.toISOString(),
        band: formData.bandCode,
        tariff_rate: formData.tariffRate,
      };
      const success = await updateTariff(editDialog.tariff.id.toString(), updates);
      if (success) {
        updateTariff(editDialog.tariff.id.toString(), updates);
        toast.success("Tariff updated successfully");
        setEditDialog({ isOpen: false, tariff: null });
        await onRefresh();
      }
    } catch (error) {
      console.error("Error updating tariff:", error);
      toast.error("Failed to update tariff");
    }
  };

  // Placeholder for updateTariff service function
  const updateTariff = async (_id: string, _updates: Partial<Tariff>) => {
    // Implement your API call here
    // Example: return await api.put(`/tariffs/${id}`, _updates);
    return true; // Replace with actual implementation
  };

  const validTariffs = useMemo(() => {
    return Array.isArray(tariffs) ? tariffs : [];
  }, [tariffs]);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px] flex items-center gap-2 px-4 py-3">
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
            <TableHead>Status</TableHead>
            <TableHead>Effective Date</TableHead>
            <TableHead>Approval Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
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
                  <span className="text-sm lg:text-base text-gray-900">
                    {/* Replace index and pagination logic as needed */}
                    {String(validTariffs.findIndex(t => t.id === tariff.id) + 1).padStart(2, "0")}
                  </span>
                </TableCell>
                <TableCell>{tariff.name}</TableCell>
                <TableCell>{tariff.tariff_type}</TableCell>
                <TableCell>{tariff.band}</TableCell>
                <TableCell>{tariff.tariff_rate}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span
                      className={`py-0.6 rounded-xl px-2.5 capitalize ${tariff.status
                        ? "bg-[#E9F6EE] text-[#4CAF50]"
                        : "bg-[#FBE9E9] text-[#F75555]"
                        }`}
                    >
                      {tariff.status ? "Active" : "Inactive"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{tariff.effective_date}</TableCell>
                <TableCell>
                  <span
                    className={`py-0.6 rounded-xl px-2.5 capitalize ${
                      tariff.approve_status === "Approved"
                        ? "bg-[#E9F6FF] text-[#225BFF]"
                        : tariff.approve_status === "Rejected"
                          ? "bg-[#FBE9E9] text-[#F75555]"
                          : "bg-[#FFF5EA] text-[#FACC15]"
                    }`}
                  >
                    {tariff.approve_status}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" size={12} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white">
                      <DropdownMenuItem
                        onClick={() => handleEditTariff(tariff)}
                        className="px-3 py-3"
                      >
                        Edit Tariff
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleStatusToggle(tariff.id.toString(), true)
                        }
                        className="px-3 py-3"
                        disabled={tariff.status}
                      >
                        Activate Tariff
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleStatusToggle(tariff.id.toString(), false)
                        }
                        className="px-3 py-3"
                        disabled={!tariff.status}
                      >
                        Deactivate Tariff
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
                onChange={(e) => handleInputChange("tariffRate", e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                type="button"
                onClick={() => setEditDialog((prev) => ({ ...prev, isOpen: false }))}
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
    </>
  );
}
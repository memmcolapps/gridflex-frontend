"use client";

import { type Tariff } from "@/service/tarriff-service";
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
import { Ban, CircleCheck, CircleX, MoreVertical, Power } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useState, useMemo } from "react";
import { useAuth } from "@/context/auth-context";
import { checkUserPermission } from "@/utils/permissions";
import {
  changeTariffStatus,
  changeTariffApprovalStatus,
} from "@/service/tarriff-service";
import { Switch } from "@/components/ui/switch";

interface TariffTableProps {
  tariffs: Tariff[];
  onUpdateTariff: (id: string, updates: Partial<Tariff>) => void;
  selectedTariffs: string[];
  setSelectedTariffs: (ids: string[]) => void;
  onRefresh: () => Promise<void>; // Add this new prop
}

export function TariffTable({
  tariffs,
  onUpdateTariff,
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
          onUpdateTariff(tariffId, { status: newStatus });
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
      description: `Are you sure you want to ${
        currentStatus ? "deactivate" : "activate"
      } this tariff?`,
      action: async () => {
        try {
          console.log(`Attempting to change status for tariff ${tariffId}`); // Debug log
          const success = await changeTariffStatus(tariffId, !currentStatus);

          if (success) {
            console.log("Status change successful, refreshing..."); // Debug log
            await onRefresh();
          } else {
            console.error("Status change failed"); // Debug log
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

  // Move validation check here and use useMemo to prevent unnecessary recalculations
  const validTariffs = useMemo(() => {
    return Array.isArray(tariffs) ? tariffs : [];
  }, [tariffs]);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={
                  tariffs.length > 0 &&
                  selectedTariffs.length === tariffs.length
                }
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Index</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Band Code</TableHead>
            <TableHead>Rate</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Effective Date</TableHead>
            <TableHead>Approval Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {validTariffs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="py-4 text-center">
                No tariffs found
              </TableCell>
            </TableRow>
          ) : (
            validTariffs.map((tariff) => (
              <TableRow key={tariff.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedTariffs.includes(
                      tariff.id?.toString() ?? "",
                    )}
                    onCheckedChange={() =>
                      toggleSelection(tariff.id?.toString() ?? "")
                    }
                  />
                </TableCell>
                <TableCell>{tariff.name}</TableCell>
                <TableCell>{tariff.tariff_index}</TableCell>
                <TableCell>{tariff.tariff_type}</TableCell>
                <TableCell>{tariff.band}</TableCell>
                <TableCell>{tariff.tariff_rate}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={tariff.status}
                      onCheckedChange={() =>
                        handleStatusToggle(tariff.id.toString(), tariff.status)
                      }
                      disabled={!canApprove}
                      color="#4CAF50"
                      className="cursor-pointer"
                    />
                    {/* <span
                      className={`text-sm ${
                        tariff.status ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {tariff.status ? "Active" : "Inactive"}
                    </span> */}
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
                  {" "}
                  {new Date(tariff.created_at!).toLocaleDateString()}
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
                      {canApprove && tariff.approve_status !== "Approved" && (
                        <DropdownMenuItem
                          onClick={() =>
                            handleApprovalChange(
                              tariff.id.toString(),
                              "Approved",
                            )
                          }
                          className="px-3 py-3"
                        >
                          <CircleCheck size={13} className="mr-2" />
                          Approve Tariff
                        </DropdownMenuItem>
                      )}
                      {canApprove && tariff.approve_status !== "Rejected" && (
                        <DropdownMenuItem
                          onClick={() =>
                            handleApprovalChange(
                              tariff.id.toString(),
                              "Rejected",
                            )
                          }
                          className="px-3 py-3"
                        >
                          <CircleX size={13} className="mr-2" />
                          Reject Tariff
                        </DropdownMenuItem>
                      )}
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
    </>
  );
}

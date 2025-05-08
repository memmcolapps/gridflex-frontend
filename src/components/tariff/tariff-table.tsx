"use client";

import { type Tariff } from "@/service/tarriff-service";
// import { format } from "date-fns";
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
import { useState } from "react";

interface TariffTableProps {
  tariffs: Tariff[];
  onUpdateTariff: (id: string, updates: Partial<Tariff>) => void;
  selectedTariffs: string[];
  setSelectedTariffs: (ids: string[]) => void;
}

export function TariffTable({
  tariffs,
  onUpdateTariff,
  selectedTariffs,
  setSelectedTariffs,
}: TariffTableProps) {
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    action: () => void;
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

  const handleStatusChange = (tariffId: string, newStatus: boolean) => {
    setConfirmDialog({
      isOpen: true,
      title: `${newStatus ? "Activate" : "Deactivate"} Tariff`,
      description: `Are you sure you want to ${newStatus ? "activate" : "deactivate"} this tariff?`,
      action: () => {
        onUpdateTariff(tariffId, { status: newStatus });
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleApprovalChange = (
    tariffId: string,
    newStatus: "Approved" | "Rejected",
  ) => {
    setConfirmDialog({
      isOpen: true,
      title: `${newStatus} Tariff`,
      description: `Are you sure you want to ${newStatus.toLowerCase()} this tariff?`,
      action: () => {
        onUpdateTariff(tariffId, { approve_status: newStatus });
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

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
            <TableHead>Effective Date</TableHead>
            <TableHead>Band</TableHead>
            <TableHead>Rate</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Approval Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tariffs.map((tariff) => (
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
              <TableCell>{tariff.effective_date}</TableCell>
              <TableCell>{tariff.band}</TableCell>
              <TableCell>{tariff.tariff_rate}</TableCell>
              <TableCell>{tariff.status ? "Active" : "Inactive"}</TableCell>
              <TableCell>
                <span
                  className={`capitalize ${
                    tariff.approve_status === "Approved"
                      ? "text-green-600"
                      : tariff.approve_status === "Rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
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
                  <DropdownMenuContent align="end">
                    {tariff.approve_status !== "Approved" && (
                      <DropdownMenuItem
                        onClick={() =>
                          handleApprovalChange(tariff.id.toString(), "Approved")
                        }
                        className="text-green-600"
                      >
                        Approve Tariff
                      </DropdownMenuItem>
                    )}
                    {tariff.approve_status !== "Rejected" && (
                      <DropdownMenuItem
                        onClick={() =>
                          handleApprovalChange(tariff.id.toString(), "Rejected")
                        }
                        className="text-red-600"
                      >
                        Reject Tariff
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() =>
                        handleStatusChange(tariff.id.toString(), !tariff.status)
                      }
                      className={
                        tariff.status ? "text-red-600" : "text-green-600"
                      }
                    >
                      {tariff.status ? "Deactivate" : "Activate"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
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

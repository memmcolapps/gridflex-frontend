"use client";

import { type Tariff } from "@/service/tarriff-service";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <Checkbox
              checked={
                tariffs.length > 0 && selectedTariffs.length === tariffs.length
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
        </TableRow>
      </TableHeader>
      <TableBody>
        {tariffs.map((tariff) => (
          <TableRow key={tariff.id}>
            <TableCell>
              <Checkbox
                checked={selectedTariffs.includes(tariff.id?.toString() ?? "")}
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
            <TableCell> {new Date(tariff.created_at!).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

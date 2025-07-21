// components/billing/energy-import/export-energy-import-dialog.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

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

interface ExportEnergyImportDialogProps {
  open: boolean;
  onClose: () => void;
  selectedRowIds: Set<number>;
  allData: EnergyImportData[];
}

export default function ExportEnergyImportDialog({
  open,
  onClose,
  selectedRowIds,
  allData,
}: ExportEnergyImportDialogProps) {
  const [step, setStep] = useState(1);
  const [exportType, setExportType] = useState("");
  const [feederName, setFeederName] = useState("");
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  // Get the data to export - either selected items or all data
  const exportData =
    selectedRowIds.size > 0
      ? allData.filter((item) => selectedRowIds.has(item.id))
      : allData;

  useEffect(() => {
    if (!open) {
      setStep(1);
      setExportType("");
      setFeederName("");
      setSelectedItems(new Set());
    } else {
      // Initialize with the selected items from the table
      setSelectedItems(new Set(selectedRowIds));
    }
  }, [open, selectedRowIds]);

  const handleFirstProceed = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSecondProceed = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  };

  const handleFinalClose = () => {
    // Here you would implement the actual export logic
    console.log("Exporting data:", {
      exportType,
      feederName,
      selectedItems: Array.from(selectedItems),
      data: exportData.filter((item) => selectedItems.has(item.id)),
    });

    setStep(1);
    setExportType("");
    setFeederName("");
    setSelectedItems(new Set());
    onClose();
  };

  // Handle individual checkbox change
  const handleCheckboxChange = (id: number, checked: boolean) => {
    setSelectedItems((prev) => {
      const newSelected = new Set(prev);
      if (checked) {
        newSelected.add(id);
      } else {
        newSelected.delete(id);
      }
      return newSelected;
    });
  };

  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(exportData.map((item) => item.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const isAllSelected =
    exportData.length > 0 &&
    exportData.every((item) => selectedItems.has(item.id));
  const isSomeSelected =
    exportData.some((item) => selectedItems.has(item.id)) && !isAllSelected;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <DialogHeader>
              <DialogTitle>Export Energy Import Data</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleFirstProceed}>
              <div className="mb-4 grid gap-4 py-4">
                <div className="grid grid-cols-1 items-center gap-4">
                  <Label htmlFor="exportType" className="text-right">
                    Export Type *
                  </Label>
                  <Select
                    name="exportType"
                    value={exportType}
                    onValueChange={setExportType}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select Export Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV Format</SelectItem>
                      <SelectItem value="excel">Excel Format</SelectItem>
                      <SelectItem value="pdf">PDF Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="cursor-pointer border-[#161CCA] text-[rgba(22,28,202,1)]"
                  size={"lg"}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!exportType}
                  className="cursor-pointer bg-[#161CCA] text-white"
                  size={"lg"}
                >
                  Proceed
                </Button>
              </DialogFooter>
            </form>
          </>
        );
      case 2:
        return (
          <>
            <DialogHeader>
              <DialogTitle>Export Energy Import Data</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSecondProceed}>
              <div className="mb-4 grid gap-4 py-4">
                <div className="grid grid-cols-1 items-center gap-4">
                  <Label htmlFor="feederName" className="text-right">
                    Filter by Feeder Name (Optional)
                  </Label>
                  <Input
                    id="feederName"
                    name="feederName"
                    value={feederName}
                    onChange={(e) => setFeederName(e.target.value)}
                    className="col-span-3"
                    placeholder="Enter feeder name to filter (leave empty for all)"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="cursor-pointer border-[#161CCA] text-[rgba(22,28,202,1)]"
                  size={"lg"}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="cursor-pointer bg-[#161CCA] text-white"
                  size={"lg"}
                >
                  Proceed
                </Button>
              </DialogFooter>
            </form>
          </>
        );
      case 3:
        const filteredExportData = feederName
          ? exportData.filter((item) =>
              item.feederName.toLowerCase().includes(feederName.toLowerCase()),
            )
          : exportData;

        return (
          <DialogContent
            className="none h-fit border bg-white p-8"
            style={{ width: "90vw", maxWidth: "1200px", overflowY: "auto" }}
          >
            <DialogHeader>
              <DialogTitle className="mt-3">
                Energy Import Export Preview
              </DialogTitle>
            </DialogHeader>
            <div className="py-6">
              <div className="-mt-13 mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-based text-sm text-gray-800">
                    Export Type: {exportType.toUpperCase()}
                  </h3>
                  {feederName && (
                    <p className="mt-1 text-xs text-gray-600">
                      Filtered by: {feederName}
                    </p>
                  )}
                </div>
                <span className="font-semibold text-gray-800">
                  Total Selected
                  <h1 className="text-3xl font-bold text-gray-800">
                    {selectedItems.size}
                  </h1>
                </span>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all"
                        className={
                          isSomeSelected
                            ? "indeterminate"
                            : "mx-auto cursor-pointer border-gray-500 hover:border-gray-500"
                        }
                      />
                    </TableHead>
                    <TableHead>S/N</TableHead>
                    <TableHead>Feeder Name</TableHead>
                    <TableHead>Asset ID</TableHead>
                    <TableHead>Feeder Consumption</TableHead>
                    <TableHead>Prepaid Consumption</TableHead>
                    <TableHead>Postpaid Consumption</TableHead>
                    <TableHead>MD Virtual</TableHead>
                    <TableHead>Non MD Virtual</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExportData.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.has(item.id)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(item.id, Boolean(checked))
                          }
                          aria-label={`Select row ${item.id}`}
                          className="mx-auto cursor-pointer border-gray-500 hover:border-gray-500"
                        />
                      </TableCell>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {item.feederName}
                      </TableCell>
                      <TableCell className="font-medium text-blue-600">
                        {item.assetId}
                      </TableCell>
                      <TableCell>{item.feederConsumption}</TableCell>
                      <TableCell>{item.prepaidConsumption}</TableCell>
                      <TableCell>{item.postpaidConsumption}</TableCell>
                      <TableCell>{item.mdVirtual}</TableCell>
                      <TableCell>
                        <span
                          className={
                            item.nonMdVirtual === "NOT SET"
                              ? "text-gray-500"
                              : ""
                          }
                        >
                          {item.nonMdVirtual}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="cursor-pointer border-[#161CCA] text-[rgba(22,28,202,1)]"
                size={"lg"}
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={handleFinalClose}
                disabled={selectedItems.size === 0}
                className="cursor-pointer bg-[#161CCA] text-white"
                size={"lg"}
              >
                Export ({selectedItems.size} items)
              </Button>
            </DialogFooter>
          </DialogContent>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="none h-fit w-full border bg-white p-6">
        {renderStep()}
      </DialogContent>
    </Dialog>
  );
}

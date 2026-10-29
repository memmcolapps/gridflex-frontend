"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { CirclePlus, MoreVertical, Pencil, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ContentHeader } from "@/components/ui/content-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchControl, SortControl } from "@/components/search-control";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { Label } from "@/components/ui/label";
import { type Manufacturer } from "@/types/meters-manufacturers";
import { useGetMeterManufactures } from "@/hooks/use-meter";
import { useNigerianCities, useNigerianStates } from "@/hooks/use-location";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/use-permissions";

type MeterModelFormData = {
  manufacturerName: string;
  manufacturerId: string;
  meterModel: string;
  meterClass: string;
  serialNo: string;
  protocol: string;
  authentication: string;
  password: string;
  ctRatioNum: string;
  ctRatioDenom: string;
  voltRatioNum: string;
  voltRatioDenom: string;
  multiplier: string;
  meterRating: string;
  initialReading: string;
  dial: string;
  longitude: string;
  latitude: string;
};

const METER_CLASS_OPTIONS = ["MD", "Single-Phase", "Three-Phase"] as const;

// Shared form state between Add and Edit Manufacturer dialogs
const EMPTY_METER_MODEL_FORM: MeterModelFormData = {
  manufacturerName: "",
  manufacturerId: "",
  meterModel: "",
  meterClass: "",
  serialNo: "",
  protocol: "",
  authentication: "",
  password: "",
  ctRatioNum: "0",
  ctRatioDenom: "0",
  voltRatioNum: "0",
  voltRatioDenom: "0",
  multiplier: "0",
  meterRating: "0",
  initialReading: "0",
  dial: "0",
  longitude: "0.0",
  latitude: "0.0",
};

const fieldInputClassName =
  "h-10 w-full rounded-md border border-gray-300 bg-white text-sm shadow-none focus-visible:border-[#161CCA] focus-visible:ring-[#161CCA]/20";

function FormField({
  label,
  required,
  htmlFor,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function AddManufacturerDialog({
  isOpen,
  onClose,
  onAdd,
  isSubmitting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (meterModel: MeterModelFormData) => void;
  data: Manufacturer[];
  isSubmitting: boolean;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<MeterModelFormData>(
    EMPTY_METER_MODEL_FORM,
  );

  const isMdSelected = formData.meterClass === "MD";

  const handleChange = (value: string, field: keyof MeterModelFormData) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const clearForm = () => {
    setFormData(EMPTY_METER_MODEL_FORM);
    setStep(1);
  };

  const validateStep1 = () => {
    const missingFields: string[] = [];
    if (!formData.manufacturerName.trim())
      missingFields.push("Meter Manufacturer");
    if (!formData.meterModel.trim()) missingFields.push("Meter Model");
    if (!formData.meterClass.trim()) missingFields.push("Meter Class");
    if (!formData.serialNo.trim()) missingFields.push("Meter Serial no.");

    if (missingFields.length > 0) {
      toast.error(
        `Please fill the following required fields: ${missingFields.join(", ")}`,
      );
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const missingFields: string[] = [];
    if (!formData.ctRatioNum.trim()) missingFields.push("CT Ratio Numerator");
    if (!formData.ctRatioDenom.trim())
      missingFields.push("CT Ratio Denominator");
    if (!formData.voltRatioNum.trim())
      missingFields.push("Voltage Ratio Numerator");
    if (!formData.voltRatioDenom.trim())
      missingFields.push("Voltage Ratio Denominator");
    if (!formData.multiplier.trim()) missingFields.push("Multiplier");
    if (!formData.meterRating.trim()) missingFields.push("Meter Rating");
    if (!formData.initialReading.trim()) missingFields.push("Initial Reading");
    if (!formData.dial.trim()) missingFields.push("Dial");
    if (!formData.longitude.trim()) missingFields.push("Longitude");
    if (!formData.latitude.trim()) missingFields.push("Latitude");
    if (missingFields.length > 0) {
      toast.error(
        `Please fill the following required fields: ${missingFields.join(", ")}`,
      );
      return false;
    }
    return true;
  };

  const handlePrimaryAction = () => {
    if (step === 1) {
      if (!validateStep1()) return;
      if (isMdSelected) {
        setStep(2);
        return;
      }
      onAdd(formData);
      return;
    }

    if (!validateStep2()) return;
    onAdd(formData);
  };

  useEffect(() => {
    if (!isOpen) clearForm();
  }, [isOpen]);

  const handleClose = () => {
    clearForm();
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="h-auto gap-5 rounded-2xl bg-white p-6 shadow-lg sm:max-w-[560px]">
        <DialogHeader className="gap-1 space-y-0">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Add Meter Model
          </DialogTitle>
          {step === 2 ? (
            <DialogDescription className="text-sm text-gray-500">
              MD Information
            </DialogDescription>
          ) : null}
        </DialogHeader>

        {step === 1 ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <FormField
              label="Meter Manufacturer"
              required
              htmlFor="meterManufacturer"
            >
              <Input
                id="meterManufacturer"
                value={formData.manufacturerName}
                onChange={(e) =>
                  handleChange(e.target.value, "manufacturerName")
                }
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
            </FormField>
            <FormField label="Meter Model" required htmlFor="meterModel">
              <Input
                id="meterModel"
                value={formData.meterModel}
                onChange={(e) => handleChange(e.target.value, "meterModel")}
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
            </FormField>
            <FormField
              label="Meter Class"
              required
              htmlFor="meterClass"
              className="sm:col-span-2"
            >
              <Select
                value={formData.meterClass}
                onValueChange={(value) => {
                  handleChange(value, "meterClass");
                  if (value !== "MD") setStep(1);
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger id="meterClass" className={fieldInputClassName}>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {METER_CLASS_OPTIONS.map((meterClass) => (
                    <SelectItem key={meterClass} value={meterClass}>
                      {meterClass}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Meter Serial no." required htmlFor="serialNo">
              <Input
                id="serialNo"
                value={formData.serialNo}
                onChange={(e) => handleChange(e.target.value, "serialNo")}
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
            </FormField>
            <FormField label="Protocol" htmlFor="protocol">
              <Input
                id="protocol"
                value={formData.protocol}
                onChange={(e) => handleChange(e.target.value, "protocol")}
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
            </FormField>
            <FormField label="Authentication" htmlFor="authentication">
              <Input
                id="authentication"
                value={formData.authentication}
                onChange={(e) => handleChange(e.target.value, "authentication")}
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
            </FormField>
            <FormField label="Password" htmlFor="password">
              <Input
                id="password"
                type="text"
                value={formData.password}
                onChange={(e) => handleChange(e.target.value, "password")}
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
            </FormField>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <FormField label="CT Ratio Numerator" required htmlFor="ctRatioNum">
              <Input
                id="ctRatioNum"
                value={formData.ctRatioNum}
                onChange={(e) => handleChange(e.target.value, "ctRatioNum")}
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
            </FormField>
            <FormField
              label="CT Ratio Denominator"
              required
              htmlFor="ctRatioDenom"
            >
              <Input
                id="ctRatioDenom"
                value={formData.ctRatioDenom}
                onChange={(e) => handleChange(e.target.value, "ctRatioDenom")}
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
            </FormField>
            <FormField
              label="Voltage Ratio Numerator"
              required
              htmlFor="voltRatioNum"
            >
              <Input
                id="voltRatioNum"
                value={formData.voltRatioNum}
                onChange={(e) => handleChange(e.target.value, "voltRatioNum")}
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
            </FormField>
            <FormField
              label="Voltage Ratio Denominator"
              required
              htmlFor="voltRatioDenom"
            >
              <Input
                id="voltRatioDenom"
                value={formData.voltRatioDenom}
                onChange={(e) => handleChange(e.target.value, "voltRatioDenom")}
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
            </FormField>
            <FormField label="Multiplier" required htmlFor="multiplier">
              <Input
                id="multiplier"
                value={formData.multiplier}
                onChange={(e) => handleChange(e.target.value, "multiplier")}
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
            </FormField>
            <FormField label="Meter Rating" required htmlFor="meterRating">
              <Input
                id="meterRating"
                value={formData.meterRating}
                onChange={(e) => handleChange(e.target.value, "meterRating")}
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
            </FormField>
            <FormField
              label="Initial Reading"
              required
              htmlFor="initialReading"
            >
              <Input
                id="initialReading"
                value={formData.initialReading}
                onChange={(e) => handleChange(e.target.value, "initialReading")}
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
            </FormField>
            <FormField label="Dial" required htmlFor="dial">
              <Input
                id="dial"
                value={formData.dial}
                onChange={(e) => handleChange(e.target.value, "dial")}
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
            </FormField>
            <FormField label="Longitude" required htmlFor="longitude">
              <Input
                id="longitude"
                value={formData.longitude}
                onChange={(e) => handleChange(e.target.value, "longitude")}
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
            </FormField>
            <FormField label="Latitude" required htmlFor="latitude">
              <Input
                id="latitude"
                value={formData.latitude}
                onChange={(e) => handleChange(e.target.value, "latitude")}
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
            </FormField>
          </div>
        )}

        <DialogFooter className="flex w-full flex-row items-center justify-between gap-2 sm:justify-between">
          <Button
            variant="outline"
            onClick={handleClose}
            size="lg"
            disabled={isSubmitting}
            className="h-10 rounded-md border-[#161CCA] bg-transparent px-6 text-sm text-[#161CCA]"
          >
            Cancel
          </Button>
          <Button
            onClick={handlePrimaryAction}
            size="lg"
            disabled={isSubmitting}
            className="h-10 rounded-md bg-[#161CCA] px-6 text-sm text-white hover:bg-[#161CCA]/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : step === 1 && isMdSelected ? (
              "Next"
            ) : (
              "Add"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditManufacturerDialog({
  isOpen,
  onClose,
  onEdit,
  manufacturer,
  isSubmitting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (updatedManufacturer: MeterModelFormData) => void;
  manufacturer: MeterModelFormData | null;
  isSubmitting: boolean;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<MeterModelFormData>(
    EMPTY_METER_MODEL_FORM,
  );

  const isMdSelected = formData.meterClass === "MD";

  const handleChange = (value: string, field: keyof MeterModelFormData) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const clearForm = () => {
    setFormData(EMPTY_METER_MODEL_FORM);
    setStep(1);
  };

  const validateStep1 = () => {
    const missingFields: string[] = [];
    if (!formData.manufacturerName.trim())
      missingFields.push("Meter Manufacturer");
    if (!formData.meterModel.trim()) missingFields.push("Meter Model");
    if (!formData.meterClass.trim()) missingFields.push("Meter Class");
    if (!formData.serialNo.trim()) missingFields.push("Meter Serial no.");

    if (missingFields.length > 0) {
      toast.error(
        `Please fill the following required fields: ${missingFields.join(", ")}`,
      );
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const missingFields: string[] = [];
    if (!formData.ctRatioNum.trim()) missingFields.push("CT Ratio Numerator");
    if (!formData.ctRatioDenom.trim())
      missingFields.push("CT Ratio Denominator");
    if (!formData.voltRatioNum.trim())
      missingFields.push("Voltage Ratio Numerator");
    if (!formData.voltRatioDenom.trim())
      missingFields.push("Voltage Ratio Denominator");
    if (!formData.multiplier.trim()) missingFields.push("Multiplier");
    if (!formData.meterRating.trim()) missingFields.push("Meter Rating");
    if (!formData.initialReading.trim()) missingFields.push("Initial Reading");
    if (!formData.dial.trim()) missingFields.push("Dial");
    if (!formData.longitude.trim()) missingFields.push("Longitude");
    if (!formData.latitude.trim()) missingFields.push("Latitude");

    if (missingFields.length > 0) {
      toast.error(
        `Please fill the following required fields: ${missingFields.join(", ")}`,
      );
      return false;
    }
    return true;
  };

  const handlePrimaryAction = () => {
    if (step === 1) {
      if (!validateStep1()) return;
      if (isMdSelected) {
        setStep(2);
        return;
      }
      onEdit(formData);
      return;
    }

    if (!validateStep2()) return;
    onEdit(formData);
  };

  useEffect(() => {
    if (!isOpen) clearForm();
  }, [isOpen]);

  const handleClose = () => {
    clearForm();
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="h-auto gap-5 rounded-2xl bg-white p-6 shadow-lg sm:max-w-[560px]">
        <DialogHeader className="gap-1 space-y-0">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Edit Meter Model
          </DialogTitle>
          {step === 2 ? (
            <DialogDescription className="text-sm text-gray-500">
              MD Information
            </DialogDescription>
          ) : null}
        </DialogHeader>

        {step === 1 ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <FormField
              label="Meter Manufacturer"
              required
              htmlFor="meterManufacturer"
            >
              <Input
                id="meterManufacturer"
                value={formData.manufacturerName}
                onChange={(e) =>
                  handleChange(e.target.value, "manufacturerName")
                }
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
            </FormField>
            <FormField label="Meter Model" required htmlFor="meterModel">
              <Input
                id="meterModel"
                value={formData.meterModel}
                onChange={(e) => handleChange(e.target.value, "meterModel")}
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
            </FormField>
            <FormField
              label="Meter Class"
              required
              htmlFor="meterClass"
              className="sm:col-span-2"
            >
              <Select
                value={formData.meterClass}
                onValueChange={(value) => {
                  handleChange(value, "meterClass");
                  if (value !== "MD") setStep(1);
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger id="meterClass" className={fieldInputClassName}>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {METER_CLASS_OPTIONS.map((meterClass) => (
                    <SelectItem key={meterClass} value={meterClass}>
                      {meterClass}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Meter Serial no." required htmlFor="serialNo">
              <Input
                id="serialNo"
                value={formData.serialNo}
                onChange={(e) => handleChange(e.target.value, "serialNo")}
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
            </FormField>
            <FormField label="Protocol" htmlFor="protocol">
              <Input
                id="protocol"
                value={formData.protocol}
                onChange={(e) => handleChange(e.target.value, "protocol")}
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
            </FormField>
            <FormField label="Authentication" htmlFor="authentication">
              <Input
                id="authentication"
                value={formData.authentication}
                onChange={(e) => handleChange(e.target.value, "authentication")}
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
            </FormField>
            <FormField label="Password" htmlFor="password">
              <Input
                id="password"
                type="text"
                value={formData.password}
                onChange={(e) => handleChange(e.target.value, "password")}
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
            </FormField>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <FormField label="CT Ratio Numerator" required htmlFor="ctRatioNum">
              <Input
                id="ctRatioNum"
                value={formData.ctRatioNum}
                onChange={(e) => handleChange(e.target.value, "ctRatioNum")}
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
            </FormField>
            <FormField
              label="CT Ratio Denominator"
              required
              htmlFor="ctRatioDenom"
            >
              <Input
                id="ctRatioDenom"
                value={formData.ctRatioDenom}
                onChange={(e) => handleChange(e.target.value, "ctRatioDenom")}
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
            </FormField>
            <FormField
              label="Voltage Ratio Numerator"
              required
              htmlFor="voltRatioNum"
            >
              <Input
                id="voltRatioNum"
                value={formData.voltRatioNum}
                onChange={(e) => handleChange(e.target.value, "voltRatioNum")}
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
            </FormField>
            <FormField
              label="Voltage Ratio Denominator"
              required
              htmlFor="voltRatioDenom"
            >
              <Input
                id="voltRatioDenom"
                value={formData.voltRatioDenom}
                onChange={(e) => handleChange(e.target.value, "voltRatioDenom")}
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
            </FormField>
            <FormField label="Multiplier" required htmlFor="multiplier">
              <Input
                id="multiplier"
                value={formData.multiplier}
                onChange={(e) => handleChange(e.target.value, "multiplier")}
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
            </FormField>
            <FormField label="Meter Rating" required htmlFor="meterRating">
              <Input
                id="meterRating"
                value={formData.meterRating}
                onChange={(e) => handleChange(e.target.value, "meterRating")}
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
            </FormField>
            <FormField
              label="Initial Reading"
              required
              htmlFor="initialReading"
            >
              <Input
                id="initialReading"
                value={formData.initialReading}
                onChange={(e) => handleChange(e.target.value, "initialReading")}
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
            </FormField>
            <FormField label="Dial" required htmlFor="dial">
              <Input
                id="dial"
                value={formData.dial}
                onChange={(e) => handleChange(e.target.value, "dial")}
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
            </FormField>
            <FormField label="Longitude" required htmlFor="longitude">
              <Input
                id="longitude"
                value={formData.longitude}
                onChange={(e) => handleChange(e.target.value, "longitude")}
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
            </FormField>
            <FormField label="Latitude" required htmlFor="latitude">
              <Input
                id="latitude"
                value={formData.latitude}
                onChange={(e) => handleChange(e.target.value, "latitude")}
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
            </FormField>
          </div>
        )}

        <DialogFooter className="flex w-full flex-row items-center justify-between gap-2 sm:justify-between">
          <Button
            variant="outline"
            onClick={handleClose}
            size="lg"
            disabled={isSubmitting}
            className="h-10 rounded-md border-[#161CCA] bg-transparent px-6 text-sm text-[#161CCA]"
          >
            Cancel
          </Button>
          <Button
            onClick={handlePrimaryAction}
            size="lg"
            disabled={isSubmitting}
            className="h-10 rounded-md bg-[#161CCA] px-6 text-sm text-white hover:bg-[#161CCA]/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : step === 1 && isMdSelected ? (
              "Next"
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function ManufacturersPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { data } = useGetMeterManufactures();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedManufacturer, setSelectedManufacturer] =
    useState<MeterModelFormData | null>(null);

  const { canEdit } = usePermissions();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Manufacturer | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    applyFiltersAndSort(term, sortConfig.key, sortConfig.direction);
  };

  const handleSortChange = () => {
    const sortKey: keyof Manufacturer = sortConfig.key ?? "name";
    const newDirection = sortConfig.direction === "asc" ? "desc" : "asc";

    setSortConfig({ key: sortKey, direction: newDirection });
    applyFiltersAndSort(searchTerm, sortKey, newDirection);
  };

  const applyFiltersAndSort = (
    term: string,
    sortBy: keyof Manufacturer | null,
    direction: "asc" | "desc",
  ) => {
    let results = data || [];
    if (term.trim() !== "") {
      results = results.filter(
        (item) =>
          item.name?.toLowerCase().includes(term.toLowerCase()) ||
          item.manufacturerId?.toLowerCase().includes(term.toLowerCase()),
      );
    }

    if (sortBy) {
      results.sort((a, b) => {
        const aValue = a[sortBy] ?? "";
        const bValue = b[sortBy] ?? "";

        if (aValue < bValue) return direction === "asc" ? -1 : 1;
        if (aValue > bValue) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return results;
  };

  const processedData = applyFiltersAndSort(
    searchTerm,
    sortConfig.key,
    sortConfig.direction,
  );

  const paginatedData = processedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const handleAddManufacturer = (meterModel: MeterModelFormData) => {
    setIsSubmitting(true);
    toast.success(
      meterModel.meterClass === "MD"
        ? "MD meter model added successfully"
        : "Meter model added successfully",
    );
    setSearchTerm("");
    setIsAddDialogOpen(false);
    setIsSubmitting(false);
  };

  const handleEditManufacturer = (updatedMeterModel: MeterModelFormData) => {
    setIsSubmitting(true);
    toast.success(
      updatedMeterModel.meterClass === "MD"
        ? "MD meter model updated successfully"
        : "Meter model updated successfully",
    );
    setIsEditDialogOpen(false);
    setIsSubmitting(false);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setRowsPerPage(newPageSize);
    setCurrentPage(1);
  };

  return (
    <main className="h-screen overflow-auto p-6">
      <div className="mb-4 flex flex-col items-center justify-between gap-4 md:flex-row">
        <ContentHeader
          title="Meter Model"
          description="Manage and access meter models."
        />
        {canEdit && (
          <Button
            className="w-full cursor-pointer rounded-md bg-[#161CCA] px-3 py-1.5 text-white hover:bg-[#161CCA]/90 sm:w-auto sm:px-4 sm:py-2"
            onClick={() => setIsAddDialogOpen(true)}
            size="lg"
          >
            <CirclePlus size={14} strokeWidth={2.3} className="mr-2" />
            <span className="hidden sm:inline">Add Meter Model</span>
            <span className="sm:hidden">Add</span>
          </Button>
        )}
      </div>

      {/* Search and Filter Section */}
      <Card className="mb-4 border-none bg-transparent p-3 shadow-none sm:mb-6 sm:p-4">
        <div className="flex w-full flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex w-full flex-col items-start gap-2 sm:w-auto sm:flex-row sm:items-center">
            <SearchControl
              onSearchChange={handleSearchChange}
              value={searchTerm}
            />

            <SortControl
              onSortChange={handleSortChange}
              currentSort={
                sortConfig.key
                  ? `${sortConfig.key} (${sortConfig.direction})`
                  : ""
              }
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="h-4/6 overflow-x-hidden border-none bg-transparent shadow-none">
        <Table>
          <TableHeader className="bg-transparent">
            <TableRow className="bg-transparent hover:bg-gray-50">
              <TableHead className="px-2 py-2 text-left sm:px-4 sm:py-3">
                <Checkbox className="h-4 w-4 border-gray-500" />
              </TableHead>
              <TableHead className="px-2 py-2 text-left text-xs font-semibold text-gray-700 sm:px-4 sm:py-3 sm:text-sm">
                S/N
              </TableHead>
              <TableHead className="px-2 py-2 text-left text-xs font-semibold text-gray-700 sm:px-4 sm:py-3 sm:text-sm">
                Manufacturer
              </TableHead>
              <TableHead className="px-2 py-2 text-left text-xs font-semibold text-gray-700 sm:px-4 sm:py-3 sm:text-sm">
                Model
              </TableHead>
              <TableHead className="px-2 py-2 text-left text-xs font-semibold text-gray-700 sm:px-4 sm:py-3 sm:text-sm md:table-cell">
                Class
              </TableHead>
              <TableHead className="px-2 py-2 text-left text-xs font-semibold text-gray-700 sm:px-4 sm:py-3 sm:text-sm lg:table-cell">
                Serial No
              </TableHead>
              {/* <TableHead className="px-2 py-2 text-left text-xs font-semibold text-gray-700 sm:px-4 sm:py-3 sm:text-sm xl:table-cell">
                Address
              </TableHead> */}
              <TableHead className="px-2 py-2 text-right text-xs font-semibold text-gray-700 sm:px-4 sm:py-3 sm:text-sm">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="h-24 text-center text-xs text-gray-500 sm:text-sm"
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="px-2 py-2 sm:px-4 sm:py-3">
                    <Checkbox className="h-4 w-4 border-gray-500" />
                  </TableCell>
                  <TableCell className="px-2 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm">
                    {index + 1}
                  </TableCell>
                  <TableCell className="px-2 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm">
                    {item.name}
                  </TableCell>
                  <TableCell className="px-2 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm">
                    {item.manufacturerId}
                  </TableCell>
                  <TableCell className="px-2 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm md:table-cell">
                    {item.contactPerson}
                  </TableCell>
                  <TableCell className="px-2 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm md:table-cell">
                    {item.contactPerson}
                  </TableCell>
                  {/* <TableCell className="px-2 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm lg:table-cell">
                    {item.state}
                  </TableCell>
                  <TableCell className="px-2 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm xl:table-cell">
                    {item.houseNo + " " + item.street + ", " + item.city}
                  </TableCell> */}
                  <TableCell className="px-4 py-3 text-right">
                    {canEdit && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className="cursor-pointer border-gray-200 outline-none focus:ring-gray-500 focus:outline-none"
                            variant="ghost"
                            size="sm"
                          >
                            <MoreVertical size={16} className="text-gray-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 bg-white shadow-lg"
                        >
                          <DropdownMenuItem
                            className="flex cursor-pointer items-center gap-2"
                            onClick={() => {
                              setSelectedManufacturer({
                                ...EMPTY_METER_MODEL_FORM,
                                manufacturerName: item.name || "",
                                manufacturerId: item.manufacturerId || "",
                              });
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Pencil size={14} className="text-gray-500" />
                            <span className="text-sm text-gray-700">
                              Edit Meter Model
                            </span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <PaginationControls
        currentPage={currentPage}
        totalItems={processedData.length}
        pageSize={rowsPerPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* Add Manufacturer Dialog */}
      <AddManufacturerDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddManufacturer}
        data={data}
        isSubmitting={isSubmitting}
      />

      {/* Edit Manufacturer Dialog */}
      <EditManufacturerDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedManufacturer(null);
        }}
        onEdit={handleEditManufacturer}
        manufacturer={selectedManufacturer}
        isSubmitting={isSubmitting}
      />
    </main>
  );
}

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TariffDatePicker } from "@/components/tarrif-datepicker";
import { useState } from "react";

interface EditTariffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tariff: {
    name: string;
    index: string;
    type: string;
    effectiveDate: Date | null;
    bandCode: string;
    tariffRate: string;
  };
  onSave: (updatedTariff: EditTariffDialogProps["tariff"]) => void;
}

export function EditTariffDialog({
  open,
  onOpenChange,
  tariff,
  onSave,
}: EditTariffDialogProps) {
  const [formData, setFormData] = useState(tariff);

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.index.trim() !== "" &&
    formData.type.trim() !== "" &&
    formData.effectiveDate !== null &&
    formData.bandCode.trim() !== "" &&
    formData.tariffRate.trim() !== "";

  const handleInputChange = (field: string, value: string | Date | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Edit Tariff
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-4">
          {/* Tariff Name */}
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
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

          {/* Tariff Index and Type */}
          <div className="flex flex-row justify-between gap-4">
            <div className="flex w-1/2 flex-col gap-2">
              <label
                htmlFor="index"
                className="text-sm font-medium text-gray-700"
              >
                Tariff Index
              </label>
              <Select
                value={formData.index}
                onValueChange={(value) => handleInputChange("index", value)}
              >
                <SelectTrigger className="w-full border-gray-300 focus:border-[rgba(22,28,202,1)] focus:ring-[rgba(22,28,202,1)]">
                  <SelectValue placeholder="Select tariff ID" />
                </SelectTrigger>
                <SelectContent>
                  {["1", "2", "3", "4", "5", "6"].map((id) => (
                    <SelectItem key={id} value={id}>
                      {id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-1/2 flex-col gap-2">
              <label
                htmlFor="type"
                className="text-sm font-medium text-gray-700"
              >
                Tariff Type
              </label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange("type", value)}
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
          </div>

          {/* Tariff Effective Date */}
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

          {/* Band Code */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="band-code"
              className="text-sm font-medium text-gray-700"
            >
              Band Code
            </label>
            <Select
              value={formData.bandCode}
              onValueChange={(value) => handleInputChange("bandCode", value)}
            >
              <SelectTrigger className="w-full border-gray-300 focus:border-[rgba(22,28,202,1)] focus:ring-[rgba(22,28,202,1)]">
                <SelectValue placeholder="Select band code" />
              </SelectTrigger>
              <SelectContent>
                {["Band A", "Band B", "Band C", "Band D", "Band E"].map(
                  (band) => (
                    <SelectItem key={band} value={band}>
                      {band}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Tariff Rate */}
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
          {/* Action button */}
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              type="button"
              onClick={() => onOpenChange(false)}
              className="border-gray-300 text-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={`bg-[rgba(22,28,202,1)] text-white hover:bg-[rgba(22,28,202,0.9)] ${
                isFormValid ? "" : "cursor-not-allowed opacity-40"
              }`}
              disabled={!isFormValid}
            >
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

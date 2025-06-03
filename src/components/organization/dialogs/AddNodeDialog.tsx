import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  useNodeFormValidation,
} from "../hooks/useNodeFormValidation";
import type { FormData } from "../hooks/useNodeFormValidation";

interface AddDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: { name: string; nodeType: string; data: FormData }) => void;
  nodeType: string;
}

export const AddNodeDialog = ({
  isOpen,
  onClose,
  onAdd,
  nodeType,
}: AddDialogProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    id: "",
    phoneNumber: "",
    email: "",
    contactPerson: "",
    address: "",
    status: "",
    voltage: "",
    longitude: "",
    latitude: "",
    description: "",
    assetId: "",
    serialNo: "",
  });

  const { errors, isValid, validateForm } = useNodeFormValidation({
    formData,
    nodeType,
  });

  useEffect(() => {
    if (isOpen) {
      const resetData: FormData = {
        name: "",
        id: "",
        phoneNumber: "",
        email: "",
        contactPerson: "",
        address: "",
        status: "",
        voltage: "",
        longitude: "",
        latitude: "",
        description: "",
        assetId: "",
        serialNo: "",
      };
      setFormData(resetData);
      validateForm(resetData);
    }
  }, [isOpen, validateForm]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    validateForm(newData);
  };

  const handleSelectChange = (name: string, value: string) => {
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    validateForm(newData);
  };

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent any potential default behavior
    if (isValid) {
      onAdd({ name: formData.name, nodeType, data: formData });
      onClose();
    }
  };

  const isIdRequired = ["Root", "Region", "Business Hub", "Service Centre"].includes(nodeType);
  const isAssetIdRequired = ["Substation", "Feeder Line", "Distribution Substation (DSS)"].includes(nodeType);
  const isSerialNoRequired = ["Substation", "Feeder Line", "Distribution Substation (DSS)"].includes(nodeType);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-fit rounded-lg bg-white p-6 shadow-lg [&>button]:h-5 [&>button]:w-5 [&>button>svg]:h-5 [&>button>svg]:w-5">
        <DialogHeader>
          <DialogTitle>Add {nodeType}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium">
                {nodeType === "Root"
                  ? "Root Name"
                  : nodeType === "Region"
                    ? "Region Name"
                    : `${nodeType} Name`}{" "}
                *
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={`Enter ${nodeType === "Root" ? "Root" : nodeType === "Region" ? "Region" : nodeType} Name`}
                className="mt-1 border-gray-300"
              />
            </div>
            {isIdRequired && (
              <div className="flex flex-col">
                <label className="text-sm font-medium">
                  {nodeType === "Root"
                    ? "Root ID"
                    : nodeType === "Region"
                      ? "Region ID"
                      : nodeType === "Business Hub"
                        ? "Business Hub ID"
                        : "Service Centre ID"}{" "}
                  *
                </label>
                <Input
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  placeholder={`Enter ${nodeType === "Root" ? "Root" : nodeType === "Region" ? "Region" : nodeType === "Business Hub" ? "Business Hub" : "Service Centre"} ID`}
                  className="mt-1 border-gray-300"
                />
                {errors.id && (
                  <p className="mt-1 text-xs text-red-500">{errors.id}</p>
                )}
              </div>
            )}
            {isSerialNoRequired && (
              <div className="flex flex-col">
                <label className="text-sm font-medium">Serial Number *</label>
                <Input
                  name="serialNo"
                  value={formData.serialNo}
                  onChange={handleInputChange}
                  placeholder="Enter Serial Number"
                  className="mt-1 border-gray-300"
                />
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium">Phone Number *</label>
              <Input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter Phone Number"
                className="mt-1 border-gray-300"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-xs text-red-500">{errors.phoneNumber}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium">Email *</label>
              <Input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter Email"
                className="mt-1 border-gray-300"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium">Contact Person *</label>
              <Input
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                placeholder="Enter Contact Person"
                className="mt-1 border-gray-300"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium">Address *</label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter Address"
                className="mt-1 border-gray-300"
              />
            </div>
          </div>
          {isAssetIdRequired && (
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium">Asset ID *</label>
                <Input
                  name="assetId"
                  value={formData.assetId}
                  onChange={handleInputChange}
                  placeholder="Enter Asset ID"
                  className="mt-1 border-gray-300"
                />
                {errors.assetId && (
                  <p className="mt-1 text-xs text-red-500">{errors.assetId}</p>
                )}
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium">Status *</label>
                <Select
                  onValueChange={(value) => handleSelectChange("status", value)}
                  value={formData.status?.toString()}
                >
                  <SelectTrigger className="ring-opacity-0 border-gray-300">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium">Voltage *</label>
                <Select
                  onValueChange={(value) => handleSelectChange("voltage", value)}
                  value={formData.voltage ? String(formData.voltage) : undefined}
                >
                  <SelectTrigger className="ring-opacity-0 border-gray-300">
                    <SelectValue placeholder="Select Voltage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="330 KV">330 KV</SelectItem>
                    <SelectItem value="132 KV">132 KV</SelectItem>
                    <SelectItem value="33 KV">33 KV</SelectItem>
                    <SelectItem value="11 KV">11 KV</SelectItem>
                    <SelectItem value="415 V">415 V</SelectItem>
                    <SelectItem value="240 V">240 V</SelectItem>
                    <SelectItem value="3-240 V">3-240 V</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          {(nodeType === "Substation" || nodeType === "Distribution Substation (DSS)") && (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium">Longitude *</label>
                <Input
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  placeholder="Enter Longitude"
                  className="mt-1 border-gray-300"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium">Latitude *</label>
                <Input
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  placeholder="Enter Latitude"
                  className="mt-1 border-gray-300"
                />
              </div>
            </div>
          )}
          {isSerialNoRequired && (
            <div className="flex flex-col">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter Description"
                className="mt-1 border-gray-300"
                rows={4}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            size={"lg"}
            className="border-[rgba(22,28,202,1)] text-[rgba(22,28,202,1)] hover:bg-gray-300"
          >
            Cancel
          </Button>
          <Button
            disabled={!isValid}
            onClick={handleAdd}
            size={"lg"}
            className="ml-2 bg-[rgba(22,28,202,1)] text-white"
          >
            Add {nodeType}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
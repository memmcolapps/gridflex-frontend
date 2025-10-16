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
import { Button } from "@/components/ui/button";
import {
  useNodeFormValidation,
  type FormData,
} from "../hooks/useNodeFormValidation";
import { Textarea } from "@/components/ui/textarea";
import {
  useUpdateRegionBhubServiceCenter,
  useUpdateSubstationTransfomerFeeder,
} from "@/hooks/use-org";
import { toast } from "sonner";

interface EditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormData) => void;
  nodeType: string;
  initialData: FormData;
  nodeId: string;
}

export const EditNodeDialog = ({
  isOpen,
  onClose,
  onSave,
  nodeType,
  initialData,
  nodeId,
}: EditDialogProps) => {
  const [formData, setFormData] = useState<FormData>(initialData);

  const { errors, isValid, validateForm } = useNodeFormValidation({
    formData,
    nodeType,
    isInitialValidation: true,
  });

  const updateRegionBhubServiceCenter = useUpdateRegionBhubServiceCenter();
  const updateSubstationTransfomerFeeder =
    useUpdateSubstationTransfomerFeeder();

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
      validateForm(initialData);
    }
  }, [isOpen, initialData, validateForm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    validateForm(newData);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

  const handleSave = async () => {
    if (!isValid) return;

    try {
      // Determine which mutation to use based on node type
      const isRegionBhubServiceCenter = [
        "Region",
        "Business Hub",
        "Service Center",
      ].includes(nodeType);
      const isTechnicalNode = ["Substation", "Feeder Line", "DSS"].includes(
        nodeType,
      );

      if (isRegionBhubServiceCenter) {
        await updateRegionBhubServiceCenter.mutateAsync({
          nodeId,
          regionId: formData.id,
          name: formData.name,
          phoneNo: formData.phoneNumber,
          email: formData.email,
          contactPerson: formData.contactPerson,
          address: formData.address,
          type: nodeType,
        });
      } else if (isTechnicalNode) {
        await updateSubstationTransfomerFeeder.mutateAsync({
          nodeId,
          name: formData.name,
          serialNo: formData.assetId,
          phoneNo: formData.phoneNumber,
          email: formData.email,
          contactPerson: formData.contactPerson,
          address: formData.address,
          status: formData.status === "Active",
          voltage: formData.voltage || "",
          latitude: formData.latitude || "",
          longitude: formData.longitude || "",
          description: formData.description || "",
        });
      }

      toast.success(`Successfully updated ${nodeType}`);
      onSave(formData);
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : `Failed to update ${nodeType}`,
      );
    }
  };

  const isTechnicalNode = ["Substation", "Feeder Line", "DSS"].includes(
    nodeType,
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-fit rounded-lg bg-white p-6 shadow-lg [&>button]:h-5 [&>button]:w-5 [&>button>svg]:h-5 [&>button>svg]:w-5">
        <DialogHeader>
          <DialogTitle>Edit {nodeType}</DialogTitle>
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
            <div className="flex flex-col">
              <label className="text-sm font-medium">
                {nodeType === "Root"
                  ? "Root ID"
                  : nodeType === "Region"
                    ? "Region ID"
                    : "ID"}{" "}
                *
              </label>
              <Input
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                placeholder={`Enter ${nodeType === "Root" ? "Root" : nodeType === "Region" ? "Region" : ""} ID`}
                className="mt-1 border-gray-300"
              />
              {errors.id && (
                <p className="mt-1 text-xs text-red-500">{errors.id}</p>
              )}
            </div>
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
                <p className="mt-1 text-xs text-red-500">
                  {errors.phoneNumber}
                </p>
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
          {isTechnicalNode && (
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
                  onValueChange={(value) =>
                    handleSelectChange("voltage", value)
                  }
                  value={
                    formData.voltage ? String(formData.voltage) : undefined
                  }
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
          {(nodeType === "Substation" || nodeType === "DSS") && (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium">Longitude *</label>
                <Input
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  placeholder="Enter Longitude"
                  className="mt-1"
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
          {isTechnicalNode && (
            <div className="flex flex-col">
              <label className="text-sm font-medium">Description *</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleTextareaChange}
                placeholder="Enter Description"
                className="mt-1 border-gray-300"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[rgba(22,28,202,1)] text-[rgba(22,28,202,1)] hover:bg-gray-300"
            size={"lg"}
            disabled={
              updateRegionBhubServiceCenter.isPending ||
              updateSubstationTransfomerFeeder.isPending
            }
          >
            Cancel
          </Button>
          <Button
            disabled={
              !isValid ||
              updateRegionBhubServiceCenter.isPending ||
              updateSubstationTransfomerFeeder.isPending
            }
            onClick={handleSave}
            size={"lg"}
            className="ml-2 bg-[rgba(22,28,202,1)] text-white"
          >
            {updateRegionBhubServiceCenter.isPending ||
            updateSubstationTransfomerFeeder.isPending
              ? "Saving..."
              : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

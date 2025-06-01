// components/organization/OrganizationalTree.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Edit,
  ChevronRight,
  ChevronDown,
  Building,
  Wrench,
  Database,
  Zap,
  Plug,
  Building2,
  Grid2X2,
  Loader2, // Import for loading indicator
} from "lucide-react";
import { Card } from "../ui/card";
import {
  fetchOrganizationNodes,
  Node,
  NodeInfo,
} from "../../service/organaization-service"; // Import your service and interfaces
import { toast } from "sonner"; // For displaying toasts

// Helper function to map NodeInfo to formData
const mapNodeInfoToFormData = (
  nodeInfo?: NodeInfo,
): Record<string, string | number> => {
  if (!nodeInfo) {
    return {
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
      serialNo: "",
    };
  }
  return {
    name: nodeInfo.name ?? "",
    id: nodeInfo.serialNo ?? nodeInfo.nodeId ?? "", // Use serialNo for ID if available
    phoneNumber: nodeInfo.phoneNo ?? "",
    email: nodeInfo.email ?? "",
    contactPerson: nodeInfo.contactPerson ?? "",
    address: nodeInfo.address ?? "",
    status:
      nodeInfo.status !== undefined
        ? nodeInfo.status
          ? "Active"
          : "Inactive"
        : "",
    voltage: nodeInfo.voltage ?? "",
    longitude: nodeInfo.longitude ?? "",
    latitude: nodeInfo.latitude ?? "",
    description: nodeInfo.description ?? "",
    serialNo: nodeInfo.serialNo ?? "",
  };
};

// Add Dialog Component
interface AddDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: {
    name: string;
    nodeType: string;
    data: Record<string, string | number>;
  }) => void;
  nodeType: string;
}

const AddDialog = ({ isOpen, onClose, onAdd, nodeType }: AddDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    id: "", // This will be serialNo or regionId/bhubId
    phoneNumber: "",
    email: "",
    contactPerson: "",
    address: "",
    status: "",
    voltage: "",
    longitude: "",
    latitude: "",
    description: "",
  });
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    phoneNumber: "",
    id: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
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
      });
      setErrors({ email: "", phoneNumber: "", id: "" });
      setIsValid(false);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      validateForm(newData);
      return newData;
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      validateForm(newData);
      return newData;
    });
  };

  const validateForm = (data: Record<string, string | number>) => {
    const requiredFields = [
      "name",
      "id",
      "phoneNumber",
      "email",
      "contactPerson",
      "address",
    ];

    // Adjust required fields based on node type
    if (nodeType !== "Root" && nodeType !== "Region") {
      requiredFields.push("status", "voltage");
    }
    if (nodeType === "Substation" || nodeType === "Transformer") {
      requiredFields.push("longitude", "latitude");
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = data.email
      ? emailRegex.test(String(data.email))
      : false;
    setErrors((prev) => ({
      ...prev,
      email: (isEmailValid ?? !data.email) ? "" : "Invalid email format",
    }));

    // Phone number validation
    const phoneRegex = /^\+?[0-9]{10,}$/;
    const isPhoneValid = data.phoneNumber
      ? phoneRegex.test(String(data.phoneNumber))
      : false;
    setErrors((prev) => ({
      ...prev,
      phoneNumber:
        (isPhoneValid ?? !data.phoneNumber)
          ? ""
          : "Phone number must be at least 10 digits",
    }));

    // ID (serial number) validation
    const idRegex = /^[a-zA-Z0-9]+$/;
    const isIdValid = data.id ? idRegex.test(String(data.id)) : false;
    setErrors((prev) => ({
      ...prev,
      id: (isIdValid ?? !data.id) ? "" : "ID must be alphanumeric",
    }));

    const allFieldsValid =
      requiredFields.every((field) => data[field]) &&
      isEmailValid &&
      isPhoneValid &&
      isIdValid;
    setIsValid(allFieldsValid);
  };

  const handleAdd = () => {
    if (isValid) {
      onAdd({ name: formData.name, nodeType, data: formData });
      setFormData({
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
      });
      setErrors({ email: "", phoneNumber: "", id: "" });
      onClose();
    }
  };

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
          {nodeType !== "Root" && nodeType !== "Region" && (
            <div className="grid grid-cols-2 gap-4">
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
          {(nodeType === "Substation" || nodeType === "Transformer") && (
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

// Edit Dialog Component
interface EditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Record<string, string | number>) => void;
  nodeType: string;
  initialData: Record<string, string | number>;
}

const EditDialog = ({
  isOpen,
  onClose,
  onSave,
  nodeType,
  initialData,
}: EditDialogProps) => {
  const [formData, setFormData] = useState(initialData);
  const [isValid, setIsValid] = useState(true);
  const [errors, setErrors] = useState({
    email: "",
    phoneNumber: "",
    id: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
      validateForm(initialData);
    }
  }, [isOpen, initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      validateForm(newData);
      return newData;
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      validateForm(newData);
      return newData;
    });
  };

  const validateForm = (data: Record<string, string | number>) => {
    const requiredFields = [
      "name",
      "id",
      "phoneNumber",
      "email",
      "contactPerson",
      "address",
    ];

    // Adjust required fields based on node type
    if (nodeType !== "Root" && nodeType !== "Region") {
      requiredFields.push("status", "voltage");
    }
    if (nodeType === "Substation" || nodeType === "Transformer") {
      requiredFields.push("longitude", "latitude");
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = data.email
      ? emailRegex.test(String(data.email))
      : false;
    setErrors((prev) => ({
      ...prev,
      email: (isEmailValid ?? !data.email) ? "" : "Invalid email format",
    }));

    // Phone number validation
    const phoneRegex = /^\+?[0-9]{10,}$/;
    const isPhoneValid = data.phoneNumber
      ? phoneRegex.test(String(data.phoneNumber))
      : false;
    setErrors((prev) => ({
      ...prev,
      phoneNumber:
        isPhoneValid || !data.phoneNumber
          ? ""
          : "Phone number must be at least 10 digits",
    }));

    // ID (serial number) validation
    const idRegex = /^[a-zA-Z0-9]+$/;
    const isIdValid = data.id ? idRegex.test(String(data.id)) : false;
    setErrors((prev) => ({
      ...prev,
      id: isIdValid || !data.id ? "" : "ID must be alphanumeric",
    }));

    const allFieldsValid =
      requiredFields.every((field) => data[field]) &&
      isEmailValid &&
      isPhoneValid &&
      isIdValid;
    setIsValid(allFieldsValid);
  };

  const handleSave = () => {
    if (isValid) {
      onSave(formData);
      onClose();
    }
  };

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
          {nodeType !== "Root" && nodeType !== "Region" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium">Status *</label>
                <Select
                  onValueChange={(value) => handleSelectChange("status", value)}
                  value={formData.status ? String(formData.status) : undefined}
                >
                  <SelectTrigger className="ring-opacity-0">
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
                    formData.voltage !== undefined
                      ? String(formData.voltage)
                      : undefined
                  }
                >
                  <SelectTrigger className="ring-opacity-0">
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
          {(nodeType === "Substation" || nodeType === "Transformer") && (
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
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[rgba(22,28,202,1)] text-[rgba(22,28,202,1)] hover:bg-gray-300"
            size={"lg"}
          >
            Cancel
          </Button>
          <Button
            disabled={!isValid}
            onClick={handleSave}
            size={"lg"}
            className="ml-2 bg-[rgba(22,28,202,1)] text-white"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Organization Node Component
interface OrganizationNodeProps {
  node: Node; // Expect a Node object from the API
  level?: number;
}

const OrganizationNode = ({ node, level = 0 }: OrganizationNodeProps) => {
  const [name, setName] = useState(node.name);
  const [children, setChildren] = useState<Node[]>(node.nodesTree ?? []);
  const [isExpanded, setIsExpanded] = useState(false); // Start collapsed by default
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedNodeType, setSelectedNodeType] = useState("");
  const [nodeData, setNodeData] = useState(
    mapNodeInfoToFormData(node.nodeInfo),
  );

  useEffect(() => {
    setName(node.name);
    setChildren(node.nodesTree ?? []);
    setNodeData(mapNodeInfoToFormData(node.nodeInfo));
  }, [node]);

  const handleAddNode = (data: {
    name: string;
    nodeType: string;
    data: Record<string, string | number>;
  }) => {
    toast.success(`Successfully added ${data.name} as a ${data.nodeType}`);
  };

  const handleEditNode = (data: Record<string, string | number>) => {
    // This is a placeholder for actual API call to edit a node
    // For now, we'll simulate editing the local state
    setNodeData(data);
    setName(data.name as string);
    toast.success(`Successfully updated ${data.name}`);
  };

  const openAddDialog = (type: string) => {
    setSelectedNodeType(type);
    setIsAddDialogOpen(true);
  };

  const renderNodeIcon = (nodeTypeString?: string) => {
    // The 'type' property is inside nodeInfo
    const type = nodeTypeString ?? node.nodeInfo?.type;
    switch (type) {
      case "root":
        return <Building2 size={14} className="text-gray-600" />;
      case "region":
        return <Grid2X2 size={14} className="text-gray-600" />;
      case "business hub":
        return <Building size={14} className="text-gray-600" />;
      case "service centre":
        return <Wrench size={14} className="text-gray-600" />;
      case "substation":
        return <Database size={14} className="text-gray-600" />;
      case "feeder line":
        return <Zap size={14} className="text-gray-600" />;
      case "transformer":
        return <Plug size={14} className="text-gray-600" />;
      default:
        return null;
    }
  };

  const displayName = node.nodeInfo?.name ?? node.name;
  const displayNodeType = node.nodeInfo?.type ?? node.name; // Fallback to node.name if type is missing

  return (
    <Card className="border-none">
      <div className="ml-4 pl-5" style={{ marginLeft: `${level * 20}px` }}>
        <div className="flex items-center justify-between gap-2 rounded p-2">
          <span
            className="flex cursor-pointer items-center gap-2 text-gray-800"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {children.length > 0 &&
              (isExpanded ? (
                <ChevronDown size={14} className="text-gray-600" />
              ) : (
                <ChevronRight size={14} className="text-gray-600" />
              ))}
            {renderNodeIcon(displayNodeType)}
            {displayName}
          </span>
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  className="cursor-pointer border-none p-1 text-gray-600 ring-[rgba(22,28,202,0)] hover:text-gray-800 focus:outline-none"
                >
                  <Plus size={14} strokeWidth={2.7} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => openAddDialog("Region")}>
                  <Grid2X2 size={14} className="mr-2 text-gray-700" /> Region
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openAddDialog("Business Hub")}>
                  <Building size={14} className="mr-2 text-gray-700" /> Business
                  Hub
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => openAddDialog("Service Centre")}
                >
                  <Wrench size={14} className="mr-2 text-gray-700" /> Service
                  Centre
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openAddDialog("Substation")}>
                  <Database size={14} className="mr-2 text-gray-700" />{" "}
                  Substation
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openAddDialog("Feeder Line")}>
                  <Zap size={14} className="mr-2 text-gray-700" /> Feeder Line
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openAddDialog("Transformer")}>
                  <Plug size={14} className="mr-2 text-gray-700" /> Transformer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              onClick={() => setIsEditDialogOpen(true)}
              className="cursor-pointer border-none p-1 text-gray-600 ring-[rgba(22,28,202,0)] hover:text-gray-800 focus:outline-none"
            >
              <Edit size={14} strokeWidth={2.7} />
            </Button>
          </div>
        </div>
        {isExpanded &&
          children.map((childNode) => (
            <OrganizationNode
              key={childNode.id} // Use actual ID from API
              node={childNode}
              level={level + 1}
            />
          ))}
        <AddDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onAdd={handleAddNode}
          nodeType={selectedNodeType}
        />
        <EditDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={handleEditNode}
          nodeType={displayNodeType ?? "Node"} // Pass the correct node type to edit dialog
          initialData={nodeData}
        />
      </div>
    </Card>
  );
};

// Main Organizational Structure Component
const OrganizationalTree = () => {
  const [organizationNodes, setOrganizationNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrganizationNodes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const nodes = await fetchOrganizationNodes();
      setOrganizationNodes(nodes);
    } catch (err) {
      setError("Failed to fetch organization nodes. Please try again.");
      toast.error("Failed to load organization data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrganizationNodes();
  }, [loadOrganizationNodes]);

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[rgba(22,28,202,1)]" />
        <span className="ml-2 text-gray-600">Loading organization tree...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
        <Button onClick={loadOrganizationNodes} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      {organizationNodes.length > 0 ? (
        organizationNodes.map((node) => (
          <OrganizationNode key={node.id} node={node} />
        ))
      ) : (
        <div className="text-center text-gray-500">
          No organization nodes found.
        </div>
      )}
    </div>
  );
};

export default OrganizationalTree;

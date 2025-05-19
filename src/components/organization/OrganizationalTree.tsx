"use client";

import { useState, useEffect } from "react";
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
import { Plus, Edit, ChevronRight, ChevronDown, Building, Wrench, Database, Zap, Plug, Building2, Grid2X2 } from "lucide-react";
import { Card } from "../ui/card";

// Add Dialog Component
interface AddDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: { name: string; nodeType: string; data: Record<string, string | number> }) => void;
    nodeType: string;
}

const AddDialog = ({ isOpen, onClose, onAdd, nodeType }: AddDialogProps) => {
    const [formData, setFormData] = useState({
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
    });
    const [isValid, setIsValid] = useState(false);
    const [errors, setErrors] = useState({
        email: "",
        phoneNumber: "",
        id: "",
    });

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
        const requiredFields = ["name", "id", "phoneNumber", "email", "contactPerson", "address"];
        
        // Adjust required fields based on node type
        if (nodeType !== "Root" && nodeType !== "Region") {
            requiredFields.push("status", "voltage");
        }
        if (nodeType === "Substation" || nodeType === "Transformer") {
            requiredFields.push("longitude", "latitude");
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = data.email ? emailRegex.test(String(data.email)) : false;
        setErrors((prev) => ({
            ...prev,
            email: isEmailValid || !data.email ? "" : "Invalid email format",
        }));

        // Phone number validation
        const phoneRegex = /^\+?[0-9]{10,}$/;
        const isPhoneValid = data.phoneNumber ? phoneRegex.test(String(data.phoneNumber)) : false;
        setErrors((prev) => ({
            ...prev,
            phoneNumber: isPhoneValid || !data.phoneNumber ? "" : "Phone number must be at least 10 digits",
        }));

        // ID (serial number) validation
        const idRegex = /^[a-zA-Z0-9]+$/;
        const isIdValid = data.id ? idRegex.test(String(data.id)) : false;
        setErrors((prev) => ({
            ...prev,
            id: isIdValid || !data.id ? "" : "ID must be alphanumeric",
        }));

        const allFieldsValid = requiredFields.every((field) => data[field]) && isEmailValid && isPhoneValid && isIdValid;
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
            });
            setErrors({ email: "", phoneNumber: "", id: "" });
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white p-6 rounded-lg h-fit shadow-lg [&>button]:w-5 [&>button]:h-5 [&>button>svg]:w-5 [&>button>svg]:h-5">
                <DialogHeader>
                    <DialogTitle>Add {nodeType}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium">
                                {nodeType === "Root" ? "Root Name" : nodeType === "Region" ? "Region Name" : `${nodeType} Name`} *
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
                                {nodeType === "Root" ? "Root ID" : nodeType === "Region" ? "Region ID" : "ID"} *
                            </label>
                            <Input
                                name="id"
                                value={formData.id}
                                onChange={handleInputChange}
                                placeholder={`Enter ${nodeType === "Root" ? "Root" : nodeType === "Region" ? "Region" : ""} ID`}
                                className="mt-1 border-gray-300"
                            />
                            {errors.id && <p className="text-red-500 text-xs mt-1">{errors.id}</p>}
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
                            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
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
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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
                    {(nodeType !== "Root" && nodeType !== "Region") && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium">Status *</label>
                                <Select
                                    onValueChange={(value) => handleSelectChange("status", value)}
                                    value={formData.status?.toString()}
                                >
                                    <SelectTrigger className="border-gray-300 ring-opacity-0">
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
                                    <SelectTrigger className="border-gray-300 ring-opacity-0">
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
                        className="text-[rgba(22,28,202,1)] border-[rgba(22,28,202,1)] hover:bg-gray-300"
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

const EditDialog = ({ isOpen, onClose, onSave, nodeType, initialData }: EditDialogProps) => {
    const [formData, setFormData] = useState(initialData || {
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
    });
    const [isValid, setIsValid] = useState(true);
    const [errors, setErrors] = useState({
        email: "",
        phoneNumber: "",
        id: "",
    });

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
        const requiredFields = ["name", "id", "phoneNumber", "email", "contactPerson", "address"];
        
        // Adjust required fields based on node type
        if (nodeType !== "Root" && nodeType !== "Region") {
            requiredFields.push("status", "voltage");
        }
        if (nodeType === "Substation" || nodeType === "Transformer") {
            requiredFields.push("longitude", "latitude");
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = data.email ? emailRegex.test(String(data.email)) : false;
        setErrors((prev) => ({
            ...prev,
            email: isEmailValid || !data.email ? "" : "Invalid email format",
        }));

        // Phone number validation
        const phoneRegex = /^\+?[0-9]{10,}$/;
        const isPhoneValid = data.phoneNumber ? phoneRegex.test(String(data.phoneNumber)) : false;
        setErrors((prev) => ({
            ...prev,
            phoneNumber: isPhoneValid || !data.phoneNumber ? "" : "Phone number must be at least 10 digits",
        }));

        // ID (serial number) validation
        const idRegex = /^[a-zA-Z0-9]+$/;
        const isIdValid = data.id ? idRegex.test(String(data.id)) : false;
        setErrors((prev) => ({
            ...prev,
            id: isIdValid || !data.id ? "" : "ID must be alphanumeric",
        }));

        const allFieldsValid = requiredFields.every((field) => data[field]) && isEmailValid && isPhoneValid && isIdValid;
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
            <DialogContent className="bg-white h-fit p-6 rounded-lg shadow-lg [&>button]:w-5 [&>button]:h-5 [&>button>svg]:w-5 [&>button>svg]:h-5">
                <DialogHeader>
                    <DialogTitle>Edit {nodeType}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium">
                                {nodeType === "Root" ? "Root Name" : nodeType === "Region" ? "Region Name" : `${nodeType} Name`} *
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
                                {nodeType === "Root" ? "Root ID" : nodeType === "Region" ? "Region ID" : "ID"} *
                            </label>
                            <Input
                                name="id"
                                value={formData.id}
                                onChange={handleInputChange}
                                placeholder={`Enter ${nodeType === "Root" ? "Root" : nodeType === "Region" ? "Region" : ""} ID`}
                                className="mt-1 border-gray-300"
                            />
                            {errors.id && <p className="text-red-500 text-xs mt-1">{errors.id}</p>}
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
                            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
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
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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
                    {(nodeType !== "Root" && nodeType !== "Region") && (
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
                                    onValueChange={(value) => handleSelectChange("voltage", value)}
                                    value={formData.voltage !== undefined ? String(formData.voltage) : undefined}
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
                    <Button variant="outline"
                        onClick={onClose}
                        className="text-[rgba(22,28,202,1)] border-[rgba(22,28,202,1)] hover:bg-gray-300"
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
    name: string;
    level?: number;
    nodeType?: string;
    initialData?: Record<string, string | number>;
    initialChildren?: { name: string; nodeType: string; data: Record<string, string | number> }[];
    initialExpanded?: boolean;
}

const OrganizationNode = ({
    name: initialName,
    level = 0,
    nodeType = "Root",
    initialData = {},
    initialChildren = [],
    initialExpanded = false
}: OrganizationNodeProps) => {
    const [name, setName] = useState(initialName);
    const [children, setChildren] = useState<{ name: string; nodeType: string; data: Record<string, string | number> }[]>(initialChildren);
    const [isExpanded, setIsExpanded] = useState(initialExpanded);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedNodeType, setSelectedNodeType] = useState("");
    const [nodeData, setNodeData] = useState(initialData);

    useEffect(() => {
        setChildren(initialChildren);
    }, [initialChildren]);

    const handleAddNode = (data: { name: string; nodeType: string; data: Record<string, string | number> }) => {
        const newChild = { name: data.name, nodeType: selectedNodeType, data: data.data };
        setChildren((prevChildren) => [...prevChildren, newChild]);
        setIsExpanded(true); // Automatically expand the parent when a new child is added
    };

    const handleEditNode = (data: Record<string, string | number>) => {
        setNodeData(data);
        setName(data.name as string);
    };

    const openAddDialog = (type: string) => {
        setSelectedNodeType(type);
        setIsAddDialogOpen(true);
    };

    const renderNodeIcon = (nodeType: string) => {
        switch (nodeType) {
            case "Root":
                return <Building2 size={14} className="text-gray-600" />;
            case "Region":
                return <Grid2X2 size={14} className="text-gray-600" />;
            case "Business Hub":
                return <Building size={14} className="text-gray-600" />;
            case "Service Centre":
                return <Wrench size={14} className="text-gray-600" />;
            case "Substation":
                return <Database size={14} className="text-gray-600" />;
            case "Feeder Line":
                return <Zap size={14} className="text-gray-600" />;
            case "Transformer":
                return <Plug size={14} className="text-gray-600" />;
            default:
                return null;
        }
    };

    return (
        <Card className="border-none">
            <div className="ml-4 pl-5" style={{ marginLeft: `${level * 20}px` }}>
                <div className="flex items-center justify-between gap-2 p-2 rounded">
                    <span
                        className="flex items-center gap-2 text-gray-800 cursor-pointer"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? (
                            <ChevronDown size={14} className="text-gray-600" />
                        ) : (
                            <ChevronRight size={14} className="text-gray-600" />
                        )}
                        {renderNodeIcon(nodeType)}
                        {name}
                    </span>
                    <div className="flex items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="secondary"
                                    className="p-1 text-gray-600 hover:text-gray-800 border-none cursor-pointer focus:outline-none ring-[rgba(22,28,202,0)]"
                                >
                                    <Plus size={14} strokeWidth={2.7} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => openAddDialog("Region")}>
                                    <Grid2X2 size={14} className="text-gray-700 mr-2" /> Region
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openAddDialog("Business Hub")}>
                                    <Building size={14} className="text-gray-700 mr-2" /> Business Hub
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openAddDialog("Service Centre")}>
                                    <Wrench size={14} className="text-gray-700 mr-2" /> Service Centre
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openAddDialog("Substation")}>
                                    <Database size={14} className="text-gray-700 mr-2" /> Substation
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openAddDialog("Feeder Line")}>
                                    <Zap size={14} className="text-gray-700 mr-2" /> Feeder Line
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openAddDialog("Transformer")}>
                                    <Plug size={14} className="text-gray-700 mr-2" /> Transformer
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                            onClick={() => setIsEditDialogOpen(true)}
                            className="p-1 text-gray-600 hover:text-gray-800 cursor-pointer border-none focus:outline-none ring-[rgba(22,28,202,0)]"
                        >
                            <Edit size={14} strokeWidth={2.7} />
                        </Button>
                    </div>
                </div>
                {isExpanded &&
                    children.map((child, index) => (
                        <OrganizationNode
                            key={`${child.nodeType}-${child.name}-${index}`} // Unique key to prevent re-rendering issues
                            name={child.name}
                            level={level + 1}
                            nodeType={child.nodeType}
                            initialData={child.data}
                            initialChildren={[]} // Reset children for the child node
                            initialExpanded={false} // Child nodes start collapsed unless explicitly expanded
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
                    nodeType={nodeType}
                    initialData={nodeData}
                />
            </div>
        </Card>
    );
};

// Main Organizational Structure Component
const OrganizationalTree = () => {
    return (
        <div className="p-4">
            <OrganizationNode
                name="ROOT"
                initialData={{
                    name: "ROOT",
                    id: "1234567899",
                    phoneNumber: "0812315322",
                    email: "abdulmujib@memmcol.com",
                    contactPerson: "Engr Muda",
                    address: "LAGOS-IBADAN EXPRESS WAY",
                }}
                initialChildren={[]}
                initialExpanded={false}
            />
        </div>
    );
};

export default OrganizationalTree;
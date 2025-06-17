import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type Customer = {
    id: string;
    customerId: string;
    firstName: string;
    lastName: string;
    accountNumber: string;
    nin: string;
    phoneNumber: string;
    email: string;
    state: string;
    city: string;
    houseNo: string;
    streetName: string;
    meterNumber?: string;
    location?: string;
    address?: string;
    status?: "Active" | "Blocked" | "Inactive";
    virtual?: number;
    actual?: number;
    valueAddedTax?: "Paying" | "Not Paying";
};

type CustomerFormModalProps = {
    mode: "add" | "edit";
    customer?: Customer;
    onSave: (customer: Customer) => void;
    triggerButton?: React.ReactNode;
    isOpen?: boolean;
    onClose?: () => void;
};

const states = [
    { value: "Lagos", label: "Lagos" },
    // Add more states as needed
];

const cities = [
    { value: "Lagos", label: "Lagos" },
    // Add more cities as needed
];

export default function CustomerForm({ mode, customer, onSave, triggerButton, isOpen: controlledIsOpen, onClose }: CustomerFormModalProps) {
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const isOpen = mode === "add" ? internalIsOpen : controlledIsOpen ?? false;

    const [formData, setFormData] = useState<Customer>({
        id: "",
        customerId: "", // Changed to required string with empty default
        firstName: "",
        lastName: "",
        accountNumber: "",
        nin: "",
        phoneNumber: "",
        email: "",
        state: "",
        city: "",
        houseNo: "",
        streetName: "",
        meterNumber: "",
        location: "",
        address: "",
        status: "Active",
        virtual: undefined,
        actual: undefined,
        valueAddedTax: "Not Paying",
    });

    const cleanUpOverlay = useCallback(() => {
        const overlays = document.querySelectorAll("[data-radix-dialog-overlay]");
        if (overlays.length > 0) {
            overlays.forEach((overlay) => overlay.remove());
        }
    }, []);

    useEffect(() => {
        if (isOpen && customer && mode === "edit") {
            setFormData(customer);
        } else if (!isOpen) {
            setFormData({
                id: "",
                customerId: "", // Reset to empty string for new customers
                firstName: "",
                lastName: "",
                accountNumber: "",
                nin: "",
                phoneNumber: "",
                email: "",
                state: "",
                city: "",
                houseNo: "",
                streetName: "",
                meterNumber: "",
                location: "",
                address: "",
                status: "Active",
                virtual: undefined,
                actual: undefined,
                valueAddedTax: "Not Paying",
            });
        }
    }, [customer, isOpen, mode]);

    const handleOpenChange = useCallback((open: boolean) => {
        if (mode === "add") {
            setInternalIsOpen(open);
        }
        if (!open) {
            cleanUpOverlay();
            if (onClose) {
                onClose();
            }
        }
    }, [mode, onClose, cleanUpOverlay]);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement> | string, field?: string) => {
            if (typeof e === "string" && field) {
                setFormData((prev) => ({
                    ...prev,
                    [field]: e,
                }));
            } else if (typeof e !== "string") {
                const { name, value } = e.target;
                setFormData((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            }
        },
        []
    );

    const handleTaxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            valueAddedTax: checked ? "Paying" : "Not Paying",
        }));
    }, []);

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            // Ensure customerId is set before saving, especially for 'add' mode
            const customerToSave = {
                ...formData,
                id: formData.id || Date.now().toString(), // Default to timestamp if not provided
                customerId: formData.customerId || `C-${Date.now().toString().slice(-6)}`, // Default to a unique customerId if not provided
            };
            onSave(customerToSave);
            if (mode === "add") {
                setInternalIsOpen(false);
            }
            cleanUpOverlay();
            if (onClose) {
                onClose();
            }
        },
        [formData, onSave, mode, onClose, cleanUpOverlay]
    );

    if (mode === "edit" && !customer) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            {mode === "add" && (
                <DialogTrigger asChild className="cursor-pointer">
                    {triggerButton}
                </DialogTrigger>
            )}

            <DialogContent className="sm:max-w-[430px] bg-white text-black h-fit rounded-2xl">
                <DialogHeader className="mt-6">
                    <DialogTitle>
                        {mode === "add" ? "Add Customer" : "Edit Customer"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="mt-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name <span className="text-red-600">*</span></Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                placeholder="Enter first name"
                                className="border-[rgba(228,231,236,1)]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name<span className="text-red-600">*</span></Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Enter last name"
                                className="border-[rgba(228,231,236,1)]"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6 mt-6">
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone Number<span className="text-red-600">*</span></Label>
                            <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                                placeholder="Enter phone number"
                                className="border-[rgba(228,231,236,1)]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nin">NIN<span className="text-red-600">*</span></Label>
                            <Input
                                id="nin"
                                name="nin"
                                value={formData.nin}
                                onChange={handleChange}
                                required
                                placeholder="Enter NIN"
                                className="border-[rgba(228,231,236,1)]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email <span className="text-red-600">*</span></Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Enter email"
                                className="border-[rgba(228,231,236,1)]"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 mt-6">
                        <div className="space-y-2">
                            <Label htmlFor="state">State<span className="text-red-600">*</span></Label>
                            <Select
                                value={formData.state}
                                onValueChange={(value) => handleChange(value, "state")}
                            >
                                <SelectTrigger className="border-[rgba(228,231,236,1)] w-full">
                                    <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                                <SelectContent>
                                    {states.map((state) => (
                                        <SelectItem key={state.value} value={state.value}>
                                            {state.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="city">City<span className="text-red-600">*</span></Label>
                            <Select
                                value={formData.city}
                                onValueChange={(value) => handleChange(value, "city")}
                            >
                                <SelectTrigger className="border-[rgba(228,231,236,1)] w-full">
                                    <SelectValue placeholder="Select city" />
                                </SelectTrigger>
                                <SelectContent>
                                    {cities.map((city) => (
                                        <SelectItem key={city.value} value={city.value}>
                                            {city.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 mt-6">
                        <div className="space-y-2">
                            <Label htmlFor="streetName">Street Name<span className="text-red-600">*</span></Label>
                            <Input
                                id="streetName"
                                name="streetName"
                                value={formData.streetName}
                                onChange={handleChange}
                                placeholder="Enter street name"
                                className="border-[rgba(228,231,236,1)]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="houseNo">House No.<span className="text-red-600">*</span></Label>
                            <Input
                                id="houseNo"
                                name="houseNo"
                                value={formData.houseNo}
                                onChange={handleChange}
                                placeholder="Enter house no."
                                className="border-[rgba(228,231,236,1)]"
                            />
                        </div>
                    </div>

                    <div className="mt-6 space-y-2">
                        <Label>Value Added Tax</Label>
                        <div className="flex items-center justify-between gap-2 border border-gray-500 p-2 rounded-md">
                            <Label className="text-sm text-gray-700">
                                {formData.valueAddedTax === "Paying" ? "Paying" : "Not Paying"}
                            </Label>
                            <input
                                type="checkbox"
                                checked={formData.valueAddedTax === "Paying"}
                                onChange={handleTaxChange}
                                className="cursor-pointer accent-green-500"
                            />
                        </div>
                    </div>

                    <div className="mt-12 flex justify-between gap-3">
                        <Button
                            variant="outline"
                            onClick={() => {
                                if (mode === "add") {
                                    setInternalIsOpen(false);
                                }
                                cleanUpOverlay();
                                if (onClose) {
                                    onClose();
                                }
                            }}
                            type="button"
                            className="border-[#161CCA] text-[#161CCA] cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-[#161CCA] text-white cursor-pointer">
                            {mode === "add" ? "Add Customer" : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
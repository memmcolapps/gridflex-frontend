"use client";
import { useState, useCallback, useEffect } from "react";
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
import { toast } from "sonner";
import { useAddCustomer, useUpdateCustomer } from "@/hooks/use-customer";
import { type Customer, type AddCustomerPayload, type UpdateCustomerPayload } from "@/types/customer-types";
import { useNigerianCities, useNigerianStates } from "@/hooks/use-location";

type CustomerFormModalProps = {
    mode: "add" | "edit";
    customer?: Customer;
    onSave: () => void;
    triggerButton?: React.ReactNode;
    isOpen?: boolean;
    onClose?: () => void;
};

export default function CustomerForm({ mode, customer, onSave, triggerButton, isOpen: controlledIsOpen, onClose }: CustomerFormModalProps) {
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const isOpen = mode === "add" ? internalIsOpen : controlledIsOpen ?? false;

    const [formData, setFormData] = useState({
        id: "",
        firstName: "",
        lastName: "",
        nin: "",
        phoneNumber: "",
        email: "",
        state: "",
        city: "",
        houseNo: "",
        streetName: "",
        meterNumber: "" as string | null,
        vat: "Not Paying",
    });

    const { data: states, isLoading: isLoadingStates, isError: isErrorStates } = useNigerianStates();
    const {
        data: cities,
        isLoading: isLoadingCities,
        isError: isErrorCities,
    } = useNigerianCities(formData.state);

    useEffect(() => {
        if (isOpen && mode === "edit" && customer && states) {
            const customerState = states.find(s => s.name === customer.state);
            setFormData({
                id: customer.id,
                firstName: customer.firstname,
                lastName: customer.lastname,
                nin: customer.nin,
                phoneNumber: customer.phoneNumber,
                email: customer.email,
                state: customerState?.id ?? "",
                city: "",
                houseNo: customer.houseNo,
                streetName: customer.streetName,
                meterNumber: customer.meterNumber,
                vat: customer.vat,
            });
        } else if (isOpen && mode === "add") {
            setFormData({
                id: "",
                firstName: "",
                lastName: "",
                nin: "",
                phoneNumber: "",
                email: "",
                state: "",
                city: "",
                houseNo: "",
                streetName: "",
                meterNumber: null,
                vat: "Not Paying",
            });
        }
    }, [isOpen, mode, customer, states]);

    useEffect(() => {
        if (mode === "edit" && customer && cities && formData.state) {
            const customerCity = cities.find(c => c.name === customer.city);
            if (customerCity) {
                setFormData(prev => ({
                    ...prev,
                    city: customerCity.id,
                }));
            }
        }
    }, [mode, customer, cities, formData.state]);

    const cleanUpOverlay = useCallback(() => {
        const overlays = document.querySelectorAll("[data-radix-dialog-overlay]");
        if (overlays.length > 0) {
            overlays.forEach((overlay) => overlay.remove());
        }
    }, []);

    const handleOpenChange = useCallback((open: boolean) => {
        if (mode === "add") {
            setInternalIsOpen(open);
        }
        if (!open) {
            setFormData({
                id: "",
                firstName: "",
                lastName: "",
                nin: "",
                phoneNumber: "",
                email: "",
                state: "",
                city: "",
                houseNo: "",
                streetName: "",
                meterNumber: null,
                vat: "Not Paying",
            });
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

    const handleVatChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            vat: checked ? "Paying" : "Not Paying",
        }));
    }, []);

    const addCustomerMutation = useAddCustomer();
    const updateCustomerMutation = useUpdateCustomer();

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            const commonPayload = {
                firstname: formData.firstName,
                lastname: formData.lastName,
                nin: formData.nin,
                phoneNumber: formData.phoneNumber,
                email: formData.email,
                state: states?.find((s) => s.id === formData.state)?.name ?? "",
                city: cities?.find((c) => c.id === formData.city)?.name ?? "",
                houseNo: formData.houseNo,
                streetName: formData.streetName,
                vat: formData.vat,
            };

            if (mode === "add") {
                const payload: AddCustomerPayload = {
                    ...commonPayload,
                };
                addCustomerMutation.mutate(payload, {
                    onSuccess: () => {
                        toast.success("Customer added successfully!");
                        onSave();
                        handleOpenChange(false);
                    },
                    onError: (error) => {
                        toast.error(`Error adding customer: ${error.message}`);
                    },
                });
            } else {
                const payload: UpdateCustomerPayload = {
                    ...commonPayload,
                    id: formData.id,
                };

                updateCustomerMutation.mutate(payload, {
                    onSuccess: () => {
                        toast.success("Customer updated successfully!");
                        onSave();
                        handleOpenChange(false);
                    },
                    onError: (error) => {
                        toast.error(`Error updating customer: ${error.message}`);
                    },
                });
            }
        },
        [mode, formData, states, cities, addCustomerMutation, onSave, handleOpenChange, updateCustomerMutation]
    );

    if (mode === "edit" && !customer) {
        return null;
    }

    const isPending = addCustomerMutation.isPending || updateCustomerMutation.isPending;

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
                            <Label htmlFor="nin">NIN</Label>
                            <Input
                                id="nin"
                                name="nin"
                                value={formData.nin}
                                onChange={handleChange}
                                placeholder="Enter NIN"
                                className="border-[rgba(228,231,236,1)]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
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
                                onValueChange={(value) => {
                                    setFormData(prev => ({ ...prev, state: value, city: "" }));
                                }}
                            >
                                <SelectTrigger className="border-[rgba(228,231,236,1)] w-full">
                                    <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                                <SelectContent>
                                    {isLoadingStates ? (
                                        <SelectItem value="loading" disabled>Loading states...</SelectItem>
                                    ) : isErrorStates ? (
                                        <SelectItem value="error-states" disabled>Error loading states</SelectItem>
                                    ) : states?.length === 0 ? (
                                        <SelectItem value="no-states-found" disabled>No states found</SelectItem>
                                    ) : (
                                        states?.map((state) => (
                                            <SelectItem key={state.id} value={state.id}>
                                                {state.name}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 w-full">
                            <Label htmlFor="city">City<span className="text-red-600">*</span></Label>
                            <Select
                                value={formData.city}
                                onValueChange={(value) => handleChange(value, "city")}
                                disabled={!formData.state || isLoadingCities}
                                required
                            >
                                <SelectTrigger id="city" className="w-full">
                                    <SelectValue
                                        placeholder={
                                            isLoadingCities
                                                ? "Loading cities..."
                                                : formData.state
                                                    ? "Select City"
                                                    : "Select a state first"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {isLoadingCities ? (
                                        <SelectItem value="loading" disabled>Loading cities...</SelectItem>
                                    ) : isErrorCities ? (
                                        <SelectItem value="error-cities" disabled>Error loading cities</SelectItem>
                                    ) : cities?.length === 0 && formData.state ? (
                                        <SelectItem value="no-cities-found" disabled>No cities found for this state</SelectItem>
                                    ) : (
                                        cities?.map((city) => (
                                            <SelectItem key={city.id} value={city.id}>
                                                {city.name}
                                            </SelectItem>
                                        ))
                                    )}
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
                                {formData.vat === "Paying" ? "Paying" : "Not Paying"}
                            </Label>
                            <input
                                type="checkbox"
                                checked={formData.vat === "Paying"}
                                onChange={handleVatChange}
                                className="cursor-pointer accent-green-500"
                            />
                        </div>
                    </div>

                    <div className="mt-12 flex justify-between gap-3">
                        <Button
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            type="button"
                            size={"lg"}
                            className="border-[#161CCA] text-[#161CCA] cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            size={"lg"}
                            className="bg-[#161CCA] text-white cursor-pointer"
                            disabled={isPending}
                        >
                            {isPending ? "Saving..." : (mode === "add" ? "Add Customer" : "Save Changes")}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
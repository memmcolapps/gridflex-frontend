import { useState, useEffect, useCallback } from 'react';
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
import { Badge } from '../ui/badge';

export type Customer = {
    id?: string;
    customerId?: string;
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
    status?: 'Assigned' | 'Unassigned';
};

type CustomerFormModalProps = {
    mode: 'add' | 'edit';
    customer?: Customer;
    onSave: (customer: Customer) => void;
    triggerButton?: React.ReactNode;
    isOpen?: boolean;
    onClose?: () => void;
};

const states = [
    { value: 'Lagos', label: 'Lagos' },
    // Add more states as needed
];

const cities = [
    { value: 'Lagos', label: 'Lagos' },
    // Add more cities as needed
];

export default function CustomerForm({ mode, customer, onSave, triggerButton, isOpen: controlledIsOpen, onClose }: CustomerFormModalProps) {
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const isOpen = mode === 'add' ? internalIsOpen : controlledIsOpen ?? false;

    const [formData, setFormData] = useState<Customer>({
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
        status: 'Unassigned',
    });

    const cleanUpOverlay = useCallback(() => {
        const overlays = document.querySelectorAll('[data-radix-dialog-overlay]');
        if (overlays.length > 0) {
            overlays.forEach((overlay) => overlay.remove());
        }
    }, []);

    useEffect(() => {
        if (isOpen && customer && mode === 'edit') {
            setFormData(customer);
        } else if (!isOpen) {
            setFormData({
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
                status: 'Unassigned',
            });
        }
    }, [customer, isOpen, mode]);

    const handleOpenChange = useCallback((open: boolean) => {
        if (mode === 'add') {
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

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            onSave(formData);
            if (mode === 'add') {
                setInternalIsOpen(false);
            }
            cleanUpOverlay();
            if (onClose) {
                onClose();
            }
        },
        [formData, onSave, mode, onClose, cleanUpOverlay]
    );

    if (mode === 'edit' && !customer) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            {mode === 'add' && (
                <DialogTrigger asChild className='cursor-pointer'>
                    {triggerButton}
                </DialogTrigger>
            )}

            <DialogContent className="sm:max-w-[430px] bg-white text-black h-fit rounded-2xl">
                <DialogHeader className='mt-6'>
                    <DialogTitle>
                        {mode === 'add' ? 'Add Customer' : 'Edit Customer'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="mt-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name <span className='text-red-600'>*</span></Label>
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
                            <Label htmlFor="lastName">Last Name<span className='text-red-600'>*</span></Label>
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
                            <Label htmlFor="phoneNumber">Phone Number<span className='text-red-600'>*</span></Label>
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
                            <Label htmlFor="nin">NIN<span className='text-red-600'>*</span></Label>
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
                            <Label htmlFor="email">Email <span className='text-red-600'>*</span></Label>
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
                            <Label htmlFor="state">State<span className='text-red-600'>*</span></Label>
                            <Select
                                value={formData.state}
                                onValueChange={(value) => handleChange(value, 'state')}
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
                            <Label htmlFor="city">City<span className='text-red-600'>*</span></Label>
                            <Select
                                value={formData.city}
                                onValueChange={(value) => handleChange(value, 'city')}
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
                            <Label htmlFor="streetName">Street Name<span className='text-red-600'>*</span></Label>
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
                            <Label htmlFor="houseNo">House No.<span className='text-red-600'>*</span></Label>
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

                    {formData.status === 'Assigned' && (
                        <div className="mt-6 space-y-2">
                            <Label>
                                Assigned Meter ({formData.meterNumber ? formData.meterNumber.split(',').length : 0})
                            </Label>                            
                            <div className="flex flex-wrap gap-4 mt-2">
                                {formData.meterNumber?.split(',').map((meter, index) => (
                                    <Badge
                                        key={index}
                                        variant="outline"
                                        className="px-3 py-1 text-sm font-normal"
                                    >
                                        {meter.trim()}
                                    </Badge>

                                ))}
                            </div>
                        </div>
                    )}
                    <div className="mt-12 flex justify-between gap-3">
                        <Button
                            variant="outline"
                            onClick={() => {
                                if (mode === 'add') {
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
                            {mode === 'add' ? 'Add Customer' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog >
    );
}
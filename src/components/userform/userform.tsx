import { Plus } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type User = {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    groupPermission?: string;
    lastActive: Date;
    hierarchy?: string;
    dateAdded?: Date;
    defaultPassword?: string;
    updatedUser?: () => void;
};

type UserFormModalProps = {
    mode: 'add' | 'edit';
    user?: User;
    onSave: (user: User) => void;
    triggerButton?: React.ReactNode;
    isOpen?: boolean;
    onClose?: () => void;
};

const groupPermissions = [
    { value: 'admin', label: 'Administrator' },
    { value: 'manager', label: 'Manager' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Viewer' },
];

const hierarchies = [
    { value: 'level1', label: 'Level 1' },
    { value: 'level2', label: 'Level 2' },
    { value: 'level3', label: 'Level 3' },
    { value: 'level4', label: 'Level 4' },
];

export default function UserForm({ mode, user, onSave, triggerButton, isOpen: controlledIsOpen, onClose }: UserFormModalProps) {
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const isOpen = mode === 'add' ? internalIsOpen : controlledIsOpen ?? false;

    const [formData, setFormData] = useState<User>({
        firstName: "",
        lastName: "",
        email: "",
        groupPermission: "",
        lastActive: new Date(),
        hierarchy: "",
        defaultPassword: ""
    });

    // Function to reload the page
    const reloadPage = useCallback(() => {
        console.log('Reloading page after edit dialog close');
        if (typeof window !== 'undefined') {
            window.location.reload();
        }
    }, []);

    // Clean up overlay
    const cleanUpOverlay = useCallback(() => {
        console.log('Attempting overlay cleanup');
        const overlays = document.querySelectorAll('[data-radix-dialog-overlay]');
        console.log('Overlay count:', overlays.length);
        if (overlays.length > 0) {
            overlays.forEach((overlay) => {
                console.warn('Removing overlay:', {
                    id: overlay.id,
                    className: overlay.className,
                    attributes: Array.from(overlay.attributes).map(attr => `${attr.name}=${attr.value}`)
                });
                overlay.remove();
            });
        } else {
            console.log('No overlays found');
        }
    }, []);

    // Log state changes and clean up overlay
    useEffect(() => {
        console.log('Dialog isOpen:', isOpen);
        if (!isOpen) {
            setTimeout(cleanUpOverlay, 100); // Delay for Radix UI animations
        }
    }, [isOpen, cleanUpOverlay]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            console.log('UserForm unmounting, cleaning up overlay');
            cleanUpOverlay();
        };
    }, [cleanUpOverlay]);

    // Initialize form data
    useEffect(() => {
        if (isOpen && user && mode === 'edit') {
            console.log('Setting formData with user:', user);
            setFormData(user);
        } else if (!isOpen) {
            console.log('Resetting formData');
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                groupPermission: "",
                lastActive: new Date(),
                hierarchy: "",
                defaultPassword: ""
            });
        }
    }, [user, isOpen, mode]);

    // Handle dialog open/close
    const handleOpenChange = useCallback((open: boolean) => {
        console.log('Dialog open change:', open);
        if (mode === 'add') {
            setInternalIsOpen(open);
        }
        if (!open) {
            cleanUpOverlay(); // Force cleanup on close
            if (onClose) {
                onClose();
            }
            if (mode === 'edit') {
                reloadPage(); // Reload only for edit mode
            }
        }
    }, [mode, onClose, cleanUpOverlay, reloadPage]);

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
            console.log('Submitting form with data:', formData);
            onSave(formData);
            if (mode === 'add') {
                setInternalIsOpen(false);
            }
            cleanUpOverlay(); // Force cleanup on submit
            if (onClose) {
                onClose();
            }
            if (mode === 'edit') {
                reloadPage(); // Reload only for edit mode
            }
        },
        [formData, onSave, mode, onClose, cleanUpOverlay, reloadPage]
    );

    // Guard against invalid user prop in edit mode
    if (mode === 'edit' && !user) {
        console.error('User prop is required in edit mode');
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            {mode === 'add' && (
                <DialogTrigger asChild>
                    {triggerButton ?? (
                        <Button className="flex items-center gap-2 text-black" variant="default">
                            <Plus className="h-4 w-4" />
                            Add User
                        </Button>
                    )}
                </DialogTrigger>
            )}

            <DialogContent className="sm:max-w-[500px] bg-white text-black">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'add' ? 'Add User' : `Edit ${user?.firstName} ${user?.lastName}`}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'add'
                            ? 'Fill out the form to add a new user.'
                            : 'Edit the user details below.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
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
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                placeholder="Enter last name"
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
                                required
                                placeholder="Enter email"
                                className="border-[rgba(228,231,236,1)]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="groupPermission">Group Permission</Label>
                            <Select
                                value={formData.groupPermission}
                                onValueChange={(value) => handleChange(value, 'groupPermission')}
                                required
                            >
                                <SelectTrigger className="border-[rgba(228,231,236,1)] w-72">
                                    <SelectValue placeholder="Select permission"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {groupPermissions.map((permission) => (
                                        <SelectItem key={permission.value} value={permission.value}>
                                            {permission.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="hierarchy">Hierarchy</Label>
                            <Select
                                value={formData.hierarchy}
                                onValueChange={(value) => handleChange(value, 'hierarchy')}
                            >
                                <SelectTrigger className="border-[rgba(228,231,236,1)] w-full">
                                    <SelectValue placeholder="Select hierarchy" />
                                </SelectTrigger>
                                <SelectContent>
                                    {hierarchies.map((level) => (
                                        <SelectItem key={level.value} value={level.value}>
                                            {level.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="defaultPassword">Default Password</Label>
                            <Input
                                id="defaultPassword"
                                name="defaultPassword"
                                type="password"
                                value={formData.defaultPassword}
                                onChange={handleChange}
                                required
                                placeholder="Enter default password"
                                className="border-[rgba(228,231,236,1)] w-full"
                            />
                        </div>
                    </div>
                    <div className="mt-12 flex justify-between gap-3">
                        <Button
                            variant="outline"
                            onClick={() => {
                                console.log('Cancel clicked');
                                if (mode === 'add') {
                                    setInternalIsOpen(false);
                                }
                                cleanUpOverlay(); // Force cleanup on cancel
                                if (onClose) {
                                    onClose();
                                }
                                if (mode === 'edit') {
                                    reloadPage(); // Reload only for edit mode
                                }
                            }}
                            type="button"
                            className="border-[#161CCA] text-[#161CCA]"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-[#161CCA] text-white">
                            {mode === 'add' ? 'Add User' : 'Save'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
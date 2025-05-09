import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
};

type EditUserDialogProps = {
    user: User;
    onSave: (user: User) => void;
    isOpen: boolean;
    onClose: () => void;
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

export default function EditUserDialog({ user, onSave, isOpen, onClose }: EditUserDialogProps) {
    const [formData, setFormData] = useState<User>(user);

    const cleanUpOverlay = useCallback(() => {
        console.log('Attempting overlay cleanup in EditUserDialog');
        const overlays = document.querySelectorAll('[data-radix-dialog-overlay]');
        if (overlays.length > 0) {
            overlays.forEach((overlay) => {
                console.warn('Removing overlay:', overlay);
                overlay.remove();
            });
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            console.log('Setting formData with user:', user);
            setFormData(user);
        }
        if (!isOpen) {
            setTimeout(cleanUpOverlay, 100);
        }
    }, [isOpen, user, cleanUpOverlay]);

    useEffect(() => {
        return () => {
            console.log('EditUserDialog unmounting, cleaning up overlay');
            cleanUpOverlay();
        };
    }, [cleanUpOverlay]);

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
            console.log('Submitting EditUserDialog with data:', formData);
            onSave(formData);
            cleanUpOverlay();
            onClose();
        },
        [formData, onSave, onClose, cleanUpOverlay]
    );

    if (!user) {
        console.error('User prop is required in EditUserDialog');
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-white text-black h-fit">
                <DialogHeader>
                    <DialogTitle>Edit {user.firstName} {user.lastName}</DialogTitle>
                    <DialogDescription>Edit the user details below.</DialogDescription>
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
                                    <SelectValue placeholder="Select permission" />
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
                                placeholder="Enter new password (optional)"
                                className="border-[rgba(228,231,236,1)] w-full"
                            />
                        </div>
                    </div>
                    <div className="mt-12 flex justify-between gap-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            type="button"
                            className="border-[#161CCA] text-[#161CCA]"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-[#161CCA] text-white">
                            Save
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
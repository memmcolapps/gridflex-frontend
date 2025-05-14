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
};

type AddUserFormProps = {
    onSave: (user: User) => void;
    triggerButton?: React.ReactNode;
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

export default function AddUserForm({ onSave, triggerButton }: AddUserFormProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState<User>({
        firstName: "",
        lastName: "",
        email: "",
        groupPermission: "",
        lastActive: new Date(),
        hierarchy: "",
        defaultPassword: ""
    });

    const cleanUpOverlay = useCallback(() => {
        console.log('Attempting overlay cleanup in AddUserForm');
        const overlays = document.querySelectorAll('[data-radix-dialog-overlay]');
        if (overlays.length > 0) {
            overlays.forEach((overlay) => {
                console.warn('Removing overlay:', overlay);
                overlay.remove();
            });
        }
    }, []);

    useEffect(() => {
        if (!isOpen) {
            setTimeout(cleanUpOverlay, 100);
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
    }, [isOpen, cleanUpOverlay]);

    useEffect(() => {
        return () => {
            console.log('AddUserForm unmounting, cleaning up overlay');
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
            console.log('Submitting AddUserForm with data:', formData);
            onSave(formData);
            setIsOpen(false);
            cleanUpOverlay();
        },
        [formData, onSave, cleanUpOverlay]
    );

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {triggerButton ?? (
                    <Button className="flex items-center gap-2 text-black" variant="default">
                        <Plus className="h-4 w-4" />
                        Add User
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px] bg-white text-black h-fit">
                <DialogHeader>
                    <DialogTitle>Add User</DialogTitle>
                    <DialogDescription>Fill out the form to add a new user.</DialogDescription>
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
                                <SelectTrigger className="border-[rgba(228,231,236,1)] w-56">
                                    <SelectValue placeholder="Select permission" className='text-black-600' />
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
                            onClick={() => setIsOpen(false)}
                            type="button"
                            className="border-[#161CCA] text-[#161CCA]"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-[#161CCA] text-white">
                            Add User
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
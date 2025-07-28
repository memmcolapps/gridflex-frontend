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
    unitName?: string;
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


const unitNames = [
  { value: "unit1", label: "Unit 1" },
  { value: "unit2", label: "Unit 2" },
  { value: "unit3", label: "Unit 3" },
  { value: "unit4", label: "Unit 4" },
];

const hierarchies = [
  { value: "region", label: "Region" },
  { value: "business-hub", label: "Business Hub" },
  { value: "service-centre", label: "Service Centre" },
  { value: "substation", label: "Substation" },
  { value: "feeder-line", label: "Feeder Line" },
  { value: "distribution-substation", label: "Distribution Substation (DSS)" },
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
        <DialogContent className="h-fit bg-white text-black sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Edit {user.firstName} {user.lastName}
            </DialogTitle>
            <DialogDescription>Edit the user details below.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name <span className="text-red-500">*</span>
                </Label>
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
                <Label htmlFor="lastName">
                  Last Name <span className="text-red-500">*</span>
                </Label>
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
              <div className="space-y-2 col-span-2">
                <Label htmlFor="groupPermission">
                  Group Permission <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.groupPermission}
                  onValueChange={(value) =>
                    handleChange(value, "groupPermission")
                  }
                  required
                >
                  <SelectTrigger className="w-full border-[rgba(228,231,236,1)]">
                    <SelectValue placeholder="Select permission" />
                  </SelectTrigger>
                  <SelectContent>
                    {groupPermissions.map((permission) => (
                      <SelectItem
                        key={permission.value}
                        value={permission.value}
                      >
                        {permission.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hierarchy">
                  Organizational Hierarchy{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.hierarchy}
                  onValueChange={(value) => handleChange(value, "hierarchy")}
                >
                  <SelectTrigger className="w-full border-[rgba(228,231,236,1)]">
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
              <div className="space-y-2">
                <Label htmlFor="unitName">
                  Unit Name <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.unitName}
                  onValueChange={(value) => handleChange(value, "unitName")}
                  required
                >
                  <SelectTrigger className="w-full border-[rgba(228,231,236,1)]">
                    <SelectValue placeholder="Select unit name" />
                  </SelectTrigger>
                  <SelectContent>
                    {unitNames.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-12 flex justify-between gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                type="button"
                className="cursor-pointer border-[#161CCA] text-[#161CCA]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="cursor-pointer bg-[#161CCA] text-white"
              >
                Save
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
}
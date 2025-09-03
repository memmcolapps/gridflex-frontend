import { Plus } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGroupPermissions } from "@/hooks/use-groups";

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

type AddUserFormProps = {
  onSave: (user: User) => void;
  triggerButton?: React.ReactNode;
};

const hierarchies = [
  { value: "region", label: "Region" },
  { value: "business-hub", label: "Business Hub" },
  { value: "service-centre", label: "Service Centre" },
  { value: "substation", label: "Substation" },
  { value: "feeder-line", label: "Feeder Line" },
  { value: "distribution-substation", label: "Distribution Substation (DSS)" },
];

const unitNames = [
  { value: "unit1", label: "Unit 1" },
  { value: "unit2", label: "Unit 2" },
  { value: "unit3", label: "Unit 3" },
  { value: "unit4", label: "Unit 4" },
];

export default function AddUserForm({
  onSave,
  triggerButton,
}: AddUserFormProps) {
  const { data: groupPermissions, isLoading: isLoadingGroupPermissions } =
    useGroupPermissions();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<User>({
    firstName: "",
    lastName: "",
    email: "",
    groupPermission: "",
    lastActive: new Date(),
    hierarchy: "",
    unitName: "",
    defaultPassword: "",
  });

  const cleanUpOverlay = useCallback(() => {
    console.log("Attempting overlay cleanup in AddUserForm");
    const overlays = document.querySelectorAll("[data-radix-dialog-overlay]");
    if (overlays.length > 0) {
      overlays.forEach((overlay) => {
        console.warn("Removing overlay:", overlay);
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
        unitName: "",
        defaultPassword: "",
      });
    }
  }, [isOpen, cleanUpOverlay]);

  useEffect(() => {
    return () => {
      console.log("AddUserForm unmounting, cleaning up overlay");
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
    [],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Submitting AddUserForm with data:", formData);
      onSave(formData);
      setIsOpen(false);
      cleanUpOverlay();
    },
    [formData, onSave, cleanUpOverlay],
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton ?? (
          <Button
            className="flex items-center gap-2 text-black"
            variant="default"
          >
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="h-fit bg-white text-black sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>
            Fill out the form to add a new user.
          </DialogDescription>
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
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter email address"
                className="border-[rgba(228,231,236,1)]"
              />
            </div>
            <div className="space-y-2">
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
                  <SelectValue
                    placeholder="Select group permission"
                    className="text-black-600"
                  />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingGroupPermissions ? (
                    <SelectItem value="loading" disabled>
                      Loading group permissions...
                    </SelectItem>
                  ) : (
                    groupPermissions.map((permission) => (
                      <SelectItem key={permission.id} value={permission.id}>
                        {permission.groupTitle}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hierarchy">
                Organizational Hierarchy <span className="text-red-500">*</span>
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
            <div className="col-span-2 space-y-2">
              <Label htmlFor="defaultPassword">
                Default Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="defaultPassword"
                name="defaultPassword"
                type="password"
                value={formData.defaultPassword}
                onChange={handleChange}
                required
                placeholder="Enter default password"
                className="w-full border-[rgba(228,231,236,1)]"
              />
            </div>
          </div>
          <div className="mt-12 flex justify-between gap-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              type="button"
              className="cursor-pointer border-[#161CCA] text-[#161CCA]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="cursor-pointer bg-[#161CCA] text-white"
            >
              Add User
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

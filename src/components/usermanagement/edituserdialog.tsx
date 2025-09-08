import { useState, useEffect, useCallback } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type GetUsersUser } from "@/types/users-groups";
import { useGroupPermissions } from "@/hooks/use-groups";
import { useOrg } from "@/hooks/use-org";
import {
  getHierarchyOptions,
  getUnitsForHierarchy,
  flattenOrganizationNodes,
  type HierarchyType,
  matchNodeTypeToHierarchy,
} from "@/utils/hierarchy-utils";

type EditUserDialogProps = {
  user: GetUsersUser;
  onSave: (user: GetUsersUser) => void;
  isOpen: boolean;
  onClose: () => void;
};

export default function EditUserDialog({
  user,
  onSave,
  isOpen,
  onClose,
}: EditUserDialogProps) {
  const { data: groupPermissions, isLoading: isLoadingGroupPermissions } =
    useGroupPermissions();
  const { nodes: orgData, isLoading: isLoadingOrg } = useOrg();

  const [formData, setFormData] = useState<GetUsersUser>(user);

  // Get hierarchy options using the utility
  const hierarchyOptions = getHierarchyOptions();

  // Flatten all organization nodes for unit lookup
  const flattenedNodes = flattenOrganizationNodes(orgData);

  // Get current hierarchy type from user's node info
  const currentHierarchyType = user.nodes?.nodeInfo?.type
    ? matchNodeTypeToHierarchy(user.nodes.nodeInfo.type)
    : null;

  // Get units for selected hierarchy type
  const availableUnits = currentHierarchyType
    ? getUnitsForHierarchy(flattenedNodes, currentHierarchyType)
    : [];

  const cleanUpOverlay = useCallback(() => {
    console.log("Attempting overlay cleanup in EditUserDialog");
    const overlays = document.querySelectorAll("[data-radix-dialog-overlay]");
    if (overlays.length > 0) {
      overlays.forEach((overlay) => {
        console.warn("Removing overlay:", overlay);
        overlay.remove();
      });
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      console.log("Setting formData with user:", user);
      setFormData(user);
    }
    if (!isOpen) {
      setTimeout(cleanUpOverlay, 100);
    }
  }, [isOpen, user, cleanUpOverlay]);

  useEffect(() => {
    return () => {
      console.log("EditUserDialog unmounting, cleaning up overlay");
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
      console.log("Submitting EditUserDialog with data:", formData);
      onSave(formData);
      cleanUpOverlay();
      onClose();
    },
    [formData, onSave, onClose, cleanUpOverlay],
  );

  if (!user) {
    console.error("User prop is required in EditUserDialog");
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-fit bg-white text-black sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Edit {user.firstname} {user.lastname}
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
                value={formData.firstname}
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
                value={formData.lastname}
                onChange={handleChange}
                required
                placeholder="Enter last name"
                className="border-[rgba(228,231,236,1)]"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="groupPermission">
                Group Permission <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.groups.groupTitle}
                onValueChange={(value) =>
                  handleChange(value, "groupPermission")
                }
                required
              >
                <SelectTrigger className="w-full border-[rgba(228,231,236,1)]">
                  <SelectValue placeholder="Select permission" />
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
                value={currentHierarchyType ?? ""}
                onValueChange={(value) => handleChange(value, "hierarchy")}
              >
                <SelectTrigger className="w-full border-[rgba(228,231,236,1)]">
                  <SelectValue placeholder="Select hierarchy" />
                </SelectTrigger>
                <SelectContent>
                  {hierarchyOptions.map((level) => (
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
                value={formData.nodes.name}
                onValueChange={(value) => handleChange(value, "unitName")}
                required
              >
                <SelectTrigger className="w-full border-[rgba(228,231,236,1)]">
                  <SelectValue placeholder="Select unit name" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingOrg ? (
                    <SelectItem value="loading" disabled>
                      Loading units...
                    </SelectItem>
                  ) : availableUnits.length === 0 ? (
                    <SelectItem value="no-units" disabled>
                      No units available for this hierarchy
                    </SelectItem>
                  ) : (
                    availableUnits.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))
                  )}
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

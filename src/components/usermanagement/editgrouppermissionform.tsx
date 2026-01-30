import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { useUpdateGroupPermission } from "@/hooks/use-groups";

interface GroupPermission {
  id: string;
  groupTitle: string;
  permissions: {
    id: string;
    view: boolean;
    edit: boolean;
    approve: boolean;
    disable: boolean;
  };
  modules: Array<{
    id: string;
    name: string;
    access: boolean;
    subModules: Array<{ id: string; name: string; access: boolean }>;
  }>;
}

interface EditGroupPermissionFormData {
  groupTitle: string;
  accessLevel: string[];
}

interface EditGroupPermissionFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  groupPermission: GroupPermission | null;
  onSave: (
    data: EditGroupPermissionFormData & {
      id: string;
      modules: GroupPermission["modules"];
    },
  ) => void;
}

export default function EditGroupPermissionForm({
  isOpen,
  onOpenChange,
  groupPermission,
  onSave,
}: EditGroupPermissionFormProps) {
  const updateGroupPermission = useUpdateGroupPermission();
  const [groupTitle, setGroupTitle] = useState("");
  const [selectedAccessLevels, setSelectedAccessLevels] = useState<string[]>(
    [],
  );
  const [isAccessDropdownOpen, setIsAccessDropdownOpen] = useState(false);
  const [errors, setErrors] = useState<{
    groupTitle?: string;
    accessLevel?: string;
  }>({});

  const accessLevelOptions = [
    { value: "view-only", label: "View only" },
    { value: "edit-only", label: "Edit only" },
    { value: "approve-only", label: "Approve only" },
    { value: "disable-only", label: "Disable only" },
  ];

  // Convert permissions back to access level array
  const convertPermissionsToAccessLevel = (
    permissions: GroupPermission["permissions"],
  ): string[] => {
    const accessLevels: string[] = [];
    if (permissions.view) accessLevels.push("view-only");
    if (permissions.edit) accessLevels.push("edit-only");
    if (permissions.approve) accessLevels.push("approve-only");
    if (permissions.disable) accessLevels.push("disable-only");
    return accessLevels;
  };

  // Populate form when groupPermission changes
  useEffect(() => {
    if (groupPermission && isOpen) {
      setGroupTitle(groupPermission.groupTitle);
      setSelectedAccessLevels(
        convertPermissionsToAccessLevel(groupPermission.permissions),
      );
      setErrors({});
    }
  }, [groupPermission, isOpen]);

  const handleAccessLevelSelection = (value: string) => {
    if (selectedAccessLevels.includes(value)) {
      setSelectedAccessLevels(
        selectedAccessLevels.filter((item) => item !== value),
      );
    } else {
      setSelectedAccessLevels([...selectedAccessLevels, value]);
    }

    if (errors.accessLevel) {
      setErrors((prev) => ({ ...prev, accessLevel: undefined }));
    }
  };

  const resetForm = () => {
    setGroupTitle("");
    setSelectedAccessLevels([]);
    setIsAccessDropdownOpen(false);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!groupTitle.trim()) {
      newErrors.groupTitle = "Group title is required";
    }
    if (selectedAccessLevels.length === 0) {
      newErrors.accessLevel = "At least one access level is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm() || !groupPermission) {
      return;
    }

    const payload = {
      id: groupPermission.id,
      groupTitle,
      modules: groupPermission.modules,
      permission: {
        id: groupPermission.permissions.id,
        view: selectedAccessLevels.includes("view-only"),
        edit: selectedAccessLevels.includes("edit-only"),
        approve: selectedAccessLevels.includes("approve-only"),
        disable: selectedAccessLevels.includes("disable-only"),
      },
    };

    // Use the mutation hook to update group permission
    updateGroupPermission.mutate(
      { groupId: groupPermission.id, payload },
      {
        onSuccess: () => {
          onOpenChange(false);
          resetForm();
          if (onSave) {
            onSave({
              id: groupPermission.id,
              groupTitle,
              accessLevel: selectedAccessLevels,
              modules: groupPermission.modules,
            });
          }
        },
        onError: (error) => {
          console.error("Failed to update group permission:", error);
        },
      },
    );
  };

  const handleCancel = () => {
    onOpenChange(false);
    resetForm();
  };

  const getSelectedAccessLevelsDisplay = () => {
    if (selectedAccessLevels.length === 0) return "Select access level";
    if (selectedAccessLevels.length === 1) {
      const option = accessLevelOptions.find(
        (opt) => opt.value === selectedAccessLevels[0],
      );
      return option?.label ?? selectedAccessLevels[0];
    }
    return `${selectedAccessLevels.length} levels selected`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="h-fit bg-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Group Permission</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-4">
            {/* Group Title */}
            <div className="grid gap-2">
              <Label htmlFor="groupTitle">Group Title</Label>
              <Input
                id="groupTitle"
                value={groupTitle}
                onChange={(e) => setGroupTitle(e.target.value)}
                placeholder="Enter group title"
                className={`w-[390px] border-gray-300 ${errors.groupTitle ? "border-red-500" : ""}`}
                style={{
                  borderColor: errors.groupTitle ? undefined : "#d1d5db",
                }}
              />
              {errors.groupTitle && (
                <p className="text-sm text-red-500">{errors.groupTitle}</p>
              )}
            </div>

            {/* Access Level */}
            <div className="grid gap-2">
              <Label htmlFor="accessLevel">Access Level</Label>
              <div className="relative">
                <div
                  className={`flex w-[390px] cursor-pointer items-center justify-between rounded-md border border-gray-300 px-3 py-2 ${errors.accessLevel ? "border-red-500" : ""}`}
                  onClick={() => setIsAccessDropdownOpen(!isAccessDropdownOpen)}
                >
                  <span
                    className={
                      selectedAccessLevels.length === 0 ? "text-gray-500" : ""
                    }
                  >
                    {getSelectedAccessLevelsDisplay()}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${isAccessDropdownOpen ? "rotate-180" : ""}`}
                  />
                </div>

                {isAccessDropdownOpen && (
                  <div className="absolute top-full right-0 left-0 z-50 mt-1 rounded-md border border-gray-300 bg-white shadow-lg">
                    {accessLevelOptions.map((option) => (
                      <div
                        key={option.value}
                        className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-100"
                        onClick={() => handleAccessLevelSelection(option.value)}
                      >
                        <span>{option.label}</span>
                        <Checkbox
                          checked={selectedAccessLevels.includes(option.value)}
                          className="border-gray-200 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.accessLevel && (
                <p className="text-sm text-red-500">{errors.accessLevel}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-8 flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="cursor-pointer border-[#161CCA] text-[#161CCA]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              className="cursor-pointer bg-[#161CCA] text-white"
              disabled={updateGroupPermission.isPending}
            >
              {updateGroupPermission.isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

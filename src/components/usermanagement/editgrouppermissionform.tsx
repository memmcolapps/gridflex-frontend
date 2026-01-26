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
import { ChevronDown, ChevronRight } from "lucide-react";

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
  moduleAccess: string[];
  accessLevel: string[];
}

interface EditGroupPermissionFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  groupPermission: GroupPermission | null;
  onSave: (data: EditGroupPermissionFormData & { id: string }) => void;
}

export default function EditGroupPermissionForm({
  isOpen,
  onOpenChange,
  groupPermission,
  onSave,
}: EditGroupPermissionFormProps) {
  const [groupTitle, setGroupTitle] = useState("");
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [selectedAccessLevels, setSelectedAccessLevels] = useState<string[]>(
    [],
  );
  const [isModuleDropdownOpen, setIsModuleDropdownOpen] = useState(false);
  const [isAccessDropdownOpen, setIsAccessDropdownOpen] = useState(false);
  const [isDataManagementOpen, setIsDataManagementOpen] = useState(false);
  const [errors, setErrors] = useState<{
    groupTitle?: string;
    moduleAccess?: string;
    accessLevel?: string;
  }>({});

  const moduleAccessOptions = [
    {
      value: "organization",
      label: "Organization",
      group: "Data Management",
    },
    {
      value: "meter-management",
      label: "Meter Management",
      group: "Data Management",
    },
    {
      value: "customer-management",
      label: "Customer Management",
      group: "Data Management",
    },
    {
      value: "tarrif",
      label: "Tariff",
      group: "Data Management",
    },
    {
      value: "band-management",
      label: "Band Management",
      group: "Data Management",
    },
    {
      value: "reviewandapproval",
      label: "Review and Approval",
      group: "Data Management",
    },
    {
      value: "debt-management",
      label: "Debt Management",
      group: "Data Management",
    },
    { value: "billing", label: "Billing", group: null },
    { value: "vending", label: "Vending", group: null },
    { value: "hes", label: "HES", group: null },
    { value: "user-management", label: "User Management", group: null },
  ];

  const accessLevelOptions = [
    { value: "view-only", label: "View only" },
    { value: "edit-only", label: "Edit only" },
    { value: "approve-only", label: "Approve only" },
    { value: "disable-only", label: "Disable only" },
  ];

  // Utility function to convert modules back to module access array
  const convertModulesToModuleAccess = (
    modules: GroupPermission["modules"],
  ): string[] => {
    const moduleMap: Record<string, string> = {
      Organization: "organization",
      "Meter Management": "meter-management",
      "Customer Management": "customer-management",
      Tariff: "tarrif",
      "Band Management": "band-management",
      "Review and Approval": "reviewandapproval",
      "Debt Management": "debt-management",
      Billing: "billing",
      Vending: "vending",
      HES: "hes",
      "User Management": "user-management",
    };

    const accessArray: string[] = [];
    const foundDataManagementModules: string[] = [];

    modules.forEach((module) => {
      if (module.name === "Data Management" && module.subModules) {
        module.subModules.forEach((subModule) => {
          const moduleKey = moduleMap[subModule.name];
          if (moduleKey && subModule.access) {
            foundDataManagementModules.push(moduleKey);
            accessArray.push(moduleKey);
          }
        });
      } else {
        const moduleKey = moduleMap[module.name];
        if (moduleKey && module.access) {
          accessArray.push(moduleKey);
        }
      }
    });

    return accessArray;
  };

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
      setSelectedModules(convertModulesToModuleAccess(groupPermission.modules));
      setSelectedAccessLevels(
        convertPermissionsToAccessLevel(groupPermission.permissions),
      );
      setErrors({});
    }
  }, [groupPermission, isOpen]);

  const handleModuleSelection = (value: string) => {
    if (value === "all-access") {
      setSelectedModules(["all-access"]);
    } else {
      const newSelection = selectedModules.filter(
        (item) => item !== "all-access",
      );

      if (selectedModules.includes(value)) {
        setSelectedModules(newSelection.filter((item) => item !== value));
      } else {
        setSelectedModules([...newSelection, value]);
      }
    }

    if (errors.moduleAccess) {
      setErrors((prev) => ({ ...prev, moduleAccess: undefined }));
    }
  };

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
    setSelectedModules([]);
    setSelectedAccessLevels([]);
    setIsModuleDropdownOpen(false);
    setIsAccessDropdownOpen(false);
    setIsDataManagementOpen(false);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!groupTitle.trim()) {
      newErrors.groupTitle = "Group title is required";
    }
    if (selectedModules.length === 0) {
      newErrors.moduleAccess = "At least one module access is required";
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

    const formData: EditGroupPermissionFormData & { id: string } = {
      id: groupPermission.id,
      groupTitle,
      moduleAccess: selectedModules,
      accessLevel: selectedAccessLevels,
    };

    onSave(formData);
    onOpenChange(false);
    resetForm();
  };

  const handleCancel = () => {
    onOpenChange(false);
    resetForm();
  };

  const getSelectedModulesDisplay = () => {
    if (selectedModules.length === 0) return "Select module access";
    if (selectedModules.length === 1) {
      const option = moduleAccessOptions.find(
        (opt) => opt.value === selectedModules[0],
      );
      return option?.label ?? selectedModules[0];
    }
    return `${selectedModules.length} modules selected`;
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

            {/* Module Access */}
            <div className="grid gap-2">
              <Label htmlFor="moduleAccess">Module Access</Label>
              <div className="relative">
                <div
                  className={`flex w-[390px] cursor-pointer items-center justify-between rounded-md border border-gray-300 px-3 py-2 ${errors.moduleAccess ? "border-red-500" : ""}`}
                  onClick={() => setIsModuleDropdownOpen(!isModuleDropdownOpen)}
                >
                  <span
                    className={
                      selectedModules.length === 0 ? "text-gray-500" : ""
                    }
                  >
                    {getSelectedModulesDisplay()}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${isModuleDropdownOpen ? "rotate-180" : ""}`}
                  />
                </div>

                {isModuleDropdownOpen && (
                  <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-64 overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
                    {moduleAccessOptions
                      .filter((opt) => opt.value === "all-access")
                      .map((option) => (
                        <div
                          key={option.value}
                          className="flex cursor-pointer items-center justify-between border-0 px-3 py-2 hover:bg-gray-100"
                          onClick={() => handleModuleSelection(option.value)}
                        >
                          <span>{option.label}</span>
                          <Checkbox
                            checked={selectedModules.includes(option.value)}
                            className="border-gray-200 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
                          />
                        </div>
                      ))}

                    {/* Data Management */}
                    <div
                      className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-100"
                      onClick={() =>
                        setIsDataManagementOpen(!isDataManagementOpen)
                      }
                    >
                      <span className="font-medium">Data Management</span>
                      {isDataManagementOpen ? (
                        <ChevronDown size={12} />
                      ) : (
                        <ChevronRight size={12} />
                      )}
                    </div>

                    {isDataManagementOpen &&
                      moduleAccessOptions
                        .filter((opt) => opt.group === "Data Management")
                        .map((option) => (
                          <div
                            key={option.value}
                            className="flex cursor-pointer items-center justify-between border-0 px-3 py-2 pl-6 hover:bg-gray-100"
                            onClick={() => handleModuleSelection(option.value)}
                          >
                            <span>{option.label}</span>
                            <Checkbox
                              checked={selectedModules.includes(option.value)}
                              className="border-gray-200 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
                            />
                          </div>
                        ))}

                    {moduleAccessOptions
                      .filter((opt) => !opt.group && opt.value !== "all-access")
                      .map((option) => (
                        <div
                          key={option.value}
                          className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-100"
                          onClick={() => handleModuleSelection(option.value)}
                        >
                          <span>{option.label}</span>
                          <Checkbox
                            checked={selectedModules.includes(option.value)}
                            className="border-gray-200 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
                          />
                        </div>
                      ))}
                  </div>
                )}
              </div>
              {errors.moduleAccess && (
                <p className="text-sm text-red-500">{errors.moduleAccess}</p>
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
            >
              Update
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

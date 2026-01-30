import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronRight } from "lucide-react";

interface GroupPermissionForm {
  groupTitle: string;
  moduleAccess: string[];
  accessLevel: string[];
}

interface GroupPermissionFormProps {
  mode: "add";
  onSave: (data: GroupPermissionForm) => void;
  triggerButton: React.ReactNode;
}

export default function GroupPermissionForm({
  onSave,
  triggerButton,
}: GroupPermissionFormProps) {
  const [open, setOpen] = useState(false);
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

  const handleModuleSelection = (value: string) => {
    if (selectedModules.includes(value)) {
      setSelectedModules(selectedModules.filter((item) => item !== value));
    } else {
      setSelectedModules([...selectedModules, value]);
    }

    // Clear module access error when selection is made
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
    if (!validateForm()) {
      return;
    }

    const formData: GroupPermissionForm = {
      groupTitle,
      moduleAccess: selectedModules,
      accessLevel: selectedAccessLevels,
    };

    onSave(formData);
    setOpen(false);
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
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="h-fit bg-white sm:max-w-[425px] p-6">
        <DialogHeader>
          <DialogTitle>Add Group Permission</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-4">
            {/* Group Title */}
            <div className="grid gap-2 mt-4">
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
              onClick={() => setOpen(false)}
              className="cursor-pointer border-[#161CCA] text-[#161CCA]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              className="cursor-pointer bg-[#161CCA] text-white"
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

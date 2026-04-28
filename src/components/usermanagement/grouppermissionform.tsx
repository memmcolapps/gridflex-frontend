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
import { useModuleAccess } from "@/hooks/use-profile-events";

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

const MODULE_LABEL_MAP: Record<string, string> = {
  DATA_MANAGEMENT: "Data Management",
  HES: "HES",
  VENDING: "Vending",
};

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

  const { data: moduleAccessData, isLoading: isLoadingModules } = useModuleAccess();

  const activeModules = (moduleAccessData?.responsedata ?? []).filter(
    (m) => m.status,
  );

  const dataManagementSubItems = [
    { value: "organization", label: "Organization" },
    { value: "meter-management", label: "Meter Management" },
    { value: "customer-management", label: "Customer Management" },
    { value: "tarrif", label: "Tariff" },
    { value: "band-management", label: "Band Management" },
    { value: "reviewandapproval", label: "Review and Approval" },
    { value: "debt-management", label: "Debt Management" },
  ];

  const hasDataManagement = activeModules.some(
    (m) => m.module === "DATA_MANAGEMENT",
  );

  const accessLevelOptions = [
    { value: "view-only", label: "View only" },
    { value: "edit-only", label: "Edit only" },
    { value: "approve-only", label: "Approve only" },
    { value: "disable-only", label: "Disable only" },
  ];

  const handleModuleSelection = (value: string) => {
    setSelectedModules((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
    if (errors.moduleAccess) {
      setErrors((prev) => ({ ...prev, moduleAccess: undefined }));
    }
  };

  const handleAccessLevelSelection = (value: string) => {
    setSelectedAccessLevels((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
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
    if (!validateForm()) return;
    onSave({ groupTitle, moduleAccess: selectedModules, accessLevel: selectedAccessLevels });
    setOpen(false);
    resetForm();
  };

  const getSelectedModulesDisplay = () => {
    if (selectedModules.length === 0) return "Select module access";
    if (selectedModules.length === 1) return selectedModules[0];
    return `${selectedModules.length} modules selected`;
  };

  const getSelectedAccessLevelsDisplay = () => {
    if (selectedAccessLevels.length === 0) return "Select access level";
    if (selectedAccessLevels.length === 1) {
      return accessLevelOptions.find((opt) => opt.value === selectedAccessLevels[0])?.label ?? selectedAccessLevels[0];
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
                  <span className={selectedModules.length === 0 ? "text-gray-500" : ""}>
                    {isLoadingModules ? "Loading modules..." : getSelectedModulesDisplay()}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${isModuleDropdownOpen ? "rotate-180" : ""}`}
                  />
                </div>

                {isModuleDropdownOpen && !isLoadingModules && (
                  <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-64 overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">

                    {hasDataManagement && (
                      <>
                        <div
                          className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-100"
                          onClick={() => setIsDataManagementOpen(!isDataManagementOpen)}
                        >
                          <span className="font-medium">Data Management</span>
                          {isDataManagementOpen ? (
                            <ChevronDown size={12} />
                          ) : (
                            <ChevronRight size={12} />
                          )}
                        </div>

                        {isDataManagementOpen &&
                          dataManagementSubItems.map((option) => (
                            <div
                              key={option.value}
                              className="flex cursor-pointer items-center justify-between px-3 py-2 pl-6 hover:bg-gray-100"
                              onClick={() => handleModuleSelection(option.value)}
                            >
                              <span>{option.label}</span>
                              <Checkbox
                                checked={selectedModules.includes(option.value)}
                                className="border-gray-200 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
                              />
                            </div>
                          ))}
                      </>
                    )}

                    {activeModules
                      .filter((m) => m.module !== "DATA_MANAGEMENT")
                      .map((m) => (
                        <div
                          key={m.id}
                          className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-100"
                          onClick={() => handleModuleSelection(m.module)}
                        >
                          <span>{MODULE_LABEL_MAP[m.module] ?? m.module}</span>
                          <Checkbox
                            checked={selectedModules.includes(m.module)}
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
                  <span className={selectedAccessLevels.length === 0 ? "text-gray-500" : ""}>
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

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronRight } from "lucide-react";
import { group } from "console";

// Define the form data type
interface GroupPermissionForm {
  groupTitle: string;
  moduleAccess: string;
  accessLevel: string;
}

interface GroupPermissionFormProps {
  mode: "add";
  onSave: (data: GroupPermissionForm) => void;
  triggerButton: React.ReactNode;
}

type ModuleAccessKeys =
  | "all-access"
  | "organization"
  | "meter-management"
  | "customer-management"
  | "billing"
  | "vending"
  | "hes";
type AccessLevelKeys =
  | "view-only"
  | "edit-only"
  | "approve-only"
  | "disable-only";

type ModuleAccessState = Record<ModuleAccessKeys, boolean>;
type AccessLevelState = Record<AccessLevelKeys, boolean>;

export default function GroupPermissionForm({
  onSave,
  triggerButton,
}: GroupPermissionFormProps) {
  const [open, setOpen] = useState(false);
  const [groupTitle, setGroupTitle] = useState("");
  const [moduleAccess, setModuleAccess] = useState("");
  const [accessLevel, setAccessLevel] = useState("");
  const [moduleAccessConfirmed, setModuleAccessConfirmed] =
    useState<ModuleAccessState>({
      "all-access": false,
      organization: false,
      "meter-management": false,
      "customer-management": false,
      billing: false,
      vending: false,
      hes: false,
    });
  const [accessLevelConfirmed, setAccessLevelConfirmed] =
    useState<AccessLevelState>({
      "view-only": false,
      "edit-only": false,
      "approve-only": false,
      "disable-only": false,
    });
  const [isDataManagementOpen, setIsDataManagementOpen] = useState(false);
  const [errors, setErrors] = useState<{
    groupTitle?: string;
    moduleAccess?: string;
    accessLevel?: string;
  }>({});

  const resetForm = () => {
    setGroupTitle("");
    setModuleAccess("");
    setAccessLevel("");
    setModuleAccessConfirmed({
      "all-access": false,
      organization: false,
      "meter-management": false,
      "customer-management": false,
      billing: false,
      vending: false,
      hes: false,
    });
    setAccessLevelConfirmed({
      "view-only": false,
      "edit-only": false,
      "approve-only": false,
      "disable-only": false,
    });
    setIsDataManagementOpen(false);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!groupTitle.trim()) {
      newErrors.groupTitle = "Group title is required";
    }
    if (!moduleAccess) {
      newErrors.moduleAccess = "Module access is required";
    } else if (!moduleAccessConfirmed[moduleAccess as ModuleAccessKeys]) {
      newErrors.moduleAccess = "Please confirm the selected module access";
    }
    if (!accessLevel) {
      newErrors.accessLevel = "Access level is required";
    } else if (!accessLevelConfirmed[accessLevel as AccessLevelKeys]) {
      newErrors.accessLevel = "Please confirm the selected access level";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData: GroupPermissionForm = {
      groupTitle,
      moduleAccess,
      accessLevel,
    };

    onSave(formData);
    setOpen(false);
    resetForm();
  };

  const moduleAccessOptions = [
    { value: "all-access", label: "All Access", group: null },
    { value: "dashboard", label: "Dashboard", group: "Data-Management" },
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
      label: "Tarrif",
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
    { value: "user-management", label: "User Mangement", group: null },
  ];

  const accessLevelOptions = [
    { value: "view-only", label: "View only" },
    { value: "edit-only", label: "Edit only" },
    { value: "approve-only", label: "Approve only" },
    { value: "disable-only", label: "Disable only" },
  ];

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="h-fit bg-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Group Permission</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex items-center gap-2">
                <Select
                  value={moduleAccess}
                  onValueChange={(value) => setModuleAccess(value)}
                >
                  <SelectTrigger
                    id="moduleAccess"
                    className={`w-[390px] ${errors.moduleAccess ? "border-red-500" : ""}`}
                  >
                    <SelectValue
                      placeholder="Select module access"
                      className="text-gray-500"
                    />
                  </SelectTrigger>
                  <SelectContent className="min-w-[300px]">
                    <SelectGroup>
                      {/* All Access */}
                      {moduleAccessOptions
                        .filter((opt) => opt.value === "all-access")
                        .map((option) => (
                          <div
                            key={option.value}
                            className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-100"
                            onClick={() => setModuleAccess(option.value)}
                          >
                            <span>{option.label}</span>
                            <Checkbox
                              checked={
                                moduleAccessConfirmed[
                                  option.value as ModuleAccessKeys
                                ]
                              }
                              onCheckedChange={(checked) =>
                                setModuleAccessConfirmed((prev) => ({
                                  ...prev,
                                  [option.value]: !!checked,
                                }))
                              }
                              onClick={(e) => e.stopPropagation()}
                              className="border-gray-200 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
                            />
                          </div>
                        ))}

                      {/* Data Management */}
                      <div
                        className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-100"
                        onClick={() => setIsDataManagementOpen((prev) => !prev)}
                      >
                        <span>Data Management</span>
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
                              className="flex cursor-pointer items-center justify-between px-3 py-2 pl-6 hover:bg-gray-100"
                              onClick={() => setModuleAccess(option.value)}
                            >
                              <span>{option.label}</span>
                              <Checkbox
                                checked={
                                  moduleAccessConfirmed[
                                    option.value as ModuleAccessKeys
                                  ]
                                }
                                onCheckedChange={(checked) =>
                                  setModuleAccessConfirmed((prev) => ({
                                    ...prev,
                                    [option.value]: !!checked,
                                  }))
                                }
                                onClick={(e) => e.stopPropagation()}
                                className="border-gray-200 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
                              />
                            </div>
                          ))}

                      {/* Remaining Non-Grouped Options */}
                      {moduleAccessOptions
                        .filter(
                          (opt) => !opt.group && opt.value !== "all-access",
                        )
                        .map((option) => (
                          <div
                            key={option.value}
                            className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-100"
                            onClick={() => setModuleAccess(option.value)}
                          >
                            <span>{option.label}</span>
                            <Checkbox
                              checked={
                                moduleAccessConfirmed[
                                  option.value as ModuleAccessKeys
                                ]
                              }
                              onCheckedChange={(checked) =>
                                setModuleAccessConfirmed((prev) => ({
                                  ...prev,
                                  [option.value]: !!checked,
                                }))
                              }
                              onClick={(e) => e.stopPropagation()}
                              className="border-gray-200 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
                            />
                          </div>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {errors.moduleAccess && (
                <p className="text-sm text-red-500">{errors.moduleAccess}</p>
              )}
            </div>

            {/* Access Level */}
            <div className="grid gap-2">
              <Label htmlFor="accessLevel">Access Level</Label>
              <div className="flex items-center gap-2">
                <Select
                  value={accessLevel}
                  onValueChange={(value) => setAccessLevel(value)}
                >
                  <SelectTrigger
                    id="accessLevel"
                    className={`w-[390px] ${errors.accessLevel ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Select access level" />
                  </SelectTrigger>
                  <SelectContent>
                    {accessLevelOptions.map((option) => (
                      <div
                        key={option.value}
                        className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-100"
                        onClick={() => setAccessLevel(option.value)}
                      >
                        <span>{option.label}</span>
                        <Checkbox
                          checked={
                            accessLevelConfirmed[
                              option.value as AccessLevelKeys
                            ]
                          }
                          onCheckedChange={(checked) =>
                            setAccessLevelConfirmed((prev) => ({
                              ...prev,
                              [option.value]: !!checked,
                            }))
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="border-gray-200 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
                        />
                      </div>
                    ))}
                  </SelectContent>
                </Select>
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

import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, MoreVertical, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  ArrowUpDown,
  ListFilter,
  PlusCircleIcon,
  SearchIcon,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import GroupPermissionForm from "./grouppermissionform";
import EditGroupPermissionForm from "./editgrouppermissionform";
import {
  useCreateGroupPermission,
  useGroupPermissions,
  useUpdateGroupPermission,
  useUpdateGroupPermissionField,
} from "@/hooks/use-groups";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
import GroupStatusToggleDropdownItem from "./groupstatustoggledropdownitem";

interface GroupPermissionFormData {
  groupTitle: string;
  moduleAccess: string[];
  accessLevel: string[];
}

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

// For CREATE operations only - backend generates the IDs
const transformModuleAccessToModules = (moduleAccessArray: string[]) => {
  const dataManagementModules = [
    "organization",
    "meter-management",
    "customer-management",
    "tarrif",
    "band-management",
    "reviewandapproval",
    "debt-management",
  ];

  const moduleNames: Record<string, string> = {
    organization: "Organization",
    "meter-management": "Meter Management",
    "customer-management": "Customer Management",
    tarrif: "Tariff",
    "band-management": "Band Management",
    reviewandapproval: "Review and Approval",
    "debt-management": "Debt Management",
    billing: "Billing",
    vending: "Vending",
    hes: "HES",
    "user-management": "User Management",
    dashboard: "Dashboard",
  };

  if (moduleAccessArray.includes("all-access")) {
    return [
      {
        name: "Data Management",
        access: true,
        subModules: [
          { name: "Organization", access: true },
          { name: "Meter Management", access: true },
          { name: "Customer Management", access: true },
          { name: "Tariff", access: true },
          { name: "Band Management", access: true },
          { name: "Review and Approval", access: true },
          { name: "Debt Management", access: true },
        ],
      },
      { name: "Billing", access: true, subModules: [] },
      { name: "Vending", access: true, subModules: [] },
      { name: "HES", access: true, subModules: [] },
      {
        name: "User Management",
        access: true,
        subModules: [],
      },
      { name: "Dashboard", access: true, subModules: [] },
    ];
  }

  const modules: Array<{
    name: string;
    access: boolean;
    subModules: Array<{ name: string; access: boolean }>;
  }> = [];
  const dataManagementSubModules: Array<{
    name: string;
    access: boolean;
  }> = [];

  moduleAccessArray.forEach((moduleAccess) => {
    if (dataManagementModules.includes(moduleAccess)) {
      dataManagementSubModules.push({
        name: moduleNames[moduleAccess] ?? "Unknown Module",
        access: true,
      });
    } else {
      modules.push({
        name: moduleNames[moduleAccess] ?? moduleAccess,
        access: true,
        subModules: [],
      });
    }
  });

  if (dataManagementSubModules.length > 0) {
    modules.unshift({
      name: "Data Management",
      access: true,
      subModules: dataManagementSubModules,
    });
  }

  return modules;
};

const transformAccessLevelsToPermissions = (accessLevels: string[]) => {
  return {
    view: accessLevels.includes("view-only"),
    edit: accessLevels.includes("edit-only"),
    approve: accessLevels.includes("approve-only"),
    disable: accessLevels.includes("disable-only"),
  };
};

export default function GroupPermissionManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof GroupPermission;
    direction: "ascending" | "descending";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedGroupForEdit, setSelectedGroupForEdit] =
    useState<GroupPermission | null>(null);

  const { data: groupPermissions, isLoading, error } = useGroupPermissions(searchTerm);
  const { mutate: createPermissionGroup } = useCreateGroupPermission();
  const { mutate: updatePermissionGroup } = useUpdateGroupPermission();
  const { mutate: updatePermissionField } = useUpdateGroupPermissionField();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const requestSort = (key: keyof GroupPermission) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const processedGroupPermissions = useMemo(() => {
    let sortableGroups = [...groupPermissions];

    if (sortConfig !== null) {
      sortableGroups.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (typeof aValue === "string" && typeof bValue === "string") {
          if (aValue < bValue) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
        }
        return 0;
      });
    }

    return sortableGroups;
  }, [groupPermissions, sortConfig, searchTerm]);

  const totalRows = processedGroupPermissions.length;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedGroups = processedGroupPermissions.slice(startIndex, endIndex);

  const handleAddGroupPermission = async (
    newGroup: GroupPermissionFormData,
  ) => {
    try {
      const permissions = transformAccessLevelsToPermissions(
        newGroup.accessLevel,
      );
      const modules = transformModuleAccessToModules(newGroup.moduleAccess);

      createPermissionGroup(
        {
          groupTitle: newGroup.groupTitle,
          permission: permissions,
          modules,
        },
        {
          onSuccess: () => {
            console.log("Permission Group created successfully");
            toast.success("Permission Group created successfully");
          },
          onError: (error) => {
            console.error("Error creating permission group:", error);
            toast.error("Error creating permission group");
          },
        },
      );
    } catch (err) {
      console.error("Error creating group permission:", err);
    }
  };

  const handleUpdatePermission = async (
    groupId: string,
    permissionType: keyof GroupPermission["permissions"],
    value: boolean,
  ) => {
    if (permissionType === "id") return; // Don't update id
    updatePermissionField(
      {
        groupId,
        permissionType: permissionType as
          | "view"
          | "edit"
          | "approve"
          | "disable",
        value,
      },
      {
        onSuccess: () => {
          toast.success("Permission updated successfully");
        },
        onError: (error) => {
          console.error("Error updating permission:", error);
          toast.error("Error updating permission");
        },
      },
    );
  };

  const handleEditGroup = (group: GroupPermission) => {
    setSelectedGroupForEdit(group);
    setEditDialogOpen(true);
  };

  const updateModulesAccessForUpdate = (
    existingModules: GroupPermission["modules"],
    newModuleAccess: string[],
  ): GroupPermission["modules"] => {
    // Build the desired module structure based on selected access
    const dataManagementModules = [
      "organization",
      "meter-management",
      "customer-management",
      "tarrif",
      "band-management",
      "reviewandapproval",
      "debt-management",
    ];

    const moduleNames: Record<string, string> = {
      organization: "Organization",
      "meter-management": "Meter Management",
      "customer-management": "Customer Management",
      tarrif: "Tariff",
      "band-management": "Band Management",
      reviewandapproval: "Review and Approval",
      "debt-management": "Debt Management",
      billing: "Billing",
      vending: "Vending",
      hes: "HES",
      "user-management": "User Management",
      dashboard: "Dashboard",
    };

    // If all-access is selected, return all modules with backend IDs
    if (newModuleAccess.includes("all-access")) {
      // Create structure for Data Management parent + all others
      // ONLY include modules that exist in the backend data
      const result: GroupPermission["modules"] = [];

      // Find Data Management module from existing backend data
      const existingDataManagement = existingModules.find(
        (m) => m.name === "Data Management",
      );

      // Only add Data Management if it exists in backend data
      if (existingDataManagement) {
        result.push({
          ...existingDataManagement,
          access: true,
        });
      }

      // Add other modules - only those that exist in backend data
      const otherModules = [
        "billing",
        "vending",
        "hes",
        "user-management",
        "dashboard",
      ];
      for (const moduleKey of otherModules) {
        const moduleName = moduleNames[moduleKey] ?? moduleKey;
        const existing = existingModules.find((m) => m.name === moduleName);
        if (existing) {
          result.push({ ...existing, access: true });
        }
        // If not found in backend, skip it - don't generate ID
      }

      return result;
    }

    // For partial selections, build only the selected modules
    const result: GroupPermission["modules"] = [];
    const selectedDataManagementSubModules: string[] = [];

    // Separate data management from other modules
    newModuleAccess.forEach((moduleAccess) => {
      if (dataManagementModules.includes(moduleAccess)) {
        selectedDataManagementSubModules.push(moduleAccess);
      }
    });

    // Add Data Management module if it has selections
    if (selectedDataManagementSubModules.length > 0) {
      const existingDataManagement = existingModules.find(
        (m) => m.name === "Data Management",
      );

      // Only add if it exists in backend data
      if (existingDataManagement) {
        const subModules: GroupPermission["modules"][0]["subModules"] = [];

        selectedDataManagementSubModules.forEach((moduleAccess) => {
          const moduleName = moduleNames[moduleAccess] ?? "Unknown Module";
          const existingSub = existingDataManagement.subModules.find(
            (s) => s.name === moduleName,
          );

          // Only add if found - never generate ID
          if (existingSub) {
            subModules.push({ ...existingSub, access: true });
          }
          // If not found in backend, skip it - don't generate ID
        });

        result.push({
          ...existingDataManagement,
          access: true,
          subModules,
        });
      }
      // If Data Management doesn't exist in backend, skip it entirely
    }

    // Add other selected modules
    newModuleAccess.forEach((moduleAccess) => {
      if (!dataManagementModules.includes(moduleAccess)) {
        const moduleName = moduleNames[moduleAccess] ?? moduleAccess;
        const existing = existingModules.find((m) => m.name === moduleName);

        // Only add if found in backend data
        if (existing) {
          result.push({ ...existing, access: true });
        }
        // If not found in backend, skip it - don't generate ID
      }
    });

    return result;
  };

  const updatePermissionsForUpdate = (
    existingPermissions: GroupPermission["permissions"],
    newAccessLevels: string[],
  ): GroupPermission["permissions"] => {
    // Always preserve the backend-provided ID
    return {
      id: existingPermissions.id,
      view: newAccessLevels.includes("view-only"),
      edit: newAccessLevels.includes("edit-only"),
      approve: newAccessLevels.includes("approve-only"),
      disable: newAccessLevels.includes("disable-only"),
    };
  };

  const handleUpdateGroupPermission = async (data: {
    id: string;
    groupTitle: string;
    moduleAccess: string[];
    accessLevel: string[];
  }) => {
    try {
      // Find the existing group to preserve backend IDs
      const existingGroup = groupPermissions.find((g) => g.id === data.id);
      if (!existingGroup) {
        toast.error("Group not found");
        return;
      }

      // Use the new update functions that preserve backend IDs
      const permissions = updatePermissionsForUpdate(
        existingGroup.permissions,
        data.accessLevel,
      );
      const modules = updateModulesAccessForUpdate(
        existingGroup.modules,
        data.moduleAccess,
      );

      // Build payload matching the backend sample exactly
      const payload = {
        id: data.id,
        groupTitle: data.groupTitle,
        permission: permissions,
        modules,
      };

      updatePermissionGroup(
        { groupId: data.id, payload },
        {
          onSuccess: () => {
            console.log("Group permission updated successfully");
            toast.success("Group permission updated successfully");
          },
          onError: (error) => {
            console.error("Error updating group permission:", error);
            toast.error("Error updating group permission");
          },
        },
      );
    } catch (err) {
      console.error("Error updating group permission:", err);
      toast.error("Error updating group permission");
    }
  };

  return (
    <div className="h-screen overflow-y-hidden text-black">
      <h1 className="mb-10 text-2xl font-bold">Group Permission</h1>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
          {error.message}
        </div>
      )}

      <div className="flex justify-between">
        <p className="text-muted-foreground text-sm">
          Configure group permission, and system accessibility here.
        </p>
        <GroupPermissionForm
          mode="add"
          onSave={handleAddGroupPermission}
          triggerButton={
            <Button
              className="mb-2 flex items-center gap-2 bg-[#161CCA] hover:bg-[#121eb3]"
              disabled={isLoading}
            >
              <div className="flex items-center justify-center p-0.5">
                <PlusCircleIcon className="text-[#FEFEFE]" size={12} />
              </div>
              <span className="cursor-pointer text-white">
                {isLoading ? "Adding..." : "Add Group Permission"}
              </span>
            </Button>
          }
        />
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-80">
            <SearchIcon
              className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2"
              size={12}
            />
            <Input
              type="text"
              placeholder="Search by group name..."
              className="border-[rgba(228,231,236,1)] pl-10"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <Button
            variant="outline"
            className="gap-1 border-[rgba(228,231,236,1)]"
          >
            <ListFilter className="" strokeWidth={2.5} size={12} />
            <Label htmlFor="filterCheckbox" className="cursor-pointer">
              Filter
            </Label>
          </Button>
          <Button
            variant="outline"
            className="gap-1 border-[rgba(228,231,236,1)]"
            onClick={() => setSortConfig(null)}
          >
            <ArrowUpDown className="" strokeWidth={2.5} size={12} />
            <Label className="cursor-pointer">
              {sortConfig ? "Clear Sort" : "Sort"}
            </Label>
          </Button>
        </div>
      </div>

      <div className="h-4/6">
        <Table className="bg-transparent">
          <TableHeader className="bg-transparent">
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => requestSort("groupTitle")}
              >
                <div className="flex items-center justify-between">
                  <span>Group Permission</span>
                  {sortConfig?.key === "groupTitle" && (
                    <span>
                      {sortConfig.direction === "ascending" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead>View</TableHead>
              <TableHead>Edit</TableHead>
              <TableHead>Approve</TableHead>
              <TableHead>Disable</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center">
                  <div className="flex items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
                    <span className="ml-2">Loading group permissions...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedGroups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center">
                  {searchTerm ? (
                    <div>
                      <p>
                        No group permissions found matching &quot;{searchTerm}
                        &quot;
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setSearchTerm("")}
                        className="mt-2"
                      >
                        Clear search
                      </Button>
                    </div>
                  ) : (
                    "No group permissions found"
                  )}
                </TableCell>
              </TableRow>
            ) : (
              paginatedGroups.map((group) => (
                <TableRow
                  key={group.id}
                  className="hover:bg-muted/50 bg-transparent"
                >
                  <TableCell>
                    <div>
                      <div className="font-medium">{group.groupTitle}</div>
                      <div className="text-sm text-gray-500">
                        {group.modules?.map((m) => m.name).join(", ")}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={group.permissions.view}
                      onCheckedChange={(checked) =>
                        handleUpdatePermission(group.id, "view", !!checked)
                      }
                      className="border-gray-300 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={group.permissions.edit}
                      onCheckedChange={(checked) =>
                        handleUpdatePermission(group.id, "edit", !!checked)
                      }
                      className="border-gray-300 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={group.permissions.approve}
                      onCheckedChange={(checked) =>
                        handleUpdatePermission(group.id, "approve", !!checked)
                      }
                      className="border-gray-300 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={group.permissions.disable}
                      onCheckedChange={(checked) =>
                        handleUpdatePermission(group.id, "disable", !!checked)
                      }
                      className="border-gray-300 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
                    />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 cursor-pointer p-2"
                        >
                          <MoreVertical size={14} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="center"
                        className="cursor-pointer"
                      >
                        <DropdownMenuItem
                          onSelect={() => {
                            handleEditGroup(group);
                          }}
                        >
                          <div className="flex w-full items-center gap-2">
                            <Pencil size={14} />
                            <span className="cursor-pointer">
                              Edit Group Permission
                            </span>
                          </div>
                        </DropdownMenuItem>
                        <GroupStatusToggleDropdownItem group={group} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="text-black-500 sticky bottom-0 z-10 mt-4 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Rows per page</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {[5, 10, 12, 20, 50].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        <span className="text-black-500 text-sm">
          {totalRows === 0
            ? "0-0"
            : `${startIndex + 1}-${Math.min(endIndex, totalRows)}`}{" "}
          of {totalRows} rows
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="text-black-500 cursor-pointer rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {Math.ceil(totalRows / rowsPerPage) || 1}
          </span>
          <button
            disabled={endIndex >= totalRows}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="text-black-500 cursor-pointer rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Edit Group Permission Modal */}
      <EditGroupPermissionForm
        isOpen={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        groupPermission={selectedGroupForEdit}
        onSave={handleUpdateGroupPermission}
      />
    </div>
  );
}

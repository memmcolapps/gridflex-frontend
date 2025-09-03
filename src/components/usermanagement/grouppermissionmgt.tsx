import { useState, useMemo } from "react";
import {
  ChevronUp,
  ChevronDown,
  MoreVertical,
  Pencil,
  Ban,
} from "lucide-react";
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
import { useAuth } from "@/context/auth-context";
import {
  useCreateGroupPermission,
  useGroupPermissions,
} from "@/hooks/use-groups";
import { queryClient } from "@/lib/queryClient";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
import DeactivateUserDropdownItem from "./deactivateuserdropdownitem";

interface GroupPermissionFormData {
  groupTitle: string;
  moduleAccess: string[];
  accessLevel: string[];
}

interface OrganizationAccessPayload {
  groupTitle: string;
  permission: {
    view: boolean;
    edit: boolean;
    approve: boolean;
    disable: boolean;
  };
  orgId: string;
  modules: Array<{
    name: string;
    access: boolean;
    subModules: Array<{ name: string; access: boolean }>;
  }>;
}

interface GroupPermission {
  id: string;
  groupTitle: string;
  permissions: {
    view: boolean;
    edit: boolean;
    approve: boolean;
    disable: boolean;
  };
  modules: Array<{
    name: string;
    access: boolean;
    subModules: Array<{ name: string; access: boolean }>;
  }>;
}

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
      { name: "User Management", access: true, subModules: [] },
      { name: "Dashboard", access: true, subModules: [] },
    ];
  }

  const modules: Array<{
    name: string;
    access: boolean;
    subModules: Array<{ name: string; access: boolean }>;
  }> = [];
  const dataManagementSubModules: Array<{ name: string; access: boolean }> = [];

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
  const { user } = useAuth();
  const { data: groupPermissions, isLoading, error } = useGroupPermissions();
  const { mutate: createPermissionGroup } = useCreateGroupPermission();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof GroupPermission;
    direction: "ascending" | "descending";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);

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

    // Apply filtering
    if (searchTerm) {
      sortableGroups = sortableGroups.filter((group) =>
        group.groupTitle.toLowerCase().includes(searchTerm.toLowerCase()),
      );
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
          orgId: user?.orgId ?? "",
          modules,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["permissions", user?.orgId],
            });
            queryClient.invalidateQueries({ queryKey: ["org", user?.orgId] });
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
    } finally {
    }
  };

  const handleUpdatePermission = async (
    groupId: string,
    permissionType: keyof GroupPermission["permissions"],
    value: boolean,
  ) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log(`Updated group ${groupId}: ${permissionType} = ${value}`);
    } catch (err) {
      console.error("Error updating permission:", err);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log(`Deleted group ${groupId}`);
    } catch (err) {
      console.error("Error deleting group:", err);
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
                            console.log("Edit User");
                          }}
                        >
                          <div className="flex w-full items-center gap-2 p-2">
                            <Pencil size={14} />
                            <span className="cursor-pointer">
                              Edit Group Permission
                            </span>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <div className="flex w-full items-center gap-2 p-2">
                            <Ban size={14} />
                            <span className="cursor-pointer">
                              Deactivate Group Permission
                            </span>
                          </div>
                        </DropdownMenuItem>
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
    </div>
  );
}

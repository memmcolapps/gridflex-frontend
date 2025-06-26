import { useState, useEffect } from "react";
import {
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import GroupPermissionForm from "./grouppermissionform";
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
import { ArrowUpDown, ListFilter, PlusCircleIcon, SearchIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";


// Define the GroupPermission type
interface GroupPermission {
  id: string;
  groupTitle: string;
  permissions: {
    view: boolean;
    edit: boolean;
    approve: boolean;
    disable: boolean;
  };
}

// Define the type for the form data submitted by GroupPermissionForm
interface GroupPermissionFormData {
  groupTitle: string;
  moduleAccess: string;
  accessLevel: string;
}

// Mock service functions
const mockGroupPermissions: GroupPermission[] = [
  { id: "1", groupTitle: "System administrator", permissions: { view: false, edit: false, approve: true, disable: true } },
  { id: "2", groupTitle: "Data manager", permissions: { view: false, edit: false, approve: true, disable: true } },
  { id: "3", groupTitle: "Vending manager", permissions: { view: false, edit: false, approve: true, disable: false } },
  { id: "4", groupTitle: "Billing manager", permissions: { view: false, edit: false, approve: false, disable: true } },
  { id: "5", groupTitle: "HES manager", permissions: { view: false, edit: false, approve: false, disable: false } },
  { id: "6", groupTitle: "Customer officer", permissions: { view: true, edit: false, approve: false, disable: false } },
  { id: "7", groupTitle: "Meter officer", permissions: { view: true, edit: false, approve: false, disable: false } },
  { id: "8", groupTitle: "Vending officer", permissions: { view: true, edit: false, approve: false, disable: false } },
  { id: "9", groupTitle: "Billing officer", permissions: { view: false, edit: false, approve: true, disable: false } },
  { id: "10", groupTitle: "HES officer", permissions: { view: false, edit: false, approve: true, disable: false } },
  { id: "11", groupTitle: "Auditor", permissions: { view: true, edit: false, approve: false, disable: false } },
  { id: "12", groupTitle: "Technician", permissions: { view: true, edit: false, approve: false, disable: false } },
];

const fetchGroupPermissions = async (): Promise<GroupPermission[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockGroupPermissions), 500);
  });
};

const createGroupPermission = async (newGroup: Omit<GroupPermission, "id">): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockGroupPermissions.push({
        id: (mockGroupPermissions.length + 1).toString(),
        ...newGroup,
      });
      resolve(true);
    }, 500);
  });
};

const updateGroupPermission = async (updatedGroup: GroupPermission): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockGroupPermissions.findIndex((g) => g.id === updatedGroup.id);
      if (index !== -1) {
        mockGroupPermissions[index] = updatedGroup;
        resolve(true);
      } else {
        resolve(false);
      }
    }, 500);
  });
};

export default function GroupPermissionManagement() {
  const [groupPermissions, setGroupPermissions] = useState<GroupPermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof GroupPermission;
    direction: "ascending" | "descending";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  useEffect(() => {
    const loadGroupPermissions = async () => {
      setIsLoading(true);
      try {
        const fetchedGroups = await fetchGroupPermissions();
        console.log("Fetched group permissions:", fetchedGroups);
        setGroupPermissions(fetchedGroups);
      } catch (error) {
        console.error("Failed to fetch group permissions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGroupPermissions();
  }, []);

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

  const sortedGroupPermissions = () => {
    const sortableGroups = [...groupPermissions];
    if (sortConfig !== null) {
      sortableGroups.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === undefined || bValue === undefined) return 0;
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "ascending"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        return 0;
      });
    }
    return sortableGroups;
  };

  const filteredGroupPermissions = sortedGroupPermissions().filter((group) =>
    group.groupTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRows = filteredGroupPermissions.length;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedGroups = filteredGroupPermissions.slice(startIndex, endIndex);

  console.log("Rendering table with:", {
    groupPermissions,
    filteredGroupPermissions,
    paginatedGroups,
    currentPage,
    rowsPerPage,
  });

  const handleAddGroupPermission = async (newGroup: GroupPermissionFormData) => {
    const permissions = {
      view: newGroup.accessLevel === "view-only",
      edit: newGroup.accessLevel === "edit-only",
      approve: newGroup.accessLevel === "approve-only",
      disable: newGroup.accessLevel === "disable-only",
    };

    const success = await createGroupPermission({
      groupTitle: newGroup.groupTitle,
      permissions,
    });

    if (success) {
      const fetchedGroups = await fetchGroupPermissions();
      setGroupPermissions(fetchedGroups);
    }
  };

  const handleUpdatePermission = async (
    groupId: string,
    permissionType: keyof GroupPermission["permissions"],
    value: boolean
  ) => {
    const updatedGroups = groupPermissions.map((group) => {
      if (group.id === groupId) {
        return {
          ...group,
          permissions: {
            ...group.permissions,
            [permissionType]: value,
          },
        };
      }
      return group;
    });
    const updatedGroup = updatedGroups.find((g) => g.id === groupId);
    if (updatedGroup) {
      const success = await updateGroupPermission(updatedGroup);
      if (success) {
        setGroupPermissions(updatedGroups);
      }
    }
  };

  return (
    <div className="text-black h-screen overflow-y-hidden">
      <h1 className="mb-10 text-2xl font-bold">Group Permission</h1>
      <div className="flex justify-between">
        <p className="text-muted-foreground text-sm">
          Configure group permission, and system accessibility here.
        </p>
        <GroupPermissionForm
          mode="add"
          onSave={handleAddGroupPermission}
          triggerButton={
            <Button className="flex items-center gap-2 bg-[#161CCA] hover:bg-[#121eb3] mb-2">
              <div className="flex items-center justify-center p-0.5">
                <PlusCircleIcon className="text-[#FEFEFE]" size={12}/>
              </div>
              <span className="text-white cursor-pointer">Add Group Permission</span>
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
              placeholder="Search by name, ID, cont..."
              className="border-[rgba(228,231,236,1)] pl-10"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <Button variant="outline" className="gap-1 border-[rgba(228,231,236,1)]">
            <ListFilter className="" strokeWidth={2.5} size={12} />
            <Label htmlFor="filterCheckbox" className="cursor-pointer">
              Filter
            </Label>
          </Button>
          <Button variant="outline" className="gap-1 border-[rgba(228,231,236,1)]">
            <ArrowUpDown className="" strokeWidth={2.5} size={12} />
            <Label htmlFor="sortCheckbox" className="cursor-pointer">
              Sort
            </Label>
          </Button>
        </div>
      </div>

      <div className='h-4/6'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("groupTitle")}
              >
                <div className="flex items-center justify-between">
                  <span>Group Permission</span>
                  {sortConfig?.key === "groupTitle" && (
                    <span>
                      {sortConfig.direction === "ascending" ? (
                        <ChevronUpIcon className="h-4 w-4" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead>View</TableHead>
              <TableHead>Edit</TableHead>
              <TableHead>Approve</TableHead>
              <TableHead>Disable</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Loading group permissions...
                </TableCell>
              </TableRow>
            ) : paginatedGroups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No group permissions found
                </TableCell>
              </TableRow>
            ) : (
              paginatedGroups.map((group) => (
                <TableRow key={group.id} className="hover:bg-muted/50 bg-gray-50">
                  <TableCell>{group.groupTitle || "N/A"}</TableCell>
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
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>      
      </div> 
       {/* Sticky Pagination Bar */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 flex items-center justify-between px-4 py-3 mt-4 z-10 text-black-500">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rows per page</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1); // Reset to page 1 when page size changes
              }}
              className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
            >
              {[5, 10, 12, 20, 50].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
          <span className="text-sm text-black-500">
            {startIndex + 1}-{Math.min(endIndex, totalRows)} of {totalRows} rows
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm text-black-500 disabled:opacity-50 cursor-pointer"
            >
              Previous
            </button>
            <button
              disabled={endIndex >= totalRows}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm text-black-500 disabled:opacity-50 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>    
    </div>
  );
}
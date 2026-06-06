import { useState } from "react";
import AddUserForm from "./adduserform";
import EditUserDialog from "./edituserdialog";
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
  PlusCircleIcon,
  SearchIcon,
  MoreVertical,
  Pencil,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import UserStatusToggleDropdownItem from "./deactivateuserdropdownitem";
import { useCreateUser, useEditUser, useGetUsers } from "@/hooks/use-groups";
import {
  type CreateUserPayload,
  type GetUsersUser,
} from "@/types/users-groups";
import { toast } from "sonner";
import { type EditUserPayload } from "@/service/user-service";
import { formatDistanceToNow, format, parseISO } from "date-fns";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { LoadingAnimation } from "@/components/ui/loading-animation";
import { usePermissions } from "@/hooks/use-permissions";
import { useAuth } from "@/context/auth-context";
import { FilterControl } from "@/components/search-control";

const filterSections = [
  {
    title: "Status",
    options: [
      { label: "Active", id: "active" },
      { label: "Inactive", id: "inactive" },
    ],
  },
];

const parseTimestamp = (timestamp: string): Date => {
  // Convert format "2025-10-22 10:32:15.338908-05" to ISO 8601
  // Replace space with T and fix timezone offset format
  const normalized = timestamp
    .replace(" ", "T")
    .replace(/([+-]\d{2})$/, "$1:00"); // Add colon to timezone offset
  return parseISO(normalized);
};

const formatLastActive = (date: Date) => {
  return formatDistanceToNow(date, { addSuffix: true });
};

const formatDateAdded = (date: Date) => {
  return format(date, "dd-MM-yyyy");
};

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>(
    {},
  );
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [editingUser, setEditingUser] = useState<GetUsersUser | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: users, isLoading } = useGetUsers({
    page: currentPage - 1,
    size: rowsPerPage,
    search: searchTerm.trim() || undefined,
    status: activeFilters.active
      ? true
      : activeFilters.inactive
        ? false
        : undefined,
    sortDirection,
  });
  const { mutate: createUser } = useCreateUser();
  const { mutate: editUser } = useEditUser();
  const { canEdit } = usePermissions();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCreateUser = (newUser: CreateUserPayload) => {
    createUser(newUser, {
      onSuccess: () => {
        console.log("User created successfully");
        toast.success("User created successfully");
      },
      onError: (error) => {
        console.error("Error creating user:", error);
        toast.error("Error creating user");
      },
    });
  };

  const handleEditUser = (user: GetUsersUser) => {
    // setEditingUser(user);
    // setIsEditDialogOpen(true);

    const editPayload: EditUserPayload = {
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        nodeId: user.nodeId,
      },
      groupId: user.groups.id,
    };

    editUser(editPayload, {
      onSuccess: () => {
        console.log("User updated successfully");
        toast.success("User updated successfully");
        setIsEditDialogOpen(false);
        setEditingUser(null);
      },
      onError: (error) => {
        console.error("Error updating user:", error);
        toast.error("Error updating user");
      },
    });
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    }
  };

  const filteredUsers = users?.data ?? [];
  const totalRows = users?.totalData ?? 0;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const { user: currentUser } = useAuth();

  const handlePageSizeChange = (newPageSize: number) => {
    setRowsPerPage(newPageSize);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <LoadingAnimation
          variant="spinner"
          message="Loading users..."
          size="lg"
        />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden text-black">
      <div className="flex-grow">
        <h1 className="mb-6 text-2xl font-bold">Users</h1>
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Manage your team members and their group permissions here
          </p>
          {canEdit && (
            <AddUserForm
              onSave={(newUser) => {
                handleCreateUser(newUser);
              }}
              triggerButton={
                <Button className="flex cursor-pointer items-center gap-2 bg-[#161CCA] hover:bg-[#121eb3]">
                  <div className="flex items-center justify-center p-0.5">
                    <PlusCircleIcon className="text-[#FEFEFE]" size={12} />
                  </div>
                  <span className="text-white">Add User</span>
                </Button>
              }
            />
          )}
        </div>

        <div className="mb-6 flex w-full items-center gap-4">
          <div className="relative w-80">
            <SearchIcon
              className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2"
              size={12}
            />
            <Input
              type="text"
              placeholder="Search by name, email, group..."
              className="w-full border-[rgba(228,231,236,1)] pl-10"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <FilterControl
            sections={filterSections}
            initialFilters={activeFilters}
            onApply={(filters) => {
              setActiveFilters(filters);
              setCurrentPage(1);
            }}
            onReset={() => {
              setActiveFilters({});
              setCurrentPage(1);
            }}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="gap-1 border-[rgba(228,231,236,1)]"
              >
                <ArrowUpDown strokeWidth={2.5} size={12} />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onSelect={() => {
                  setSortDirection("asc");
                  setCurrentPage(1);
                }}
              >
                Username (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setSortDirection("desc");
                  setCurrentPage(1);
                }}
              >
                Username (Z-A)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="h-4/6">
          <Table>
            <TableHeader className="bg-transparent">
              <TableRow>
                <TableHead className="w-[70px]">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={
                        selectedUsers.length === filteredUsers.length &&
                        filteredUsers.length > 0
                      }
                      onCheckedChange={toggleSelectAll}
                      className="border-[rgba(228,231,236,1)]"
                    />
                    <span>S/N</span>
                  </div>
                </TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Group Permission</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user, index) => (
                <TableRow key={user.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => toggleUserSelection(user.id)}
                        className="border-[rgba(228,231,236,1)]"
                      />
                      <span>{startIndex + index + 1}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {user.firstname} {user.lastname}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {user.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{user.groups.groupTitle}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {formatLastActive(
                        user.lastActive
                          ? parseTimestamp(user.lastActive)
                          : new Date(),
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                        user.status
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {formatDateAdded(new Date(user.createdAt))}
                  </TableCell>
                  <TableCell>
                    {canEdit && user?.id !== currentUser?.id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          asChild
                          disabled={isEditDialogOpen}
                        >
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
                          className="w-35 cursor-pointer"
                        >
                          <DropdownMenuItem
                            onSelect={() => {
                              setEditingUser(user);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <div className="flex w-full items-center gap-2">
                              <Pencil size={14} />
                              <span className="cursor-pointer">Edit User</span>
                            </div>
                          </DropdownMenuItem>
                          <UserStatusToggleDropdownItem user={user} />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="sticky bottom-0 z-10 mt-4 border-t border-gray-200 bg-white px-4 py-3">
          <PaginationControls
            currentPage={currentPage}
            totalItems={totalRows}
            pageSize={rowsPerPage}
            onPageChange={setCurrentPage}
            onPageSizeChange={handlePageSizeChange}
            rowsPerPageLabel="Rows per page"
          />
        </div>

        {editingUser && (
          <EditUserDialog
            user={editingUser}
            isOpen={isEditDialogOpen}
            onSave={(updatedUser) => {
              handleEditUser(updatedUser);
            }}
            onClose={() => {
              console.log("Edit dialog closed");
              setIsEditDialogOpen(false);
              setEditingUser(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

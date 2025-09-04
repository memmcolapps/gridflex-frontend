import { useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
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
import { Label } from "@/components/ui/label";
import {
  ArrowUpDown,
  PlusCircleIcon,
  SearchIcon,
  MoreVertical,
  Pencil,
  ListFilter,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import DeactivateUserDropdownItem from "./deactivateuserdropdownitem";
import { useCreateUser, useGetUsers } from "@/hooks/use-groups";
import {
  type CreateUserPayload,
  type GetUsersUser,
} from "@/types/users-groups";
import { toast } from "sonner";

const formatLastActive = (date: Date) => {
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60),
  );

  if (diffInMinutes < 1) return "Online";
  if (diffInMinutes < 60)
    return `${diffInMinutes} min${diffInMinutes !== 1 ? "s" : ""} ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  return `${diffInHours} hr${diffInHours !== 1 ? "s" : ""} ago`;
};

const formatDateAdded = (date: Date) => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export default function UserManagement() {
  const { data: users, isLoading } = useGetUsers();
  const { mutate: createUser } = useCreateUser();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof GetUsersUser;
    direction: "ascending" | "descending";
  } | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [editingUser, setEditingUser] = useState<GetUsersUser | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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

  const requestSort = (key: keyof GetUsersUser) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig?.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = () => {
    const sortableUsers = [...(users?.data || [])];
    if (sortConfig !== null) {
      sortableUsers.sort((a, b) => {
        const aValue = a[sortConfig.key] ?? "";
        const bValue = b[sortConfig.key] ?? "";
        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  };

  const filteredUsers = sortedUsers().filter(
    (user) =>
      `${user.firstname} ${user.lastname}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const totalRows = filteredUsers.length;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-full flex-col overflow-hidden text-black">
      <div className="flex-grow">
        <h1 className="mb-6 text-2xl font-bold">Users</h1>
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Manage your team members and their group permissions here
          </p>
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
        </div>

        <div className="mb-6 flex w-80 items-center gap-4">
          <div className="relative flex-1">
            <SearchIcon
              className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2"
              size={12}
            />
            <Input
              type="text"
              placeholder="Search by name,ID,cont..."
              className="w-100 border-[rgba(228,231,236,1)] pl-10"
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
          >
            <ArrowUpDown className="" strokeWidth={2.5} size={12} />
            <Label htmlFor="sortCheckbox" className="cursor-pointer">
              Sort
            </Label>
          </Button>
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
                <TableHead
                  className="cursor-pointer"
                  onClick={() => requestSort("firstname")}
                >
                  <div className="flex items-center justify-between">
                    <span>Username</span>
                    {sortConfig?.key === "firstname" && (
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
                <TableHead
                  className="cursor-pointer"
                  onClick={() => requestSort("groups")}
                >
                  <div className="flex items-center justify-between">
                    <span>Group Permission</span>
                    {sortConfig?.key === "groups" && (
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
                <TableHead
                  className="cursor-pointer"
                  onClick={() => requestSort("lastActive")}
                >
                  <div className="flex items-center justify-between">
                    <span>Last Active</span>
                    {sortConfig?.key === "lastActive" && (
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
                <TableHead
                  className="cursor-pointer"
                  onClick={() => requestSort("createdAt")}
                >
                  <div className="flex items-center justify-between">
                    <span>Date Added</span>
                    {sortConfig?.key === "createdAt" && (
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
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user, index) => (
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
                        new Date(user.lastActive ?? new Date()),
                      ) === "Online" && (
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                      )}
                      <span
                        className={
                          formatLastActive(
                            new Date(user.lastActive ?? new Date()),
                          ) === "Online"
                            ? "text-green-600"
                            : ""
                        }
                      >
                        {formatLastActive(
                          new Date(user.lastActive ?? new Date()),
                        )}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDateAdded(new Date(user.createdAt))}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild disabled={isEditDialogOpen}>
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
                        <DeactivateUserDropdownItem user={user} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {/* Sticky Pagination Bar */}
        <div className="sticky bottom-0 z-10 mt-4 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rows per page</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none"
            >
              {[5, 10, 12, 20, 50].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
          <span className="ml-4 text-sm text-gray-600">
            {startIndex + 1}-{Math.min(endIndex, totalRows)} of {totalRows} rows
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="text-black-600 cursor-pointer rounded-md border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <button
              disabled={endIndex >= totalRows}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="text-black-600 cursor-pointer rounded-md border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {editingUser && (
          <EditUserDialog
            user={editingUser}
            isOpen={isEditDialogOpen}
            onSave={(updatedUser) => {
              console.log("Updating:", updatedUser);
              setIsEditDialogOpen(false);
              setEditingUser(null);
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

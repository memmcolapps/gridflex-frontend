import { useState, useEffect } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import UserForm from './userform';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { ArrowUpDown, PlusCircleIcon, SearchIcon, MoreVertical, Pencil, ListFilter } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import DeactivateUserDropdownItem from './deactivateuserdropdownitem';
import { Footer } from '../footer';


export type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    groupPermission: string;
    lastActive: Date;
    dateAdded: Date;
};

const formatLastActive = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Online';
    if (diffInMinutes < 60) return `${diffInMinutes} min${diffInMinutes !== 1 ? 's' : ''} ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    return `${diffInHours} hr${diffInHours !== 1 ? 's' : ''} ago`;
};

const formatDateAdded = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([
        {
            id: '01',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            groupPermission: 'System Administrator',
            lastActive: new Date(Date.now() - 1000 * 60 * 5),
            dateAdded: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        },
        {
            id: '02',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            groupPermission: 'Data Manager',
            lastActive: new Date(Date.now() - 1000 * 60 * 5),
            dateAdded: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        }, {
            id: '03',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            groupPermission: 'Data Manager',
            lastActive: new Date(Date.now() - 1000 * 60 * 5),
            dateAdded: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        },  {
            id: '04',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            groupPermission: 'Data Manager',
            lastActive: new Date(Date.now() - 1000 * 60 * 5),
            dateAdded: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        } 
        //  {
        //     id: '05',
        //     firstName: 'Jane',
        //     lastName: 'Smith',
        //     email: 'jane.smith@example.com',
        //     groupPermission: 'Data Manager',
        //     lastActive: new Date(Date.now() - 1000 * 60 * 5),
        //     dateAdded: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        // },  {
        //     id: '06',
        //     firstName: 'Jane',
        //     lastName: 'Smith',
        //     email: 'jane.smith@example.com',
        //     groupPermission: 'Data Manager',
        //     lastActive: new Date(Date.now() - 1000 * 60 * 5),
        //     dateAdded: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        // },  {
        //     id: '07',
        //     firstName: 'Jane',
        //     lastName: 'Smith',
        //     email: 'jane.smith@example.com',
        //     groupPermission: 'Data Manager',
        //     lastActive: new Date(Date.now() - 1000 * 60 * 5),
        //     dateAdded: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        // },  {
        //     id: '08',
        //     firstName: 'Jane',
        //     lastName: 'Smith',
        //     email: 'jane.smith@example.com',
        //     groupPermission: 'Data Manager',
        //     lastActive: new Date(Date.now() - 1000 * 60 * 5),
        //     dateAdded: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        // },  {
        //     id: '09',
        //     firstName: 'Jane',
        //     lastName: 'Smith',
        //     email: 'jane.smith@example.com',
        //     groupPermission: 'Data Manager',
        //     lastActive: new Date(Date.now() - 1000 * 60 * 5),
        //     dateAdded: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        // },  {
        //     id: '10',
        //     firstName: 'Jane',
        //     lastName: 'Smith',
        //     email: 'jane.smith@example.com',
        //     groupPermission: 'Data Manager',
        //     lastActive: new Date(Date.now() - 1000 * 60 * 5),
        //     dateAdded: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        // }, 
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{
        key: keyof User;
        direction: 'ascending' | 'descending';
    } | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    // Log state changes for debugging
    useEffect(() => {
        console.log('isEditDialogOpen:', isEditDialogOpen, 'editingUser:', editingUser);
    }, [isEditDialogOpen, editingUser]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const toggleUserSelection = (userId: string) => {
        setSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedUsers.length === filteredUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(filteredUsers.map((user) => user.id));
        }
    };

    const requestSort = (key: keyof User) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig?.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedUsers = () => {
        const sortableUsers = [...users];
        if (sortConfig !== null) {
            sortableUsers.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableUsers;
    };

    const filteredUsers = sortedUsers().filter(
        (user) =>
            `${user.firstName} ${user.lastName}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [rowsPerPage, setRowsPerPage] = useState(12);
    const [currentPage, setCurrentPage] = useState(1);
    const totalRows = filteredUsers.length;
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return (
        <div className="h-full overflow-hidden flex flex-col text-black">
            <div className="p-6 flex-grow">
                <h1 className="text-2xl mb-6 font-bold">Users</h1>
                <div className="flex justify-between items-center mb-6">
                    <p className="text-sm text-muted-foreground">
                        Manage your team members and their group permissions here
                    </p>
                    <UserForm
                        mode="add"
                        onSave={(newUser) => {
                            console.log('Adding New User:', newUser);
                            setUsers([
                                ...users,
                                {
                                    ...newUser,
                                    id: Date.now().toString(),
                                    lastActive: new Date(),
                                    dateAdded: new Date(),
                                    groupPermission: newUser.groupPermission ?? "",
                                },
                            ]);
                        }}
                        triggerButton={
                            <Button className="flex items-center gap-2 bg-[#161CCA] hover:bg-[#121eb3] cursor-pointer">
                                <div className="flex items-center justify-center p-0.5">
                                    <PlusCircleIcon className="text-[#FEFEFE]" size={12} />
                                </div>
                                <span className="text-white">Add User</span>
                            </Button>
                        }
                    />
                </div>

                <div className="flex items-center mb-6 gap-4 w-80">
                    <div className="relative flex-1">
                        <SearchIcon
                            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
                            size={12}
                        />
                        <Input
                            type="text"
                            placeholder="Search by name,ID,cont..."
                            className="w-100 pl-10 border-[rgba(228,231,236,1)]"
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
                <div className='h-4/6'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">
                                    <Checkbox
                                        checked={
                                            selectedUsers.length === filteredUsers.length &&
                                            filteredUsers.length > 0
                                        }
                                        onCheckedChange={toggleSelectAll}
                                        className="border-[rgba(228,231,236,1)]"
                                    />
                                </TableHead>
                                <TableHead className="w-[60px]">S/N</TableHead>
                                <TableHead
                                    className="cursor-pointer"
                                    onClick={() => requestSort('firstName')}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>Username</span>
                                        {sortConfig?.key === 'firstName' && (
                                            <span>
                                                {sortConfig.direction === 'ascending' ? (
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
                                    onClick={() => requestSort('groupPermission')}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>Group Permission</span>
                                        {sortConfig?.key === 'groupPermission' && (
                                            <span>
                                                {sortConfig.direction === 'ascending' ? (
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
                                    onClick={() => requestSort('lastActive')}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>Last Active</span>
                                        {sortConfig?.key === 'lastActive' && (
                                            <span>
                                                {sortConfig.direction === 'ascending' ? (
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
                                    onClick={() => requestSort('dateAdded')}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>Date Added</span>
                                        {sortConfig?.key === 'dateAdded' && (
                                            <span>
                                                {sortConfig.direction === 'ascending' ? (
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
                                        <Checkbox
                                            checked={selectedUsers.includes(user.id)}
                                            onCheckedChange={() => toggleUserSelection(user.id)}
                                            className="border-[rgba(228,231,236,1)]"
                                        />
                                    </TableCell>
                                    <TableCell>{startIndex + index + 1}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">
                                                {user.firstName} {user.lastName}
                                            </span>
                                            <span className="text-sm text-muted-foreground">{user.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.groupPermission}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {formatLastActive(user.lastActive) === 'Online' && (
                                                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                            )}
                                            <span
                                                className={
                                                    formatLastActive(user.lastActive) === 'Online'
                                                        ? 'text-green-600'
                                                        : ''
                                                }
                                            >
                                                {formatLastActive(user.lastActive)}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{formatDateAdded(user.dateAdded)}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild disabled={isEditDialogOpen}>
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-2 cursor-pointer">
                                                    <MoreVertical size={14} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="center" className="w-35 cursor-pointer">
                                                <DropdownMenuItem
                                                    onSelect={() => {
                                                        setEditingUser(user);
                                                        setIsEditDialogOpen(true);
                                                    }}
                                                >
                                                    <div className="flex items-center w-full gap-2">
                                                        <Pencil size={14} />
                                                        <span className='cursor-pointer'>Edit User</span>
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
                    <div className="sticky bottom-0 bg-white border-t border-gray-200 flex items-center justify-between px-4 py-3 mt-4 z-10">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Rows per page</span>
                            <select
                                value={rowsPerPage}
                                onChange={(e) => {
                                    setRowsPerPage(Number(e.target.value));
                                    setCurrentPage(1); // reset to page 1 when page size changes
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
                        <span className="text-sm text-gray-600 ml-4">
                            {startIndex + 1}-{Math.min(endIndex, totalRows)} of {totalRows} rows
                        </span>

                        <div className="flex items-center gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm text-black-600 disabled:opacity-50 cursor-pointer"
                            >
                                Previous
                            </button>
                            <button
                                disabled={endIndex >= totalRows}
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm text-black-600 disabled:opacity-50 cursor-pointer"
                            >
                                Next
                            </button>
                        </div>
                    </div>

                {editingUser && (
                    <UserForm
                        mode="edit"
                        user={editingUser}
                        isOpen={isEditDialogOpen}
                        onSave={(updatedUser) => {
                            console.log('Updating:', updatedUser);
                            setUsers(
                                users.map((u) =>
                                    u.id === editingUser.id
                                        ? {
                                            ...updatedUser,
                                            id: editingUser.id,
                                            lastActive: editingUser.lastActive,
                                            dateAdded: editingUser.dateAdded,
                                            groupPermission: editingUser.groupPermission ?? "",
                                        }
                                        : u
                                )
                            );
                            setIsEditDialogOpen(false);
                        }}
                        onClose={() => {
                            console.log('Edit dialog closed');
                            setIsEditDialogOpen(false);
                            setEditingUser(null);
                        }}
                    />
                )}
            </div>
            {/* <Footer/> */}
        </div>
    );
}
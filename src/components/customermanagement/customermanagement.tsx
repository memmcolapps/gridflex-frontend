import { useState, useEffect } from 'react';
import { ArrowUpDown, PlusCircleIcon, SearchIcon, MoreVertical, ListFilter, Lock, User } from 'lucide-react';
import CustomerForm from './customerform';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export type Customer = {
    id: string;
    firstName: string;
    lastName: string;
    meterNumber: string;
    accountNumber: string;
    location: string;
    phoneNumber: string;
    address: string;
    status: 'Assigned' | 'Unassigned';
    nin: string;
    email: string;
    state: string;
    city: string;
    houseNo: string;
    streetName: string;
};

export default function CustomerManagement() {
    const [customers, setCustomers] = useState<Customer[]>([
        {
            id: '01',
            firstName: 'Margaret',
            lastName: 'Ademola',
            meterNumber: '6201021223',
            accountNumber: '',
            location: 'Lagos',
            phoneNumber: '0812354648',
            address: 'Olowotedo, Mowe',
            status: 'Unassigned',
            nin: '012345678900',
            email: 'margaret@gmail.com',
            state: 'Lagos',
            city: 'Lagos',
            houseNo: 'Lagos',
            streetName: 'KM 40, Lagos Ibadan Exp. way, Ogun',
        },
        {
            id: '02',
            firstName: 'Margaret',
            lastName: 'Ademola',
            meterNumber: '6201021223',
            accountNumber: '',
            location: 'Lagos',
            phoneNumber: '0812354648',
            address: 'Olowotedo, Mowe',
            status: 'Assigned',
            nin: '012345678900',
            email: 'margaret@gmail.com',
            state: 'Lagos',
            city: 'Lagos',
            houseNo: 'Lagos',
            streetName: 'KM 40, Lagos Ibadan Exp. way, Ogun',
        },

        ...Array.from({ length: 10 }, (_, index) => ({
            id: String(index + 3).padStart(2, '0'),
            firstName: 'Margaret',
            lastName: 'Ademola',
            meterNumber: '6201021223',
            accountNumber: '',
            location: 'Lagos',
            phoneNumber: '0812354648',
            address: 'Olowotedo, Mowe',
            status: (index % 2 === 0 ? 'Unassigned' : 'Assigned') as 'Assigned' | 'Unassigned',
            nin: '012345678900',
            email: 'margaret@gmail.com',
            state: 'Lagos',
            city: 'Lagos',
            houseNo: 'Lagos',
            streetName: 'KM 40, Lagos Ibadan Exp. way, Ogun',
        })),
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Customer;
        direction: 'ascending' | 'descending';
    } | null>(null);
    const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
    const [customerToBlock, setCustomerToBlock] = useState<Customer | null>(null);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const toggleCustomerSelection = (customerId: string) => {
        setSelectedCustomers((prev) =>
            prev.includes(customerId)
                ? prev.filter((id) => id !== customerId)
                : [...prev, customerId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedCustomers.length === filteredCustomers.length) {
            setSelectedCustomers([]);
        } else {
            setSelectedCustomers(filteredCustomers.map((customer) => customer.id));
        }
    };

    const requestSort = (key: keyof Customer) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig?.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedCustomers = () => {
        const sortableCustomers = [...customers];
        if (sortConfig !== null) {
            sortableCustomers.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableCustomers;
    };

    const filteredCustomers = sortedCustomers().filter(
        (customer) =>
            `${customer.firstName} ${customer.lastName}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            customer.meterNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.accountNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [rowsPerPage, setRowsPerPage] = useState(12);
    const [currentPage, setCurrentPage] = useState(1);
    const totalRows = filteredCustomers.length;
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

    const handleBlockCustomer = (customer: Customer) => {
        setCustomerToBlock(customer);
        setIsBlockDialogOpen(true);
    };

    const confirmBlockCustomer = () => {
        if (customerToBlock) {
            // Implement block logic here (e.g., update customer status or remove)
            setIsBlockDialogOpen(false);
            setCustomerToBlock(null);
        }
    };

    return (
        <div className="h-full overflow-hidden flex flex-col text-black">
            <div className="p-6 flex-grow">
                <h1 className="text-2xl mb-6 font-bold">Customers</h1>
                <div className="flex justify-between items-center mb-6">
                    <p className="text-sm text-muted-foreground">
                        Manage and access customer records.
                    </p>
                    <div className="flex gap-2">
                        <Button variant="outline" className="border-[#161CCA] text-[#161CCA] cursor-pointer">
                            <div className="flex items-center justify-center p-0.5">
                                <PlusCircleIcon className="text-[#161CCA]" size={12} />
                            </div>
                            <span>Bulk Upload</span>
                        </Button>
                        <CustomerForm
                            mode="add"
                            onSave={(newCustomer) => {
                                setCustomers([
                                    ...customers,
                                    {
                                        ...newCustomer,
                                        id: Date.now().toString(),
                                        meterNumber: newCustomer.accountNumber,
                                        location: newCustomer.city,
                                        address: `${newCustomer.streetName}, ${newCustomer.city}`,
                                        status: 'Unassigned',
                                    },
                                ]);
                            }}
                            triggerButton={
                                <Button className="flex items-center gap-2 bg-[#161CCA] hover:bg-[#121eb3] cursor-pointer">
                                    <div className="flex items-center justify-center p-0.5">
                                        <PlusCircleIcon className="text-[#FEFEFE]" size={12} />
                                    </div>
                                    <span className="text-white">Add New Customer</span>
                                </Button>
                            }
                        />
                    </div>
                </div>

                <div className="flex items-center mb-6 gap-4 w-80">
                    <div className="relative flex-1">
                        <SearchIcon
                            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
                            size={12}
                        />
                        <Input
                            type="text"
                            placeholder="Search by meter no., account no..."
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
                                <TableHead className="w-[30px] pr-0">
                                    <div className='flex items-center gap-2'>
                                    <Checkbox
                                        checked={
                                            selectedCustomers.length === filteredCustomers.length &&
                                            filteredCustomers.length > 0
                                        }
                                        onCheckedChange={toggleSelectAll}
                                        className="border-[rgba(228,231,236,1)]"
                                    />
                                      <span>
                                    S/N
                                </span>
                                    </div>
                                </TableHead>
                              
                                <TableHead onClick={() => requestSort('firstName')}>
                                    First Name
                                </TableHead>
                                <TableHead onClick={() => requestSort('lastName')}>
                                    Last Name
                                </TableHead>
                                <TableHead onClick={() => requestSort('meterNumber')}>
                                    Meter Number
                                </TableHead>
                                <TableHead onClick={() => requestSort('accountNumber')}>
                                    Account Number
                                </TableHead>
                                <TableHead onClick={() => requestSort('location')}>
                                    Location
                                </TableHead>
                                <TableHead onClick={() => requestSort('phoneNumber')}>
                                    Phone Number
                                </TableHead>
                                <TableHead onClick={() => requestSort('address')}>
                                    Address
                                </TableHead>
                                <TableHead onClick={() => requestSort('status')}>
                                    Status
                                </TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedCustomers.map((customer, index) => (
                                <TableRow key={customer.id} className="hover:bg-muted/50">
                                    <TableCell>
                                        <div className='flex items-center gap-2'>
                                        <Checkbox
                                            checked={selectedCustomers.includes(customer.id)}
                                            onCheckedChange={() => toggleCustomerSelection(customer.id)}
                                            className="border-[rgba(228,231,236,1)]"
                                        />
                                         <span>{startIndex + index + 1}</span>
                                         </div>
                                    </TableCell>
                                   
                                    <TableCell>{customer.firstName}</TableCell>
                                    <TableCell>{customer.lastName}</TableCell>
                                    <TableCell>{customer.meterNumber}</TableCell>
                                    <TableCell>{customer.accountNumber}</TableCell>
                                    <TableCell>{customer.location}</TableCell>
                                    <TableCell>{customer.phoneNumber}</TableCell>
                                    <TableCell>{customer.address}</TableCell>
                                    <TableCell>
                                        <span
                                            className={
                                                customer.status === 'Assigned'
                                                    ? 'text-green-600'
                                                    : 'text-red-600'
                                            }
                                        >
                                            {customer.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-2 cursor-pointer">
                                                    <MoreVertical size={14} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="center" className="w-35 cursor-pointer">
                                                <DropdownMenuItem
                                                    onSelect={() => {
                                                        setEditingCustomer(customer);
                                                        setIsEditDialogOpen(true);
                                                    }}
                                                >
                                                    <div className="flex items-center w-full gap-2">
                                                        <User size={14} />
                                                        <span className='cursor-pointer'>Edit Customer</span>
                                                    </div>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onSelect={() => handleBlockCustomer(customer)}>
                                                    <div className="flex items-center w-full gap-2">
                                                        <Lock size={14} />
                                                        <span className='cursor-pointer'>Block</span>
                                                    </div>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="sticky bottom-0 bg-white border-t border-gray-200 flex items-center justify-between px-4 py-3 mt-4 z-10">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Rows per page</span>
                        <select
                            value={rowsPerPage}
                            onChange={(e) => {
                                setRowsPerPage(Number(e.target.value));
                                setCurrentPage(1);
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

                {editingCustomer && (
                    <CustomerForm
                        mode="edit"
                        customer={editingCustomer}
                        isOpen={isEditDialogOpen}
                        onSave={(updatedCustomer) => {
                            setCustomers(
                                customers.map((c) =>
                                    c.id === editingCustomer.id
                                        ? {
                                            ...updatedCustomer,
                                            id: editingCustomer.id,
                                            meterNumber: updatedCustomer.meterNumber ?? editingCustomer.meterNumber,
                                            location: updatedCustomer.city ?? editingCustomer.location,
                                            address: updatedCustomer.address ?? `${updatedCustomer.streetName}, ${updatedCustomer.city}`,
                                            status: editingCustomer.status, // Preserve status
                                        }
                                        : c
                                )
                            );
                            setIsEditDialogOpen(false);
                        }}
                        onClose={() => {
                            setIsEditDialogOpen(false);
                            setEditingCustomer(null);
                        }}
                    />
                )}

                {customerToBlock && (
                    <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Block Customer</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to block {customerToBlock.firstName}?
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setIsBlockDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button variant="destructive" onClick={confirmBlockCustomer}>
                                    Block
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </div>
    );
}
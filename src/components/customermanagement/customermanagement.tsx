import { useState } from 'react';
import { ArrowUpDown, PlusCircleIcon, SearchIcon, MoreVertical, ListFilter, Lock, User, AlertTriangle, X } from 'lucide-react';
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';

export type Customer = {
    id: string;
    customerId: string;
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
            customerId: 'C-1234567',
            firstName: 'Margaret',
            lastName: 'Ademola',
            meterNumber: '62501021223',
            accountNumber: '96844839930',
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
            customerId: 'C-1234567',
            firstName: 'Margaret',
            lastName: 'Ademola',
            meterNumber: '6201021223',
            accountNumber: '076403094494',
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
            customerId: 'C-1234567',
            firstName: 'Margaret',
            lastName: 'Ademola',
            meterNumber: '6201021223',
            accountNumber: '8993300282',
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
    const [isConfirmBlockDialogOpen, setIsConfirmBlockDialogOpen] = useState(false); // New state for confirmation dialog
    const [customerToBlock, setCustomerToBlock] = useState<Customer | null>(null);
    const [blockReason, setBlockReason] = useState("");

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
        if (customerToBlock && blockReason) {
            // Implement block logic here (e.g., update customer status or remove)
            console.log(`Blocking customer ${customerToBlock.firstName} for reason: ${blockReason}`);
            setCustomers(customers.filter((c) => c.id !== customerToBlock.id)); // Example: Remove customer
            setIsConfirmBlockDialogOpen(false);
            setIsBlockDialogOpen(false);
            setCustomerToBlock(null);
            setBlockReason("");
        }
    };

    const blockReasons = [
        "Abusive behavior",
        "Spam messages",
        "Fraudulent activity",
        "Policy violation",
        "Other",
    ];

    return (
        <div className="h-full overflow-hidden flex flex-col text-black">
            <div className="p-6 flex-grow">
                <h1 className="text-2xl mb-6 font-bold">Customers</h1>
                <div className="flex justify-between items-center mb-6">
                    <p className="text-sm text-muted-foreground">
                        Manage and access customer records.
                    </p>
                    <div className="flex gap-4">
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
                                        customerId: newCustomer.customerId ?? "",
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
                                    <div className="flex items-center gap-2 text-center">
                                        <input
                                            type="checkbox"
                                            checked={
                                                selectedCustomers.length === filteredCustomers.length &&
                                                filteredCustomers.length > 0
                                            }
                                            onChange={toggleSelectAll}
                                            className="border-[rgba(228,231,236,1)]"
                                        />
                                        <span>S/N</span>
                                    </div>
                                </TableHead>
                                <TableHead onClick={() => requestSort('customerId')} className='text-center'>
                                    Customer ID
                                </TableHead>
                                <TableHead onClick={() => requestSort('firstName')} className='text-center'>
                                    First Name
                                </TableHead>
                                <TableHead onClick={() => requestSort('lastName')} className='text-center'>
                                    Last Name
                                </TableHead>
                                <TableHead onClick={() => requestSort('phoneNumber')} className='text-center'>
                                    Phone Number
                                </TableHead>
                                <TableHead onClick={() => requestSort('address')} className='text-center'>
                                    Address
                                </TableHead>
                                <TableHead onClick={() => requestSort('location')} className='text-center'>
                                    City
                                </TableHead>
                                <TableHead onClick={() => requestSort('location')} className='text-center'>
                                    State
                                </TableHead>
                                <TableHead onClick={() => requestSort('status')} className='text-center'>
                                    Status
                                </TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedCustomers.map((customer, index) => (
                                <TableRow key={customer.id} className="hover:bg-muted/50">
                                    <TableCell className='text-center'>
                                        <div className='flex items-center gap-2'>
                                            <input
                                                type="checkbox"
                                                checked={selectedCustomers.includes(customer.id)}
                                                onChange={() => toggleCustomerSelection(customer.id)}
                                                className="border-[rgba(228,231,236,1)]"
                                            />
                                            <span>{startIndex + index + 1}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className='text-center'>{customer.customerId}</TableCell>
                                    <TableCell className='text-center'>{customer.firstName}</TableCell>
                                    <TableCell className='text-center'>{customer.lastName}</TableCell>
                                    <TableCell className='text-center'>{customer.phoneNumber}</TableCell>
                                    <TableCell className='text-center'>{customer.address}</TableCell>
                                    <TableCell className='text-center'>{customer.city}</TableCell>
                                    <TableCell className='text-center'>{customer.state}</TableCell>
                                    <TableCell className='text-center'>
                                        <span
                                            className={
                                                customer.status === 'Assigned'
                                                    ? 'text-[#059E40] bg-[#E9FBF0] rounded-full px-1.5 py-1.5'
                                                    : 'text-[#F50202] bg-[#FBE9E9] rounded-full px-1.5 py-1.5'
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
                                            <DropdownMenuContent align="center" className="w-fit cursor-pointer">
                                                <DropdownMenuItem
                                                    onSelect={() => {
                                                        setEditingCustomer(customer);
                                                        setIsEditDialogOpen(true);
                                                    }}
                                                    className='w-fit'
                                                >
                                                    <div className="flex items-center w-fit gap-2">
                                                        <User size={14} />
                                                        <span className='cursor-pointer w-fit'>Edit Customer</span>
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
                                            customerId: editingCustomer.customerId,
                                            meterNumber: updatedCustomer.meterNumber ?? editingCustomer.meterNumber,
                                            location: updatedCustomer.city ?? editingCustomer.location,
                                            address: updatedCustomer.address ?? `${updatedCustomer.streetName}, ${updatedCustomer.city}`,
                                            status: editingCustomer.status,
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
                    <>
                        {/* First Dialog: Select Block Reason */}
                        <AlertDialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
                            <AlertDialogContent className="bg-white max-w-sm rounded-xl p-10 border-gray-500 h-fit">
                                <AlertDialogCancel asChild>
                                    <button
                                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                                        onClick={() => {
                                            setIsBlockDialogOpen(false);
                                            setBlockReason("");
                                        }}
                                    >
                                        <X size={20} className="text-black cursor-pointer" />
                                    </button>
                                </AlertDialogCancel>

                                <div className="flex flex-col space-y-4 mt-10">
                                    <AlertDialogHeader className="space-y-1">
                                        <AlertDialogTitle className="text-lg font-semibold">
                                            Block {customerToBlock.firstName}
                                        </AlertDialogTitle>
                                    </AlertDialogHeader>

                                    {/* Reason Select Dropdown */}
                                    <div className="space-y-2">
                                        <label htmlFor="blockReason" className="text-sm font-medium text-gray-700">
                                            Reason
                                        </label>
                                        <select
                                            id="blockReason"
                                            value={blockReason}
                                            onChange={(e) => setBlockReason(e.target.value)}
                                            className="w-full p-2 border-gray-300 rounded-md focus:ring-gray-300 focus:border-gray-300"
                                            required
                                        >
                                            <option value="">Select reason to block</option>
                                            {blockReasons.map((reason) => (
                                                <option key={reason} value={reason}>
                                                    {reason}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <AlertDialogFooter className="flex justify-between pt-4">
                                        <div className="flex justify-start w-1/2">
                                            <AlertDialogCancel
                                                className="border border-red-600 text-red-600 hover:bg-gray-50 px-4 py-2 rounded-md font-medium cursor-pointer"
                                                onClick={() => {
                                                    setIsBlockDialogOpen(false);
                                                    setBlockReason("");
                                                }}
                                            >
                                                Cancel
                                            </AlertDialogCancel>
                                        </div>
                                        <div className="flex justify-end w-1/2">
                                            <AlertDialogAction
                                                onClick={() => {
                                                    if (!blockReason) {
                                                        alert("Please select a reason for blocking.");
                                                        return;
                                                    }
                                                    setIsConfirmBlockDialogOpen(true); // Open confirmation dialog
                                                }}
                                                className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md font-medium cursor-pointer"
                                                disabled={!blockReason}
                                            >
                                                Block
                                            </AlertDialogAction>
                                        </div>
                                    </AlertDialogFooter>
                                </div>
                            </AlertDialogContent>
                        </AlertDialog>

                        {/* Second Dialog: Confirm Block Action */}
                        <AlertDialog open={isConfirmBlockDialogOpen} onOpenChange={setIsConfirmBlockDialogOpen}>
                            <AlertDialogContent className="max-w-sm rounded-xl p-6 border-[rgba(228,231,236,1)]">
                                <AlertDialogCancel asChild>
                                    <button
                                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                                        onClick={() => {
                                            setIsConfirmBlockDialogOpen(false);
                                            setBlockReason("");
                                        }}
                                    >
                                        <X size={20} />
                                    </button>
                                </AlertDialogCancel>
                                <div className="flex flex-col space-y-3 mt-8">
                                    <div className="w-full flex items-start">
                                        <div className="text-red-600 p-3 rounded-full w-16 h-16 ml-0">
                                            <AlertTriangle size={28} />
                                        </div>
                                    </div>
                                    <AlertDialogHeader className="space-y-1">
                                        <AlertDialogTitle className="text-lg font-semibold">
                                            Block Customer
                                        </AlertDialogTitle>
                                        <AlertDialogDescription className="text-gray-600">
                                            Are you sure you want to block {customerToBlock.firstName} for {blockReason}?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="w-full flex justify-between items-center pt-4 px-0">
                                        <div className="flex justify-start w-1/2">
                                            <AlertDialogCancel
                                                className="border border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 px-6 py-2 rounded-md font-medium"
                                                onClick={() => {
                                                    setIsConfirmBlockDialogOpen(false);
                                                    setBlockReason("");
                                                }}
                                            >
                                                Cancel
                                            </AlertDialogCancel>
                                        </div>
                                        <div className="flex justify-end w-1/2">
                                            <AlertDialogAction
                                                onClick={confirmBlockCustomer}
                                                className="bg-red-600 text-white hover:bg-red-700 px-6 py-2 rounded-md font-medium"
                                            >
                                                Block
                                            </AlertDialogAction>
                                        </div>
                                    </AlertDialogFooter>
                                </div>
                            </AlertDialogContent>
                        </AlertDialog>
                    </>
                )}
            </div>
        </div>
    );
}
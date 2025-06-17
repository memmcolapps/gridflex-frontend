"use client";
import { useState } from "react";
import { ArrowUpDown, PlusCircleIcon, SearchIcon, MoreVertical, ListFilter, Lock, User, AlertTriangle, X, Eye, Printer, ChevronDown } from "lucide-react";
import CustomerForm from "./customerform";
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter } from "@/components/ui/dialog";

export type Customer = {
    id: string;
    customerId: string;
    firstName: string;
    lastName: string;
    accountNumber: string;
    nin: string;
    phoneNumber: string;
    email: string;
    state: string;
    city: string;
    houseNo: string;
    streetName: string;
    meterNumber?: string;
    location?: string;
    address?: string;
    status?: "Active" | "Blocked" | "Inactive";
    operator?: string;
    valueAddedTax?: "Paying" | "Not Paying";
};

export default function CustomerManagement() {
    const [customers, setCustomers] = useState<Customer[]>([
        {
            id: "01",
            customerId: "C-1234567",
            firstName: "Margeret",
            lastName: "Ademola",
            meterNumber: "62501021223",
            accountNumber: "96844839930",
            location: "Lagos",
            phoneNumber: "0812354648",
            address: "Olowotedo, Mowe",
            status: "Inactive",
            nin: "0123456789",
            email: "margareta@gmail.com",
            state: "Lagos",
            city: "Obafemi Owode",
            houseNo: "4",
            streetName: "Olowotedo",
            operator: "Margaret",
            valueAddedTax: "Paying",
        },
        {
            id: "02",
            customerId: "C-1234567",
            firstName: "Margaret",
            lastName: "Ademola",
            meterNumber: "6201021223",
            accountNumber: "076403094494",
            location: "Lagos",
            phoneNumber: "0812354648",
            address: "Olowotedo, Mowe",
            status: "Active",
            nin: "012345678900",
            email: "margaret@gmail.com",
            state: "Lagos",
            city: "Lagos",
            houseNo: "Lagos",
            streetName: "KM 40, Lagos Ibadan Exp. way, Ogun",
            operator: "Ademola",
        },
        ...Array.from({ length: 10 }, (_, index) => ({
            id: String(index + 3).padStart(2, "0"),
            customerId: "C-1234567",
            firstName: "Margaret",
            lastName: "Ademola",
            meterNumber: "6201021223",
            accountNumber: "8993300282",
            location: "Lagos",
            phoneNumber: "0812354648",
            address: "Olowotedo, Mowe",
            status: (index % 2 === 0 ? "Blocked" : "Active") as "Active" | "Blocked",
            nin: "012345678900",
            email: "margaret@gmail.com",
            state: "Lagos",
            city: "Lagos",
            houseNo: "Lagos",
            streetName: "KM 40, Lagos Ibadan Exp. way, Ogun",
            operator: index % 2 === 0 ? "Margaret" : "Ademola",
            valueAddedTax: (index % 2 === 0 ? "Not Paying" : "Paying") as "Paying" | "Not Paying",
        })),
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Customer;
        direction: "ascending" | "descending";
    } | null>(null);
    const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
    const [isConfirmBlockDialogOpen, setIsConfirmBlockDialogOpen] = useState(false);
    const [customerToBlock, setCustomerToBlock] = useState<Customer | null>(null);
    const [blockReason, setBlockReason] = useState("");
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isMeterDialogOpen, setIsMeterDialogOpen] = useState(false);
    const [selectedMeterCustomer, setSelectedMeterCustomer] = useState<Customer | null>(null);

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
        let direction: "ascending" | "descending" = "ascending";
        if (sortConfig?.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    const sortedCustomers = () => {
        const sortableCustomers = [...customers];
        if (sortConfig !== null) {
            sortableCustomers.sort((a, b) => {
                if (!sortConfig) return 0;
                if ((a[sortConfig.key] ?? "") < (b[sortConfig.key] ?? "")) {
                    return sortConfig.direction === "ascending" ? -1 : 1;
                }
                if ((a[sortConfig.key] ?? "") > (b[sortConfig.key] ?? "")) {
                    return sortConfig.direction === "ascending" ? 1 : -1;
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
            (customer.meterNumber ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
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

    const handleViewMeter = (customer: Customer) => {
        setSelectedMeterCustomer(customer);
        setIsMeterDialogOpen(true);
    };

    const handleViewCustomer = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsViewDialogOpen(true);
    };

    const confirmBlockCustomer = () => {
        if (customerToBlock && blockReason) {
            console.log(`Blocking customer ${customerToBlock.firstName} for reason: ${blockReason}`);
            setCustomers(customers.filter((c) => c.id !== customerToBlock.id));
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
                                        status: "Unassigned" as "Active" | "Blocked" | "Inactive",
                                        operator: newCustomer.firstName,
                                        valueAddedTax: "Not Paying",
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
                <div className="h-4/6 overflow-auto">
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
                                <TableHead onClick={() => requestSort("customerId")} className="text-center">
                                    Customer ID
                                </TableHead>
                                <TableHead onClick={() => requestSort("firstName")} className="text-center">
                                    First Name
                                </TableHead>
                                <TableHead onClick={() => requestSort("lastName")} className="text-center">
                                    Last Name
                                </TableHead>
                                <TableHead onClick={() => requestSort("phoneNumber")} className="text-center">
                                    Phone Number
                                </TableHead>
                                <TableHead onClick={() => requestSort("address")} className="text-center">
                                    Address
                                </TableHead>
                                <TableHead onClick={() => requestSort("location")} className="text-center">
                                    City
                                </TableHead>
                                <TableHead onClick={() => requestSort("state")} className="text-center">
                                    State
                                </TableHead>
                                <TableHead onClick={() => requestSort("operator")} className="text-center">
                                    Operator
                                </TableHead>
                                <TableHead onClick={() => requestSort("status")} className="text-center">
                                    Status
                                </TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedCustomers.map((customer, index) => (
                                <TableRow
                                    key={customer.id}
                                    className="hover:bg-muted/50 cursor-pointer"
                                    onClick={() => handleViewCustomer(customer)}
                                >
                                    <TableCell className="text-center">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedCustomers.includes(customer.id)}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    toggleCustomerSelection(customer.id);
                                                }}
                                                className="border-[rgba(228,231,236,1)]"
                                            />
                                            <span>{startIndex + index + 1}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">{customer.customerId}</TableCell>
                                    <TableCell className="text-center">{customer.firstName}</TableCell>
                                    <TableCell className="text-center">{customer.lastName}</TableCell>
                                    <TableCell className="text-center">{customer.phoneNumber}</TableCell>
                                    <TableCell className="text-center">{customer.address}</TableCell>
                                    <TableCell className="text-center">{customer.city}</TableCell>
                                    <TableCell className="text-center">{customer.state}</TableCell>
                                    <TableCell className="text-center">{customer.operator}</TableCell>
                                    <TableCell className="text-center">
                                        <span
                                            className={
                                                customer.status === "Active"
                                                    ? "text-[#059E40] bg-[#E9FBF0] rounded-full px-1.5 py-1.5"
                                                    : customer.status === "Inactive"
                                                        ? "text-[#D97706] bg-[#FEF3C7] rounded-full px-1.5 py-1.5"
                                                        : "text-[#F50202] bg-[#FBE9E9] rounded-full px-1.5 py-1.5"
                                            }
                                        >
                                            {customer.status}
                                        </span>
                                    </TableCell>
                                    <TableCell onClick={(e) => e.stopPropagation()}>
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
                                                    className="w-fit"
                                                >
                                                    <div className="flex items-center w-fit gap-2">
                                                        <User size={14} />
                                                        <span className="cursor-pointer w-fit">Edit Customer</span>
                                                    </div>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onSelect={() => handleViewMeter(customer)}>
                                                    <div className="flex items-center w-full gap-2">
                                                        <Eye size={14} />
                                                        <span className="cursor-pointer">View Meter</span>
                                                    </div>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onSelect={() => handleBlockCustomer(customer)}>
                                                    <div className="flex items-center w-full gap-2">
                                                        <Lock size={14} />
                                                        <span className="cursor-pointer">Block</span>
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
                        onSave={(updatedCustomer: Customer) => {
                            setCustomers(
                                customers.map((c) =>
                                    c.id === editingCustomer.id
                                        ? {
                                            ...c,
                                            ...updatedCustomer,
                                            id: editingCustomer.id,
                                            customerId: editingCustomer.customerId,
                                            meterNumber: updatedCustomer.meterNumber ?? editingCustomer.meterNumber,
                                            location: updatedCustomer.city ?? editingCustomer.location,
                                            address: updatedCustomer.address ?? `${updatedCustomer.streetName}, ${updatedCustomer.city}`,
                                            status: editingCustomer.status,
                                            operator: updatedCustomer.operator ?? c.operator,
                                            valueAddedTax: updatedCustomer.valueAddedTax ?? c.valueAddedTax,
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

                {selectedCustomer && (
                    <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                        <DialogContent className="bg-white w-full h-fit p-6 rounded-lg border border-gray-200 max-w-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-semibold">View Details</DialogTitle>
                                <DialogClose className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer ring-gray-50">
                                </DialogClose>
                            </DialogHeader>
                            <div className="mt-4 space-y-2">
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">First Name:</Label>
                                    <p className="text-sm">{selectedCustomer.firstName}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Last Name:</Label>
                                    <p className="text-sm">{selectedCustomer.lastName}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Phone Number:</Label>
                                    <p className="text-sm">({selectedCustomer.phoneNumber.startsWith("+") ? "" : "+234"}) {selectedCustomer.phoneNumber}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">NIN:</Label>
                                    <p className="text-sm">{selectedCustomer.nin}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Email Address:</Label>
                                    <p className="text-sm">{selectedCustomer.email}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">State:</Label>
                                    <p className="text-sm">{selectedCustomer.state}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">City:</Label>
                                    <p className="text-sm">{selectedCustomer.city}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Street Name:</Label>
                                    <p className="text-sm">{selectedCustomer.streetName}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">House Number:</Label>
                                    <p className="text-sm">{selectedCustomer.houseNo}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Value Added Tax:</Label>
                                    <p className="text-sm">{selectedCustomer.valueAddedTax ?? "Not Paying"}</p>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}

                {customerToBlock && (
                    <>
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
                                        <X size={16} className="text-gray-700 cursor-pointer" />
                                    </button>
                                </AlertDialogCancel>

                                <div className="flex flex-col space-y-4 mt-10">
                                    <AlertDialogHeader className="space-y-1">
                                        <AlertDialogTitle className="text-lg font-semibold">
                                            Block {customerToBlock.firstName}
                                        </AlertDialogTitle>
                                    </AlertDialogHeader>

                                    <div className="space-y-2">
                                        <div className="w-full">
                                            <Label htmlFor="blockReason" className="text-sm font-medium text-gray-700">
                                                Reason
                                            </Label>
                                            <div>
                                                <div className="relative">
                                                    <select
                                                        id="blockReason"
                                                        value={blockReason}
                                                        onChange={(e) => setBlockReason(e.target.value)}
                                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-ring focus:border-ring bg-background text-foreground ring-gray-50/10"
                                                        required
                                                    >
                                                        <option value="">Select a reason to block</option>
                                                        {blockReasons.map((reason) => (
                                                            <option key={reason} value={reason}>
                                                                {reason}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
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
                                                    setIsConfirmBlockDialogOpen(true);
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
                                        <div>
                                            <AlertDialogTitle className="text-lg font-semibold">
                                                Block Customer
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to block {customerToBlock.firstName} for {blockReason}?
                                            </AlertDialogDescription>
                                        </div>
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
                                            <div>
                                                <AlertDialogAction
                                                    onClick={confirmBlockCustomer}
                                                    className="bg-red-600 text-white hover:bg-red-700 px-6 py-2 rounded-md font-medium"
                                                >
                                                    Block
                                                </AlertDialogAction>
                                            </div>
                                        </div>
                                    </AlertDialogFooter>
                                </div>
                            </AlertDialogContent>
                        </AlertDialog>
                    </>
                )}

                {selectedMeterCustomer && (
                    <Dialog open={isMeterDialogOpen} onOpenChange={setIsMeterDialogOpen}>
                        <DialogContent className="bg-white w-full min-w-[500px] h-fit p-6 rounded-lg">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-semibold flex items-center justify-between mt-8 -mb-4">
                                    {selectedMeterCustomer.firstName} {selectedMeterCustomer.lastName}
                                    <div>
                                        <Label className="text-sm font-medium text-gray-900 mt-2">
                                            Total Number of meters
                                        </Label>
                                        <h1 className="text-3xl font-bold text-gray-900 text-right">
                                            25
                                        </h1>
                                    </div>
                                </DialogTitle>
                                <DialogClose className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer">
                                </DialogClose>
                            </DialogHeader>
                            <div className="mt-4">
                                <p className="text-sm text-gray-600">
                                    C-{selectedMeterCustomer.accountNumber}
                                </p>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Account Number</TableHead>
                                            <TableHead>Meter Number</TableHead>
                                            <TableHead>Meter Category</TableHead>
                                            <TableHead>Feeder Line</TableHead>
                                            <TableHead>DSS</TableHead>
                                            <TableHead className="flex gap-1 items-center">Status <ChevronDown size={14} /></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {[
                                            { accountNumber: "620102123", meterNumber: "V-201021223", category: "Post paid", feeder: "ljeun", dss: "ljeun", status: "Active" },
                                            { accountNumber: "620102123", meterNumber: "V-201021223", category: "Post Paid", feeder: "ljeun", dss: "ljeun", status: "Active" },
                                            { accountNumber: "620102123", meterNumber: "620102123", category: "Post Paid", feeder: "ljeun", dss: "ljeun", status: "Active" },
                                            { accountNumber: "620102123", meterNumber: "620102123", category: "Prepaid", feeder: "ljeun", dss: "ljeun", status: "Active" },
                                            { accountNumber: "620102123", meterNumber: "620102123", category: "Prepaid", feeder: "ljeun", dss: "ljeun", status: "Deactivated" },
                                            { accountNumber: "620102123", meterNumber: "620102123", category: "Post Paid", feeder: "ljeun", dss: "ljeun", status: "Active" },
                                            { accountNumber: "620102123", meterNumber: "620102123", category: "-----", feeder: "-----", dss: "-----", status: "Active" },
                                        ].map((meter, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{meter.accountNumber}</TableCell>
                                                <TableCell>{meter.meterNumber}</TableCell>
                                                <TableCell>{meter.category}</TableCell>
                                                <TableCell>{meter.feeder}</TableCell>
                                                <TableCell>{meter.dss}</TableCell>
                                                <TableCell>
                                                    <span
                                                        className={
                                                            meter.status === "Active"
                                                                ? "text-[#059E40] bg-[#E9FBF0] rounded-full px-1.5 py-1.5"
                                                                : "text-[#F50202] bg-[#FBE9E9] rounded-full px-1.5 py-1.5"
                                                        }
                                                    >
                                                        {meter.status}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <DialogFooter className="flex justify-between mt-4">
                                    <Button
                                        variant="outline"
                                        className="border-[#161CCA] text-[#161CCA] hover:bg-[#161CCA]/10"
                                        onClick={() => setIsMeterDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="default"
                                        className="bg-[#161CCA] text-white hover:bg-[#161CCA]/90"
                                        onClick={() => {
                                            setIsMeterDialogOpen(false);
                                            setSelectedMeterCustomer(null);
                                        }}
                                        size={"lg"}
                                    >
                                        <Printer size={16} />
                                        Print
                                    </Button>
                                </DialogFooter>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </div>
    );
}
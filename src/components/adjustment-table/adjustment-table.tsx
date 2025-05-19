'use client';

import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    MoreVertical,
    PlusCircle,
    Search,
    ArrowUpDown,
    Download,
    Lock,
    Eye,
    Wallet,
    SquareArrowOutUpRight,
} from 'lucide-react';

interface Customer {
    id: number;
    name: string;
    meterNo: string;
    accountNo: string;
    balance: number;
}

interface Transaction {
    date: string;
    liabilityCause: string;
    liabilityCode: string;
    credit: number;
    debit: number;
    balance: number;
}

interface AdjustmentTableProps {
    type: 'credit' | 'debit';
}

const AdjustmentTable: React.FC<AdjustmentTableProps> = ({ type }) => {
    const [customers, setCustomers] = useState<Customer[]>([
        { id: 1, name: 'John Doe', meterNo: '6201021223', accountNo: '0159004612077', balance: 0 },
        { id: 2, name: 'John Doe', meterNo: '6201021223', accountNo: '0159004612077', balance: 500000 },
        { id: 3, name: 'John Doe', meterNo: '6201021223', accountNo: '0159004612077', balance: 500000 },
        { id: 4, name: 'John Doe', meterNo: '6201021223', accountNo: '0159004612077', balance: 500000 },
        { id: 5, name: 'John Doe', meterNo: '6201021223', accountNo: '0159004612077', balance: 500000 },
        { id: 6, name: 'John Doe', meterNo: '6201021223', accountNo: '0159004612077', balance: 500000 },
        { id: 7, name: 'John Doe', meterNo: '6201021223', accountNo: '0159004612077', balance: 500000 },
        { id: 8, name: 'John Doe', meterNo: '6201021223', accountNo: '0159004612077', balance: 500000 },
        { id: 9, name: 'John Doe', meterNo: '6201021223', accountNo: '0159004612077', balance: 500000 },
        { id: 10, name: 'John Doe', meterNo: '6201021223', accountNo: '0159004612077', balance: 500000 },
    ]);

    const [transactions] = useState<Transaction[]>([
        { date: '05-05-2025', liabilityCause: 'Electricity Deficit', liabilityCode: 'C90BQT', credit: 10000, debit: 10000, balance: 500000 },
        { date: '05-05-2025', liabilityCause: 'Null', liabilityCode: 'Null', credit: 10000, debit: 0, balance: 500000 },
        { date: '05-05-2025', liabilityCause: 'Electricity Deficit', liabilityCode: 'C90BQT', credit: 10000, debit: 10000, balance: 500000 },
        { date: '05-05-2025', liabilityCause: 'Null', liabilityCode: 'Null', credit: 10000, debit: 0, balance: 500000 },
    ]);

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isReconcileDialogOpen, setIsReconcileDialogOpen] = useState(false);
    const [isTransactionsDialogOpen, setIsTransactionsDialogOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
    const [dialogStep, setDialogStep] = useState<'initial' | 'fullForm'>('initial');
    const [meterNumber, setMeterNumber] = useState('');

    const filteredCustomers = customers.filter(
        (customer) =>
            customer.meterNo.includes(searchTerm) || customer.accountNo.includes(searchTerm)
    );

    const totalRows = filteredCustomers.length;
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, totalRows);
    const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

    const toggleSelectAll = () => {
        if (selectedCustomers.length === paginatedCustomers.length) {
            setSelectedCustomers([]);
        } else {
            setSelectedCustomers(paginatedCustomers.map((customer) => customer.id));
        }
    };

    const toggleCustomerSelection = (id: number) => {
        setSelectedCustomers((prev) =>
            prev.includes(id) ? prev.filter((customerId) => customerId !== id) : [...prev, id]
        );
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleProceed = () => {
        const customer = customers.find((c) => c.meterNo === meterNumber);
        if (customer) {
            setSelectedCustomer(customer);
            setDialogStep('fullForm'); // Navigate to the full form (Add Debit/Credit form)
        } else {
            alert('Meter number not found');
        }
    };

    const handleAddAdjustment = () => {
        setIsAddDialogOpen(false);
        setDialogStep('initial');
        setMeterNumber('');
    };

    const handleReconcileDebit = () => {
        setIsReconcileDialogOpen(false);
    };

    return (
        <div className="h-full overflow-hidden flex flex-col text-black">
            <div className="p-6 flex-grow">
                <h1 className="text-2xl mb-6 font-bold">{type === 'credit' ? 'Credit Adjustment' : 'Debit Adjustment'}</h1>
                <div className="flex justify-between items-center mb-6">
                    <p className="text-sm text-muted-foreground">
                        Set and manage account {type} here
                    </p>
                    <div className="flex gap-2">
                        <Button variant="outline" className="border-[#161CCA] text-[#161CCA] cursor-pointer">
                            <div className="flex items-center justify-center p-0.5">
                                <PlusCircle className="text-[#161CCA]" size={12} />
                            </div>
                            <span>Bulk Upload</span>
                        </Button>
                        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                            setIsAddDialogOpen(open);
                            if (!open) {
                                setDialogStep('initial');
                                setMeterNumber('');
                            }
                        }}>
                            <DialogTrigger asChild>
                                <Button className="flex items-center gap-2 bg-[#161CCA] hover:bg-[#121eb3] cursor-pointer">
                                    <div className="flex items-center justify-center p-0.5">
                                        <PlusCircle className="text-[#FEFEFE]" size={12} />
                                    </div>
                                    <span className="text-white">Add {type === 'credit' ? 'Credit' : 'Debit'}</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white text-black h-fit w-500">
                                <DialogHeader>
                                    <DialogTitle>Add {type === 'credit' ? 'Credit' : 'Debit'}</DialogTitle>
                                </DialogHeader>
                                {dialogStep === 'initial' ? (
                                    <div className="space-y-4 h-50">
                                        <div className="grid grid-cols-2 gap-4 mt-6 w-fit">
                                            <div className="space-y-2">
                                                <Label>Transact By</Label>
                                                <Select defaultValue="meterNumber">
                                                    <SelectTrigger className="w-55 border-[rgba(228,231,236,1)]">
                                                        <SelectValue placeholder="Select transaction type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="meterNumber">Meter Number</SelectItem>
                                                        <SelectItem value="accountNumber">Account Number</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Meter Number</Label>
                                                <Input
                                                    placeholder="6210009900"
                                                    value={meterNumber}
                                                    onChange={(e) => setMeterNumber(e.target.value)}
                                                    className="w-55 border-[rgba(228,231,236,1)]"
                                                />
                                            </div>
                                        </div>
                                        <Button onClick={handleProceed} disabled={!meterNumber.trim()}>
                                            Proceed
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label>First Name</Label>
                                                <Input defaultValue={selectedCustomer?.name.split(' ')[0] || 'John'} disabled />
                                            </div>
                                            <div>
                                                <Label>Last Name</Label>
                                                <Input defaultValue={selectedCustomer?.name.split(' ')[1] || 'Doe'} disabled />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label>Meter Number</Label>
                                                <Input defaultValue={selectedCustomer?.meterNo || '6201021223'} disabled />
                                            </div>
                                            <div>
                                                <Label>Account Number</Label>
                                                <Input defaultValue={selectedCustomer?.accountNo || '0159004612077'} disabled />
                                            </div>
                                        </div>
                                        {type === 'credit' && (
                                            <div>
                                                <Label>Liability Cause</Label>
                                                <Select>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select liability cause" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="bypass">Bypass</SelectItem>
                                                        <SelectItem value="meterRefund">Meter Refund</SelectItem>
                                                        <SelectItem value="outstandingDebit">Outstanding Debit</SelectItem>
                                                        <SelectItem value="electricityDeficit">Electricity Deficit</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}
                                        <div>
                                            <Label>Amount</Label>
                                            <Input placeholder="Enter amount" defaultValue="50000" />
                                        </div>
                                        <Button onClick={handleAddAdjustment}>
                                            {type === 'credit' ? 'Add Credit' : 'Add Debit'}
                                        </Button>
                                    </div>
                                )}
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                <div className='flex justify-between'>
                    <div className="flex items-center mb-6 gap-4 w-80">
                        <div className="relative flex-1">
                            <Search
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
                            <ArrowUpDown className="" strokeWidth={2.5} size={12} />
                            <Label htmlFor="sortCheckbox" className="cursor-pointer">
                                Sort
                            </Label>
                        </Button>
                    </div>
                    <div>
                        <Button variant="outline" className="gap-1 border-[#161CCA]">
                            <SquareArrowOutUpRight className="text-[#161CCA]" strokeWidth={2.5} size={12} />
                            <Label htmlFor="sortCheckbox" className="cursor-pointer text-[#161CCA]">
                                Export
                            </Label>
                        </Button>
                    </div>
                </div>

                <div className="h-4/6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[30px] pr-0">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={
                                                selectedCustomers.length === paginatedCustomers.length &&
                                                paginatedCustomers.length > 0
                                            }
                                            onChange={toggleSelectAll}
                                            className="border-[rgba(228,231,236,1)]"
                                        />
                                        <span>S/N</span>
                                    </div>
                                </TableHead>
                                <TableHead className='text-center'>Customer Name</TableHead>
                                <TableHead>Meter No.</TableHead>
                                <TableHead>Account No.</TableHead>
                                <TableHead>{type === 'credit' ? 'Credit Balance' : 'Debit Balance'}</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedCustomers.map((customer, index) => (
                                <TableRow key={customer.id} className="hover:bg-muted/50">
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedCustomers.includes(customer.id)}
                                                onChange={() => toggleCustomerSelection(customer.id)}
                                                className="border-[rgba(228,231,236,1)]"
                                            />
                                            <span>{startIndex + index + 1}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className='text-center'>{customer.name}</TableCell>
                                    <TableCell>{customer.meterNo}</TableCell>
                                    <TableCell>{customer.accountNo}</TableCell>
                                    <TableCell>
                                        <span
                                            className={
                                                type === 'credit'
                                                    ? 'text-[#059E40] bg-[#E9FBF0] rounded-full px-1.5 py-1.5'
                                                    : 'text-[#F50202] bg-[#FBE9E9] rounded-full px-1.5 py-1.5'
                                            }
                                        >

                                            {customer.balance.toLocaleString()}
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
                                                        setSelectedCustomer(customer);
                                                        setIsTransactionsDialogOpen(true);
                                                    }}
                                                >
                                                    <div className="flex items-center w-fit gap-2">
                                                        <Eye size={14} />
                                                        <span className="cursor-pointer">View Transactions</span>
                                                    </div>
                                                </DropdownMenuItem>
                                                {type === 'debit' && (
                                                    <DropdownMenuItem
                                                        onSelect={() => {
                                                            setSelectedCustomer(customer);
                                                            setIsReconcileDialogOpen(true);
                                                        }}
                                                    >
                                                        <div className="flex items-center w-fit gap-2">
                                                            <Wallet size={14} />
                                                            <span className="cursor-pointer">Reconcile Debit</span>
                                                        </div>
                                                    </DropdownMenuItem>
                                                )}
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
            </div>

            {/* Transactions Dialog */}
            <Dialog open={isTransactionsDialogOpen} onOpenChange={setIsTransactionsDialogOpen}>
                <DialogContent className="bg-white text-black w-500">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedCustomer?.name} - {selectedCustomer?.accountNo}
                        </DialogTitle>
                        <p>Outstanding Balance: {selectedCustomer?.balance}</p>
                    </DialogHeader>
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Liability Cause</TableHead>
                                <TableHead>Liability Code</TableHead>
                                <TableHead>Credit</TableHead>
                                <TableHead>Debit</TableHead>
                                <TableHead>Balance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((transaction, index) => (
                                <TableRow key={index}>
                                    <TableCell>{transaction.date}</TableCell>
                                    <TableCell>{transaction.liabilityCause}</TableCell>
                                    <TableCell>{transaction.liabilityCode}</TableCell>
                                    <TableCell>{transaction.credit.toLocaleString()}</TableCell>
                                    <TableCell>{transaction.debit.toLocaleString()}</TableCell>
                                    <TableCell>{transaction.balance.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="flex justify-between mt-4">
                        <Button variant="outline" onClick={() => setIsTransactionsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button>
                            <Download className="mr-2 h-4 w-4" /> Print
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Reconcile Debit Dialog */}
            {type === 'debit' && (
                <Dialog open={isReconcileDialogOpen} onOpenChange={setIsReconcileDialogOpen}>
                    <DialogContent className="bg-white text-black h-fit w-500">
                        <DialogHeader>
                            <DialogTitle>Reconcile Debit</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>First Name</Label>
                                    <Input defaultValue="John" disabled />
                                </div>
                                <div>
                                    <Label>Last Name</Label>
                                    <Input defaultValue="Doe" disabled />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Meter Number</Label>
                                    <Input defaultValue="6201021223" disabled />
                                </div>
                                <div>
                                    <Label>Account Number</Label>
                                    <Input defaultValue="0159004612077" disabled />
                                </div>
                            </div>
                            <div>
                                <Label>Amount</Label>
                                <Input placeholder="Enter amount" />
                            </div>
                            <Button onClick={handleReconcileDebit}>Reconcile Debit</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default AdjustmentTable;
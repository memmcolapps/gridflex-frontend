'use client';

import React, { useEffect, useState } from 'react';
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
    PlusCircle,
    Eye,
    SquareArrowOutUpRight,
    Printer,
    Wallet,
    MoreVertical,
} from 'lucide-react';
import { SearchControl, SortControl } from '../search-control';
import { ContentHeader } from '../ui/content-header';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

interface Customer {
    id: string | number;
    name: string;
    meterNo: string;
    accountNo: string;
    balance: number;
}

interface Transaction {
    date: string;
    liabilityCause: string;
    liabilityCode: string;
    credit: number | string;
    debit: number | string;
    balance: number;
}

interface AdjustmentTableProps {
    type: 'credit' | 'debit';
}

const AdjustmentTable: React.FC<AdjustmentTableProps> = ({ type }) => {
    const [customers] = useState<Customer[]>([
        { id: 1, name: 'John Doe', meterNo: '6201021223', accountNo: '0159004612077', balance: 0 },
        { id: 2, name: 'Jane Smith', meterNo: '6201021224', accountNo: '0159004612078', balance: 500000 },
        { id: 3, name: 'Alice Johnson', meterNo: '6201021225', accountNo: '0159004612079', balance: 500000 },
        { id: 4, name: 'Bob Brown', meterNo: '6201021226', accountNo: '0159004612080', balance: 500000 },
        { id: 5, name: 'Emma Davis', meterNo: '6201021227', accountNo: '0159004612081', balance: 500000 },
        { id: 6, name: 'Michael Lee', meterNo: '6201021228', accountNo: '0159004612082', balance: 500000 },
        { id: 7, name: 'Sarah Wilson', meterNo: '6201021229', accountNo: '0159004612083', balance: 500000 },
        { id: 8, name: 'David Clark', meterNo: '6201021230', accountNo: '0159004612084', balance: 500000 },
        { id: 9, name: 'Laura Martinez', meterNo: '6201021231', accountNo: '0159004612085', balance: 500000 },
        { id: 10, name: 'James Taylor', meterNo: '6201021232', accountNo: '0159004612086', balance: 500000 },
    ]);

    const [creditTransactions] = useState<Transaction[]>([
        { date: '05-05-2025', liabilityCause: 'Electricity Deficit', liabilityCode: 'CR1234', credit: 10000, debit: "", balance: 10000 },
        { date: '05-04-2025', liabilityCause: 'Null', liabilityCode: 'Null', credit: "", debit: 10000, balance: 0 },
        { date: '05-03-2025', liabilityCause: 'Electricity Deficit', liabilityCode: 'CR1234', credit: 10000, debit: "", balance: 10000 },
        { date: '05-02-2025', liabilityCause: 'Null', liabilityCode: 'Null', credit: "", debit: 10000, balance: 0 },
    ]);

    const [debitTransactions] = useState<Transaction[]>([
        { date: '05-05-2025', liabilityCause: 'Meter Refund', liabilityCode: 'DB1234', credit: "", debit: 500000, balance: 500000 },
        { date: '05-04-2025', liabilityCause: 'Null', liabilityCode: 'Null', credit: 100000, debit: "", balance: 400000 },
        { date: '05-03-2025', liabilityCause: 'Null', liabilityCode: 'Null', credit: 100000, debit: "", balance: 300000 },
        { date: '05-02-2025', liabilityCause: 'Null', liabilityCode: 'Null', credit: 100000, debit: "", balance: 200000 },
        { date: '05-01-2025', liabilityCause: 'Null', liabilityCode: 'Null', credit: 100000, debit: "", balance: 100000 },
        { date: '05-01-2025', liabilityCause: 'Null', liabilityCode: 'Null', credit: 100000, debit: "", balance: 100000 },
        { date: '05-01-2025', liabilityCause: 'Null', liabilityCode: 'Null', credit: 100000, debit: "", balance: 0 },
    ]);

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isReconcileDialogOpen, setIsReconcileDialogOpen] = useState(false);
    const [isTransactionsDialogOpen, setIsTransactionsDialogOpen] = useState(false);
    const [isNestedDialogOpen, setIsNestedDialogOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
    const [dialogStep, setDialogStep] = useState<'initial' | 'fullForm'>('initial');
    const [meterNumber, setMeterNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [liabilityCause, setLiabilityCause] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [meterNo, setMeterNo] = useState('');
    const [accountNo, setAccountNo] = useState('');
    const [reconcileAmount, setReconcileAmount] = useState('');

    const isDisabled = !amount.trim() || !liabilityCause;
    const isReconcileDisabled = !reconcileAmount.trim();

    const filteredCustomers = customers.filter(
        (customer) =>
            customer.meterNo.includes(searchTerm) || customer.accountNo.includes(searchTerm)
    );

    const [sortConfig, setSortConfig] = useState<{
        key: keyof Customer | null;
        direction: 'asc' | 'desc';
    }>({ key: null, direction: 'asc' });

    const [, setProcessedData] = useState<Customer[]>(customers);

    useEffect(() => {
        applyFiltersAndSort(searchTerm, sortConfig.key, sortConfig.direction);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customers]);

    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
        applyFiltersAndSort(term, sortConfig.key, sortConfig.direction);
    };

    const handleSortChange = () => {
        const sortKey: keyof Customer = sortConfig.key ?? 'id';
        const newDirection = sortConfig.direction === 'asc' ? 'desc' : 'asc';

        setSortConfig({ key: sortKey, direction: newDirection });
        applyFiltersAndSort(searchTerm, sortKey, newDirection);
    };

    const applyFiltersAndSort = (
        term: string,
        sortBy: keyof Customer | null,
        direction: 'asc' | 'desc'
    ) => {
        let results = customers;
        if (term.trim() !== '') {
            results = customers.filter(
                (item) =>
                    item.name?.toLowerCase().includes(term.toLowerCase()) ||
                    item.meterNo?.toLowerCase().includes(term.toLowerCase()) ||
                    item.accountNo?.toLowerCase().includes(term.toLowerCase())
            );
        }

        if (sortBy) {
            results = [...results].sort((a, b) => {
                const aValue = a[sortBy] || '';
                const bValue = b[sortBy] || '';

                if (aValue < bValue) return direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        setProcessedData(results);
    };

    const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);
    const paginatedCustomers = filteredCustomers.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const toggleSelectAll = () => {
        if (selectedCustomers.length === paginatedCustomers.length) {
            setSelectedCustomers([]);
        } else {
            setSelectedCustomers(
                paginatedCustomers
                    .map((customer) => customer.id)
                    .filter((id): id is number => typeof id === 'number')
            );
        }
    };

    const toggleCustomerSelection = (id: number) => {
        setSelectedCustomers((prev) =>
            prev.includes(id) ? prev.filter((customerId) => customerId !== id) : [...prev, id]
        );
    };

    const handleProceed = () => {
        const customer = customers.find((c) => c.meterNo === meterNumber);
        if (customer) {
            setSelectedCustomer(customer);
            setFirstName(customer.name.split(' ')[0] ?? '');
            setLastName(customer.name.split(' ')[1] ?? '');
            setMeterNo(customer.meterNo);
            setAccountNo(customer.accountNo);
            setAmount('');
            setLiabilityCause('');
            setDialogStep('fullForm');
        } else {
            alert('Meter number not found');
        }
    };

    const handleAddAdjustment = () => {
        console.log('Form submitted:', { firstName, lastName, meterNo, accountNo, amount, liabilityCause });
        setIsAddDialogOpen(false);
        setDialogStep('initial');
        setMeterNumber('');
        setFirstName('');
        setLastName('');
        setMeterNo('');
        setAccountNo('');
        setAmount('');
        setLiabilityCause('');
    };

    const handleReconcileDebit = () => {
        console.log('Reconcile Debit submitted:', { amount: reconcileAmount });
        setIsReconcileDialogOpen(false);
        setReconcileAmount('');
    };

    const handlePrevious = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNext = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handleRowsPerPageChange = (value: string) => {
        setRowsPerPage(Number(value));
        setCurrentPage(1);
    };

    const handleRowClick = (customer: Customer, event: React.MouseEvent<HTMLTableRowElement>) => {
        const isCheckboxClicked = (event.target as HTMLElement).closest('input[type="checkbox"]');
        if (!isCheckboxClicked) {
            setSelectedCustomer(customer);
            setIsTransactionsDialogOpen(true);
        }
    };

    return (
        <div className="p-6 h-screen flex flex-col text-black">
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <ContentHeader
                        title={type === 'credit' ? 'Credit Adjustment' : 'Debit Adjustment'}
                        description={`Set and manage account ${type} here`}
                    />
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
                                setFirstName('');
                                setLastName('');
                                setMeterNo('');
                                setAccountNo('');
                                setAmount('');
                                setLiabilityCause('');
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
                            <DialogContent className="bg-white text-black h-fit w-full pointer-events-auto">
                                <DialogHeader>
                                    <DialogTitle>Add {type === 'credit' ? 'Credit' : 'Debit'}</DialogTitle>
                                </DialogHeader>
                                {dialogStep === 'initial' ? (
                                    <div className="space-y-4 h-fit">
                                        <div className="grid grid-cols-2 gap-4 mt-6 w-fit">
                                            <div className="space-y-4">
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
                                            <div className="space-y-4">
                                                <Label>Meter Number</Label>
                                                <Input
                                                    placeholder="6210009900"
                                                    value={meterNumber}
                                                    onChange={(e) => {
                                                        console.log('Meter Number input:', e.target.value);
                                                        setMeterNumber(e.target.value);
                                                    }}
                                                    className="w-55 border-[rgba(228,231,236,1)]"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end mt-8">
                                            <Button
                                                onClick={handleProceed}
                                                disabled={!meterNumber.trim()}
                                                className={`text-white ${!meterNumber.trim()
                                                    ? 'bg-[#A2A4EA] hover:bg-[#A2A4EA] cursor-not-allowed'
                                                    : 'bg-[#161CCA] hover:bg-[#121eb3] cursor-pointer'
                                                    }`}
                                            >
                                                Proceed
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4 p-2">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-4">
                                                <Label>First Name</Label>
                                                <Input
                                                    value={firstName}
                                                    onChange={(e) => {
                                                        console.log('First Name input:', e.target.value);
                                                        setFirstName(e.target.value);
                                                    }}
                                                    placeholder="Enter first name"
                                                    className="border-[rgba(228,231,236,1)]"
                                                    disabled
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <Label>Last Name</Label>
                                                <Input
                                                    value={lastName}
                                                    onChange={(e) => {
                                                        console.log('Last Name input:', e.target.value);
                                                        setLastName(e.target.value);
                                                    }}
                                                    placeholder="Enter last name"
                                                    className="border-[rgba(228,231,236,1)]"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-4">
                                                <Label>Meter Number</Label>
                                                <Input
                                                    value={meterNo}
                                                    onChange={(e) => {
                                                        console.log('Meter Number input:', e.target.value);
                                                        setMeterNo(e.target.value);
                                                    }}
                                                    placeholder="Enter meter number"
                                                    className="border-[rgba(228,231,236,1)]"
                                                    disabled
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <Label>Account Number</Label>
                                                <Input
                                                    value={accountNo}
                                                    onChange={(e) => {
                                                        console.log('Account Number input:', e.target.value);
                                                        setAccountNo(e.target.value);
                                                    }}
                                                    placeholder="Enter account number"
                                                    className="border-[rgba(228,231,236,1)]"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <Label>Liability Cause</Label>
                                            <Select
                                                value={liabilityCause}
                                                onValueChange={(value) => {
                                                    console.log('Liability Cause selected:', value);
                                                    setLiabilityCause(value);
                                                }}
                                            >
                                                <SelectTrigger className="border-[rgba(228,231,236,1)] w-full">
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
                                        <div className="space-y-4">
                                            <Label>Amount</Label>
                                            <Input
                                                placeholder="Enter amount"
                                                value={amount}
                                                onChange={(e) => {
                                                    console.log('Amount input:', e.target.value);
                                                    setAmount(e.target.value);
                                                }}
                                                className="border-[rgba(228,231,236,1)]"
                                            />
                                        </div>
                                        <div className="w-full flex justify-end">
                                            <Button
                                                onClick={handleAddAdjustment}
                                                disabled={isDisabled}
                                                className={`text-white ${isDisabled
                                                    ? 'bg-[#A2A4EA] hover:bg-[#A2A4EA] cursor-not-allowed'
                                                    : 'bg-[#161CCA] hover:bg-[#121eb3] cursor-pointer'
                                                    }`}
                                            >
                                                Add {type === 'credit' ? 'Credit' : 'Debit'}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="flex justify-between">
                    <div className="flex items-center mb-6 gap-4 w-80">
                        <div className="flex items-center gap-2">
                            <SearchControl
                                onSearchChange={handleSearchChange}
                                value={searchTerm}
                            />
                        </div>
                        <SortControl
                            onSortChange={handleSortChange}
                            currentSort={sortConfig.key ? `${sortConfig.key} (${sortConfig.direction})` : ''}
                        />
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
                <div className="flex-grow min-h-0 overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="h-16 py-4">
                                <TableHead className="w-[30px] pr-0 py-4">
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
                                <TableHead className="py-4">Account No.</TableHead>
                                <TableHead className="py-4">Customer ID</TableHead>
                                <TableHead className="py-4">Customer Name</TableHead>
                                <TableHead className="py-4">Meter No.</TableHead>
                                <TableHead className="py-4">{type === 'credit' ? 'Credit Balance' : 'Debit Balance'}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedCustomers.map((customer, index) => (
                                <TableRow 
                                    key={customer.id} 
                                    className="hover:bg-muted/50 cursor-pointer h-16 py-4"
                                    onClick={(event) => handleRowClick(customer, event)}
                                >
                                    <TableCell className="py-4 align-middle">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={typeof customer.id === 'number' && selectedCustomers.includes(customer.id)}
                                                onChange={() => {
                                                    if (typeof customer.id === 'number') {
                                                        toggleCustomerSelection(customer.id);
                                                    }
                                                }}
                                                className="border-[rgba(228,231,236,1)]"
                                            />
                                            <span>{(currentPage - 1) * rowsPerPage + index + 1}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 align-middle">{customer.accountNo}</TableCell>
                                    <TableCell className="py-4 align-middle">{customer.id}</TableCell>
                                    <TableCell className="py-4 align-middle">{customer.name}</TableCell>
                                    <TableCell className="py-4 align-middle">{customer.meterNo}</TableCell>
                                    <TableCell className="py-4 align-middle">
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
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <Pagination className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">Rows per page</span>
                        <Select
                            value={rowsPerPage.toString()}
                            onValueChange={handleRowsPerPageChange}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={rowsPerPage.toString()} />
                            </SelectTrigger>
                            <SelectContent
                                position="popper"
                                side="top"
                                align="center"
                                className="mb-1 ring-gray-50"
                            >
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="24">24</SelectItem>
                                <SelectItem value="48">48</SelectItem>
                            </SelectContent>
                        </Select>
                        <span className="text-sm font-medium">
                            {(currentPage - 1) * rowsPerPage + 1}-
                            {Math.min(currentPage * rowsPerPage, filteredCustomers.length)} of {filteredCustomers.length}
                        </span>
                    </div>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handlePrevious();
                                }}
                                aria-disabled={currentPage === 1}
                            />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleNext();
                                }}
                                aria-disabled={currentPage === totalPages}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

            <Dialog open={isTransactionsDialogOpen} onOpenChange={setIsTransactionsDialogOpen}>
                <DialogContent className="bg-white text-black !w-[700px] !max-w-none h-fit border-gray-500" onClick={() => {
                    const el = document.querySelector('.bg-white.text-black') as HTMLElement | null;
                    if (el) {
                        console.log('Dialog width:', el?.offsetWidth);
                    }
                }}>
                    <DialogHeader>
                        <div className="flex justify-between mt-8 p-4">
                            <div className="flex flex-col space-y-4">
                                <DialogTitle className="text-3xl font-semibold">
                                    {selectedCustomer?.name}
                                </DialogTitle>
                                <p className="text-sm text-muted-foreground">
                                    {selectedCustomer?.accountNo}
                                </p>
                            </div>
                            <div className="flex flex-col text-right space-y-4">
                                <span className="text-md">Outstanding Balance</span>
                                <p className="text-2xl font-semibold text-muted-foreground">
                                    {selectedCustomer?.balance?.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="overflow-x-hidden">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow className="h-16 py-4">
                                    <TableHead className="w-fit pr-0 py-4">
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
                                    <TableHead className="w-fit py-4">Liability Name</TableHead>
                                    <TableHead className="w-fit py-4">Liability Code</TableHead>
                                    <TableHead className="py-4">{type === 'credit' ? 'Credit Balance' : 'Debit Balance'}</TableHead>
                                    <TableHead className="py-4">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {(type === 'credit' ? creditTransactions : debitTransactions).map((transaction, index) => (
                                    <TableRow key={index} className="h-16 py-4">
                                        <TableCell className="py-4 align-middle">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        selectedCustomer !== null &&
                                                        typeof selectedCustomer.id === 'number' &&
                                                        selectedCustomers.includes(selectedCustomer.id)
                                                    }
                                                    onChange={() => {
                                                        if (
                                                            selectedCustomer !== null &&
                                                            typeof selectedCustomer.id === 'number'
                                                        ) {
                                                            toggleCustomerSelection(selectedCustomer.id);
                                                        }
                                                    }}
                                                    className="border-[rgba(228,231,236,1)]"
                                                />
                                                <span>{(currentPage - 1) * rowsPerPage + index + 1}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 align-middle">{transaction.liabilityCause}</TableCell>
                                        <TableCell className="py-4 align-middle">{transaction.liabilityCode}</TableCell>
                                        <TableCell className="py-4 align-middle">
                                            {typeof transaction.credit === 'number' && transaction.credit !== 0 ? (
                                                <span className={type === 'credit' ? 'text-[#059E40] bg-[#E9FBF0] rounded-full px-1.5 py-1.5' : 'text-[#F50202] bg-[#FBE9E9] rounded-full px-1.5 py-1.5'}>
                                                    {transaction.credit.toLocaleString()}
                                                </span>
                                            ) : (
                                                typeof transaction.debit === 'number' && transaction.debit !== 0 ? (
                                                    <span className={type === 'credit' ? 'text-[#059E40] bg-[#E9FBF0] rounded-full px-1.5 py-1.5' : 'text-[#F50202] bg-[#FBE9E9] rounded-full px-1.5 py-1.5'}>
                                                    {transaction.debit.toLocaleString()}
                                                    </span>
                                                ) : (
                                                    '0'
                                                )
                                            )}
                                        </TableCell>
                                        <TableCell className="py-4 align-middle">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-2 cursor-pointer">
                                                        <MoreVertical size={14} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="center" className="w-fit cursor-pointer">
                                                    <DropdownMenuItem
                                                        onSelect={() => {
                                                            setSelectedTransaction(transaction);
                                                            setIsNestedDialogOpen(true);
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
                                                                setSelectedCustomer(selectedCustomer);
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
                    <div className="flex justify-between mt-4">
                        <Button variant="outline" onClick={() => setIsTransactionsDialogOpen(false)} className="border-[#161CCA] text-[#161CCA] cursor-pointer">
                            Cancel
                        </Button>
                        <Button className="bg-[#161CCA] text-white border-[#161CCA] cursor-pointer">
                            <Printer size={14} /> Print
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isNestedDialogOpen} onOpenChange={setIsNestedDialogOpen}>
                <DialogContent className="bg-white text-black !w-[700px] !max-w-none h-fit border-gray-500">
                    <DialogHeader>
                        <div className="flex justify-between mt-8 p-4">
                            <div className="flex flex-col space-y-4">
                                <DialogTitle className="text-2xl font-semibold">
                                    {selectedCustomer?.name}
                                </DialogTitle>
                                <p className="text-sm text-muted-foreground">
                                    {selectedCustomer?.accountNo}
                                </p>
                            </div>
                            <div className="flex flex-col text-right space-y-4">
                                <span className="text-md">Outstanding Balance</span>
                                <p className="text-2xl font-semibold text-muted-foreground">
                                    {selectedCustomer?.balance?.toLocaleString() ?? '0'}
                                </p>
                            </div>
                        </div>
                        <p className="text-sm ml-4 mb-4">{selectedTransaction?.liabilityCause}: {selectedTransaction?.liabilityCode}</p>
                    </DialogHeader>
                    <div className="overflow-x-hidden">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow className="h-16 py-4">
                                    <TableHead className="w-[30px] pr-0 py-4">
                                        <input
                                            type="checkbox"
                                            className="border-[rgba(228,231,236,1)]"
                                        />
                                    </TableHead>
                                    <TableHead className="py-4">Date</TableHead>
                                    <TableHead className="py-4">{type === 'credit' ? 'Credit' : 'Debit'}</TableHead>
                                    <TableHead className="py-4">{type === 'debit' ? 'Credit' : 'Debit'}</TableHead>
                                    <TableHead className="py-4">{type === 'credit' ? 'Credit Balance' : 'Debit Balance'}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {(type === 'credit' ? creditTransactions : debitTransactions).map((transaction, index) => (
                                    <TableRow key={index} className="h-16 py-4">
                                        <TableCell className="py-4 align-middle">
                                            <input
                                                type="checkbox"
                                                className="border-[rgba(228,231,236,1)]"
                                            />
                                            <span>{(currentPage - 1) * rowsPerPage + index + 1}</span>
                                        </TableCell>
                                        <TableCell className="py-4 align-middle">{transaction.date}</TableCell>
                                        <TableCell className="py-4 align-middle">
                                            {typeof transaction[type === 'credit' ? 'credit' : 'debit'] === 'number' && transaction[type === 'credit' ? 'credit' : 'debit'] !== 0 ? (
                                                <span className={type === 'credit' ? 'text-[#059E40] bg-[#E9FBF0] rounded-full px-2 py-1' : 'text-[#F50202] bg-[#FBE9E9] rounded-full px-2 py-1'}>
                                                    {transaction[type === 'credit' ? 'credit' : 'debit'].toLocaleString()}
                                                </span>
                                            ) : (
                                                '-'
                                            )}
                                        </TableCell>
                                        <TableCell className="py-4 align-middle">
                                            {typeof transaction[type === 'debit' ? 'credit' : 'debit'] === 'number' && transaction[type === 'debit' ? 'credit' : 'debit'] !== 0 ? (
                                                <span className={type === 'debit' ? 'text-[#059E40] bg-[#E9FBF0] rounded-full px-2 py-1' : 'text-[#F50202] bg-[#FBE9E9] rounded-full px-2 py-1'}>
                                                    -{transaction[type === 'debit' ? 'credit' : 'debit'].toLocaleString()}
                                                </span>
                                            ) : (
                                                '-'
                                            )}
                                        </TableCell>
                                        <TableCell className="py-4 align-middle">
                                            {typeof transaction.balance === 'number' ? (
                                                <span className={type === 'credit' ? 'text-[#059E40] bg-[#E9FBF0] rounded-full px-2 py-1' : 'text-[#F50202] bg-[#FBE9E9] rounded-full px-2 py-1'}>
                                                    {transaction.balance.toLocaleString()}
                                                </span>
                                            ) : (
                                                transaction.balance
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex justify-between mt-4 p-4">
                        <Button variant="outline" onClick={() => setIsNestedDialogOpen(false)} className="bg-transparent text-[#161CCA] border-[#161CCA] cursor-pointer">
                            Cancel
                        </Button>
                        <Button className="bg-[#161CCA] text-white border-[#161CCA] cursor-pointer">
                            <Printer size={14} /> Print
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {type === 'debit' && (
                <Dialog open={isReconcileDialogOpen} onOpenChange={(open) => {
                    setIsReconcileDialogOpen(open);
                    if (!open) {
                        setReconcileAmount('');
                    }
                }}>
                    <DialogContent className="bg-white text-black h-fit w-500">
                        <DialogHeader>
                            <DialogTitle>Reconcile Debit</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <Label>First Name</Label>
                                    <Input
                                        value={selectedCustomer?.name.split(' ')[0] ?? 'John'}
                                        className="border-[rgba(228,231,236,1)]"
                                        disabled
                                    />
                                </div>
                                <div className="space-y-4">
                                    <Label>Last Name</Label>
                                    <Input
                                        value={selectedCustomer?.name.split(' ')[1] ?? 'Doe'}
                                        className="border-[rgba(228,231,236,1)]"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <Label>Meter Number</Label>
                                    <Input
                                        value={selectedCustomer?.meterNo ?? '6201021223'}
                                        className="border-[rgba(228,231,236,1)]"
                                        disabled
                                    />
                                </div>
                                <div className="space-y-4">
                                    <Label>Account Number</Label>
                                    <Input
                                        value={selectedCustomer?.accountNo ?? '0159004612077'}
                                        className="border-[rgba(228,231,236,1)]"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <Label>Amount</Label>
                                <Input
                                    placeholder="Enter amount"
                                    value={reconcileAmount}
                                    onChange={(e) => {
                                        console.log('Reconcile Amount input:', e.target.value);
                                        setReconcileAmount(e.target.value);
                                    }}
                                    className="border-[rgba(228,231,236,1)]"
                                />
                            </div>
                            <div className="w-full flex justify-end">
                                <Button
                                    onClick={handleReconcileDebit}
                                    disabled={isReconcileDisabled}
                                    className={`text-white ${isReconcileDisabled
                                        ? 'bg-[#A2A4EA] hover:bg-[#A2A4EA] cursor-not-allowed'
                                        : 'bg-[#161CCA] hover:bg-[#121eb3] cursor-pointer'
                                        }`}
                                >
                                    Reconcile Debit
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default AdjustmentTable;
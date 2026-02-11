/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/adjustment-table.tsx
"use client";

import React, { useMemo, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlusCircle,
  Eye,
  SquareArrowOutUpRight,
  Printer,
  Wallet,
  MoreVertical,
  Loader2,
} from "lucide-react";
import { SearchControl, SortControl } from "../search-control";
import { ContentHeader } from "../ui/content-header";
import { usePermissions } from "@/hooks/use-permissions";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  useAllAdjustments,
  useSearchMeter,
  useCreateAdjustment,
  useReconcileDebit,
  useAllLiabilityCauses,
} from "@/hooks/use-adjustment";
import { Toaster, toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  type Customer,
  type Transaction,
  type AdjustmentTableProps,
  type Meter as MeterType,
  type AdjustmentPayload,
  type Payment,
} from "@/types/credit-debit";
import { Card } from "../ui/card";

const AdjustmentTable: React.FC<AdjustmentTableProps> = ({ type }) => {
  const { canEdit } = usePermissions();
  const queryClient = useQueryClient();
  const { data: allAdjustments, isLoading, error } = useAllAdjustments(type, 0, 100);

  const customers = useMemo(() => {
    if (!allAdjustments) return [];

    const group = new Map<string, Customer>();

    allAdjustments.forEach((adj) => {
      // Customer info is now directly on the adjustment
      const cust = adj.customer;
      const name = cust ? `${cust.firstname} ${cust.lastname}` : "N/A";
      const customerId = adj.customerId ?? 'N/A';
      const meterNo = adj.meterNumber ?? 'N/A';
      const accountNo = adj.accountNumber ?? 'N/A';
      // Use meter ID (adj.id) as unique key instead of customer ID
      const id = adj.id;

      // Get balance from debitCreditAdjustInfo array
      const debitInfo = adj.debitCreditAdjustInfo && adj.debitCreditAdjustInfo.length > 0 ? adj.debitCreditAdjustInfo[0] : null;
      const balance = debitInfo?.balance ?? 0;

      if (id && !group.has(id)) {
        group.set(id, {
          id,
          name,
          meterNo,
          accountNo,
          balance: 0,
        });
      }

      const current = id ? group.get(id) : undefined;
      if (current) {
        current.balance += balance;
      }
    });

    return Array.from(group.values());
  }, [allAdjustments]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isReconcileDialogOpen, setIsReconcileDialogOpen] = useState(false);
  const [isTransactionsDialogOpen, setIsTransactionsDialogOpen] = useState(false);
  const [isNestedDialogOpen, setIsNestedDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedAdjustmentId, setSelectedAdjustmentId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [dialogStep, setDialogStep] = useState<"initial" | "fullForm">("initial");

  const [meterInput, setMeterInput] = useState("");
  const [searchType, setSearchType] = useState<'meterNumber' | 'accountNumber'>('meterNumber');

  const { mutate: searchMeterMutate, isPending: isMeterLoading, error: meterError, reset: resetSearch } = useSearchMeter();

  const [selectedMeter, setSelectedMeter] = useState<MeterType | null>(null);

  const [amount, setAmount] = useState("");
  const [liabilityCause, setLiabilityCause] = useState("");
  const [reconcileAmount, setReconcileAmount] = useState("");

  const isAddDisabled = !amount.trim() || !liabilityCause || !selectedMeter;
  const isReconcileDisabled = !reconcileAmount.trim();

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Customer | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const processedData = useMemo(() => {
    let results = customers;
    if (searchTerm.trim() !== "") {
      results = customers.filter(
        (item) =>
          item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.meterNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.accountNo?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (sortConfig.key) {
      results = [...results].sort((a, b) => {
        const aValue = a[sortConfig.key!] ?? "";
        const bValue = b[sortConfig.key!] ?? "";

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return results;
  }, [customers, searchTerm, sortConfig]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleSortChange = () => {
    const sortKey: keyof Customer = sortConfig.key ?? "id";
    const newDirection = sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key: sortKey, direction: newDirection });
  };

  const totalPages = Math.ceil(processedData.length / rowsPerPage);
  const paginatedCustomers = processedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const toggleSelectAll = () => {
    if (selectedCustomers.length === paginatedCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(paginatedCustomers.map((customer) => customer.id));
    }
  };

  const toggleCustomerSelection = (id: string) => {
    setSelectedCustomers((prev) =>
      prev.includes(id) ? prev.filter((customerId) => customerId !== id) : [...prev, id],
    );
  };

  const createAdjustmentMutation = useCreateAdjustment();
  const reconcileDebitMutation = useReconcileDebit();

  const handleAddAdjustment = () => {
    if (!selectedMeter) return;
    const payload: AdjustmentPayload = {
      meterId: selectedMeter.id,
      liabilityCauseId: liabilityCause,
      amount: Number(amount),
      type,
    };
    createAdjustmentMutation.mutate(payload, {
      onSuccess: () => {
        setIsAddDialogOpen(false);
        setDialogStep("initial");
        setMeterInput("");
        setSelectedMeter(null);
        setAmount("");
        setLiabilityCause("");
        resetSearch();
      },
    });
  };

  const handleReconcileDebit = () => {
    if (!selectedAdjustmentId || !selectedCustomer) return;
    reconcileDebitMutation.mutate({
      debitCreditAdjustmentId: selectedAdjustmentId,
      amount: Number(reconcileAmount),
    }, {
      onSuccess: () => {
        setIsReconcileDialogOpen(false);
        setReconcileAmount("");
      }
    });
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

  const handleRowClick = (
    customer: Customer,
    event: React.MouseEvent<HTMLTableRowElement>,
  ) => {
    const isCheckboxClicked = (event.target as HTMLElement).closest(
      'input[type="checkbox"]',
    );
    if (!isCheckboxClicked) {
      setSelectedCustomer(customer);
      setIsTransactionsDialogOpen(true);
    }
  };

  const customerAdjustments = useMemo(() => {
    if (!selectedCustomer || !allAdjustments) return [];
    // Use meter ID (adj.id) to match the new grouping
    return allAdjustments.filter((adj) => adj.id === selectedCustomer.id);
  }, [selectedCustomer, allAdjustments]);

  const liabilityTransactions: Transaction[] = customerAdjustments.map((adj) => {
    // Get adjustment data from debitCreditAdjustInfo array
    const debitInfo = adj.debitCreditAdjustInfo && adj.debitCreditAdjustInfo.length > 0 ? adj.debitCreditAdjustInfo[0] : null;
    return {
      date: adj.createdAt?.split(' ')[0] ?? '',
      // Safely access name and code using optional chaining with a fallback
      liabilityCause: debitInfo?.liabilityCause?.name ?? 'N/A',
      liabilityCode: debitInfo?.liabilityCause?.code ?? 'N/A',
      credit: type === 'credit' ? debitInfo?.amount ?? '' : '',
      debit: type === 'debit' ? debitInfo?.amount ?? '' : '',
      balance: debitInfo?.balance ?? 0,
    };
  });

  const selectedAdjustment = useMemo(() => {
    if (!selectedAdjustmentId || !allAdjustments) return null;
    return allAdjustments.find((adj) => adj.id === selectedAdjustmentId);
  }, [selectedAdjustmentId, allAdjustments]);

  const nestedTransactions: Transaction[] = useMemo(() => {
    if (!selectedAdjustment) return [];

    const transactions: Transaction[] = [];

    // Get adjustment data from debitCreditAdjustInfo array
    const debitInfo = selectedAdjustment.debitCreditAdjustInfo && selectedAdjustment.debitCreditAdjustInfo.length > 0 ? selectedAdjustment.debitCreditAdjustInfo[0] : null;

    // Push the initial adjustment transaction
    transactions.push({
      date: selectedAdjustment.createdAt?.split(' ')[0] ?? '',
      liabilityCause: debitInfo?.liabilityCause?.name ?? 'N/A',
      liabilityCode: debitInfo?.liabilityCause?.code ?? 'N/A',
      credit: debitInfo?.type === 'credit' ? debitInfo?.amount ?? '' : '',
      debit: debitInfo?.type === 'debit' ? debitInfo?.amount ?? '' : '',
      balance: debitInfo?.amount ?? 0,
    });

    let runningBalance = debitInfo?.amount ?? 0;
    (debitInfo?.payment || [])
      .filter((pay): pay is Required<Payment> & { createdAt: string } => !!pay.createdAt)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .forEach((pay) => {
        runningBalance -= pay.credit;
        transactions.push({
          date: pay.createdAt?.split(' ')[0] ?? '',
          liabilityCause: 'Payment',
          liabilityCode: '',
          credit: pay.credit,
          debit: '',
          balance: runningBalance,
        });
      });

    return transactions;
  }, [selectedAdjustment]);

  const colSpan = 6;

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={colSpan} className="h-24 text-center">
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Fetching adjustment data...</p>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={colSpan} className="h-24 text-center">
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-lg font-medium text-red-500">Failed to load data</p>
              <p className="text-sm text-gray-400">Please check your network and try again.</p>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (paginatedCustomers.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={colSpan} className="h-24 text-center">
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-lg font-medium text-gray-500">No Adjustments Found</p>
              <p className="text-sm text-gray-400">Try adjusting your search or add a new adjustment to get started.</p>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return paginatedCustomers.map((customer, index) => (
      <TableRow
        key={customer.id}
        className="hover:bg-muted/50 h-16 cursor-pointer py-4"
        onClick={(event) => handleRowClick(customer, event)}
      >
        <TableCell className="py-4 align-middle">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedCustomers.includes(customer.id)}
              onChange={() => toggleCustomerSelection(customer.id)}
              className="border-[rgba(228,231,236,1)]"
            />
            <span>{(currentPage - 1) * rowsPerPage + index + 1}</span>
          </div>
        </TableCell>
        <TableCell className="py-4 align-middle">
          {customer.accountNo}
        </TableCell>
        <TableCell className="py-4 align-middle">
          {customer.id}
        </TableCell>
        <TableCell className="py-4 align-middle">
          {customer.name}
        </TableCell>
        <TableCell className="py-4 align-middle">
          {customer.meterNo}
        </TableCell>
        <TableCell className="py-4 align-middle">
          <span
            className={
              type === "credit"
                ? "rounded-full bg-[#E9FBF0] px-1.5 py-1.5 text-[#059E40]"
                : "rounded-full bg-[#FBE9E9] px-1.5 py-1.5 text-[#F50202]"
            }
          >
            {customer.balance.toLocaleString()}
          </span>
        </TableCell>
      </TableRow>
    ));
  };

  const isProceedButtonEnabled = meterInput.length > 0 && !isMeterLoading;

  const handleProceed = () => {
    if (isProceedButtonEnabled) {
      searchMeterMutate({ searchTerm: meterInput, searchType }, {
        onSuccess: (data) => {
          if (data.success) {
            setSelectedMeter(data.data);
            setDialogStep("fullForm");
          } else {
            toast.error(data.error);
          }
        },
        onError: (error) => {
          toast.error(error.message);
        }
      });
    }
  };

  const { data: liabilityCauses, isLoading: isLiabilityCausesLoading, isError: isLiabilityCausesError } = useAllLiabilityCauses();


  return (
    <div className="flex h-screen flex-col p-6 text-black">
      <div className="flex flex-grow flex-col">
        <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <ContentHeader
            title={type === "credit" ? "Credit Adjustment" : "Debit Adjustment"}
            description={`Set and manage account ${type} here`}
          />
          {canEdit && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="cursor-pointer border-[#161CCA] text-[#161CCA]"
              >
                <div className="flex items-center justify-center p-0.5">
                  <PlusCircle className="text-[#161CCA]" size={12} />
                </div>
                <span>Bulk Upload</span>
              </Button>
              <Dialog
                open={isAddDialogOpen}
                onOpenChange={(open) => {
                  setIsAddDialogOpen(open);
                  if (!open) {
                    setDialogStep("initial");
                    setMeterInput("");
                    setSelectedMeter(null);
                    setAmount("");
                    setLiabilityCause("");
                    resetSearch();
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button className="flex cursor-pointer items-center gap-2 bg-[#161CCA] hover:bg-[#121eb3]">
                    <div className="flex items-center justify-center p-0.5">
                      <PlusCircle className="text-[#FEFEFE]" size={12} />
                    </div>
                    <span className="text-white">
                      Add {type === "credit" ? "Credit" : "Debit"}
                    </span>
                  </Button>
                </DialogTrigger>
              <DialogContent className="pointer-events-auto h-fit w-full bg-white text-black">
                <DialogHeader>
                  <DialogTitle>
                    Add {type === "credit" ? "Credit" : "Debit"}
                  </DialogTitle>
                </DialogHeader>
                {dialogStep === "initial" ? (
                  <div className="h-fit space-y-4">
                    <div className="mt-6 grid w-fit grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <Label>Transact By</Label>
                        <Select defaultValue="meterNumber" onValueChange={(value) => setSearchType(value as 'meterNumber' | 'accountNumber')}>
                          <SelectTrigger className="w-55 border-[rgba(228,231,236,1)]">
                            <SelectValue placeholder="Select transaction type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="meterNumber">
                              Meter Number
                            </SelectItem>
                            <SelectItem value="accountNumber">
                              Account Number
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-4">
                        <Label>Meter Number</Label>
                        <div className="relative">
                          <Input
                            placeholder="6210009900"
                            value={meterInput}
                            onChange={(e) => setMeterInput(e.target.value)}
                            className="w-55 border-[rgba(228,231,236,1)]"
                          />
                          {isMeterLoading && (
                            <div className="absolute top-2 right-2">
                              <Loader2 className="animate-spin text-gray-400" size={14} />
                            </div>
                          )}
                          {meterError && meterInput.length > 0 && (
                            <p className="text-red-500 text-sm mt-2">{meterError.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex w-full justify-end">
                      <Button
                        onClick={handleProceed}
                        disabled={!isProceedButtonEnabled}
                        className={`text-white ${!isProceedButtonEnabled ? 'cursor-not-allowed bg-[#A2A4EA] hover:bg-[#A2A4EA]' : 'cursor-pointer bg-[#161CCA] hover:bg-[#121eb3]'}`}
                      >
                        {isMeterLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" size={14} />
                            Searching...
                          </>
                        ) : (
                          'Proceed'
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 p-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <Label>First Name</Label>
                        <Input
                          value={selectedMeter?.customer?.firstname ?? ""}
                          placeholder="Enter first name"
                          className="border-[rgba(228,231,236,1)]"
                          disabled
                        />
                      </div>
                      <div className="space-y-4">
                        <Label>Last Name</Label>
                        <Input
                          value={selectedMeter?.customer?.lastname ?? ""}
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
                          value={selectedMeter?.meterNumber ?? ""}
                          placeholder="Enter meter number"
                          className="border-[rgba(228,231,236,1)]"
                          disabled
                        />
                      </div>
                      <div className="space-y-4">
                        <Label>Account Number</Label>
                        <Input
                          value={selectedMeter?.accountNumber ?? ""}
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
                        onValueChange={setLiabilityCause}
                      >
                        <SelectTrigger className="w-full border-[rgba(228,231,236,1)]">
                          <SelectValue placeholder="Select liability cause" />
                        </SelectTrigger>
                        <SelectContent>
                          {isLiabilityCausesLoading ? (
                            <SelectItem value="" disabled>Loading...</SelectItem>
                          ) : isLiabilityCausesError || !liabilityCauses ? (
                            <SelectItem value="" disabled>Error fetching causes</SelectItem>
                          ) : (
                            liabilityCauses.map((cause) => (
                              <SelectItem key={cause.id} value={cause.id}>{cause.name}</SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-4">
                      <Label>Amount</Label>
                      <Input
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="border-[rgba(228,231,236,1)]"
                      />
                    </div>
                    <div className="flex w-full justify-end">
                      <Button
                        onClick={handleAddAdjustment}
                        disabled={isAddDisabled || createAdjustmentMutation.isPending}
                        className={`text-white ${isAddDisabled || createAdjustmentMutation.isPending
                          ? "cursor-not-allowed bg-[#A2A4EA] hover:bg-[#A2A4EA]"
                          : "cursor-pointer bg-[#161CCA] hover:bg-[#121eb3]"
                          }`}
                      >
                        {createAdjustmentMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          `Add ${type === "credit" ? "Credit" : "Debit"}`
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
          )}
        </div>

        <div className="flex justify-between">
          <div className="mb-6 flex w-80 items-center gap-4">
            <div className="flex items-center gap-2">
              <SearchControl
                onSearchChange={handleSearchChange}
                value={searchTerm}
              />
            </div>
            <SortControl
              onSortChange={handleSortChange}
              currentSort={
                sortConfig.key
                  ? `${sortConfig.key} (${sortConfig.direction})`
                  : ""
              }
            />
          </div>
          <div>
            <Button variant="outline" className="gap-1 border-[#161CCA]">
              <SquareArrowOutUpRight
                className="text-[#161CCA]"
                strokeWidth={2.5}
                size={12}
              />
              <Label
                htmlFor="sortCheckbox"
                className="cursor-pointer text-[#161CCA]"
              >
                Export
              </Label>
            </Button>
          </div>
        </div>
        <Card className="h-4/6 overflow-x-hidden border-none bg-transparent shadow-none">
          <Table>
            <TableHeader className="bg-transparent">
              <TableRow className="h-16 py-4">
                <TableHead className="w-[30px] py-4 pr-0">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={
                        selectedCustomers.length ===
                        paginatedCustomers.length &&
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
                <TableHead className="py-4">
                  {type === "credit" ? "Credit Balance" : "Debit Balance"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderTableBody()}
            </TableBody>
          </Table>
        </Card>

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
              {Math.min(currentPage * rowsPerPage, processedData.length)} of{" "}
              {processedData.length}
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

      <Dialog
        open={isTransactionsDialogOpen}
        onOpenChange={setIsTransactionsDialogOpen}
      >
        <DialogContent
          className="h-fit !w-[700px] !max-w-none border-gray-500 bg-white text-black"
        >
          <DialogHeader>
            <div className="mt-8 flex justify-between p-4">
              <div className="flex flex-col space-y-4">
                <DialogTitle className="text-3xl font-semibold">
                  {selectedCustomer?.name}
                </DialogTitle>
                <p className="text-muted-foreground text-sm">
                  {selectedCustomer?.accountNo}
                </p>
              </div>
              <div className="flex flex-col space-y-4 text-right">
                <span className="text-md">Outstanding Balance</span>
                <p className="text-muted-foreground text-2xl font-semibold">
                  {selectedCustomer?.balance?.toLocaleString()}
                </p>
              </div>
            </div>
          </DialogHeader>
          <div className="overflow-x-hidden">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="h-16 py-4">
                  <TableHead className="w-fit py-4 pr-0">
                    <div className="flex items-center gap-2">
                      <span>S/N</span>
                    </div>
                  </TableHead>
                  <TableHead className="w-fit py-4">Liability Name</TableHead>
                  <TableHead className="w-fit py-4">Liability Code</TableHead>
                  <TableHead className="py-4">
                    {type === "credit" ? "Credit Balance" : "Debit Balance"}
                  </TableHead>
                  <TableHead className="py-4">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {liabilityTransactions.map((transaction, index) => (
                  <TableRow key={index} className="h-16 py-4">
                    <TableCell className="py-4 align-middle">
                      <div className="flex items-center gap-2">
                        <span>
                          {index + 1}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 align-middle">
                      {transaction.liabilityCause}
                    </TableCell>
                    <TableCell className="py-4 align-middle">
                      {transaction.liabilityCode}
                    </TableCell>
                    <TableCell className="py-4 align-middle">
                      {typeof transaction.balance === "number" ? (
                        <span
                          className={
                            type === "credit"
                              ? "rounded-full bg-[#E9FBF0] px-1.5 py-1.5 text-[#059E40]"
                              : "rounded-full bg-[#FBE9E9] px-1.5 py-1.5 text-[#F50202]"
                          }
                        >
                          {transaction.balance.toLocaleString()}
                        </span>
                      ) : (
                        "0"
                      )}
                    </TableCell>
                    <TableCell className="py-4 align-middle">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 cursor-pointer p-2 focus:ring-gray-300/2"
                          >
                            <MoreVertical size={14} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="center"
                          className="w-fit cursor-pointer"
                        >
                          <DropdownMenuItem
                            onSelect={() => {
                              const adjId = customerAdjustments[index]?.id;
                              setSelectedAdjustmentId(adjId ?? null);
                              setIsTransactionsDialogOpen(false);
                              setIsNestedDialogOpen(true);
                            }}
                          >
                            <div className="flex w-fit items-center gap-2">
                              <Eye size={14} />
                              <span className="cursor-pointer">
                                View Transactions
                              </span>
                            </div>
                          </DropdownMenuItem>
                          {type === "debit" && (
                            <DropdownMenuItem
                              onSelect={() => {
                                const adjId = customerAdjustments[index]?.id;
                                setSelectedAdjustmentId(adjId ?? null);
                                setSelectedCustomer(selectedCustomer);
                                setIsReconcileDialogOpen(true);
                              }}
                            >
                              <div className="flex w-fit items-center gap-2">
                                <Wallet size={14} />
                                <span className="cursor-pointer">
                                  Reconcile Debit
                                </span>
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
          <div className="mt-4 flex justify-between">
            <Button
              variant="outline"
              onClick={() => setIsTransactionsDialogOpen(false)}
              className="cursor-pointer border-[#161CCA] text-[#161CCA]"
            >
              Cancel
            </Button>
            <Button className="cursor-pointer border-[#161CCA] bg-[#161CCA] text-white">
              <Printer size={14} /> Print
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isNestedDialogOpen}
        onOpenChange={(open) => {
          setIsNestedDialogOpen(open);
          if (!open) {
            setSelectedAdjustmentId(null);
          }
        }}
      >
        <DialogContent className="h-fit !w-[700px] !max-w-none border-gray-500 bg-white text-black">
          <DialogHeader>
            <div className="mt-8 flex justify-between p-4">
              <div className="flex flex-col space-y-4">
                <DialogTitle className="text-2xl font-semibold">
                  {selectedCustomer?.name}
                </DialogTitle>
                <p className="text-muted-foreground text-sm">
                  {selectedCustomer?.accountNo}
                </p>
              </div>
              <div className="flex flex-col space-y-4 text-right">
                <span className="text-md">Outstanding Balance</span>
                <p className="text-muted-foreground text-2xl font-semibold">
                  {selectedCustomer?.balance?.toLocaleString() ?? "0"}
                </p>
              </div>
            </div>
            {/* Fix applied here to prevent crash */}
            <p className="mb-4 ml-4 text-sm">
              {selectedAdjustment?.debitCreditAdjustInfo?.[0]?.liabilityCause?.name ?? 'N/A'}:{" "}
              {selectedAdjustment?.debitCreditAdjustInfo?.[0]?.liabilityCause?.code ?? 'N/A'}
            </p>
          </DialogHeader>
          <div className="overflow-x-hidden">
            <Table className="h-fit w-full">
              <TableHeader>
                <TableRow className="h-16 py-4">
                  <TableHead className="w-[30px] py-4 pr-0"></TableHead>
                  <TableHead className="py-4">Date</TableHead>
                  <TableHead className="py-4">
                    {type === "credit" ? "Credit" : "Debit"}
                  </TableHead>
                  <TableHead className="py-4">
                    {type === "debit" ? "Credit" : "Debit"}
                  </TableHead>
                  <TableHead className="py-4">
                    {type === "credit" ? "Credit Balance" : "Debit Balance"}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nestedTransactions.map((transaction, index) => (
                  <TableRow key={index} className="h-16 py-4">
                    <TableCell className="py-4 align-middle">
                      <span>{index + 1}</span>
                    </TableCell>
                    <TableCell className="py-4 align-middle">
                      {transaction.date}
                    </TableCell>
                    {type === "credit" ? (
                      <>
                        <TableCell className="py-4 align-middle">
                          {transaction.credit ? (
                            <span className="rounded-full bg-[#E9FBF0] px-2 py-1 text-[#059E40]">
                              {transaction.credit}
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="py-4 align-middle">
                          {transaction.debit ? (
                            <span className="rounded-full bg-[#FBE9E9] px-2 py-1 text-[#F50202]">
                              {transaction.debit}
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="py-4 align-middle">
                          {transaction.debit ? (
                            <span className="rounded-full bg-[#FBE9E9] px-2 py-1 text-[#F50202]">
                              {transaction.debit}
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="py-4 align-middle">
                          {transaction.credit ? (
                            <span className="rounded-full bg-[#E9FBF0] px-2 py-1 text-[#059E40]">
                              {transaction.credit}
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      </>
                    )}
                    <TableCell className="py-4 align-middle">
                      <span
                        className={
                          type === "credit"
                            ? "rounded-full bg-[#E9FBF0] px-2 py-1 text-[#059E40]"
                            : "rounded-full bg-[#FBE9E9] px-2 py-1 text-[#F50202]"
                        }
                      >
                        {transaction.balance.toLocaleString()}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex justify-between p-4">
            <Button
              variant="outline"
              onClick={() => setIsNestedDialogOpen(false)}
              className="cursor-pointer border-[#161CCA] bg-transparent text-[#161CCA]"
            >
              Cancel
            </Button>
            <Button className="cursor-pointer border-[#161CCA] bg-[#161CCA] text-white">
              <Printer size={14} /> Print
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {type === "debit" && (
        <Dialog
          open={isReconcileDialogOpen}
          onOpenChange={(open) => {
            setIsReconcileDialogOpen(open);
            if (!open) {
              setReconcileAmount("");
            }
          }}
        >
          <DialogContent className="h-fit w-500 bg-white text-black">
            <DialogHeader>
              <DialogTitle>Reconcile Debit</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Label>First Name</Label>
                  <Input
                    value={selectedCustomer?.name.split(" ")[0] ?? ""}
                    className="border-[rgba(228,231,236,1)]"
                    disabled
                  />
                </div>
                <div className="space-y-4">
                  <Label>Last Name</Label>
                  <Input
                    value={selectedCustomer?.name.split(" ")[1] ?? ""}
                    className="border-[rgba(228,231,236,1)]"
                    disabled
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Label>Meter Number</Label>
                  <Input
                    value={selectedCustomer?.meterNo ?? ""}
                    className="border-[rgba(228,231,236,1)]"
                    disabled
                  />
                </div>
                <div className="space-y-4">
                  <Label>Account Number</Label>
                  <Input
                    value={selectedCustomer?.accountNo ?? ""}
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
                  onChange={(e) => setReconcileAmount(e.target.value)}
                  className="border-[rgba(228,231,236,1)]"
                />
              </div>
              <div className="flex w-full justify-end">
                <Button
                  onClick={handleReconcileDebit}
                  disabled={isReconcileDisabled || reconcileDebitMutation.isPending}
                  className={`text-white ${isReconcileDisabled || reconcileDebitMutation.isPending
                    ? "cursor-not-allowed bg-[#A2A4EA] hover:bg-[#A2A4EA]"
                    : "cursor-pointer bg-[#161CCA] hover:bg-[#121eb3]"
                    }`}
                >
                  {reconcileDebitMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Reconciling...
                    </>
                  ) : (
                    `Reconcile Debit`
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <Toaster />
    </div>
  );
};

export default AdjustmentTable;
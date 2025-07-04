"use client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, Printer } from "lucide-react";
import { Card } from "../ui/card";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const VendingTable = () => {
    const transactions = [
        { sn: "01", accountNumber: "0159046127", meterNumber: "6201023", tokenType: "Credit Token", tariff: "Tariff A1", amount: "100,000", unitCost: "830.65", vat: "1595.35", units: "780.0", status: "Pending" },
        { sn: "02", accountNumber: "0159046127", meterNumber: "6201023", tokenType: "KCT", tariff: "Tariff A1", amount: "0", unitCost: "0", vat: "0", units: "0", status: "Pending" },
        { sn: "03", accountNumber: "0159046127", meterNumber: "6201023", tokenType: "Credit Token", tariff: "Tariff A1", amount: "100,000", unitCost: "830.65", vat: "1595.35", units: "780.0", status: "Pending" },
        { sn: "04", accountNumber: "0159046127", meterNumber: "6201023", tokenType: "Clear Tamper", tariff: "Tariff A1", amount: "0", unitCost: "0", vat: "0", units: "0", status: "Failed" },
        { sn: "05", accountNumber: "0159046127", meterNumber: "6201023", tokenType: "Credit Token", tariff: "Tariff A1", amount: "100,000", unitCost: "830.65", vat: "1595.35", units: "780.0", status: "Successful" },
        { sn: "06", accountNumber: "0159046127", meterNumber: "6201023", tokenType: "Clear Credit", tariff: "Tariff A1", amount: "0", unitCost: "0", vat: "0", units: "0", status: "Failed" },
        { sn: "07", accountNumber: "0159046127", meterNumber: "6201023", tokenType: "KCT/Clear Tam", tariff: "Tariff A1", amount: "0", unitCost: "0", vat: "0", units: "0", status: "Successful" },
        { sn: "08", accountNumber: "0159046127", meterNumber: "6201023", tokenType: "Compensation", tariff: "Tariff A1", amount: "100,000", unitCost: "830.65", vat: "1595.35", units: "780.0", status: "Successful" },
        { sn: "09", accountNumber: "0159046127", meterNumber: "6201023", tokenType: "Credit Token", tariff: "Tariff A1", amount: "0", unitCost: "0", vat: "0", units: "0", status: "Successful" },
        { sn: "10", accountNumber: "0159046127", meterNumber: "6201023", tokenType: "Credit Token", tariff: "Tariff A1", amount: "100,000", unitCost: "830.65", vat: "1595.35", units: "780.0", status: "Successful" },
        { sn: "11", accountNumber: "0159046127", meterNumber: "6201023", tokenType: "Credit Token", tariff: "Tariff A1", amount: "100,000", unitCost: "830.65", vat: "1595.35", units: "780.0", status: "Failed" },
        { sn: "12", accountNumber: "0159046127", meterNumber: "6201023", tokenType: "Credit Token", tariff: "Tariff A1", amount: "100,000", unitCost: "830.65", vat: "1595.35", units: "780.0", status: "Successful" },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pending":
                return "text-yellow-600 bg-yellow-100";
            case "Failed":
                return "text-red-600 bg-red-100";
            case "Successful":
                return "text-green-600 bg-green-100";
            default:
                return "";
        }
    };

    // Define the transaction type
    type Transaction = {
        sn: string;
        accountNumber: string;
        meterNumber: string;
        tokenType: string;
        tariff: string;
        amount: string;
        unitCost: string;
        vat: string;
        units: string;
        status: string;
    };

    // State to manage pagination
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);

    // Calculate total pages and paginated data
    const totalPages = Math.ceil(transactions.length / rowsPerPage);
    const paginatedTransactions = transactions.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    // Handle pagination controls
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

    // State to manage the selected transaction for reprint
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [showTokenDialog, setShowTokenDialog] = useState(false);

    const handleReprintToken = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setShowTokenDialog(true);
    };

    const getTitleCase = (type: string) => {
        const titleMap: Record<string, string> = {
            "Credit Token": "Credit Token",
            "KCT": "KCT",
            "Clear Tamper": "Clear Tamper",
            "Clear Credit": "Clear Credit",
            "KCT/Clear Tam": "KCT and Clear Tamper",
            "Compensation": "Compensation",
        };
        return titleMap[type] ?? type;
    };

    return (
        <div className="w-full">
            <Card className="mb-4 p-4 border-gray-100 rounded-lg shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>SN</TableHead>
                            <TableHead>Account Number</TableHead>
                            <TableHead>Meter Number</TableHead>
                            <TableHead>Token Type</TableHead>
                            <TableHead>Tariff</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Unit Cost</TableHead>
                            <TableHead>VAT</TableHead>
                            <TableHead>Units</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedTransactions.map((transaction) => (
                            <TableRow key={transaction.sn}>
                                <TableCell>{(currentPage - 1) * rowsPerPage + transactions.indexOf(transaction) + 1}</TableCell>
                                <TableCell>{transaction.accountNumber}</TableCell>
                                <TableCell>{transaction.meterNumber}</TableCell>
                                <TableCell>{transaction.tokenType}</TableCell>
                                <TableCell>{transaction.tariff}</TableCell>
                                <TableCell>{transaction.amount}</TableCell>
                                <TableCell>{transaction.unitCost}</TableCell>
                                <TableCell>{transaction.vat}</TableCell>
                                <TableCell>{transaction.units}</TableCell>
                                <TableCell>
                                    <span
                                        className={`px-2 py-1 rounded-full ${getStatusColor(transaction.status)}`}
                                    >
                                        {transaction.status}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="ring-gray-200/20 hover:bg-gray-100 focus:bg-gray-100 cursor-pointer"
                                            >
                                                <EllipsisVertical size={14} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                className="flex items-center gap-2 cursor-pointer"
                                                onClick={() => handleReprintToken(transaction)}
                                            >
                                                <Printer size= {14} />
                                                Reprint Token
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
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
                        {Math.min(currentPage * rowsPerPage, transactions.length)} of {transactions.length}
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
            {/* Token Details Dialog */}
            <Dialog open={showTokenDialog} onOpenChange={setShowTokenDialog}>
                <DialogContent className="w-full h-fit bg-white">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedTransaction && getTitleCase(selectedTransaction.tokenType)}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <p>Customer Name:</p>
                            <p>Ugorji Eucharia E</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <p>Meter Number:</p>
                            <p>{selectedTransaction?.meterNumber ?? "6201023"}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <p>Account No:</p>
                            <p>{selectedTransaction?.accountNumber ?? "01231459845"}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <p>Credit Type:</p>
                            <p>0</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <p>Operator:</p>
                            <p>Margaret</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <p>Transaction date:</p>
                            <p>2025-06-25 12:52 PM WAT</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <p>Receipt No:</p>
                            <p>{selectedTransaction?.sn ? `12${selectedTransaction.sn}` : "12711"}</p>
                        </div>
                        {selectedTransaction?.tokenType === "Credit Token" && (
                            <div className="grid grid-cols-2 gap-4">
                                <p>Credit Token:</p>
                                <p>1021 1255 0556 6336 66955</p>
                            </div>
                        )}
                        {selectedTransaction?.tokenType === "KCT" && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <p>KCT 1:</p>
                                    <p>4804 1025 0126 8956 7865</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <p>KCT 2:</p>
                                    <p>4804 1025 0126 8956 7865</p>
                                </div>
                            </>
                        )}
                        {selectedTransaction?.tokenType === "Clear Tamper" && (
                            <div className="grid grid-cols-2 gap-4">
                                <p>Clear Tamper:</p>
                                <p>1021 1255 0556 6336 6695</p>
                            </div>
                        )}
                        {selectedTransaction?.tokenType === "Clear Credit" && (
                            <div className="grid grid-cols-2 gap-4">
                                <p>Clear Credit:</p>
                                <p>1021 1255 0556 6336 6700</p>
                            </div>
                        )}
                        {selectedTransaction?.tokenType === "KCT/Clear Tam" && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <p>Clear Tamper:</p>
                                    <p>1021 1255 0556 6336 6695</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <p>KCT 1:</p>
                                    <p>4804 1025 0126 8956 7865</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <p>KCT 2:</p>
                                    <p>4804 1025 0126 8956 7865</p>
                                </div>
                            </>
                        )}
                        {selectedTransaction?.tokenType === "Compensation" && (
                            <div className="grid grid-cols-2 gap-4">
                                <p>Compensation Token:</p>
                                <p>9001 2345 6789 0123 4567</p>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end gap-4 mt-4">
                        <Button
                            variant="outline"
                            size="lg"
                            className="bg-[#161CCA] text-white cursor-pointer"
                            onClick={() => {
                                const printWindow = window.open('', '_blank', 'width=800,height=600');
                                if (printWindow) {
                                    printWindow.document.write(`
                                        <html>
                                            <head>
                                                <title>Token Receipt</title>
                                                <style>
                                                    body { font-family: Arial, sans-serif; padding: 20px; }
                                                    h2 { color: gray; text-align: center; }
                                                    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                                                    td { padding: 8px; border: 1px solid #ddd; }
                                                    .token-label { font-weight: bold; }
                                                    .token-value { font-size: 1.2em; letter-spacing: 2px; }
                                                    .footer { text-align: center; margin-top: 20px; }
                                                </style>
                                            </head>
                                            <body>
                                                <h2>Token Receipt</h2>
                                                <table>
                                                    <tr><td>Customer Name:</td><td>Ugorji Eucharia E</td></tr>
                                                    <tr><td>Address:</td><td>No 707 Ukuta Close UNN, Nsukka Enugu</td></tr>
                                                    <tr><td>Account No:</td><td>${selectedTransaction?.accountNumber ?? "01-2646945654"}</td></tr>
                                                    <tr><td>Meter No:</td><td>${selectedTransaction?.meterNumber ?? "6242016739"}</td></tr>
                                                    <tr><td>Operator ID:</td><td>Margaret</td></tr>
                                                    <tr><td>Trans Date:</td><td>2025-06-25 12:52 PM WAT</td></tr>
                                                    <tr><td>Receipt No:</td><td>${selectedTransaction?.sn ? `12${selectedTransaction.sn}` : "12711"}</td></tr>
                                                </table>
                                                ${selectedTransaction?.tokenType === "Credit Token" ? `
                                                    <div class="token-label">Credit Token:</div>
                                                    <div class="token-value">1021 1255 0556 6336 66955</div>
                                                ` : selectedTransaction?.tokenType === "KCT" ? `
                                                    <div class="token-label">KCT 1:</div>
                                                    <div class="token-value">4804 1025 0126 8956 7865</div>
                                                    <div class="token-label">KCT 2:</div>
                                                    <div class="token-value">4804 1025 0126 8956 7865</div>
                                                    <div class="footer">Thank you for your patronage.</div>
                                                ` : selectedTransaction?.tokenType === "Clear Tamper" ? `
                                                    <div class="token-label">Clear Tamper:</div>
                                                    <div class="token-value">1021 1255 0556 6336 6695</div>
                                                ` : selectedTransaction?.tokenType === "Clear Credit" ? `
                                                    <div class="token-label">Clear Credit:</div>
                                                    <div class="token-value">1021 1255 0556 6336 6700</div>
                                                ` : selectedTransaction?.tokenType === "KCT/Clear Tam" ? `
                                                    <div class="token-label">Clear Tamper:</div>
                                                    <div class="token-value">1021 1255 0556 6336 6695</div>
                                                    <div class="token-label">KCT 1:</div>
                                                    <div class="token-value">4804 1025 0126 8956 7865</div>
                                                    <div class="token-label">KCT 2:</div>
                                                    <div class="token-value">4804 1025 0126 8956 7865</div>
                                                    <div class="footer">Thank you for your patronage.</div>
                                                ` : `
                                                    <div class="token-label">Compensation Token:</div>
                                                    <div class="token-value">9001 2345 6789 0123 4567</div>
                                                `}
                                            </body>
                                        </html>
                                    `);
                                    printWindow.document.close();
                                    printWindow.focus();
                                    printWindow.print();
                                }
                                setShowTokenDialog(false);
                            }}
                        >
                            Print
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default VendingTable;
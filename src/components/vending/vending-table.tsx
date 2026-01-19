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
import { PaginationControls } from "@/components/ui/pagination-controls";
import { useVendingTransactions, usePrintToken } from "@/hooks/use-vending";
import { type PrintTokenPayload, type VendingTransaction } from "@/types/vending";
import { toast } from "sonner";
import { LoadingAnimation } from "@/components/ui/loading-animation";

interface VendingTableProps {
    searchQuery?: string;
}

const VendingTable = ({ searchQuery = "" }: VendingTableProps = {}) => {
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const { data: transactionsData, isLoading } = useVendingTransactions({
        page: currentPage - 1, // API uses 0-based indexing
        size: rowsPerPage,
    });

    const transactions = transactionsData?.messages ?? [];

    // Filter transactions based on search query (client-side filtering for now)
    const filteredTransactions = transactions.filter((transaction) => {
        if (!searchQuery) return true;
        const searchLower = searchQuery.toLowerCase();
        return (
            transaction.meterAccountNumber?.toLowerCase().includes(searchLower) ||
            transaction.meterNumber?.toLowerCase().includes(searchLower) ||
            transaction.tokenType?.toLowerCase().includes(searchLower) ||
            transaction.tariffName?.toLowerCase().includes(searchLower) ||
            transaction.status?.toLowerCase().includes(searchLower)
        );
    });

    // Apply pagination to filtered data
    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

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

    // State to manage the selected transaction for reprint
    const [selectedTransaction, setSelectedTransaction] = useState<VendingTransaction | null>(null);
    const [showTokenDialog, setShowTokenDialog] = useState(false);

    const printTokenMutation = usePrintToken();

    // Handle pagination controls
    const handlePageSizeChange = (newPageSize: number) => {
        setRowsPerPage(newPageSize);
        setCurrentPage(1);
    };

    const handleReprintToken = (transaction: VendingTransaction) => {
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
                    <TableHeader className="bg-transparent">
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
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={11} className="py-12">
                                    <LoadingAnimation variant="spinner" message="Loading transactions..." size="md" />
                                </TableCell>
                            </TableRow>
                        ) : transactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={11} className="text-center py-8">
                                    No transactions found
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedTransactions.map((transaction, index) => (
                                <TableRow key={transaction.transactionId}>
                                    <TableCell>{(currentPage - 1) * rowsPerPage + index + 1}</TableCell>
                                    <TableCell>{transaction.meterAccountNumber}</TableCell>
                                    <TableCell>{transaction.meterNumber}</TableCell>
                                    <TableCell>{transaction.tokenType}</TableCell>
                                    <TableCell>{transaction.tariffName}</TableCell>
                                    <TableCell>{transaction.initialAmount}</TableCell>
                                    <TableCell>{transaction.unitCost}</TableCell>
                                    <TableCell>{transaction.vatAmount}</TableCell>
                                    <TableCell>{transaction.unit}</TableCell>
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
                                                    <Printer size={14} />
                                                    Reprint Token
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>
            <PaginationControls
                currentPage={currentPage}
                totalItems={filteredTransactions.length}
                pageSize={rowsPerPage}
                onPageChange={setCurrentPage}
                onPageSizeChange={handlePageSizeChange}
            />
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
                            <p>{selectedTransaction?.customerFullname ?? "N/A"}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <p>Meter Number:</p>
                            <p>{selectedTransaction?.meterNumber ?? "6201023"}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <p>Account No:</p>
                            <p>{selectedTransaction?.meterAccountNumber ?? "01231459845"}</p>
                        </div>
                        {selectedTransaction?.tokenType === "credit-token" && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <p>Tariff:</p>
                                    <p>{selectedTransaction?.tariffName ?? "N/A"}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <p>Tariff Rate:</p>
                                    <p>₦{selectedTransaction?.tariffRate ?? "N/A"}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <p>Amount Tendered:</p>
                                    <p>₦{selectedTransaction?.initialAmount ?? "N/A"}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <p>Units:</p>
                                    <p>{selectedTransaction?.unit ?? "N/A"}</p>
                                </div>
                            </>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <p>Operator:</p>
                            <p>{selectedTransaction?.userFullname ?? "N/A"}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <p>Transaction date:</p>
                            <p>{selectedTransaction?.createdAt ? new Date(selectedTransaction.createdAt).toLocaleString() : "N/A"}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <p>Receipt No:</p>
                            <p>{selectedTransaction?.receiptNo ?? "12711"}</p>
                        </div>
                        {selectedTransaction?.tokenType === "credit-token" && (
                            <div className="grid grid-cols-2 gap-4">
                                <p>Credit Token:</p>
                                <p>{selectedTransaction.token}</p>
                            </div>
                        )}
                        {selectedTransaction?.tokenType === "kct" && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <p>KCT 1:</p>
                                    <p>{selectedTransaction.kct1}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <p>KCT 2:</p>
                                    <p>{selectedTransaction.kct2}</p>
                                </div>
                            </>
                        )}
                        {selectedTransaction?.tokenType === "clear-tamper" && (
                            <div className="grid grid-cols-2 gap-4">
                                <p>Clear Tamper:</p>
                                <p>{selectedTransaction.token}</p>
                            </div>
                        )}
                        {selectedTransaction?.tokenType === "clear-credit" && (
                            <div className="grid grid-cols-2 gap-4">
                                <p>Clear Credit:</p>
                                <p>{selectedTransaction.token}</p>
                            </div>
                        )}
                        {selectedTransaction?.tokenType === "kct-clear-tamper" && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <p>Clear Tamper:</p>
                                    <p>{selectedTransaction.token}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <p>KCT 1:</p>
                                    <p>{selectedTransaction.kct1}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <p>KCT 2:</p>
                                    <p>{selectedTransaction.kct2}</p>
                                </div>
                            </>
                        )}
                        {selectedTransaction?.tokenType === "compensation" && (
                            <div className="grid grid-cols-2 gap-4">
                                <p>Compensation Token:</p>
                                <p>{selectedTransaction.token}</p>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end gap-4 mt-4">
                        <Button
                            variant="outline"
                            size="lg"
                            className="bg-[#161CCA] text-white cursor-pointer"
                            onClick={async () => {
                                if (selectedTransaction) {
                                    try {
                                        const payload = {
                                            id: selectedTransaction.transactionId ?? (selectedTransaction as VendingTransaction).id,
                                            tokenType: selectedTransaction.tokenType,
                                        } as PrintTokenPayload;
                                        await printTokenMutation.mutateAsync(payload);

                                        // Create HTML content for printing (formatted like a receipt)
                                        const printContent = `
                                            <html>
                                            <head>
                                                <title>Token Receipt</title>
                                                <style>
                                                    body {
                                                        font-family: 'Courier New', monospace;
                                                        margin: 0;
                                                        padding: 20px;
                                                        background: white;
                                                        font-size: 12px;
                                                        line-height: 1.4;
                                                    }
                                                    .receipt {
                                                        max-width: 400px;
                                                        margin: 0 auto;
                                                        border: 1px solid #000;
                                                        padding: 15px;
                                                    }
                                                    .header {
                                                        text-align: center;
                                                        border-bottom: 1px solid #000;
                                                        padding-bottom: 10px;
                                                        margin-bottom: 15px;
                                                    }
                                                    .company-name {
                                                        font-size: 18px;
                                                        font-weight: bold;
                                                        margin-bottom: 5px;
                                                        color: #000;
                                                    }
                                                    .receipt-title {
                                                        font-size: 14px;
                                                        margin-bottom: 5px;
                                                        color: #000;
                                                    }
                                                    .info-row {
                                                        display: flex;
                                                        justify-content: space-between;
                                                        margin-bottom: 5px;
                                                        padding: 2px 0;
                                                    }
                                                    .label {
                                                        font-weight: bold;
                                                        min-width: 140px;
                                                    }
                                                    .value {
                                                        text-align: right;
                                                        flex: 1;
                                                    }
                                                    .amount-section {
                                                        border-top: 1px solid #000;
                                                        border-bottom: 1px solid #000;
                                                        margin: 15px 0;
                                                        padding: 10px 0;
                                                    }
                                                    .token-section {
                                                        border-top: 1px solid #000;
                                                        margin-top: 15px;
                                                        padding-top: 10px;
                                                        text-align: center;
                                                    }
                                                    .token-label {
                                                        font-weight: bold;
                                                        margin-bottom: 5px;
                                                    }
                                                    .token-value {
                                                        font-size: 14px;
                                                        font-weight: bolder;
                                                        letter-spacing: 2px;
                                                        word-break: break-all;
                                                        margin-bottom: 10px;
                                                        color: #000;
                                                    }
                                                    .footer {
                                                        border-top: 1px solid #000;
                                                        margin-top: 15px;
                                                        padding-top: 10px;
                                                        text-align: center;
                                                        font-size: 10px;
                                                    }
                                                </style>
                                            </head>
                                            <body>
                                                <div class="receipt">
                                                    <div class="header">
                                                        <div class="company-name">TOKEN RECEIPT</div>
                                                        <div>Customer Copy</div>
                                                    </div>

                                                    <div class="info-row">
                                                        <span class="label">Customer Name:</span>
                                                        <span class="value">${selectedTransaction?.customerFullname ?? 'N/A'}</span>
                                                    </div>
                                                    <div class="info-row">
                                                        <span class="label">Address:</span>
                                                        <span class="value">${selectedTransaction?.address || 'N/A'}</span>
                                                    </div>
                                                    ${selectedTransaction?.tokenType !== "kct" && selectedTransaction?.tokenType !== "clear-tamper" && selectedTransaction?.tokenType !== "clear-credit" && selectedTransaction?.tokenType !== "kct-clear-tamper" ? `
                                                    <div class="info-row">
                                                        <span class="label">Tariff:</span>
                                                        <span class="value">${selectedTransaction?.tariffName || 'N/A'}</span>
                                                    </div>
                                                    <div class="info-row">
                                                        <span class="label">Rate:</span>
                                                        <span class="value">${selectedTransaction?.tariffRate || 'N/A'}</span>
                                                    </div>
                                                    ` : ''}
                                                    <div class="info-row">
                                                        <span class="label">Account No:</span>
                                                        <span class="value">${selectedTransaction?.meterAccountNumber || 'N/A'}</span>
                                                    </div>
                                                    <div class="info-row">
                                                        <span class="label">Meter No:</span>
                                                        <span class="value">${selectedTransaction?.meterNumber || 'N/A'}</span>
                                                    </div>
                                                    <div class="info-row">
                                                        <span class="label">Operator ID:</span>
                                                        <span class="value">${selectedTransaction?.userFullname || 'N/A'}</span>
                                                    </div>
                                                    <div class="info-row">
                                                        <span class="label">Trans Date:</span>
                                                        <span class="value">${selectedTransaction?.createdAt ? new Date(selectedTransaction.createdAt).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'N/A'}</span>
                                                    </div>
                                                    <div class="info-row">
                                                        <span class="label">Receipt No:</span>
                                                        <span class="value">${selectedTransaction?.receiptNo || 'N/A'}</span>
                                                    </div>
                                                    ${selectedTransaction?.tokenType === "compensation" ? `
                                                    <div class="info-row">
                                                        <span class="label">Units:</span>
                                                        <span class="value">${selectedTransaction?.unit || 'N/A'}</span>
                                                    </div>
                                                    <div class="info-row">
                                                        <span class="label">Costs of Unit:</span>
                                                        <span class="value">₦${selectedTransaction?.unitCost?.toLocaleString() || 'N/A'}</span>
                                                    </div>
                                                    ` : ''}

                                                    ${selectedTransaction?.tokenType === "credit-token" ? `
                                                    <div class="amount-section">
                                                        <div class="info-row">
                                                            <span class="label">Last Amount Vended:</span>
                                                            <span class="value">₦${selectedTransaction?.lastAmountVended?.toLocaleString() ?? '0'}</span>
                                                        </div>
                                                        <div class="info-row">
                                                            <span class="label">Costs of units:</span>
                                                            <span class="value">₦${selectedTransaction?.unitCost?.toLocaleString() || 'N/A'}</span>
                                                        </div>
                                                        <div class="info-row">
                                                            <span class="label">VAT:</span>
                                                            <span class="value">₦${selectedTransaction?.vatAmount?.toLocaleString() || 'N/A'}</span>
                                                        </div>
                                                        <div class="info-row">
                                                            <span class="label">Credit Adjustment:</span>
                                                            <span class="value">₦${(Array.isArray(selectedTransaction?.creditAdjustment)
                                                                ? (selectedTransaction.creditAdjustment.length > 0
                                                                    ? selectedTransaction.creditAdjustment.reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0)
                                                                    : 0)
                                                                : (selectedTransaction?.creditAdjustment ?? 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                        </div>
                                                        <div class="info-row">
                                                            <span class="label">Debit Adjustment:</span>
                                                            <span class="value">₦${(Array.isArray(selectedTransaction?.debitAdjustment)
                                                                ? (selectedTransaction.debitAdjustment.length > 0
                                                                    ? selectedTransaction.debitAdjustment.reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0)
                                                                    : 0)
                                                                : (selectedTransaction?.debitAdjustment ?? 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                        </div>
                                                        <div class="info-row">
                                                            <span class="label">Amount Tendered:</span>
                                                            <span class="value">₦${selectedTransaction?.initialAmount?.toLocaleString() || 'N/A'}</span>
                                                        </div>
                                                        <div class="info-row">
                                                            <span class="label">Units (kWh):</span>
                                                            <span class="value">${selectedTransaction?.unit?.toLocaleString() || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                    <div class="token-section">
                                                        <div class="token-label">CREDIT TOKEN</div>
                                                        <div class="token-value">${selectedTransaction?.token || 'N/A'}</div>
                                                    </div>
                                                    <div class="info-row">
                                                        <span class="label">Debit Adjustment Balance:</span>
                                                        <span class="value">₦${(selectedTransaction?.debitAdjustmentBalance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                    </div>
                                                    <div class="info-row">
                                                        <span class="label">Credit Adjustment Balance:</span>
                                                        <span class="value">₦${(selectedTransaction?.creditAdjustmentBalance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                    </div>
                                                    ` : selectedTransaction?.tokenType === "kct" ? `
                                                    <div class="token-section">
                                                        <div class="token-label">KCT TOKENS</div>
                                                        <div class="token-value">${selectedTransaction?.kct1 ?? 'N/A'}</div>
                                                        <div class="token-value" style="margin-top: 10px;">${selectedTransaction?.kct2 ?? 'N/A'}</div>
                                                    </div>
                                                    ` : selectedTransaction?.tokenType === "clear-tamper" ? `
                                                    <div class="token-section">
                                                        <div class="token-label">CLEAR TAMPER TOKEN</div>
                                                        <div class="token-value">${selectedTransaction?.token || 'N/A'}</div>
                                                    </div>
                                                    ` : selectedTransaction?.tokenType === "clear-credit" ? `
                                                    <div class="token-section">
                                                        <div class="token-label">CLEAR CREDIT TOKEN</div>
                                                        <div class="token-value">${selectedTransaction?.token || 'N/A'}</div>
                                                    </div>
                                                    ` : selectedTransaction?.tokenType === "kct-clear-tamper" ? `
                                                    <div class="token-section">
                                                        <div class="token-label">KCT AND CLEAR TAMPER TOKENS</div>
                                                        <div class="token-value">${selectedTransaction?.token || 'N/A'}</div>
                                                        <div class="token-value" style="margin-top: 10px;">${selectedTransaction?.token || 'N/A'}</div>
                                                        <div class="token-value" style="margin-top: 10px;">${selectedTransaction?.token}</div>
                                                    </div>
                                                    ` : selectedTransaction?.tokenType === "compensation" ? `
                                                    <div class="token-section">
                                                        <div class="token-label">COMPENSATION TOKEN</div>
                                                        <div class="token-value">${selectedTransaction?.token || 'N/A'}</div>
                                                    </div>
                                                    ` : ''}

                                                    <div class="footer">
                                                        Thank you for your business!<br>
                                                        Please keep this receipt for your records.<br>
                                                        Powered by GridFlex
                                                    </div>
                                                </div>
                                            </body>
                                            </html>
                                        `;

                                        const printWindow = window.open('', '_blank', 'width=800,height=600');
                                        if (printWindow) {
                                            printWindow.document.write(printContent);
                                            printWindow.document.close();
                                            printWindow.focus();

                                            // Wait for content to load, then trigger print dialog
                                            printWindow.onload = () => {
                                                printWindow.print();
                                            };
                                            setShowTokenDialog(false);
                                        } else {
                                            console.error("Failed to open print window");
                                        }
                                        toast.success("Token printed successfully");
                                    } catch {
                                        toast.error("Failed to print token");
                                    }
                                }
                                setShowTokenDialog(false);
                            }}
                            disabled={printTokenMutation.isPending}
                        >
                            {printTokenMutation.isPending ? "Printing..." : "Print"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default VendingTable;
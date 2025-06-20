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
                        {transactions.map((transaction) => (
                            <TableRow key={transaction.sn}>
                                <TableCell>{transaction.sn}</TableCell>
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
                                                className="ring-gray-200/20 hover:bg-gray-100 focus:bg-gray-100">
                                                <EllipsisVertical size={14} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem className="flex items-center gap-2">
                                                <Printer size={14} />
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
            <div className="flex justify-between items-center mt-2">
                <span>Rows per page: 12 ~ 1-12 of 40 rows</span>
                <div>
                    <Button
                        className="px-2 py-1 cursor-pointer"
                    >
                        Previous
                    </Button>
                    <Button
                        className="px-2 py-1 cursor-pointer"
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default VendingTable;
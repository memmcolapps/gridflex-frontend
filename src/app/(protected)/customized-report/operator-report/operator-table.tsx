import OperatorContainer from "@/components/customized-report/operator-report/operator-container";
import OperatorTable from "@/components/customized-report/operator-report/operator-table";
import {
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export default function OperatorReportTable() {
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const CUSTOMER_POP = [
        {
            id: 1,
            customerId: '01',
            firstName: 'Margaret',
            lastName: 'Ademola',
            transactionCount: '632',
            totalUnits: '72090.36',
            totalCost: '2746474.86',
            totalVat: '219717.64',
            totalAmount: '2966192.50',
        },
        {
            id: 2,
            customerId: '02',
            firstName: 'Ola',
            lastName: 'Wura',
            transactionCount: '8318',
            totalUnits: '990763.51',
            totalCost: '37742846.22',
            totalVat: '2301333.78',
            totalAmount: '2966192.50',
        },
        {
            id: 3,
            customerId: '03',
            firstName: 'Margaret',
            lastName: 'Ademola',
            transactionCount: '632',
            totalUnits: '72090.36',
            totalCost: '2746474.86',
            totalVat: '219717.64',
            totalAmount: '2966192.50',
        },
        {
            id: 4,
            customerId: '04',
            firstName: 'Margaret',
            lastName: 'Ademola',
            transactionCount: '632',
            totalUnits: '72090.36',
            totalCost: '2746474.86',
            totalVat: '219717.64',
            totalAmount: '2966192.50',
        },
        {
            id: 5,
            customerId: '05',
            firstName: 'Margaret',
            lastName: 'Ademola',
            transactionCount: '632',
            totalUnits: '72090.36',
            totalCost: '2746474.86',
            totalVat: '219717.64',
            totalAmount: '2966192.50',
        },
        {
            id: 6,
            customerId: '06',
            firstName: 'Margaret',
            lastName: 'Ademola',
            transactionCount: '632',
            totalUnits: '72090.36',
            totalCost: '2746474.86',
            totalVat: '219717.64',
            totalAmount: '2966192.50',
        },
        {
            id: 7,
            customerId: '07',
            firstName: 'Margaret',
            lastName: 'Ademola',
            transactionCount: '632',
            totalUnits: '72090.36',
            totalCost: '2746474.86',
            totalVat: '219717.64',
            totalAmount: '2966192.50',
        },
        {
            id: 8,
            customerId: '08',
            firstName: 'Margaret',
            lastName: 'Ademola',
            transactionCount: '632',
            totalUnits: '72090.36',
            totalCost: '2746474.86',
            totalVat: '219717.64',
            totalAmount: '2966192.50',
        },
        {
            id: 9,
            customerId: '09',
            firstName: 'Margaret',
            lastName: 'Ademola',
            transactionCount: '632',
            totalUnits: '72090.36',
            totalCost: '2746474.86',
            totalVat: '219717.64',
            totalAmount: '2966192.50',
        },
        {
            id: 10,
            customerId: '10',
            firstName: 'Margaret',
            lastName: 'Ademola',
            transactionCount: '632',
            totalUnits: '72090.36',
            totalCost: '2746474.86',
            totalVat: '219717.64',
            totalAmount: '2966192.50',
        },
    ];

    const allSelected = selectedRows.length === CUSTOMER_POP.length;

    return (
        <OperatorContainer title="Operator Report">
            <OperatorTable
                headers={
                    <TableRow>
                        <TableHead>
                            <div className="flex items-center gap-6">
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    onChange={(e) =>
                                        setSelectedRows(
                                            e.target.checked ? CUSTOMER_POP.map((_, i) => i) : []
                                        )
                                    }
                                />
                                <span>S/N</span>
                            </div>
                        </TableHead>
                        <TableHead>FirstName</TableHead>
                        <TableHead>LastName</TableHead>
                        <TableHead>Transaction Count</TableHead>
                        <TableHead>Total Unit</TableHead>
                        <TableHead>Total Cost of Unit</TableHead>
                        <TableHead>Total Vat</TableHead>
                        <TableHead>Total Amount</TableHead>
                    </TableRow>
                }
                data={CUSTOMER_POP}
                sumKeys={["transactionCount", "totalUnits", "totalCost", "totalVat", "totalAmount"]}
            >
                {(emp, index) => (
                    <TableRow key={emp.id}>
                        <TableCell className="flex flex-row gap-5 py-5">
                            <input
                                type="checkbox"
                                checked={selectedRows.includes(index)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedRows([...selectedRows, index]);
                                    } else {
                                        setSelectedRows(selectedRows.filter((i) => i !== index));
                                    }
                                }}
                            />
                            <span >{emp.customerId}</span>
                        </TableCell>
                        <TableCell>{emp.firstName}</TableCell>
                        <TableCell>{emp.lastName}</TableCell>
                        <TableCell className="pr-8">{emp.transactionCount}</TableCell>
                        <TableCell>{emp.totalUnits}</TableCell>
                        <TableCell>{emp.totalCost}</TableCell>
                        <TableCell>{emp.totalVat}</TableCell>
                        <TableCell>{emp.totalAmount}</TableCell>
                    </TableRow>
                )}
            </OperatorTable>
            <Pagination className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Rows per page</span>

                    <Select>
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder="10" />
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

                    <span className="text-sm font-medium">1-10 of 75</span>
                </div>

                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext href="#" />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </OperatorContainer>

    );
}

import ReportContainer from "@/components/customized-report/reports-body/report-container";
import ReportTable from "@/components/customized-report/reports-body/report-table";
import { Badge } from "@/components/ui/badge";
import {
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export default function CustomizedPerVending() {
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    const CUSTOMER_POP = [
        {
            id: 1,
            customerId: '01',
            date: '08 Sept, 10:15',
            region: 'Ojoo',
            firstName: 'Margaret',
            lastName: 'Ademola',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
            meterNumber: '62123589561',
            phoneNo: '08161223456',
            tariffType: 'R 2',
            amount: '30,000',
            type: 'Online',
            status: 'Pending'
        },
        {
            id: 2,
            customerId: '01',
            date: '08 Sept, 10:15',
            region: 'Ojoo',
            firstName: 'Margaret',
            lastName: 'Ademola',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
            meterNumber: '62123589561',
            phoneNo: '08161223456',
            tariffType: 'R 2',
            amount: '30,000',
            type: 'Online',
            status: 'Successful'
        },
        {
            id: 3,
            customerId: '01',
            date: '08 Sept, 10:15',
            region: 'Ojoo',
            firstName: 'Margaret',
            lastName: 'Ademola',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
            meterNumber: '62123589561',
            phoneNo: '08161223456',
            tariffType: 'R 2',
            amount: '30,000',
            type: 'Online',
            status: 'Successful'
        },
        {
            id: 4,
            customerId: '01',
            date: '08 Sept, 10:15',
            region: 'Ojoo',
            firstName: 'Margaret',
            lastName: 'Ademola',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
            meterNumber: '62123589561',
            phoneNo: '08161223456',
            tariffType: 'R 2',
            amount: '30,000',
            type: 'Online',
            status: 'Pending'
        },
        {
            id: 5,
            customerId: '01',
            date: '08 Sept, 10:15',
            region: 'Ojoo',
            firstName: 'Margaret',
            lastName: 'Ademola',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
            meterNumber: '62123589561',
            phoneNo: '08161223456',
            tariffType: 'R 2',
            amount: '30,000',
            type: 'Online',
            status: 'Failed'
        },
        {
            id: 6,
            customerId: '01',
            date: '08 Sept, 10:15',
            region: 'Ojoo',
            firstName: 'Margaret',
            lastName: 'Ademola',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
            meterNumber: '62123589561',
            phoneNo: '08161223456',
            tariffType: 'R 2',
            amount: '30,000',
            type: 'Online',
            status: 'Failed'
        },
    ];

    const allSelected = selectedRows.length === CUSTOMER_POP.length;

    return (
        <ReportContainer title="Customer Vending Report">
            <ReportTable
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
                        <TableHead>Date/Time</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead>First Name</TableHead>
                        <TableHead>Last Name</TableHead>
                        <TableHead>Meter Number</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Amount Vended</TableHead>
                        <TableHead>Payment Type</TableHead>
                        <TableHead>Operator</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                }
            >
                {CUSTOMER_POP.map((emp, index) => (
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
                            <span>{emp.customerId}</span>

                        </TableCell>
                        <TableCell>{emp.date}</TableCell>
                        <TableCell>{emp.region}</TableCell>
                        <TableCell>{emp.firstName}</TableCell>
                        <TableCell>{emp.lastName}</TableCell>
                        <TableCell>
                            {emp.meterNumber}
                        </TableCell>
                        <TableCell>{emp.address.length > 20 ? `${emp.address.slice(0, 20)}...` : emp.address}</TableCell>
                        <TableCell>{emp.amount}</TableCell>
                        <TableCell>{emp.type} </TableCell>
                        <TableCell>{emp.firstName || '-'}</TableCell>
                        <TableCell>
                            <Badge
                                key={emp.id}
                                variant="secondary"
                                className={`rounded-2xl px-2 py-1 font-semibold ${emp.status === "Successful"
                                    ? "bg-green-100 text-green-500"
                                    : emp.status === "Pending"
                                        ? "bg-amber-100 text-amber-500"
                                        : "bg-red-100 text-red-500"
                                    }`}
                            >
                                {emp.status}
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </ReportTable>
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
        </ReportContainer>
    );
}

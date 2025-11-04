import DailyContainer from "@/components/customized-report/daily-reports/daily-container";
import ReportTable from "@/components/customized-report/reports-body/report-table";
import { PaginationControls } from "@/components/ui/pagination-controls";

import {
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { useState } from "react";

export default function BillingTable() {
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const CUSTOMER_POP = [
        {
            id: 1,
            customerId: '01',
            date: '08 Sept, 10:15',
            firstName: 'Margaret',
            lastName: 'Ademola',
            accountNumber: '62123589561',
            amountVended: '30,000',
            paymentType: 'Online',
            // operator: 'Wura',
            meterNumber: '62123589561',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
        },
        {
            id: 2,
            customerId: '02',
            date: '08 Sept, 10:15',
            firstName: 'Margaret',
            lastName: 'Ademola',
            accountNumber: '62123589561',
            amountVended: '30,000',
            paymentType: 'Online',
            operator: 'Wura',
            meterNumber: '62123589561',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
        },
        {
            id: 3,
            customerId: '03',
            date: '08 Sept, 10:15',
            firstName: 'Margaret',
            lastName: 'Ademola',
            accountNumber: '62123589561',
            amountVended: '30,000',
            paymentType: 'Online',
            operator: 'Wura',
            meterNumber: '62123589561',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
        },
        {
            id: 4,
            customerId: '04',
            date: '08 Sept, 10:15',
            firstName: 'Margaret',
            lastName: 'Ademola',
            accountNumber: '62123589561',
            amountVended: '30,000',
            paymentType: 'Online',
            operator: 'Wura',
            meterNumber: '62123589561',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
        },
        {
            id: 5,
            customerId: '05',
            date: '08 Sept, 10:15',
            firstName: 'Margaret',
            lastName: 'Ademola',
            accountNumber: '62123589561',
            amountVended: '30,000',
            paymentType: 'Physical',
            // operator: 'Wura',
            meterNumber: '62123589561',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
        },
        {
            id: 6,
            customerId: '01',
            date: '08 Sept, 10:15',
            firstName: 'Margaret',
            lastName: 'Ademola',
            accountNumber: '62123589561',
            amountVended: '30,000',
            paymentType: 'Online',
            operator: 'Wura',
            meterNumber: '62123589561',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
        },
        {
            id: 7,
            customerId: '06',
            date: '08 Sept, 10:15',
            firstName: 'Margaret',
            lastName: 'Ademola',
            accountNumber: '62123589561',
            amountVended: '30,000',
            paymentType: 'Physical',
            // operator: 'Wura',
            meterNumber: '62123589561',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
        },
        {
            id: 8,
            customerId: '07',
            date: '08 Sept, 10:15',
            firstName: 'Margaret',
            lastName: 'Ademola',
            accountNumber: '62123589561',
            amountVended: '30,000',
            paymentType: 'Online',
            operator: 'Wura',
            meterNumber: '62123589561',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
        },
    ];

    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handlePageSizeChange = (newPageSize: number) => {
        setRowsPerPage(newPageSize);
        setCurrentPage(0);
    };

    const allSelected = selectedRows.length === CUSTOMER_POP.length;

    return (
        <DailyContainer title="Customer Transaction Summary Report">
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
                        <TableHead>First Name</TableHead>
                        <TableHead>Last Name</TableHead>
                        <TableHead>Account No</TableHead>
                        <TableHead>Meter Number</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Amount Vended</TableHead>
                        <TableHead>Payment Type</TableHead>
                        <TableHead>Operator</TableHead>
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
                            <span >{emp.customerId}</span>

                        </TableCell>
                        <TableCell>{emp.date}</TableCell>
                        <TableCell>{emp.firstName}</TableCell>
                        <TableCell>{emp.lastName}</TableCell>
                        <TableCell>{emp.accountNumber}</TableCell>
                        <TableCell>{emp.address.length > 20 ? `${emp.address.slice(0, 20)}...` : emp.address}</TableCell>
                        <TableCell>
                            {emp.meterNumber}
                        </TableCell>
                        <TableCell>{emp.amountVended}</TableCell>
                        <TableCell>{emp.paymentType}</TableCell>
                        <TableCell className="text-center">{emp.operator ?? '-'}</TableCell>
                    </TableRow>
                ))}
            </ReportTable>
            <PaginationControls
                currentPage={currentPage}
                totalItems={CUSTOMER_POP.length}
                pageSize={rowsPerPage}
                onPageChange={setCurrentPage}
                onPageSizeChange={handlePageSizeChange}
                zeroBasedIndexing={true}
            />
        </DailyContainer>

    );
}

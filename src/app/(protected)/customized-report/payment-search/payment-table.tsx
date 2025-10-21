import DailyContainer from "@/components/customized-report/daily-reports/daily-container";
import ReportTable from "@/components/customized-report/reports-body/report-table";
import {
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { useState } from "react";

export default function PaymentTable() {
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const CUSTOMER_POP = [
        {
            id: 1,
            customerId: '01',
            date: '08 Sept, 10:15',
            transactionId: 'TRX-123455758858',
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
            transactionId: 'TRX-123455758858',
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
            transactionId: 'TRX-123455758858',
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
            transactionId: 'TRX-123455758858',
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
            transactionId: 'TRX-123455758858',
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
            transactionId: 'TRX-123455758858',
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
            transactionId: 'TRX-123455758858',
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
            transactionId: 'TRX-123455758858',
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

    const allSelected = selectedRows.length === CUSTOMER_POP.length;

    return (
        <DailyContainer title="Payment Search">
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
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Account No</TableHead>
                        <TableHead>Customer Name</TableHead>
                        <TableHead>Amount Paid</TableHead>
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
                        <TableCell>{emp.transactionId}</TableCell>
                        <TableCell>{emp.accountNumber}</TableCell>
                        <TableCell>{emp.firstName} {emp.lastName}</TableCell>
                        <TableCell>{emp.amountVended}</TableCell>
                        <TableCell>{emp.paymentType}</TableCell>
                        <TableCell className="text-center">{emp.operator ?? '-'}</TableCell>
                    </TableRow>
                ))}
        </ReportTable>
    </DailyContainer>
      
    );
}

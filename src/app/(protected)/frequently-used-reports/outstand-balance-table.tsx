import ReportTable from "@/components/customized-report/reports-body/report-table";
import {
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export default function OutstandingBalance() {
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    const CUSTOMER_POP = [
        {
            id: 1,
            sn: '01',
            firstName: 'Margaret',
            band: 'Band A',
            cusomerId: 'C-1234567890',
            lastName: 'Ademola',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
            phoneNo: '08161223456',
            accountNumber: '0159004612077',
            feeder: 'Ijeun',
            dss: 'Ijeun',
            meterNumber: '62123589561',
            simNo: '8900049769797079',
            meterClass: 'Single Phase',
            transactionId: 'TRX-240710-AYO001-77',
            transactionDate: '07-07-2025',
            amount: '100,000',
            energyConsumed: '400',
            adjustment: '50,000',
            outstandingBalance: '182,000',
            tariffType: 'R2',
            tarriffRate: '200'
        },
        {
            id: 2,
            sn: '02',
            firstName: 'Margaret',
            band: 'Band A',
            cusomerId: 'C-1234567890',
            lastName: 'Ademola',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
            phoneNo: '08161223456',
            accountNumber: '0159004612077',
            feeder: 'Ijeun',
            dss: 'Ijeun',
            meterNumber: '62123589561',
            simNo: '8900049769797079',
            meterClass: 'Single Phase',
            transactionId: 'TRX-240710-AYO001-77',
            transactionDate: '07-07-2025',
            amount: '100,000',
            energyConsumed: '400',
            adjustment: '50,000',
            outstandingBalance: '182,000',
            tariffType: 'R2',
            tarriffRate: '200'
        },
        {
            id: 3,
            sn: '03',
            firstName: 'Margaret',
            band: 'Band A',
            cusomerId: 'C-1234567890',
            lastName: 'Ademola',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
            phoneNo: '08161223456',
            accountNumber: '0159004612077',
            feeder: 'Ijeun',
            dss: 'Ijeun',
            meterNumber: '62123589561',
            simNo: '8900049769797079',
            meterClass: 'Single Phase',
            transactionId: 'TRX-240710-AYO001-77',
            transactionDate: '07-07-2025',
            amount: '100,000',
            energyConsumed: '400',
            adjustment: '50,000',
            outstandingBalance: '182,000',
            tariffType: 'R2',
            tarriffRate: '200'
        },
        {
            id: 4,
            sn: '04',
            firstName: 'Margaret',
            band: 'Band A',
            cusomerId: 'C-1234567890',
            lastName: 'Ademola',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
            phoneNo: '08161223456',
            accountNumber: '0159004612077',
            feeder: 'Ijeun',
            dss: 'Ijeun',
            meterNumber: '62123589561',
            simNo: '8900049769797079',
            meterClass: 'Single Phase',
            transactionId: 'TRX-240710-AYO001-77',
            transactionDate: '07-07-2025',
            amount: '100,000',
            energyConsumed: '400',
            adjustment: '50,000',
            outstandingBalance: '182,000',
            tariffType: 'R2',
            tarriffRate: '200'
        },
        {
            id: 5,
            sn: '05',
            firstName: 'Margaret',
            band: 'Band A',
            cusomerId: 'C-1234567890',
            lastName: 'Ademola',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
            phoneNo: '08161223456',
            accountNumber: '0159004612077',
            feeder: 'Ijeun',
            dss: 'Ijeun',
            meterNumber: '62123589561',
            simNo: '8900049769797079',
            meterClass: 'Single Phase',
            transactionId: 'TRX-240710-AYO001-77',
            transactionDate: '07-07-2025',
            amount: '100,000',
            energyConsumed: '400',
            adjustment: '50,000',
            outstandingBalance: '182,000',
            tariffType: 'R2',
            tarriffRate: '200'
        },
        {
            id: 6,
            sn: '06',
            firstName: 'Margaret',
            band: 'Band A',
            cusomerId: 'C-1234567890',
            lastName: 'Ademola',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
            phoneNo: '08161223456',
            accountNumber: '0159004612077',
            feeder: 'Ijeun',
            dss: 'Ijeun',
            meterNumber: '62123589561',
            simNo: '8900049769797079',
            meterClass: 'Single Phase',
            transactionId: 'TRX-240710-AYO001-77',
            transactionDate: '07-07-2025',
            amount: '100,000',
            energyConsumed: '400',
            adjustment: '50,000',
            outstandingBalance: '182,000',
            tariffType: 'R2',
            tarriffRate: '200'
        },
        {
            id: 7,
            sn: '07',
            firstName: 'Margaret',
            band: 'Band A',
            cusomerId: 'C-1234567890',
            lastName: 'Ademola',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
            phoneNo: '08161223456',
            accountNumber: '0159004612077',
            feeder: 'Ijeun',
            dss: 'Ijeun',
            meterNumber: '62123589561',
            simNo: '8900049769797079',
            meterClass: 'Single Phase',
            transactionId: 'TRX-240710-AYO001-77',
            transactionDate: '07-07-2025',
            amount: '100,000',
            energyConsumed: '400',
            adjustment: '50,000',
            outstandingBalance: '182,000',
            tariffType: 'R2',
            tarriffRate: '200'
        },
        {
            id: 8,
            sn: '08',
            firstName: 'Margaret',
            band: 'Band A',
            cusomerId: 'C-1234567890',
            lastName: 'Ademola',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
            phoneNo: '08161223456',
            accountNumber: '0159004612077',
            feeder: 'Ijeun',
            dss: 'Ijeun',
            meterNumber: '62123589561',
            simNo: '8900049769797079',
            meterClass: 'Single Phase',
            transactionId: 'TRX-240710-AYO001-77',
            transactionDate: '07-07-2025',
            amount: '100,000',
            energyConsumed: '400',
            adjustment: '50,000',
            outstandingBalance: '182,000',
            tariffType: 'R2',
            tarriffRate: '200'
        },
        {
            id: 9,
            sn: '09',
            firstName: 'Margaret',
            band: 'Band A',
            cusomerId: 'C-1234567890',
            lastName: 'Ademola',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
            phoneNo: '08161223456',
            accountNumber: '0159004612077',
            feeder: 'Ijeun',
            dss: 'Ijeun',
            meterNumber: '62123589561',
            simNo: '8900049769797079',
            meterClass: 'Single Phase',
            transactionId: 'TRX-240710-AYO001-77',
            transactionDate: '07-07-2025',
            amount: '100,000',
            energyConsumed: '400',
            adjustment: '50,000',
            outstandingBalance: '182,000',
            tariffType: 'R2',
            tarriffRate: '200'
        },
        {
            id: 10,
            sn: '10',
            firstName: 'Margaret',
            band: 'Band A',
            cusomerId: 'C-1234567890',
            lastName: 'Ademola',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
            phoneNo: '08161223456',
            accountNumber: '0159004612077',
            feeder: 'Ijeun',
            dss: 'Ijeun',
            meterNumber: '62123589561',
            simNo: '8900049769797079',
            meterClass: 'Single Phase',
            transactionId: 'TRX-240710-AYO001-77',
            transactionDate: '07-07-2025',
            amount: '100,000',
            energyConsumed: '400',
            adjustment: '50,000',
            outstandingBalance: '182,000',
            tariffType: 'R2',
            tarriffRate: '200'
        },
    ];

    const allSelected = selectedRows.length === CUSTOMER_POP.length;

    return (
        <div className="mt-10">
            <div>
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
                            <TableHead>Meter Number</TableHead>
                            <TableHead>New Outstanding Balance</TableHead>
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
                                <span >{emp.sn}</span>
                            </TableCell>
                            <TableCell>{emp.meterNumber}</TableCell>
                            <TableCell>{emp.outstandingBalance}</TableCell>
                        </TableRow>
                    ))}
            </ReportTable>
            </div>
 
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
        </div>
         
    );
}

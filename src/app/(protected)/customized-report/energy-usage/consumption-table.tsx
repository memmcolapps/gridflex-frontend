import DailyContainer from "@/components/customized-report/daily-reports/daily-container";
import ReportTable from "@/components/customized-report/reports-body/report-table";
import {
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export default function ConsumptionTable() {
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const CUSTOMER_POP = [
        {
            id: 1,
            customerId: '01',
            firstName: 'Margaret',
            lastName: 'Ademola',
            accountNumber: '62123589561',
            feeder: 'Ijeun',
            dss: 'Ijeun',
            present: '123456',
            previous: '123456',
            energy: '1089',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
        },
        {
            id: 2,
            customerId: '02',
            firstName: 'Margaret',
            lastName: 'Ademola',
            accountNumber: '62123589561',
            feeder: 'Ijeun',
            dss: 'Ijeun',
            present: '123456',
            previous: '123456',
            energy: '1089',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
        },
        {
            id: 3,
            customerId: '03',
            firstName: 'Margaret',
            lastName: 'Ademola',
            accountNumber: '62123589561',
            feeder: 'Ijeun',
            dss: 'Ijeun',
            present: '123456',
            previous: '123456',
            energy: '1089',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
        },
        {
            id: 4,
            customerId: '04',
            firstName: 'Margaret',
            lastName: 'Ademola',
            accountNumber: '62123589561',
            feeder: 'Ijeun',
            dss: 'Ijeun',
            present: '123456',
            previous: '123456',
            energy: '1089',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
        },
        {
            id: 5,
            customerId: '05',
            firstName: 'Margaret',
            lastName: 'Ademola',
            accountNumber: '62123589561',
            feeder: 'Ijeun',
            dss: 'Ijeun',
            present: '123456',
            previous: '123456',
            energy: '1089',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
        },
        {
            id: 6,
            customerId: '01',
            firstName: 'Margaret',
            lastName: 'Ademola',
            accountNumber: '62123589561',
            feeder: 'Ijeun',
            dss: 'Ijeun',
            present: '123456',
            previous: '123456',
            energy: '1089',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
        },
        {
            id: 7,
            customerId: '06',
            firstName: 'Margaret',
            lastName: 'Ademola',
            accountNumber: '62123589561',
            feeder: 'Ijeun',
            dss: 'Ijeun',
            present: '123456',
            previous: '123456',
            energy: '1089',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
        },
        {
            id: 8,
            customerId: '07',
            firstName: 'Margaret',
            lastName: 'Ademola',
            accountNumber: '62123589561',
            feeder: 'Ijeun',
            dss: 'Ijeun',
            present: '123456',
            previous: '123456',
            energy: '1089',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
        },
    ];

    const allSelected = selectedRows.length === CUSTOMER_POP.length;

    return (
        <DailyContainer title="Consumption Report">
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
                        <TableHead>Account No</TableHead>
                        <TableHead>First Name</TableHead>
                        <TableHead>Last Name</TableHead>
                        <TableHead>Service Address</TableHead>
                        <TableHead>Feeder</TableHead>
                        <TableHead>DSS</TableHead>
                        <TableHead>Present Reading</TableHead>
                        <TableHead>Previous Reading</TableHead>
                        <TableHead>Consumed Energy</TableHead>
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
                        <TableCell>{emp.accountNumber ?? '-'}</TableCell>
                        <TableCell>{emp.firstName}</TableCell>
                        <TableCell>{emp.lastName}</TableCell>
                        <TableCell>{emp.address.length > 20 ? `${emp.address.slice(0, 20)}...` : emp.address}</TableCell>
                        <TableCell>{emp.feeder}</TableCell>
                        <TableCell>{emp.dss}</TableCell>
                        <TableCell>{emp.previous}</TableCell>
                        <TableCell>{emp.previous}</TableCell>
                        <TableCell>{emp.energy}</TableCell>
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
        </DailyContainer>

    );
}

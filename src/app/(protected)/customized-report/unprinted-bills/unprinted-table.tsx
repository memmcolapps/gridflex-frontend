import DailyContainer from "@/components/customized-report/daily-reports/daily-container";
import ReportTable from "@/components/customized-report/reports-body/report-table";
import {
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { useState } from "react";
import { PaginationControls } from "@/components/ui/pagination-controls";

export default function UnprintedTable() {
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const CUSTOMER_POP = [
        {
            id: 1,
            customerId: '01',
            date: '08 Sept, 10:15',
            accountNumber: '62123589561',
            firstName: 'Margaret',
            lastName: 'Ademola',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
            amount: '30,000',
            month: 'September',
            tariff: 'A 1',
            feeder: 'Ijeun',
            Dss: 'Ijeun'
        },
        {
            id: 2,
            customerId: '02',
            date: '08 Sept, 10:15',
            accountNumber: '62123589561',
            firstName: 'Margaret',
            lastName: 'Ademola',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
            amount: '30,000',
            month: 'September',
            tariff: 'A 1',
            feeder: 'Ijeun',
            Dss: 'Ijeun'
        },
        {
            id: 3,
            customerId: '03',
            date: '08 Sept, 10:15',
            accountNumber: '62123589561',
            firstName: 'Margaret',
            lastName: 'Ademola',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
            amount: '30,000',
            month: 'September',
            tariff: 'A 1',
            feeder: 'Ijeun',
            Dss: 'Ijeun'
        },
        {
            id: 4,
            customerId: '04',
            date: '08 Sept, 10:15',
            accountNumber: '62123589561',
            firstName: 'Margaret',
            lastName: 'Ademola',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
            amount: '30,000',
            month: 'September',
            tariff: 'A 1',
            feeder: 'Ijeun',
            Dss: 'Ijeun'
        },
        {
            id: 5,
            customerId: '05',
            date: '08 Sept, 10:15',
            accountNumber: '62123589561',
            firstName: 'Margaret',
            lastName: 'Ademola',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
            amount: '30,000',
            month: 'September',
            tariff: 'A 1',
            feeder: 'Ijeun',
            Dss: 'Ijeun'
        },
        {
            id: 6,
            customerId: '06',
            date: '08 Sept, 10:15',
            accountNumber: '62123589561',
            firstName: 'Margaret',
            lastName: 'Ademola',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
            amount: '30,000',
            month: 'September',
            tariff: 'A 1',
            feeder: 'Ijeun',
            Dss: 'Ijeun'
        },
        {
            id: 7,
            customerId: '07',
            date: '08 Sept, 10:15',
            accountNumber: '62123589561',
            firstName: 'Margaret',
            lastName: 'Ademola',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
            amount: '30,000',
            month: 'September',
            tariff: 'A 1',
            feeder: 'Ijeun',
            Dss: 'Ijeun'
        },
        {
            id: 8,
            customerId: '08',
            date: '08 Sept, 10:15',
            accountNumber: '62123589561',
            firstName: 'Margaret',
            lastName: 'Ademola',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
            amount: '30,000',
            month: 'September',
            tariff: 'A 1',
            feeder: 'Ijeun',
            Dss: 'Ijeun'
        },
        {
            id: 9,
            customerId: '09',
            date: '08 Sept, 10:15',
            accountNumber: '62123589561',
            firstName: 'Margaret',
            lastName: 'Ademola',
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
            amount: '30,000',
            month: 'September',
            tariff: 'A 1',
            feeder: 'Ijeun',
            Dss: 'Ijeun'
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
        <DailyContainer title="Unprinted Bills">
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
                        <TableHead>Tariff</TableHead>
                        <TableHead>Bill Amount</TableHead>
                        <TableHead>Bill Month</TableHead>
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
                        <TableCell>{emp.accountNumber}</TableCell>
                        <TableCell>{emp.firstName}</TableCell>
                        <TableCell>{emp.lastName}</TableCell>
                        <TableCell>{emp.address.length > 20 ? `${emp.address.slice(0, 20)}...` : emp.address}</TableCell>
                        <TableCell>{emp.feeder}</TableCell>
                        <TableCell>{emp.Dss}</TableCell>
                        <TableCell>{emp.tariff}</TableCell>
                        <TableCell>{emp.amount}</TableCell>
                        <TableCell>{emp.month}</TableCell>
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

import DailyContainer from "@/components/customized-report/daily-reports/daily-container";
import ReportTable from "@/components/customized-report/reports-body/report-table";
import {
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { useState } from "react";

export default function MonthlyReportTable() {
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const CUSTOMER_POP = [
        {
            id: 1,
            customerId: '01',
            firstName: 'Margaret',
            lastName: 'Ademola',
            accountNumber: '62123589561',
            oldAccount: '012345678',
            tariff: 'A 1',
            readCode: '12,000',
            multiplier: '0',
            kw: '0',
            meterNumber: '62123589561',            
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
        },
        {
            id: 2,
            customerId: '02',
            firstName: 'Margaret',
            lastName: 'Ademola',
            accountNumber: '62123589561',
            oldAccount: '012345678',
            tariff: 'A 1',
            readCode: '12,000',
            multiplier: '0',
            kw: '0',
            meterNumber: '62123589561',            
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
        },
        {
            id: 3,
            customerId: '03',
            firstName: 'Margaret',
            lastName: 'Ademola',
            accountNumber: '62123589561',
            oldAccount: '012345678',
            tariff: 'A 1',
            readCode: '12,000',
            multiplier: '0',
            kw: '0',
            meterNumber: '62123589561',            
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
        },
        {
            id: 4,
            customerId: '04',
            firstName: 'Margaret',
            lastName: 'Ademola',
            accountNumber: '62123589561',
            oldAccount: '012345678',
            tariff: 'A 1',
            readCode: '12,000',
            multiplier: '0',
            kw: '0',
            meterNumber: '62123589561',            
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
        },
        {
            id: 5,
            customerId: '05',
            firstName: 'Margaret',
            lastName: 'Ademola',
            accountNumber: '62123589561',
            oldAccount: '012345678',
            tariff: 'A 1',
            readCode: '12,000',
            multiplier: '0',
            kw: '0',
            meterNumber: '62123589561',            
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
        },
        {
            id: 6,
            customerId: '01',
            firstName: 'Margaret',
            lastName: 'Ademola',
            accountNumber: '62123589561',
            oldAccount: '012345678',
            tariff: 'A 1',
            readCode: '12,000',
            multiplier: '0',
            kw: '0',
            meterNumber: '62123589561',            
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
        },
        {
            id: 7,
            customerId: '06',
            firstName: 'Margaret',
            lastName: 'Ademola',
            accountNumber: '62123589561',
            oldAccount: '012345678',
            tariff: 'A 1',
            readCode: '12,000',
            multiplier: '0',
            kw: '0',
            meterNumber: '62123589561',            
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
        },
        {
            id: 8,
            customerId: '07',
            firstName: 'Margaret',
            lastName: 'Ademola',
            accountNumber: '62123589561',
            oldAccount: '012345678',
            tariff: 'A 1',
            readCode: '12,000',
            multiplier: '0',
            kw: '0',
            meterNumber: '62123589561',            
            address: 'ZONE B, BLOCK 2 & 3, OPP. AKINDAYOMI ESTATE, RING ROAD, RCCG REDEMPTION CITY, MOWE',
        },
    ];

    const allSelected = selectedRows.length === CUSTOMER_POP.length;

    return (
        <DailyContainer title="Monthly ASCII Report">
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
                        <TableHead>Address</TableHead>
                        <TableHead>Meter Number</TableHead>
                        <TableHead>Old Acct. No.</TableHead>
                        <TableHead>Tariff</TableHead>
                        <TableHead>Read Code</TableHead>
                        <TableHead>Multiplier</TableHead>
                        <TableHead>KWH</TableHead>
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
                        <TableCell>{emp.address.length > 20 ? `${emp.address.slice(0,20)}...` : emp.address}</TableCell>
                        <TableCell>
                            {emp.meterNumber}
                        </TableCell>
                        <TableCell>{emp.oldAccount}</TableCell>
                        <TableCell>{emp.tariff}</TableCell>
                        <TableCell>{emp.readCode}</TableCell>
                        <TableCell>{emp.multiplier}</TableCell>
                        <TableCell>{emp.kw}</TableCell>
                    </TableRow>
                ))}
        </ReportTable>
    </DailyContainer>
      
    );
}

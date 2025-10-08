import ReportContainer from "@/components/customized-report/reports-body/report-container";
import ReportTable from "@/components/customized-report/reports-body/report-table";
import {
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { useState } from "react";

export default function CustomizedPopulation() {
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
            tariffType: 'R 2'
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
            tariffType: 'R 2'
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
            tariffType: 'R 2'
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
            tariffType: 'R 2'
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
            tariffType: 'R 2'
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
            tariffType: 'R 2'
        },
    ];

    const allSelected = selectedRows.length === CUSTOMER_POP.length;

    return (
        <ReportContainer title="Customer Population Report">
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
                            <TableHead>Address</TableHead>
                            <TableHead>Meter Number</TableHead>
                            <TableHead>Mobile No.</TableHead>
                            <TableHead>Tariff Type</TableHead>
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
                            <TableCell>{emp.region}</TableCell>
                            <TableCell>{emp.firstName}</TableCell>
                            <TableCell>{emp.lastName}</TableCell>
                            <TableCell>{emp.address.length > 20 ? `${emp.address.slice(0,20)}...` : emp.address}</TableCell>
                            <TableCell>
                                {emp.meterNumber}
                            </TableCell>
                            <TableCell>{emp.phoneNo}</TableCell>
                            <TableCell>{emp.tariffType}</TableCell>
                        </TableRow>
                    ))}
            </ReportTable>
        </ReportContainer>
    );
}

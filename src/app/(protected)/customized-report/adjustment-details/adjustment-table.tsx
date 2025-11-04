import DailyContainer from "@/components/customized-report/daily-reports/daily-container";
import ReportTable from "@/components/customized-report/reports-body/report-table";
import { PaginationControls } from "@/components/ui/pagination-controls";
import {
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { useState } from "react";

export default function AdjustTable() {
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const CUSTOMER_POP = [
        {
            id: 1,
            customerId: '01',
            date: '08 Sept, 10:15',
            accountNumber: '62123589561',
            adjustments: '-30,000',
            balance: '30,000',
            amount: '30,000',
            meterType: 'Virtual',
            customerType: 'MD',
            feeder: 'Ijeun',
            Dss: 'Ijeun'
        },
        {
            id: 2,
            customerId: '02',
            date: '08 Sept, 10:15',
            accountNumber: '62123589561',
            adjustments: '-30,000',
            balance: '30,000',
            amount: '30,000',
            meterType: 'Virtual',
            customerType: 'MD',
            feeder: 'Ijeun',
            Dss: 'Ijeun'
        },
        {
            id: 3,
            customerId: '03',
            date: '08 Sept, 10:15',
            accountNumber: '62123589561',
            adjustments: '-30,000',
            balance: '30,000',
            amount: '30,000',
            meterType: 'Virtual',
            customerType: 'MD',
            feeder: 'Ijeun',
            Dss: 'Ijeun'
        },
        {
            id: 4,
            customerId: '04',
            date: '08 Sept, 10:15',
            accountNumber: '62123589561',
            adjustments: '-30,000',
            balance: '30,000',
            amount: '30,000',
            meterType: 'Virtual',
            customerType: 'MD',
            feeder: 'Ijeun',
            Dss: 'Ijeun'
        },
        {
            id: 5,
            customerId: '05',
            date: '08 Sept, 10:15',
            accountNumber: '62123589561',
            adjustments: '-30,000',
            balance: '30,000',
            amount: '30,000',
            meterType: 'Virtualal',
            customerType: 'MD',
            feeder: 'Ijeun',
            Dss: 'Ijeun'
        },
        {
            id: 6,
            customerId: '01',
            date: '08 Sept, 10:15',
            accountNumber: '62123589561',
            adjustments: '-30,000',
            balance: '30,000',
            amount: '30,000',
            meterType: 'Virtual',
            customerType: 'MD',
            feeder: 'Ijeun',
            Dss: 'Ijeun'
        },
        {
            id: 7,
            customerId: '06',
            date: '08 Sept, 10:15',
            accountNumber: '62123589561',
            adjustments: '-30,000',
            balance: '30,000',
            amount: '30,000',
            meterType: 'Virtualal',
            customerType: 'Non-MD',
            feeder: 'Ijeun',
            Dss: 'Ijeun'
        },
        {
            id: 8,
            customerId: '07',
            date: '08 Sept, 10:15',
            accountNumber: '62123589561',
            adjustments: '-30,000',
            balance: '30,000',
            amount: '30,000',
            meterType: 'Virtual',
            customerType: 'MD',
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
        <DailyContainer title="Adjustment Details">
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
                        <TableHead>Adjustments</TableHead>
                        <TableHead>Closing Balance</TableHead>
                        <TableHead>Last Pay Date</TableHead>
                        <TableHead>Last Pay Amount</TableHead>
                        <TableHead>Feeder</TableHead>
                        <TableHead>DSS</TableHead>
                        <TableHead>Customer Type</TableHead>
                        <TableHead>Meter Type</TableHead>
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
                        <TableCell>{emp.adjustments}</TableCell>
                        <TableCell>{emp.balance}</TableCell>
                        <TableCell>{emp.date}</TableCell>
                        <TableCell>{emp.amount}</TableCell>
                        <TableCell>{emp.feeder}</TableCell>
                        <TableCell>{emp.Dss}</TableCell>
                        <TableCell>{emp.customerType}</TableCell>
                        <TableCell>{emp.meterType}</TableCell>
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

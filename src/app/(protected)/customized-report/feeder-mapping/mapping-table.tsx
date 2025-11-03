import DailyContainer from "@/components/customized-report/daily-reports/daily-container";
import ReportTable from "@/components/customized-report/reports-body/report-table";
import {
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { useState } from "react";
import { PaginationControls } from "@/components/ui/pagination-controls";

export default function MappingTable() {
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const CUSTOMER_POP = [
        {
            id: 1,
            customerId: '01',
            businessHubId: '45678',
            businessHub: 'Mowe',
            feederId: '24563',
            feeder: 'Ibafo',
            dssId: '82736',
            dss: 'Estate'
        },
        {
            id: 2,
            customerId: '02',
            businessHubId: '45678',
            businessHub: 'Mowe',
            feederId: '24563',
            feeder: 'Ibafo',
            dssId: '82736',
            dss: 'Estate'
        },
        {
            id: 3,
            customerId: '03',
            businessHubId: '45678',
            businessHub: 'Mowe',
            feederId: '24563',
            feeder: 'Ibafo',
            dssId: '82736',
            dss: 'Estate'
        },
        {
            id: 4,
            customerId: '04',
            businessHubId: '45678',
            businessHub: 'Mowe',
            feederId: '24563',
            feeder: 'Ibafo',
            dssId: '82736',
            dss: 'Estate'
        },
        {
            id: 5,
            customerId: '05',
            businessHubId: '45678',
            businessHub: 'Mowe',
            feederId: '24563',
            feeder: 'Ibafo',
            dssId: '82736',
            dss: 'Estate'
        },
        {
            id: 6,
            customerId: '06',
            businessHubId: '45678',
            businessHub: 'Mowe',
            feederId: '24563',
            feeder: 'Ibafo',
            dssId: '82736',
            dss: 'Estate'
        },
        {
            id: 7,
            customerId: '07',
            businessHubId: '45678',
            businessHub: 'Mowe',
            feederId: '24563',
            feeder: 'Ibafo',
            dssId: '82736',
            dss: 'Estate'
        },
        {
            id: 8,
            customerId: '08',
            businessHubId: '45678',
            businessHub: 'Mowe',
            feederId: '24563',
            feeder: 'Ibafo',
            dssId: '82736',
            dss: 'Estate'
        },
        {
            id: 9,
            customerId: '09',
            businessHubId: '45678',
            businessHub: 'Mowe',
            feederId: '24563',
            feeder: 'Ibafo',
            dssId: '82736',
            dss: 'Estate'
        },
        {
            id: 10,
            customerId: '10',
            businessHubId: '45678',
            businessHub: 'Mowe',
            feederId: '24563',
            feeder: 'Ibafo',
            dssId: '82736',
            dss: 'Estate'
        },

    ]

    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handlePageSizeChange = (newPageSize: number) => {
        setRowsPerPage(newPageSize);
        setCurrentPage(0);
    };

    const allSelected = selectedRows.length === CUSTOMER_POP.length;

    return (
        <DailyContainer title="Feeder to DSS Mapping">
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
                        <TableHead>Business Hub ID</TableHead>
                        <TableHead>Business Hub</TableHead>
                        <TableHead>Feeder ID</TableHead>
                        <TableHead>Feeder</TableHead>
                        <TableHead>DSS ID </TableHead>
                        <TableHead>DSS</TableHead>
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
                        <TableCell>{emp.businessHubId ?? '-'}</TableCell>
                        <TableCell>{emp.businessHub}</TableCell>
                        <TableCell>{emp.feederId}</TableCell>
                        <TableCell>{emp.feeder}</TableCell>
                        <TableCell>{emp.dssId}</TableCell>
                        <TableCell>{emp.dss}</TableCell> </TableRow>
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

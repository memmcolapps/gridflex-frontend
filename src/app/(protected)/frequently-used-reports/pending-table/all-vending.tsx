import ReportTable from "@/components/customized-report/reports-body/report-table";
import {
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { useState } from "react";
import { CUSTOMER_POP_VENDING } from "../data";
import { PaginationControls } from "@/components/ui/pagination-controls";

export default function AllPendingReport() {
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handlePageSizeChange = (newPageSize: number) => {
        setRowsPerPage(newPageSize);
        setCurrentPage(0);
    };

    const allSelected = selectedRows.length === CUSTOMER_POP_VENDING.length;

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
                                                e.target.checked ? CUSTOMER_POP_VENDING.map((_, i) => i) : []
                                            )
                                        }
                                    />
                                    <span>S/N</span>
                                </div>
                            </TableHead>
                            <TableHead>Customer ID</TableHead>
                            <TableHead>First Name</TableHead>
                            <TableHead>Last Name</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Phone Number</TableHead>
                            <TableHead>Account Number</TableHead>
                            <TableHead>Feeder</TableHead>
                            <TableHead>DSS</TableHead>
                            <TableHead>Meter Number</TableHead>
                            <TableHead>SIM No.</TableHead>
                            <TableHead>Meter Class</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Energy Consumed</TableHead>
                            <TableHead>Adjustment</TableHead>
                            <TableHead>New Outstanding Balance</TableHead>
                            <TableHead>Band</TableHead>
                            <TableHead>Tariff Type</TableHead>
                            <TableHead>Tariff Rate</TableHead>
                            <TableHead>Token Type</TableHead>
                            <TableHead>Token Amount</TableHead>
                            <TableHead>Unit Cost</TableHead>
                            <TableHead>VAT</TableHead>
                            <TableHead>Units</TableHead>
                            <TableHead>Transaction Date</TableHead>
                        </TableRow>
                }
            >
                    {CUSTOMER_POP_VENDING.map((emp, index) => (
                        <TableRow key={emp.id} className="text-center">
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
                            <TableCell>{emp.cusomerId}</TableCell>
                            <TableCell>{emp.firstName}</TableCell>
                            <TableCell>{emp.lastName}</TableCell>
                            <TableCell>{emp.address.length > 20 ? `${emp.address.slice(0,20)}...` : emp.address}</TableCell>
                            <TableCell>{emp.phoneNo}</TableCell>
                            <TableCell>{emp.accountNumber}</TableCell>
                            <TableCell>{emp.feeder}</TableCell>
                            <TableCell>{emp.dss}</TableCell>
                            <TableCell>{emp.meterNumber}</TableCell>
                            <TableCell>{emp.simNo}</TableCell>
                            <TableCell>{emp.meterClass}</TableCell>
                            <TableCell>{emp.amount}</TableCell>
                            <TableCell>{emp.energyConsumed}</TableCell>
                            <TableCell>{emp.adjustment}</TableCell>
                            <TableCell>{emp.outstandingBalance}</TableCell>
                            <TableCell>{emp.band}</TableCell>
                            <TableCell>{emp.tariffType}</TableCell>
                            <TableCell>{emp.tarriffRate}</TableCell>
                            <TableCell>{emp.tokenType}</TableCell>
                            <TableCell>{emp.tokenAmount}</TableCell>
                            <TableCell>{emp.unitCost}</TableCell>
                            <TableCell>{emp.vat}</TableCell>
                            <TableCell>{emp.units}</TableCell>
                            <TableCell>{emp.transactionDate}</TableCell>
                        </TableRow>
                    ))}
            </ReportTable>
            </div>
 
            <PaginationControls
                currentPage={currentPage}
                totalItems={CUSTOMER_POP_VENDING.length}
                pageSize={rowsPerPage}
                onPageChange={setCurrentPage}
                onPageSizeChange={handlePageSizeChange}
                zeroBasedIndexing={true}
            />
        </div>
         
    );
}

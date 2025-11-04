import ReportTable from "@/components/customized-report/reports-body/report-table";
import {
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { useState } from "react";
import { CUSTOMER_POP_VENDING } from "../data";
import { PaginationControls } from "@/components/ui/pagination-controls";

export default function TokenDetailsReport() {
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
                            <TableHead>Token Type</TableHead>
                            <TableHead>Token Amount</TableHead>
                            <TableHead>Unit Cost</TableHead>
                            <TableHead>VAT</TableHead>
                            <TableHead>Units</TableHead>
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
                            <TableCell>{emp.tokenType}</TableCell>
                            <TableCell>{emp.tokenAmount}</TableCell>
                            <TableCell>{emp.unitCost}</TableCell>
                            <TableCell>{emp.vat}</TableCell>
                            <TableCell>{emp.units}</TableCell>
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

import ReportTable from "@/components/customized-report/reports-body/report-table";
import {
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { CUSTOMER_POP } from "../data";

export default function AllReport() {
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

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
                            <TableHead>Transaction ID</TableHead>
                            <TableHead>Transaction Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Energy Consumed</TableHead>
                            <TableHead>Adjustment</TableHead>
                            <TableHead>New Outstanding Balance</TableHead>
                            <TableHead>Band</TableHead>
                            <TableHead>Tariff Type</TableHead>
                            <TableHead>Tariff Rate</TableHead>
                        </TableRow>
                }
            >
                    {CUSTOMER_POP.map((emp, index) => (
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
                            <TableCell>{emp.transactionId}</TableCell>
                            <TableCell>{emp.transactionDate}</TableCell>
                            <TableCell>{emp.amount}</TableCell>
                            <TableCell>{emp.energyConsumed}</TableCell>
                            <TableCell>{emp.adjustment}</TableCell>
                            <TableCell>{emp.outstandingBalance}</TableCell>
                            <TableCell>{emp.band}</TableCell>
                            <TableCell>{emp.tariffType}</TableCell>
                            <TableCell>{emp.tarriffRate}</TableCell>
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

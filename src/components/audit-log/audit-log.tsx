import { SearchControl, SortControl } from "../search-control";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import React, { useState } from "react";
import { AuditLogDetailsDialog } from "./audit-log-details";
import { useAuditLogs } from "@/hooks/use-audit";
import { type AuditLog } from "@/service/audit-log-service";
import { PaginationControls } from "../ui/pagination-controls";

export function AuditLog() {
  const [selectedEntry, setSelectedEntry] = useState<AuditLog | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const apiPage = currentPage - 1;
  const { data, isLoading, isError, error } = useAuditLogs(
    apiPage,
    rowsPerPage,
  );

  const totalRows = data?.totalData ?? 0;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalRows);

  const handleRowClick = (entry: AuditLog) => {
    setSelectedEntry(entry);
    setIsDialogOpen(true);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setRowsPerPage(newPageSize);
    setCurrentPage(1);
  };

  return (
    <div className="h-screen overflow-auto">
      <div className="flex h-full flex-col gap-4">
        <h1 className="text-2xl font-bold">Audit Log</h1>
        <p className="text-gray-600">
          Track system events and user actions for security and accountability
          here.
        </p>
        <div className="mb-6 flex w-80 items-center gap-4">
          <div className="flex items-center gap-2">
            <SearchControl />
          </div>
          <SortControl />
        </div>
        <div>
          <div className="w-full overflow-x-auto bg-transparent">
            <Table>
              <TableHeader className="bg-transparent">
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Group Permission</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>User Agent</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Time Stamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center">
                      Loading audit logs...
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-8 text-center text-red-600"
                    >
                      Error loading audit logs: {error?.toString()}
                    </TableCell>
                  </TableRow>
                ) : !data?.data || data.data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-8 text-center text-gray-500"
                    >
                      No audit logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  data.data.map((row: AuditLog, idx: number) => (
                    <TableRow
                      key={row.id ?? idx}
                      onClick={() => handleRowClick(row)}
                      className="cursor-pointer transition-colors hover:bg-gray-100"
                    >
                      <TableCell>
                        <span>{row.username}</span>
                        <br />
                        <span className="text-xs text-gray-500">
                          {row.email}
                        </span>
                      </TableCell>
                      <TableCell>{row.groupPermission}</TableCell>
                      <TableCell>{row.activity}</TableCell>
                      <TableCell>{row.userAgent}</TableCell>
                      <TableCell>{row.ipAddress}</TableCell>
                      <TableCell>
                        {typeof row.timeStamp === "string" ||
                        typeof row.timeStamp === "number"
                          ? row.timeStamp
                          : (row.timeStamp as Date).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <AuditLogDetailsDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            entry={selectedEntry}
          />
        </div>
        <PaginationControls
          currentPage={currentPage}
          totalItems={totalRows}
          pageSize={rowsPerPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={[5, 10, 12, 20, 50]}
          rowsPerPageLabel="Rows per page"
        />
      </div>
    </div>
  );
}

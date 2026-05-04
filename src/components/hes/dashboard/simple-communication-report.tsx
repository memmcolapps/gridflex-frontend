"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect } from "react";

export interface ReportData {
  serialNumber: string;
  meterNo: string;
  meterModel: string;
  connectionType: "Online" | "Offline";
  lastSync: string;
}

interface SimpleCommunicationReportProps {
  data?: ReportData[];
  onRefresh?: () => void; // Optional callback for refreshing data
}

const getStatusStyle = (status: "Online" | "Offline") => {
  if (status === "Online") {
    return "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600";
  }
  return "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-500";
};

const SimpleCommunicationReport = ({
  data = [],
  onRefresh,
}: SimpleCommunicationReportProps) => {
  useEffect(() => {
    if (!onRefresh) return;

    const interval = setInterval(
      () => {
        onRefresh();
      },
      3 * 60 * 1000,
    ); 

    return () => clearInterval(interval); 
  }, [onRefresh]);
  return (
    // h-85 matches the Chart card height
    <Card className="flex h-85 w-full flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <CardHeader className="shrink-0 p-0 pb-3">
        <CardTitle className="text-base font-semibold text-gray-800">
          Communication Report
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-0">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b border-gray-100">
              <TableHead className="py-2 text-left text-xs font-medium text-gray-500">
                S/N
              </TableHead>
              <TableHead className="py-2 text-left text-xs font-medium text-gray-500">
                Meter No.
              </TableHead>
              <TableHead className="py-2 text-left text-xs font-medium text-gray-500">
                Meter Model
              </TableHead>
              <TableHead className="py-2 text-left text-xs font-medium text-gray-500">
                Status
              </TableHead>
              <TableHead className="py-2 text-left text-xs font-medium text-gray-500">
                Last Sync
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.serialNumber}
                className="border-b border-gray-50"
              >
                <TableCell className="py-3 text-sm text-gray-700">
                  {row.serialNumber}
                </TableCell>
                <TableCell className="py-3 text-sm text-gray-700">
                  {row.meterNo}
                </TableCell>
                <TableCell className="py-3 text-sm text-gray-700">
                  {row.meterModel}
                </TableCell>
                <TableCell className="py-3">
                  <span className={getStatusStyle(row.connectionType)}>
                    {row.connectionType}
                  </span>
                </TableCell>
                <TableCell className="py-3 text-sm text-gray-700">
                  {row.lastSync}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SimpleCommunicationReport;

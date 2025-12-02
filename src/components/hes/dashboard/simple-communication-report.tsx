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

export interface ReportData {
  serialNumber: string;
  meterNo: string;
  meterModel: string;
  status: "Online" | "Offline";
  lastSync: string;
}

interface SimpleCommunicationReportProps {
  data?: ReportData[];
}

const defaultData: ReportData[] = [
  {
    serialNumber: "01",
    meterNo: "6212456987",
    meterModel: "MMX 310 -NG",
    status: "Offline",
    lastSync: "1 mins ago",
  },
  {
    serialNumber: "02",
    meterNo: "6212456987",
    meterModel: "MMX 110 -NG",
    status: "Online",
    lastSync: "2 hours ago",
  },
  {
    serialNumber: "03",
    meterNo: "6212456987",
    meterModel: "MMX 110 -NG",
    status: "Offline",
    lastSync: "2 hours ago",
  },
  {
    serialNumber: "04",
    meterNo: "6212456987",
    meterModel: "MMX 110 -NG",
    status: "Online",
    lastSync: "2 hours ago",
  },
];

const getStatusStyle = (status: "Online" | "Offline") => {
  if (status === "Online") {
    return "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600";
  }
  return "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-500";
};

const SimpleCommunicationReport = ({ data = defaultData }: SimpleCommunicationReportProps) => {
  return (
    // h-85 matches the Chart card height
    <Card className="w-full bg-white shadow-sm rounded-lg border border-gray-200 p-4 h-85 flex flex-col">
      <CardHeader className="p-0 pb-3 shrink-0">
        <CardTitle className="text-base font-semibold text-gray-800">
          Communication Report
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b border-gray-100">
              <TableHead className="text-left text-xs font-medium text-gray-500 py-2">S/N</TableHead>
              <TableHead className="text-left text-xs font-medium text-gray-500 py-2">Meter No.</TableHead>
              <TableHead className="text-left text-xs font-medium text-gray-500 py-2">Meter Model</TableHead>
              <TableHead className="text-left text-xs font-medium text-gray-500 py-2">Status</TableHead>
              <TableHead className="text-left text-xs font-medium text-gray-500 py-2">Last Sync</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.serialNumber} className="border-b border-gray-50">
                <TableCell className="text-sm text-gray-700 py-3">{row.serialNumber}</TableCell>
                <TableCell className="text-sm text-gray-700 py-3">{row.meterNo}</TableCell>
                <TableCell className="text-sm text-gray-700 py-3">{row.meterModel}</TableCell>
                <TableCell className="py-3">
                  <span className={getStatusStyle(row.status)}>
                    {row.status}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-gray-700 py-3">{row.lastSync}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SimpleCommunicationReport;
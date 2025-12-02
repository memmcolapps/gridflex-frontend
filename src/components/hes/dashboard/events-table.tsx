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

interface EventData {
  serialNumber: string;
  meterNo: string;
  time: string;
  eventType: string;
  event: string;
}

interface EventsTableProps {
  data?: EventData[];
}

const defaultData: EventData[] = [
  {
    serialNumber: "01",
    meterNo: "6212456987",
    time: "2025-07-26 00:",
    eventType: "Standard Ev",
    event: "Clock Invalid",
  },
  {
    serialNumber: "02",
    meterNo: "6212456987",
    time: "2025-07-26 00:",
    eventType: "Token Event",
    event: "Credit Token",
  },
  {
    serialNumber: "03",
    meterNo: "6212456987",
    time: "2025-07-26 00:",
    eventType: "Fraud Event",
    event: "Bypass",
  },
  {
    serialNumber: "04",
    meterNo: "6212456987",
    time: "2025-07-26 00:",
    eventType: "Fraud Event",
    event: "Bypass",
  },
];

const EventsTable = ({ data = defaultData }: EventsTableProps) => {
  return (
    <Card className="w-full bg-white shadow-sm rounded-lg border border-gray-200 p-4 h-85">
      <CardHeader className="p-0 pb-3">
        <CardTitle className="text-base font-semibold text-gray-800">
          Events
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b border-gray-100">
              <TableHead className="text-left text-xs font-medium text-gray-500 py-2">S/N</TableHead>
              <TableHead className="text-left text-xs font-medium text-gray-500 py-2">Meter No.</TableHead>
              <TableHead className="text-left text-xs font-medium text-gray-500 py-2">Time</TableHead>
              <TableHead className="text-left text-xs font-medium text-gray-500 py-2">Event Type</TableHead>
              <TableHead className="text-left text-xs font-medium text-gray-500 py-2">Event</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.serialNumber} className="border-b border-gray-50">
                <TableCell className="text-sm text-gray-700 py-3">{row.serialNumber}</TableCell>
                <TableCell className="text-sm text-gray-700 py-3">{row.meterNo}</TableCell>
                <TableCell className="text-sm text-gray-700 py-3">{row.time}</TableCell>
                <TableCell className="text-sm text-gray-700 py-3">{row.eventType}</TableCell>
                <TableCell className="text-sm text-gray-700 py-3">{row.event}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default EventsTable;
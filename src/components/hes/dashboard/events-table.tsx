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
  eventTypeId: string;
  criticalLevel: number;
}

const getEventTypeRank = (criticalLevel: number) => {
  switch (criticalLevel) {
    case 1:
      return "bg-green-50";
    case 2:
      return "bg-blue-50";
    case 3:
      return "bg-yellow-50";
    case 4:
      return "bg-orange-50";
    case 5:
      return "bg-red-50";
    default:
      return "bg-gray-50";
  }
};

interface EventsTableProps {
  data?: EventData[];
}

const EventsTable = ({ data }: EventsTableProps) => {
  return (
    <Card className="h-full w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <CardHeader className="p-0">
        <CardTitle className="text-base font-semibold text-gray-800">
          Events
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
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
                Time
              </TableHead>
              <TableHead className="py-2 text-left text-xs font-medium text-gray-500">
                Event Type
              </TableHead>
              <TableHead className="py-2 text-left text-xs font-medium text-gray-500">
                Event
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((row) => (
              <TableRow
                key={row.serialNumber}
                className={`border-b border-gray-50 ${getEventTypeRank(row.criticalLevel)}`}
              >
                <TableCell className="py-3 text-sm text-gray-700">
                  {row.serialNumber}
                </TableCell>
                <TableCell className="py-3 text-sm text-gray-700">
                  {row.meterNo}
                </TableCell>
                <TableCell className="py-3 text-sm text-gray-700">
                  {row.time}
                </TableCell>
                <TableCell className="py-3 text-sm text-gray-700">
                  {row.eventType}
                </TableCell>
                <TableCell className="py-3 text-sm text-gray-700">
                  {row.event}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default EventsTable;

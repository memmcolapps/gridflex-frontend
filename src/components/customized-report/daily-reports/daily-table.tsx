"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { type ReactNode } from "react";

interface ReportTableProps<T> {
  headers: ReactNode;
  data: T[];
  children: (item: T, index: number) => ReactNode;
  sumKeys?: (keyof T)[]; 
}

export default function DailyTable<T extends Record<string, unknown>>({
  headers,
  data,
  children,
  sumKeys = [],
}: ReportTableProps<T>) {
  const totals = sumKeys.map((key) =>
    data.reduce((sum, item) => sum + (Number(item[key]) || 0), 0)
  );

  return (
    <Table>
      <TableHeader className="bg-gray-50 h-14">{headers}</TableHeader>

      <TableBody>
        {data.map((item, index) => children(item, index))}
      </TableBody>

      {sumKeys.length > 0 && (
        <TableFooter>
          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell className="pt-6 font-semibold">
              Total : 
            </TableCell>

            {totals.map((total, i) => (
              <TableCell key={i} className="text-middle pt-6 font-semibold">
                {total.toLocaleString()}
              </TableCell>
            ))}
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
}

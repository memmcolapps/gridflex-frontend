"use client";

import {
  Table,
  TableHeader,
  TableBody,
} from "@/components/ui/table";
import { type ReactNode } from "react";

interface ReportTableProps {
  headers: ReactNode;
  children: ReactNode;
}

export default function ReportTable({ headers, children }: ReportTableProps) {
  return (
    <Table>
      <TableHeader className="bg-gray-50">
        {headers}
      </TableHeader>
      <TableBody>{children}</TableBody>
    </Table>
  );
}

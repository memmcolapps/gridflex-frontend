import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "../ui/card";
import { LoadingAnimation } from "@/components/ui/loading-animation";
import { Loader2 } from "lucide-react";

export interface MeterData {
  [key: string]: string;
  meter: string;
  time: string;
}

interface DataTableProps {
  data: MeterData[];
  reading: string[];
  loading: boolean;
  readingLabelMap?: Record<string, string>;
}

type CellState = "spinner" | "idle" | "failed" | "success";

function getCellState(
  row: MeterData,
  readingKey: string,
  activeReadings: string[],
): CellState {
  const status = row[`${readingKey}__status`];
  const value = row[readingKey];
  const isLoadingDone = row[`${readingKey}__loading`] === "false";

  if (status === "-1") return "failed";
  if (value !== undefined && value !== "" && isLoadingDone) return "success";

  // Pending — check if this is the first unresolved column
  const firstPending = activeReadings.find((r) => {
    const s = row[`${r}__status`];
    const v = row[r];
    const done =
      s === "-1" ||
      (v !== undefined && v !== "" && row[`${r}__loading`] === "false");
    return !done;
  });

  return firstPending === readingKey ? "spinner" : "idle";
}

export function DataTable({
  data,
  reading,
  loading,
  readingLabelMap = {},
}: DataTableProps) {
  const activeReadings = reading.filter(
    (r) => r !== "meter-serial-number" && r !== "clock object",
  );

  const dynamicColumns = activeReadings.map((r) => readingLabelMap[r] ?? r);
  const columns = ["S/N", "Meter Serial Number", "Time", ...dynamicColumns];

  return (
    <Card className="w-full border-none">
      <div className="w-full overflow-x-auto">
        <Table className="min-w-max">
          <TableHeader className="bg-transparent">
            <TableRow>
              {columns.map((col, i) => (
                <TableHead
                  key={i}
                  className="py-4 text-center text-base whitespace-nowrap"
                >
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-8 text-center"
                >
                  <LoadingAnimation
                    variant="spinner"
                    message="Loading meter data..."
                    size="md"
                  />
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, idx) => (
                <TableRow key={idx} className="text-center text-base">
                  <TableCell className="py-4 whitespace-nowrap">
                    {(idx + 1).toString().padStart(2, "0")}
                  </TableCell>

                  <TableCell className="py-4 whitespace-nowrap">
                    {row.meter}
                  </TableCell>

                  <TableCell className="py-4 whitespace-nowrap">
                    {row.time}
                  </TableCell>

                  {activeReadings.map((r) => {
                    const state = getCellState(row, r, activeReadings);

                    if (state === "spinner") {
                      return (
                        <TableCell
                          key={r}
                          className="flex justify-center py-4 whitespace-nowrap"
                        >
                          <Loader2
                            size={16}
                            className="animate-spin text-gray-400"
                          />
                        </TableCell>
                      );
                    }

                    if (state === "idle") {
                      return (
                        <TableCell
                          key={r}
                          className="py-4 whitespace-nowrap text-gray-300"
                        >
                          —
                        </TableCell>
                      );
                    }

                    if (state === "failed") {
                      return (
                        <TableCell
                          key={r}
                          className="py-4 whitespace-nowrap text-red-500"
                          title={row[r] ?? "Failed to read from meter"}
                        >
                          {row[r] ?? "failed"}
                        </TableCell>
                      );
                    }

                    return (
                      <TableCell key={r} className="py-4 whitespace-nowrap">
                        {row[r]}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

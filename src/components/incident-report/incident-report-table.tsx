"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIncidentReports } from "@/hooks/use-incident";
import { Clock } from "lucide-react";
import { useState } from "react";
import { PaginationControls } from "@/components/ui/pagination-controls";

export default function RecentIncidents() {
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data: incidents } = useIncidentReports(currentPage, rowsPerPage);
  const incidentList = incidents?.data?.data ?? [];
  const totalData = incidents?.data?.totalData ?? 0;

  const handlePageSizeChange = (newPageSize: number) => {
    setRowsPerPage(newPageSize);
    setCurrentPage(0); // Reset to first page (0-based)
  };

  return (
    <div className="py-8">
      <div className="w-full">
        <div className="Recent Incidents">
          <Card className="gap-0 rounded-lg border-gray-100 bg-white pt-6 pb-6 shadow-none">
            <CardHeader>
              <CardTitle className="text-xl font-medium">
                All Incidents
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-col gap-5">
                {incidentList?.map((incident, index) => (
                  <div
                    key={index}
                    className={`flex flex-col gap-1 rounded-lg bg-gray-100`}
                  >
                    <div className="flex items-center justify-between pr-4">
                      <div>
                        <ul>
                          <div className="flex gap-2 py-2">
                            <div className="pt-2 pl-2">
                              <div className="h-[5.5px] w-[5.5px] rounded-full bg-[#161CCA]"></div>
                            </div>
                            <li className="flex flex-col">
                              <span className="text-gray-900">
                                {incident.message}
                              </span>
                              <span className="text-gray-600">
                                User: `{incident.user.firstname}{" "}
                                {incident.user.lastname}`
                              </span>
                              {/* {incident?.organization && ( */}
                              <span className="text-gray-600">
                                Utility Company:{" "}
                                {incident.organization.businessName}{" "}
                              </span>
                              {/* )} */}
                              <span className="flex items-center gap-1 text-gray-600">
                                {new Date(
                                  incident.createdAt,
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                                <div className="h-[4px] w-[4px] rounded-full bg-[#6D6D6D]"></div>
                                <Clock size={16} color="#6D6D6D" />
                                {new Date(
                                  incident.createdAt,
                                ).toLocaleTimeString("en-US", {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </span>
                            </li>
                          </div>
                        </ul>
                      </div>
                      <div>
                        <div className="flex h-10 items-center gap-2 rounded-md border-1 border-gray-400 bg-transparent px-4 font-semibold text-black">
                          {incident.status === false
                            ? "Unresolved"
                            : "Resolved"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <PaginationControls
                currentPage={currentPage}
                totalItems={totalData}
                pageSize={rowsPerPage}
                onPageChange={setCurrentPage}
                onPageSizeChange={handlePageSizeChange}
                zeroBasedIndexing={true}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

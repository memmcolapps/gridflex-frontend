'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIncidentReports } from "@/hooks/use-incident";
import { Clock } from "lucide-react";
import { useState } from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "../ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";


export default function RecentIncidents() {
    const [currentPage, setCurrentPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const { data: incidents } = useIncidentReports(currentPage, rowsPerPage)
    const incidentList = incidents?.data?.data || [];
    const totalData = incidents?.data?.totalData || 0;
    const totalPages = Math.ceil(totalData / rowsPerPage)

    const handleRowsPerPageChange = (value: string) => {
        setRowsPerPage(Number(value))
        setCurrentPage(1)
    }

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1)
        }
    }

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1)
        }
    }


    return (
        <div className="py-8">
            <div className="w-full">
                <div className="Recent Incidents">
                    <Card className="shadow-none border-gray-100 gap-0 rounded-lg pb-6 pt-6 bg-white">
                        <CardHeader>
                            <CardTitle className="text-xl font-medium">
                                All Incidents
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="flex flex-col gap-5">
                                {incidentList?.map((incident, index) => (
                                    <div key={index} className={`
                                        rounded-lg flex flex-col gap-1 bg-gray-100
                                        `}>
                                        <div className="flex justify-between items-center pr-4">
                                            <div>
                                                <ul>
                                                    <div className="flex py-2 gap-2">
                                                        <div className="pt-2 pl-2">
                                                            <div className="w-[5.5px] h-[5.5px] bg-[#161CCA] rounded-full"></div>
                                                        </div>
                                                        <li className="flex flex-col">
                                                            <span className="text-gray-900">{incident.message}</span>
                                                            <span className="text-gray-600">User: `{incident.user.firstname} {incident.user.lastname}`</span>
                                                            {/* {incident?.organization && ( */}
                                                            <span className="text-gray-600">Utility Company: {incident.organization.businessName} </span>
                                                            {/* )} */}
                                                            <span className="text-gray-600 gap-1 flex items-center">
                                                                {new Date(incident.createdAt).toLocaleDateString("en-US", {
                                                                    month: "short",
                                                                    day: "numeric",
                                                                    year: "numeric",
                                                                })}
                                                                <div className="w-[4px] h-[4px] bg-[#6D6D6D] rounded-full"></div>
                                                                <Clock size={16} color="#6D6D6D" />
                                                                {new Date(incident.createdAt).toLocaleTimeString("en-US", {
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
                                                <div
                                                    className="flex h-10 text-black font-semibold items-center rounded-md border border-1 border-gray-400 px-4 gap-2 bg-transparent "
                                                >
                                                    {incident.status === false ? 'Unresolved' : 'Resolved'}

                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                ))}
                            </div>
                            <Pagination className="mt-4 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium">Rows per page</span>
                                    <Select
                                        value={rowsPerPage.toString()}
                                        onValueChange={handleRowsPerPageChange}
                                    >
                                        <SelectTrigger className="h-8 w-[70px]">
                                            <SelectValue />
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
                                    <span className="text-sm font-medium">
                                        {(currentPage - 1) * rowsPerPage + 1}-
                                        {Math.min(currentPage * rowsPerPage, incidentList.length)} of {incidentList.length}
                                    </span>
                                </div>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={e => {
                                                e.preventDefault();
                                                handlePrevious();
                                            }}
                                            aria-disabled={currentPage === 1}
                                        />
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={e => {
                                                e.preventDefault();
                                                handleNext();
                                            }}
                                            aria-disabled={currentPage === totalData}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </CardContent>

                    </Card>
                </div>
            </div>
        </div>
    )
}

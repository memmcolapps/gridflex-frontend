"use client";

import { useState } from "react";
import { SearchAndFilters } from "@/components/dashboard/SearchAndFilters";
import { FilterControl } from "@/components/search-control";
import { Button } from "@/components/ui/button";
import { ContentHeader } from "@/components/ui/content-header";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, CircleCheck, CirclePause, CirclePlus, Edit, MoreVertical, Pencil, RefreshCcw, Search, Send, Trash2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import SetSyncScheduleDialog from "@/components/hes/controlsconfigs/data-collection-schedule/set-sync-schedule-dialog";

// Define the shape of the filter object based on filterSections
interface FilterType {
    [key: string]: string | boolean;
}

// Define the shape of the sync schedule data
interface SyncScheduleData {
    eventType: string;
    timeInterval: string;
    unit: string;
    activeDays: string;
}

const filterSections = [
    {
        title: "Meter Class",
        options: [
            { label: "Single Phase", id: "singlePhase" },
            { label: "Three Phase", id: "threePhase" },
            { label: "MD", id: "md" },
        ],
    },
    {
        title: "Meter Type",
        options: [
            { label: "Prepaid", id: "prepaid" },
            { label: "Postpaid", id: "postPaid" },
        ],
    },
];

export default function DataCollScheduler() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const handleSetActiveFilters = (filters: FilterType) => {
        console.log("Filters applied:", filters);
    };

    const handleSortChange = (sortType: string) => {
        console.log("Sort by:", sortType);
    };

    const handleDialogSubmit = (data: SyncScheduleData) => {
        console.log("Sync schedule set:", data);
        // Add your logic to handle the submitted data (e.g., API call)
    };

    const data = [
        { sNo: "01", eventType: "Standard Event Log", timeInterval: "30 mins", activeDays: "Repeat Daily", status: "Active" },
        { sNo: "02", eventType: "Relay Control Log", timeInterval: "30 mins", activeDays: "Repeat (Mon-Fri)", status: "Paused" },
        { sNo: "03", eventType: "Power Quality Log", timeInterval: "2 mins", activeDays: "Repeat Daily", status: "Active" },
        { sNo: "04", eventType: "Communication Log", timeInterval: "30 mins", activeDays: "Repeat (Mon-Fri)", status: "Active" },
        { sNo: "05", eventType: "Power Quality Log", timeInterval: "30 mins", activeDays: "Repeat Daily", status: "Active" },
        { sNo: "06", eventType: "Token Event Profile", timeInterval: "30 mins", activeDays: "Repeat (Mon-Fri)", status: "Active" },
        { sNo: "07", eventType: "Energy Profile", timeInterval: "10 mins", activeDays: "Repeat Daily", status: "Active" },
        { sNo: "08", eventType: "Instant Data Profile", timeInterval: "12 mins", activeDays: "Repeat (Mon-Fri)", status: "Paused" },
        { sNo: "09", eventType: "Billing Data", timeInterval: "30 mins", activeDays: "Repeat Only", status: "Paused" },
        { sNo: "10", eventType: "Fraud Event Log", timeInterval: "30 mins", activeDays: "Repeat Daily", status: "Paused" },
    ];

    return (
        <div className="p-16 overflow-y-auto h-screen w-full flex flex-col">
            <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
                <ContentHeader
                    title="Data Collection Scheduler"
                    description="Set meter sync intervals and configure communication settings for efficient data transmission"
                />
                <Button
                    className="flex items-center gap-2 border font-medium bg-[#161CCA] text-white w-full md:w-auto cursor-pointer"
                    variant="outline"
                    size="lg"
                    onClick={() => setIsDialogOpen(true)}
                >
                    <RefreshCcw size={14} strokeWidth={2.3} className="h-4 w-4 text-white" />
                    <span className="text-sm md:text-base">Set Sync Schedule</span>
                </Button>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 w-full mb-4">
                <div className="relative w-full md:w-[300px]">
                    <Search
                        size={14}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                    />
                    <Input
                        type="text"
                        placeholder="Search by meter no., account no..."
                        className="pl-10 w-full border-gray-300 focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <FilterControl
                    sections={filterSections}
                    onApply={handleSetActiveFilters}
                    onReset={() => handleSetActiveFilters({})}
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2 border-gray-300 w-full sm:w-auto cursor-pointer">
                            <ArrowUpDown className="text-gray-500" size={14} />
                            <span className="hidden sm:inline text-gray-800">Sort</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-48">
                        <DropdownMenuItem
                            onClick={() => handleSortChange("asc")}
                            className="text-sm cursor-pointer hover:bg-gray-100"
                        >
                            Ascending
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleSortChange("desc")}
                            className="text-sm cursor-pointer hover:bg-gray-100"
                        >
                            Descending
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-100">
                            <TableHead className="p-2 text-left text-sm font-medium text-gray-600">S/N</TableHead>
                            <TableHead className="p-2 text-left text-sm font-medium text-gray-600">Event/Profile Type</TableHead>
                            <TableHead className="p-2 text-left text-sm font-medium text-gray-600">Time Interval</TableHead>
                            <TableHead className="p-2 text-left text-sm font-medium text-gray-600">Active Days</TableHead>
                            <TableHead className="p-2 text-left text-sm font-medium text-gray-600">Status</TableHead>
                            <TableHead className="p-2 text-left text-sm font-medium text-gray-600">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.sNo}>
                                <TableCell className="p-2 text-sm text-gray-800">{item.sNo}</TableCell>
                                <TableCell className="p-2 text-sm text-gray-800">{item.eventType}</TableCell>
                                <TableCell className="p-2 text-sm text-gray-800">{item.timeInterval}</TableCell>
                                <TableCell className="p-2 text-sm text-[#161CCA]">{item.activeDays}</TableCell>
                                <TableCell className="p-2 text-sm">
                                    <span
                                        className={`px-2 py-1 rounded-full ${item.status === "Active" ? "bg-[#E9FBF0] text-[#059E40]" : "bg-[#FFF5EA] text-[#C86900]"
                                            }`}
                                    >
                                        {item.status}
                                    </span>
                                </TableCell>
                                <TableCell className="p-2 text-sm text-gray-800">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="default" size="sm" className="border-gray-200 focus:ring-gray-500/0 cursor-pointer">
                                                <MoreVertical size={16} className="text-gray-500 border-gray-200" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="center" className="w-48 bg-white shadow-lg">
                                            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                                <CirclePause size={14} className="text-gray-500" />
                                                <span className="text-sm  text-black">Pause Schedule</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="flex items-center gap-2 cursor-pointer"
                                            >
                                                <Pencil size={14} className="text-gray-500" />
                                                <span className="text-sm text-black">Edit Sync Schedule</span>
                                            </DropdownMenuItem>
                                                      <DropdownMenuItem
                                                className="flex items-center gap-2 cursor-pointer"
                                            >
                                                <Trash2 size={14} className="text-gray-500" />
                                                <span className="text-sm text-black">Delete Sync Schedule</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <SetSyncScheduleDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={handleDialogSubmit}
            />
        </div>
    );
}
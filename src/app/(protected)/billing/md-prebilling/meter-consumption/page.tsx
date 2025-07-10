"use client";
import MeterConsumptions from "@/components/billing/meter-consumption";
import { SortControl } from "@/components/search-control";
import { Button } from "@/components/ui/button";
import { ContentHeader } from "@/components/ui/content-header";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ChevronDown, Search, SquareArrowOutUpRight } from "lucide-react";
import { useState } from "react";

export default function ReadingSheetPage() {
    const [isLoading, ] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [sortConfig, setSortConfig] = useState<string>("");
    const [selectedMonth, setSelectedMonth] = useState<string>("All");
    const [selectedYear, setSelectedYear] = useState<string>("All");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);

    const handleSortChange = (sortBy: string) => {
        setSortConfig(sortBy);
    };

    // List of months for dropdown
    const months = [
        "All",
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    // Generate years (current year and past 5 years)
    const currentYear = new Date().getFullYear();
    const years = ["All", ...Array.from({ length: 6 }, (_, i) => (currentYear - i).toString())];

    // Handle filter changes
    const handleMonthChange = (month: string) => {
        setSelectedMonth(month);
    };

    const handleYearChange = (year: string) => {
        setSelectedYear(year);
    };

    return (
        <div className="p-6">
            {/* Content Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <ContentHeader
                    title="Meter Consumption"
                    description="Generate energy consumption base on latest meter readings."
                />
            </div>

            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="relative w-full lg:w-[300px]">
                        <Search
                            size={14}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                        />
                        <Input
                            type="text"
                            placeholder="Search by meter no., account no..."
                            value={inputValue}
                            onChange={handleChange}
                            className="pl-10 w-full border-gray-300 focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50 text-sm lg:text-base"
                        />
                    </div>
                    <div className="flex gap-2">
                        <SortControl
                            onSortChange={handleSortChange}
                            currentSort={sortConfig}
                        />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="flex items-center gap-1 p-4">
                                    <ChevronDown size={14} />
                                    {selectedMonth}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {months.map((month) => (
                                    <DropdownMenuItem
                                        key={month}
                                        onClick={() => handleMonthChange(month)}
                                        className={selectedMonth === month ? "bg-gray-100" : ""}
                                    >
                                        {month}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="flex items-center gap-1 p-4">
                                    <ChevronDown size={14} />
                                    {selectedYear}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {years.map((year) => (
                                    <DropdownMenuItem
                                        key={year}
                                        onClick={() => handleYearChange(year)}
                                        className={selectedYear === year ? "bg-gray-100" : ""}
                                    >
                                        {year}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className="flex gap-5">
                    <Button
                        variant={"default"}
                        className="text-md cursor-pointer gap-2 border px-8 py-5 font-semibold text-[rgba(22,28,202,1)]"
                    >
                        <SquareArrowOutUpRight size={14} />
                        Export
                    </Button>
                </div>
            </div>

            <div className="flex-1 rounded-lg">
                {isLoading ? (
                    <div className="flex items-center justify-center p-8">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
                    </div>
                ) : (
                    <MeterConsumptions
                        searchQuery={inputValue}
                        sortConfig={sortConfig}
                        selectedMonth={selectedMonth}
                        selectedYear={selectedYear}
                    />
                )}
            </div>
        </div>
    );
}
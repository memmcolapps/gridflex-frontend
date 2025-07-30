"use client";
import BillingTable from "@/components/billing/billing-table";
import { SortControl } from "@/components/search-control";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ContentHeader } from "@/components/ui/content-header";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    ChevronDown,
    Loader,
    Lock,
    LockOpen,
    PlusCircle,
    RefreshCcw,
    Search,
    TriangleAlert,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function BillingPage() {
    const [isLoading] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [sortConfig, setSortConfig] = useState<string>("");
    const [selectedMonth, setSelectedMonth] = useState<string>("All");
    const [selectedYear, setSelectedYear] = useState<string>("All");
    const [isBillClosed, setIsBillClosed] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false); // State for Close Bill dialog

    // Generate Bill states
    const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
    const [processingDialogOpen, setProcessingDialogOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [selectedFilter, setSelectedFilter] = useState<string>("Feeder");
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    // Reverse Bill states
    const [isReverseDialogOpen, setIsReverseDialogOpen] = useState(false);
    const [isReverseProcessingDialogOpen, setIsReverseProcessingDialogOpen] = useState(false);
    const [reverseProgress, setReverseProgress] = useState(0);
    const [selectedReverseFilter, setSelectedReverseFilter] = useState<string>("Feeder");
    const [selectedReverseItems, setSelectedReverseItems] = useState<string[]>([]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setInputValue(e.target.value);

    const handleSortChange = (sortBy: string) => {
        setSortConfig(sortBy);
    };

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
        "December",
    ];

    const currentYear = new Date().getFullYear();
    const years = ["All", ...Array.from({ length: 6 }, (_, i) => (currentYear - i).toString())];

    const handleMonthChange = (month: string) => {
        setSelectedMonth(month);
    };

    const handleYearChange = (year: string) => {
        setSelectedYear(year);
    };

    const handleCloseBill = () => {
        setIsBillClosed(true);
        setIsDialogOpen(false);
    };

    // Generate Bill handlers
    const handleFilterSelect = (filter: string) => {
        setSelectedFilter(filter);
        setSelectedItems([]); // Clear selected items when filter changes
        setGenerateDialogOpen(true); // Open the dialog when a filter is selected
    };

    const handleProceed = () => {
        if (selectedItems.length > 0) {
            setGenerateDialogOpen(false);
            setProcessingDialogOpen(true);
            setProgress(0); // Reset progress for the new processing
        }
    };

    // Reverse Bill handlers
    const handleReverseFilterSelect = (filter: string) => {
        setSelectedReverseFilter(filter);
        setSelectedReverseItems([]); // Clear selected items when filter changes
        setIsReverseDialogOpen(true); // Open the reverse dialog when a filter is selected
    };

    const handleReverseProceed = () => {
        if (selectedReverseItems.length > 0) {
            setIsReverseDialogOpen(false);
            setIsReverseProcessingDialogOpen(true);
            setReverseProgress(0); // Reset progress for the new processing
        }
    };

    // Function to get all items for a given filter type (reused for both generate and reverse)
    const getAllItemsForFilter = (filter: string) => {
        switch (filter) {
            case "Feeder":
                return ["Ijeun", "Eko", "Molete"];
            case "MD":
                return ["MD1", "MD2", "MD3"];
            case "Non-MD":
                return ["NonMD1", "NonMD2", "NonMD3"];
            case "Account No.":
                return ["Acct1", "Acct2", "Acct3", "Acct4"];
            default:
                return [];
        }
    };

    // Handle individual item selection/deselection for Generate Bill
    const handleItemSelect = (item: string, checked: boolean) => {
        setSelectedItems((prev) =>
            checked ? [...prev, item] : prev.filter((i) => i !== item)
        );
    };

    // Handle select all/deselect all for Generate Bill
    const handleSelectAllForCurrentFilter = (checked: boolean) => {
        const allItems = getAllItemsForFilter(selectedFilter);
        setSelectedItems(checked ? allItems : []);
    };

    // Handle individual item selection/deselection for Reverse Bill
    const handleReverseItemSelect = (item: string, checked: boolean) => {
        setSelectedReverseItems((prev) =>
            checked ? [...prev, item] : prev.filter((i) => i !== item)
        );
    };

    // Handle select all/deselect all for Reverse Bill
    const handleReverseSelectAllForCurrentFilter = (checked: boolean) => {
        const allItems = getAllItemsForFilter(selectedReverseFilter);
        setSelectedReverseItems(checked ? allItems : []);
    };

    // Effect for Generate Bill processing progress simulation
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (processingDialogOpen && progress < 100) {
            interval = setInterval(() => {
                setProgress((prev) => (prev >= 100 ? 100 : prev + 10));
            }, 500);
        } else if (progress === 100) {
            setTimeout(() => {
                setProcessingDialogOpen(false);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [processingDialogOpen, progress]);

    // Effect for Reverse Bill processing progress simulation
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isReverseProcessingDialogOpen && reverseProgress < 100) {
            interval = setInterval(() => {
                setReverseProgress((prev) => (prev >= 100 ? 100 : prev + 10));
            }, 500);
        } else if (reverseProgress === 100) {
            setTimeout(() => {
                setIsReverseProcessingDialogOpen(false);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isReverseProcessingDialogOpen, reverseProgress]);


    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <ContentHeader
                    title="Billing"
                    description="Set and manage feeder reading to track electricity usage and generate bills."
                />
                {/* Generate Bill Button and Dropdown Menu for Filter Selection */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant={"default"}
                            className="text-md cursor-pointer gap-2 text-white px-8 py-6 font-semibold bg-[#161CCA]"
                        >
                            <PlusCircle size={14} />
                            Generate Bill
                            <ChevronDown size={14} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] py-2">
                        <DropdownMenuItem
                            className="cursor-pointer py-3 hover:bg-gray-50"
                            onClick={() => handleFilterSelect("Feeder")}
                        >
                            Feeder
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer py-3 hover:bg-gray-50"
                            onClick={() => handleFilterSelect("MD")}
                        >
                            MD
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer py-3 hover:bg-gray-50"
                            onClick={() => handleFilterSelect("Non-MD")}
                        >
                            Non-MD
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer py-3 hover:bg-gray-50"
                            onClick={() => handleFilterSelect("Account No.")}
                        >
                            Account No.
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
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
                        <SortControl onSortChange={handleSortChange} currentSort={sortConfig} />
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
                    {/* Reverse Bill Dropdown Menu for Filter Selection */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant={"default"}
                                className="text-md cursor-pointer gap-2 border px-8 py-5 font-semibold text-[#22C55E]"
                                disabled={isBillClosed}
                            >
                                <RefreshCcw size={14} />
                                Reverse Bill
                                <ChevronDown size={14} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="cursor-pointer py-2 w-[var(--radix-dropdown-menu-trigger-width)]">
                            <DropdownMenuItem
                                className="cursor-pointer py-3 hover:bg-gray-50"
                                onClick={() => handleReverseFilterSelect("Feeder")}
                            >
                                Feeder
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer py-3 hover:bg-gray-50"
                                onClick={() => handleReverseFilterSelect("MD")}
                            >
                                MD
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer py-3 hover:bg-gray-50"
                                onClick={() => handleReverseFilterSelect("Non-MD")}
                            >
                                Non-MD
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => handleReverseFilterSelect("Account No.")}
                            >
                                Account No.
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Close Bill Dialog */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant={"default"}
                                className="text-md cursor-pointer gap-2 border-none px-8 py-5 font-semibold text-white bg-[#F50202]"
                                disabled={isBillClosed}
                            >
                                {isBillClosed ? (
                                    <Lock size={14} strokeWidth={2.7} />
                                ) : (
                                    <LockOpen size={14} strokeWidth={2.7} />
                                )}
                                {isBillClosed ? "Closed" : "Close Bill"}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white h-fit">
                            <DialogHeader className="gap-4">
                                <TriangleAlert size={18} className="p-2 rounded-full bg-[#FEE2E2] text-[#F50202]" />
                                <DialogTitle>Close Bill</DialogTitle>
                            </DialogHeader>
                            <p>
                                Are you sure you want to close the bill?
                                <span className="text-gray-500 mt-1">
                                    Note: if bill is closed, it can never be reopened.
                                </span>
                            </p>
                            <DialogFooter>
                                <Button
                                    className="text-[#F50202] border-[#F50202] cursor-pointer"
                                    variant="outline"
                                    size="lg"
                                    onClick={() => setIsDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-[#F50202] text-white cursor-pointer"
                                    variant="destructive"
                                    size="lg"
                                    onClick={handleCloseBill}
                                >
                                    Close
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="flex-1 rounded-lg">
                {isLoading ? (
                    <div className="flex items-center justify-center p-8">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
                    </div>
                ) : (
                    <BillingTable
                        searchQuery={inputValue}
                        sortConfig={sortConfig}
                        selectedMonth={selectedMonth}
                        selectedYear={selectedYear}
                    />
                )}
            </div>

            {/* Generate Bill Dialog */}
            <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
                <DialogContent className="w-full bg-white h-fit">
                    <DialogHeader>
                        <DialogTitle>Generate Bill</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {/* Dynamic Label */}
                        <p className="text-sm text-gray-800">
                            {selectedFilter}s
                            <span className="ml-1 text-red-500">
                                *
                            </span>
                        </p>

                        {/* Custom Multi-Select Dropdown for Filters */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-between py-2 focus:ring-gray-50/20 mb-3 cursor-pointer"
                                >
                                    {selectedItems.length > 0
                                        ? selectedItems.join(", ")
                                        : `Select ${selectedFilter}s`}
                                    <ChevronDown size={16} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] py-2">
                                <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    className="py-3 hover:bg-gray-50 cursor-pointer"
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <span>Select All</span>
                                        <Checkbox
                                            checked={
                                                selectedItems.length === getAllItemsForFilter(selectedFilter).length &&
                                                selectedItems.every(item => getAllItemsForFilter(selectedFilter).includes(item))
                                            }
                                            onCheckedChange={(checked) => handleSelectAllForCurrentFilter(Boolean(checked))}
                                            className="data-[state=checked]:bg-[#22C55E] data-[state=checked]:text-white border-gray-500 rounded"
                                        />
                                    </div>
                                </DropdownMenuItem>
                                {getAllItemsForFilter(selectedFilter).map((item) => (
                                    <DropdownMenuItem
                                        key={item}
                                        onSelect={(e) => e.preventDefault()}
                                        className="py-3 hover:bg-gray-50 cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <span>{item}</span>
                                            <Checkbox
                                                checked={selectedItems.includes(item)}
                                                onCheckedChange={(checked) => handleItemSelect(item, Boolean(checked))}
                                                className="data-[state=checked]:bg-[#22C55E] data-[state=checked]:text-white border-gray-500 rounded"
                                            />
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="flex justify-between">
                            <Button
                                variant="outline"
                                className="mr-2 text-[#161CCA] border-[#161CCA] bg-transparent cursor-pointer py-5 px-8 hover:bg-[#161CCA]/10"
                                onClick={() => setGenerateDialogOpen(false)}
                                size="lg"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="default"
                                className="bg-[#161CCA] text-white cursor-pointer py-5 px-8"
                                size="lg"
                                onClick={handleProceed}
                                disabled={selectedItems.length === 0}
                            >
                                {selectedItems.length > 0 ? "Proceed" : "Generate Bill"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Processing Dialog for Generate Bill */}
            <Dialog open={processingDialogOpen} onOpenChange={setProcessingDialogOpen}>
                <DialogContent className="w-full bg-white h-fit text-center">
                    <DialogHeader className="text-center">
                        <DialogTitle className="mt-2 flex justify-center items-center flex-col gap-2">
                            {reverseProgress < 100 ? `${reverseProgress}%` : "Reversal completed"}
                            <Loader size={18} className="animate-spin duration-500"/>
                        </DialogTitle>
                        <div className="flex justify-center">
                            <div className="w-[100%] bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-[#161CCA] h-2.5 rounded-full transition-all duration-500 ease-in-out"
                                    style={{ width: `${progress}%` }}
                                >
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 flex justify-center items-center">
                            {progress < 100 ? "Processing..." : ""}
                        </p>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            {/* Reverse Bill Dialog */}
            <Dialog open={isReverseDialogOpen} onOpenChange={setIsReverseDialogOpen}>
                <DialogContent className="w-full bg-white h-fit">
                    <DialogHeader>
                        <DialogTitle>Reverse Bill</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {/* Dynamic Label for Reverse Bill */}
                        <p className="text-sm text-gray-800">
                            {selectedReverseFilter}s
                            <span className="ml-1 text-red-500">
                                *
                            </span>
                        </p>

                        {/* Custom Multi-Select Dropdown for Reverse Filters */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-between py-2 focus:ring-gray-50/20 mb-3 cursor-pointer"
                                >
                                    {selectedReverseItems.length > 0
                                        ? selectedReverseItems.join(", ")
                                        : `Select ${selectedReverseFilter}s`}
                                    <ChevronDown size={16} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] py-2">
                                <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    className="py-3 hover:bg-gray-50 cursor-pointer"
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <span>Select All</span>
                                        <Checkbox
                                            checked={
                                                selectedReverseItems.length === getAllItemsForFilter(selectedReverseFilter).length &&
                                                selectedReverseItems.every(item => getAllItemsForFilter(selectedReverseFilter).includes(item))
                                            }
                                            onCheckedChange={(checked) => handleReverseSelectAllForCurrentFilter(Boolean(checked))}
                                            className="data-[state=checked]:bg-[#22C55E] data-[state=checked]:text-white border-gray-500 rounded cursor-pointer"
                                        />
                                    </div>
                                </DropdownMenuItem>
                                {getAllItemsForFilter(selectedReverseFilter).map((item) => (
                                    <DropdownMenuItem
                                        key={item}
                                        onSelect={(e) => e.preventDefault()}
                                        className="py-3 hover:bg-gray-50 cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <span>{item}</span>
                                            <Checkbox
                                                checked={selectedReverseItems.includes(item)}
                                                onCheckedChange={(checked) => handleReverseItemSelect(item, Boolean(checked))}
                                                className="data-[state=checked]:bg-[#22C55E] data-[state=checked]:text-white border-gray-500 rounded cursor-pointer"
                                            />
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="flex justify-between">
                            <Button
                                variant="outline"
                                className="mr-2 text-[#161CCA] border-[#161CCA] cursor-pointer py-5 px-8 bg-transparent hover:bg-[#161CCA]/10"
                                size="lg"
                                onClick={() => setIsReverseDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="default"
                                className="bg-[#161CCA] cursor-pointer py-5 px-8 text-white"
                                onClick={handleReverseProceed}
                                size="lg"
                                disabled={selectedReverseItems.length === 0}
                            >
                                {selectedReverseItems.length > 0 ? "Proceed" : "Reverse Bill"} {/* Dynamic Button Text */}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Processing Dialog for Reverse Bill */}
            <Dialog open={isReverseProcessingDialogOpen} onOpenChange={setIsReverseProcessingDialogOpen}>
                <DialogContent className="w-full bg-white h-fit text-center">
                    <DialogHeader className="text-center">
                        <DialogTitle className="mt-2 flex justify-center items-center flex-col gap-2">
                            {reverseProgress < 100 ? `${reverseProgress}%` : "Reversal completed"}
                            <Loader size={18} className="animate-spin duration-500"/>
                        </DialogTitle>
                        <div className="flex justify-center">
                            <div className="w-[100%] bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-[#161CCA] h-2.5 rounded-full transition-all duration-500 ease-in-out"
                                    style={{ width: `${reverseProgress}%` }}
                                ></div>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 flex justify-center items-center">
                            {reverseProgress < 100 ? "Processing..." : ""}
                        </p>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}
"use client";
import AddReadingDialog from "@/components/billing/add-readings";
import GenerateReadingSheet from "@/components/billing/generate-reading";
import MeterReadings from "@/components/billing/meter-reading";
import { SortControl } from "@/components/search-control";
import { Button } from "@/components/ui/button";
import { ContentHeader } from "@/components/ui/content-header";
import { Input } from "@/components/ui/input";
import { CirclePlus, ListFilter, Printer, Search, SquareArrowOutUpRight } from "lucide-react";
import { useState } from "react";

export default function ReadingSheetPage() {
    const [isLoading,] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);

    return (
        <div className="p-6">
            {/* Content Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <ContentHeader
                    title="Reading Sheet"
                    description="Set and manage meter reading to track electricity usage."
                />
                <div className="flex flex-col md:flex-row gap-2">
                    <Button
                        className="flex items-center gap-2 border font-medium border-[#161CCA] text-[#161CCA] w-full md:w-auto cursor-pointer"
                        variant="outline"
                        size="lg"
                    >
                        <CirclePlus size={14} strokeWidth={2.3} className="h-4 w-4" />
                        <span className="text-sm md:text-base">Bulk Upload</span>
                    </Button>
                    <Button
                        className="flex items-center gap-2 bg-[#161CCA] text-white font-medium w-full md:w-auto cursor-pointer"
                        variant="secondary"
                        size="lg"
                        onClick={() => setIsAddDialogOpen(true)}
                    >
                        <CirclePlus size={14} strokeWidth={2.3} className="h-4 w-4" />
                        <span className="text-sm md:text-base">
                            Add Reading
                        </span>
                    </Button>
                </div>
            </div>

            <div className="mb-8 flex items-center justify-between">
                <div className="mb-8 flex items-center gap-2">
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
                        <Button className="flex cursor-pointer items-center gap-2 rounded-md border border-[rgba(228,231,236,1)] px-4 py-2 text-sm text-gray-700 focus:outline-none">
                            <ListFilter size={14} />
                            Filter
                        </Button>
                        <SortControl />
                    </div>
                </div>
                <div className="flex gap-5">
                    <Button
                        variant={"default"}
                        className="text-md cursor-pointer gap-2 px-8 py-5 font-semibold bg-[#22C55E] text-white"
                        onClick={() => setIsGenerateDialogOpen(true)}
                    >
                        <Printer size={14} />
                        Generate Readings
                    </Button>
                    <Button
                        variant={"default"}
                        className="text-md cursor-pointer gap-2 border px-8 py-5 font-semibold text-[rgba(22,28,202,1)]"
                    >
                        <SquareArrowOutUpRight size={14} />
                        Export
                    </Button>
                </div>
            </div>

            <div className="flex-1 rounded-lg border border-gray-200 bg-white">
                {isLoading ? (
                    <div className="flex items-center justify-center p-8">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
                    </div>
                ) : <MeterReadings />}
            </div>
            <AddReadingDialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} />
            <GenerateReadingSheet
                open={isGenerateDialogOpen}
                onClose={() => setIsGenerateDialogOpen(false)}
            />
        </div>
    );
}
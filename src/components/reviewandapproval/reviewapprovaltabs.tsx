"use client";
import React, { useState } from "react";
import { Check, SquareArrowOutUpRight } from "lucide-react";
import { Button } from "../ui/button";
import { ContentHeader } from "../ui/content-header";
import PercentageRangeTable from "./percentagerangetable";
import { FilterControl, SearchControl, SortControl } from "@/components/search-control";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import LiabilityCauseTable from "./liabilitycausetable";

export function ReviewApprovalTabs() {
    const [activeTab, setActiveTab] = useState("percentage");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
    const [, setActiveFilters] = useState({});



    // TODO: Replace this mock data with your actual data source
    // const data: any[] = []; // Example: [{ id: 1, ... }, ...]
    // Define filterSections for FilterControl
    const filterSections = [
        {
            title: "Status",
            options: [
                { label: "Approved", id: "approved" },
                { label: "Pending", id: "pending" },
                { label: "Rejected", id: "rejected" },
            ],
        },
        // Add more filter sections as needed
    ];

    const changeTab = (value: string) => {
        setActiveTab(value);
    };

    const handleSortChange = (sortBy: string) => {
        const [keyRaw, directionRaw] = sortBy.split(' ');
        const key = keyRaw ?? '';
        const direction = directionRaw ?? 'asc';
        setSortConfig({ key, direction });
    };

    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
    };


    return (
        <div className="p-6 max-h-screen overflow-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <ContentHeader
                    title="Review & Approval"
                    description="Check submissions and approve or reject meters"
                />
                <div className="flex flex-col md:flex-row gap-2">
                    <Button
                        className="flex items-center gap-2 border font-medium border-green-500 text-white w-full md:w-auto cursor-pointer bg-green-500 h-12"
                        variant="outline"
                        size="lg"

                    >
                        <Check size={18} strokeWidth={2.3} className="h-4 w-4" />
                        <span className="text-sm md:text-base text-white">Bulk Approve</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="gap-2 border border-[#161CCA] text-[#161CCA] font-medium w-full lg:w-auto cursor-pointer mt-1"
                    >
                        <SquareArrowOutUpRight className="text-[#161CCA]" size={15} strokeWidth={2.3} />
                        <span className="text-sm lg:text-base font-medium">Export</span>
                    </Button>
                </div>
            </div>


            <Card className="p-4 mb-4 border-none shadow-none bg-white">
                <Tabs value={activeTab} onValueChange={(v) => changeTab(v)}>
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <TabsList style={{ border: '2px solid #161CCA' }} className="h-12">
                            <TabsTrigger
                                value="percentage"
                                className="data-[state=active]:bg-[#161CCA] cursor-pointer data-[state=active]:text-white p-4"
                            >
                                Percentage Range
                            </TabsTrigger>
                            <TabsTrigger
                                value="liability cause"
                                className="data-[state=active]:bg-[#161CCA] cursor-pointer data-[state=active]:text-white p-4"
                            >
                                Liability Cause
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex items-center gap-2 w-full lg:w-auto">
                            <SearchControl
                                onSearchChange={handleSearchChange}
                                value={searchTerm}
                                placeholder="Search by percentage, code, or description..."

                            />
                            <FilterControl
                                sections={filterSections}
                                onApply={(filters) => setActiveFilters(filters)}
                                onReset={() => setActiveFilters({})}
                            />
                            <SortControl
                                onSortChange={handleSortChange}
                                currentSort={sortConfig.key ? `${sortConfig.key} (${sortConfig.direction})` : ''}
                            />

                        </div>
                    </div>
                    <TabsContent value="percentage" className="overflow-x-hidden">
                        <PercentageRangeTable />
                    </TabsContent>
                    <TabsContent value="liability cause" className="overflow-x-hidden">
                        <LiabilityCauseTable />
                    </TabsContent>
                </Tabs>
            </Card>

        </div>
    );
}
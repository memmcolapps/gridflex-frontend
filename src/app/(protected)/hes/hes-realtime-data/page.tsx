// app/communication-report/page.tsx
"use client";
import { RealTimeDataTable } from '@/components/hes/real-time-data-table';
// import { mdData, nonMdData } from '@/components/hes/communication-table';
import { FilterControl, SortControl } from '@/components/search-control';
import { Button } from '@/components/ui/button';
import { ContentHeader } from '@/components/ui/content-header';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function RealtimeDataPage() {
    const [activeTab, setActiveTab] = useState('MD');


    // Conditionally select the data based on the active tab
    // const tableData = activeTab === 'MD' ? mdData : nonMdData;

    return (
        <div className="w-full">
            <div className="flex justify-between w-full items-center mb-4">
                <ContentHeader
                    title="Real Time data"
                    description="Remotely read data directly from the meter in real time"
                />
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className='border-[#161CCA] text-[#161CCA] py-4'
                    >
                        <ExternalLink size={14} />
                        Export
                    </Button>
                </div>
            </div>
            <div className='flex flex-row justify-between'>
                <Tabs defaultValue="MD" className="mb-4" onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger
                            value="MD"
                            className={
                                activeTab === 'MD'
                                    ? 'bg-[#161CCA] text-white border-none cursor-pointer font-medium py-4'
                                    : 'bg-transparent text-foreground border-none cursor-pointer font-medium py-4'
                            }
                        >
                            MD
                        </TabsTrigger>
                        <TabsTrigger
                            value="Non-MD"
                            className={
                                activeTab === 'Non-MD'
                                    ? 'bg-[#161CCA] text-white border-none cursor-pointer font-medium py-4'
                                    : 'bg-transparent text-foreground border-none cursor-pointer font-medium py-4'
                            }
                        >
                            Non-MD
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <FilterControl />
                    <SortControl />
                </div>
            </div>
            <RealTimeDataTable/>
        </div>
    );
}
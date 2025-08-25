// app/communication-report/page.tsx
"use client";
import { CommunicationTable } from '@/components/hes/communication-table';
import { DailyReportDialog } from '@/components/hes/daily-report-dialog';
import { Button } from '@/components/ui/button';
import { ContentHeader } from '@/components/ui/content-header';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

export default function CommunicationReportPage() {
    const [openDailyDialog, setOpenDailyDialog] = useState(false);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <ContentHeader
                    title="Communication Report"
                    description="View and analyze detailed historical data from your smart meter"
                />
                <div className="flex items-center space-x-2">
                    <Button
                        className='bg-[#161CCA] text-white border-none cursor-pointer font-medium'
                        variant={'secondary'}
                        size={"lg"}
                    >Get Report</Button>
                    {/* Assuming "Get Report" might trigger something else, but based on screenshots, Daily Report is separate */}
                </div>
            </div>

            <Tabs defaultValue="MD" className="mb-4">
                <TabsList>
                    <TabsTrigger
                        value="MD"
                        className='bg-[#161CCA] text-white border-none cursor-pointer font-medium'
                    >
                        MD
                    </TabsTrigger>
                    <TabsTrigger
                        value="Non-MD"
                        className=''
                    >
                        Non-MD
                    </TabsTrigger>
                </TabsList>
            </Tabs>
            
            <div className="flex justify-between items-center mb-4">
                <Input placeholder="Search by meter no., account no..." className="w-1/3" />
                <div className="flex space-x-2">
                    <Button variant="outline">Filter</Button>
                    <Button variant="outline">Sort</Button>
                    <Button variant="outline">Export</Button>
                    {/* Trigger for Daily Report */}
                    <Select
                        onValueChange={(value) => {
                            if (value === 'daily') setOpenDailyDialog(true);
                        }}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Daily Report" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="daily">Daily Report</SelectItem>
                            <SelectItem value="monthly">Monthly Report</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <CommunicationTable />
            <DailyReportDialog open={openDailyDialog} onOpenChange={setOpenDailyDialog} />
        </div>
    );
}
// app/communication-report/page.tsx
"use client";
import { CommunicationTable } from '@/components/hes/communication-table';
import { mdData, nonMdData } from '@/components/hes/communication-table';
import { DailyReportDialog } from '@/components/hes/daily-report-dialog';
import { FilterControl, SearchControl, SortControl } from '@/components/search-control';
import { Button } from '@/components/ui/button';
import { ContentHeader } from '@/components/ui/content-header';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronDown, ExternalLink, NotepadText } from 'lucide-react';
import { useState } from 'react';

export default function CommunicationReportPage() {
    const [openDialog, setOpenDialog] = useState(false);
    const [reportType, setReportType] = useState<'daily' | 'monthly'>('daily');
    const [activeTab, setActiveTab] = useState('MD');

    const handleOpenDialog = (type: 'daily' | 'monthly') => {
        setReportType(type);
        setOpenDialog(true);
    };

    // Conditionally select the data based on the active tab
    const tableData = activeTab === 'MD' ? mdData : nonMdData;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <ContentHeader
                    title="Communication Report"
                    description="View and analyze detailed historical data from your smart meter"
                />
                <div className="flex items-center space-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                className="bg-[#161CCA] text-white border-none cursor-pointer font-medium py-6"
                                variant="secondary"
                                size="lg"
                            >
                                <NotepadText size={14} />
                                Get Report
                                <ChevronDown className="ml-2" size={14} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full p-3 shadow-lg">
                            <DropdownMenuItem
                                onClick={() => handleOpenDialog('daily')}
                                className="cursor-pointer text-md font-medium"
                            >
                                Daily Report
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleOpenDialog('monthly')}
                                className="cursor-pointer text-md font-medium"
                            >
                                Monthly Report
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

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
            <div className='flex flex-row justify-between'>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <SearchControl placeholder="Search by meter no., account no..." />
                    <FilterControl />
                    <SortControl />
                </div>
                <Button
                    variant="outline"
                    className='border-[#161CCA] text-[#161CCA] py-4'
                >
                    <ExternalLink size={14} />
                    Export
                </Button>
            </div>
            {/* Pass the selected data to the CommunicationTable component */}
            <CommunicationTable data={tableData} />
            <DailyReportDialog
                open={openDialog}
                onOpenChange={setOpenDialog}
                reportType={reportType}
            />
        </div>
    );
}
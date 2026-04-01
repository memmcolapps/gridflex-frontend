// app/communication-report/page.tsx
"use client";
import { CommunicationTable } from '@/components/hes/communication-table';
import { DailyReportDialog } from '@/components/hes/daily-report-dialog';
import { FilterControl, SearchControl, SortControl } from '@/components/search-control';
import { Button } from '@/components/ui/button';
import { ContentHeader } from '@/components/ui/content-header';
import { ExportButton } from '@/components/ui/export-button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotepadText } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useAllCommunicationReports } from '@/hooks/use-reports';

export default function CommunicationReportPage() {
    const [openDialog, setOpenDialog] = useState(false);
    const [activeTab, setActiveTab] = useState<'MD' | 'Non-MD'>('MD');
    const [searchQuery, setSearchQuery] = useState('');

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    // Fetch all data for export
    const { data: allCommunicationData } = useAllCommunicationReports({
        type: activeTab,
        page: 0,
        size: 1000,
    });

    const communicationData = useMemo(() => {
        return allCommunicationData || [];
    }, [allCommunicationData]);

    // Filter data based on search query
    const filteredData = useMemo(() => {
        if (!searchQuery) return communicationData;
        const searchLower = searchQuery.toLowerCase();
        return communicationData.filter((item) =>
            item.meterNo?.toLowerCase().includes(searchLower) ||
            item.connectionType?.toLowerCase().includes(searchLower)
        );
    }, [communicationData, searchQuery]);

    // Export columns - try multiple property names for last sync timestamp
    const exportColumns = [
        { key: 'meterNo', label: 'Meter No.' },
        { key: 'meter.smartMeterInfo.meterModel', label: 'Meter Model' },
        { key: 'connectionType', label: 'Connection Type' },
        { 
            key: 'updatedAt', 
            label: 'LastSync',
            transform: (value: unknown) => {
                if (!value) return '-';
                try {
                    return new Date(value as string).toLocaleString();
                } catch {
                    return String(value);
                }
            }
        },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <ContentHeader
                    title="Communication Report"
                    description="View and analyze detailed historical data from your smart meter"
                />
                <div className="flex items-center space-x-2">
                    <Button
                        className="bg-[#161CCA] text-white border-none cursor-pointer font-medium py-6"
                        variant="secondary"
                        size="lg"
                        onClick={handleOpenDialog}
                    >
                        <NotepadText size={14} />
                        Get Report
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="MD" className="mb-4" onValueChange={(value) => setActiveTab(value as 'MD' | 'Non-MD')}>
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
                    <SearchControl
                        placeholder="Search by meter no., account no..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <FilterControl />
                    <SortControl />
                </div>
                <ExportButton
                    data={filteredData}
                    columns={exportColumns}
                    fileName="communication_report"
                />
            </div>
            {/* Pass the selected data to the CommunicationTable component */}
            <CommunicationTable searchQuery={searchQuery} activeTab={activeTab} communicationData={communicationData} />
            <DailyReportDialog
                open={openDialog}
                onOpenChange={setOpenDialog}
                activeTab={activeTab}
            />
        </div>
    );
}
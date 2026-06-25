// app/communication-report/page.tsx
"use client";
import { CommunicationTable } from "@/components/hes/communication-table";
import { DailyReportDialog } from "@/components/hes/daily-report-dialog";
import {
  FilterControl,
  SearchControl,
  SortControl,
} from "@/components/search-control";
import { Button } from "@/components/ui/button";
import { ContentHeader } from "@/components/ui/content-header";
import { ExportButton } from "@/components/ui/export-button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotepadText } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useAllCommunicationReports } from "@/hooks/use-reports";
import { useMeterStatusStream } from "@/hooks/use-meter-status-stream";
import type { MeterStatusData } from "@/hooks/use-sse";
import type { CommunicationReportData } from "@/types/reports";

const applyLiveStatus = (
  report: CommunicationReportData,
  status?: MeterStatusData,
) => {
  if (!status || status.status === "CONNECTED") return report;

  if (status.status === "ONLINE") {
    return {
      ...report,
      connectionType: status.status,
      onlineTime: status.lastSeen,
      updatedAt: status.lastSeen,
    };
  }

  return {
    ...report,
    connectionType: status.status,
    offlineTime: status.lastSeen,
    updatedAt: status.lastSeen,
  };
};

export default function CommunicationReportPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<"MD" | "Non-MD">("MD");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({});
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [liveStatuses, setLiveStatuses] = useState<
    Record<string, MeterStatusData>
  >({});

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const connectionType = useMemo(() => {
    if (activeFilters.ONLINE) return "ONLINE";
    if (activeFilters.OFFLINE) return "OFFLINE";
    return "";
  }, [activeFilters]);

  const { data: communicationResponse, isLoading } = useAllCommunicationReports({
    type: activeTab,
    page: currentPage - 1,
    size: rowsPerPage,
    search: searchQuery,
    connectionType,
    sortDirection,
  });

  const { data: exportResponse } = useAllCommunicationReports({
    type: activeTab,
    page: 0,
    size: 0,
    search: searchQuery,
    connectionType,
    sortDirection,
  });

  const handleLiveStatus = useCallback((status: MeterStatusData) => {
    setLiveStatuses((previous) => ({
      ...previous,
      [status.meterNo]: status,
    }));
  }, []);

  useMeterStatusStream(handleLiveStatus);

  const communicationData = useMemo(() => {
    return (communicationResponse?.data ?? []).map((report) =>
      applyLiveStatus(
        report,
        report.meterNo ? liveStatuses[report.meterNo] : undefined,
      ),
    );
  }, [communicationResponse, liveStatuses]);

  const exportData = useMemo(() => {
    return (exportResponse?.data ?? []).map((report) =>
      applyLiveStatus(
        report,
        report.meterNo ? liveStatuses[report.meterNo] : undefined,
      ),
    );
  }, [exportResponse, liveStatuses]);

  const formatDateTime = (value: unknown) => {
    if (!value) return "-";
    try {
      return new Date(value as string).toLocaleString();
    } catch {
      return String(value);
    }
  };

  const exportColumns = [
    { key: "meterNo", label: "Meter No." },
    { key: "meter.smartMeterInfo.meterModel", label: "Meter Model" },
    { key: "connectionType", label: "Connection Type" },
    {
      key: "onlineTime",
      label: "Last Online At",
      transform: formatDateTime,
    },
    {
      key: "updatedAt",
      label: "Last Updated At",
      transform: formatDateTime,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <ContentHeader
          title="Communication Report"
          description="View and analyze detailed historical data from your smart meter"
        />
        {/* <div className="flex items-center space-x-2">
          <Button
            className="cursor-pointer border-none bg-[#161CCA] py-6 font-medium text-white"
            variant="secondary"
            size="lg"
            onClick={handleOpenDialog}
          >
            <NotepadText size={14} />
            Get Report
          </Button>
        </div> */}
      </div>

      <Tabs
        defaultValue="MD"
        className="mb-4"
        onValueChange={(value) => {
          setActiveTab(value as "MD" | "Non-MD");
          setCurrentPage(1);
        }}
      >
        <TabsList style={{ border: "2px solid #161CCA" }} className="h-12">
          <TabsTrigger
            value="MD"
            className={
              activeTab === "MD"
                ? "cursor-pointer border-none bg-[#161CCA] py-4 font-medium text-white"
                : "text-foreground cursor-pointer border-none bg-transparent py-4 font-medium"
            }
          >
            MD
          </TabsTrigger>
          <TabsTrigger
            value="Non-MD"
            className={
              activeTab === "Non-MD"
                ? "cursor-pointer border-none bg-[#161CCA] py-4 font-medium text-white"
                : "text-foreground cursor-pointer border-none bg-transparent py-4 font-medium"
            }
          >
            Non-MD
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex flex-row justify-between">
        <div className="mb-4 flex flex-col gap-4 md:flex-row">
          <SearchControl
            placeholder="Search by meter no., account no..."
            value={searchQuery}
            onSearchChange={(value) => {
              setSearchQuery(value);
              setCurrentPage(1);
            }}
          />
          <FilterControl
            sections={[
              {
                title: "Connection",
                options: [
                  { label: "Online", id: "ONLINE" },
                  { label: "Offline", id: "OFFLINE" },
                ],
              },
            ]}
            onApply={(filters) => {
              setActiveFilters(filters);
              setCurrentPage(1);
            }}
            onReset={() => {
              setActiveFilters({});
              setCurrentPage(1);
            }}
          />
          <SortControl
            onSortChange={(direction) => {
              setSortDirection(direction === "desc" ? "desc" : "asc");
              setCurrentPage(1);
            }}
            currentSort={sortDirection}
          />
        </div>
        <ExportButton
          data={exportData}
          columns={exportColumns}
          fileName="communication_report"
        />
      </div>
      <CommunicationTable
        communicationData={communicationData}
        isLoading={isLoading}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        totalItems={communicationResponse?.totalData ?? 0}
        onPageChange={setCurrentPage}
        onPageSizeChange={(pageSize) => {
          setRowsPerPage(pageSize);
          setCurrentPage(1);
        }}
      />
      <DailyReportDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        activeTab={activeTab}
      />
    </div>
  );
}

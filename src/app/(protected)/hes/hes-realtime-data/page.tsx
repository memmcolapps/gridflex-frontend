"use client";
import { RealTimeDataTable } from "@/components/hes/real-time-data-table";
import type { MeterData } from "@/hooks/use-realtime-stream";
import { SortControl } from "@/components/search-control";
import { ContentHeader } from "@/components/ui/content-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { useState, useEffect, useMemo } from "react";
import {
  useSSEManagement,
  useMeterConnections,
  useRealtimeStream,
} from "@/hooks/use-hes-realtime";
import { useHierarchyData } from "@/hooks/use-hes-hierarchy";
import type { Node } from "@/types/hes";
import type { RealTimeData } from "@/hooks/use-sse";
import type {
  RealtimeStreamCallbacks,
  RealtimeStreamRequest,
} from "@/service/hes-service";

export default function RealtimeDataPage() {
  const [activeTab, setActiveTab] = useState("MD");
  const [selectedMeters, setSelectedMeters] = useState<string[]>([]);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
  const [selectedHierarchy] = useState<string>("");
  const [, setUnitOptions] = useState<{ label: string; id: string }[]>([]);
  const [exportData, setExportData] = useState<{
    displayData: MeterData[];
    selectedReading: string[];
    readingLabelMap: Record<string, string>;
  }>({ displayData: [], selectedReading: [], readingLabelMap: {} });

  const exportColumns = useMemo<ExportColumn[]>(() => {
    const readingCols = exportData.selectedReading
      .filter((r) => r !== "meter-serial-number" && r !== "clock object")
      .map((r) => ({
        key: r,
        label: exportData.readingLabelMap[r] ?? r,
        transform: (_: unknown, item?: unknown) =>
          String((item as Record<string, unknown>)?.[r] ?? ""),
      }));
    return [
      { key: "meter", label: "Meter Serial Number" },
      { key: "time", label: "Time" },
      ...readingCols,
    ];
  }, [exportData.selectedReading, exportData.readingLabelMap]);

  // Use TanStack Query hooks for state management
  const { baseUrl } = useSSEManagement();

  const { connectionStatus, isConnected } = useMeterConnections(selectedMeters);
  const { mutateAsync: runRealtimeStreamMutation } = useRealtimeStream();

  const runRealtimeStream = (
    payload: RealtimeStreamRequest,
    callbacks?: RealtimeStreamCallbacks,
  ) => runRealtimeStreamMutation({ payload, callbacks });

  const reconnect = () => {
    // TODO: Implement reconnect functionality
  };
  const sseData: RealTimeData[] = [];

  const { data: hierarchyData } = useHierarchyData();

  // Flatten hierarchy nodes for dropdown options
  const flattenNodes = (nodes: Node[]): { label: string; id: string }[] => {
    const result: { label: string; id: string }[] = [];
    const traverse = (nodeList: Node[]) => {
      nodeList.forEach((node) => {
        result.push({ label: node.name, id: node.id });
        if (node.nodesTree) traverse(node.nodesTree);
      });
    };
    traverse(nodes);
    return result;
  };

  // const hierarchyOptions = hierarchyData ? flattenNodes(hierarchyData.responsedata.nodes) : [];

  // Update unit options based on selected hierarchy
  useEffect(() => {
    if (selectedHierarchy && hierarchyData) {
      const findNode = (nodes: Node[]): Node | undefined => {
        for (const node of nodes) {
          if (node.id === selectedHierarchy) return node;
          const found = findNode(node.nodesTree);
          if (found) return found;
        }
        return undefined;
      };
      const selectedNode = findNode(hierarchyData.responsedata.nodes);
      if (selectedNode?.nodesTree) {
        setUnitOptions(flattenNodes(selectedNode.nodesTree));
      } else {
        setUnitOptions([]);
      }
    } else {
      setUnitOptions([]);
    }
  }, [selectedHierarchy, hierarchyData]);

  // Validate base URL

  const handleMeterSelection = (meters: string[]) => {
    setSelectedMeters(meters);
  };

  const handleTabChange = (tab: string) => {
  setActiveTab(tab);
  setSelectedMeters([]); // clear meters on tab switch
};

  // const getConnectionStatusIcon = () => {
  //   if (!baseUrl) {
  //     return <WifiOff className="h-4 w-4 text-yellow-500" />;
  //   }
  //   if (
  //     isConnected ||
  //     Object.values(connectionStatus).some((status) => status)
  //   ) {
  //     return <Wifi className="h-4 w-4 text-green-500" />;
  //   }
  //   return <WifiOff className="h-4 w-4 text-red-500" />;
  // };

  return (
    <div className="w-full">
      {/* Debug Test Component removed - issue fixed */}

      <div className="mb-4 flex w-full items-center justify-between">
        <ContentHeader
          title="Real Time data"
          description="Remotely read data directly from the meter in real time"
        />
        <div className="flex items-center space-x-4">
          {/* <div className="flex items-center space-x-2">
            {getConnectionStatusIcon()}
            <span className="text-sm text-gray-600">
              {!baseUrl
                ? "Configuration Missing"
                : isConnected
                  ? "Connected"
                  : "Disconnected"}
            </span>
            {baseUrl && (
              <span
                className="text-xs text-gray-400"
                title={`API Base URL: ${baseUrl}`}
              >
                API:{" "}
                {(() => {
                  try {
                    return new URL(baseUrl).hostname;
                  } catch {
                    return "Invalid URL";
                  }
                })()}
              </span>
            )}
          </div> */}
          {/* <Button
            variant="outline"
            className="border-[#161CCA] py-4 text-[#161CCA]"
            onClick={reconnect}
            disabled={isConnected || !baseUrl}
          >
            <ExternalLink size={14} />
            Reconnect
          </Button> */}
          <ExportButton
            data={exportData.displayData}
            columns={exportColumns}
            fileName={`real_time_data_${activeTab.toLowerCase()}`}
          />
        </div>
      </div>
      <div className="flex flex-row justify-between">
        <Tabs defaultValue="MD" className="mb-4" onValueChange={setActiveTab}>
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

        <div className="mb-4 flex flex-col gap-4 md:flex-row">
          <SortControl
            onSortChange={(direction) =>
              setSortDirection(direction === "desc" ? "desc" : "asc")
            }
            currentSort={sortDirection ?? ""}
          />
        </div>
      </div>
      <RealTimeDataTable
        onMeterSelection={handleMeterSelection}
        meterType={activeTab} 
        sortDirection={sortDirection}
        onExportDataChange={setExportData}
      />
    </div>
  );
}

// app/communication-report/page.tsx
"use client";
import { RealTimeDataTable } from "@/components/hes/real-time-data-table";
import { FilterControl, SortControl } from "@/components/search-control";
import { Button } from "@/components/ui/button";
import { ContentHeader } from "@/components/ui/content-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Wifi, WifiOff } from "lucide-react";
import { useState, useEffect } from "react";
import {
  useSSEManagement,
  useMeterConnections,
} from "@/hooks/use-hes-realtime";
import { useHierarchyData } from "@/hooks/use-hes-hierarchy";
import type { Node } from "@/types/hes";
import type { RealTimeData } from "@/hooks/use-sse";
export default function RealtimeDataPage() {
  const [activeTab, setActiveTab] = useState("MD");
  const [selectedMeters, setSelectedMeters] = useState<string[]>([]);
  const [selectedHierarchy] = useState<string>("");
  // const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [, setUnitOptions] = useState<{ label: string; id: string }[]>([]);

  // Use TanStack Query hooks for state management
  const { baseUrl } = useSSEManagement();

  const { connectionStatus, isConnected } = useMeterConnections(selectedMeters);

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

  const getConnectionStatusIcon = () => {
    if (!baseUrl) {
      return <WifiOff className="h-4 w-4 text-yellow-500" />;
    }
    if (
      isConnected ||
      Object.values(connectionStatus).some((status) => status)
    ) {
      return <Wifi className="h-4 w-4 text-green-500" />;
    }
    return <WifiOff className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="w-full">
      {/* Debug Test Component removed - issue fixed */}

      <div className="mb-4 flex w-full items-center justify-between">
        <ContentHeader
          title="Real Time data"
          description="Remotely read data directly from the meter in real time"
        />
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
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
          </div>
          <Button
            variant="outline"
            className="border-[#161CCA] py-4 text-[#161CCA]"
            onClick={reconnect}
            disabled={isConnected || !baseUrl}
          >
            <ExternalLink size={14} />
            Reconnect
          </Button>
          <Button
            variant="outline"
            className="border-[#161CCA] py-4 text-[#161CCA]"
          >
            <ExternalLink size={14} />
            Export
          </Button>
        </div>
      </div>
      <div className="flex flex-row justify-between">
        <Tabs defaultValue="MD" className="mb-4" onValueChange={setActiveTab}>
          <TabsList>
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
          <FilterControl />
          <SortControl />
        </div>
      </div>
      <RealTimeDataTable
        sseData={sseData}
        connectionStatus={connectionStatus}
        selectedMeters={selectedMeters}
        onMeterSelection={handleMeterSelection}
        meterType={activeTab}
      />
    </div>
  );
}

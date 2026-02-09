"use client";

import { useState, useMemo, useEffect } from "react";
import { ContentHeader } from "@/components/ui/content-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Events } from "@/components/hes/profile-events/events";
import { Profile } from "@/components/hes/profile-events/profile";
import { SquareArrowOutUpRight, Check, ChevronDown, Grid2X2, Building, Wrench, Database, Zap, Lightbulb } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useProfileEventsData } from "@/hooks/use-profile-events";

type ExportFormat = "CSV" | "XLSX" | "PDF" | null;

const normalizeType = (type: string): string => {
  const lowerType = type.toLowerCase();
  switch (lowerType) {
    case 'root':
    case 'region':
      return 'Region';
    case 'business hub':
    case 'business Hub':
      return 'Business Hub';
    case 'service center':
      return 'Service Center';
    case 'substation':
      return 'Substation';
    case 'feeder line':
    case 'Feeder Line':
      return 'Feeder Line';
    case 'dss':
      return 'DSS';
    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
};

const getIconForType = (type: string) => {
  switch (type.toLowerCase()) {
    case 'region':
      return Grid2X2;
    case 'business hub':
      return Building;
    case 'service center':
      return Wrench;
    case 'substation':
      return Database;
    case 'feeder line':
      return Zap;
    case 'dss':
      return Lightbulb;
    default:
      return Grid2X2;
  }
};

export default function HesProfileEvents() {
  const [selectedExportFormat, setSelectedExportFormat] =
    useState<ExportFormat>(null);
  const [selectedHierarchy, setSelectedHierarchy] = useState<string | null>(null);
  const [selectedUnits, setSelectedUnits] = useState<string>(""); // assetId

  const { data: profileEventsData } = useProfileEventsData();

  const hierarchyOptions = useMemo(() => {
    if (!profileEventsData) return [];
    const types = new Set<string>();
    const traverseNodes = (nodes: typeof profileEventsData.responsedata.nodes) => {
      nodes.forEach(node => {
        if (node.nodeInfo?.type) {
          const normalizedType = normalizeType(node.nodeInfo.type);
          types.add(normalizedType);
        }
        if (node.nodesTree) traverseNodes(node.nodesTree);
      });
    };
    traverseNodes(profileEventsData.responsedata.nodes);
    return Array.from(types).map(type => ({
      value: type,
      label: type,
      icon: getIconForType(type.toLowerCase()),
    }));
  }, [profileEventsData]);

  const unitsOptions = useMemo(() => {
    if (!profileEventsData || !selectedHierarchy) return [];
    const units: { assetId: string; name: string }[] = [];
    const traverseNodes = (nodes: typeof profileEventsData.responsedata.nodes) => {
      nodes.forEach(node => {
        if (node.nodeInfo?.type && normalizeType(node.nodeInfo.type) === selectedHierarchy) {
          units.push({ assetId: node.nodeInfo.assetId ?? node.nodeInfo.regionId ?? node.id, name: node.name });
        }
        if (node.nodesTree) traverseNodes(node.nodesTree);
      });
    };
    traverseNodes(profileEventsData.responsedata.nodes);
    return units;
  }, [profileEventsData, selectedHierarchy]);

  useEffect(() => {
    setSelectedUnits("");
  }, [selectedHierarchy]);

  const handleExportFormatSelect = (format: ExportFormat) => {
    setSelectedExportFormat(format);
    // Here you can add the actual export logic based on the format
    console.log(`Exporting as ${format}...`);

    // Add your export logic here
    switch (format) {
      case "CSV":
        // Handle CSV export
        break;
      case "XLSX":
        // Handle XLSX export
        break;
      case "PDF":
        // Handle PDF export
        break;
      default:
        break;
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-transparent p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
        <ContentHeader
          title="Profile and Events"
          description="Access detailed profiles and event logs from your meter."
        />

        {/* Export Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex cursor-pointer items-center gap-2 border border-[#161CCA] font-medium text-[#161CCA] hover:bg-[#161CCA]/5"
            >
              <SquareArrowOutUpRight
                size={12}
                strokeWidth={2.3}
                className="text-[#161CCA]"
              />
              <span className="text-sm font-medium">Export</span>
              <ChevronDown size={14} className="text-[#161CCA]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[140px] border border-gray-200 bg-white"
            align="end"
          >
            <DropdownMenuItem
              onClick={() => handleExportFormatSelect("CSV")}
              className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-50"
            >
              <span className="text-sm">CSV</span>
              {selectedExportFormat === "CSV" && (
                <Check size={14} className="text-black" />
              )}
            </DropdownMenuItem>

            <div className="mx-2 border-t border-dotted border-[#4ECDC4]" />

            <DropdownMenuItem
              onClick={() => handleExportFormatSelect("XLSX")}
              className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-50"
            >
              <span className="text-sm">XLSX</span>
              {selectedExportFormat === "XLSX" && (
                <Check size={14} className="text-black" />
              )}
            </DropdownMenuItem>

            <div className="mx-2 border-t border-dotted border-[#4ECDC4]" />

            <DropdownMenuItem
              onClick={() => handleExportFormatSelect("PDF")}
              className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-50"
            >
              <span className="text-sm">PDF</span>
              {selectedExportFormat === "PDF" && (
                <Check size={14} className="text-black" />
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tabs Card */}
      <Card className="mb-4 border-none bg-transparent p-4 shadow-none">
        <Tabs defaultValue="events" className="w-full">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4 overflow-hidden h-auto">
            <TabsList style={{ border: "2px solid #161CCA" }} className="h-12">
              <TabsTrigger
                value="profile"
                className="cursor-pointer p-4 data-[state=active]:bg-[#161CCA] data-[state=active]:text-white"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="cursor-pointer p-4 data-[state=active]:bg-[#161CCA] data-[state=active]:text-white"
              >
                Events
              </TabsTrigger>
            </TabsList>

            <div className="mb-4 flex items-center gap-4">
              {/* Hierarchy Dropdown */}
              <div className="flex flex-col gap-2">
                <Label>Hierarchy <span className="text-red-500">*</span></Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="cursor-pointer border-gray-300 p-1 text-gray-600 ring-[rgba(22,28,202,0)] focus:outline-none"
                    >
                      {selectedHierarchy ? selectedHierarchy.charAt(0).toUpperCase() + selectedHierarchy.slice(1) : 'Select Hierarchy'} <ChevronDown size={14} className="text-gray-600" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {hierarchyOptions.map(option => {
                      const Icon = option.icon;
                      return (
                        <DropdownMenuItem key={option.value} onClick={() => setSelectedHierarchy(option.value)}>
                          <Icon size={14} className="mr-2 text-gray-700" /> {option.label}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {/* Units Dropdown */}
              <div className="flex flex-col gap-2">
                <Label>Units <span className="text-red-500">*</span></Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="cursor-pointer border-gray-300 p-1 text-gray-600 ring-[rgba(22,28,202,0)] focus:outline-none"
                      disabled={!selectedHierarchy}
                    >
                      {selectedUnits ? unitsOptions.find(u => u.assetId === selectedUnits)?.name : 'Select Units'} <ChevronDown size={14} className="text-gray-600" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {unitsOptions.map(unit => (
                      <DropdownMenuItem key={unit.assetId} onClick={() => setSelectedUnits(unit.assetId)}>
                        {unit.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <TabsContent value="profile" className="overflow-x-hidden">
            <Card className="min-h-[calc(100vh-300px)] border-none bg-transparent shadow-none">
              <Profile selectedHierarchy={selectedHierarchy} selectedUnits={selectedUnits} />
            </Card>
          </TabsContent>

          <TabsContent value="events" className="overflow-x-hidden">
            <Card className="min-h-[calc(100vh-300px)] border-none bg-transparent shadow-none">
              <Events selectedHierarchy={selectedHierarchy} selectedUnits={selectedUnits} />
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

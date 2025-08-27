"use client";

import { useState } from "react";
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
import { SquareArrowOutUpRight, Check, ChevronDown } from "lucide-react";

type ExportFormat = "CSV" | "XLSX" | "PDF" | null;

export default function HesProfileEvents() {
  const [selectedExportFormat, setSelectedExportFormat] =
    useState<ExportFormat>(null);

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
    <div className="h-screen overflow-x-hidden bg-transparent p-6">
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
                size={14}
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
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
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
          </div>

          <TabsContent value="profile" className="overflow-x-hidden">
            <Card className="min-h-[calc(100vh-300px)] border-none bg-transparent shadow-none">
              <Profile />
            </Card>
          </TabsContent>

          <TabsContent value="events" className="overflow-x-hidden">
            <Card className="min-h-[calc(100vh-300px)] border-none bg-transparent shadow-none">
              <Events />
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

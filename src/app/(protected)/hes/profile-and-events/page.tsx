"use client";

import { ContentHeader } from "@/components/ui/content-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Events } from "@/components/hes/events";
import { Profile } from "@/components/hes/profile";
import { SquareArrowOutUpRight  } from "lucide-react";

export default function HesProfileEvents() {
  const handleExport = () => {
    // Handle export functionality
    console.log("Exporting data...");
  };

  return (
    <div className="h-screen overflow-x-hidden bg-transparent p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
        <ContentHeader
          title="Profile and Events"
          description="Access detailed profiles and event logs from your meter."
        />
        <Button
          variant="outline"
          className="flex cursor-pointer items-center gap-2 border border-[#161CCA] font-medium text-[#161CCA]"
          onClick={handleExport}
        >
          <SquareArrowOutUpRight
            size={14}
            strokeWidth={2.3}
            className="text-[#161CCA]"
          />
          <span className="text-sm font-medium">Export</span>
        </Button>
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

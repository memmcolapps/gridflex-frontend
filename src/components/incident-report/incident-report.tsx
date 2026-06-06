import { ContentHeader } from "../ui/content-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import RecentIncidents from "./incident-report-table";
import { useState } from "react";
import IncidentDialog from "./incident-dialogs/incident-report-dialog";

const ALL_STATUS = [
  {
    status: "All Incidents",
    value: "all",
  },
  {
    status: "Resolved",
    value: "resolved",
  },
  {
    status: "Unresolved",
    value: "unresolved",
  },
];

export default function IncidentReport() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-screen-2xl space-y-6 bg-transparent">
        <div className="flex items-start justify-between bg-transparent">
          <ContentHeader
            title="Incident Report"
            description="Help us stay informed, report incidents in real time."
          />
        </div>

        <div className="mt-6 mb-0 flex items-center justify-between">
          <div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                {ALL_STATUS.map((status, index) => (
                  <SelectItem key={index} value={status.value}>
                    {status.status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Button
              variant={"default"}
              className="text-md cursor-pointer gap-2 bg-[#161CCA] px-8 py-6 font-semibold text-white"
              onClick={() => setIsDialogOpen(true)}
            >
              Report An Incident
            </Button>
          </div>
        </div>
        <div>
          <RecentIncidents
            status={
              statusFilter === "all" ? undefined : statusFilter === "resolved"
            }
          />
        </div>
      </div>

      <IncidentDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}

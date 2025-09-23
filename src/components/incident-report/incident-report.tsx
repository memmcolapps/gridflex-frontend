import { ListFilter } from "lucide-react";
import { ContentHeader } from "../ui/content-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import RecentIncidents from "./incident-report-table";

const ALL_STATUS = [
    {
        status: 'Resolved'
    },
    {
        status: 'Unresolved'
    },
]

export default function IncidentReport() {
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
                        <Select>
                            <SelectTrigger className="w-full h-10">
                                <SelectValue placeholder="Filter" />
                            </SelectTrigger>
                            <SelectContent>
                                {ALL_STATUS.map((status, index) => (
                                    <SelectItem key={index} value={status.status}>
                                        {status.status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Button
                            variant={"default"}
                            className="text-md cursor-pointer gap-2 text-white px-8 py-6 font-semibold bg-[#161CCA]"
                        // onClick={() => setIsDialogOpen(true)}
                        >
                            Report An Incident
                        </Button>
                    </div>

                </div>
                <div>
                    <RecentIncidents/>
                </div>
            </div>
        </div>
    )
}
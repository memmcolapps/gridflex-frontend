// CommunicationReport.jsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getStatusStyle } from "@/components/status-style";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CircleCheck, MoreVertical, Pencil, Send } from "lucide-react";

const CommunicationReportTable = () => {
  const data = [
    { sNo: "01", meterNo: "6212465987", model: "MMX 310-NG", status: "Offline", lastSync: "1 min ago", tamperState: "No Tamper", tamperSync: "2 hours ago", relayControl: "Disconnected", relaySync: "2 hours ago", actions: ["Connect Relay", "Send Token"] },
    { sNo: "02", meterNo: "6212465987", model: "MMX 110-NG", status: "Online", lastSync: "2 hours ago", tamperState: "Tamper Detected", tamperSync: "3 hours ago", relayControl: "Disconnected", relaySync: "3 hours ago", actions: ["Connect Relay", "Send Token"] },
    { sNo: "03", meterNo: "6212465987", model: "MMX 110-NG", status: "Offline", lastSync: "2 hours ago", tamperState: "No Tamper", tamperSync: "3 hours ago", relayControl: "Disconnected", relaySync: "3 hours ago", actions: ["Connect Relay", "Send Token"] },
    { sNo: "04", meterNo: "6212465987", model: "MMX 110-NG", status: "Online", lastSync: "2 hours ago", tamperState: "No Tamper", tamperSync: "3 hours ago", relayControl: "Connected", relaySync: "3 hours ago", actions: ["Connect Relay", "Send Token"] },
  ];

  return (
    <Card className="w-full p-4 bg-white shadow-sm rounded-lg mt-4 border border-gray-200">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-600">Communication Report</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="table-fixed w-full" >
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">S/N</TableHead>
              <TableHead className="text-left">Meter No.</TableHead>
              <TableHead className="text-left">Meter Model</TableHead>
              <TableHead className="text-left w-[120px]">Status</TableHead> {/* same width across rows */}
              <TableHead className="text-left">Last Sync</TableHead>
              <TableHead className="text-left">Tamper State</TableHead>
              <TableHead className="text-left">Tamper Sync</TableHead>
              <TableHead className="text-left">Relay Control</TableHead>
              <TableHead className="text-left">Relay Sync</TableHead>
              <TableHead className="text-left">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((row) => (
              <TableRow key={row.sNo}>
                <TableCell>{row.sNo}</TableCell>
                <TableCell>{row.meterNo}</TableCell>
                <TableCell>{row.model}</TableCell>
                <TableCell  className="text-left w-[120px]">
                  <div className="flex items-center">
                    <span className={getStatusStyle(row.status)}>
                      {row.status}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{row.lastSync}</TableCell>
                <TableCell>{row.tamperState}</TableCell>
                <TableCell>{row.tamperSync}</TableCell>
                <TableCell className="w-[120px]"> {/* match width with header */}
                  <div className="flex items-center">
                    <span className={getStatusStyle(row.relayControl)}>
                      {row.relayControl}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{row.relaySync}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="default" size="sm" className="border-gray-500 focus:ring-gray-500/0 cursor-pointer" >
                        <MoreVertical size={16} className="text-gray-500 border-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-48 bg-white shadow-lg">
                      <DropdownMenuItem className="flex items-center gap-2">
                        <CircleCheck size={14} className="text-black" />
                        <span className="text-sm lg:text-base text-black">Connect Relay</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Send size={14} className="text-black" />
                        <span className="text-sm lg:text-base text-black">Send Token</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </CardContent>
    </Card>
  );
};

export default CommunicationReportTable;
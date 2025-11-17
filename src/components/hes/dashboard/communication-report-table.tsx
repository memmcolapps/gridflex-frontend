// CommunicationReportTable.jsx
import { useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleCheck, MoreVertical, Send } from "lucide-react";
import SendTokenDialog from "@/components/hes/dashboard/send-token-dialog";
import { useHesDashboard } from "@/hooks/use-dashboard";

const CommunicationReportTable = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedMeter, setSelectedMeter] = useState<string | null>(null);
  const { data: hesDashboardData } = useHesDashboard()
  const tableData = hesDashboardData?.communicationReport

  const handleSendToken = (meterNo: string) => {
    setSelectedMeter(meterNo);
    setIsDialogOpen(true);
  };

  const handleDialogSubmit = (token: string) => {
    console.log(`Sending token ${token} to meter ${selectedMeter}`);
    // Add your token sending logic here
  };

  return (
    <Card className="w-full p-4 bg-white shadow-sm rounded-lg mt-4 border border-gray-200">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-600">Communication Report</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">S/N</TableHead>
              <TableHead className="text-left">Meter No.</TableHead>
              <TableHead className="text-left">Meter Model</TableHead>
              <TableHead className="text-left w-[120px]">Status</TableHead>
              <TableHead className="text-left">Last Sync</TableHead>
              <TableHead className="text-left">Tamper State</TableHead>
              <TableHead className="text-left">Tamper Sync</TableHead>
              <TableHead className="text-left">Relay Control</TableHead>
              <TableHead className="text-left">Relay Sync</TableHead>
              <TableHead className="text-left">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData?.map((row) => (
              <TableRow key={row.serialNumber}>
                <TableCell>{row.serialNumber}</TableCell>
                <TableCell>{row.meterNo}</TableCell>
                <TableCell>{row.meterModel}</TableCell>
                <TableCell className="text-left w-[120px]">
                  <div className="flex items-center">
                    <span className={getStatusStyle(row.status)}>
                      {row.status}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="truncate">{row.lastSync}</TableCell>
                <TableCell className="truncate">{row.tamperState}</TableCell>
                <TableCell className="truncate">{row.tamperSync}</TableCell>
                <TableCell className="w-[120px]">
                  <div className="flex items-center truncate">
                    <span className={getStatusStyle(row.relayControl)}>
                      {row.relayControl}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="truncate">{row.relaySync}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="default" size="sm" className="border-gray-200 focus:ring-gray-500/0 cursor-pointer">
                        <MoreVertical size={16} className="text-gray-500 border-gray-200" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-48 bg-white shadow-lg">
                      <DropdownMenuItem className="flex items-center gap-2">
                        <CircleCheck size={14} className="text-black" />
                        <span className="text-sm lg:text-base text-black">Connect Relay</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => handleSendToken(row.meterNo)}
                      >
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
      <SendTokenDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleDialogSubmit}
      />
    </Card>
  );
};

export default CommunicationReportTable;
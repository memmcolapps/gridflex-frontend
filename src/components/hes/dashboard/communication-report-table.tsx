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

const CommunicationReportTable = () => {
  const data = [
    { sNo: "01", meterNo: "6212465987", model: "MMX 310-NG", status: "Offline", lastSync: "1 min ago", tamperState: "No Tamper", tamperSync: "2 hours ago", relayControl: "Disconnected", relaySync: "2 hours ago", actions: ["Connect Relay", "Send Token"] },
    { sNo: "02", meterNo: "6212465987", model: "MMX 110-NG", status: "Online", lastSync: "2 hours ago", tamperState: "Tamper Detected", tamperSync: "3 hours ago", relayControl: "Disconnected", relaySync: "3 hours ago", actions: ["Connect Relay", "Send Token"] },
    { sNo: "03", meterNo: "6212465987", model: "MMX 110-NG", status: "Offline", lastSync: "2 hours ago", tamperState: "No Tamper", tamperSync: "3 hours ago", relayControl: "Disconnected", relaySync: "3 hours ago", actions: ["Connect Relay", "Send Token"] },
    { sNo: "04", meterNo: "6212465987", model: "MMX 110-NG", status: "Online", lastSync: "2 hours ago", tamperState: "No Tamper", tamperSync: "3 hours ago", relayControl: "Connected", relaySync: "3 hours ago", actions: ["Connect Relay", "Send Token"] },
  ];

  return (
    <Card className="w-full p-4 bg-white shadow-sm rounded-lg mt-4">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-600">Communication Report</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">S/N</TableHead>
              <TableHead className="text-left">Meter No.</TableHead>
              <TableHead className="text-left">Meter Model</TableHead>
              <TableHead className="text-left">Status</TableHead>
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
                <TableCell className={row.status === "Online" ? "text-green-600" : "text-red-600"}>{row.status}</TableCell>
                <TableCell>{row.lastSync}</TableCell>
                <TableCell>{row.tamperState}</TableCell>
                <TableCell>{row.tamperSync}</TableCell>
                <TableCell className={row.relayControl === "Connected" ? "text-green-600" : "text-orange-600"}>{row.relayControl}</TableCell>
                <TableCell>{row.relaySync}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="text-blue-500">...</Button>
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
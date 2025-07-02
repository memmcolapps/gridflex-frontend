import { Eye, MoreVertical, Pencil } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import EditMeterReading from "./edit-reading";
import { Card } from "../ui/card";
// import EditMeterReading from "./edit";

export default function MeterReadings() {
    const data = [
        { id: 1, meterNo: "62010223", feederLine: "jeun", tariffType: "R1", larDate: "16-05-2025", lastReading: 500, readingType: "Normal", readingDate: "16-06-2025", currentReadings: 0 },
        { id: 2, meterNo: "62010223", feederLine: "jeun", tariffType: "R2", larDate: "16-05-2025", lastReading: 300, readingType: "Rollover", readingDate: "16-06-2025", currentReadings: 300 },
        { id: 3, meterNo: "62010223", feederLine: "jeun", tariffType: "R3", larDate: "16-05-2025", lastReading: 450, readingType: "Normal", readingDate: "16-06-2025", currentReadings: 450 },
        { id: 4, meterNo: "62010223", feederLine: "jeun", tariffType: "C1", larDate: "16-05-2025", lastReading: 400, readingType: "Normal", readingDate: "16-06-2025", currentReadings: 400 },
        { id: 5, meterNo: "62010223", feederLine: "jeun", tariffType: "C2", larDate: "16-05-2025", lastReading: 480, readingType: "Normal", readingDate: "16-06-2025", currentReadings: 0 },
        { id: 6, meterNo: "62010223", feederLine: "jeun", tariffType: "C3", larDate: "16-05-2025", lastReading: 800, readingType: "Normal", readingDate: "16-06-2025", currentReadings: 800 },
        { id: 7, meterNo: "62010223", feederLine: "jeun", tariffType: "D1", larDate: "16-05-2025", lastReading: 900, readingType: "Normal", readingDate: "16-06-2025", currentReadings: 900 },
        { id: 8, meterNo: "62010223", feederLine: "jeun", tariffType: "D2", larDate: "16-05-2025", lastReading: 30, readingType: "Normal", readingDate: "16-06-2025", currentReadings: 30 },
        { id: 9, meterNo: "62010223", feederLine: "jeun", tariffType: "D3", larDate: "16-05-2025", lastReading: 99980, readingType: "Normal", readingDate: "16-06-2025", currentReadings: 0 },
        { id: 10, meterNo: "62010223", feederLine: "jeun", tariffType: "R3", larDate: "16-05-2025", lastReading: 99950, readingType: "Normal", readingDate: "16-06-2025", currentReadings: 99950 },
    ];

    type MeterReading = {
        id: number;
        meterNo: string;
        feederLine: string;
        tariffType: string;
        larDate: string;
        lastReading: number;
        readingType: string;
        readingDate: string;
        currentReadings: number;
    };

    const [, setEditDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MeterReading | null>(null);

    const handleView = (id: number) => {
        console.log(`Viewing meter reading ${id}`);
    };

    const handleEdit = (id: number) => {
        const item = data.find((item) => item.id === id);
        setSelectedItem(item ?? null);
        setEditDialogOpen(true);
    };

    const handleDialogClose = () => {
        setEditDialogOpen(false);
        setSelectedItem(null);
    };

    return (
        <Card className="p-4 border-none shadow-sm rounded">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>S/N</TableHead>
                        <TableHead>Meter No.</TableHead>
                        <TableHead>Feeder Line</TableHead>
                        <TableHead>Tariff Type</TableHead>
                        <TableHead>LAR Date</TableHead>
                        <TableHead>Last Actual Reading</TableHead>
                        <TableHead>Reading Type</TableHead>
                        <TableHead>Reading Date</TableHead>
                        <TableHead>Current Readings</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.meterNo}</TableCell>
                            <TableCell>{item.feederLine}</TableCell>
                            <TableCell>{item.tariffType}</TableCell>
                            <TableCell>{item.larDate}</TableCell>
                            <TableCell>{item.lastReading}</TableCell>
                            <TableCell>{item.readingType}</TableCell>
                            <TableCell>{item.readingDate}</TableCell>
                            <TableCell>{item.currentReadings}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical size={16} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => handleView(item.id)}>
                                            <Eye size={16} className="mr-2" />
                                            View details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleEdit(item.id)}>
                                            <Pencil size={16} className="mr-2" />
                                            Edit Current Readings
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex justify-between items-center mt-4">
                <span>Rows per page 10 - 1 of 40 rows</span>
                <div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="mr-2 border-gray-300">
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-300">
                        Next
                    </Button>
                </div>
            </div>
            {selectedItem && (
                <EditMeterReading
                    id={selectedItem.id}
                    onClose={handleDialogClose}
                    initialData={{
                        ...selectedItem,
                        month: selectedItem.readingDate.split("-")[1] ?? "",
                        year: selectedItem.readingDate.split("-")[2] ?? "",
                    }}
                />
            )}
        </Card>
    );
}
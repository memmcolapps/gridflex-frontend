"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { type Customer } from "@/types/customer-types";
interface MeterDetailsDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    
        customer: Customer | null;
}

export default function MeterDetailsDialog({ isOpen, onOpenChange, customer }: MeterDetailsDialogProps) {
    if (!customer) return null;

    // Placeholder meter data; replace with actual data fetching logic
    const meterData = [
        { accountNumber: "620102123", meterNumber: "V-201021223", category: "Post paid", feeder: "ljeun", dss: "ljeun", status: "Active" },
        { accountNumber: "620102123", meterNumber: "V-201021223", category: "Post Paid", feeder: "ljeun", dss: "ljeun", status: "Active" },
        { accountNumber: "620102123", meterNumber: "620102123", category: "Post Paid", feeder: "ljeun", dss: "ljeun", status: "Active" },
        { accountNumber: "620102123", meterNumber: "620102123", category: "Prepaid", feeder: "ljeun", dss: "ljeun", status: "Active" },
        { accountNumber: "620102123", meterNumber: "620102123", category: "Prepaid", feeder: "ljeun", dss: "ljeun", status: "Deactivated" },
        { accountNumber: "620102123", meterNumber: "620102123", category: "Post Paid", feeder: "ljeun", dss: "ljeun", status: "Active" },
        { accountNumber: "620102123", meterNumber: "620102123", category: "-----", feeder: "-----", dss: "-----", status: "Active" },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white w-full min-w-[500px] h-fit p-6 rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold flex items-center justify-between mt-8 -mb-4">
                        {customer.firstName} {customer.lastName}
                        <div>
                            <Label className="text-sm font-medium text-gray-900 mt-2">
                                Total Number of meters
                            </Label>
                            <h1 className="text-3xl font-bold text-gray-900 text-right">
                                {meterData.length}
                            </h1>
                        </div>
                    </DialogTitle>
                    <DialogClose className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                </DialogHeader>
                <div className="mt-4">
                    <p className="text-sm text-gray-600">C-{customer.accountNumber}</p>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Account Number</TableHead>
                                <TableHead>Meter Number</TableHead>
                                <TableHead>Meter Category</TableHead>
                                <TableHead>Feeder Line</TableHead>
                                <TableHead>DSS</TableHead>
                                <TableHead className="flex gap-1 items-center">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {meterData.map((meter, index) => (
                                <TableRow key={index}>
                                    <TableCell>{meter.accountNumber}</TableCell>
                                    <TableCell>{meter.meterNumber}</TableCell>
                                    <TableCell>{meter.category}</TableCell>
                                    <TableCell>{meter.feeder}</TableCell>
                                    <TableCell>{meter.dss}</TableCell>
                                    <TableCell>
                                        <span
                                            className={
                                                meter.status === "Active"
                                                    ? "text-[#059E40] bg-[#E9FBF0] rounded-full px-1.5 py-1.5"
                                                    : "text-[#F50202] bg-[#FBE9E9] rounded-full px-1.5 py-1.5"
                                            }
                                        >
                                            {meter.status}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <DialogFooter className="flex justify-between mt-4">
                        <Button
                            variant="outline"
                            className="border-[#161CCA] text-[#161CCA] hover:bg-[#161CCA]/10"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="default"
                            className="bg-[#161CCA] text-white hover:bg-[#161CCA]/90"
                            onClick={() => onOpenChange(false)}
                            size={"lg"}
                        >
                            Print
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
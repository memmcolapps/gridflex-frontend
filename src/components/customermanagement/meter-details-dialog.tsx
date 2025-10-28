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

    const meterData = customer.meter || [];

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white w-full min-w-fit border-none max-w-fit h-fit max-h-full p-6 rounded-lg overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold flex items-center justify-between mt-8 -mb-8">
                        {customer.firstname} {customer.lastname}
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
                    <p className="text-sm text-gray-600">C-{customer.customerId}</p>
                    <div className="w-fit mt-4 overflow-x-auto max-h-fit overflow-y-auto border border-gray-200 rounded">
                        <Table className="min-w-fit w-fit">
                            <TableHeader className="bg-gray-50 sticky top-0">
                                <TableRow>
                                    <TableHead className="whitespace-nowrap font-medium">Account Number</TableHead>
                                    <TableHead className="whitespace-nowrap font-medium">Meter Number</TableHead>
                                    <TableHead className="whitespace-nowrap font-medium">Meter Category</TableHead>
                                    <TableHead className="whitespace-nowrap font-medium">Feeder Line</TableHead>
                                    <TableHead className="whitespace-nowrap font-medium">DSS</TableHead>
                                    <TableHead className="whitespace-nowrap font-medium">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {meterData.map((meter, index) => (
                                    <TableRow key={meter.id} className="hover:bg-gray-50">
                                        <TableCell className="whitespace-nowrap">{meter.accountNumber}</TableCell>
                                        <TableCell className="whitespace-nowrap">{meter.meterNumber}</TableCell>
                                        <TableCell className="whitespace-nowrap">{meter.meterCategory}</TableCell>
                                        <TableCell className="whitespace-nowrap">{(meter as any).feederInfo?.name || 'N/A'}</TableCell>
                                        <TableCell className="whitespace-nowrap">{(meter as any).dssInfo?.name || 'N/A'}</TableCell>
                                        <TableCell className="whitespace-nowrap">
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
                    </div>
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
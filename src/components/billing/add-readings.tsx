import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCreateMeterReading } from "@/hooks/use-billing";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface AddReadingDialogProps {
    open: boolean;
    onClose: () => void;
    meterClass: string;
}

export default function AddReadingDialog({ open, onClose, meterClass }: AddReadingDialogProps) {
    const [formData, setFormData] = useState({
        meterNo: "",
        month: "",
        year: "",
        readingType: "",
        presentReadings: "",
    });

    const queryClient = useQueryClient();
    const createMeterReadingMutation = useCreateMeterReading();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Convert numeric month to full month name
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const monthIndex = parseInt(formData.month) - 1;
        const fullMonthName = monthNames[monthIndex] ?? formData.month; // Fallback to original if invalid

        const payload = {
            meterNumber: formData.meterNo,
            billMonth: fullMonthName,
            billYear: formData.year,
            currentReading: formData.presentReadings,
            meterClass,
        };

        try {
            await createMeterReadingMutation.mutateAsync(payload);
            toast.success("Meter reading added successfully!");

            // Invalidate and refetch meter readings queries
            queryClient.invalidateQueries({ queryKey: ["meterReadings"] });

            setFormData({
                meterNo: "",
                month: "",
                year: "",
                readingType: "",
                presentReadings: "",
            });
            onClose();
        } catch (error: unknown) {
            // Extract error message from backend response
            const errorMessage = (error as { response?: { data?: { responsedesc?: string } }; message?: string })?.response?.data?.responsedesc ??
                               (error as { message?: string })?.message ??
                               "Failed to add meter reading. Please try again.";
            toast.error(errorMessage);
            console.error("Error adding meter reading:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white p-6 h-fit w-full max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Readings</DialogTitle>
                </DialogHeader>
                <div className="text-sm text-gray-800 mb-4">
                    Enter a meter number and add readings.
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4 -mt-4">
                        <div className="grid grid-cols-1 items-center gap-4">
                            <Label htmlFor="meterNo" className="text-right">
                                Meter No *
                            </Label>
                            <Input
                                id="meterNo"
                                name="meterNo"
                                value={formData.meterNo}
                                onChange={handleChange}
                                className="col-span-3 border-gray-300"
                                placeholder="Enter meter no."
                                type="number"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                min="0"
                            />
                        </div>
                        <div className="grid grid-cols-1 items-center gap-4">
                            <Label htmlFor="month" className="text-right">
                                Month *
                            </Label>
                            <Select
                                name="month"
                                value={formData.month}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, month: value }))}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select billing month" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="01">January</SelectItem>
                                    <SelectItem value="02">February</SelectItem>
                                    <SelectItem value="03">March</SelectItem>
                                    <SelectItem value="04">April</SelectItem>
                                    <SelectItem value="05">May</SelectItem>
                                    <SelectItem value="06">June</SelectItem>
                                    <SelectItem value="07">July</SelectItem>
                                    <SelectItem value="08">August</SelectItem>
                                    <SelectItem value="09">September</SelectItem>
                                    <SelectItem value="10">October</SelectItem>
                                    <SelectItem value="11">November</SelectItem>
                                    <SelectItem value="12">December</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-1 items-center gap-4">
                            <Label htmlFor="year" className="text-right">
                                Year *
                            </Label>
                            <Select
                                name="year"
                                value={formData.year}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, year: value }))}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select billing year" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2025">2025</SelectItem>
                                    <SelectItem value="2024">2024</SelectItem>
                                    <SelectItem value="2023">2023</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-1 items-center gap-4">
                            <Label htmlFor="readingType" className="text-right">
                                Reading Type *
                            </Label>
                            <Select
                                name="readingType"
                                value={formData.readingType}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, readingType: value }))}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select Reading Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Normal">Normal</SelectItem>
                                    <SelectItem value="Rollover">Rollover</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-1 items-center gap-4">
                            <Label htmlFor="presentReadings" className="text-right">
                                Present Readings (kWh) *
                            </Label>
                            <Input
                                id="presentReadings"
                                name="presentReadings"
                                value={formData.presentReadings}
                                onChange={handleChange}
                                className="col-span-3 border-gray-300"
                                type="number"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                min="0"
                                placeholder="Enter present reading"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            className="text-[rgba(22,28,202,1)] border-[#161CCA] cursor-pointer"
                            onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            variant="default"
                            className="bg-[#161CCA] text-white cursor-pointer"
                            size={"lg"}
                            type="submit"
                            disabled={
                                !formData.meterNo ||
                                !formData.month ||
                                !formData.year ||
                                !formData.readingType ||
                                !formData.presentReadings ||
                                createMeterReadingMutation.isPending
                            }
                        >
                            {createMeterReadingMutation.isPending ? "Adding..." : "Proceed"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
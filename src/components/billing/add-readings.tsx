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
        presentReadings: "",
    });

    const queryClient = useQueryClient();
    const createMeterReadingMutation = useCreateMeterReading();

    // Get current date for validation
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonthIndex = currentDate.getMonth(); // 0-indexed

    // Generate years (current year and past 5 years)
    const years = Array.from({ length: 6 }, (_, i) => (currentYear - i).toString());

    const months = [
        { value: "01", label: "January" },
        { value: "02", label: "February" },
        { value: "03", label: "March" },
        { value: "04", label: "April" },
        { value: "05", label: "May" },
        { value: "06", label: "June" },
        { value: "07", label: "July" },
        { value: "08", label: "August" },
        { value: "09", label: "September" },
        { value: "10", label: "October" },
        { value: "11", label: "November" },
        { value: "12", label: "December" },
    ];

    // Check if a month is in the future
    const isMonthDisabled = (monthValue: string) => {
        if (formData.year === currentYear.toString()) {
            const monthIndex = parseInt(monthValue) - 1;
            return monthIndex > currentMonthIndex;
        }
        return false;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Convert numeric month to full month name
        const monthIndex = parseInt(formData.month) - 1;
        const fullMonthName = months[monthIndex]?.label ?? formData.month;

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
                                    {months.map((month) => (
                                        <SelectItem
                                            key={month.value}
                                            value={month.value}
                                            disabled={isMonthDisabled(month.value)}
                                        >
                                            {month.label}
                                        </SelectItem>
                                    ))}
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
                                onValueChange={(value) => {
                                    setFormData((prev) => {
                                        // If selecting current year and month is in the future, reset month
                                        if (value === currentYear.toString() && prev.month) {
                                            const monthIndex = parseInt(prev.month) - 1;
                                            if (monthIndex > currentMonthIndex) {
                                                return { ...prev, year: value, month: "" };
                                            }
                                        }
                                        return { ...prev, year: value };
                                    });
                                }}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select billing year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map((year) => (
                                        <SelectItem key={year} value={year}>
                                            {year}
                                        </SelectItem>
                                    ))}
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

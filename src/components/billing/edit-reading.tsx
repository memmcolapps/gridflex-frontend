import { useState } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface EditMeterReadingProps {
    id: string | number;
    onClose: () => void;
    initialData: {
        meterNo: string;
        month: string;
        year: string;
        readingType: string;
        currentReadings: number | string;
        [key: string]: unknown;
    };
}

export default function EditMeterReading({ onClose, initialData }: EditMeterReadingProps) {
    const [formData, setFormData] = useState(initialData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Updated data:", formData);
        onClose();
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="bg-white p-6 h-fit w-full max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Meter Reading</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
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
                            />
                        </div>
                        <div className="grid grid-cols-1 items-center gap-4">
                            <Label htmlFor="month" className="text-right">
                                Month *
                            </Label>
                            <Select
                                name="month"
                                value={formData.month}
                                onValueChange={(value) => handleSelectChange("month", value)}
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
                                onValueChange={(value) => handleSelectChange("year", value)}
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
                                onValueChange={(value) => handleSelectChange("readingType", value)}
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
                            <Label htmlFor="currentReadings" className="text-right">
                                Present Readings (kWh) *
                            </Label>
                            <Input
                                id="currentReadings"
                                name="currentReadings"
                                value={formData.currentReadings}
                                onChange={handleChange}
                                className="col-span-3 border-gray-300"
                                type="number"
                                placeholder="Enter present reading"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            variant="default"
                            className="bg-[#161CCA] text-white cursor-pointer"
                            size="lg"
                            disabled={!formData.meterNo || !formData.month || !formData.year || !formData.readingType || !formData.currentReadings}
                        >
                            Save
                        </Button>
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="text-[rgba(22,28,202,1)] border-[#161CCA] cursor-pointer"
                            size="lg"
                            >
                            Cancel
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
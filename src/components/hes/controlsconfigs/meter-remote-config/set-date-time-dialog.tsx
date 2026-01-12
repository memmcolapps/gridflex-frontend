"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
import type { Meter } from "@/types/meter";

// interface Meter {
//     id: string;
//     name?: string;
//     // Add other properties as needed
// }

interface SetDateTimeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    meter?: Meter; // Replaced 'any' with 'Meter'
}

export default function SetDateTimeDialog({ isOpen, onClose, meter }: SetDateTimeDialogProps) {
    const [hour, setHour] = useState("");
    const [minute, setMinute] = useState("");
    const [date, setDate] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");

    // Check if all fields are filled
    const isFormComplete =
        hour.trim() !== "" &&
        minute.trim() !== "" &&
        date.trim() !== "" &&
        month.trim() !== "" &&
        year.trim() !== "";

    const handleSet = () => {
        // Handle date and time set logic
        console.log("Setting Date and Time:", { hour, minute, date, month, year, meter });
        onClose();
    };

    // Date options (1-31)
    const dateOptions = Array.from({ length: 31 }, (_, i) => ({
        value: (i + 1).toString(),
        label: (i + 1).toString(),
    }));
    // Month options
    const monthOptions = [
        { value: "1", label: "January" },
        { value: "2", label: "February" },
        { value: "3", label: "March" },
        { value: "4", label: "April" },
        { value: "5", label: "May" },
        { value: "6", label: "June" },
        { value: "7", label: "July" },
        { value: "8", label: "August" },
        { value: "9", label: "September" },
        { value: "10", label: "October" },
        { value: "11", label: "November" },
        { value: "12", label: "December" },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="h-fit bg-white">
                <DialogHeader>
                    <DialogTitle>Set Date And Time</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <Label htmlFor="hour-input" className="text-sm font-medium text-gray-700 mb-2 block">
                                Hour <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="hour-input"
                                type="text"
                                value={hour}
                                onChange={(e) => setHour(e.target.value)}
                                placeholder="Enter Hour"
                                className="border border-gray-200"
                            />
                        </div>
                        <div className="w-1/2">
                            <Label htmlFor="minute-input" className="text-sm font-medium text-gray-700 mb-2 block">
                                Minute <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="minute-input"
                                type="text"
                                value={minute}
                                onChange={(e) => setMinute(e.target.value)}
                                placeholder="Enter Minute"
                                className="border border-gray-200"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-1/3">
                            <Label htmlFor="date-input" className="text-sm font-medium text-gray-700 mb-2 block">
                                Date <span className="text-red-500">*</span>
                            </Label>
                            <Select onValueChange={setDate} value={date}>
                                <SelectTrigger className="w-full border border-gray-200 text-gray-400">
                                    <SelectValue placeholder="Select Date" />
                                </SelectTrigger>
                                <SelectContent>
                                    {dateOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-1/3">
                            <Label htmlFor="month-input" className="text-sm font-medium text-gray-700 mb-2 block">
                                Month <span className="text-red-500">*</span>
                            </Label>
                            <Select onValueChange={setMonth} value={month}>
                                <SelectTrigger className="w-full border border-gray-200 text-gray-400">
                                    <SelectValue placeholder="Select Month" />
                                </SelectTrigger>
                                <SelectContent>
                                    {monthOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-1/3">
                            <Label htmlFor="year-input" className="text-sm font-medium text-gray-700 mb-2 block">
                                Year <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="year-input"
                                type="text"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                placeholder="Enter Year"
                                className="border border-gray-200"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="border-[#161CCA] text-[#161CCA] cursor-pointer"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSet}
                        className={`bg-[#161CCA] text-white ${!isFormComplete ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                            }`}
                        disabled={!isFormComplete}
                    >
                        Set
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
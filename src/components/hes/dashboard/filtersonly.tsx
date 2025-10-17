/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useBand } from "@/hooks/use-band";

interface FiltersOnlyProps {
    selectedBand: string;
    setSelectedBand: (band: string) => void;
    selectedYear: string;
    setSelectedYear: (year: string) => void;
    selectedMeterType: string;
    setSelectedMeterType: (type: string) => void;
}

export const FiltersOnly: React.FC<FiltersOnlyProps> = ({
    selectedBand,
    setSelectedBand,
    selectedYear,
    setSelectedYear,
    selectedMeterType,
    setSelectedMeterType,
}) => {
    const { bands, error } = useBand();

    // Reset selectedBand if it's not a valid option (e.g., during loading or if no bands are available)
    useEffect(() => {
        if (bands.length === 0) {
            // If no bands are available, clear the selectedBand to show the placeholder
            if (selectedBand !== "") {
                setSelectedBand("");
            }
        } else {
            // If bands are loaded but selectedBand is not a valid band, reset it
            const isValidBand = bands.some((bandItem) => bandItem.name === selectedBand);
            if (selectedBand && !isValidBand) {
                setSelectedBand("");
            }
        }
    }, [bands, selectedBand, setSelectedBand]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 w-fit gap-1 mt-4">
            <Select
                value={selectedBand}
                onValueChange={setSelectedBand}
                disabled={bands.length === 0}
            >
                <SelectTrigger className="w-full cursor-pointer transition-all duration-200 hover:text-gray-700 border-r border-gray-300 last:border-r-0">
                    <SelectValue placeholder="Band" />
                </SelectTrigger>
                <SelectContent>
                    {bands.length > 0 ? (
                        bands.map((bandItem) => (
                            <SelectItem key={bandItem.id} value={bandItem.name}>
                                {bandItem.name}
                            </SelectItem>
                        ))
                    ) : (
                        <SelectItem value="no-bands" disabled>
                            No bands available
                        </SelectItem>
                    )}
                </SelectContent>
            </Select>
            <Select value={selectedMeterType} onValueChange={setSelectedMeterType}>
                <SelectTrigger className="w-full cursor-pointer transition-all duration-200 hover:text-gray-700 border-r-0">
                    <SelectValue placeholder="Meter Class">{selectedMeterType}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Prepaid">Prepaid</SelectItem>
                    <SelectItem value="Postpaid">Postpaid</SelectItem>
                    <SelectItem value="Smart">Smart</SelectItem>
                </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-full cursor-pointer transition-all duration-200 hover:text-gray-700 border-r border-gray-300 last:border-r-0">
                    <SelectValue placeholder="Year">{selectedYear}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                </SelectContent>
            </Select>

        </div>
    );
};
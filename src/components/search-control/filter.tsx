import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { Checkbox } from "../ui/checkbox";

interface FilterControlProps {
    onFilterClick?: () => void;
    onApply?: (filters: Record<string, boolean>) => void;
    onReset?: () => void;
}

export function FilterControl({ onApply, onReset }: FilterControlProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState<Record<string, boolean>>({
        inStock: false,
        assigned: false,
        deactivated: false,
        singlePhase: false,
        threePhase: false,
        mdMeter: false,
    });
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isOpen &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);


    const toggleFilter = (filterName: string) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: !prev[filterName]
        }));
    };

    const handleApply = () => {
        onApply?.(filters);
        setIsOpen(false);
    };

    const handleReset = () => {
        setFilters({
            inStock: false,
            assigned: false,
            deactivated: false,
            singlePhase: false,
            threePhase: false,
            mdMeter: false,
        });
        onReset?.();
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <div className="flex items-center gap-2">
                <Button
                    ref={buttonRef}
                    variant="outline"
                    className="gap-2 border-gray-300 w-full lg:w-auto cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <Filter className="text-gray-500" size={14} />
                    <span className="text-gray-800 text-sm lg:text-base">Filter</span>
                </Button>
            </div>

            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute z-50 mt-2 w-120 bg-white rounded-md shadow-lg border-gray-200 pr-2">
                    {/* Status Section */}
                    <div className="flex items-center justify-between border-b border-gray-200">
                        <div className="w-35 font-medium text-gray-700 px-4">Status</div>
                        <div className="flex-1 border-l border-gray-200 pl-2">
                            {/* In-Stock Checkbox */}
                            <div className="flex items-center justify-between py-1 border-b border-gray-200">
                                <label htmlFor="inStock" className="text-sm text-gray-700 m-2">In-stock</label>
                                <Checkbox
                                    id="inStock"
                                    checked={filters.inStock}
                                    onCheckedChange={() => toggleFilter('inStock')}
                                    className={`h-4 w-4 border-2 rounded cursor-pointer ${filters.inStock
                                        ? 'bg-blue-500 border-blue-500'
                                        : 'bg-white border-gray-300'
                                        }`}
                                />
                            </div>

                            {/* Assigned Checkbox */}
                            <div className="flex items-center justify-between py-1 border-b border-gray-200">
                                <label htmlFor="assigned" className="text-sm text-gray-700 m-2">Assigned</label>
                                <Checkbox
                                    id="assigned"
                                    checked={filters.assigned}
                                    onCheckedChange={() => toggleFilter('assigned')}
                                    className={`h-4 w-4 border-2 rounded cursor-pointer ${filters.assigned
                                        ? 'bg-blue-500 border-blue-500'
                                        : 'bg-white border-gray-300'
                                        }`}
                                />
                            </div>

                            {/* Deactivated Checkbox */}
                            <div className="flex items-center justify-between py-1">
                                <label htmlFor="deactivated" className="text-sm text-gray-700 m-2">Deactivated</label>
                                <Checkbox
                                    id="deactivated"
                                    checked={filters.deactivated}
                                    onCheckedChange={() => toggleFilter('deactivated')}
                                    className={`h-4 w-4 border-2 rounded cursor-pointer ${filters.deactivated
                                        ? 'bg-blue-500 border-blue-500'
                                        : 'bg-white border-gray-300'
                                        }`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Meter Class Section */}
                    <div className="flex border-b border-gray-200 items-center justify-between">
                        <div className="w-35 font-medium text-gray-700 px-4">Meter Class</div>
                        <div className="flex-1 border-l border-gray-200 pl-2">
                            {/* Single Phase Checkbox */}
                            <div className="flex items-center justify-between py-1 border-b border-gray-200">
                                <label htmlFor="singlePhase" className="text-sm text-gray-700 m-2">Single phase</label>
                                <Checkbox
                                    id="singlePhase"
                                    checked={filters.singlePhase}
                                    onCheckedChange={() => toggleFilter('singlePhase')}
                                    className={`h-4 w-4 border-2 rounded cursor-pointer ${filters.singlePhase
                                        ? 'bg-blue-500 border-blue-500'
                                        : 'bg-white border-gray-300'
                                        }`}
                                />
                            </div>

                            {/* Three Phase Checkbox */}
                            <div className="flex items-center justify-between py-1 border-b border-gray-200">
                                <label htmlFor="threePhase" className="text-sm text-gray-700 m-2">Three Phase</label>
                                <Checkbox
                                    id="threePhase"
                                    checked={filters.threePhase}
                                    onCheckedChange={() => toggleFilter('threePhase')}
                                    className={`h-4 w-4 border-2 rounded cursor-pointer ${filters.threePhase
                                        ? 'bg-blue-500 border-blue-500'
                                        : 'bg-white border-gray-300'
                                        }`}
                                />
                            </div>

                            {/* MD Meter Checkbox */}
                            <div className="flex items-center justify-between py-1">
                                <label htmlFor="mdMeter" className="text-sm text-gray-700 m-2">MD Meter</label>
                                <Checkbox
                                    id="mdMeter"
                                    checked={filters.mdMeter}
                                    onCheckedChange={() => toggleFilter('mdMeter')}
                                    className={`h-4 w-4 border-2 rounded cursor-pointer ${filters.mdMeter
                                        ? 'bg-blue-500 border-blue-500'
                                        : 'bg-white border-gray-300'
                                        }`}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between gap-2 mt-4 p-4">
                        <Button variant="outline" onClick={handleReset} className="text-blue-600 border-blue-600 cursor-pointer">
                            Reset
                        </Button>
                        <Button onClick={handleApply} className="bg-blue-600 text-white cursor-pointer">
                            Apply
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
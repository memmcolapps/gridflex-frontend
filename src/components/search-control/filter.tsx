"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ListFilter } from "lucide-react";
import { Checkbox } from "../ui/checkbox";

interface FilterOption {
    label: string;
    id: string;
}

interface FilterSection {
    title: string;
    options: FilterOption[];
}

interface FilterControlProps {
    sections: FilterSection[];
    onApply?: (filters: Record<string, boolean>) => void;
    onReset?: () => void;
    initialFilters?: Record<string, boolean>;
}

export function FilterControl({
    sections,
    onApply,
    onReset,
    initialFilters = {}
}: FilterControlProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState<Record<string, boolean>>(initialFilters);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isOpen &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const toggleFilter = (filterId: string, sectionIndex: number) => {
        setFilters(prev => {
            // Reset all filters in the section first
            const resetFilters = sections[sectionIndex]?.options?.reduce((acc, option) => {
                acc[option.id] = false;
                return acc;
            }, {} as Record<string, boolean>) ?? {};

            // Then set the selected filter
            return {
                ...prev,
                ...resetFilters,
                [filterId]: !prev[filterId]
            };
        });
    };

    const handleApply = () => {
        onApply?.(filters);
        setIsOpen(false);
    };

    const handleReset = () => {
        const resetFilters = sections.reduce((acc, section) => {
            section.options.forEach(option => {
                acc[option.id] = false;
            });
            return acc;
        }, {} as Record<string, boolean>);

        setFilters(resetFilters);
        onReset?.();
        setIsOpen(false);
    };

    // Check if sections[0] and sections[1] exist
    if (sections.length < 2) {
        return (
            <div className="relative">
                <div className="flex items-center gap-2">
                    <Button
                        ref={buttonRef}
                        variant="outline"
                        className="gap-2 border-gray-300 w-full lg:w-auto cursor-pointer"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <ListFilter className="text-gray-500" size={14} />
                        <span className="text-gray-800 text-sm lg:text-base">Filter</span>
                    </Button>
                </div>
                {isOpen && (
                    <div
                        ref={dropdownRef}
                        className="absolute z-50 mt-2 w-[280px] bg-white rounded-md shadow-lg border border-gray-200 p-4"
                    >
                        <div className="text-gray-700 text-sm">Insufficient filter sections provided.</div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="relative">
            <div className="flex items-center gap-2">
                <Button
                    ref={buttonRef}
                    variant="outline"
                    className="gap-2 border-gray-300 w-full lg:w-auto cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <ListFilter className="text-gray-500" size={14} />
                    <span className="text-gray-800 text-sm lg:text-base">Filter</span>
                </Button>
            </div>

            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute z-50 mt-2 w-[280px] bg-white rounded-md shadow-lg border border-gray-200 p-4"
                >
                    <div className="flex gap-4">
                        {/* Left Column: Meter Class */}
                        <div className="flex-1 border-r border-gray-200 pr-4">
                            <div className="text-black-700 text-sm mb-2 font-bold">{sections[0]?.title}</div>
                            {sections[0]?.options?.map((option) => (
                                <div
                                    key={option.id}
                                    className="flex items-center justify-between py-2"
                                >
                                    <label htmlFor={option.id} className="text-sm text-gray-700">
                                        {option.label}
                                    </label>
                                    <Checkbox
                                        id={option.id}
                                        checked={filters[option.id] ?? false}
                                        onCheckedChange={() => toggleFilter(option.id, 0)}
                                        className={`h-4 w-4 border-2 rounded cursor-pointer ${filters[option.id]
                                            ? 'bg-[#161CCA] border-[#161CCA]'
                                            : 'bg-white border-gray-300'
                                        }`}
                                    />
                                </div>
                            ))}
                        </div>
                        {/* Right Column: Meter Type (Category) */}
                        <div className="flex-1">
                            <div className="font-bold text-black-700 text-sm mb-2">{sections[1]?.title}</div>
                            {sections[1]?.options?.map((option) => (
                                <div
                                    key={option.id}
                                    className="flex items-center justify-between py-2"
                                >
                                    <label htmlFor={option.id} className="text-sm text-gray-700">
                                        {option.label}
                                    </label>
                                    <Checkbox
                                        id={option.id}
                                        checked={filters[option.id] ?? false}
                                        onCheckedChange={() => toggleFilter(option.id, 1)}
                                        className={`h-4 w-4 border-2 rounded cursor-pointer ${filters[option.id]
                                            ? 'bg-[#161CCA] border-[#161CCA]'
                                            : 'bg-white border-gray-300'
                                        }`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center gap-2 mt-4">
                        <Button
                            variant="outline"
                            onClick={handleReset}
                            className="text-xs text-[#161CCA] border-[#161CCA] cursor-pointer flex-1"
                        >
                            Reset
                        </Button>
                        <Button
                            onClick={handleApply}
                            className="text-xs bg-[#161CCA] text-white cursor-pointer flex-1"
                        >
                            Apply
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
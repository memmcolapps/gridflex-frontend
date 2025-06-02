import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Checkbox } from "../ui/checkbox";

interface FilterSection {
    title: string;
    options: {
        id: string;
        label: string;
    }[];
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

                    {sections.map((section, sectionIndex) => (
                        <div key={section.title} className="flex items-center justify-between border-b border-gray-200">
                            <div className="w-35 font-medium text-gray-700 px-4">{section.title}</div>
                            <div className="flex-1 border-l border-gray-200 pl-2">
                                {section.options.map((option, optionIndex) => (
                                    <div
                                        key={option.id}
                                        className={`flex items-center justify-between py-1 ${optionIndex < section.options.length - 1 ? 'border-b border-gray-200' : ''
                                            }`}
                                    >
                                        <label htmlFor={option.id} className="text-sm text-gray-700 m-2">
                                            {option.label}
                                        </label>
                                        <Checkbox
                                            id={option.id}
                                            checked={filters[option.id] ?? false}
                                            onCheckedChange={() => toggleFilter(option.id, sectionIndex)}
                                            className={`h-4 w-4 border-2 rounded cursor-pointer ${filters[option.id]
                                                ? 'bg-blue-500 border-blue-500'
                                                : 'bg-white border-gray-300'
                                                }`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

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
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";


interface SortControlProps {
    onSortChange?: (sortBy: string) => void;
    currentSort?: string;
}


export function SortControl({ onSortChange, currentSort = "" }: SortControlProps) {
    const [isOpen, setIsOpen] = useState(false);
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

    
    return (
        <div className="relative">
            <div className="flex items-center gap-2">
                <Button
                    ref={buttonRef}
                    variant="outline"
                    className="gap-2 border-gray-300 w-full lg:w-auto cursor-pointer"
                    onClick={() => setIsOpen((prev) => !prev)}
                >
                    <ArrowUpDown className="text-gray-500" size={14} />
                    <span className="text-gray-800 text-sm lg:text-base">Sort</span>
                </Button>
            </div>
            {isOpen && (

                <div
                    ref={dropdownRef}
                    className="absolute z-10 m-2 bg-white rounded shadow-lg p-2 w-full lg:w-42">
                    <div className="flex flex-col gap-2">
                        <button
                            className={`text-sm ${currentSort === "asc" ? "font-bold" : ""} hover:bg-gray-100 p-2 rounded cursor-pointer`}
                            onClick={() => {
                                onSortChange?.("asc");
                                setIsOpen(false);
                            }}
                        >
                            Newest - Oldest
                        </button>
                        <button
                            className={`text-sm ${currentSort === "desc" ? "font-bold" : ""} hover:bg-gray-100 p-2 rounded cursor-pointer`}
                            onClick={() => {
                                onSortChange?.("desc");
                                setIsOpen(false);
                            }}
                        >
                            Oldest - Newest
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
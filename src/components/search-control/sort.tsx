import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

interface SortControlProps {
    onSortChange?: (sortBy: string) => void;
    currentSort?: string;
}

export function SortControl({ onSortChange, currentSort = "" }: SortControlProps) {
    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                className="gap-2 border-gray-300 w-full lg:w-auto cursor-pointer"
                onClick={() => onSortChange?.(currentSort)}
            >
                <ArrowUpDown className="text-gray-500" size={14} />
                <span className="text-gray-800 text-sm lg:text-base">Sort</span>
            </Button>
        </div>
    );
}
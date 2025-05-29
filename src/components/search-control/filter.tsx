import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface FilterControlProps {
    onFilterClick?: () => void;
}

export function FilterControl({ onFilterClick }: FilterControlProps) {
    return (
        
        <div className="flex items-center gap-2">
            <Button 
                variant="outline" 
                className="gap-2 border-gray-300 w-full lg:w-auto cursor-pointer"
                onClick={onFilterClick}
            >
                <Filter className="text-gray-500" size={14} />
                <span className="text-gray-800 text-sm lg:text-base">Filter</span>
            </Button>
        </div>
    );
}
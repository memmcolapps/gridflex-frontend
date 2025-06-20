"use client";
"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";


interface SearchControlProps {
    onSearchChange?: (searchTerm: string) => void;
    value?: string;
}

export function SearchControl({ onSearchChange, value = "" }: SearchControlProps) {
    const [inputValue, setInputValue] = useState(value);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        if (onSearchChange) {
            onSearchChange(value);
        }
    };

    return (
        
        <div className="relative w-full lg:w-[300px]">
            <Search
                size={14}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
            />
            <Input
                type="text"
                placeholder="Search by meter no., account no..."
                value={inputValue}
                onChange={handleChange}
                className="pl-10 w-full border-gray-300 focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50 text-sm lg:text-base"
            />
        </div>
    );
}

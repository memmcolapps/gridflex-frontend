"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarRange } from "lucide-react";

interface DateRangeFilterProps {
  onApply?: (range: { startDate?: string; endDate?: string }) => void;
  onReset?: () => void;
  initialRange?: { startDate?: string; endDate?: string };
}

export function DateRangeFilter({
  onApply,
  onReset,
  initialRange = {},
}: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(initialRange.startDate ?? "");
  const [endDate, setEndDate] = useState(initialRange.endDate ?? "");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setStartDate(initialRange.startDate ?? "");
    setEndDate(initialRange.endDate ?? "");
  }, [initialRange]);

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

  const handleApply = () => {
    onApply?.({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
    setIsOpen(false);
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    onReset?.();
    setIsOpen(false);
  };

  const isActive = Boolean(startDate || endDate);

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <Button
          ref={buttonRef}
          variant="outline"
          className="gap-2 border-gray-300 w-full lg:w-auto cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <CalendarRange
            className={isActive ? "text-[#161CCA]" : "text-gray-500"}
            size={12}
          />
          <span
            className={`text-sm lg:text-base ${isActive ? "text-[#161CCA]" : "text-gray-800"}`}
          >
            Date Range
          </span>
        </Button>
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-2 w-[270px] bg-white rounded-md shadow-lg border border-gray-200 p-4 ml-[-45px]"
        >
          <div className="font-bold text-black-700 text-sm mb-3">Date Range</div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="startDate" className="text-sm text-gray-700">
                From
              </label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(e) => setStartDate(e.target.value)}
                className="border-gray-300"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="endDate" className="text-sm text-gray-700">
                To
              </label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => setEndDate(e.target.value)}
                className="border-gray-300"
              />
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

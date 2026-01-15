"use client";

import * as React from "react";
import * as chrono from "chrono-node";
import { CalendarIcon, X, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

function formatDate(date: Date | undefined) {
  if (!date) return "";
  return date.toLocaleDateString("en-Uk", {
    day: "2-digit",
    month: "numeric",
    year: "numeric",
  });
}

interface Props {
  placeHolder: string;
  className?: string;
}

export function DatePicker({ placeHolder, className }: Props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [month, setMonth] = React.useState<Date>(new Date());

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const handleDone = () => setOpen(false);
  const handleClose = () => setOpen(false);

  const handlePrevMonth = () => {
    const prev = new Date(month);
    prev.setMonth(month.getMonth() - 1);
    setMonth(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(month);
    next.setMonth(month.getMonth() + 1);
    setMonth(next);
  };

  return (
    <div className={`flex ${className} flex-col gap-3`}>
      <div className="relative flex items-center">
        <Input
          id="date"
          value={value}
          placeholder={placeHolder}
          className="bg-background h-10 border border-gray-300 pl-9"
          onChange={(e) => {
            setValue(e.target.value);
            const parsed = chrono.parseDate(e.target.value);
            if (parsed && parsed <= today) {
              setDate(parsed);
              setMonth(parsed);
            } else {
              setDate(undefined);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="absolute top-1/2 left-2 h-5 w-5 -translate-y-1/2 p-0"
            >
              <CalendarIcon size={12} className="h-3 w-3 text-gray-500" />
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className="relative w-120 overflow-hidden rounded-lg border-none bg-white p-4 shadow-lg"
            align="start"
          >
            {/* Close button */}
            <div className="flex justify-end px-6 py-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 text-gray-500 hover:text-gray-800"
                onClick={handleClose}
              >
                <X strokeWidth={2} size={16} />
              </Button>
            </div>
            <div className="mb-6 border border-[0.5px] border-gray-200"></div>

            {/* Header section */}
            <div className="relative z-10 mb-3 flex items-center justify-between px-2">
              <div className="font-semibold text-gray-800">
                {month.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handlePrevMonth}
                >
                  <ChevronLeft strokeWidth="1" className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleNextMonth}
                >
                  <ChevronRight strokeWidth="1" className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="relative z-0">
              <Calendar
                mode="single"
                selected={date}
                month={month}
                onMonthChange={setMonth}
                onSelect={(selected) => {
                  setDate(selected);
                  setValue(formatDate(selected));
                }}
                disabled={(date) => date > today}
                className="rounded-md pl-10"
              />
            </div>

            <div className="relative z-10 mt-4">
              <Button
                onClick={handleDone}
                className="h-11 w-full rounded-lg bg-[#161CCA] px-10 py-6 text-base font-semibold text-white"
              >
                Done
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

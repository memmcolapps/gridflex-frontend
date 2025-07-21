// components/ui/date-picker.tsx
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export default function DatePicker({
  label,
  value,
  onChange,
  className = "",
}: DatePickerProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <Label htmlFor="date">{label}</Label>
      <Input
        type="date"
        id="date"
        value={value}
        onChange={onChange}
        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
      />
    </div>
  );
}

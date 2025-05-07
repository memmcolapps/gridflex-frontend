"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
interface TariffDatePickerProps {
    value?: string;
    onChange?: (value: string) => void;
}
export function TariffDatePicker({ value, onChange }: TariffDatePickerProps) {
    const [date, setDate] = React.useState<Date | undefined>(() => (value ? new Date(value) : undefined))

    React.useEffect(() => {
        if (onChange && date) {
            onChange(date.toISOString())
        }
    }, [date, onChange])

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[365px] justify-start text-left font-normal border-gray-300 ",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon size={14} className="text-gray-500"/>
                    {date ? format(date, "PPP") : <span className="text-gray-500">Select date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                className="flex w-auto flex-col space-y-2 p-2"
            >
                <Select
                    onValueChange={(value: string) =>
                        setDate(addDays(new Date(), parseInt(value)))
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                        <SelectItem value="0">Today</SelectItem>
                        <SelectItem value="1">Tomorrow</SelectItem>
                        <SelectItem value="3">In 3 days</SelectItem>
                        <SelectItem value="7">In a week</SelectItem>
                    </SelectContent>
                </Select>
                <div className="rounded-md">
                    <Calendar mode="single" selected={date} onSelect={setDate} />
                </div>
            </PopoverContent>
        </Popover>
    )
}

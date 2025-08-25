/* eslint-disable @typescript-eslint/no-unused-vars */
// components/DailyReportDialog.tsx
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DailyReportTable } from '@/components/hes/daily-report-table';

interface DailyReportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DailyReportDialog({ open, onOpenChange }: DailyReportDialogProps) {
    const [startDate, setStartDate] = useState<Date | undefined>(new Date('2025-07-05'));
    const [endDate, setEndDate] = useState<Date | undefined>(new Date('2025-07-05'));
    const [meterNumber, setMeterNumber] = useState('');
    const [showTable, setShowTable] = useState(false);

    const handleProceed = () => {
        setShowTable(true);
        // Here you would fetch data based on selections, but for demo, just show table
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                {!showTable ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>Daily Report</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="start-date" className="text-right">
                                    Select Date
                                </Label>
                                <div className="col-span-3 flex space-x-2">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={'outline'}
                                                className={cn(
                                                    'w-[240px] justify-start text-left font-normal',
                                                    !startDate && 'text-muted-foreground'
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {startDate ? format(startDate, 'PPP HH:mm:ss') : <span>From</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={startDate}
                                                onSelect={setStartDate}
                                                initialFocus
                                            />
                                            {/* For time, add inputs */}
                                            <div className="p-2 border-t">
                                                <Input type="time" defaultValue="00:00:00" />
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                    <span>to</span>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={'outline'}
                                                className={cn(
                                                    'w-[240px] justify-start text-left font-normal',
                                                    !endDate && 'text-muted-foreground'
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {endDate ? format(endDate, 'PPP HH:mm:ss') : <span>To</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={endDate}
                                                onSelect={setEndDate}
                                                initialFocus
                                            />
                                            <div className="p-2 border-t">
                                                <Input type="time" defaultValue="00:00:00" />
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="meter-number" className="text-right">
                                    Meter Number
                                </Label>
                                <Select onValueChange={setMeterNumber}>
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Enter Meter Number" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="6212026559">6212026559</SelectItem>
                                        {/* Add more options as needed */}
                                        <SelectItem value="6212456987">6212456987</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleProceed}>Proceed</Button>
                        </div>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>Daily Report</DialogTitle>
                        </DialogHeader>
                        <DailyReportTable />
                        <div className="flex justify-end space-x-2 mt-4">
                            <Button variant="outline" onClick={() => setShowTable(false)}>
                                Cancel
                            </Button>
                            <Button>Export</Button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}   
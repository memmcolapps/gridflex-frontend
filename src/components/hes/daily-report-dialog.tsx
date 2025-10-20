// components/DailyReportDialog.tsx
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { SimplifiedCalendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DailyReportTable } from '@/components/hes/daily-report-table';

interface DailyReportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    reportType: 'daily' | 'monthly';
}

export function DailyReportDialog({ open, onOpenChange, reportType }: DailyReportDialogProps) {
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [startTimeValue, setStartTimeValue] = useState<string>("00:00");
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [endTimeValue, setEndTimeValue] = useState<string>("00:00");
    const [meterNumber, setMeterNumber] = useState('');
    const [showTable, setShowTable] = useState(false);
    const [startDateOpen, setStartDateOpen] = useState(false);
    const [endDateOpen, setEndDateOpen] = useState(false);

    const handleProceed = () => {
        setShowTable(true);
    };

    const handleCancel = () => {
        if (showTable) {
            setShowTable(false);
        } else {
            onOpenChange(false);
        }
    };

    const dialogClassNames = showTable
        ? 'bg-white w-full max-w-[1000px] h-fit p-6 overflow-auto'
        : 'bg-white h-fit w-full max-w-lg';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={dialogClassNames}>
                <DialogHeader>
                    <DialogTitle>{reportType === 'monthly' ? 'Monthly Report' : 'Daily Report'}</DialogTitle>
                </DialogHeader>
                {!showTable ? (
                    <>
                        <div className="grid gap-4 py-4">
                            <div className="flex flex-col md:flex-row items-center gap-4">
                                <div className="flex-1 w-full space-y-4">
                                    <Label htmlFor="start-date" className="text-left">
                                        Start Date
                                    </Label>
                                    <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant='outline'
                                                className={cn(
                                                    'w-full justify-start text-left font-normal border-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500/50',
                                                    !startDate && 'text-muted-foreground'
                                                )}
                                            >
                                                <CalendarIcon size={14} className="mr-2 h-4 w-4" />
                                                {startDate ? format(startDate, "yyyy-MM-dd HH:mm") : <span>Select Date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 bg-white border-none" align="start">
                                            <SimplifiedCalendar
                                                selected={startDate}
                                                timeValue={startTimeValue}
                                                onSelect={setStartDate}
                                                onTimeChange={setStartTimeValue}
                                                onClose={() => setStartDateOpen(false)}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="flex-1 w-full space-y-4">
                                    <Label htmlFor="end-date" className="text-left">
                                        End Date
                                    </Label>
                                    <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant='outline'
                                                className={cn(
                                                    'w-full justify-start text-left font-normal border-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500/50',
                                                    !endDate && 'text-muted-foreground'
                                                )}
                                            >
                                                <CalendarIcon size={14} className="mr-2 h-4 w-4" />
                                                {endDate ? format(endDate, "yyyy-MM-dd HH:mm") : <span>Select Date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 bg-white border-none" align="start">
                                            <SimplifiedCalendar
                                                selected={endDate}
                                                timeValue={endTimeValue}
                                                onSelect={setEndDate}
                                                onTimeChange={setEndTimeValue}
                                                onClose={() => setEndDateOpen(false)}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 items-center gap-2">
                                <Label htmlFor="meter-number" className="text-left">
                                    Meter Number
                                </Label>
                                <Select onValueChange={setMeterNumber}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Enter Meter Number" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="6212026559">6212026559</SelectItem>
                                        <SelectItem value="6212456987">6212456987</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex justify-between space-x-2">
                            <Button
                                variant="outline"
                                onClick={handleCancel}
                                className='border-[#161CCA] text-[#161CCA] cursor-pointer'
                            >
                                Cancel
                            </Button>
                            <Button
                                className='bg-[#161CCA] text-white border-none cursor-pointer font-medium py-2 px-4'
                                onClick={handleProceed}
                                disabled={!startDate || !endDate || !meterNumber}
                            >
                                Proceed
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <DialogContent style={{ maxWidth: "60vw", background: "white", overflow: "auto", padding: "1.5rem" }}>
                            <DailyReportTable />
                            <div className="flex justify-between space-x-2 mt-4">
                                <Button
                                    variant="outline"
                                    size={"lg"}
                                    className='border-[#161CCA] text-[#161CCA] cursor-pointer'
                                    onClick={handleCancel}>
                                    Back
                                </Button>
                                <Button
                                    size={"lg"}
                                    className='bg-[#161CCA] text-white border-none cursor-pointer font-medium py-2 px-4'
                                >
                                    Export
                                </Button>
                            </div>
                        </DialogContent>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
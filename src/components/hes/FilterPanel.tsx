/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
import React, { useState } from 'react';
import { ChevronDown, Building2, Zap, Grid2X2, Wrench, Database, Lightbulb } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

type MeterId = '62124022443' | '62124569871' | '62224029918' | '62224039487' | '62124095803' | '62124023359' | '62124027822';
type ReadingKey = string;

interface HierarchyOption {
    value: string;
    label: string;
    icon: React.ComponentType<{ size?: number }>;
}

interface UnitOption {
    value: string;
    label: string;
}

interface MeterOption {
    value: string;
    label: string;
}

interface ReadingOption {
    label: string;
    children: { value: string; label: string }[];
}

interface FilterPanelProps {
    onRun: (filters: {
        hierarchy: string;
        unit: string;
        meters: MeterId[];
        reading: ReadingKey[];
    }) => void;
}

const hierarchyOptions: HierarchyOption[] = [
    { value: 'region', label: 'Region', icon: Grid2X2 },
    { value: 'business-hub', label: 'Business Hub', icon: Building2 },
    { value: 'service-centre', label: 'Service Centre', icon: Wrench },
    { value: 'substation', label: 'Substation', icon: Database },
    { value: 'feeder-line', label: 'Feeder Line', icon: Zap },
    { value: 'dss', label: 'Distribution Substation (DSS)', icon: Lightbulb },
];

const unitOptions: UnitOption[] = [
    { value: 'molete', label: 'Molete' },
    { value: 'ojoo', label: 'Ojoo' },
    { value: 'ibadan', label: 'Ibadan' },
];

const metersOptions: MeterOption[] = [
    { value: 'all-meters', label: 'All Meters' },
    { value: '62124022443', label: '62124022443' },
    { value: '62124569871', label: '62124569871' },
    { value: '62224029918', label: '62224029918' },
    { value: '62224039487', label: '62224039487' },
    { value: '62124095803', label: '62124095803' },
    { value: '62124023359', label: '62124023359' },
    { value: '62124027822', label: '62124027822' },
];

const readingOptions: ReadingOption[] = [
    {
        label: 'Product Information',
        children: [
            { value: 'meter-logical-device-name', label: 'Meter Logical Device Name' },
            { value: 'meter-serial-number', label: 'Meter Serial Number' },
            { value: 'meter-hardware-version', label: 'Meter Hardware Version' },
            { value: 'meter-firmware-version', label: 'Meter Firmware Version' },
            { value: 'meter-firmware-checksum', label: 'Meter Firmware Checksum' },
        ],
    },
    {
        label: 'Clock',
        children: [
            { value: 'clock object', label: 'Clock Object' },
        ],
    },
    {
        label: 'Energy',
        children: [
            { value: 'Total absolute cumulative active energy register', label: 'Total absolute cumulative active energy register' },
            { value: 'T1 absolute cumulative active energy register', label: 'T1 absolute cumulative active energy register' },
            { value: 'T3 absolute cumulative active energy register', label: 'T3 absolute cumulative active energy register' },
            { value: 'T4 absolute cumulative active energy register', label: 'T4 absolute cumulative active energy register' },
            { value: 'Total import active energy register', label: 'Total import active energy register' },
            { value: 'T1 import active energy register', label: 'T1 import active energy register' },
            { value: 'T2 import active energy register', label: 'T2 import active energy register' },
            { value: 'T3 import active energy register', label: 'T3 import active energy register' },
            { value: 'T4 import active energy register', label: 'T4 import active energy register' },
            { value: 'Total export active energy register', label: 'Total export active energy register' },
            { value: 'T1 export active energy register', label: 'T1 export active energy register' },
            { value: 'T2 export active energy register', label: 'T2 export active energy register' },
            { value: 'T3 export active energy register', label: 'T3 export active energy register' },
            { value: 'Total import reactive energy register', label: 'Total import reactive energy register' },
            { value: 'T1 import reactive energy register', label: 'T1 import reactive energy register' },
            { value: 'T2 import reactive energy register', label: 'T2 import reactive energy register' },
            { value: 'T3 import reactive energy register', label: 'T3 import reactive energy register' },
            { value: 'T4 import reactive energy register', label: 'T4 import reactive energy register' },
            { value: 'Total QI reactive energy register', label: 'Total QI reactive energy register' },
            { value: 'Total QII reactive energy register', label: 'Total QII reactive energy register' },
            { value: 'Total QIII reactive energy register', label: 'Total QIII reactive energy register' },
            { value: 'Total QIV reactive energy register', label: 'Total QIV reactive energy register' },
            { value: 'Total import apparent energy register', label: 'Total import apparent energy register' },
            { value: 'Total export apparent energy register', label: 'Total export apparent energy register' },
        ],
    },
    {
        label: 'Maximum Demand',
        children: [
            { value: 'Total import active maximum demand register', label: 'Total import active maximum demand register' },
            { value: 'T1 import active maximum demand register', label: 'T1 import active maximum demand register' },
            { value: 'T2 import active maximum demand register', label: 'T2 import active maximum demand register' },
            { value: 'T3 import active maximum demand register', label: 'T3 import active maximum demand register' },
            { value: 'T4 import active maximum demand register', label: 'T4 import active maximum demand register' },
            { value: 'Total export active maximum demand register', label: 'Total export active maximum demand register' },
            { value: 'T1 export active maximum demand register', label: 'T1 export active maximum demand register' },
            { value: 'T2 export active maximum demand register', label: 'T2 export active maximum demand register' },
            { value: 'T3 export active maximum demand register', label: 'T3 export active maximum demand register' },
            { value: 'T4 export active maximum demand register', label: 'T4 export active maximum demand register' },
            { value: 'Total import reactive maximum demand register', label: 'Total import reactive maximum demand register' },
            { value: 'T1 import reactive maximum demand register', label: 'T1 import reactive maximum demand register' },
            { value: 'T2 import reactive maximum demand register', label: 'T2 import reactive maximum demand register' },
            { value: 'T3 import reactive maximum demand register', label: 'T3 import reactive maximum demand register' },
            { value: 'T4 import reactive maximum demand register', label: 'T4 import reactive maximum demand register' },
            { value: 'Total export reactive maximum demand register', label: 'Total export reactive maximum demand register' },
            { value: 'T1 export reactive maximum demand register', label: 'T1 export reactive maximum demand register' },
            { value: 'T2 export reactive maximum demand register', label: 'T2 export reactive maximum demand register' },
            { value: 'T3 export reactive maximum demand register', label: 'T3 export reactive maximum demand register' },
            { value: 'T4 export reactive maximum demand register', label: 'T4 export reactive maximum demand register' },
        ],
    },
    {
        label: 'Instantaneous',
        children: [
            { value: 'Frequency', label: 'Frequency' },
            { value: 'Sum Li import power factor', label: 'Sum Li import power factor' },
            { value: 'Sum Li Active power (abs(QI+QIV)+abs(QII+QIII))', label: 'Sum Li Active power (abs(QI+QIV)+abs(QII+QIII))' },
            { value: 'Sum Li Active power+ ', label: 'Sum Li Active power+ ' },
            { value: 'Sum Li Active power- ', label: 'Sum Li Active power- ' },
            { value: 'Sum Li Reactive power+ ', label: 'Sum Li Reactive power+ ' },
            { value: 'Sum Li Reactive power- ', label: 'Sum Li Reactive power- ' },
            { value: 'Sum Li Apparent power+ ', label: 'Sum Li Apparent power+ ' },
            { value: 'Sum Li Apparent power- ', label: 'Sum Li Apparent power- ' },
            { value: 'L1 Current ', label: 'L1 Current ' },
            { value: 'L1 Voltage ', label: 'L1 Voltage ' },
            { value: 'L1 import power factor ', label: 'L1 import power factor ' },
            { value: 'L1 Active power+  ', label: 'L1 Active power+  ' },
            { value: 'L1 Reactive power+', label: 'L1 Reactive power+' },
            { value: 'L1 Apparent power+ ', label: 'L1 Apparent power+ ' },
            { value: 'L1 Current harmonic THD(%) ', label: 'L1 Current harmonic THD(%) ' },
            { value: 'L1 Voltage harmonic THD(%) ', label: 'L1 Voltage harmonic THD(%) ' },
            { value: 'L2 Current ', label: 'L2 Current ' },
            { value: 'L2 Voltage ', label: 'L2 Voltage ' },
            { value: 'L2 import power factor ', label: 'L2 import power factor ' },
            { value: 'L2 Active power+ ', label: 'L2 Active power+ ' },
            { value: 'L2 Reactive power+ ', label: 'L2 Reactive power+ ' },
            { value: 'L2 Apparent power+ ', label: 'L2 Apparent power+ ' },
            { value: 'L2 Current harmonic THD(%)', label: 'L2 Current harmonic THD(%)' },
            { value: 'L2 Voltage harmonic THD(%)', label: 'L2 Voltage harmonic THD(%)' },
            { value: 'L3 Current', label: 'L3 Current' },
            { value: 'L3 Voltage', label: 'L3 Voltage' },
            { value: 'L3 import power factor', label: 'L3 import power factor' },
            { value: 'L3 Active power+ ', label: 'L3 Active power+ ' },
            { value: 'L3 Reactive power+ ', label: 'L3 Reactive power+ ' },
            { value: 'L3 Apparent power+ ', label: 'L3 Apparent power+ ' },
            { value: 'L3 Current harmonic THD(%)', label: 'L3 Current harmonic THD(%)' },
            { value: 'L3 Voltage harmonic THD(%)', label: 'L3 Voltage harmonic THD(%)' },
            { value: 'Neutral Current', label: 'Neutral Current' },
            { value: 'Phase Angle of U(L2) - U(L1)', label: 'Phase Angle of U(L2) - U(L1)' },
            { value: 'Phase Angle of U(L3) - U(L1)', label: 'Phase Angle of U(L3) - U(L1)' },
            { value: 'Phase Angle of U(L2) - U(L3)', label: 'Phase Angle of U(L2) - U(L3)' },
            { value: 'Phase Angle of U(L1) - I(L1)', label: 'Phase Angle of U(L1) - I(L1)' },
            { value: 'Phase Angle of U(L2) - I(L2)', label: 'Phase Angle of U(L2) - I(L2)' },
            { value: 'Phase Angle of U(L3) - I(L3)', label: 'Phase Angle of U(L3) - I(L3)' },
        ],
    },
    {
        label: 'Event count',
        children: [
            { value: 'Counter of demand reset', label: 'Counter of demand reset' },
            { value: 'Counter of meter cover open', label: 'Counter of meter cover open' },
            { value: 'Counter of terminal cover open', label: 'Counter of terminal cover open' },
            { value: 'Counter of strong DC magnetic field', label: 'Counter of strong DC magnetic field' },
        ],
    },
    {
        label: 'Relay',
        children: [
            { value: 'Control mode', label: 'Control mode' },
            { value: 'relay state', label: 'relay state' },
            { value: 'control state', label: 'control state' },
            { value: 'Disconnect', label: 'Disconnect' },
            { value: 'Connect', label: 'Connect' },
        ],
    },
    {
        label: 'Daily Billing',
        children: [
            { value: 'Daily Billing Channel ', label: 'Daily Billing Channel ' },
            { value: 'Date_time of Daily Billing', label: 'Date_time of Daily Billing' },
        ],
    },
    {
        label: 'Monthly Billing',
        children: [
            { value: 'Monthly Billing Channel', label: 'Monthly Billing Channel' },
            { value: 'Date_time of Monthly Billing', label: 'Date_time of Monthly Billing' },
        ],
    },
    {
        label: 'Event',
        children: [
            { value: 'Standard Event Logs', label: 'Standard Event Logs' },
            { value: 'Fraud Event Logs', label: 'Fraud Event Logs' },
            { value: 'Control Event Logs', label: 'Control Event Logs' },
            { value: 'Recharge Token Event Logs', label: 'Recharge Token Event Logs' },
            { value: 'Power Grid Event Logs', label: 'Power Grid Event Logs' },
            { value: 'ManageToken Event Logs', label: 'ManageToken Event Logs' },
        ],
    },
    {
        label: 'Load Profile',
        children: [
            { value: 'Load profile 1', label: 'Load profile 1' },
            { value: 'Load profile 2', label: 'Load profile 2' },
        ],
    },
    {
        label: 'GPRS Modem Setup',
        children: [
            { value: 'GPRS modem setup (APN)', label: 'GPRS modem setup (APN)' },
            { value: 'Auto connect setup (IP & Port)', label: 'Auto connect setup (IP & Port)' },
        ],
    },
    {
        label: 'Prepayment Energy Registers',
        children: [
            { value: 'Remaining Credit Amount', label: 'Remaining Credit Amount' },
            { value: 'Total Recharged Amount', label: 'Total Recharged Amount' },
        ],
    },
    {
        label: 'CT&PT Ratio',
        children: [
            { value: 'Numerator of CT ratio', label: 'Numerator of CT ratio' },
            { value: 'Denominator of CT ratio', label: 'Denominator of CT ratio' },
            { value: 'Numerator of PT ratio', label: 'Numerator of PT ratio' },
            { value: 'Denominator of PT ratio', label: 'Denominator of PT ratio' },
        ],
    },
    {
        label: 'Threshold Parameters',
        children: [
            { value: 'Threshold Parameters', label: 'Threshold Parameters' },
            { value: 'Time threshold of voltage sag', label: 'Time threshold of voltage sag' },
            { value: 'Threshold of voltage swell', label: 'Threshold of voltage swell' },
            { value: 'Time threshold of voltage swell', label: 'Time threshold of voltage swell' },
            { value: 'Threshold of over loading', label: 'Threshold of over loading' },
            { value: 'Time threshold of over loading', label: 'Time threshold of over loading' },
            { value: 'Time threshold of over loading end', label: 'Time threshold of over loading end' },
            { value: 'Thereshold of meter high temperature', label: 'Thereshold of meter high temperature' },
            { value: 'Time thereshold of meter high temperature recover', label: 'Time thereshold of meter high temperature recover' },
        ],
    },
];

export function FilterPanel({ onRun }: FilterPanelProps) {
    const [hierarchy, setHierarchy] = useState<string>('');
    const [unit, setUnit] = useState<string>('');
    const [meters, setMeters] = useState<MeterId[]>([]);
    const [reading, setReading] = useState<ReadingKey[]>([]);

    const getHierarchyLabel = () => {
        return hierarchy ? hierarchyOptions.find(o => o.value === hierarchy)?.label ?? 'Select Hierarchy' : 'Select Hierarchy';
    };

    const getUnitLabel = () => {
        return unit ? unitOptions.find(o => o.value === unit)?.label ?? 'Enter Unit' : 'Enter Unit';
    };

    const handleMetersSelect = (meterValue: string) => {
        if (meterValue === 'all-meters') {
            const allMeters = metersOptions.filter(o => o.value !== 'all-meters').map(o => o.value as MeterId);
            setMeters(meters.length === allMeters.length ? [] : allMeters);
        } else {
            setMeters(prevMeters =>
                prevMeters.includes(meterValue as MeterId)
                    ? prevMeters.filter(id => id !== meterValue)
                    : [...prevMeters, meterValue as MeterId]
            );
        }
    };

    const getMetersLabel = () => {
        if (meters.length === 0) return 'Enter Meters';
        if (meters.length === 1) return metersOptions.find(o => o.value === meters[0])?.label ?? '';
        return `${meters.length} item(s) selected`;
    };

    const handleReadingSelect = (readingValue: string) => {
        setReading(prevReading =>
            prevReading.includes(readingValue as ReadingKey)
                ? prevReading.filter(id => id !== readingValue)
                : [...prevReading, readingValue as ReadingKey]
        );
    };

    const handleGroupSelect = (groupLabel: string, isChecked: boolean) => {
        const group = readingOptions.find(g => g.label === groupLabel);
        if (group) {
            const childrenValues = group.children.map(child => child.value as ReadingKey);
            setReading(prevReading =>
                isChecked
                    ? [...new Set([...prevReading, ...childrenValues])]
                    : prevReading.filter(r => !childrenValues.includes(r))
            );
        }
    };

    const isGroupChecked = (groupLabel: string) => {
        const group = readingOptions.find(g => g.label === groupLabel);
        if (group) {
            const childrenValues = group.children.map(child => child.value as ReadingKey);
            return childrenValues.every(value => reading.includes(value));
        }
        return false;
    };

    const getReadingLabel = () => {
        if (reading.length === 0) return 'Select Reading';
        if (reading.length === 1) return readingOptions.flatMap(g => g.children || []).find(o => o.value === reading[0])?.label ?? '';
        return `${reading.length} item(s) selected`;
    };

    const isFormComplete = !!hierarchy && !!unit && meters.length > 0 && reading.length > 0;

    const handleRunClick = () => {
        if (isFormComplete) {
            onRun({ hierarchy, unit, meters, reading });
        }
    };

    return (
        <div className="grid grid-cols-1 w-full sm:grid-cols-5 gap-6 items-end">
            <div>
                <Label htmlFor="hierarchy" className="block text-base font-medium text-gray-700 mb-2">
                    Hierarchy <span className="text-red-500">*</span>
                </Label>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full h-12 text-base justify-between text-left">
                            <span>{getHierarchyLabel()}</span>
                            <ChevronDown size={16} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                        <DropdownMenuRadioGroup value={hierarchy} onValueChange={setHierarchy}>
                            {hierarchyOptions.map(option => (
                                <DropdownMenuRadioItem
                                    key={option.value}
                                    value={option.value}
                                    className="text-base py-2"
                                >
                                    <div className="flex items-center gap-3">
                                        <option.icon size={14} />
                                        {option.label}
                                    </div>
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div>
                <Label htmlFor="unit" className="block text-base font-medium text-gray-700 mb-2">
                    Unit <span className="text-red-500">*</span>
                </Label>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full h-12 text-base justify-between text-left">
                            <span>{getUnitLabel()}</span>
                            <ChevronDown size={16} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                        <DropdownMenuRadioGroup value={unit} onValueChange={setUnit}>
                            {unitOptions.map(option => (
                                <DropdownMenuRadioItem
                                    key={option.value}
                                    value={option.value}
                                    className="text-base py-2"
                                >
                                    {option.label}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div>
                <Label htmlFor="meters" className="block text-base font-medium text-gray-700 mb-2">
                    Meters <span className="text-red-500">*</span>
                </Label>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full h-12 text-base justify-between text-left">
                            <span>{getMetersLabel()}</span>
                            <ChevronDown size={16} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                        <div
                            className="flex items-center justify-between gap-3 text-base py-2 px-2 cursor-pointer"
                            onClick={() => handleMetersSelect('all-meters')}
                        >
                            <span>All Meters</span>
                            <Checkbox
                                checked={meters.length === metersOptions.length - 1}
                                className="h-5 w-5 border-gray-300 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                            />
                        </div>
                        {metersOptions.filter(o => o.value !== 'all-meters').map(option => (
                            <div
                                key={option.value}
                                className="flex items-center justify-between gap-3 text-base py-2 px-2 cursor-pointer"
                                onClick={() => handleMetersSelect(option.value)}
                            >
                                <span>{option.label}</span>
                                <Checkbox
                                    checked={meters.includes(option.value as MeterId)}
                                    className="h-5 w-5 border-gray-300 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                                />
                            </div>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div>
                <Label htmlFor="reading" className="block text-base font-medium text-gray-700 mb-2">
                    Realtime Reading <span className="text-red-500">*</span>
                </Label>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full h-12 text-base justify-between text-left">
                            <span>{getReadingLabel()}</span>
                            <ChevronDown size={16} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                        <Accordion type="multiple" className="w-full" defaultValue={readingOptions.map(g => g.label)}>
                            {readingOptions.map((group, index) => (
                                <AccordionItem key={index} value={group.label} className='border-b-gray-200'>
                                    <AccordionTrigger
                                        className="flex items-center justify-between text-base font-semibold px-2 no-underline hover:no-underline w-full"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="flex items-center justify-between gap-3 w-full">
                                            <span>
                                                {group.label}
                                            </span>
                                            <Checkbox
                                                checked={isGroupChecked(group.label)}
                                                onCheckedChange={(checked) => handleGroupSelect(group.label, checked as boolean)}
                                                className="h-5 w-5 border-gray-300 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                                            />
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-2">
                                        {group.children.map(option => (
                                            <div
                                                key={option.value}
                                                className="flex items-center justify-between gap-3 text-base py-2 pl-4 cursor-pointer"
                                                onClick={() => handleReadingSelect(option.value)}
                                            >
                                                <span>{option.label}</span>
                                                <Checkbox
                                                    checked={reading.includes(option.value as ReadingKey)}
                                                    className="h-5 w-5 border-gray-300 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                                                />
                                            </div>
                                        ))}
                                        {index < readingOptions.length - 1 && (
                                            <div className="border-b border-gray-200 my-2"></div>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="sm:mt-0 mt-6">
                <Label className="block text-base font-medium text-transparent mb-2">.</Label>
                <Button
                    onClick={handleRunClick}
                    disabled={!isFormComplete}
                    className={`w-full h-12 text-base ${isFormComplete ? 'bg-[#161cca]' : 'bg-[#161cca]/50 cursor-not-allowed'} text-white`}
                >
                    Run
                </Button>
            </div>
        </div>
    );
}
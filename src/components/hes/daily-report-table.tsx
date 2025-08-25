// components/DailyReportTable.tsx
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';

const data = [
    {
        sn: '01',
        meterNo: '6212556846',
        region: 'Ogun',
        businessUnit: 'Ibafo',
        serviceCenter: 'Olowotedo',
        feeder: 'Ijeun',
        time: '2025-07-28 00:00:00',
        totalActiveEnergy: '1000',
        totalActiveEnergyT1: '316.4',
        totalActiveEnergyT2: '316.4',
        totalActiveEnergyT3: '316.4',
        totalActiveEnergyT4: '316.4',
        importReactiveEnergy: '0',
        exportReactiveEnergy: '0',
        reactiveEnergyQ1: '0',
        reactiveEnergyQ2: '0',
        reactiveEnergyQ3: '0',
        reactiveEnergyQ4: '0',
        importApparentEnergy: '0',
        exportApparentEnergy: '0',
    },
    {
        sn: '02',
        meterNo: '6212556846',
        region: 'Ogun',
        businessUnit: 'Ibafo',
        serviceCenter: 'Olowotedo',
        feeder: 'Ijeun',
        time: '2025-07-27 00:00:00',
        totalActiveEnergy: '949',
        totalActiveEnergyT1: '316.4',
        totalActiveEnergyT2: '316.4',
        totalActiveEnergyT3: '316.4',
        totalActiveEnergyT4: '316.4',
        importReactiveEnergy: '0',
        exportReactiveEnergy: '0',
        reactiveEnergyQ1: '0',
        reactiveEnergyQ2: '0',
        reactiveEnergyQ3: '0',
        reactiveEnergyQ4: '0',
        importApparentEnergy: '0',
        exportApparentEnergy: '0',
    },
    // Add more rows based on the screenshot, following the pattern
    // For brevity, only two rows shown; extend as needed
];

export function DailyReportTable() {
    return (
        <div className="overflow-x-auto border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>S/N</TableHead>
                        <TableHead>Meter No.</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead>Business Unit</TableHead>
                        <TableHead>Service Center</TableHead>
                        <TableHead>Feeder</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Total Active Energy</TableHead>
                        <TableHead>Total Active Energy T1</TableHead>
                        <TableHead>Total Active Energy T2</TableHead>
                        <TableHead>Total Active Energy T3</TableHead>
                        <TableHead>Total Active Energy T4</TableHead>
                        <TableHead>Import Reactive Energy</TableHead>
                        <TableHead>Export Reactive Energy</TableHead>
                        <TableHead>Reactive Energy Q1</TableHead>
                        <TableHead>Reactive Energy Q2</TableHead>
                        <TableHead>Reactive Energy Q3</TableHead>
                        <TableHead>Reactive Energy Q4</TableHead>
                        <TableHead>Import Apparent Energy</TableHead>
                        <TableHead>Export Apparent Energy</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row) => (
                        <TableRow key={row.sn}>
                            <TableCell>{row.sn}</TableCell>
                            <TableCell>{row.meterNo}</TableCell>
                            <TableCell>{row.region}</TableCell>
                            <TableCell>{row.businessUnit}</TableCell>
                            <TableCell>{row.serviceCenter}</TableCell>
                            <TableCell>{row.feeder}</TableCell>
                            <TableCell>{row.time}</TableCell>
                            <TableCell>{row.totalActiveEnergy}</TableCell>
                            <TableCell>{row.totalActiveEnergyT1}</TableCell>
                            <TableCell>{row.totalActiveEnergyT2}</TableCell>
                            <TableCell>{row.totalActiveEnergyT3}</TableCell>
                            <TableCell>{row.totalActiveEnergyT4}</TableCell>
                            <TableCell>{row.importReactiveEnergy}</TableCell>
                            <TableCell>{row.exportReactiveEnergy}</TableCell>
                            <TableCell>{row.reactiveEnergyQ1}</TableCell>
                            <TableCell>{row.reactiveEnergyQ2}</TableCell>
                            <TableCell>{row.reactiveEnergyQ3}</TableCell>
                            <TableCell>{row.reactiveEnergyQ4}</TableCell>
                            <TableCell>{row.importApparentEnergy}</TableCell>
                            <TableCell>{row.exportApparentEnergy}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex justify-between items-center p-4 border-t">
                <Select defaultValue="10">
                    <SelectTrigger className="w-[100px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                    </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">1-10 of 10 row</p>
                <div className="space-x-2">
                    <Button variant="outline" disabled>Previous</Button>
                    <Button variant="outline" disabled>Next</Button>
                </div>
            </div>
        </div>
    );
}
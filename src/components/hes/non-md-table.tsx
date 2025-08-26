// components/hes/non-md-table.tsx
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const data = [
    {
        sn: '01',
        meterNo: '6212456987',
        category: 'Prepaid',
        status: 'Offline',
        lastSync: '1:32am',
        tamperState: 'No Tamper',
        tamperSync: '2:30am',
        relayControl: 'Disconnected',
        relaySync: '2:30am',
    },
    {
        sn: '02',
        meterNo: '6212456987',
        category: 'PostPaid',
        status: 'Online',
        lastSync: '1:00am',
        tamperState: 'Tamper Detected',
        tamperSync: '1:32am',
        relayControl: 'Disconnected',
        relaySync: '1:32am',
    },
    {
        sn: '03',
        meterNo: '6212456987',
        category: 'PostPaid',
        status: 'Offline',
        lastSync: '1:00am',
        tamperState: 'No Tamper',
        tamperSync: '1:00am',
        relayControl: 'Disconnected',
        relaySync: '1:00am',
    },
    {
        sn: '04',
        meterNo: '6212456987',
        category: 'Prepaid',
        status: 'Online',
        lastSync: '1:00am',
        tamperState: 'No Tamper',
        tamperSync: '1:00am',
        relayControl: 'Connected',
        relaySync: '1:00am',
    },
    {
        sn: '05',
        meterNo: '6212456987',
        category: 'PostPaid',
        status: 'Online',
        lastSync: '1:00am',
        tamperState: 'No Tamper',
        tamperSync: '1:00am',
        relayControl: 'Connected',
        relaySync: '1:00am',
    },
    {
        sn: '06',
        meterNo: '6212456987',
        category: 'Prepaid',
        status: 'Offline',
        lastSync: '1:00am',
        tamperState: 'No Tamper',
        tamperSync: '1:00am',
        relayControl: 'Connected',
        relaySync: '1:00am',
    },
    {
        sn: '07',
        meterNo: '6212456987',
        category: 'Prepaid',
        status: 'Online',
        lastSync: '1:00am',
        tamperState: 'No Tamper',
        tamperSync: '1:00am',
        relayControl: 'Connected',
        relaySync: '1:00am',
    },
    {
        sn: '08',
        meterNo: '6212456987',
        category: 'PostPaid',
        status: 'Online',
        lastSync: '1:00am',
        tamperState: 'No Tamper',
        tamperSync: '1:00am',
        relayControl: 'Connected',
        relaySync: '1:00am',
    },
    {
        sn: '09',
        meterNo: '6212456987',
        category: 'Prepaid',
        status: 'Online',
        lastSync: '1:00am',
        tamperState: 'No Tamper',
        tamperSync: '1:00am',
        relayControl: 'Connected',
        relaySync: '1:00am',
    },
    {
        sn: '10',
        meterNo: '6212456987',
        category: 'PostPaid',
        status: 'Online',
        lastSync: '1:00am',
        tamperState: 'No Tamper',
        tamperSync: '1:00am',
        relayControl: 'Connected',
        relaySync: '1:00am',
    },
];

export function NonMDTable() {
    return (
        <div className="rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>S/N</TableHead>
                        <TableHead>Meter No.</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Sync</TableHead>
                        <TableHead>Tamper State</TableHead>
                        <TableHead>Tamper Sync</TableHead>
                        <TableHead>Relay Control</TableHead>
                        <TableHead>Relay Sync</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row) => (
                        <TableRow key={row.sn}>
                            <TableCell>
                                <input type="checkbox" className="mr-2" />
                                {row.sn}
                            </TableCell>
                            <TableCell>{row.meterNo}</TableCell>
                            <TableCell>{row.category}</TableCell>
                            <TableCell>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs ${row.status === 'Online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}
                                >
                                    {row.status}
                                </span>
                            </TableCell>
                            <TableCell>{row.lastSync}</TableCell>
                            <TableCell>{row.tamperState}</TableCell>
                            <TableCell>{row.tamperSync}</TableCell>
                            <TableCell>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs ${row.relayControl === 'Connected' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                                        }`}
                                >
                                    {row.relayControl}
                                </span>
                            </TableCell>
                            <TableCell>{row.relaySync}</TableCell>
                            <TableCell>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex justify-between items-center p-4">
                <Select defaultValue="10">
                    <SelectTrigger className="w-[100px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
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
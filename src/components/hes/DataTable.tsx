import React from 'react';
import { RotateCw } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card } from '../ui/card';
import { LoadingAnimation } from '@/components/ui/loading-animation';

interface MeterData {
    [key: string]: string;
    meter: string;
    time: string;
}

interface DataTableProps {
    data: MeterData[];
    reading: string[];
    loading: boolean;
}

const readingLabels: Record<string, string> = {
    'meter-logical-device-name': 'Meter Logical Device Name',
    'meter-serial-number': 'Meter Serial Number',
    'meter-hardware-version': 'Meter Hardware Version',
    'meter-firmware-version': 'Meter Firmware Version',
    'meter-firmware-checksum': 'Meter Firmware Checksum',
    'clock object': 'Clock Object',
    'Total absolute cumulative active energy register': 'Total absolute cumulative active energy register',
    'T1 absolute cumulative active energy register': 'T1 absolute cumulative active energy register',
    'T3 absolute cumulative active energy register': 'T3 absolute cumulative active energy register',
    'T4 absolute cumulative active energy register': 'T4 absolute cumulative active energy register',
    'Total import active energy register': 'Total import active energy register',
    'T1 import active energy register': 'T1 import active energy register',
    'T2 import active energy register': 'T2 import active energy register',
    'T3 import active energy register': 'T3 import active energy register',
    'T4 import active energy register': 'T4 import active energy register',
    'Total export active energy register': 'Total export active energy register',
    'T1 export active energy register': 'T1 export active energy register',
    'T2 export active energy register': 'T2 export active energy register',
    'T3 export active energy register': 'T3 export active energy register',
    'Total import reactive energy register': 'Total import reactive energy register',
    'T1 import reactive energy register': 'T1 import reactive energy register',
    'T2 import reactive energy register': 'T2 import reactive energy register',
    'T3 import reactive energy register': 'T3 import reactive energy register',
    'T4 import reactive energy register': 'T4 import reactive energy register',
    'Total QI reactive energy register': 'Total QI reactive energy register',
    'Total QII reactive energy register': 'Total QII reactive energy register',
    'Total QIII reactive energy register': 'Total QIII reactive energy register',
    'Total QIV reactive energy register': 'Total QIV reactive energy register',
    'Total import apparent energy register': 'Total import apparent energy register',
    'Total export apparent energy register': 'Total export apparent energy register',
    'Total import active maximum demand register': 'Total import active maximum demand register',
    'T1 import active maximum demand register': 'T1 import active maximum demand register',
    'T2 import active maximum demand register': 'T2 import active maximum demand register',
    'T3 import active maximum demand register': 'T3 import active maximum demand register',
    'T4 import active maximum demand register': 'T4 import active maximum demand register',
    'Total export active maximum demand register': 'Total export active maximum demand register',
    'T1 export active maximum demand register': 'T1 export active maximum demand register',
    'T2 export active maximum demand register': 'T2 export active maximum demand register',
    'T3 export active maximum demand register': 'T3 export active maximum demand register',
    'T4 export active maximum demand register': 'T4 export active maximum demand register',
    'Total import reactive maximum demand register': 'Total import reactive maximum demand register',
    'T1 import reactive maximum demand register': 'T1 import reactive maximum demand register',
    'T2 import reactive maximum demand register': 'T2 import reactive maximum demand register',
    'T3 import reactive maximum demand register': 'T3 import reactive maximum demand register',
    'T4 import reactive maximum demand register': 'T4 import reactive maximum demand register',
    'Total export reactive maximum demand register': 'Total export reactive maximum demand register',
    'T1 export reactive maximum demand register': 'T1 export reactive maximum demand register',
    'T2 export reactive maximum demand register': 'T2 export reactive maximum demand register',
    'T3 export reactive maximum demand register': 'T3 export reactive maximum demand register',
    'T4 export reactive maximum demand register': 'T4 export reactive maximum demand register',
    'Frequency': 'Frequency',
    'Sum Li import power factor': 'Sum Li import power factor',
    'Sum Li Active power (abs(QI+QIV)+abs(QII+QIII))': 'Sum Li Active power (abs(QI+QIV)+abs(QII+QIII))',
    'Sum Li Active power+ ': 'Sum Li Active power+ ',
    'Sum Li Active power- ': 'Sum Li Active power- ',
    'Sum Li Reactive power+ ': 'Sum Li Reactive power+ ',
    'Sum Li Reactive power- ': 'Sum Li Reactive power- ',
    'Sum Li Apparent power+ ': 'Sum Li Apparent power+ ',
    'Sum Li Apparent power- ': 'Sum Li Apparent power- ',
    'L1 Current ': 'L1 Current ',
    'L1 Voltage ': 'L1 Voltage ',
    'L1 import power factor ': 'L1 import power factor ',
    'L1 Active power+ ': 'L1 Active power+ ',
    'L1 Reactive power+': 'L1 Reactive power+',
    'L1 Apparent power+ ': 'L1 Apparent power+ ',
    'L1 Current harmonic THD(%) ': 'L1 Current harmonic THD(%) ',
    'L1 Voltage harmonic THD(%) ': 'L1 Voltage harmonic THD(%) ',
    'L2 Current ': 'L2 Current ',
    'L2 Voltage ': 'L2 Voltage ',
    'L2 import power factor ': 'L2 import power factor ',
    'L2 Active power+ ': 'L2 Active power+ ',
    'L2 Reactive power+ ': 'L2 Reactive power+ ',
    'L2 Apparent power+ ': 'L2 Apparent power+ ',
    'L2 Current harmonic THD(%)': 'L2 Current harmonic THD(%)',
    'L2 Voltage harmonic THD(%)': 'L2 Voltage harmonic THD(%)',
    'L3 Current': 'L3 Current',
    'L3 Voltage': 'L3 Voltage',
    'L3 import power factor': 'L3 import power factor',
    'L3 Active power+ ': 'L3 Active power+ ',
    'L3 Reactive power+ ': 'L3 Reactive power+ ',
    'L3 Apparent power+ ': 'L3 Apparent power+ ',
    'L3 Current harmonic THD(%)': 'L3 Current harmonic THD(%)',
    'L3 Voltage harmonic THD(%)': 'L3 Voltage harmonic THD(%)',
    'Neutral Current': 'Neutral Current',
    'Phase Angle of U(L2) - U(L1)': 'Phase Angle of U(L2) - U(L1)',
    'Phase Angle of U(L3) - U(L1)': 'Phase Angle of U(L3) - U(L1)',
    'Phase Angle of U(L2) - U(L3)': 'Phase Angle of U(L2) - U(L3)',
    'Phase Angle of U(L1) - I(L1)': 'Phase Angle of U(L1) - I(L1)',
    'Phase Angle of U(L2) - I(L2)': 'Phase Angle of U(L2) - I(L2)',
    'Phase Angle of U(L3) - I(L3)': 'Phase Angle of U(L3) - I(L3)',
    'Counter of demand reset': 'Counter of demand reset',
    'Counter of meter cover open': 'Counter of meter cover open',
    'Counter of terminal cover open': 'Counter of terminal cover open',
    'Counter of strong DC magnetic field': 'Counter of strong DC magnetic field',
    'Control mode': 'Control mode',
    'relay state': 'relay state',
    'control state': 'control state',
    'Disconnect': 'Disconnect',
    'Connect': 'Connect',
    'Daily Billing Channel ': 'Daily Billing Channel ',
    'Date_time of Daily Billing': 'Date_time of Daily Billing',
    'Monthly Billing Channel': 'Monthly Billing Channel',
    'Date_time of Monthly Billing': 'Date_time of Monthly Billing',
    'Standard Event Logs': 'Standard Event Logs',
    'Fraud Event Logs': 'Fraud Event Logs',
    'Control Event Logs': 'Control Event Logs',
    'Recharge Token Event Logs': 'Recharge Token Event Logs',
    'Power Grid Event Logs': 'Power Grid Event Logs',
    'ManageToken Event Logs': 'ManageToken Event Logs',
    'Load profile 1': 'Load profile 1',
    'Load profile 2': 'Load profile 2',
    'GPRS modem setup (APN)': 'GPRS modem setup (APN)',
    'Auto connect setup (IP & Port)': 'Auto connect setup (IP & Port)',
    'Remaining Credit Amount': 'Remaining Credit Amount',
    'Total Recharged Amount': 'Total Recharged Amount',
    'Numerator of CT ratio': 'Numerator of CT ratio',
    'Denominator of CT ratio': 'Denominator of CT ratio',
    'Numerator of PT ratio': 'Numerator of PT ratio',
    'Denominator of PT ratio': 'Denominator of PT ratio',
    'Threshold Parameters': 'Threshold Parameters',
    'Time threshold of voltage sag': 'Time threshold of voltage sag',
    'Threshold of voltage swell': 'Threshold of voltage swell',
    'Time threshold of voltage swell': 'Time threshold of voltage swell',
    'Threshold of over loading': 'Threshold of over loading',
    'Time threshold of over loading': 'Time threshold of over loading',
    'Time threshold of over loading end': 'Time threshold of over loading end',
    'Thereshold of meter high temperature': 'Thereshold of meter high temperature',
    'Time thereshold of meter high temperature recover': 'Time thereshold of meter high temperature recover',
};

export function DataTable({ data, reading, loading }: DataTableProps) {
    const dynamicColumns = reading.filter(r => r !== 'meter-serial-number' && r !== 'clock object').map(r => readingLabels[r]);
    const columns = ['S/N', 'Meter Serial Number', 'Time', ...dynamicColumns];

    return (
        <Card className="border-none w-full fixed">
            {/* ✅ Ensure only the table scrolls */}
            <div className="w-full overflow-x-auto">
                <Table className="min-w-max">
                    <TableHeader>
                        <TableRow>
                            {columns.map((col, index) => (
                                <TableHead
                                    key={index}
                                    className="text-base py-4 whitespace-nowrap"
                                >
                                    {col}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center py-8">
                                    <LoadingAnimation variant="spinner" message="Loading meter data..." size="md" />
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((row, index) => (
                                <TableRow key={index} className="text-base">
                                    <TableCell className="py-4 whitespace-nowrap">
                                        {(index + 1).toString().padStart(2, '0')}
                                    </TableCell>
                                    <TableCell className="py-4 whitespace-nowrap">{row.meter}</TableCell>
                                    <TableCell className="py-4 whitespace-nowrap">{row.time}</TableCell>
                                    {reading
                                        .filter(r => r !== 'meter-serial-number' && r !== 'clock object')
                                        .map(r => (
                                            <TableCell key={r} className="py-4 whitespace-nowrap">
                                                {row[r]}
                                            </TableCell>
                                        ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
}

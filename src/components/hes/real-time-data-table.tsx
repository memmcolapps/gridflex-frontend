/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
import React, { useState } from 'react';
import { FilterPanel } from './FilterPanel';
import { DataTable } from './DataTable';

type MeterId = '62124022443' | '62124569871' | '62224029918' | '62224039487' | '62124095803' | '62124023359' | '62124027822';

interface MeterReading {
    [key: string]: string | undefined;
}

type MockData = {
    [key in MeterId]: MeterReading | undefined;
};

interface MeterData {
    [key: string]: string;
    meter: string;
    time: string;
}

const mockData: MockData = {
    '62124022443': {
        'meter-serial-number': '62124022443',
        'meter-logical-device-name': 'LDE106212402243',
        'meter-hardware-version': 'LD103S101-APPO-02.00',
        'meter-firmware-version': '03.03',
        'meter-firmware-checksum': 'LD103S1',
        'clock object': '2025-09-03 12:41:00',
        'Total absolute cumulative active energy register': '1456.78 kWh',
        'T1 absolute cumulative active energy register': '456.12 kWh',
        'Frequency': '50.1 Hz',
        'L1 Voltage ': '230.5 V',
        'L1 Current ': '5.2 A',
        'Remaining Credit Amount': '250.00',
    },
    '62124569871': {
        'meter-serial-number': '62124569871',
        'meter-logical-device-name': 'LDE106212456987',
        'meter-hardware-version': 'LD103S101-APPO-02.00',
        'meter-firmware-version': '03.03',
        'meter-firmware-checksum': 'LD103S1',
        'clock object': '2025-09-03 12:41:00',
        'Total absolute cumulative active energy register': '2345.67 kWh',
        'T1 absolute cumulative active energy register': '789.01 kWh',
        'Frequency': '49.9 Hz',
        'L1 Voltage ': '228.3 V',
        'L1 Current ': '6.1 A',
        'Remaining Credit Amount': '180.50',
    },
    '62224029918': {
        'meter-serial-number': '62224029918',
        'meter-logical-device-name': 'LDE106212402443',
        'meter-hardware-version': 'LD103S101-APPO-02.00',
        'meter-firmware-version': '03.03',
        'meter-firmware-checksum': 'LD103S1',
        'clock object': '2025-09-03 12:41:00',
        'Total absolute cumulative active energy register': '1123.45 kWh',
        'T1 absolute cumulative active energy register': '345.67 kWh',
        'Frequency': '50.0 Hz',
        'L1 Voltage ': '231.0 V',
        'L1 Current ': '4.8 A',
        'Remaining Credit Amount': '300.00',
    },
    '62224039487': {
        'meter-serial-number': '62224039487',
        'meter-logical-device-name': 'LDE106212403948',
        'meter-hardware-version': 'LD103S101-APPO-02.00',
        'meter-firmware-version': '03.03',
        'meter-firmware-checksum': 'LD103S1',
        'clock object': '2025-09-03 12:41:00',
        'Total absolute cumulative active energy register': '1987.65 kWh',
        'T1 absolute cumulative active energy register': '654.32 kWh',
        'Frequency': '50.2 Hz',
        'L1 Voltage ': '229.8 V',
        'L1 Current ': '5.5 A',
        'Remaining Credit Amount': '120.75',
    },
    '62124095803': {
        'meter-serial-number': '62124095803',
        'meter-logical-device-name': 'LDE106212409580',
        'meter-hardware-version': 'LD103S101-APPO-02.00',
        'meter-firmware-version': '03.03',
        'meter-firmware-checksum': 'LD103S1',
        'clock object': '2025-09-03 12:41:00',
        'Total absolute cumulative active energy register': '1678.90 kWh',
        'T1 absolute cumulative active energy register': '567.89 kWh',
        'Frequency': '49.8 Hz',
        'L1 Voltage ': '232.1 V',
        'L1 Current ': '4.9 A',
        'Remaining Credit Amount': '210.00',
    },
    '62124023359': {
        'meter-serial-number': '62124023359',
        'meter-logical-device-name': 'LDE106212402335',
        'meter-hardware-version': 'LD103S101-APPO-02.00',
        'meter-firmware-version': '03.03',
        'meter-firmware-checksum': 'LD103S1',
        'clock object': '2025-09-03 12:41:00',
        'Total absolute cumulative active energy register': '2100.12 kWh',
        'T1 absolute cumulative active energy register': '890.34 kWh',
        'Frequency': '50.3 Hz',
        'L1 Voltage ': '230.0 V',
        'L1 Current ': '5.7 A',
        'Remaining Credit Amount': '95.25',
    },
    '62124027822': {
        'meter-serial-number': '62124027822',
        'meter-logical-device-name': 'LDE106212402782',
        'meter-hardware-version': 'LD103S101-APPO-02.00',
        'meter-firmware-version': '03.03',
        'meter-firmware-checksum': 'LD103S1',
        'clock object': '2025-09-03 12:41:00',
        'Total absolute cumulative active energy register': '1345.67 kWh',
        'T1 absolute cumulative active energy register': '432.10 kWh',
        'Frequency': '49.7 Hz',
        'L1 Voltage ': '231.5 V',
        'L1 Current ': '6.0 A',
        'Remaining Credit Amount': '150.00',
    },
};

export function RealTimeDataTable() {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<MeterData[]>([]);
    const [selectedReading, setSelectedReading] = useState<string[]>([]);

    const handleRun = (filters: {
        hierarchy: string;
        unit: string;
        meters: MeterId[];
        reading: string[];
    }) => {
        setLoading(true);
        setData([]);
        setSelectedReading(filters.reading);
        setTimeout(() => {
            const newData = filters.meters.map(meter => {
                const meterData = mockData[meter] ?? {};
                const row: MeterData = {
                    meter,
                    time: meterData['clock object'] ?? '2025-09-03 16:03:00', // Updated to current time: 04:03 PM WAT, Sep 3, 2025
                };
                filters.reading.forEach(r => {
                    row[r] = meterData[r] ?? 'N/A';
                });
                return row;
            });
            setData(newData);
            setLoading(false);
        }, 2000);
    };

    return (
        <div className="mx-auto max-w-screen overflow-x-hidden px-4 space-y-6">
            <div className="py-8">
                <FilterPanel onRun={handleRun} />
            </div>
            <div className="py-8">
                {(loading || data.length > 0) && (
                    <DataTable data={data} reading={selectedReading} loading={loading} />
                )}
            </div>
        </div>
    );
}
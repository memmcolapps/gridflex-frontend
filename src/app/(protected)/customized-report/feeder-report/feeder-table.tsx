import FeederContainer from "@/components/customized-report/feeder-report/feeder-container";
import FeederTable from "@/components/customized-report/feeder-report/feeder-table";
import { PaginationControls } from "@/components/ui/pagination-controls";
import {
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { useState } from "react";

export default function DailySalesTable() {
    const CUSTOMER_POP = [
        {
            id: 1,
            customerId: '01',
            businessHub: 'Mowe',
            feeder: 'Ijeun',
            feederId: '0123456',
            dssCount: '10',
            population: '100000',
            energyused: '25048890.789',
            prepaid: '12524445.395',
            postpaid: '9393334.046',
            virtual: '9393334.046',
            efficiency: '90%'
        },
        {
            id: 2,
            customerId: '02',
            businessHub: 'Mowe',
            feeder: 'Ijeun',
            feederId: '0123456',
            dssCount: '10',
            population: '100000',
            energyused: '25048890.789',
            prepaid: '12524445.395',
            postpaid: '9393334.046',
            virtual: '9393334.046',
            efficiency: '90%'
        },
        {
            id: 3,
            customerId: '03',
            businessHub: 'Mowe',
            feeder: 'Ijeun',
            feederId: '0123456',
            dssCount: '10',
            population: '100000',
            energyused: '25048890.789',
            prepaid: '12524445.395',
            postpaid: '9393334.046',
            virtual: '9393334.046',
            efficiency: '90%'
        },
        {
            id: 4,
            customerId: '04',
            businessHub: 'Mowe',
            feeder: 'Ijeun',
            feederId: '0123456',
            dssCount: '10',
            population: '100000',
            energyused: '25048890.789',
            prepaid: '12524445.395',
            postpaid: '9393334.046',
            virtual: '9393334.046',
            efficiency: '90%'
        },
        {
            id: 5,
            customerId: '05',
            businessHub: 'Mowe',
            feeder: 'Ijeun',
            feederId: '0123456',
            dssCount: '10',
            population: '100000',
            energyused: '25048890.789',
            prepaid: '12524445.395',
            postpaid: '9393334.046',
            virtual: '9393334.046',
            efficiency: '90%'
        },
        {
            id: 6,
            customerId: '06',
            businessHub: 'Mowe',
            feeder: 'Ijeun',
            feederId: '0123456',
            dssCount: '10',
            population: '100000',
            energyused: '25048890.789',
            prepaid: '12524445.395',
            postpaid: '9393334.046',
            virtual: '9393334.046',
            efficiency: '90%'
        },
        {
            id: 7,
            customerId: '07',
            businessHub: 'Mowe',
            feeder: 'Ijeun',
            feederId: '0123456',
            dssCount: '10',
            population: '100000',
            energyused: '25048890.789',
            prepaid: '12524445.395',
            postpaid: '9393334.046',
            virtual: '9393334.046',
            efficiency: '90%'
        },
        {
            id: 8,
            customerId: '08',
            businessHub: 'Mowe',
            feeder: 'Ijeun',
            feederId: '0123456',
            dssCount: '10',
            population: '100000',
            energyused: '25048890.789',
            prepaid: '12524445.395',
            postpaid: '9393334.046',
            virtual: '9393334.046',
            efficiency: '90%'
        },
        {
            id: 9,
            customerId: '09',
            businessHub: 'Mowe',
            feeder: 'Ijeun',
            feederId: '0123456',
            dssCount: '10',
            population: '100000',
            energyused: '25048890.789',
            prepaid: '12524445.395',
            postpaid: '9393334.046',
            virtual: '9393334.046',
            efficiency: '90%'
        },
        {
            id: 10,
            customerId: '10',
            businessHub: 'Mowe',
            feeder: 'Ijeun',
            feederId: '0123456',
            dssCount: '10',
            population: '100000',
            energyused: '25048890.789',
            prepaid: '12524445.395',
            postpaid: '9393334.046',
            virtual: '9393334.046',
            efficiency: '90%'
        },
    ];

    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handlePageSizeChange = (newPageSize: number) => {
        setRowsPerPage(newPageSize);
        setCurrentPage(0);
    };

    return (
        <FeederContainer title="Feeder Report">
            <FeederTable
                headers={
                    <TableRow>
                        <TableHead>S/N</TableHead>
                        <TableHead>Business Hub</TableHead>
                        <TableHead>Feeder</TableHead>
                        <TableHead>Feeder ID</TableHead>
                        <TableHead>DSS Count</TableHead>
                        <TableHead>Population</TableHead>
                        <TableHead>Energy Used</TableHead>
                        <TableHead>Prepaid Energy</TableHead>
                        <TableHead>Postpaid Energy</TableHead>
                        <TableHead>Virtual Energy</TableHead>
                        <TableHead>Efficiency Score</TableHead>
                    </TableRow>
                }
                data={CUSTOMER_POP}
                sumKeys={["prepaid", "postpaid", "virtual", "efficiency"]}
            >
                {(emp) => (
                    <TableRow key={emp.id}>
                        <TableCell className="flex flex-row gap-5 py-5">{emp.customerId}</TableCell>
                        <TableCell>{emp.businessHub}</TableCell>
                        <TableCell>{emp.feeder}</TableCell>
                        <TableCell>{emp.feederId}</TableCell>
                        <TableCell>{emp.dssCount}</TableCell>
                        <TableCell>{emp.population}</TableCell>
                        <TableCell>{emp.energyused}</TableCell>
                        <TableCell>{emp.prepaid}</TableCell>
                        <TableCell>{emp.postpaid}</TableCell>
                        <TableCell>{emp.virtual}</TableCell>
                        <TableCell>{emp.efficiency}</TableCell>
                    </TableRow>
                )}
            </FeederTable>
            <PaginationControls
                currentPage={currentPage}
                totalItems={CUSTOMER_POP.length}
                pageSize={rowsPerPage}
                onPageChange={setCurrentPage}
                onPageSizeChange={handlePageSizeChange}
                zeroBasedIndexing={true}
            />
        </FeederContainer>

    );
}

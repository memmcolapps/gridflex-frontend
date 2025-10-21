import FeederContainer from "@/components/customized-report/feeder-report/feeder-container";
import FeederTable from "@/components/customized-report/feeder-report/feeder-table";
import {
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


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
            prepaid:'12524445.395',
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
            prepaid:'12524445.395',
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
            prepaid:'12524445.395',
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
            prepaid:'12524445.395',
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
            prepaid:'12524445.395',
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
            prepaid:'12524445.395',
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
            prepaid:'12524445.395',
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
            prepaid:'12524445.395',
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
            prepaid:'12524445.395',
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
            prepaid:'12524445.395',
            postpaid: '9393334.046',
            virtual: '9393334.046',
            efficiency: '90%'
        },
    ];

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
        <Pagination className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Rows per page</span>

                    <Select>
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder="10" />
                        </SelectTrigger>
                        <SelectContent
                            position="popper"
                            side="top"
                            align="center"
                            className="mb-1 ring-gray-50"
                        >
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="24">24</SelectItem>
                            <SelectItem value="48">48</SelectItem>
                        </SelectContent>
                    </Select>

                    <span className="text-sm font-medium">1-10 of 75</span>
                </div>

                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext href="#" />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
      </FeederContainer>
      
    );
}

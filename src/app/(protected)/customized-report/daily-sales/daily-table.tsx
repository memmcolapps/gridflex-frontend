import DailyContainer from "@/components/customized-report/daily-reports/daily-container";
import DailyTable from "@/components/customized-report/daily-reports/daily-table";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";

export default function DailySalesTable() {
    const CUSTOMER_POP = [
        {
            id: 1,
            customerId: '01',
            region: 'Ogun',
            tariffType: 'R 2',
            description: 'COMMERCIAL',
            units: '16194665.04',
            cost: '1543890561.52',
            vat: '115431967.93',
            fc: '0',
            campi: '0',
            fpunit: '0',
            losrev: '0',
        },
        {
            id: 2,
            customerId: '02',
            region: 'Ogun',
            tariffType: 'R 2',
            description: 'COMMERCIAL',
            units: '16194665.04',
            cost: '1543890561.52',
            vat: '115431967.93',
            fc: '0',
            campi: '0',
            fpunit: '0',
            losrev: '0',
        },
        {
            id: 3,
            customerId: '03',
            region: 'Ogun',
            tariffType: 'R 2',
            description: 'COMMERCIAL',
            units: '16194665.04',
            cost: '1543890561.52',
            vat: '115431967.93',
            fc: '0',
            campi: '0',
            fpunit: '0',
            losrev: '0',
        }, {
            id: 4,
            customerId: '04',
            region: 'Ogun',
            tariffType: 'R 2',
            description: 'COMMERCIAL',
            units: '16194665.04',
            cost: '1543890561.52',
            vat: '115431967.93',
            fc: '0',
            campi: '0',
            fpunit: '0',
            losrev: '0',
        }, {
            id: 5,
            customerId: '05',
            region: 'Ogun',
            tariffType: 'R 2',
            description: 'COMMERCIAL',
            units: '16194665.04',
            cost: '1543890561.52',
            vat: '115431967.93',
            fc: '0',
            campi: '0',
            fpunit: '0',
            losrev: '0',
        },
        {
            id: 6,
            customerId: '06',
            region: 'Ogun',
            tariffType: 'R 2',
            description: 'COMMERCIAL',
            units: '16194665.04',
            cost: '1543890561.52',
            vat: '115431967.93',
            fc: '0',
            campi: '0',
            fpunit: '0',
            losrev: '0',
        },
        {
            id: 7,
            customerId: '07',
            region: 'Ogun',
            tariffType: 'R 2',
            description: 'COMMERCIAL',
            units: '16194665.04',
            cost: '1543890561.52',
            vat: '115431967.93',
            fc: '0',
            campi: '0',
            fpunit: '0',
            losrev: '0',
        },
    ];

    return (
        <DailyContainer title="Daily Sales Report">
        <DailyTable
          headers={
            <TableRow>
              <TableHead>S/N</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Tariff</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Units</TableHead>
              <TableHead>Cost of Units</TableHead>
              <TableHead>Vat</TableHead>
              <TableHead>Fc</TableHead>
              <TableHead>Capmi</TableHead>
              <TableHead>Fpunit</TableHead>
              <TableHead>Losrev</TableHead>
            </TableRow>
          }
          data={CUSTOMER_POP}
          sumKeys={["units", "cost", "vat", "fc", "campi", "fpunit", "losrev"]} 
        >
          {(emp) => (
            <TableRow key={emp.id}>
              <TableCell className="flex flex-row gap-5 py-5">{emp.customerId}</TableCell>
              <TableCell>{emp.region}</TableCell>
              <TableCell>{emp.tariffType}</TableCell>
              <TableCell className="pr-8">{emp.description}</TableCell>
              <TableCell>{emp.units}</TableCell>
              <TableCell>{emp.cost}</TableCell>
              <TableCell>{emp.vat}</TableCell>
              <TableCell>{emp.fc}</TableCell>
              <TableCell>{emp.campi}</TableCell>
              <TableCell>{emp.fpunit}</TableCell>
              <TableCell>{emp.losrev}</TableCell>
            </TableRow>
          )}
        </DailyTable>
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
      </DailyContainer>
      
    );
}

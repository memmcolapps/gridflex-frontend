import { useState } from "react";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";
import BandForm from "./bandform";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { ArrowUpDown, PlusCircleIcon, SearchIcon } from "lucide-react";

type Band = {
  id: string;
  name: string;
  electricityHour: number;
};

export default function BandManagement() {
  const [bands, setBands] = useState<Band[]>([
    { id: "1", name: "Band A", electricityHour: 20 },
    { id: "2", name: "Band B", electricityHour: 16 },
    { id: "3", name: "Band C", electricityHour: 12 },
    { id: "4", name: "Band D", electricityHour: 8 },
    { id: "5", name: "Band E", electricityHour: 4 },
    { id: "6", name: "Band F", electricityHour: 5 },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Band;
    direction: "ascending" | "descending";
  } | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const requestSort = (key: keyof Band) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedBands = () => {
    const sortableBands = [...bands];
    if (sortConfig !== null) {
      sortableBands.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableBands;
  };

  const filteredBands = sortedBands().filter((band) =>
    band.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-6 text-black">
      <h1 className="mb-6 text-2xl font-bold">Band Management</h1>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Add and manage electricity distribution bands.
        </p>
        <BandForm
          mode="add"
          onSave={(newBand) => {
            console.log("Adding New Band:", newBand);
            setBands([...bands, { ...newBand, id: Date.now().toString() }]);
          }}
          triggerButton={
            <Button className="flex items-center gap-2 bg-[#161CCA] hover:bg-[#121eb3]">
              <div className="flex items-center justify-center p-0.5">
                <PlusCircleIcon className="text-[#FEFEFE]" size={12} />
              </div>
              <span className="text-white">Add Band</span>
            </Button>
          }
        />
      </div>

      <div className="mb-6 flex w-80 items-center gap-4">
        <div className="relative flex-1">
          <SearchIcon
            className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2"
            size={12}
          />
          <Input
            type="text"
            placeholder="Search by name, ID, cont..."
            className="w-100 border-[rgba(228,231,236,1)] pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        {/* <Button variant="outline" className="gap-1 border-[rgba(228,231,236,1)]">
                    <ArrowUpDown className="" strokeWidth={2.5} size={12} />
                    <Label htmlFor="sortCheckbox" className="cursor-pointer">
                        Sort
                    </Label>
                </Button> */}
      </div>

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("name")}
              >
                <div className="flex items-center justify-between">
                  <span>Band Name</span>
                  {sortConfig?.key === "name" && (
                    <span>
                      {sortConfig.direction === "ascending" ? (
                        <ChevronUpIcon className="h-4 w-4" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() => requestSort("electricityHour")}
              >
                <div className="flex items-center justify-between">
                  <span>Electricity Hour</span>
                  {sortConfig?.key === "electricityHour" && (
                    <span>
                      {sortConfig.direction === "ascending" ? (
                        <ArrowUpIcon className="h-4 w-4" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBands.map((band) => (
              <TableRow key={band.id} className="hover:bg-muted/50">
                <TableCell>{band.name}</TableCell>
                <TableCell>{band.electricityHour}</TableCell>
                <TableCell>
                  <BandForm
                    mode="edit"
                    band={band}
                    onSave={(updatedBand) =>
                      console.log("Updating:", updatedBand)
                    }
                    triggerButton={
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 border-[rgba(228,231,236,1)]"
                      >
                        {/* <PencilIcon className="h-4 w-4" /> */}
                        Edit
                      </Button>
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

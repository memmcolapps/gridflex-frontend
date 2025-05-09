import { useState, useEffect } from "react";
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
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import { fetchBands, createBand, updateBand, type Band } from "@/service/band-service";

export default function BandManagement() {

  
  const [bands, setBands] = useState<Band[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Band;
    direction: "ascending" | "descending";
  } | null>(null);

  useEffect(() => {
    const loadBands = async () => {
      setIsLoading(true);
      try {
        const fetchedBands = await fetchBands();
        setBands(fetchedBands);
      } catch (error) {
        console.error("Failed to fetch bands:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBands();
  }, []);

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
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === undefined || bValue === undefined) return 0;
        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
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

  const handleAddBand = async (newBand: Omit<Band, "id">) => {
    const success = await createBand(newBand);
    if (success) {
      // Refresh the bands list to get the new band with the correct ID from backend
      const fetchedBands = await fetchBands();
      setBands(fetchedBands);
    }
  };

  const handleUpdateBand = async (bandId: string | number, updatedBand: Omit<Band, "id">) => {
    // Create a complete band object with the original ID and updated fields
    const bandToUpdate: Band = {
      id: bandId,
      ...updatedBand,
      // Preserve other fields from the original band
      status: bands.find(b => b.id === bandId)?.status,
      createdat: bands.find(b => b.id === bandId)?.createdat,
      updatedat: bands.find(b => b.id === bandId)?.updatedat
    };

    const success = await updateBand(bandToUpdate);
    if (success) {
      // Refresh the bands list to get the updated data from backend
      const fetchedBands = await fetchBands();
      setBands(fetchedBands);
    }
  };

  return (
    <div className="p-6 text-black">
      <h1 className="mb-6 text-2xl font-bold">Band Management</h1>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Add and manage electricity distribution bands.
        </p>
        <BandForm
          mode="add"
          onSave={handleAddBand}
          triggerButton={
            <Button className="flex items-center gap-2 bg-[#161CCA] hover:bg-[#121eb3] cursor-pointer">
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
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading bands...
                </TableCell>
              </TableRow>
            ) : bands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No bands found
                </TableCell>
              </TableRow>
            ) : (
              filteredBands.map((band) => (
                <TableRow key={band.id} className="hover:bg-muted/50">
                  <TableCell>{band.name}</TableCell>
                  <TableCell>{band.electricityHour}</TableCell>
                  <TableCell>{band.status ? "Active" : "Inactive"}</TableCell>
                  <TableCell>
                    {new Date(band.createdat!).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(band.updatedat!).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <BandForm
                      mode="edit"
                      band={band}
                      onSave={(updatedBand) => handleUpdateBand(band.id!, updatedBand)}
                      triggerButton={
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 border-[rgba(228,231,236,1)]"
                        >
                          Edit
                        </Button>
                      }
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

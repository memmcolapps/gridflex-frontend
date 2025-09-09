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
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import { type Band } from "@/service/band-service";
import { useBand, useCreateBand, useUpdateBand } from "@/hooks/use-band";
import { toast } from "sonner";
import { ContentHeader } from "../ui/content-header";
import { getStatusStyle } from "../status-style";

export default function BandManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Band;
    direction: "ascending" | "descending";
  } | null>(null);
  const { bands, isLoading } = useBand();
  const { mutate: createBand } = useCreateBand();
  const { mutate: updateBand } = useUpdateBand();

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
    createBand(newBand, {
      onSuccess: () => {
        toast.success("Band created successfully");
      },
      onError: (error) => {
        console.error("Failed to create band:", error);
      },
      onSettled: () => {
        setSearchTerm("");
      },
    });
  };

  const handleUpdateBand = async (
    bandId: string,
    updatedBand: Omit<Band, "id">,
  ) => {
    const bandToUpdate: Band = {
      id: bandId,
      ...updatedBand,
      approveStatus: bands.find((b) => b.id === bandId)?.approveStatus,
      createdAt: bands.find((b) => b.id === bandId)?.createdAt,
      updatedAt: bands.find((b) => b.id === bandId)?.updatedAt,
    };

    updateBand(bandToUpdate, {
      onSuccess: () => {
        toast.success("Band updated successfully");
      },
      onError: (error) => {
        console.error("Failed to update band:", error);
      },
      onSettled: () => {
        setSearchTerm("");
      },
    });
  };

  return (
    <div className="p-6 text-black">
      <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
        <ContentHeader
          title="Band Management"
          description="Add and manage electricity distribution bands"
        />
        <BandForm
          mode="add"
          onSave={handleAddBand}
          triggerButton={
            <Button className="flex cursor-pointer items-center gap-2 bg-[#161CCA] hover:bg-[#121eb3]">
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
          <TableHeader className="bg-transparent">
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
                onClick={() => requestSort("hour")}
              >
                <div className="flex items-center justify-between">
                  <span>Electricity Hour</span>
                  {sortConfig?.key === "hour" && (
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
                  <TableCell>{band.hour}</TableCell>
                  <TableCell>
                    <span className={getStatusStyle(band.approveStatus)}>
                      {band.approveStatus}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(band.createdAt!).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(band.updatedAt!).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <BandForm
                      mode="edit"
                      band={band}
                      onSave={(updatedBand) =>
                        handleUpdateBand(band.id!, updatedBand)
                      }
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

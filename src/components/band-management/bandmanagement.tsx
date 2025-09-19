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
import { Label } from "@/components/ui/label";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  AlertTriangle,
  Ban,
  MoreVertical,
  Pencil,
  PlusCircleIcon,
  SearchIcon,
  UserCheck,
  X,
} from "lucide-react";
import { type Band } from "@/service/band-service";
import {
  useBand,
  useCreateBand,
  useUpdateBand,
  useDeactivateBand,
  useActivateBand,
} from "@/hooks/use-band";
import { toast } from "sonner";
import { ContentHeader } from "../ui/content-header";
import { getStatusStyle } from "../status-style";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function BandManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Band;
    direction: "ascending" | "descending";
  } | null>(null);
  const [editingBand, setEditingBand] = useState<Band | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [bandToToggle, setBandToToggle] = useState<Band | null>(null);

  const { bands, isLoading } = useBand();
  const { mutate: createBand } = useCreateBand();
  const { mutate: updateBand } = useUpdateBand();
  const { mutate: deactivateBand, isPending: isDeactivating } =
    useDeactivateBand();
  const { mutate: activateBand, isPending: isActivating } = useActivateBand();

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
      status: bands.find((b) => b.id === bandId)?.status,
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
        setShowEditDialog(false);
        setEditingBand(null);
      },
    });
  };

  const handleEditBand = (band: Band) => {
    setEditingBand(band);
    setShowEditDialog(true);
  };

  const handleToggleBandStatus = (band: Band) => {
    setBandToToggle(band);
    setShowStatusDialog(true);
  };

  const confirmToggleBandStatus = () => {
    if (bandToToggle) {
      const isActive = bandToToggle.status !== false;

      if (isActive) {
        deactivateBand(bandToToggle.id!, {
          onSuccess: () => {
            toast.success("Band deactivated successfully");
            setShowStatusDialog(false);
            setBandToToggle(null);
          },
          onError: (error) => {
            console.error("Failed to deactivate band:", error);
            toast.error(`Failed to deactivate band: ${error.message || error}`);
          },
        });
      } else {
        activateBand(bandToToggle.id!, {
          onSuccess: () => {
            toast.success("Band activated successfully");
            setShowStatusDialog(false);
            setBandToToggle(null);
          },
          onError: (error) => {
            console.error("Failed to activate band:", error);
            toast.error("Failed to activate band");
          },
        });
      }
    }
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
              <TableHead>Approval Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Loading bands...
                </TableCell>
              </TableRow>
            ) : bands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 cursor-pointer p-2"
                        >
                          <MoreVertical size={14} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="center"
                        className="cursor-pointer bg-white"
                      >
                        <DropdownMenuItem
                          onSelect={() => {
                            handleEditBand(band);
                          }}
                        >
                          <div className="flex w-full items-center gap-2 p-2">
                            <Pencil size={14} />
                            <span className="cursor-pointer">Edit Band</span>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => {
                            handleToggleBandStatus(band);
                          }}
                        >
                          <div className="flex w-full items-center gap-2 p-2">
                            {band.status !== false ? (
                              <Ban size={14} />
                            ) : (
                              <UserCheck size={14} />
                            )}
                            <span>
                              {band.status !== false
                                ? "Deactivate"
                                : "Activate"}
                            </span>
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Band Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="h-70 bg-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Band</DialogTitle>
          </DialogHeader>
          {editingBand && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const updatedBand = {
                  name: formData.get("name") as string,
                  hour: parseInt(formData.get("hour") as string, 10),
                };
                handleUpdateBand(editingBand.id!, updatedBand);
              }}
              className="space-y-4"
            >
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Band Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={editingBand.name}
                    placeholder="Enter band name"
                    required
                    className="border-[rgba(228,231,236,1)]"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="hour">Electricity Hours</Label>
                  <Input
                    id="hour"
                    name="hour"
                    type="number"
                    defaultValue={editingBand.hour.toString()}
                    placeholder="Enter electricity hours"
                    required
                    min="0"
                    max="24"
                    className="border-[rgba(228,231,236,1)]"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-between gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditDialog(false)}
                  className="border-[#161CCA] text-[#161CCA]"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#161CCA] text-white">
                  Save
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Band Status Toggle Confirmation Dialog */}
      <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <AlertDialogContent className="max-w-sm rounded-xl border-[rgba(228,231,236,1)] p-6">
          <AlertDialogCancel asChild>
            <button className="absolute top-4 right-4 rounded-sm border-none bg-transparent p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
              <X size={16} />
            </button>
          </AlertDialogCancel>

          <div className="flex flex-col space-y-4 pt-2">
            <div className="">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full ${
                  bandToToggle?.status !== false
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                <AlertTriangle size={28} />
              </div>
            </div>

            {/* Header content */}
            <AlertDialogHeader className="space-y-2 text-center">
              <AlertDialogTitle className="text-xl font-semibold text-gray-900">
                {bandToToggle?.status !== false ? "Deactivate" : "Activate"}{" "}
                Band
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-gray-600">
                {bandToToggle?.status !== false
                  ? "Are you sure you want to deactivate this band? It will no longer be available for use."
                  : "Are you sure you want to activate this band? It will be available for use."}
              </AlertDialogDescription>
            </AlertDialogHeader>

            {/* Footer with buttons */}
            <AlertDialogFooter className="flex flex-row gap-3 pt-4">
              <AlertDialogCancel className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-800">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmToggleBandStatus}
                disabled={isDeactivating || isActivating}
                className={`flex-1 rounded-lg px-4 py-2.5 font-medium text-white transition-colors ${
                  bandToToggle?.status !== false
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                } ${isDeactivating || isActivating ? "cursor-not-allowed opacity-50" : ""}`}
              >
                {isDeactivating || isActivating
                  ? `${bandToToggle?.status !== false ? "Deactivating" : "Activating"}...`
                  : bandToToggle?.status !== false
                    ? "Deactivate"
                    : "Activate"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// app/manufacturers/page.tsx
"use client";

import { useEffect, useState } from "react";
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
import { Card } from "@/components/ui/card";
import { CirclePlus, MoreVertical, Pencil, AlertTriangle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ContentHeader } from "@/components/ui/content-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchControl, SortControl } from "@/components/search-control";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Types
interface Manufacturer {
  id: string;
  sin: string;
  manufacturerId: string;
  sgc: string;
  contactPerson: string;
  location: string;
  address: string;
  phoneNumber: string; // Added to match the dialog usage
  status: "Active" | "Deactivated";
}

// Component 1: AddManufacturerDialog
function AddManufacturerDialog({
  isOpen,
  onClose,
  onAdd,
  data,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (manufacturer: Manufacturer) => void;
  data: Manufacturer[];
}) {
  const [manufacturerName, setManufacturerName] = useState("");
  const [manufacturerId, setManufacturerId] = useState("");
  const [sgc, setSgc] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("Lagos");

  const handleAdd = () => {
    if (
      !manufacturerName ||
      !manufacturerId ||
      !contactPerson ||
      !phoneNumber
    ) {
      alert("Please fill all required fields.");
      return;
    }
    const newManufacturer: Manufacturer = {
      id: (data.length + 1).toString().padStart(2, "0"),
      sin: manufacturerName,
      manufacturerId,
      sgc,
      contactPerson,
      location,
      address: "",
      phoneNumber,
      status: "Active",
    };
    onAdd(newManufacturer);
    onClose();
    setManufacturerName("");
    setManufacturerId("");
    setSgc("");
    setContactPerson("");
    setPhoneNumber("");
    setLocation("Lagos");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-auto rounded-lg bg-white shadow-lg sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Add Manufacturer
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 py-4 sm:grid-cols-2">
          {/* Column 1: Manufacturer Name */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="manufacturerName"
                className="block text-xs font-medium text-gray-700"
              >
                Manufacturer Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="manufacturerName"
                required
                value={manufacturerName}
                onChange={(e) => setManufacturerName(e.target.value)}
                className="mt-1 h-9 w-full border-gray-300 text-xs focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50"
              />
            </div>
          </div>
          {/* Column 2: Manufacturer ID */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="manufacturerId"
                className="block text-xs font-medium text-gray-700"
              >
                Manufacturer ID <span className="text-red-500">*</span>
              </label>
              <Input
                id="manufacturerId"
                required
                type="number"
                placeholder="e.g. 123456"
                value={manufacturerId}
                onChange={(e) => setManufacturerId(e.target.value)}
                className="mt-1 h-9 w-full [appearance:textfield] border-gray-300 text-xs focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
          </div>
          {/* Full-width Contact Person */}
          <div className="space-y-4 sm:col-span-2">
            <div>
              <label
                htmlFor="contactPerson"
                className="block text-xs font-medium text-gray-700"
              >
                Contact Person <span className="text-red-500">*</span>
              </label>
              <Input
                id="contactPerson"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="mt-1 h-9 w-full border-gray-300 text-xs focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50"
              />
            </div>
          </div>
          {/* Column 1: Phone Number */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-xs font-medium text-gray-700"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <Input
                id="phoneNumber"
                required
                type="number"
                placeholder="e.g. 08012345678"
                pattern="[0-9]*"
                inputMode="numeric"
                maxLength={11}
                minLength={11}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1 h-9 w-full [appearance:textfield] border-gray-300 text-xs focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
          </div>
          {/* Column 2: State */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="location"
                className="block text-xs font-medium text-gray-700"
              >
                State
              </label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="mt-1 h-9 w-full border-gray-300 text-xs focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lagos" className="text-xs">
                    Lagos
                  </SelectItem>
                  <SelectItem value="Ogun" className="text-xs">
                    Ogun
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter className="pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            size="lg"
            className="mr-2 h-8 border-[#161CCA] bg-transparent text-xs text-[#161CCA]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            size="lg"
            className="h-8 bg-[#161CCA] text-xs text-white hover:bg-[#161CCA]/90"
            disabled={
              !manufacturerName ||
              !manufacturerId ||
              !contactPerson ||
              !phoneNumber
            }
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Component 2: EditManufacturerDialog
function EditManufacturerDialog({
  isOpen,
  onClose,
  onEdit,
  manufacturer,
}: {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (updatedManufacturer: Manufacturer) => void;
  manufacturer: Manufacturer | null;
}) {
  const [manufacturerName, setManufacturerName] = useState("");
  const [manufacturerId, setManufacturerId] = useState("");
  const [sgc, setSgc] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("Lagos");

  // Populate fields when the dialog opens with the selected manufacturer
  useEffect(() => {
    if (manufacturer) {
      setManufacturerName(manufacturer.sin);
      setManufacturerId(manufacturer.manufacturerId);
      setSgc(manufacturer.sgc);
      setContactPerson(manufacturer.contactPerson);
      setPhoneNumber(manufacturer.phoneNumber);
      setLocation(manufacturer.location);
    }
  }, [manufacturer]);

  const handleEdit = () => {
    if (
      !manufacturerName ||
      !manufacturerId ||
      !contactPerson ||
      !phoneNumber
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (manufacturer) {
      const updatedManufacturer: Manufacturer = {
        ...manufacturer,
        sin: manufacturerName,
        manufacturerId,
        sgc,
        contactPerson,
        location,
        address: manufacturer.address,
        phoneNumber,
        status: manufacturer.status,
      };
      onEdit(updatedManufacturer);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-auto rounded-lg bg-white shadow-lg sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Edit Manufacturer
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 py-4 sm:grid-cols-2">
          {/* Column 1: Manufacturer Name */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="manufacturerName"
                className="block text-xs font-medium text-gray-700"
              >
                Manufacturer Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="manufacturerName"
                required
                value={manufacturerName}
                onChange={(e) => setManufacturerName(e.target.value)}
                className="mt-1 h-9 w-full border-gray-300 text-xs focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50"
              />
            </div>
          </div>
          {/* Column 2: Manufacturer ID */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="manufacturerId"
                className="block text-xs font-medium text-gray-700"
              >
                Manufacturer ID <span className="text-red-500">*</span>
              </label>
              <Input
                id="manufacturerId"
                required
                type="number"
                placeholder="e.g. 123456"
                value={manufacturerId}
                onChange={(e) => setManufacturerId(e.target.value)}
                className="mt-1 h-9 w-full [appearance:textfield] border-gray-300 text-xs focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
          </div>
          {/* Full-width Contact Person */}
          <div className="space-y-4 sm:col-span-2">
            <div>
              <label
                htmlFor="contactPerson"
                className="block text-xs font-medium text-gray-700"
              >
                Contact Person <span className="text-red-500">*</span>
              </label>
              <Input
                id="contactPerson"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="mt-1 h-9 w-full border-gray-300 text-xs focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50"
              />
            </div>
          </div>
          {/* Column 1: Phone Number */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-xs font-medium text-gray-700"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <Input
                id="phoneNumber"
                required
                type="number"
                placeholder="e.g. 08012345678"
                pattern="[0-9]*"
                inputMode="numeric"
                maxLength={11}
                minLength={11}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1 h-9 w-full [appearance:textfield] border-gray-300 text-xs focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
          </div>
          {/* Column 2: State */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="location"
                className="block text-xs font-medium text-gray-700"
              >
                State
              </label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="mt-1 h-9 w-full border-gray-300 text-xs focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lagos" className="text-xs">
                    Lagos
                  </SelectItem>
                  <SelectItem value="Ogun" className="text-xs">
                    Ogun
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter className="pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            size="lg"
            className="mr-2 h-8 border-[#161CCA] bg-transparent text-xs text-[#161CCA]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleEdit}
            size="lg"
            className="h-8 bg-[#161CCA] text-xs text-white hover:bg-[#161CCA]/90"
            disabled={
              !manufacturerName ||
              !manufacturerId ||
              !contactPerson ||
              !phoneNumber
            }
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Component 3: DeactivateManufacturerDialog
function DeactivateManufacturerDialog({
  isOpen,
  onClose,
  onDeactivate,
  manufacturer,
}: {
  isOpen: boolean;
  onClose: () => void;
  onDeactivate: () => void;
  manufacturer: Manufacturer | null;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-auto rounded-lg bg-white shadow-lg sm:max-w-[350px]">
        <DialogHeader>
          <AlertTriangle
            size={16}
            className="rounded-full bg-red-200 p-2 text-red-600"
          />
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Deactivate Manufacturer
          </DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <p className="text-sm text-gray-700">
            Are you sure you want to deactivate the manufacturer{" "}
            <strong>{manufacturer?.sin}</strong>?
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="mr-2 border-[#ca1616] bg-transparent text-[#ca1616]"
          >
            Cancel
          </Button>
          <Button
            onClick={onDeactivate}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Deactivate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Component 4: ManufacturersPage
export default function ManufacturersPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [data, setData] = useState<Manufacturer[]>([
    {
      id: "01",
      sin: "Mommas",
      manufacturerId: "62",
      sgc: "999962",
      contactPerson: "Engr Mudashiru",
      location: "Ogun",
      address: "KM 40, Lagos/Ibadan Exp. way, Ogun",
      phoneNumber: "08012345678",
      status: "Active",
    },
    {
      id: "02",
      sin: "Mojec",
      manufacturerId: "62",
      sgc: "999962",
      contactPerson: "Richard",
      location: "Lagos",
      address: "KM 40, Lagos/Ibadan Exp. way, Ogun",
      phoneNumber: "08087654321",
      status: "Active",
    },
    {
      id: "03",
      sin: "Heixing",
      manufacturerId: "62",
      sgc: "999962",
      contactPerson: "Oluyemi",
      location: "Ogun",
      address: "KM 40, Lagos/Ibadan Exp. way, Ogun",
      phoneNumber: "08011223344",
      status: "Active",
    },
  ]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [selectedManufacturer, setSelectedManufacturer] =
    useState<Manufacturer | null>(null);

  // Add these state variables
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Manufacturer | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const [processedData, setProcessedData] = useState<Manufacturer[]>(data);

  useEffect(() => {
    applyFiltersAndSort(searchTerm, sortConfig.key, sortConfig.direction);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Enhanced search handler
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    applyFiltersAndSort(term, sortConfig.key, sortConfig.direction);
  };

  // Sort handler
  const handleSortChange = () => {
    const sortKey: keyof Manufacturer = sortConfig.key ?? "sin";
    const newDirection = sortConfig.direction === "asc" ? "desc" : "asc";

    setSortConfig({ key: sortKey, direction: newDirection });
    applyFiltersAndSort(searchTerm, sortKey, newDirection);
  };

  // Combined filter and sort function
  const applyFiltersAndSort = (
    term: string,
    sortBy: keyof Manufacturer | null,
    direction: "asc" | "desc",
  ) => {
    // 1. Filter first
    let results = data;
    if (term.trim() !== "") {
      results = data.filter(
        (item) =>
          item.sin?.toLowerCase().includes(term.toLowerCase()) ||
          item.manufacturerId?.toLowerCase().includes(term.toLowerCase()),
      );
    }

    // 2. Then sort if a sort field is selected
    if (sortBy) {
      results = [...results].sort((a, b) => {
        const aValue = a[sortBy] || "";
        const bValue = b[sortBy] || "";

        if (aValue < bValue) return direction === "asc" ? -1 : 1;
        if (aValue > bValue) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setProcessedData(results);
  };

  const totalPages = Math.ceil(processedData.length / rowsPerPage);
  const paginatedData = processedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  // Define startIndex, endIndex, and totalRows for pagination display
  const totalRows = processedData.length;

  const handleAddManufacturer = (newManufacturer: Manufacturer) => {
    setData((prevData) => [...prevData, newManufacturer]);
  };

  const handleEditManufacturer = (updatedManufacturer: Manufacturer) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === updatedManufacturer.id ? updatedManufacturer : item,
      ),
    );
  };

  const handleDeactivateManufacturer = () => {
    if (selectedManufacturer) {
      setData((prevData) =>
        prevData.map((item) =>
          item.id === selectedManufacturer.id
            ? { ...item, status: "Deactivated" }
            : item,
        ),
      );
      setIsDeactivateDialogOpen(false);
    }
  };
  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalRows));
  };

  return (
    <main className="h-screen overflow-auto p-6">
      {/* Header */}
      <div className="mb-4 flex flex-col items-center justify-between gap-4 md:flex-row">
        <ContentHeader
          title="Manufacturer"
          description="Manage and Access Manufacturers."
        />
        <Button
          className="w-full cursor-pointer rounded-md bg-[#161CCA] px-3 py-1.5 text-white hover:bg-[#161CCA]/90 sm:w-auto sm:px-4 sm:py-2"
          onClick={() => setIsAddDialogOpen(true)}
          size="lg"
        >
          <CirclePlus size={14} strokeWidth={2.3} className="mr-2" />
          <span className="hidden sm:inline">Add Manufacturer</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Search and Filter Section */}
      <Card className="mb-4 border-none bg-transparent p-3 shadow-none sm:mb-6 sm:p-4">
        <div className="flex w-full flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex w-full flex-col items-start gap-2 sm:w-auto sm:flex-row sm:items-center">
            <SearchControl
              onSearchChange={handleSearchChange}
              value={searchTerm}
            />

            <SortControl
              onSortChange={handleSortChange}
              currentSort={
                sortConfig.key
                  ? `${sortConfig.key} (${sortConfig.direction})`
                  : ""
              }
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="h-4/6 overflow-x-hidden border-none bg-transparent shadow-none">
        <Table>
          <TableHeader className="bg-transparent">
            <TableRow className="bg-transparent hover:bg-gray-50">
              <TableHead className="px-2 py-2 text-left sm:px-4 sm:py-3">
                <Checkbox className="h-4 w-4 border-gray-500" />
              </TableHead>
              <TableHead className="px-2 py-2 text-left text-xs font-semibold text-gray-700 sm:px-4 sm:py-3 sm:text-sm">
                S/N
              </TableHead>
              <TableHead className="px-2 py-2 text-left text-xs font-semibold text-gray-700 sm:px-4 sm:py-3 sm:text-sm">
                Manufacturer
              </TableHead>
              <TableHead className="px-2 py-2 text-left text-xs font-semibold text-gray-700 sm:px-4 sm:py-3 sm:text-sm">
                Manufacturer ID
              </TableHead>
              <TableHead className="hidden px-2 py-2 text-left text-xs font-semibold text-gray-700 sm:px-4 sm:py-3 sm:text-sm md:table-cell">
                Contact Person
              </TableHead>
              <TableHead className="hidden px-2 py-2 text-left text-xs font-semibold text-gray-700 sm:px-4 sm:py-3 sm:text-sm lg:table-cell">
                State
              </TableHead>
              <TableHead className="hidden px-2 py-2 text-left text-xs font-semibold text-gray-700 sm:px-4 sm:py-3 sm:text-sm xl:table-cell">
                Address
              </TableHead>
              <TableHead className="px-2 py-2 text-right text-xs font-semibold text-gray-700 sm:px-4 sm:py-3 sm:text-sm">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="h-24 text-center text-xs text-gray-500 sm:text-sm"
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item) => (
                <TableRow
                  key={item.id}
                  className={`hover:bg-gray-50 ${item.status === "Deactivated" ? "bg-gray-100 text-gray-400" : ""}`}
                >
                  <TableCell className="px-2 py-2 sm:px-4 sm:py-3">
                    <Checkbox
                      className="h-4 w-4 border-gray-500"
                      disabled={item.status === "Deactivated"}
                    />
                  </TableCell>
                  <TableCell className="px-2 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm">
                    {item.id}
                  </TableCell>
                  <TableCell className="px-2 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm">
                    {item.sin}
                  </TableCell>
                  <TableCell className="px-2 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm">
                    {item.manufacturerId}
                  </TableCell>
                  <TableCell className="hidden px-2 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm md:table-cell">
                    {item.contactPerson}
                  </TableCell>
                  <TableCell className="hidden px-2 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm lg:table-cell">
                    {item.location}
                  </TableCell>
                  <TableCell className="hidden px-2 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm xl:table-cell">
                    {item.address}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          className="cursor-pointer border-gray-200 outline-none focus:ring-gray-500 focus:outline-none"
                          variant="ghost"
                          size="sm"
                          disabled={item.status === "Deactivated"}
                        >
                          <MoreVertical size={16} className="text-gray-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-48 bg-white shadow-lg"
                      >
                        <DropdownMenuItem
                          className="flex cursor-pointer items-center gap-2"
                          onClick={() => {
                            setSelectedManufacturer(item);
                            setIsEditDialogOpen(true);
                          }}
                          disabled={item.status === "Deactivated"}
                        >
                          <Pencil size={14} className="text-gray-500" />
                          <span className="text-sm text-gray-700">
                            Edit Manufacturer
                          </span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <Pagination className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Rows per page</span>
          <Select
            value={rowsPerPage.toString()}
            onValueChange={handleRowsPerPageChange}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
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
          <span className="text-sm font-medium">
            {(currentPage - 1) * rowsPerPage + 1}-
            {Math.min(currentPage * rowsPerPage, processedData.length)} of{" "}
            {processedData.length}
          </span>
        </div>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePrevious();
              }}
              aria-disabled={currentPage === 1}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNext();
              }}
              aria-disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Add Manufacturer Dialog */}
      <AddManufacturerDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddManufacturer}
        data={data}
      />

      {/* Edit Manufacturer Dialog */}
      <EditManufacturerDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedManufacturer(null);
        }}
        onEdit={handleEditManufacturer}
        manufacturer={selectedManufacturer}
      />

      {/* Deactivate Manufacturer Dialog */}
      <DeactivateManufacturerDialog
        isOpen={isDeactivateDialogOpen}
        onClose={() => {
          setIsDeactivateDialogOpen(false);
          setSelectedManufacturer(null);
        }}
        onDeactivate={handleDeactivateManufacturer}
        manufacturer={selectedManufacturer}
      />
    </main>
  );
}

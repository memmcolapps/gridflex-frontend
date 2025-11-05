"use client";

import { useState, useEffect } from "react";
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
import { CirclePlus, MoreVertical, Pencil } from "lucide-react";
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
import { PaginationControls } from "@/components/ui/pagination-controls";
import { Label } from "@/components/ui/label";
import { type Manufacturer } from "@/types/meters-manufacturers";
import {
  useCreateManufacturer,
  useGetMeterManufactures,
  useUpdateManufacturer,
} from "@/hooks/use-meter";
import { useNigerianCities, useNigerianStates } from "@/hooks/use-location";
import { toast } from "sonner";

function AddManufacturerDialog({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (
    manufacturer: Omit<
      Manufacturer,
      "id" | "orgId" | "createdAt" | "updatedAt"
    >,
  ) => void;
  data: Manufacturer[];
}) {
  const [formData, setFormData] = useState({
    manufacturerName: "",
    manufacturerId: "",
    contactPerson: "",
    phoneNumber: "",
    state: "",
    city: "",
    street: "",
    houseNo: "",
  });

  const { data: states, isLoading: isLoadingStates, isError: isErrorStates } = useNigerianStates();
  const { data: cities, isLoading: isLoadingCities, isError: isErrorCities } = useNigerianCities(formData.state);

  const handleChange = (value: string, field: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const clearForm = () => {
    setFormData({
      manufacturerName: "",
      manufacturerId: "",
      contactPerson: "",
      phoneNumber: "",
      state: "",
      city: "",
      street: "",
      houseNo: "",
    });
  };

  const handleAdd = () => {
    const trimmedValues = {
      manufacturerName: formData.manufacturerName.trim(),
      manufacturerId: formData.manufacturerId.trim(),
      contactPerson: formData.contactPerson.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      city: formData.city.trim(),
      street: formData.street.trim(),
      houseNo: formData.houseNo.trim(),
    };

    if (
      !trimmedValues.manufacturerName ||
      !trimmedValues.manufacturerId ||
      !trimmedValues.contactPerson ||
      !trimmedValues.phoneNumber ||
      !formData.state ||
      !trimmedValues.city ||
      !trimmedValues.street ||
      !trimmedValues.houseNo
    ) {
      const missingFields = [];
      if (!trimmedValues.manufacturerName)
        missingFields.push("Manufacturer Name");
      if (!trimmedValues.manufacturerId) missingFields.push("Manufacturer ID");
      if (!trimmedValues.contactPerson) missingFields.push("Contact Person");
      if (!trimmedValues.phoneNumber) missingFields.push("Phone Number");
      if (!formData.state) missingFields.push("State");
      if (!trimmedValues.city) missingFields.push("City");
      if (!trimmedValues.street) missingFields.push("Street Name");
      if (!trimmedValues.houseNo) missingFields.push("House Number");

      console.log("Missing fields:", missingFields);
      toast.error(
        `Please fill the following required fields: ${missingFields.join(", ")}`,
      );
      return;
    }

    if (trimmedValues.phoneNumber.length !== 11) {
      console.log("Validation failed - phone number length");
      toast.error("Phone number must be 11 digits long.");
      return;
    }

    const newManufacturer: Omit<
      Manufacturer,
      "id" | "orgId" | "createdAt" | "updatedAt"
    > = {
      name: trimmedValues.manufacturerName,
      manufacturerId: trimmedValues.manufacturerId,
      contactPerson: trimmedValues.contactPerson,
      phoneNo: trimmedValues.phoneNumber,
      state: formData.state,
      city: trimmedValues.city,
      street: trimmedValues.street,
      houseNo: trimmedValues.houseNo,
    };

    onAdd(newManufacturer);
    clearForm();
  };

  const handleClose = () => {
    clearForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="h-auto rounded-lg bg-white shadow-lg sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Add Manufacturer
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 py-4 sm:grid-cols-2">
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
                value={formData.manufacturerName}
                onChange={(e) => handleChange(e.target.value, "manufacturerName")}
                className="mt-1 h-9 w-full border-gray-300 text-xs focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50"
              />
            </div>
          </div>
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
                type="text"
                placeholder="e.g. 123456"
                value={formData.manufacturerId}
                onChange={(e) => handleChange(e.target.value, "manufacturerId")}
                className="mt-1 h-9 w-full border-gray-300 text-xs focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50"
              />
            </div>
          </div>
          <div className="space-y-4">
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
                value={formData.contactPerson}
                onChange={(e) => handleChange(e.target.value, "contactPerson")}
                className="mt-1 h-9 w-full border-gray-300 text-xs focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50"
              />
            </div>
          </div>
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
                type="text"
                placeholder="e.g. 08012345678"
                maxLength={11}
                value={formData.phoneNumber}
                onChange={(e) => handleChange(e.target.value.replace(/\D/g, ''), "phoneNumber")}
                className="mt-1 h-9 w-full border-gray-300 text-xs focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State<span className="text-red-600">*</span></Label>
            <Select
              value={formData.state}
              onValueChange={(value) => {
                setFormData(prev => ({ ...prev, state: value, city: "" }));
              }}
            >
              <SelectTrigger className="border-[rgba(228,231,236,1)] w-full">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingStates ? (
                  <SelectItem value="loading" disabled>Loading states...</SelectItem>
                ) : isErrorStates ? (
                  <SelectItem value="error-states" disabled>Error loading states</SelectItem>
                ) : states?.length === 0 ? (
                  <SelectItem value="no-states-found" disabled>No states found</SelectItem>
                ) : (
                  states?.map((state) => (
                    <SelectItem key={state.id} value={state.id}>
                      {state.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="city">City<span className="text-red-600">*</span></Label>
            <Select
              value={formData.city}
              onValueChange={(value) => handleChange(value, "city")}
              disabled={!formData.state || isLoadingCities}
              required
            >
              <SelectTrigger id="city" className="w-full">
                <SelectValue
                  placeholder={
                    isLoadingCities
                      ? "Loading cities..."
                      : formData.state
                        ? "Select City"
                        : "Select a state first"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {isLoadingCities ? (
                  <SelectItem value="loading" disabled>Loading cities...</SelectItem>
                ) : isErrorCities ? (
                  <SelectItem value="error-cities" disabled>Error loading cities</SelectItem>
                ) : cities?.length === 0 && formData.state ? (
                  <SelectItem value="no-cities-found" disabled>No cities found for this state</SelectItem>
                ) : (
                  cities?.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="street"
                className="block text-xs font-medium text-gray-700"
              >
                Street Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="street"
                required
                value={formData.street}
                onChange={(e) => handleChange(e.target.value, "street")}
                className="mt-1 h-9 w-full border-gray-300 text-xs focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="houseNo"
                className="block text-xs font-medium text-gray-700"
              >
                House number <span className="text-red-500">*</span>
              </label>
              <Input
                id="houseNo"
                required
                value={formData.houseNo}
                onChange={(e) => handleChange(e.target.value, "houseNo")}
                className="mt-1 h-9 w-full [appearance:textfield] border-gray-300 text-xs focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
          </div>
        </div>
        <DialogFooter className="pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            size="lg"
            className="mr-2 h-8 border-[#161CCA] bg-transparent text-xs text-[#161CCA]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            size="lg"
            className="h-8 bg-[#161CCA] text-xs text-white hover:bg-[#161CCA]/90"
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditManufacturerDialog({
  isOpen,
  onClose,
  onEdit,
  manufacturer,
}: {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (
    updatedManufacturer: Omit<
      Manufacturer,
      "orgId" | "createdAt" | "updatedAt"
    >,
  ) => void;
  manufacturer: Manufacturer | null;
}) {
  const [formData, setFormData] = useState({
    manufacturerName: "",
    manufacturerId: "",
    contactPerson: "",
    phoneNumber: "",
    state: "",
    city: "",
    street: "",
    houseNo: "",
  });

  const { data: states, isLoading: isLoadingStates, isError: isErrorStates } = useNigerianStates();
  const { data: cities, isLoading: isLoadingCities, isError: isErrorCities } = useNigerianCities(formData.state);

  const handleChange = (value: string, field: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (manufacturer) {
      setFormData({
        manufacturerName: manufacturer.name || "",
        manufacturerId: manufacturer.manufacturerId || "",
        contactPerson: manufacturer.contactPerson || "",
        phoneNumber: manufacturer.phoneNo || "",
        state: manufacturer.state || "",
        city: manufacturer.city || "",
        street: manufacturer.street || "",
        houseNo: manufacturer.houseNo || "",
      });
    }
  }, [manufacturer]);

  const clearForm = () => {
    setFormData({
      manufacturerName: "",
      manufacturerId: "",
      contactPerson: "",
      phoneNumber: "",
      state: "",
      city: "",
      street: "",
      houseNo: "",
    });
  };

  const handleEdit = () => {
    // Trim all values and check all required fields
    const trimmedValues = {
      manufacturerName: formData.manufacturerName.trim(),
      manufacturerId: formData.manufacturerId.trim(),
      contactPerson: formData.contactPerson.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      city: formData.city.trim(),
      street: formData.street.trim(),
      houseNo: formData.houseNo.trim(),
    };

    if (
      !trimmedValues.manufacturerName ||
      !trimmedValues.manufacturerId ||
      !trimmedValues.contactPerson ||
      !trimmedValues.phoneNumber ||
      !formData.state ||
      !trimmedValues.city ||
      !trimmedValues.street ||
      !trimmedValues.houseNo
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (trimmedValues.phoneNumber.length !== 11) {
      toast.error("Phone number must be 11 digits long.");
      return;
    }

    if (!manufacturer?.id) {
      return;
    }

    const newManufacturer: Omit<
      Manufacturer,
      "orgId" | "createdAt" | "updatedAt"
    > = {
      id: manufacturer.id,
      name: trimmedValues.manufacturerName,
      manufacturerId: trimmedValues.manufacturerId,
      contactPerson: trimmedValues.contactPerson,
      phoneNo: trimmedValues.phoneNumber,
      state: formData.state,
      city: trimmedValues.city,
      street: trimmedValues.street,
      houseNo: trimmedValues.houseNo,
    };

    onEdit(newManufacturer);
    clearForm();
  };

  const handleClose = () => {
    clearForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="h-auto rounded-lg bg-white shadow-lg sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Edit Manufacturer
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 py-4 sm:grid-cols-2">
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
                value={formData.manufacturerName}
                onChange={(e) => handleChange(e.target.value, "manufacturerName")}
                className="mt-1 h-9 w-full border-gray-300 text-xs focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50"
              />
            </div>
          </div>
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
                type="text"
                placeholder="e.g. 123456"
                value={formData.manufacturerId}
                onChange={(e) => handleChange(e.target.value, "manufacturerId")}
                className="mt-1 h-9 w-full border-gray-300 text-xs focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50"
              />
            </div>
          </div>
          <div className="space-y-4">
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
                value={formData.contactPerson}
                onChange={(e) => handleChange(e.target.value, "contactPerson")}
                className="mt-1 h-9 w-full border-gray-300 text-xs focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50"
              />
            </div>
          </div>
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
                type="text"
                placeholder="e.g. 08012345678"
                maxLength={11}
                value={formData.phoneNumber}
                onChange={(e) => handleChange(e.target.value.replace(/\D/g, ''), "phoneNumber")}
                className="mt-1 h-9 w-full border-gray-300 text-xs focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State<span className="text-red-600">*</span></Label>
            <Select
              value={formData.state}
              onValueChange={(value) => {
                setFormData(prev => ({ ...prev, state: value, city: "" }));
              }}
            >
              <SelectTrigger className="border-[rgba(228,231,236,1)] w-full">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingStates ? (
                  <SelectItem value="loading" disabled>Loading states...</SelectItem>
                ) : isErrorStates ? (
                  <SelectItem value="error-states" disabled>Error loading states</SelectItem>
                ) : states?.length === 0 ? (
                  <SelectItem value="no-states-found" disabled>No states found</SelectItem>
                ) : (
                  states?.map((state) => (
                    <SelectItem key={state.id} value={state.id}>
                      {state.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="city">City<span className="text-red-600">*</span></Label>
            <Select
              value={formData.city}
              onValueChange={(value) => handleChange(value, "city")}
              disabled={!formData.state || isLoadingCities}
              required
            >
              <SelectTrigger id="city" className="w-full">
                <SelectValue
                  placeholder={
                    isLoadingCities
                      ? "Loading cities..."
                      : formData.state
                        ? "Select City"
                        : "Select a state first"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {isLoadingCities ? (
                  <SelectItem value="loading" disabled>Loading cities...</SelectItem>
                ) : isErrorCities ? (
                  <SelectItem value="error-cities" disabled>Error loading cities</SelectItem>
                ) : cities?.length === 0 && formData.state ? (
                  <SelectItem value="no-cities-found" disabled>No cities found for this state</SelectItem>
                ) : (
                  cities?.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="street"
                className="block text-xs font-medium text-gray-700"
              >
                Street Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="street"
                required
                value={formData.street}
                onChange={(e) => handleChange(e.target.value, "street")}
                className="mt-1 h-9 w-full border-gray-300 text-xs focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="houseNo"
                className="block text-xs font-medium text-gray-700"
              >
                House number <span className="text-red-500">*</span>
              </label>
              <Input
                id="houseNo"
                required
                value={formData.houseNo}
                onChange={(e) => handleChange(e.target.value, "houseNo")}
                className="mt-1 h-9 w-full [appearance:textfield] border-gray-300 text-xs focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
          </div>
        </div>
        <DialogFooter className="pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
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
              !formData.manufacturerName.trim() ||
              !formData.manufacturerId.trim() ||
              !formData.contactPerson.trim() ||
              !formData.phoneNumber.trim() ||
              !formData.state.trim() ||
              !formData.city.trim() ||
              !formData.street.trim() ||
              !formData.houseNo.trim()
            }
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function ManufacturersPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { data } = useGetMeterManufactures ();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedManufacturer, setSelectedManufacturer] =
    useState<Manufacturer | null>(null);

  const { mutate: createManufacturer } = useCreateManufacturer();
  const { mutate: updateManufacturer } = useUpdateManufacturer();

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Manufacturer | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    applyFiltersAndSort(term, sortConfig.key, sortConfig.direction);
  };

  const handleSortChange = () => {
    const sortKey: keyof Manufacturer = sortConfig.key ?? "name";
    const newDirection = sortConfig.direction === "asc" ? "desc" : "asc";

    setSortConfig({ key: sortKey, direction: newDirection });
    applyFiltersAndSort(searchTerm, sortKey, newDirection);
  };

  const applyFiltersAndSort = (
    term: string,
    sortBy: keyof Manufacturer | null,
    direction: "asc" | "desc",
  ) => {
    let results = data || [];
    if (term.trim() !== "") {
      results = results.filter(
        (item) =>
          item.name?.toLowerCase().includes(term.toLowerCase()) ||
          item.manufacturerId?.toLowerCase().includes(term.toLowerCase()),
      );
    }

    if (sortBy) {
      results.sort((a, b) => {
        const aValue = a[sortBy] ?? "";
        const bValue = b[sortBy] ?? "";

        if (aValue < bValue) return direction === "asc" ? -1 : 1;
        if (aValue > bValue) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return results;
  };

  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const handleAddManufacturer = (
    newManufacturer: Omit<
      Manufacturer,
      "id" | "orgId" | "createdAt" | "updatedAt"
    >,
  ) => {
    createManufacturer(newManufacturer, {
      onSuccess: () => {
        toast.success("Manufacturer created successfully");
      },
      onError: (error) => {
        console.error("Failed to create manufacturer:", error);
        toast.error("Failed to create manufacturer");
      },
      onSettled: () => {
        setSearchTerm("");
        setIsAddDialogOpen(false);
      },
    });
  };

  const handleEditManufacturer = (
    updatedManufacturer: Omit<
      Manufacturer,
      "orgId" | "createdAt" | "updatedAt"
    >,
  ) => {
    updateManufacturer(updatedManufacturer, {
      onSuccess: () => {
        toast.success("Manufacturer updated successfully");
      },
      onError: (error) => {
        console.error("Failed to update manufacturer:", error);
        toast.error("Failed to update manufacturer");
      },
      onSettled: () => {
        setSearchTerm("");
        setIsEditDialogOpen(false);
      },
    });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setRowsPerPage(newPageSize);
    setCurrentPage(1);
  };

  return (
    <main className="h-screen overflow-auto p-6">
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
              <TableHead className="px-2 py-2 text-left text-xs font-semibold text-gray-700 sm:px-4 sm:py-3 sm:text-sm md:table-cell">
                Contact Person
              </TableHead>
              <TableHead className="px-2 py-2 text-left text-xs font-semibold text-gray-700 sm:px-4 sm:py-3 sm:text-sm lg:table-cell">
                State
              </TableHead>
              <TableHead className="px-2 py-2 text-left text-xs font-semibold text-gray-700 sm:px-4 sm:py-3 sm:text-sm xl:table-cell">
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
              paginatedData.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="px-2 py-2 sm:px-4 sm:py-3">
                    <Checkbox className="h-4 w-4 border-gray-500" />
                  </TableCell>
                  <TableCell className="px-2 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm">
                    {index + 1}
                  </TableCell>
                  <TableCell className="px-2 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm">
                    {item.name}
                  </TableCell>
                  <TableCell className="px-2 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm">
                    {item.manufacturerId}
                  </TableCell>
                  <TableCell className="px-2 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm md:table-cell">
                    {item.contactPerson}
                  </TableCell>
                  <TableCell className="px-2 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm lg:table-cell">
                    {item.state}
                  </TableCell>
                  <TableCell className="px-2 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm xl:table-cell">
                    {item.houseNo + " " + item.street + ", " + item.city}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          className="cursor-pointer border-gray-200 outline-none focus:ring-gray-500 focus:outline-none"
                          variant="ghost"
                          size="sm"
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
      <PaginationControls
        currentPage={currentPage}
        totalItems={data.length}
        pageSize={rowsPerPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
      />

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
    </main>
  );
}
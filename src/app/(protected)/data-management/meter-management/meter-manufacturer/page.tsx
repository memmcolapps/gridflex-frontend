"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Search, Filter, ArrowUpDown, CirclePlus, Ban, MoreVertical, Pencil } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ContentHeader } from "@/components/ui/content-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Types
interface Manufacturer {
    id: string;
    sin: string;
    manufacturerId: string;
    sgc: string;
    contactPerson: string;
    location: string;
    address: string;
}

// Component 1: AddManufacturerDialog
function AddManufacturerDialog({ isOpen, onClose, onAdd, data }: { isOpen: boolean; onClose: () => void; onAdd: (manufacturer: Manufacturer) => void; data: Manufacturer[] }) {
    const [manufacturerName, setManufacturerName] = useState("");
    const [manufacturerId, setManufacturerId] = useState("");
    const [sgc, setSgc] = useState("");
    const [contactPerson, setContactPerson] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [location, setLocation] = useState("Lagos");

    const handleAdd = () => {
        if (!manufacturerName || !manufacturerId || !contactPerson || !phoneNumber) {
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
            <DialogContent className="sm:max-w-[425px] h-auto bg-white rounded-lg shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-900">Add Manufacturer</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 py-4">
                    {/* Column 1 */}
                    <div className="space-y-2">
                        <div className="space-y-1">
                            <label htmlFor="manufacturerName" className="text-xs font-medium text-gray-700">
                                Manufacturer Name <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="manufacturerName"
                                required
                                value={manufacturerName}
                                onChange={(e) => setManufacturerName(e.target.value)}
                                className="w-full text-xs border-gray-300 focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50"
                            />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="sgc" className="text-xs font-medium text-gray-700">
                                Manufacturer SGC
                            </label>
                            <Input
                                id="sgc"
                                value={sgc}
                                onChange={(e) => setSgc(e.target.value)}
                                className="w-full text-xs border-gray-300 focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50"
                            />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="contactPerson" className="text-xs font-medium text-gray-700">
                                Contact Person <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="contactPerson"
                                required
                                value={contactPerson}
                                onChange={(e) => setContactPerson(e.target.value)}
                                className="w-full text-xs border-gray-300 focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50"
                            />
                        </div>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-2">
                        <div className="space-y-1">
                            <label htmlFor="manufacturerId" className="text-xs font-medium text-gray-700">
                                Manufacturer ID <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="manufacturerId"
                                required
                                type="number"
                                placeholder="e.g. 123456"
                                value={manufacturerId}
                                onChange={(e) => setManufacturerId(e.target.value)}
                                className={`mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 
                                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                            />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="location" className="text-xs font-medium text-gray-700">
                                State
                            </label>
                            <Select value={location} onValueChange={setLocation}>
                                <SelectTrigger className="w-full text-xs border-gray-300 focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50 h-9">
                                    <SelectValue placeholder="Select State" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Lagos" className="text-xs">Lagos</SelectItem>
                                    <SelectItem value="Ogun" className="text-xs">Ogun</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="phoneNumber" className="text-xs font-medium text-gray-700">
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
                                className={`mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 
                                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter className="pt-4">
                    <Button variant="outline"
                        onClick={onClose}
                        size={"lg"}
                        className="mr-2 h-8 text-xs bg-transparent text-[#161CCA] border-[#161CCA]">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAdd}
                        size={"lg"}
                        className="h-8 text-xs bg-[#161CCA] text-white hover:bg-[#161CCA]/90"
                        disabled={!manufacturerName || !manufacturerId || !contactPerson || !phoneNumber}
                    >
                        Add
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// Component 2: ManufacturersPage
export default function ManufacturersPage() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [data, setData] = useState<Manufacturer[]>([
        { id: "01", sin: "Mommas", manufacturerId: "62", sgc: "999962", contactPerson: "Engr Mudashiru", location: "Ogun", address: "KM 40, Lagos/Ibadan Exp. way, Ogun" },
        { id: "02", sin: "Mojec", manufacturerId: "62", sgc: "999962", contactPerson: "Richard", location: "Lagos", address: "KM 40, Lagos/Ibadan Exp. way, Ogun" },
        { id: "03", sin: "Heixing", manufacturerId: "62", sgc: "999962", contactPerson: "Oluyemi", location: "Ogun", address: "KM 40, Lagos/Ibadan Exp. way, Ogun" },
    ]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const totalPages = Math.ceil(data.length / rowsPerPage);
    const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const onPageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const onRowsPerPageChange = (value: number) => {
        setRowsPerPage(value);
        setCurrentPage(1); // Reset to first page when rows per page changes
    };

    const handleAddManufacturer = (newManufacturer: Manufacturer) => {
        setData((prevData) => [...prevData, newManufacturer]);
    };

    return (
        <main className="p-4 sm:p-6 h-full overflow-hidden">
    {/* Header */}
    <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <ContentHeader
                title="Manufacturer"
                description="Manage and Access Manufacturers."
            />
            <Button
                className="bg-[#161CCA] text-white hover:bg-[#161CCA]/90 px-3 py-1.5 sm:px-4 sm:py-2 rounded-md w-full sm:w-auto"
                onClick={() => setIsDialogOpen(true)}
                size="lg"
            >
                <CirclePlus size={14} strokeWidth={2.3} className="mr-2" /> 
                <span className="hidden sm:inline">Add Manufacturer</span>
                <span className="sm:hidden">Add</span>
            </Button>
        </div>
    </div>

    {/* Search and Filter Section */}
    <Card className="p-3 sm:p-4 mb-4 sm:mb-6 border-none shadow-none bg-white">
        <div className="flex flex-col gap-3 sm:flex-row justify-between items-start sm:items-center w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-[250px] lg:w-[300px]">
                    <Search
                        size={14}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                    />
                    <Input
                        type="text"
                        placeholder="Search manufacturers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full border-gray-300 focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50 text-sm sm:text-base"
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" className="gap-2 border-gray-300 w-1/2 sm:w-auto">
                        <Filter className="text-gray-500" size={14} />
                        <span className="hidden sm:inline text-gray-800">Filter</span>
                    </Button>
                    <Button variant="outline" className="gap-2 border-gray-300 w-1/2 sm:w-auto">
                        <ArrowUpDown className="text-gray-500" size={14} />
                        <span className="hidden sm:inline text-gray-800">Sort</span>
                    </Button>
                </div>
            </div>
        </div>
    </Card>

    {/* Table */}
    <Card className="border-none h-[calc(100%-220px)] sm:h-[calc(100%-200px)] shadow-none bg-white overflow-x-auto">
        <div className="min-w-[800px]">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableHead className="w-[40px] sm:w-[50px] px-2 sm:px-4 py-2 sm:py-3 text-left">
                            <Checkbox className="h-4 w-4 border-gray-500" />
                        </TableHead>
                        <TableHead className="min-w-[60px] sm:min-w-[100px] px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">S/N</TableHead>
                        <TableHead className="min-w-[120px] sm:min-w-[150px] px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Manufacturer</TableHead>
                        <TableHead className="min-w-[100px] sm:min-w-[120px] px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">ID</TableHead>
                        <TableHead className="min-w-[80px] sm:min-w-[100px] px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden sm:table-cell">SGC</TableHead>
                        <TableHead className="min-w-[100px] sm:min-w-[150px] px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden md:table-cell">Contact</TableHead>
                        <TableHead className="min-w-[80px] sm:min-w-[100px] px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden lg:table-cell">Location</TableHead>
                        <TableHead className="min-w-[120px] sm:min-w-[200px] px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden xl:table-cell">Address</TableHead>
                        <TableHead className="min-w-[60px] sm:min-w-[80px] px-2 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-semibold text-gray-700">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedData.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={9} className="h-24 text-center text-xs sm:text-sm text-gray-500">
                                No data available
                            </TableCell>
                        </TableRow>
                    ) : (
                        paginatedData.map((item) => (
                            <TableRow key={item.id} className="hover:bg-gray-50">
                                <TableCell className="px-2 sm:px-4 py-2 sm:py-3">
                                    <Checkbox className="h-4 w-4 border-gray-500" />
                                </TableCell>
                                <TableCell className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900">{item.id}</TableCell>
                                <TableCell className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900">{item.sin}</TableCell>
                                <TableCell className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900">{item.manufacturerId}</TableCell>
                                <TableCell className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900 hidden sm:table-cell">{item.sgc}</TableCell>
                                <TableCell className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900 hidden md:table-cell">{item.contactPerson}</TableCell>
                                <TableCell className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900 hidden lg:table-cell">{item.location}</TableCell>
                                <TableCell className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900 hidden xl:table-cell">{item.address}</TableCell>
                                <TableCell className="px-4 py-3 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button className="border-gray-500 outline-none focus:outline-none focus:ring-gray-500" variant="ghost" size="sm">
                                                    <MoreVertical size={16} className="text-gray-500" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 bg-white shadow-lg">
                                                <DropdownMenuItem
                                                    className="flex items-center gap-2"
                                                    onClick={() => alert("Edit action triggered")}
                                                >
                                                    <Pencil size={14} className="text-gray-500" />
                                                    <span className="text-sm text-gray-700">Edit Manufacturer</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="flex items-center gap-2"
                                                    onClick={() => alert("Deactivate action triggered")}
                                                >
                                                    <Ban size={16} className="text-gray-500" />
                                                    <span className="text-sm text-gray-700">Deactivate</span>
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
    </Card>

    {/* Pagination */}
    <div className="flex flex-col sm:flex-row justify-between items-center py-3 px-4 sm:py-4 sm:px-6 text-xs sm:text-sm text-gray-600 gap-3 sm:gap-0">
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <span className="whitespace-nowrap">Rows per page</span>
            <Select value={rowsPerPage.toString()} onValueChange={(value) => onRowsPerPageChange(parseInt(value))}>
                <SelectTrigger className="w-16 border-gray-300">
                    <SelectValue placeholder={rowsPerPage} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="cursor-pointer px-2 sm:px-3"
            >
                Previous
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages || data.length === 0}
                className="cursor-pointer px-2 sm:px-3"
            >
                Next
            </Button>
        </div>
    </div>
    
    {/* Add Manufacturer Dialog */}
    <AddManufacturerDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAdd={handleAddManufacturer}
        data={data}
    />
</main>
    );
}
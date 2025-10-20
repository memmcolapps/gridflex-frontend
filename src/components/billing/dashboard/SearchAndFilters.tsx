import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface SearchAndFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedModeOfPayment: string;
  setSelectedModeOfPayment: (mode: string) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedModeOfPayment,
  setSelectedModeOfPayment,
  selectedYear,
  setSelectedYear,
}) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative">
        <Search
          size={10}
          strokeWidth={2.75}
          className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500"
          aria-hidden="true"
        />
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by meter no., account no., ..."
          className="rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 md:w-[300px]"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Select
          value={selectedModeOfPayment}
          onValueChange={setSelectedModeOfPayment}
        >
          <SelectTrigger className="w-full cursor-pointer transition-all duration-200 hover:text-gray-700">
            <SelectValue placeholder="Mode Of Payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="manual">Manual</SelectItem>
            <SelectItem value="API">API</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
            <SelectItem value="2021">2021</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

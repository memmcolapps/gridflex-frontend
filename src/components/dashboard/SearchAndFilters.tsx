import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useBand } from "@/hooks/use-band";
import { useAuth } from "@/context/auth-context";

interface SearchAndFiltersProps {
  selectedBand: string;
  setSelectedBand: (band: string) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  selectedMeterCategory: string;
  setSelectedMeterCategory: (category: string) => void;
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  selectedBand,
  setSelectedBand,
  selectedYear,
  setSelectedYear,
  selectedMeterCategory,
  setSelectedMeterCategory,
}) => {
  const [loading] = useState(false);
  const { bands } = useBand();
  const { user } = useAuth();

  // Generate years from user creation year to current year
  const currentYear = new Date().getFullYear();
  const userCreatedYear = user?.createdAt ? new Date(user.createdAt).getFullYear() : 2021;
  const years = Array.from({ length: currentYear - userCreatedYear + 1 }, (_, i) => (userCreatedYear + i).toString());

  // Reset selectedBand if it's not a valid option (e.g., during loading or if no bands are available)
  useEffect(() => {
    if (loading || bands.length === 0) {
      // If loading or no bands are available, clear the selectedBand to show the placeholder
      if (selectedBand !== "") {
        setSelectedBand("");
      }
    } else {
      // If bands are loaded but selectedBand is not a valid band, reset it
      const isValidBand = bands.some(
        (bandItem) => bandItem.name === selectedBand,
      );
      if (selectedBand && !isValidBand) {
        setSelectedBand("");
      }
    }
  }, [loading, bands, selectedBand, setSelectedBand]);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <Select
          value={selectedBand}
          onValueChange={setSelectedBand}
          disabled={loading || bands.length === 0}
        >
          <SelectTrigger className="ring-gray-300/1-0 w-full cursor-pointer transition-all duration-200 hover:text-gray-700">
            <SelectValue placeholder={loading ? "Loading bands..." : "Band"} />
          </SelectTrigger>
          <SelectContent>
            {bands.length > 0 ? (
              bands.map((bandItem) => (
                <SelectItem key={bandItem.id} value={bandItem.name}>
                  {bandItem.name}
                </SelectItem>
              ))
            ) : loading ? (
              <SelectItem value="loading" disabled>
                Loading...
              </SelectItem>
            ) : (
              <SelectItem value="no-bands" disabled>
                No bands available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="Year">{selectedYear}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedMeterCategory} onValueChange={setSelectedMeterCategory}>
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="Meter Category">
              {selectedMeterCategory}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Prepaid">Prepaid</SelectItem>
            <SelectItem value="Postpaid">Postpaid</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import type { Band } from '@/service/band-service'; // Adjust the import path as needed
import { fetchBands } from '@/service/band-service'; // Adjust the import path as needed

interface SearchAndFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedBand: string;
    setSelectedBand: (band: string) => void;
    selectedYear: string;
    setSelectedYear: (year: string) => void;
    selectedMeterType: string;
    setSelectedMeterType: (type: string) => void;
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    selectedBand,
    setSelectedBand,
    selectedYear,
    setSelectedYear,
    selectedMeterType,
    setSelectedMeterType,
}) => {
    const [bands, setBands] = useState<Band[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch bands when the component mounts
    useEffect(() => {
        const loadBands = async () => {
            setLoading(true);
            const fetchedBands = await fetchBands();
            setBands(fetchedBands);
            setLoading(false);
        };
        loadBands();
    }, []);

    // Reset selectedBand if it's not a valid option (e.g., during loading or if no bands are available)
    useEffect(() => {
        if (loading || bands.length === 0) {
            // If loading or no bands are available, clear the selectedBand to show the placeholder
            if (selectedBand !== "") {
                setSelectedBand("");
            }
        } else {
            // If bands are loaded but selectedBand is not a valid band, reset it
            const isValidBand = bands.some(bandItem => bandItem.name === selectedBand);
            if (selectedBand && !isValidBand) {
                setSelectedBand("");
            }
        }
    }, [loading, bands, selectedBand, setSelectedBand]);

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative">
                <Search
                    size={10}
                    strokeWidth={2.75}
                    className="text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                />
                <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by meter no., account no., ..."
                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md md:w-[300px]"
                />
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                <Select value={selectedBand} onValueChange={setSelectedBand} disabled={loading || bands.length === 0}>
                    <SelectTrigger className="w-full ring-gray-300/1-0 cursor-pointer hover:text-gray-700 transition-all duration-200">
                        <SelectValue placeholder={loading ? "Loading bands..." : "Band"} />
                    </SelectTrigger>
                    <SelectContent>
                        {bands.length > 0 ? (
                            bands.map((bandItem) => (
                                <SelectItem key={bandItem.id} value={bandItem.name}>
                                    {bandItem.name}
                                </SelectItem>
                            ))
                        ) : (
                            loading ? (
                                <SelectItem value="loading" disabled>
                                    Loading...
                                </SelectItem>
                            ) : (
                                <SelectItem value="no-bands" disabled>
                                    No bands available
                                </SelectItem>
                            )
                        )}
                    </SelectContent>
                </Select>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-full cursor-pointer">
                        <SelectValue placeholder="Year">{selectedYear}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                        <SelectItem value="2021">2021</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={selectedMeterType} onValueChange={setSelectedMeterType}>
                    <SelectTrigger className="w-full cursor-pointer">
                        <SelectValue placeholder="Meter Type">{selectedMeterType}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Prepaid">Prepaid</SelectItem>
                        <SelectItem value="Postpaid">Postpaid</SelectItem>
                        <SelectItem value="Smart">Smart</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};
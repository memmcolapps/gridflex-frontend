import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative">
                <Search
                    size={16}
                    strokeWidth={2.75}
                    className="text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
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
                <Select value={selectedBand} onValueChange={setSelectedBand}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Band">{selectedBand}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Band A">Band A</SelectItem>
                        <SelectItem value="Band B">Band B</SelectItem>
                        <SelectItem value="Band C">Band C</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Year">{selectedYear}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                        <SelectItem value="2021">2021</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={selectedMeterType} onValueChange={setSelectedMeterType}>
                    <SelectTrigger className="w-full">
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
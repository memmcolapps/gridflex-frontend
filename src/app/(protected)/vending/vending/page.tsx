import { Button } from "@/components/ui/button";
import { ContentHeader } from "@/components/ui/content-header";
import VendTokenDialog from "@/components/vending/vending-dialog";
import VendingTable from "@/components/vending/vending-table";
import { ArrowUpDown, ListFilter, Search, SquareArrowOutUpRight } from "lucide-react";

export default function VendingPage() {
    return (
        <div className="">
            {/* header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <ContentHeader
                    title="Vending"
                    description="Vend for all token types"
                />
                <div className="flex flex-col md:flex-row gap-2">
                    <VendTokenDialog />
                </div>
            </div>
            {/* Search and filter section */}
            <div className="mb-8 flex items-center justify-between">
                <div className="mb-8 flex items-center gap-10">
                    <div className="flex w-[219px] gap-2 rounded-md border border-[rgba(228,231,236,1)] px-3 py-2">
                        <Search
                            size={14}
                            strokeWidth={2.75}
                            className="ml-2 text-gray-500"
                        />
                        <input
                            type="text"
                            placeholder="Search by name, cont..."
                            className="w-full flex-grow border-none text-sm text-[rgba(95,95,95,1)] placeholder-[rgba(95,95,95,1)] outline-none"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button className="flex cursor-pointer items-center gap-2 rounded-md border border-[rgba(228,231,236,1)] px-4 py-2 text-sm text-gray-700 focus:outline-none">
                            <ListFilter size={14} />
                            Filter
                        </Button>
                        <Button className="flex cursor-pointer items-center gap-2 rounded-md border border-[rgba(228,231,236,1)] px-4 py-2 text-sm text-gray-700 focus:outline-none">
                            <ArrowUpDown size={14} />
                            Sort
                        </Button>
                    </div>
                </div>
                <div className="flex gap-5">
                    <Button
                        variant={"default"}
                        className="text-md cursor-pointer gap-2 border px-8 py-5 font-semibold text-[rgba(22,28,202,1)]"
                    >
                        <SquareArrowOutUpRight size={14} />
                        Export
                    </Button>
                </div>
            </div>
            {/* Table section */}
            <VendingTable />
        </div>
    );
}
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { SelectTrigger } from "@radix-ui/react-select";
import { Printer } from "lucide-react";
import { type ReactNode } from "react";

interface ReportContainerProps {
    title: string;
    children: ReactNode;
}

const FILTER = [{ accord: "CSV" }, { accord: "XLSX" }, { accord: "PDF" }];

export default function FeederContainer({
    title,
    children
}: ReportContainerProps) {
    return (
        <div>
            <div className="flex justify-between mt-10 items-center mb-8">
                <div className="flex flex-col gap-1">
                    <span className="text-3xl font-semibold text-black">
                        {title}
                    </span>
                </div>
                <div>
                    <Select>
                        <SelectTrigger
                            className="border-[#161CCA] flex items-center justify-center border gap-2 w-36 rounded-lg h-14 text-[#161CCA] cursor-pointer"
                        >
                            <Printer size={14} color="#161CCA" strokeWidth={1.75} />
                            Export
                        </SelectTrigger>
                        <SelectContent>
                            {FILTER.map((accord, index) => (
                                <SelectItem className="[&>svg]:hidden border-b border-gray-200 rounded-none py-3" key={index} value={accord.accord}>
                                    {accord.accord}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div>
                {children}
            </div>
        </div>
    )
}
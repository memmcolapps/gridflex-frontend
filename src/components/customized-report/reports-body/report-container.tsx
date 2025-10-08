import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { type ReactNode } from "react";

interface ReportContainerProps {
    title: string;
    children: ReactNode;
}

export default function ReportContainer({
    title,
    children
}: ReportContainerProps) {
    return (
        <div>
            <div className="flex justify-between mt-10 items-center mb-6">
                <div className="flex flex-col gap-1">
                    <span className="text-2xl font-semibold text-black">
                        {title}
                    </span>
                    <span className="text-gray-600">
                        Region.: All
                    </span>
                </div>
                <div>
                    <Button
                        variant="outline"
                        size="lg"
                        className="border-[#161CCA] gap-2 w-36 h-14 text-[#161CCA] cursor-pointer"
                    >
                        <Printer size={14} color="#161CCA" strokeWidth={1.75} />
                        Export
                    </Button>
                </div>
            </div>
            <div>
                {children}
            </div>
        </div>
    )
}
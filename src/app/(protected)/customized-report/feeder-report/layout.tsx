"use client";

import { useState } from "react";
import { DatePicker } from "@/components/customized-report/date-picker";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContentHeader } from "@/components/ui/content-header";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    ArrowUpDown,
    Building2,
    Check,
    ChevronDown,
    CirclePlus,
    Cylinder,
    Grid2x2,
    Lightbulb,
    ListFilter,
    Search,
    Wrench,
    Zap,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import FeederReportTable from "./feeder-table";
import { Spinner } from "@/components/ui/spinner";
import { Progress } from "@/components/ui/progress";
import CustomReportTable from "../../frequently-used-reports/page";

const FILTER = [{ accord: "opt 1" }, { accord: "opt 2" }, { accord: "opt 3" }];
const options = [
    { label: "Region", icon: Grid2x2 },
    { label: "Business Hub", icon: Building2 },
    { label: "Service Center", icon: Wrench },
    { label: "Substation", icon: Cylinder },
    { label: "Feeder Line", icon: Zap },
    { label: "Distribution Substation (DSS)", icon: Lightbulb },
];

export default function FeederReport() {
    const [generateBy, setGenerateBy] = useState("Region");
    const [unit, setUnit] = useState("Select All");
    const [loading, setLoading] = useState(false)
    const [showTable, setShowTable] = useState(false)
    const [progress, setProgress] = useState(0)
    const [activeTab, setActiveTab] = useState<"frequent" | "custom">("frequent");

    const handleGenerate = () => {
        setLoading(true)
        setShowTable(false)

        let value = 0;
        const interval = setInterval(() => {
            value += 10;
            setProgress(value)

            if (value >= 100) {
                clearInterval(interval)
                setTimeout(() => {
                    setLoading(false)
                    setShowTable(true)
                }, 500)
            }
        }, 200)
    }

    return (
        <div className="overflow-hidden p-6">
            {/* Page Header */}
            <div className="mb-4 flex items-center justify-between">
                <ContentHeader
                    title="Report Summary"
                    description="Generate tailored reports with the exact data you need."
                />
            </div>

            {/* Tabs */}
            <div className="flex flex-row justify-between">
                <div className='w-fit p-1 border border-[#161cca] rounded-lg cursor-pointer'>
                    <Button
                        className={`${activeTab === "frequent"
                            ? "bg-[#161CCA] text-white"
                            : "text-gray-700 bg-transparent"
                            } border-none cursor-pointer font-medium text-md py-4`}
                        variant="secondary"
                        size="lg"
                        onClick={() => setActiveTab("frequent")}
                    >
                        Frequently Used Reports
                    </Button>

                    <Button
                        className={`${activeTab === "custom"
                            ? "bg-[#161CCA] text-white"
                            : "text-gray-700 bg-transparent"
                            } border-none cursor-pointer font-medium text-md py-4`}
                        variant="secondary"
                        size="lg"
                        onClick={() => setActiveTab("custom")}
                    >
                        Customized Report
                    </Button>
                </div>
            </div>

            {activeTab === 'frequent' ? (
                <div>
                    {/* Filters */}
                    <Card className="mt-10 flex w-full flex-row justify-between rounded-lg border border-gray-200 px-5 py-1 shadow-none">
                        <div className="w-full p-2">
                            <h4>
                                Start date <span className="text-red-500">*</span>
                            </h4>
                            <DatePicker placeHolder={"Select Date"} />
                        </div>

                        <h4 className="self-center">to</h4>

                        <div className="w-full p-2">
                            <h4>
                                End date <span className="text-red-500">*</span>
                            </h4>
                            <DatePicker placeHolder={"Select Date"} />
                        </div>

                        {/* Generate By */}
                        <div className="w-full p-2">
                            <h4>
                                Generate By <span className="text-red-500">*</span>
                            </h4>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className="text-md mt-1 flex w-full cursor-pointer flex-row items-center justify-between border border-gray-300 px-4 py-4 font-medium text-gray-700">
                                        {generateBy}
                                        <ChevronDown size={14} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-full space-y-2 p-3 shadow-lg">
                                    {options.map(({ label, icon: Icon }) => (
                                        <DropdownMenuItem
                                            key={label}
                                            onClick={() => setGenerateBy(label)}
                                            className="flex cursor-pointer items-center gap-3 text-sm font-medium hover:bg-gray-100"
                                        >
                                            <Icon size={18} className="text-gray-600" />
                                            <span>{label}</span>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Unit */}
                        <div className="w-full p-2">
                            <h4>
                                Unit <span className="text-red-500">*</span>
                            </h4>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className="text-md mt-1 flex w-full cursor-pointer flex-row items-center justify-between border border-gray-300 px-4 py-4 font-medium text-gray-700">
                                        {unit}
                                        <ChevronDown size={14} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-90 p-3 shadow-lg">
                                    {["All Region", "Molete", "Ojoo", "Ijeun", "Eko"].map(
                                        (option) => (
                                            <DropdownMenuItem
                                                key={option}
                                                onClick={() => setUnit(option)}
                                                className="text-md flex cursor-pointer items-center justify-between py-3 font-medium"
                                            >
                                                <span>{option}</span>
                                                <div
                                                    className={`flex h-5 w-5 items-center justify-center rounded-lg border transition-colors ${unit === option
                                                        ? "border-green-500 bg-green-500"
                                                        : "border-gray-400"
                                                        }`}
                                                >
                                                    {unit === option && (
                                                        <Check
                                                            className="text-white"
                                                            size={10}
                                                            strokeWidth={3}
                                                        />
                                                    )}
                                                </div>
                                            </DropdownMenuItem>
                                        ),
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Generate Button */}
                        <Button
                            onClick={handleGenerate}
                            className="text-md mt-6 ml-4 cursor-pointer border-none bg-[#161CCA] px-10 py-6 font-medium text-white"
                            variant="secondary"
                            size="lg"
                        >
                            <CirclePlus size={13} color="#fff" strokeWidth={1.5} />
                            Generate Report
                        </Button>
                    </Card>

                    {/* Filters below */}
                    <Card className="mt-4 flex w-full flex-row items-center justify-between rounded-lg border border-gray-200 px-5 py-4 shadow-none">
                        <div className="flex w-[480px] items-center gap-4">
                            <div className="relative flex-1">
                                <Search
                                    size={14}
                                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400"
                                />
                                <Input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full border-gray-300 pl-10 text-sm focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50 lg:text-base"
                                />
                            </div>

                            {/* Filter Select */}
                            <div className="w-[90px]">
                                <Select>
                                    <SelectTrigger className="h-10 w-full justify-center bg-transparent [&>svg]:hidden">
                                        <div className="flex items-center gap-2">
                                            <ListFilter size={14} strokeWidth={1.5} />
                                            <SelectValue placeholder="Filter" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {FILTER.map((accord, index) => (
                                            <SelectItem key={index} value={accord.accord}>
                                                {accord.accord}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Sort Select */}
                            <div className="w-[70px]">
                                <Select>
                                    <SelectTrigger className="h-10 w-full justify-center bg-transparent [&>svg]:hidden">
                                        <div className="flex items-center gap-2">
                                            <ArrowUpDown size={14} strokeWidth={1.5} />
                                            <SelectValue placeholder="Sort" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {FILTER.map((accord, index) => (
                                            <SelectItem key={index} value={accord.accord}>
                                                {accord.accord}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </Card>
                    {loading && (
                        <div className="mt-4 flex flex-col items-center justify-center">
                            <Card className="p-10 bg-white border-none w-[50%]">
                                <p className="text-sm mt-2 text-center text-gray-500">
                                    {progress}%
                                </p>
                                <div className="flex justify-center items-center">
                                    <Spinner />

                                </div>
                                <Progress value={progress} className="w-full rounded-full" />
                                <p className="text-sm mt-2 text-center text-gray-500">
                                    Processing...
                                </p>
                            </Card>
                        </div>
                    )}
                    {!loading && showTable && (
                        <FeederReportTable />
                    )}
                </div>
            ) : (
                <div className="py-10">
                    <CustomReportTable />
                </div>
            )}
        </div>
    );
}
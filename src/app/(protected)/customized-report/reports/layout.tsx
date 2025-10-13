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
import CustomizedPopulation from "./customized-population";
import CustomizedTransaction from "./customized-transactions";
import CustomizedPerUnit from "./customized-per-unit";
import CustomizedPerMeter from "./customized-per-meter";
import CustomizedPerVending from "./customized-vend";

const FILTER = [{ accord: "opt 1" }, { accord: "opt 2" }, { accord: "opt 3" }];
const options = [
    { label: "Region", icon: Grid2x2  },
    { label: "Business Hub", icon: Building2 },
    { label: "Service Center", icon: Wrench },
    { label: "Substation", icon: Cylinder },
    { label: "Feeder Line", icon: Zap },
    { label: "Distribution Substation (DSS)", icon: Lightbulb },
];

export default function ReportsLayout() {
    const [reportType, setReportType] = useState<string | null>(null);
    const [generateBy, setGenerateBy] = useState("Select");
    const [unit, setUnit] = useState("Select");

    const renderReportTable = () => {
        switch (reportType) {
            case "Customer Report":
                return <CustomizedPopulation />;
            case "Customer Transaction Summary":
                return <CustomizedTransaction />;
            case "Customer Population By Unit":
                return <CustomizedPerUnit />;
            case "Customer Population By Meter Type":
                return <CustomizedPerMeter />;
            case "Customer Vending Report":
                return <CustomizedPerVending />;
            default:
                return (
                    <div className="mt-10 text-center text-gray-500">
                        Please select a report type to display results.
                    </div>
                );
        }
    };

    return (
        <div className="p-6 overflow-hidden">
            {/* Page Header */}
            <div className="flex justify-between items-center mb-4">
                <ContentHeader
                    title="Report Summary"
                    description="Generate tailored reports with the exact data you need."
                />
            </div>

            {/* Tabs */}
            <div className="flex flex-row justify-between">
                <div className="p-1 border border-[#161cca] rounded-lg cursor-pointer flex">
                    <Button
                        className="bg-[#161CCA] text-white border-none cursor-pointer font-medium text-md py-4"
                        variant="secondary"
                        size="lg"
                    >
                        Frequently Used Reports
                    </Button>
                    <Button
                        className="text-gray-700 border-none cursor-pointer font-medium py-4 text-md"
                        variant="secondary"
                        size="lg"
                    >
                        Customized Report
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card className="w-full px-5 py-1 shadow-none flex flex-row mt-10 border justify-between border-gray-200 rounded-lg">
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

                {/* Report Type */}
                <div className="w-full p-2">
                    <h4>
                        Report Type <span className="text-red-500">*</span>
                    </h4>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="border border-gray-300 mt-1 cursor-pointer font-medium text-md text-gray-700 py-4 px-4 flex flex-row justify-between items-center w-full">
                                {reportType ?? "Select"}
                                <ChevronDown size={14} />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-100 shadow-lg">
                            {[
                                "Customer Report",
                                "Customer Transaction Summary",
                                "Customer Population By Unit",
                                "Customer Population By Meter Type",
                                "Customer Vending Report",
                            ].map((option, index, arr) => (
                                <div key={option}>
                                    <DropdownMenuItem
                                        onClick={() => setReportType(option)}
                                        className="cursor-pointer text-md font-medium flex items-center justify-between py-3"
                                    >
                                        <span>{option}</span>

                                        <div
                                            className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${reportType === option
                                                    ? "bg-green-500 border-green-500"
                                                    : "border-gray-400"
                                                }`}
                                        >
                                            {reportType === option && (
                                                <Check className="text-white" size={10} strokeWidth={3} />
                                            )}
                                        </div>
                                    </DropdownMenuItem>
                                    {index < arr.length - 1 && (
                                        <hr className="my-1 border-gray-200" />
                                    )}
                                </div>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Generate By */}
                <div className="w-full p-2">
                    <h4>
                        Generate By <span className="text-red-500">*</span>
                    </h4>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="border border-gray-300 mt-1 cursor-pointer font-medium text-md text-gray-700 py-4 px-4 flex flex-row justify-between items-center w-full">
                                {generateBy}
                                <ChevronDown size={14} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full p-3 space-y-2 shadow-lg">
                            {options.map(({ label, icon: Icon }) => (
                                <DropdownMenuItem
                                    key={label}
                                    onClick={() => setGenerateBy(label)}
                                    className="flex items-center gap-3 cursor-pointer text-sm font-medium hover:bg-gray-100"
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
                            <Button className="border border-gray-300 mt-1 cursor-pointer font-medium text-md text-gray-700 py-4 px-4 flex flex-row justify-between items-center w-full">
                                {unit}
                                <ChevronDown size={14} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-90 p-3 shadow-lg">
                            {["All Region", "Molete", "Ojoo", "Ijeun", "Eko"].map((option) => (
                                <DropdownMenuItem
                                    key={option}
                                    onClick={() => setUnit(option)}
                                    className="cursor-pointer text-md font-medium flex items-center justify-between py-3"
                                >
                                    <span>{option}</span>
                                    <div
                                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${unit === option
                                                ? "bg-green-500 border-green-500"
                                                : "border-gray-400"
                                            }`}
                                    >
                                        {unit === option && (
                                            <Check className="text-white" size={10} strokeWidth={3} />
                                        )}
                                    </div>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Generate Button */}
                <Button
                    className="bg-[#161CCA] text-white border-none cursor-pointer font-medium text-md py-4 px-10 mt-6 ml-4"
                    variant="secondary"
                    size="lg"
                >
                    Generate Report
                </Button>
            </Card>

            {/* Filters below */}
            <Card className="w-full px-5 py-0 shadow-none flex flex-row mt-4 border justify-between border-gray-200 rounded-lg">
                <div className="mt-6 mb-6 flex items-center justify-between overflow-visible">
                    <div className="flex gap-4 overflow-visible">
                        <div className="flex items-center gap-2">
                            <div className="relative w-full lg:w-[300px]">
                                <Search
                                    size={14}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                                />
                                <Input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 w-full border-gray-300 focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50 text-sm lg:text-base"
                                />
                            </div>
                        </div>

                        <Select>
                            <SelectTrigger className="w-full flex justify-center h-10 [&>svg]:hidden">
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

                        <Select>
                            <SelectTrigger className="w-full bg-transparent flex justify-center h-10 [&>svg]:hidden">
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

            {/* Render report table here */}
            {renderReportTable()}
        </div>
    );
}

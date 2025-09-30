// app/communication-report/page.tsx
"use client";
import { BillingReport } from '@/components/report-summary/billing-report';
import { GeneralReport } from '@/components/report-summary/general-report';
import { MeteringTechnicalReport } from '@/components/report-summary/metering-technical-report';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ContentHeader } from '@/components/ui/content-header';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Calendar, ChevronDown } from 'lucide-react';

export default function CustomizedReportPage() {

    return (
        <div className="p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-4">
                <ContentHeader
                    title="Report Summary"
                    description="Select the type of report you want to generate. You'll be able to filter and preview on the next page."
                />
            </div>


            <div className='flex flex-row justify-between'>
                <div className='w-fit p-1 border border-[#161cca] rounded-lg cursor-pointer'>
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
            <Card className='w-full flex flex-row p-2 mt-6 border justify-between border-gray-200 rounded'>
                <div className='w-fit p-2'>
                    <h4>Start date <span className='text-red-500'>*</span></h4>
                    <Button
                        className='border border-gray-300 mt-1 cursor-pointer font-medium text-md text-gray-700 py-4 px-10'>
                        <Calendar size={14} />
                        Select Date
                    </Button>
                </div>
                <h4 className='self-center'>
                    to
                </h4>
                <div className='w-fit p-2'>
                    <h4>End date</h4>
                    <Button
                        className='border border-gray-300 mt-1 cursor-pointer font-medium text-md text-gray-700 py-4 px-10'>
                        <Calendar size={14} />
                        Select Date
                    </Button>
                </div>
                <div className='w-fit p-2'>
                    <h4>Report Type <span className='text-red-500'>*</span></h4>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                className='border border-gray-300 mt-1 cursor-pointer font-medium text-md text-gray-700 py-4 px-10 flex flex-row gap-2 items-center'>
                                Select
                                <ChevronDown size={14} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full p-3 shadow-lg">
                            <DropdownMenuItem
                                className="cursor-pointer text-md font-medium"
                            >
                                Customer Report
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer text-md font-medium"
                            >
                                Customer Transaction Summary
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer text-md font-medium"
                            >
                                Customer Population By Unit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer text-md font-medium"
                            >
                                Customer Population By Meter Type
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer text-md font-medium"
                            >
                                Customer Vending Report
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className='w-fit p-2'>
                    <h4>Generate By <span className='text-red-500'>*</span></h4>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                className='border border-gray-300 mt-1 cursor-pointer font-medium text-md text-gray-700 py-4 px-10 flex flex-row gap-2 items-center'>
                                Select
                                <ChevronDown size={14} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full p-3 shadow-lg">
                            <DropdownMenuItem
                                className="cursor-pointer text-md font-medium"
                            >
                                Region
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer text-md font-medium"
                            >
                                Business Hub
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer text-md font-medium"
                            >
                                Service Center
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer text-md font-medium"
                            >
                                Substation
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer text-md font-medium"
                            >
                                Feeder Line
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer text-md font-medium"
                            >
                                Distribution Substation (DSS)
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className='w-fit p-2'>
                    <h4>Unit <span className='text-red-500'>*</span></h4>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                className='border border-gray-300 mt-1 cursor-pointer font-medium text-md text-gray-700 py-4 px-10 flex flex-row gap-2 items-center'>
                                Select
                                <ChevronDown size={14} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full p-3 shadow-lg">
                            <DropdownMenuItem
                                className="cursor-pointer text-md font-medium"
                            >
                                All Region
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer text-md font-medium"
                            >
                                Molete
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer text-md font-medium"
                            >
                                Ojoo
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer text-md font-medium"
                            >
                                Ijeun
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer text-md font-medium"
                            >
                                Eko
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <Button
                className='bg-[#161CCA] text-white border-none cursor-pointer font-medium text-md py-4 px-10 mt-6 ml-4'
                variant="secondary"
                size="lg"
                >
                    Generate Report
                </Button>
            </Card>
            <div>
                <div className='mt-10'>
                    <GeneralReport />
                </div>
                <div className='mt-10'>
                    <BillingReport />
                </div>
                <div className='mt-10'>
                    <MeteringTechnicalReport />
                </div>
            </div>
        </div>
    );
}
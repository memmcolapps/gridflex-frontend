'use client'

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { GeneralReport } from "@/components/report-summary/general-report";
import { BillingReport } from "@/components/report-summary/billing-report";
import { MeteringTechnicalReport } from "@/components/report-summary/metering-technical-report";
import CustomReportTable from "../frequently-used-reports/page";
import { ContentHeader } from "@/components/ui/content-header";


const CustomizedReportPage = () => {
    const [activeTab, setActiveTab] = useState<"frequent" | "custom">("frequent");

    return (
        <div className="p-6 px-0 max-w-full overflow-hidden sm:max-x- md:max-w-[990px] lg:max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
            <div className="flex justify-between items-center mb-4">
                <ContentHeader
                    title="Report Summary"
                    description="Select the type of report you want to generate. You'll be able to filter and preview on the next page."
                />
            </div>

            <div className='flex flex-row justify-between'>
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

            <div className="mt-10">
                {activeTab === "frequent" ? (
                    <div className="w-full sm:max-w-full md:max-w-[980px] lg:max-w-[1440px]">
                        <div className="mt-10">
                            <GeneralReport />
                        </div>
                        <div className="mt-10 overflow-x-auto ">
                            <BillingReport />
                        </div>
                        <div className="mt-10 overflow-x-auto scrollbar-hide">
                            <MeteringTechnicalReport />
                        </div>
                    </div>
                ) : (
                    <div>
                        <CustomReportTable />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomizedReportPage;

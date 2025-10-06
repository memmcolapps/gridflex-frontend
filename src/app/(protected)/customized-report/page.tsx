// app/communication-report/page.tsx
"use client";
import { BillingReport } from '@/components/report-summary/billing-report';
import { GeneralReport } from '@/components/report-summary/general-report';
import { MeteringTechnicalReport } from '@/components/report-summary/metering-technical-report';
import { Button } from '@/components/ui/button';
import { ContentHeader } from '@/components/ui/content-header';

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
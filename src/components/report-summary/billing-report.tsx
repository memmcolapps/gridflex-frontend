import { ChartLine, Printer, Wallet, WalletCards } from "lucide-react";
import { Card } from "../ui/card";
import { useRouter } from "next/navigation";

export function BillingReport(){
    const router = useRouter()
    return(
        <div className="text-nowrap">
                <h3 className='text-3xl font-semibold text-gray-700 p-2'>
                    Billing Reports
                </h3>
                <div className='w-fit p-2 flex flex-row gap-5'>
                    <Card onClick={() => router.push('/customized-report/current-billing')} className='w-90 shadow-none px-6 py-12 border border-gray-200 rounded-lg cursor-pointer'>
                        <div className='flex flex-row gap-2 text-gray-700 font-semibold text-2xl'>
                            <WalletCards size={20} />
                            Current Billing Revenue
                        </div>
                        <h3 className='text-md font-medium text-gray-500'>
                            Track Billing Revenue
                        </h3>
                    </Card>
                    <Card onClick={() => router.push('/customized-report/payment-search')} className='w-90 shadow-none px-6 py-12 border border-gray-200 rounded-lg cursor-pointer'>
                        <div className='flex flex-row gap-2 text-gray-700 font-semibold text-2xl'>
                            <Wallet size={20} />
                            Payment Search
                        </div>
                        <h3 className='text-md font-medium text-gray-500'>
                            Search Payment By Customer
                        </h3>
                    </Card>
                    <Card className='w-90 shadow-none px-6 py-12  border border-gray-200 rounded-lg cursor-pointer'>
                        <div className='flex flex-row gap-2 text-gray-700 font-semibold text-2xl'>
                            <ChartLine size={20} />
                            Adjustment Details
                        </div>
                        <h3 className='text-md font-medium text-gray-500'>
                            View Billing Adjustments
                        </h3>
                    </Card>
                    <Card className='w-90 shadow-none px-6 py-12  border border-gray-200 rounded-lg cursor-pointer'>
                        <div className='flex flex-row gap-2 text-gray-700 font-semibold text-2xl'>
                            <Printer size={20} />
                            Unprinted Bills
                        </div>
                        <h3 className='text-md font-medium text-gray-500'>
                            List Of Unprinted Bills
                        </h3>
                    </Card>
                </div>
            </div>
    )
}
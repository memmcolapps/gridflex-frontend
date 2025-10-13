import { ChartColumnBig, Users, WalletMinimal } from "lucide-react";
import { Card } from "../ui/card";
import { useRouter } from "next/navigation";

export function GeneralReport() {
    const router = useRouter()
    return (
        <div>
            <h3 className='text-3xl font-semibold text-gray-700 p-2'>
                General Reports
            </h3>
            <div className='w-fit p-2 flex flex-row gap-3'>
                <Card onClick={() => router.push('/customized-report/reports')} className='w-90 shadow-none px-8 py-12 border flex justify-start border-gray-200 rounded-lg cursor-pointer'>
                    <div className='flex flex-row gap-2 items-center text-gray-700 font-semibold text-2xl'>
                        <ChartColumnBig size={20} />
                        Customer Population
                    </div>
                    <h3 className='text-md font-medium text-gray-500'>
                        By Location or Meter Type
                    </h3>
                </Card>
                <Card className='w-90 shadow-none px-8 py-12 border border-gray-200 rounded-lg cursor-pointer'>
                    <div className='flex flex-row gap-2 items-center text-gray-700 font-semibold text-2xl'>
                        <WalletMinimal size={20} />
                        Daily Sales
                    </div>
                    <h3 className='text-md font-medium text-gray-500'>
                        Summary Of Daily Vending
                    </h3>
                </Card>
                <Card className='w-90 shadow-none px-8 py-12 border border-gray-200 rounded-lg cursor-pointer'>
                    <div className='flex flex-row gap-2 items-center text-gray-700 font-semibold text-2xl'>
                        <Users size={20} />
                        Operator Report
                    </div>
                    <h3 className='text-md font-medium text-gray-500'>
                        performance by Operator
                    </h3>
                </Card>
            </div>
        </div>
    )
}
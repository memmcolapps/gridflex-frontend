"use client";
import { ModeOfPaymentTable } from "@/components/mode-of-payment/mode-of-payment-table";
import { SetPaymentDialog } from "@/components/mode-of-payment/set-payment-dailog";
import { Button } from "@/components/ui/button";
import { ContentHeader } from "@/components/ui/content-header";
import { WalletCards } from "lucide-react";

export default function ModeOfPaymentPage() {
    const handleSave = (data: {
        meterNumber: string;
        debitModeOfPayment: string;
        debitPercentage: string;
        creditModeOfPayment: string;
        creditPercentage: string;
    }) => {
        console.log("Saved data:", data);
        // Add your save logic here (e.g., API call or state update)
    };

    return (
        <div className="min-h-screen w-full">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl w-full space-y-6 bg-white">
                <div className="flex flex-col sm:flex-row justify-between items-start pt-4 sm:pt-6">
                    <ContentHeader
                        title="Mode Of Payment"
                        description="Set the mode for all debts"
                        className="w-full sm:w-auto"
                    />
                    <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
                        <Button
                            variant="outline"
                            size={"lg"}
                            className="flex items-center justify-center w-full sm:w-auto border-[rgba(22,28,202,1)] text-[rgba(22,28,202,1)] cursor-pointer text-sm sm:text-base py-2 px-4"
                        >
                            <WalletCards size={14} className="mr-2" />
                            Bulk Set
                        </Button>
                        <SetPaymentDialog
                            onSave={handleSave}
                            asChild
                        >
                            <Button
                                variant="outline"
                                size={"lg"}
                                className="flex items-center justify-center w-full sm:w-auto bg-[rgba(22,28,202,1)] text-white cursor-pointer text-sm sm:text-base py-2 px-4"
                            >
                                <WalletCards size={14} className="mr-2" />
                                Set Payment
                            </Button>
                        </SetPaymentDialog>
                    </div>
                </div>
            </div>
            <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl w-full">
                <ModeOfPaymentTable />
            </div>
        </div>
    );
}
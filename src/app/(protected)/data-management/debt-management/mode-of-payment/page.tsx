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
        <div className="min-h-screen">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl space-y-6 border-none bg-white">
                <div className="flex justify-between items-start pt-6">
                    <ContentHeader
                        title="Mode Of Payment"
                        description="Set the mode for all debts"
                    />
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size={"lg"}
                            className="flex border-[rgba(22,28,202,1)] text-[rgba(22,28,202,1)] items-center cursor-pointer"
                        >
                            <WalletCards size={14} />
                            Bulk Set
                        </Button>
                        <SetPaymentDialog
                            onSave={handleSave}
                            asChild
                        >
                        </SetPaymentDialog>
                    </div>
                </div>
            </div>
            <ModeOfPaymentTable />
        </div>
    );
}
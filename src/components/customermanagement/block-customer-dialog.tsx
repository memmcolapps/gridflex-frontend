// components/customers/block-customer-dialog.tsx

"use client";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { type Customer } from "@/types/customer-types";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useBlockCustomer } from "@/hooks/use-customer";
import { useQueryClient } from "@tanstack/react-query";

interface BlockCustomerDialogProps {
    isBlockOpen: boolean;
    setIsBlockOpen: (open: boolean) => void;
    isConfirmBlockOpen: boolean;
    setIsConfirmBlockOpen: (open: boolean) => void;
    customer: Customer | null;
    blockReason: string;
    setBlockReason: (reason: string) => void;
    onConfirmBlock: () => void;
}

export default function BlockCustomerDialog({
    isBlockOpen,
    setIsBlockOpen,
    isConfirmBlockOpen,
    setIsConfirmBlockOpen,
    customer,
    blockReason,
    setBlockReason,
    onConfirmBlock,
}: BlockCustomerDialogProps) {
    const queryClient = useQueryClient();
    const blockMutation = useBlockCustomer();

    const blockReasons = [
        "Abusive behavior",
        "Spam messages",
        "Fraudulent activity",
        "Policy violation",
        "Other",
    ];

    const handleBlockAction = async () => {
        if (!customer) return;

        try {
            await blockMutation.mutateAsync({ customerId: customer.id, reason: blockReason });
            toast.success("Customer blocked successfully!");
            queryClient.invalidateQueries({ queryKey: ["customers"] });
            onConfirmBlock();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "An unknown error occurred.");
        } finally {
            setIsConfirmBlockOpen(false);
            setIsBlockOpen(false);
            setBlockReason("");
        }
    };

    // The component will now always render, but the content will be null if no customer exists.
    if (!customer) {
        return null;
    }

    return (
        <>
            <AlertDialog open={isBlockOpen} onOpenChange={setIsBlockOpen}>
                <AlertDialogContent className="bg-white max-w-sm rounded-xl p-10 border-gray-500 h-fit">
                    <AlertDialogCancel asChild>
                        <button
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                            onClick={() => {
                                setIsBlockOpen(false);
                                setBlockReason("");
                            }}
                        >
                            <X size={16} className="text-gray-700 cursor-pointer" />
                        </button>
                    </AlertDialogCancel>
                    <div className="flex flex-col space-y-4 mt-10">
                        <AlertDialogHeader className="space-y-1">
                            <AlertDialogTitle className="text-lg font-semibold">
                                Block {customer.firstName}
                            </AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="space-y-2">
                            <div className="w-full">
                                <Label htmlFor="blockReason" className="text-sm font-medium text-gray-700">
                                    Reason
                                </Label>
                                <div>
                                    <div className="relative">
                                        <select
                                            id="blockReason"
                                            value={blockReason}
                                            onChange={(e) => setBlockReason(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-ring focus:border-ring bg-background text-foreground ring-gray-50/10"
                                            required
                                        >
                                            <option value="">Select a reason to block</option>
                                            {blockReasons.map((reason) => (
                                                <option key={reason} value={reason}>
                                                    {reason}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <AlertDialogFooter className="flex justify-between pt-4">
                            <div className="flex justify-start w-1/2">
                                <AlertDialogCancel
                                    className="border border-red-600 text-red-600 hover:bg-gray-50 px-4 py-2 rounded-md font-medium cursor-pointer"
                                    onClick={() => {
                                        setIsBlockOpen(false);
                                        setBlockReason("");
                                    }}
                                >
                                    Cancel
                                </AlertDialogCancel>
                            </div>
                            <div className="flex justify-end w-1/2">
                                <AlertDialogAction
                                    onClick={() => {
                                        if (!blockReason) {
                                            alert("Please select a reason for blocking.");
                                            return;
                                        }
                                        setIsConfirmBlockOpen(true);
                                    }}
                                    className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md font-medium cursor-pointer"
                                    disabled={!blockReason}
                                >
                                    Block
                                </AlertDialogAction>
                            </div>
                        </AlertDialogFooter>
                    </div>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={isConfirmBlockOpen} onOpenChange={setIsConfirmBlockOpen}>
                <AlertDialogContent className="max-w-sm rounded-xl p-6 border-[rgba(228,231,236,1)]">
                    <AlertDialogCancel asChild>
                        <button
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            onClick={() => {
                                setIsConfirmBlockOpen(false);
                                setBlockReason("");
                            }}
                        >
                            <X size={20} />
                        </button>
                    </AlertDialogCancel>
                    <div className="flex flex-col space-y-3 mt-8">
                        <div className="w-full flex items-start">
                            <div className="text-red-600 p-3 rounded-full w-16 h-16 ml-0"></div>
                        </div>
                        <AlertDialogHeader className="space-y-1">
                            <div>
                                <AlertDialogTitle className="text-lg font-semibold">
                                    Block Customer
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to block {customer.firstName} for {blockReason}?
                                </AlertDialogDescription>
                            </div>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="w-full flex justify-between items-center pt-4 px-0">
                            <div className="flex justify-start w-1/2">
                                <AlertDialogCancel
                                    className="border border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 px-6 py-2 rounded-md font-medium"
                                    onClick={() => {
                                        setIsConfirmBlockOpen(false);
                                        setBlockReason("");
                                    }}
                                >
                                    Cancel
                                </AlertDialogCancel>
                            </div>
                            <div className="flex justify-end w-1/2">
                                <AlertDialogAction
                                    onClick={handleBlockAction} // Use the new handler function
                                    className="bg-red-600 text-white hover:bg-red-700 px-6 py-2 rounded-md font-medium"
                                >
                                    {blockMutation.isPending ? "Blocking..." : "Block"}
                                </AlertDialogAction>
                            </div>
                        </AlertDialogFooter>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
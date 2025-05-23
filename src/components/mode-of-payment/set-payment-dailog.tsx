"use client";
import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { WalletCards } from "lucide-react";

type SetPaymentDialogProps = {
    onSave: (data: {
        meterNumber: string;
        debitModeOfPayment: string;
        debitPercentage: string;
        creditModeOfPayment: string;
        creditPercentage: string;
    }) => void;
    asChild?: boolean;
};

export function SetPaymentDialog({ onSave, asChild }: SetPaymentDialogProps) {
    const [open, setOpen] = useState(false);
    const [meterNumber, setMeterNumber] = useState("");
    const [debitModeOfPayment, setDebitModeOfPayment] = useState("");
    const [debitPercentage, setDebitPercentage] = useState("");
    const [creditModeOfPayment, setCreditModeOfPayment] = useState("");
    const [creditPercentage, setCreditPercentage] = useState("");

    const handleSave = () => {
        if (meterNumber && debitModeOfPayment && creditModeOfPayment) {
            onSave({
                meterNumber,
                debitModeOfPayment,
                debitPercentage,
                creditModeOfPayment,
                creditPercentage,
            });
            setMeterNumber("");
            setDebitModeOfPayment("");
            setDebitPercentage("");
            setCreditModeOfPayment("");
            setCreditPercentage("");
            setOpen(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild={asChild}>

                <Button
                    variant="outline"
                    size={"lg"}
                    className="flex bg-[rgba(22,28,202,1)] text-white items-center cursor-pointer"
                >
                    <WalletCards size={14} />
                    Set Payment
                </Button>
            </DialogTrigger>
            <DialogContent className="w-full h-fit bg-white p-6 rounded-lg border border-gray-200">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-900">Set Payment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                            Meter Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            placeholder="Enter Meter Number"
                            value={meterNumber}
                            onChange={(e) => setMeterNumber(e.target.value)}
                            className="w-full border-gray-300 focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50 text-sm lg:text-base"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                                Debit <span className="text-red-500">*</span>
                            </Label>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Mode of Payment</Label>
                                <Select
                                    value={debitModeOfPayment}
                                    onValueChange={setDebitModeOfPayment}
                                >
                                    <SelectTrigger className="w-full border-gray-300 focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50 text-sm lg:text-base">
                                        <SelectValue placeholder="Select mode of payment" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Percentage">Percentage</SelectItem>
                                        <SelectItem value="One-off">One-off</SelectItem>
                                        <SelectItem value="Monthly">Monthly</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Label className="text-sm font-medium text-gray-700">Percentage</Label>
                                <Input
                                    placeholder="Enter Percentage"
                                    value={debitPercentage}
                                    onChange={(e) => setDebitPercentage(e.target.value)}
                                    className="w-full border-gray-300 focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50 text-sm lg:text-base"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                                Credit <span className="text-red-500">*</span>
                            </Label>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Mode of Payment</Label>
                                <Select
                                    value={creditModeOfPayment}
                                    onValueChange={setCreditModeOfPayment}
                                >
                                    <SelectTrigger className="w-full border-gray-300 focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50 text-sm lg:text-base">
                                        <SelectValue placeholder="Select mode of payment" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Percentage">Percentage</SelectItem>
                                        <SelectItem value="One-off">One-off</SelectItem>
                                        <SelectItem value="Monthly">Monthly</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Label className="text-sm font-medium text-gray-700">Percentage</Label>
                                <Input
                                    placeholder="Enter Percentage"
                                    value={creditPercentage}
                                    onChange={(e) => setCreditPercentage(e.target.value)}
                                    className="w-full border-gray-300 focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50 text-sm lg:text-base"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center mt-6">
                    <Button
                        variant="outline"
                        size={"lg"}
                        className="border-[rgba(22,28,202,1)] text-[rgba(22,28,202,1)] px-4 py-2 rounded"
                        onClick={() => setOpen(false)}
                    >
                        Back
                    </Button>
                    <Button
                        className="bg-[rgba(22,28,202,1)] text-white px-4 py-2 rounded"
                        size={"lg"}
                        onClick={handleSave}
                        disabled={!meterNumber || !debitModeOfPayment || !creditModeOfPayment}
                    >
                        Save
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
interface TokenFormDialogProps {
    tokenType: string;
}

export default function TokenFormDialog({ tokenType }: TokenFormDialogProps) {
    const [vendBy, setVendBy] = useState("meterNumber");
    const [meterNumber, setMeterNumber] = useState("");
    const [amountTendered, setAmountTendered] = useState("");
    const [energySource, setEnergySource] = useState("grid");
    const [reason, setReason] = useState("");
    const [oldSgc, setOldSgc] = useState("");
    const [newSgc, setNewSgc] = useState("");
    const [oldKrn, setOldKrn] = useState("");
    const [newKrn, setNewKrn] = useState("");
    const [oldTariffIndex, setOldTariffIndex] = useState("");
    const [newTariffIndex, setNewTariffIndex] = useState("");
    const [units, setUnits] = useState("");

    const handleVendByChange = (value: string) => {
        setVendBy(value);
    };

    const getDynamicLabel = () => {
        return vendBy === "meterNumber" ? "Meter Number" : "Account Number";
    };

    const getDynamicPlaceholder = () => {
        return vendBy === "meterNumber" ? "Enter Meter Number" : "Enter Account Number";
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="default"
                    size="lg"
                    className="bg-[#161CCA] text-white cursor-pointer"
                >
                    Proceed
                </Button>
            </DialogTrigger>
            <DialogContent className="w-full h-fit bg-white">
                <DialogHeader>
                    <DialogTitle>{tokenType}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 items-center gap-4">
                        <div className="grid grid-cols-2 items-center gap-4">
                            <Label htmlFor="vendBy" className="text-right">
                                Vend By <span className="text-red-500">*</span>
                            </Label>
                            <Select onValueChange={handleVendByChange} value={vendBy}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select Vend By" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="meterNumber">Meter Number</SelectItem>
                                    <SelectItem value="accountNumber">Account Number</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 items-center gap-4">
                            <Label htmlFor="dynamicInput" className="text-right whitespace-nowrap">
                                {getDynamicLabel()} <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="dynamicInput"
                                className="col-span-3 border border-gray-300"
                                placeholder={getDynamicPlaceholder()}
                                value={meterNumber}
                                onChange={(e) => setMeterNumber(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4"></div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="energySource" className="text-right">
                            Energy Source
                        </Label>
                        <Select onValueChange={setEnergySource} value={energySource}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select Energy Source" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="grid">Grid (NEPA)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {tokenType === "creditToken" && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amountTendered" className="text-right">
                                Amount Tendered <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="amountTendered"
                                className="col-span-3"
                                placeholder="Enter Amount"
                                value={amountTendered}
                                onChange={(e) => setAmountTendered(e.target.value)}
                            />
                        </div>
                    )}
                    {(tokenType === "kct" || tokenType === "clearTamper" || tokenType === "clearCredit" || tokenType === "kctAndClearTamper") && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="reason" className="text-right">
                                Reason <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="reason"
                                className="col-span-3"
                                placeholder="Enter Reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                        </div>
                    )}
                    {(tokenType === "kct" || tokenType === "kctAndClearTamper") && (
                        <>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="oldSgc" className="text-right">
                                    Old SGC
                                </Label>
                                <Input
                                    id="oldSgc"
                                    className="col-span-3"
                                    placeholder="Enter Old SGC"
                                    value={oldSgc}
                                    onChange={(e) => setOldSgc(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="newSgc" className="text-right">
                                    New SGC <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="newSgc"
                                    className="col-span-3"
                                    placeholder="Enter New SGC"
                                    value={newSgc}
                                    onChange={(e) => setNewSgc(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="oldKrn" className="text-right">
                                    Old KRN
                                </Label>
                                <Input
                                    id="oldKrn"
                                    className="col-span-3"
                                    placeholder="Enter Old KRN"
                                    value={oldKrn}
                                    onChange={(e) => setOldKrn(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="newKrn" className="text-right">
                                    New KRN
                                </Label>
                                <Input
                                    id="newKrn"
                                    className="col-span-3"
                                    placeholder="Enter New KRN"
                                    value={newKrn}
                                    onChange={(e) => setNewKrn(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="oldTariffIndex" className="text-right">
                                    Old Tariff Index
                                </Label>
                                <Input
                                    id="oldTariffIndex"
                                    className="col-span-3"
                                    placeholder="Enter Old Tariff Index"
                                    value={oldTariffIndex}
                                    onChange={(e) => setOldTariffIndex(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="newTariffIndex" className="text-right">
                                    New Tariff Index <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="newTariffIndex"
                                    className="col-span-3"
                                    placeholder="Enter New Tariff Index"
                                    value={newTariffIndex}
                                    onChange={(e) => setNewTariffIndex(e.target.value)}
                                />
                            </div>
                        </>
                    )}
                    {tokenType === "compensation" && (
                        <>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="units" className="text-right">
                                    Units <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="units"
                                    className="col-span-3"
                                    placeholder="Enter Units"
                                    value={units}
                                    onChange={(e) => setUnits(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="reason" className="text-right">
                                    Reason <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="reason"
                                    className="col-span-3"
                                    placeholder="Enter Reason"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                            </div>
                        </>
                    )}
                    {tokenType === "arrearsPayment" && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amountTendered" className="text-right">
                                Amount Tendered <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="amountTendered"
                                className="col-span-3"
                                placeholder="Enter Amount"
                                value={amountTendered}
                                onChange={(e) => setAmountTendered(e.target.value)}
                            />
                        </div>
                    )}
                </div>
                <div className="flex justify-end gap-4">
                    <Button
                        variant="outline"
                        size="lg"
                        className="border-[#161CCA] text-[#161CCA]"
                    >
                        Back
                    </Button>
                    <Button
                        variant="default"
                        size="lg"
                        className="bg-[#161CCA] text-white"
                    >
                        Proceed
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
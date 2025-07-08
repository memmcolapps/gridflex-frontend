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
    const [showReceipt, setShowReceipt] = useState(false);
    const [showTokenDialog, setShowTokenDialog] = useState(false);
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false); // Control form dialog

    const handleVendByChange = (value: string) => setVendBy(value);

    const getDynamicLabel = () =>
        vendBy === "meterNumber" ? "Meter Number" : "Account Number";

    const getDynamicPlaceholder = () =>
        vendBy === "meterNumber" ? "Enter Meter Number" : "Enter Account Number";

    const handleProceed = () => {
        if (tokenType === "creditToken" && vendBy && meterNumber && amountTendered) {
            setShowReceipt(true);
            setIsFormDialogOpen(false); // Close form dialog
        } else if (
            (tokenType === "kct" ||
                tokenType === "clearTamper" ||
                tokenType === "clearCredit" ||
                tokenType === "kctAndClearTamper" ||
                tokenType === "compensation") &&
            vendBy &&
            meterNumber &&
            reason
        ) {
            setShowTokenDialog(true);
            setIsFormDialogOpen(false); // Close form dialog
        }
    };

    const handleCancel = () => {
        setShowReceipt(false);
        setMeterNumber("");
        setAmountTendered("");
        setReason("");
        setOldSgc("");
        setNewSgc("");
        setOldKrn("");
        setNewKrn("");
        setOldTariffIndex("");
        setNewTariffIndex("");
        setUnits("");
        setIsFormDialogOpen(false); // Close form dialog
    };

    const handleGetToken = () => {
        setShowTokenDialog(true);
        setShowReceipt(false);
        setIsFormDialogOpen(false); // Close form dialog
    };

    const getTitleCase = (type: string) => {
        const titleMap: Record<string, string> = {
            creditToken: "Credit Token",
            kct: "KCT",
            clearTamper: "Clear Tamper",
            clearCredit: "Clear Credit",
            kctAndClearTamper: "KCT and Clear Tamper",
            compensation: "Compensation",
        };
        return titleMap[type] ?? type;
    };

    return (
        <>
            <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="default"
                        size="lg"
                        className="bg-[#161CCA] text-white cursor-pointer"
                        onClick={() => setIsFormDialogOpen(true)}
                    >
                        Proceed
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-full h-fit bg-white">
                    <DialogHeader>
                        <DialogTitle>{getTitleCase(tokenType)}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="vendBy" className="text-right">
                                    Vend By <span className="text-red-500">*</span>
                                </Label>
                                <Select onValueChange={handleVendByChange} value={vendBy}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Vend By" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="meterNumber">Meter Number</SelectItem>
                                        <SelectItem value="accountNumber">Account Number</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="dynamicInput" className="text-right whitespace-nowrap">
                                    {getDynamicLabel()} <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="dynamicInput"
                                    className="border border-gray-300"
                                    placeholder={getDynamicPlaceholder()}
                                    value={meterNumber}
                                    onChange={(e) => setMeterNumber(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="energySource" className="text-right">
                                Energy Source
                            </Label>
                            <Select onValueChange={setEnergySource} value={energySource}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Energy Source" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="grid">Grid (NEPA)</SelectItem>
                                    <SelectItem value="off grid">Off Grid (Generator etc)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {(tokenType === "creditToken" || tokenType === "arrearsPayment") && (
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="amountTendered" className="text-right">
                                    Amount Tendered <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="amountTendered"
                                    className="border border-gray-300"
                                    placeholder="Enter Amount"
                                    value={amountTendered}
                                    onChange={(e) => setAmountTendered(e.target.value)}
                                />
                            </div>
                        )}
                        {(tokenType === "kct" ||
                            tokenType === "clearTamper" ||
                            tokenType === "clearCredit" ||
                            tokenType === "kctAndClearTamper" ||
                            tokenType === "clearTamperAndKct" ||
                            tokenType === "compensation") && (
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="reason" className="text-right">
                                    Reason <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="reason"
                                    className="border border-gray-300"
                                    placeholder="Enter Reason"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                            </div>
                        )}
                        {tokenType === "compensation" && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="reason" className="text-right">
                                        Reason <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="reason"
                                        className="border border-gray-300"
                                        placeholder="Enter Reason"
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="units" className="text-right">
                                        Units <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="units"
                                        className="border border-gray-300"
                                        placeholder="Enter Units"
                                        value={units}
                                        onChange={(e) => setUnits(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                        {(tokenType === "kct" || tokenType === "kctAndClearTamper" || tokenType === "clearTamperAndKct") && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="oldSgc" className="text-right">
                                            Old SGC
                                        </Label>
                                        <Input
                                            id="oldSgc"
                                            className="border border-gray-300"
                                            placeholder="Enter Old SGC"
                                            value={oldSgc}
                                            onChange={(e) => setOldSgc(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="newSgc" className="text-right">
                                            New SGC <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="newSgc"
                                            className="border border-gray-300"
                                            placeholder="Enter New SGC"
                                            value={newSgc}
                                            onChange={(e) => setNewSgc(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="oldKrn" className="text-right">
                                            Old KRN
                                        </Label>
                                        <Input
                                            id="oldKrn"
                                            className="border border-gray-300"
                                            placeholder="Enter Old KRN"
                                            value={oldKrn}
                                            onChange={(e) => setOldKrn(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="newKrn" className="text-right">
                                            New KRN
                                        </Label>
                                        <Input
                                            id="newKrn"
                                            className="border border-gray-300"
                                            placeholder="Enter New KRN"
                                            value={newKrn}
                                            onChange={(e) => setNewKrn(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="oldTariffIndex" className="text-right">
                                            Old Tariff Index
                                        </Label>
                                        <Input
                                            id="oldTariffIndex"
                                            className="border border-gray-300"
                                            placeholder="Enter Old Tariff Index"
                                            value={oldTariffIndex}
                                            onChange={(e) => setOldTariffIndex(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="newTariffIndex" className="text-right">
                                            New Tariff Index <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="newTariffIndex"
                                            className="border border-gray-300"
                                            placeholder="Enter New Tariff Index"
                                            value={newTariffIndex}
                                            onChange={(e) => setNewTariffIndex(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        {showReceipt && tokenType === "creditToken" && (
                            <div className="mt-6">
                                <p><strong>VAT Amount:</strong> 488.39</p>
                                <p><strong>Debit Adjustment:</strong> 3,000/bypass</p>
                                <p><strong>Credit Adjustment:</strong> 0.00</p>
                                <p><strong>MMF:</strong> 0.00</p>
                                <p><strong>KVA:</strong> 0.00</p>
                                <p><strong>Fixed Charge:</strong> 0.00</p>
                                <p><strong>Cost Of Unit:</strong> 0.00</p>
                                <p><strong>Units:</strong> 31.50</p>
                                <p><strong>Total Amount Vended:</strong> 7,000</p>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between gap-4 mt-4">
                        {!showReceipt && !showTokenDialog && (
                            <>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-[#161CCA] text-[#161CCA] cursor-pointer"
                                    onClick={() => setIsFormDialogOpen(false)}
                                >
                                    Back
                                </Button>
                                <Button
                                    variant="default"
                                    size="lg"
                                    className="bg-[#161CCA] text-white cursor-pointer"
                                    onClick={handleProceed}
                                >
                                    Proceed
                                </Button>
                            </>
                        )}
                        {showReceipt && tokenType === "creditToken" && (
                            <>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-[#161CCA] text-[#161CCA] cursor-pointer"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="default"
                                    size="lg"
                                    className="bg-[#161CCA] text-white cursor-pointer"
                                    onClick={handleGetToken}
                                >
                                    Get Token
                                </Button>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={showTokenDialog} onOpenChange={setShowTokenDialog}>
                <DialogContent className="w-full h-fit bg-white">
                    <DialogHeader>
                        <DialogTitle>{getTitleCase(tokenType)}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <p>Customer Name:</p>
                            <p>Ugorji Eucharia E</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <p>Meter Number:</p>
                            <p>6201021223</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <p>Account No:</p>
                            <p>01231459845</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <p>Credit Type:</p>
                            <p>0</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <p>Operator:</p>
                            <p>Margaret</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <p>Transaction date:</p>
                            <p>2025-05-12 15</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <p>Receipt No:</p>
                            <p>12711</p>
                        </div>
                        {tokenType === "creditToken" && (
                            <div className="grid grid-cols-2 gap-4">
                                <p>Credit Token:</p>
                                <p>1021 1255 0556 6336 66955</p>
                            </div>
                        )}
                        {tokenType === "kct" && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <p>KCT 1:</p>
                                    <p>4804 1025 0126 8956 7865</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <p>KCT 2:</p>
                                    <p>4804 1025 0126 8956 7865</p>
                                </div>
                            </>
                        )}
                        {tokenType === "clearTamper" && (
                            <div className="grid grid-cols-2 gap-4">
                                <p>Clear Tamper:</p>
                                <p>1021 1255 0556 6336 6695</p>
                            </div>
                        )}
                        {tokenType === "clearCredit" && (
                            <div className="grid grid-cols-2 gap-4">
                                <p>Clear Credit:</p>
                                <p>1021 1255 0556 6336 6700</p>
                            </div>
                        )}
                        {tokenType === "kctAndClearTamper" && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <p>Clear Tamper:</p>
                                    <p>1021 1255 0556 6336 6695</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <p>KCT 1:</p>
                                    <p>4804 1025 0126 8956 7865</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <p>KCT 2:</p>
                                    <p>4804 1025 0126 8956 7865</p>
                                </div>
                            </>
                        )}
                        {tokenType === "compensation" && (
                            <div className="grid grid-cols-2 gap-4">
                                <p>Compensation Token:</p>
                                <p>9001 2345 6789 0123 4567</p>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end gap-4 mt-4">
                        <Button
                            variant="outline"
                            size="lg"
                            className="bg-[#161CCA] text-white cursor-pointer"
                            onClick={() => {
                                const printWindow = window.open('', '_blank', 'width=800,height=600');
                                if (printWindow) {
                                    printWindow.document.write(`
                                        <html>
                                            <head>
                                                <title>Token Receipt</title>
                                                <style>
                                                    body { font-family: Arial, sans-serif; padding: 20px; }
                                                    h2 { color: gray; text-align: center; }
                                                    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                                                    td { padding: 8px; border: 1px solid #ddd; }
                                                    .token-label { font-weight: bold; }
                                                    .token-value { font-size: 1.2em; letter-spacing: 2px; }
                                                    .footer { text-align: center; margin-top: 20px; }
                                                </style>
                                            </head>
                                            <body>
                                                <h2>Token Receipt</h2>
                                                <table>
                                                    <tr><td>Customer Name:</td><td>Ugorji Eucharia E</td></tr>
                                                    <tr><td>Address:</td><td>No 707 Ukuta Close UNN, Nsukka Enugu</td></tr>
                                                    <tr><td>Account No:</td><td>01-2646945654</td></tr>
                                                    <tr><td>Meter No:</td><td>6242016739</td></tr>
                                                    <tr><td>Operator ID:</td><td>Margaret</td></tr>
                                                    <tr><td>Trans Date:</td><td>2025-06-25 12:39 PM WAT</td></tr>
                                                    <tr><td>Receipt No:</td><td>12711</td></tr>
                                                </table>
                                                ${tokenType === "creditToken" ? `
                                                    <div class="token-label">Credit Token:</div>
                                                    <div class="token-value">1021 1255 0556 6336 66955</div>
                                                ` : tokenType === "kct" ? `
                                                    <div class="token-label">KCT 1:</div>
                                                    <div class="token-value">4804 1025 0126 8956 7865</div>
                                                    <div class="token-label">KCT 2:</div>
                                                    <div class="token-value">4804 1025 0126 8956 7865</div>
                                                    <div class="footer">Thank you for your patronage.</div>
                                                ` : tokenType === "clearTamper" ? `
                                                    <div class="token-label">Clear Tamper:</div>
                                                    <div class="token-value">1021 1255 0556 6336 6695</div>
                                                ` : tokenType === "clearCredit" ? `
                                                    <div class="token-label">Clear Credit:</div>
                                                    <div class="token-value">1021 1255 0556 6336 6700</div>
                                                ` : tokenType === "kctAndClearTamper" ? `
                                                    <div class="token-label">Clear Tamper:</div>
                                                    <div class="token-value">1021 1255 0556 6336 6695</div>
                                                    <div class="token-label">KCT 1:</div>
                                                    <div class="token-value">4804 1025 0126 8956 7865</div>
                                                    <div class="token-label">KCT 2:</div>
                                                    <div class="token-value">4804 1025 0126 8956 7865</div>
                                                    <div class="footer">Thank you for your patronage.</div>
                                                ` : `
                                                    <div class="token-label">Compensation Token:</div>
                                                    <div class="token-value">9001 2345 6789 0123 4567</div>
                                                `}
                                            </body>
                                        </html>
                                    `);
                                    printWindow.document.close();
                                    printWindow.focus();
                                    printWindow.print();
                                }
                                setShowTokenDialog(false);
                            }}
                        >
                            Print
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
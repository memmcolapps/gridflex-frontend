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
import { useGenerateCreditToken, usePrintToken, useCalculateCreditToken, useGenerateKCTToken, useGenerateClearTamperToken, useGenerateClearCreditToken, useGenerateKCTAndClearTamperToken, useGenerateCompensationToken } from "@/hooks/use-vending";
import type { VendingTransaction, CalculateCreditTokenResponse } from "@/types/vending";

interface TokenFormDialogProps {
    tokenType: string;
}

export default function TokenFormDialog({ tokenType }: TokenFormDialogProps) {
    const generateCreditTokenMutation = useGenerateCreditToken();
    const printTokenMutation = usePrintToken();
    const calculateCreditTokenMutation = useCalculateCreditToken();
    const generateKCTTokenMutation = useGenerateKCTToken();
    const generateClearTamperTokenMutation = useGenerateClearTamperToken();
    const generateClearCreditTokenMutation = useGenerateClearCreditToken();
    const generateKCTAndClearTamperTokenMutation = useGenerateKCTAndClearTamperToken();
    const generateCompensationTokenMutation = useGenerateCompensationToken();
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
    const [generatedTokenData, setGeneratedTokenData] = useState<VendingTransaction | null>(null);
    const [calculatedTokenData, setCalculatedTokenData] = useState<CalculateCreditTokenResponse["responsedata"] | null>(null);

    const handleVendByChange = (value: string) => setVendBy(value);

    const getDynamicLabel = () =>
        vendBy === "meterNumber" ? "Meter Number" : "Account Number";

    const getDynamicPlaceholder = () =>
        vendBy === "meterNumber" ? "Enter Meter Number" : "Enter Account Number";

    const handleProceed = async () => {
        if (tokenType === "creditToken" && vendBy && meterNumber && amountTendered) {
            try {
                const result = await calculateCreditTokenMutation.mutateAsync({
                    meterNumber,
                    initialAmount: parseInt(amountTendered) || 0

                });
                setCalculatedTokenData(result);
                setShowReceipt(true);
                // Don't close form dialog, keep it open to show receipt
            } catch (error) {
                console.error("Failed to calculate token:", error);
            }
        } else if (tokenType === "kct") {
            // For KCT, we need to generate the token first to get customer data
            const payload = {
                [vendBy === "meterNumber" ? "meterNumber" : "meterAccountNumber"]: meterNumber,
                tokenType: "kct",
                reason,
                oldSgc,
                newSgc,
                oldKrn,
                newKrn,
                oldTariffIndex: parseInt(oldTariffIndex) || 0,
                newTariffIndex: parseInt(newTariffIndex) || 1,
            };

            try {
                const result = await generateKCTTokenMutation.mutateAsync(payload);
                setGeneratedTokenData(result);
                setShowTokenDialog(true);
                setIsFormDialogOpen(false);
            } catch (error) {
                console.error("Failed to generate KCT token:", error);
            }
        } else if (tokenType === "clearTamper") {
            // For Clear Tamper, we need to generate the token first to get customer data
            const payload = {
                [vendBy === "meterNumber" ? "meterNumber" : "meterAccountNumber"]: meterNumber,
                tokenType: "clear-tamper",
                reason,
            };

            try {
                const result = await generateClearTamperTokenMutation.mutateAsync(payload);
                setGeneratedTokenData(result);
                setShowTokenDialog(true);
                setIsFormDialogOpen(false);
            } catch (error) {
                console.error("Failed to generate Clear Tamper token:", error);
            }
        } else if (tokenType === "clearCredit") {
            // For Clear Credit, we need to generate the token first to get customer data
            const payload = {
                [vendBy === "meterNumber" ? "meterNumber" : "meterAccountNumber"]: meterNumber,
                tokenType: "clear-credit",
                reason,
            };

            try {
                const result = await generateClearCreditTokenMutation.mutateAsync(payload);
                setGeneratedTokenData(result);
                setShowTokenDialog(true);
                setIsFormDialogOpen(false);
            } catch (error) {
                console.error("Failed to generate Clear Credit token:", error);
            }
        } else if (tokenType === "kctAndClearTamper") {
            // For KCT and Clear Tamper, we need to generate the token first to get customer data
            const payload = {
                [vendBy === "meterNumber" ? "meterNumber" : "meterAccountNumber"]: meterNumber,
                tokenType: "kct-clear-tamper",
                reason,
                oldSgc,
                newSgc,
                oldKrn,
                newKrn,
                oldTariffIndex: parseInt(oldTariffIndex) || 0,
                newTariffIndex: parseInt(newTariffIndex) || 1,
            };

            try {
                console.log("KCT and Clear Tamper payload:", payload);
                const result = await generateKCTAndClearTamperTokenMutation.mutateAsync(payload);
                console.log("KCT and Clear Tamper result:", result);
                setGeneratedTokenData(result);
                setShowTokenDialog(true);
                setIsFormDialogOpen(false);
            } catch (error) {
                console.error("Failed to generate KCT and Clear Tamper token:", error);
            }
        } else if (tokenType === "compensation") {
            // For Compensation, we need to generate the token first to get customer data
            const payload = {
                [vendBy === "meterNumber" ? "meterNumber" : "meterAccountNumber"]: meterNumber,
                tokenType: "compensation",
                reason,
                units: parseInt(units) || 0,
            };

            try {
                const result = await generateCompensationTokenMutation.mutateAsync(payload);
                setGeneratedTokenData(result);
                setShowTokenDialog(true);
                setIsFormDialogOpen(false);
            } catch (error) {
                console.error("Failed to generate Compensation token:", error);
            }
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

    const handleGetToken = async () => {
        if (tokenType === "creditToken") {
            const payload = {
                [vendBy === "meterNumber" ? "meterNumber" : "meterAccountNumber"]: meterNumber,
                initialAmount: parseInt(amountTendered) || 0,
                tokenType: "credit-token",
            };

            try {
                const result = await generateCreditTokenMutation.mutateAsync(payload);
                setGeneratedTokenData(result);
                setShowTokenDialog(true);
                setShowReceipt(false);
                setIsFormDialogOpen(false);
            } catch (error) {
                // Error is handled by the mutation's onError
                console.error("Failed to generate token:", error);
            }
        } else {
            setShowTokenDialog(true);
            setShowReceipt(false);
            setIsFormDialogOpen(false);
        }
    };

    const handleReprintToken = async () => {
        if (generatedTokenData?.transactionId) {
            try {
                const result = await printTokenMutation.mutateAsync({
                    id: generatedTokenData.transactionId,
                    tokenType: "credit-token",
                });
                console.log("Print token result:", result);

                // Create HTML content for printing (formatted like a receipt)
                const printContent = `
                    <html>
                    <head>
                        <title>Token Receipt</title>
                        <style>
                            body {
                                font-family: 'Courier New', monospace;
                                margin: 0;
                                padding: 20px;
                                background: white;
                                font-size: 12px;
                                line-height: 1.4;
                            }
                            .receipt {
                                max-width: 400px;
                                margin: 0 auto;
                                border: 1px solid #000;
                                padding: 15px;
                            }
                            .header {
                                text-align: center;
                                border-bottom: 1px solid #000;
                                padding-bottom: 10px;
                                margin-bottom: 15px;
                            }
                            .company-name {
                                font-size: 18px;
                                font-weight: bold;
                                margin-bottom: 5px;
                                color: #000;
                            }
                            .receipt-title {
                                font-size: 14px;
                                margin-bottom: 5px;
                                color: #000;
                            }
                            .info-row {
                                display: flex;
                                justify-content: space-between;
                                margin-bottom: 5px;
                                padding: 2px 0;
                            }
                            .label {
                                font-weight: bold;
                                min-width: 140px;
                            }
                            .value {
                                text-align: right;
                                flex: 1;
                            }
                            .amount-section {
                                border-top: 1px solid #000;
                                border-bottom: 1px solid #000;
                                margin: 15px 0;
                                padding: 10px 0;
                            }
                            .token-section {
                                border-top: 1px solid #000;
                                margin-top: 15px;
                                padding-top: 10px;
                                text-align: center;
                            }
                            .token-label {
                                font-weight: bold;
                                margin-bottom: 5px;
                            }
                            .token-value {
                                font-size: 14px;
                                font-weight: bolder;
                                letter-spacing: 2px;
                                word-break: break-all;
                                margin-bottom: 10px;
                                color: #000;
                            }
                            .footer {
                                border-top: 1px solid #000;
                                margin-top: 15px;
                                padding-top: 10px;
                                text-align: center;
                                font-size: 10px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="receipt">
                            <div class="header">
                                <div class="company-name">TOKEN RECEIPT</div>
                                <div>Customer Copy</div>
                            </div>

                            <div class="info-row">
                                <span class="label">Customer Name:</span>
                                <span class="value">${generatedTokenData?.customerFullname ?? 'N/A'}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Meter Number:</span>
                                <span class="value">${generatedTokenData?.meterNumber || 'N/A'}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Account Number:</span>
                                <span class="value">${generatedTokenData?.meterAccountNumber || 'N/A'}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Address:</span>
                                <span class="value">${generatedTokenData?.address || 'N/A'}</span>
                            </div>
                            ${tokenType !== "kct" && tokenType !== "clearTamper" && tokenType !== "clearCredit" && tokenType !== "kctAndClearTamper" ? `
                            <div class="info-row">
                                <span class="label">Tariff:</span>
                                <span class="value">${generatedTokenData?.tariffName || 'N/A'}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Tariff Rate:</span>
                                <span class="value">₦${generatedTokenData?.tariffRate || 'N/A'}</span>
                            </div>
                            ` : ''}
                            <div class="info-row">
                                <span class="label">Operator:</span>
                                <span class="value">${generatedTokenData?.userFullname || 'N/A'}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Transaction Date:</span>
                                <span class="value">${generatedTokenData?.createdAt ? new Date(generatedTokenData.createdAt).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Time:</span>
                                <span class="value">${generatedTokenData?.createdAt ? new Date(generatedTokenData.createdAt).toLocaleTimeString() : 'N/A'}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Receipt Number:</span>
                                <span class="value">${generatedTokenData?.receiptNo || 'N/A'}</span>
                            </div>
                            ${tokenType === "compensation" ? `
                            <div class="info-row">
                                <span class="label">Units:</span>
                                <span class="value">${generatedTokenData?.unit || 'N/A'}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Costs of Unit:</span>
                                <span class="value">₦${generatedTokenData?.unitCost?.toLocaleString() || 'N/A'}</span>
                            </div>
                            ` : ''}

                            ${tokenType === "creditToken" ? `
                            <div class="amount-section">
                                <div class="info-row">
                                    <span class="label">Amount Tendered:</span>
                                    <span class="value">₦${generatedTokenData?.initialAmount?.toLocaleString() || 'N/A'}</span>
                                </div>
                                <div class="info-row">
                                    <span class="label">VAT (${generatedTokenData?.vatAmount ? ((generatedTokenData.vatAmount / generatedTokenData.initialAmount) * 100).toFixed(1) : 'N/A'}%):</span>
                                    <span class="value">₦${generatedTokenData?.vatAmount?.toLocaleString() || 'N/A'}</span>
                                </div>
                                <div class="info-row">
                                    <span class="label">Units Purchased:</span>
                                    <span class="value">${generatedTokenData?.unit?.toLocaleString() || 'N/A'}</span>
                                </div>
                                <div class="info-row">
                                    <span class="label"> Cost of Unit:</span>
                                    <span class="value">₦${generatedTokenData?.unitCost?.toLocaleString() || 'N/A'}</span>
                                </div>
                                <div class="info-row">
                                    <span class="label"><strong>Total Amount:</strong></span>
                                    <span class="value"><strong>₦${generatedTokenData?.finalAmount?.toLocaleString() || 'N/A'}</strong></span>
                                </div>
                            </div>
                            <div class="token-section">
                                <div class="token-label">CREDIT TOKEN</div>
                                <div class="token-value">${generatedTokenData?.token || 'N/A'}</div>
                            </div>
                            ` : tokenType === "kct" ? `
                            <div class="token-section">
                                <div class="token-label">KCT TOKENS</div>
                                <div class="token-value">${generatedTokenData?.kct1 ?? 'N/A'}</div>
                                <div class="token-value" style="margin-top: 10px;">${generatedTokenData?.kct2 ?? 'N/A'}</div>
                            </div>
                            ` : tokenType === "clearTamper" ? `
                            <div class="token-section">
                                <div class="token-label">CLEAR TAMPER TOKEN</div>
                                <div class="token-value">${generatedTokenData?.token || 'N/A'}</div>
                            </div>
                            ` : tokenType === "clearCredit" ? `
                            <div class="token-section">
                                <div class="token-label">CLEAR CREDIT TOKEN</div>
                                <div class="token-value">${generatedTokenData?.token || 'N/A'}</div>
                            </div>
                            ` : tokenType === "kctAndClearTamper" ? `
                            <div class="token-section">
                                <div class="token-label">KCT AND CLEAR TAMPER TOKENS</div>
                                <div class="token-value">${generatedTokenData?.token || 'N/A'}</div>
                                <div class="token-value" style="margin-top: 10px;">${generatedTokenData?.token || 'N/A'}</div>
                                <div class="token-value" style="margin-top: 10px;">${generatedTokenData?.token}</div>
                            </div>
                            ` : tokenType === "compensation" ? `
                            <div class="token-section">
                                <div class="token-label">COMPENSATION TOKEN</div>
                                <div class="token-value">${generatedTokenData?.token || 'N/A'}</div>
                            </div>
                            ` : ''}

                            <div class="footer">
                                Thank you for your business!<br>
                                Please keep this receipt for your records.<br>
                                Powered by GridFlex
                            </div>
                        </div>
                    </body>
                    </html>
                `;

                const printWindow = window.open('', '_blank', 'width=800,height=600');
                if (printWindow) {
                    printWindow.document.write(printContent);
                    printWindow.document.close();
                    printWindow.focus();

                    // Wait for content to load, then trigger print dialog
                    printWindow.onload = () => {
                        printWindow.print();
                    };
                } else {
                    console.error("Failed to open print window");
                }
                setShowTokenDialog(false);
            } catch (error) {
                console.error("Failed to reprint token:", error);
            }
        }
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
                            tokenType === "clearTamperAndKct") && (
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
                                <p><strong>VAT Rate:</strong> {calculatedTokenData?.data.vat}</p>
                                <p><strong>VAT Amount:</strong> {calculatedTokenData?.data.vatAmount}</p>
                                <p><strong>Debit Adjustment:</strong> {calculatedTokenData?.totalDebitBalance}</p>
                                <p><strong>Credit Adjustment:</strong> {calculatedTokenData?.totalCreditBalance}</p>
                                {/* <p><strong>KVA:</strong>{calculatedTokenData?.}</p> */}
                                <p><strong>Cost Of Unit:</strong> {calculatedTokenData?.data.costOfUnit}</p>
                                <p><strong>Units:</strong> {calculatedTokenData?.data.unit}</p>
                                <p><strong>Initial Amount:</strong> {calculatedTokenData?.data.initialAmount}</p>
                                <p><strong>Total Amount Vended:</strong> {calculatedTokenData?.data.finalAmount}</p>
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
                            <p><strong>Customer Name:</strong></p>
                            <p>{generatedTokenData?.customerFullname ?? 'N/A'}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <p><strong>Meter Number:</strong></p>
                            <p>{generatedTokenData?.meterNumber ?? 'N/A'}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <p><strong>Account No:</strong></p>
                            <p>{generatedTokenData?.meterAccountNumber ?? 'N/A'}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <p><strong>Operator:</strong></p>
                            <p>{generatedTokenData?.userFullname ?? 'N/A'}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <p><strong>Transaction date:</strong></p>
                            <p>{generatedTokenData?.createdAt ? new Date(generatedTokenData.createdAt).toLocaleString() : 'N/A'}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <p><strong>Receipt No:</strong></p>
                            <p>{generatedTokenData?.receiptNo ?? 'N/A'}</p>
                        </div>
                        {tokenType === "creditToken" && (
                            <div className="grid grid-cols-2 gap-4">
                                <p><strong>Credit Token:</strong></p>
                                <p>{generatedTokenData?.token ?? 'N/A'}</p>
                            </div>
                        )}
                        {tokenType === "kct" && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <p><strong>KCT 1:</strong></p>
                                    <p>{generatedTokenData?.kct1}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <p><strong>KCT 2:</strong></p>
                                    <p>{generatedTokenData?.kct2}</p>
                                </div>
                            </>
                        )}
                        {tokenType === "clearTamper" && (
                            <div className="grid grid-cols-2 gap-4">
                                <p><strong>Clear Tamper:</strong></p>
                                <p>{generatedTokenData?.token}</p>
                            </div>
                        )}
                        {tokenType === "clearCredit" && (
                            <div className="grid grid-cols-2 gap-4">
                                <p><strong>Clear Credit:</strong></p>
                                <p>{generatedTokenData?.token}</p>
                            </div>
                        )}
                        {tokenType === "kctAndClearTamper" && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <p><strong>Clear Tamper:</strong></p>
                                    <p>{generatedTokenData?.token}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <p><strong>KCT 1:</strong></p>
                                    <p>{generatedTokenData?.token}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <p><strong>KCT 2:</strong></p>
                                    <p>{generatedTokenData?.token}</p>
                                </div>
                            </>
                        )}
                        {tokenType === "compensation" && (
                            <div className="grid grid-cols-2 gap-4">
                                <p><strong>Compensation Token:</strong></p>
                                <p>{generatedTokenData?.token}</p>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between gap-4 mt-4">
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-[#161CCA] text-[#161CCA] cursor-pointer"
                            onClick={() => setShowTokenDialog(false)}
                        >
                            Back
                        </Button>
                        <Button
                            variant="default"
                            size="lg"
                            className="bg-[#161CCA] text-white cursor-pointer"
                            onClick={handleReprintToken}
                            disabled={printTokenMutation.isPending}
                        >
                            {printTokenMutation.isPending ? "Printing..." : "Print Token"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
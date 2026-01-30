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
import TokenFormDialog from "./token-form-dialog";
import { Send } from "lucide-react";
import { usePermissions } from "@/hooks/use-permissions";

export default function VendTokenDialog() {
    const [tokenType, setTokenType] = useState("");
    const { canEdit } = usePermissions();

    if (!canEdit) {
        return null;
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    className="flex items-center border font-medium bg-[#161CCA] text-white w-full md:w-auto cursor-pointer"
                    variant="outline"
                    size="lg"
                >
                    <Send size={14} />
                    Vend Token
                </Button>
            </DialogTrigger>
            <DialogContent className="w-full h-fit bg-white">
                <DialogHeader>
                    <DialogTitle>Token Vend</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 items-center gap-4">
                        <Label htmlFor="tokenType" className="text-right">
                            Token Type <span className="text-red-500">*</span>
                        </Label>
                        <Select onValueChange={setTokenType} value={tokenType}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select Token Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="creditToken">Credit Token</SelectItem>
                                <SelectItem value="kct">KCT</SelectItem>
                                <SelectItem value="compensation">Compensation</SelectItem>
                                {/* <SelectItem value="arrearsPayment">Arrears Payment</SelectItem> */}
                                <SelectItem value="clearCredit">Clear Credit</SelectItem>
                                <SelectItem value="clearTamper">Clear Tamper</SelectItem>
                                <SelectItem value="kctAndClearTamper">KCT and Clear Tamper</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex justify-between gap-4">
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-[#161CCA] text-[#161CCA] cursor-pointer"
                        >
                            Cancel
                        </Button>
                    </DialogTrigger>
                    {tokenType && <TokenFormDialog tokenType={tokenType} />}
                </div>
            </DialogContent>
        </Dialog>
    );
}
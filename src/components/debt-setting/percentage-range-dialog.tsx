import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";

type AddPercentageRangeDialogProps = {
    onAddPercentageRange: (range: { percentage: string; amountStartRange: string; amountEndRange: string }) => void;
};

const AddPercentageRangeDialog = ({ onAddPercentageRange }: AddPercentageRangeDialogProps) => {
    const [open, setOpen] = useState(false);
    const [percentage, setPercentage] = useState("");
    const [amountStartRange, setAmountStartRange] = useState("");
    const [amountEndRange, setAmountEndRange] = useState("");

    const handleSubmit = () => {
        if (percentage && amountStartRange && amountEndRange) {
            onAddPercentageRange({ percentage, amountStartRange, amountEndRange });
            setPercentage("");
            setAmountStartRange("");
            setAmountEndRange("");
            setOpen(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="secondary"
                    size="lg"
                    className="flex bg-[rgba(22,28,202,1)] text-white items-center cursor-pointer"
                >
                    <PlusCircle size={14} className="mr-2" />
                    Add Percentage Range
                </Button>
            </DialogTrigger>
            <DialogContent className="w-full bg-white h-fit">
                <DialogHeader>
                    <DialogTitle>Add Percentage Range</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="percentage">Percentage</Label>
                        <Input
                            id="percentage"
                            placeholder="Enter percentage"
                            value={percentage}
                            onChange={(e) => setPercentage(e.target.value)}
                            className="border-[#bebebe] focus:ring-ring/50"
                        />
                    </div>
                    <div className="grid gap-2 grid-cols-2 gap-x-4">
                        <div>
                            <Label htmlFor="amountStartRange">Amount Start Range</Label>
                            <Input
                                id="amountStartRange"
                                placeholder="Enter amount"
                                value={amountStartRange}
                                onChange={(e) => setAmountStartRange(e.target.value)}
                                className="border-[#bebebe] focus:ring-ring/50"
                            />
                        </div>
                        <div>
                            <Label htmlFor="amountEndRange">Amount End Range</Label>
                            <Input
                                id="amountEndRange"
                                placeholder="Enter amount"
                                value={amountEndRange}
                                onChange={(e) => setAmountEndRange(e.target.value)}
                                className="border-[#bebebe] focus:ring-ring/50"
                            />
                        </div>
                    </div>
                </div>
                <Button
                    onClick={handleSubmit}
                    className="bg-[rgba(22,28,202,1)] text-white"
                    disabled={!percentage || !amountStartRange || !amountEndRange}
                >
                    Add
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default AddPercentageRangeDialog;
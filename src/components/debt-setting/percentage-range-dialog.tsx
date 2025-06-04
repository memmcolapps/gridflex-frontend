import React, { useState, useEffect } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { Band } from "@/service/band-service";
import { fetchBands } from "@/service/band-service";

type AddPercentageRangeDialogProps = {
    onAddPercentageRange: (range: { percentage: string; percentageCode: string; band: string; amountStartRange: string; amountEndRange: string }) => void;
};

const AddPercentageRangeDialog = ({ onAddPercentageRange }: AddPercentageRangeDialogProps) => {
    const [open, setOpen] = useState(false);
    const [percentage, setPercentage] = useState("");
    const [percentageCode, setPercentageCode] = useState("");
    const [band, setBand] = useState("");
    const [amountStartRange, setAmountStartRange] = useState("");
    const [amountEndRange, setAmountEndRange] = useState("");
    const [bands, setBands] = useState<Band[]>([]); // State to store fetched bands
    const [loading, setLoading] = useState(false); // Optional: Loading state for fetching bands

    // Fetch bands when the dialog opens
    useEffect(() => {
        if (open) {
            const loadBands = async () => {
                setLoading(true);
                const fetchedBands = await fetchBands();
                setBands(fetchedBands);
                setLoading(false);
            };
            loadBands();
        }
    }, [open]);

    const handleSubmit = () => {
        if (percentage && percentageCode && band && amountStartRange && amountEndRange) {
            onAddPercentageRange({ percentage, percentageCode, band, amountStartRange, amountEndRange });
            setPercentage("");
            setPercentageCode("");
            setBand("");
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
                            <Label htmlFor="percentagecode" className="mb-2">Percentage Code</Label>
                            <Input
                                id="percentagecode"
                                placeholder="Enter percentage code"
                                value={percentageCode}
                                onChange={(e) => setPercentageCode(e.target.value)}
                                className="border-[#bebebe] focus:ring-ring/50"
                            />
                        </div>
                        <div>
                            <Label htmlFor="band" className="mb-2">Band</Label>
                            <Select value={band} onValueChange={setBand} disabled={loading || bands.length === 0}>
                                <SelectTrigger className="w-full border-[#bebebe] focus:ring-ring/50 rounded-md h-10 px-3">
                                    <SelectValue placeholder={loading ? "Loading bands..." : "Select Band"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {bands.length > 0 ? (
                                        bands.map((bandItem) => (
                                            <SelectItem key={bandItem.id} value={bandItem.name}>
                                                {bandItem.name}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        loading ? (
                                            <SelectItem value="loading" disabled>
                                                Loading...
                                            </SelectItem>
                                        ) : (
                                            <SelectItem value="no-bands" disabled>
                                                No bands available
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid gap-2 grid-cols-2 gap-x-4">
                        <div>
                            <Label htmlFor="amountStartRange" className="mb-2">Amount Start Range</Label>
                            <Input
                                id="amountStartRange"
                                placeholder="Enter amount"
                                value={amountStartRange}
                                onChange={(e) => setAmountStartRange(e.target.value)}
                                className="border-[#bebebe] focus:ring-ring/50"
                            />
                        </div>
                        <div>
                            <Label htmlFor="amountEndRange" className="mb-2">Amount End Range</Label>
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
                    disabled={loading || !percentage || !percentageCode || !band || !amountStartRange || !amountEndRange}
                >
                    Add
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default AddPercentageRangeDialog;
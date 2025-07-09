import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface GenerateReadingSheetProps {
    open: boolean;
    onClose: () => void;
}

export default function GenerateReadingSheet({ open, onClose }: GenerateReadingSheetProps) {
    const [step, setStep] = useState(1);
    const [filterType, setFilterType] = useState("");
    const [filterId, setFilterId] = useState("");

    useEffect(() => {
        if (!open) {
            setStep(1);
            setFilterType("");
            setFilterId("");
        }
    }, [open]);

    const handleFirstProceed = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
    };

    const handleSecondProceed = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(3);
    };

    const handleBack = () => {
        if (step === 2) setStep(1);
        else if (step === 3) setStep(2);
    };

    const handleFinalClose = () => {
        setStep(1);
        setFilterType("");
        setFilterId("");
        onClose();
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <DialogHeader>
                            <DialogTitle>Generate Reading Sheet</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleFirstProceed}>
                            <div className="grid gap-4 py-4 mb-4">
                                <div className="grid grid-cols-1 items-center gap-4">
                                    <Label htmlFor="filterType" className="text-right">
                                        Filter By *
                                    </Label>
                                    <Select
                                        name="filterType"
                                        value={filterType}
                                        onValueChange={setFilterType}
                                    >
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select Filter" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="feederLine">Feeder Lines</SelectItem>
                                            <SelectItem value="serviceCenter">Service Center</SelectItem>
                                            <SelectItem value="businessHub">Business Hub</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    className="text-[rgba(22,28,202,1)] border-[#161CCA] cursor-pointer"
                                    size={"lg"}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!filterType}
                                    className="bg-[#161CCA] text-white cursor-pointer"
                                    size={"lg"}
                                >
                                    Proceed
                                </Button>
                            </DialogFooter>
                        </form>
                    </>
                );
            case 2:
                return (
                    <>
                        <DialogHeader>
                            <DialogTitle>Generate Reading Sheet</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSecondProceed}>
                            <div className="grid gap-4 py-4 mb-4">
                                <div className="grid grid-cols-1 items-center gap-4">
                                    <Label htmlFor="filterId" className="text-right">
                                        {filterType === "feederLine" && "Feeder Line ID"}
                                        {filterType === "serviceCenter" && "Service Center ID"}
                                        {filterType === "businessHub" && "Business Hub ID"}
                                        *
                                    </Label>
                                    <Input
                                        id="filterId"
                                        name="filterId"
                                        value={filterId}
                                        onChange={(e) => setFilterId(e.target.value)}
                                        className="col-span-3"
                                        placeholder={`Enter ${filterType === "feederLine" ? "Feeder Line" : filterType === "serviceCenter" ? "Service Center" : "Business Hub"} ID`}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    className="text-[rgba(22,28,202,1)] border-[#161CCA] cursor-pointer"
                                    size={"lg"}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!filterId}
                                    className="bg-[#161CCA] text-white cursor-pointer"
                                    size={"lg"}
                                >
                                    Proceed
                                </Button>
                            </DialogFooter>
                        </form>
                    </>
                );
            case 3:
                return (
                    <DialogContent className="bg-white h-fit p-8 border none" style={{ width: "90vw", maxWidth: "1000px", overflowY: "auto" }}>
                        <DialogHeader>
                            <DialogTitle className="mt-3">Metered Reading Sheet</DialogTitle>
                        </DialogHeader>
                        <div className="py-6">
                            <div className="flex justify-between items-center mb-6 -mt-13">
                                <h3 className="text-sm font-based text-gray-800">
                                    {filterType === "feederLine" ? "Feeder Line" : filterType === "serviceCenter" ? "Service Center" : "Business Hub"} {filterId}
                                </h3>
                                <span className="text-gray-800 font-semibold">Total No of Meters
                                    <h1 className="text-3xl font-bold text-gray-800">
                                        9050
                                    </h1>
                                </span>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>S/N</TableHead>
                                        <TableHead>Meter No.</TableHead>
                                        <TableHead>Feeder Line</TableHead>
                                        <TableHead>DSS</TableHead>
                                        <TableHead>Address</TableHead>
                                        <TableHead>Present Reading</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[...Array(10)].map((_, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>62010223</TableCell>
                                            <TableCell>jeun</TableCell>
                                            <TableCell>jeun</TableCell>
                                            <TableCell>5, Glorious Omemuru, Obafemi Owode State</TableCell>
                                            <TableCell>
                                                <Input
                                                    className="w-fit text-sm border-gray-300"
                                                    disabled
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleBack}
                                className="text-[rgba(22,28,202,1)] border-[#161CCA] cursor-pointer"
                                size={"lg"}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={handleFinalClose}
                                className="bg-[#161CCA] text-white cursor-pointer"
                                size={"lg"}
                            >
                                Export
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                );
            default:
                return null;
        }
    };
    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            if (!isOpen) {
                onClose();
            }
        }}>
            <DialogContent className="w-full h-fit bg-white p-6 border none">
                {renderStep()}
            </DialogContent>
        </Dialog>
    );
}
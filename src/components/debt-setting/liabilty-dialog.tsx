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
import { CirclePlus } from "lucide-react";

type AddLiabilityDialogProps = {
    onAddLiability: (liability: { liabilityName: string; liabilityCode: string }) => void;
};

const AddLiabilityDialog = ({ onAddLiability }: AddLiabilityDialogProps) => {
    const [open, setOpen] = useState(false);
    const [liabilityName, setLiabilityName] = useState("");
    const [liabilityCode, setLiabilityCode] = useState("");

    const handleSubmit = () => {
        if (liabilityName && liabilityCode) {
            onAddLiability({ liabilityName, liabilityCode });
            setLiabilityName("");
            setLiabilityCode("");
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
                    <CirclePlus size={14} className="mr-2" />
                    Add Liability
                </Button>
            </DialogTrigger>
            <DialogContent className="w-full bg-white h-fit">
                <DialogHeader>
                    <DialogTitle>Add Liability</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="liabilityName">Liability Name</Label>
                        <Input
                            id="liabilityName"
                            placeholder="Enter liability name"
                            value={liabilityName}
                            onChange={(e) => setLiabilityName(e.target.value)}
                            className="border-[#bebebe] focus:ring-ring/50"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="liabilityCode">Liability Code</Label>
                        <Input
                            id="liabilityCode"
                            placeholder="Enter liability code"
                            value={liabilityCode}
                            onChange={(e) => setLiabilityCode(e.target.value)}
                            className="border-[#bebebe] focus:ring-ring/50"
                        />
                    </div>
                </div>
                <Button
                    onClick={handleSubmit}
                    className="bg-[rgba(22,28,202,1)] text-white"
                    disabled={!liabilityName || !liabilityCode}
                >
                    Submit
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default AddLiabilityDialog;
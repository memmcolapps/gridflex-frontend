// SendTokenDialog.jsx
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SendTokenDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (token: string) => void;
}

const SendTokenDialog = ({ isOpen, onClose, onSubmit }: SendTokenDialogProps) => {
    const [token, setToken] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (token) {
            onSubmit(token);
            setToken("");
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[360px] h-fit bg-white">
                <DialogHeader>
                    <DialogTitle className="font-medium">Send Token</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col gap-2 p-2">
                            <Label htmlFor="token" className="text-left font-normal text-black text-base sm:text-sm md:text-sm">
                                Token <span className="text-red-600">*</span>
                            </Label>
                            <Input
                                id="token"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder="Enter Token"
                                className="w-full h-12 border border-gray-300"
                            />
                        </div>
                    </div>
                    {/* <DialogFooter className="flex justify-between"> */}
                    <div className="flex justify-between gap-2">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            type="button"
                            className="border-[#161CCA] text-[#161CCA] cursor-pointer h-10"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#161CCA] text-white cursor-pointer h-10"
                            disabled={!token}
                        >
                            Proceed
                        </Button>
                    </div>
                    {/* </DialogFooter> */}
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default SendTokenDialog;
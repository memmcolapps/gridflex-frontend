"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import type { Meter } from "@/types/meter";
import { useSetIpPort } from "@/hooks/use-configure-meter";

interface ConfigureIPDialogProps {
    isOpen: boolean;
    onClose: () => void;
    meter?: Meter | undefined;
}

export default function ConfigureIPDialog({ isOpen, onClose, meter }: ConfigureIPDialogProps) {
    const [ipAddress, setIpAddress] = useState("");
    const [port, setPort] = useState("");
    const isFormValid = ipAddress.trim() !== "" && port.trim() !== "";
    const { mutate: IpAddress, isPending } = useSetIpPort();

    const handleConfigure = () => {
        if (!meter?.meterNumber) return;
        IpAddress(
            { serial: meter.meterNumber, ip: String(ipAddress), port: Number(port) },
            { onSuccess: () => { setIpAddress(""); setPort(""); onClose(); } },
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={() => { setIpAddress(""); setPort(""); onClose(); }}>
            <DialogContent className="bg-white h-fit">
                <DialogHeader>
                    <DialogTitle>Configure IP Address & Port</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div>
                        <Label htmlFor="ip-address" className="text-sm font-medium text-gray-700 mb-2 block">
                            IP Address&nbsp;<span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="ip-address"
                            type="text"
                            value={ipAddress}
                            onChange={(e) => setIpAddress(e.target.value)}
                            placeholder="Enter IP Address"
                            className="w-full border border-gray-200"
                        />
                    </div>
                    <div>
                        <Label htmlFor="port" className="text-sm font-medium text-gray-700 mb-2 block">
                            Port <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="port"
                            type="text"
                            value={port}
                            onChange={(e) => setPort(e.target.value)}
                            placeholder="Enter Port"
                            className="w-full border border-gray-200"
                        />
                    </div>
                </div>
                <div className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={() => { setIpAddress(""); setPort(""); onClose(); }}
                        className="border-[#161CCA] text-[#161CCA] cursor-pointer"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfigure}
                        disabled={!isFormValid || isPending}
                        className={`bg-[#161CCA] text-white ${
                            !isFormValid ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                        }`}
                    >
                        {isPending ? "Configuring..." : "Configure"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

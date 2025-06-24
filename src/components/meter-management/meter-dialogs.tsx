// components/meter-management/MeterDialogs.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

interface DeactivateDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onDeactivate: (reason: string) => void;
    meterNumber: string;
}

export function DeactivateDialog({ isOpen, onClose, onDeactivate }: DeactivateDialogProps) {
    const [reason, setReason] = useState<string>("");
    const [isFinalConfirmOpen, setIsFinalConfirmOpen] = useState(false);

    const handleDeactivate = () => {
        if (reason) setIsFinalConfirmOpen(true);
    };

    const handleFinalDeactivate = () => {
        onDeactivate(reason);
        setIsFinalConfirmOpen(false);
        onClose();
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[350px] h-fit bg-white rounded-lg p-8">
                    <DialogHeader className="flex flex-row items-center justify-between pb-3">
                        <div className="flex-col items-center gap-2">
                            {/* <AlertTriangle size={20} className="text-[#F50202] bg-red-100 p-3 rounded-full" /> */}
                            <DialogTitle className="text-lg font-semibold text-gray-900 mt-2">Deactivate Meter</DialogTitle>
                        </div>
                    </DialogHeader>
                    <div className="">
                        <p className="text-sm text-gray-700">Reason</p>
                        <Input
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full mt-2 border-gray-300"
                            placeholder="Enter reason to deactivate"
                        />
                    </div>
                    <DialogFooter className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            className="border-[#F50202] text-[#F50202] hover:bg-red-50"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-[#F50202] text-white hover:bg-red-700 cursor-pointer"
                            onClick={handleDeactivate}
                            disabled={!reason}
                        >
                            Deactivate
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isFinalConfirmOpen} onOpenChange={setIsFinalConfirmOpen}>
                <DialogContent className="sm:max-w-[350px] h-fit bg-white rounded-lg p-6">
                    <DialogHeader className="flex flex-row items-center justify-between pb-3">
                        <div className="flex-col gap-2">
                            <AlertTriangle size={20} className="text-[#F50202] bg-red-100 p-3 rounded-full mt-4" />
                            <DialogTitle className="text-lg font-semibold text-gray-900 mt-2">Deactivate meter</DialogTitle>
                        </div>
                    </DialogHeader>
                    <div className="">
                        <p className="text-sm text-gray-700">
                            Are you sure you want to deactivate meter?
                        </p>
                    </div>
                    <DialogFooter className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-50"
                            onClick={() => setIsFinalConfirmOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-red-600 text-white hover:bg-red-700"
                            onClick={handleFinalDeactivate}
                        >
                            Deactivate
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

interface ApproveDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onApprove: () => void;
    meterNumber: string;
}

export function ApproveDialog({ isOpen, onClose, onApprove, meterNumber }: ApproveDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[300px] h-70 bg-white rounded-lg p-6">
                <DialogHeader className="flex flex-row items-center justify-between pb-3">
                    <div className="flex items-center gap-2">
                        <AlertTriangle size={20} className="text-[#161CCA] p-3 rounded-full bg-[#E8E9FC]" />
                        <DialogTitle className="text-lg font-semibold text-gray-900">Approve Meter</DialogTitle>
                    </div>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-gray-700">
                        Are you sure you want to approve meter {meterNumber}?
                    </p>
                </div>
                <DialogFooter className="flex justify-end gap-3">
                    <Button
                        variant="outline"
                        className="border-[#F50202] text-[#F50202] hover:bg-red-50"
                        onClick={onClose}
                        size={"lg"}
                    >
                        Reject
                    </Button>
                    <Button
                        className="bg-[#161CCA] text-white hover:bg-blue-700"
                        onClick={() => {
                            onApprove();
                            onClose();
                        }}
                        size={"lg"}
                    >
                        Approve
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface AssignDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onAssign: (data: { firstName: string; lastName: string; accountNumber: string; nin: string; phone: string; email: string; state: string; city: string; streetName: string; houseNo: string }) => void;
    meterNumber: string;
}

export function AssignDialog({ isOpen, onClose, onAssign, meterNumber }: AssignDialogProps) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        accountNumber: "",
        nin: "",
        phone: "",
        email: "",
        state: "",
        city: "",
        streetName: "",
        houseNo: "",
    });
    const [isFinalConfirmOpen, setIsFinalConfirmOpen] = useState(false);

    const handleAssign = () => {
        if (
            formData.firstName &&
            formData.accountNumber &&
            formData.nin &&
            formData.phone &&
            formData.email &&
            formData.state &&
            formData.city &&
            formData.streetName &&
            formData.houseNo
        ) {
            setIsFinalConfirmOpen(true);
        }
    };

    const handleFinalAssign = () => {
        onAssign(formData);
        setIsFinalConfirmOpen(false);
        onClose();
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[400px] bg-white rounded-lg p-6 h-auto">
                    <DialogHeader className="flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                            <AlertTriangle size={20} className="text-[#161CCA] p-3 rounded-full bg-[#E8E9FC]" />
                            <DialogTitle className="text-lg font-semibold text-gray-900">Assign Meter</DialogTitle>
                        </div>
                    </DialogHeader>
                    <DialogDescription className="text-sm text-gray-700">
                        Fill all compulsory fields.
                    </DialogDescription>
                    <div className="py-4">
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <Label className="text-sm text-gray-700">
                                    First Name
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <Label className="text-sm text-gray-700">Last Name</Label>
                                <Input
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <Label className="text-sm text-gray-700">
                                    Account Number
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    value={formData.accountNumber}
                                    type="number"
                                    required
                                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                    className={`mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 
                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                                />
                            </div>
                            <div className="flex flex-col">
                                <Label className="text-sm text-gray-700">
                                    NIN
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    value={formData.nin}
                                    type="number"
                                    onChange={(e) => setFormData({ ...formData, nin: e.target.value })}
                                    className={`mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 
                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                                    required
                                />
                            </div>
                            <div>
                                <Label className="text-sm text-gray-700">
                                    Phone Number
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                    type="number"
                                    className={`mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 
                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                                />
                            </div>
                            <div>
                                <Label className="text-sm text-gray-700">
                                    Email
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    type="email"
                                    className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <Label className="text-sm text-gray-700">
                                    State
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.state}
                                    onValueChange={(value) => setFormData({ ...formData, state: value })}
                                    required
                                >
                                    <SelectTrigger className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                        <SelectValue placeholder="Select State" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Ogun">Ogun</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="text-sm text-gray-700">
                                    City
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.city}
                                    onValueChange={(value) => setFormData({ ...formData, city: value })}
                                    required
                                >
                                    <SelectTrigger className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                        <SelectValue placeholder="Select City" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Ibafo">Ibafo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="text-sm text-gray-700">
                                    Street Name
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    value={formData.streetName}
                                    required
                                    onChange={(e) => setFormData({ ...formData, streetName: e.target.value })}
                                    className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <Label className="text-sm text-gray-700">
                                    House No.
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    value={formData.houseNo}
                                    required
                                    type="number"
                                    onChange={(e) => setFormData({ ...formData, houseNo: e.target.value })}
                                    className={`mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500
                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            className="border-[#161CCA] text-[#161CCA] hover:bg-blue-50"
                            onClick={onClose}
                            size={"lg"}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-[#161CCA] text-white hover:bg-blue-700"
                            onClick={handleAssign}
                            disabled={
                                !formData.firstName ||
                                !formData.accountNumber ||
                                !formData.nin ||
                                !formData.phone ||
                                !formData.email ||
                                !formData.state ||
                                !formData.city ||
                                !formData.streetName ||
                                !formData.houseNo
                            }
                            size={"lg"}
                        >
                            Assign
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isFinalConfirmOpen} onOpenChange={setIsFinalConfirmOpen}>
                <DialogContent className="sm:max-w-[300px] h-70 bg-white rounded-lg p-6">
                    <DialogHeader className="flex flex-row items-center justify-between pb-3">
                        <div className="flex items-center gap-2">
                            <AlertTriangle size={20} className="text-[#161CCA] p-3 rounded-full bg-[#E8E9FC]" />
                            <DialogTitle className="text-lg font-semibold text-gray-900">Confirm Assignment</DialogTitle>
                        </div>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-gray-700">
                            Are you sure you want to assign meter {meterNumber} to {formData.firstName} {formData.lastName || ""}? This action cannot be undone.
                        </p>
                    </div>
                    <DialogFooter className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            className="border-[#161CCA] text-[#161CCA] hover:bg-blue-50"
                            onClick={() => setIsFinalConfirmOpen(false)}
                            size={"lg"}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-[#161CCA] text-white hover:bg-blue-700"
                            onClick={handleFinalAssign}
                            size={"lg"}
                        >
                            Assign
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
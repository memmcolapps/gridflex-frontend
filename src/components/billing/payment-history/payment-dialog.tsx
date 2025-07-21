// components/billing/payment-dialog.tsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Upload } from "lucide-react";

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    paymentType: string;
    accountNo: string;
    amount: string;
    paymentDate: string;
  }) => void;
}

export default function PaymentDialog({
  open,
  onClose,
  onSubmit,
}: PaymentDialogProps) {
  const [paymentType, setPaymentType] = useState("Manual");
  const [accountNo, setAccountNo] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setPaymentType("Manual");
      setAccountNo("");
      setAmount("");
      setPaymentDate("");
    }
  }, [open]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    // Basic validation
    if (!accountNo.trim() || !amount.trim() || !paymentDate.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    const paymentData = {
      paymentType,
      accountNo: accountNo.trim(),
      amount: amount.trim(),
      paymentDate,
    };

    onSubmit(paymentData);
    onClose();
  };

  // Handle dialog state change (for close via overlay/escape)
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[500px] overflow-y-auto bg-white">
        <DialogHeader className="pb-1">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Payment
              </DialogTitle>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex items-center gap-1 border-gray-300 text-xs text-gray-600 hover:bg-gray-50"
            >
              Bulk Upload <Upload size={10} />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* First Row: Payment Type and Account No */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="payment-type"
                className="text-sm font-medium text-gray-700"
              >
                Payment Type *
              </Label>
              <Select value={paymentType} onValueChange={setPaymentType}>
                <SelectTrigger id="payment-type" className="h-10 bg-white">
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Manual">Manual</SelectItem>
                  <SelectItem value="API">API</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="account-no"
                className="text-sm font-medium text-gray-700"
              >
                Account No. *
              </Label>
              <Input
                type="text"
                id="account-no"
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
                placeholder="EC20022636"
                className="h-10 border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Second Row: Amount and Payment Date */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="amount"
                className="text-sm font-medium text-gray-700"
              >
                Amount *
              </Label>
              <Input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="120,950"
                className="h-10 border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="payment-date"
                className="text-sm font-medium text-gray-700"
              >
                Payment Date *
              </Label>
              <Input
                type="date"
                id="payment-date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="h-10 border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Footer with actions */}
          <div className="flex justify-between gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="cursor-pointer rounded-md border border-gray-300 px-8 py-2 text-gray-700 hover:bg-gray-50"
            >
              Back
            </Button>
            <Button
              type="submit"
              className="cursor-pointer rounded-md bg-[#161CCA] px-8 py-2 text-white hover:bg-[#161CCA]/90"
            >
              Process Payment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

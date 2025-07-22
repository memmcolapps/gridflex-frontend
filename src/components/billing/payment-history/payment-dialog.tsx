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
      <DialogContent className="h-auto min-h-0 w-full max-w-md gap-0 bg-white p-4">
        {/* Hidden DialogTitle for accessibility - required by Radix UI */}
        <DialogTitle className="sr-only">Payment Dialog</DialogTitle>

        {/* Very Compact Layout */}
        <div className="space-y-4 pt-6">
          {/* Header Section - Payment title and Bulk Upload button on separate lines */}
          <div className="space-y-2">
            {/* Payment Title */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Payment</h2>
            </div>

            {/* Bulk Upload Button - positioned below and to the right */}
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 border-gray-300 px-2 text-xs text-gray-600 hover:bg-gray-50"
              >
                Bulk Upload <Upload size={8} className="ml-1" />
              </Button>
            </div>
          </div>

          {/* Form Content - Increased spacing between rows */}
          <div className="space-y-5">
            {" "}
            {/* Increased from space-y-4 to space-y-5 for even more spacing */}
            {/* Row 1 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label
                  htmlFor="payment-type"
                  className="mb-1 block text-xs font-medium text-gray-700"
                >
                  Payment Type *
                </Label>
                <Select value={paymentType} onValueChange={setPaymentType}>
                  <SelectTrigger
                    id="payment-type"
                    className="h-8 w-full bg-white text-sm"
                    style={{ width: "100%" }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    className="bg-white"
                    style={{ width: "var(--radix-select-trigger-width)" }}
                  >
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="API">API</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="account-no"
                  className="mb-1 block text-xs font-medium text-gray-700"
                >
                  Account No. *
                </Label>
                <Input
                  type="text"
                  id="account-no"
                  value={accountNo}
                  onChange={(e) => setAccountNo(e.target.value)}
                  placeholder="EC20022636"
                  className="h-8 w-full border-gray-300 bg-white text-sm"
                  required
                />
              </div>
            </div>
            {/* Row 2 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label
                  htmlFor="amount"
                  className="mb-1 block text-xs font-medium text-gray-700"
                >
                  Amount *
                </Label>
                <Input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="120,950"
                  className="h-8 w-full border-gray-300 bg-white text-sm"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <Label
                  htmlFor="payment-date"
                  className="mb-1 block text-xs font-medium text-gray-700"
                >
                  Payment Date *
                </Label>
                <Input
                  type="date"
                  id="payment-date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="h-8 w-full border-gray-300 bg-white text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-8 border-gray-300 px-4 text-sm text-gray-700"
            >
              Back
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              className="h-8 bg-[#161CCA] px-4 text-sm text-white hover:bg-[#161CCA]/90"
            >
              Process Payment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
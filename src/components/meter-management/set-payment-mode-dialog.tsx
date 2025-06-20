"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import type { MeterData } from "@/app/(protected)/data-management/meter-management/assign-meter/page";

interface SetPaymentModeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  debitMop: string;
  setDebitMop: (value: string) => void;
  creditMop: string;
  setCreditMop: (value: string) => void;
  debitPaymentPlan: string;
  setDebitPaymentPlan: (value: string) => void;
  creditPaymentPlan: string;
  setCreditPaymentPlan: (value: string) => void;
  progress: number;
  isPaymentFormComplete: boolean;
  editCustomer: MeterData | null;
  onProceed: () => void;
}

export function SetPaymentModeDialog({
  isOpen,
  onOpenChange,
  debitMop,
  setDebitMop,
  creditMop,
  setCreditMop,
  debitPaymentPlan,
  setDebitPaymentPlan,
  creditPaymentPlan,
  setCreditPaymentPlan,
  progress,
  isPaymentFormComplete,
  editCustomer,
  onProceed,
}: SetPaymentModeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-black h-fit">
        <DialogHeader>
          <Progress value={progress} className="w-full" />
          <DialogTitle className="mt-2 text-xl">Set Payment Mode</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div>
                <Label className="font-bold text-xl">
                  Debit
                </Label>
                <br />
                <p className="text-sm">
                  Mode of payment <span className="text-red-600">*</span>
                </p>
              </div>
              <div>
                <Select onValueChange={setDebitMop} value={debitMop}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select mode of payment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="one-off">One off</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <Label className="font-bold text-xl">
                  Credit
                </Label>
                <br />
                <p className="text-sm">
                  Mode of payment <span className="text-red-600">*</span>
                </p>
              </div>
              <div>
                <Select onValueChange={setCreditMop} value={creditMop}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select mode of payment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="one-off">One off</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Payment Plan</Label>
              <Select
                onValueChange={setDebitPaymentPlan}
                disabled={debitMop === "one-off" || debitMop === "percentage"}
                value={debitPaymentPlan}
              >
                <SelectTrigger
                  className={`w-full ${debitMop === "one-off" || debitMop === "percentage" ? "bg-gray-100 cursor-not-allowed text-gray-300" : ""}`}
                >
                  <SelectValue placeholder="Select payment plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Payment Plan</Label>
              <Select
                onValueChange={setCreditPaymentPlan}
                disabled={creditMop === "one-off" || creditMop === "percentage"}
                value={creditPaymentPlan}
              >
                <SelectTrigger
                  className={`w-full ${creditMop === "one-off" || creditMop === "percentage" ? "bg-gray-100 cursor-not-allowed text-gray-300" : ""}`}
                >
                  <SelectValue placeholder="Select payment plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-[#161CCA] border-[#161CCA] cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={onProceed}
            disabled={editCustomer ? false : !isPaymentFormComplete}
            className={
              editCustomer || isPaymentFormComplete
                ? "bg-[#161CCA] text-white cursor-pointer"
                : "bg-blue-200 text-white cursor-not-allowed"
            }
          >
            Proceed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
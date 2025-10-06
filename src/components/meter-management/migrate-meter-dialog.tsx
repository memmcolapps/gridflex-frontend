"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { MeterInventoryItem } from "@/types/meter-inventory"

interface MigrateMeterDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  migrateCustomer: MeterInventoryItem | null;
  migrateToCategory: string;
  setMigrateToCategory: (value: string) => void;
  migrateDebitMop: string;
  setMigrateDebitMop: (value: string) => void;
  migrateDebitPaymentPlan: string;
  setMigrateDebitPaymentPlan: (value: string) => void;
  migrateCreditMop: string;
  setMigrateCreditMop: (value: string) => void;
  migrateCreditPaymentPlan: string;
  setMigrateCreditPaymentPlan: (value: string) => void;
  isMigrateFormComplete: boolean;
  onConfirm: () => void;
}

export function MigrateMeterDialog({
  isOpen,
  onOpenChange,
  migrateCustomer,
  migrateToCategory,
  setMigrateToCategory,
  migrateDebitMop,
  setMigrateDebitMop,
  migrateDebitPaymentPlan,
  setMigrateDebitPaymentPlan,
  migrateCreditMop,
  setMigrateCreditMop,
  migrateCreditPaymentPlan,
  setMigrateCreditPaymentPlan,
  isMigrateFormComplete,
  onConfirm,
}: MigrateMeterDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-black h-fit w-lg">
        <DialogHeader>
          <DialogTitle className="font-semibold text-xl">Migrate Meter</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Migrate from <span className="text-red-600">*</span>
                </Label>
                <Input
                  value={migrateCustomer?.category ?? ""}
                  disabled
                  className="w-full h-10 bg-gray-100 text-gray-600 cursor-not-allowed border-gray-200 focus:ring-0"
                />
              </div>
              {migrateToCategory === "Prepaid" && (
                <>
                  <h2 className="font-bold">Debit</h2>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Mode of Payment <span className="text-red-600">*</span>
                    </Label>
                    <Select onValueChange={setMigrateDebitMop} value={migrateDebitMop}>
                      <SelectTrigger className="w-full h-10 border-gray-200 focus:ring-[#161CCA]/50">
                        <SelectValue placeholder="Select mode of payment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="one-off">One off</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Payment Plan</Label>
                    <Select
                      onValueChange={setMigrateDebitPaymentPlan}
                      disabled={migrateDebitMop === "percentage" || migrateDebitMop === "one-off"}
                      value={migrateDebitPaymentPlan}
                    >
                      <SelectTrigger
                        className={`w-full h-10 border-gray-200 focus:ring-[#161CCA]/50 ${
                          migrateDebitMop === "percentage" || migrateDebitMop === "one-off"
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "text-gray-600"
                        }`}
                      >
                        <SelectValue placeholder="Select payment plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Migrate to <span className="text-red-600">*</span>
                </Label>
                <Select onValueChange={setMigrateToCategory} value={migrateToCategory}>
                  <SelectTrigger className="w-full h-10 border-gray-200 focus:ring-[#161CCA]/50">
                    <SelectValue placeholder="Select meter category" />
                  </SelectTrigger>
                  <SelectContent>
                    {migrateCustomer?.category === "Postpaid" && <SelectItem value="Prepaid">Prepaid</SelectItem>}
                    {migrateCustomer?.category === "Prepaid" && <SelectItem value="Postpaid">Postpaid</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
              {migrateToCategory === "Prepaid" && (
                <>
                  <h2 className="font-bold">Credit</h2>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Mode of Payment <span className="text-red-600">*</span>
                    </Label>
                    <Select onValueChange={setMigrateCreditMop} value={migrateCreditMop}>
                      <SelectTrigger className="w-full h-10 border-gray-200 focus:ring-[#161CCA]/50">
                        <SelectValue placeholder="Select mode of payment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="one-off">One off</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Payment Plan</Label>
                    <Select
                      onValueChange={setMigrateCreditPaymentPlan}
                      disabled={migrateCreditMop === "percentage" || migrateCreditMop === "one-off"}
                      value={migrateCreditPaymentPlan}
                    >
                      <SelectTrigger
                        className={`w-full h-10 border-gray-200 focus:ring-[#161CCA]/50 ${
                          migrateCreditMop === "percentage" || migrateCreditMop === "one-off"
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "text-gray-600"
                        }`}
                      >
                        <SelectValue placeholder="Select payment plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#161CCA] text-[#161CCA] hover:bg-[#161CCA]/10 h-10 px-4 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={!isMigrateFormComplete}
            className={
              isMigrateFormComplete
                ? "bg-[#161CCA] text-white hover:bg-[#161CCA]/90 h-10 px-4 cursor-pointer"
                : "bg-blue-200 text-white cursor-not-allowed h-10 px-4"
            }
          >
            Migrate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
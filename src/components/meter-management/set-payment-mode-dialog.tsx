"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { MeterInventoryItem } from "@/types/meter-inventory";
import { useEditAssignedMeter } from "@/hooks/use-meter";
import { toast } from "sonner";

// Old interface for backward compatibility
interface SetPaymentModeDialogPropsLegacy {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  paymentType: string;
  setPaymentType: (value: string) => void;
  paymentMode: string;
  setPaymentMode: (value: string) => void;
  paymentPlan: string;
  setPaymentPlan: (value: string) => void;
  // Optional separate credit state - if not provided, credit uses same as debit
  creditPaymentMode?: string;
  setCreditPaymentMode?: (value: string) => void;
  creditPaymentPlan?: string;
  setCreditPaymentPlan?: (value: string) => void;
  isPaymentFormComplete: boolean;
  editCustomer: MeterInventoryItem | null;
  onProceed: () => void;
}

// New interface with separate debit/credit state and required fields for edit
export interface SetPaymentModeDialogProps {
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
  isPaymentFormComplete: boolean;
  editCustomer: MeterInventoryItem | null;
  // Additional fields needed for edit
  tariff: string;
  dssAssetId: string;
  feederAssetId: string;
  cin: string;
  accountNumber: string;
  state: string;
  city: string;
  streetName: string;
  houseNo: string;
  onEditSuccess?: () => void;
}

type SetPaymentModeDialogPropsCombined = SetPaymentModeDialogProps | (SetPaymentModeDialogPropsLegacy & {
  // Mark legacy props as required to distinguish from new interface
  paymentType: string;
  setPaymentType: (value: string) => void;
  paymentMode: string;
  setPaymentMode: (value: string) => void;
  paymentPlan: string;
  setPaymentPlan: (value: string) => void;
});

// Helper type guard to check if using new interface
function isNewInterface(props: SetPaymentModeDialogPropsCombined): props is SetPaymentModeDialogProps {
  return 'debitMop' in props && 'creditMop' in props;
}

export function SetPaymentModeDialog(props: SetPaymentModeDialogPropsCombined) {
  console.log("=== SetPaymentModeDialog rendered ===", { isOpen: props.isOpen, hasDebitMop: 'debitMop' in props });
  const editAssignedMeterMutation = useEditAssignedMeter();
  
  // Handle both old and new interfaces
  if (isNewInterface(props)) {
    console.log("=== Using NEW interface ===");
    const {
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
      isPaymentFormComplete,
      editCustomer,
      tariff,
      dssAssetId,
      feederAssetId,
      cin,
      accountNumber,
      state,
      city,
      streetName,
      houseNo,
      onEditSuccess,
    } = props;

    const isDebitModeDisabled = debitMop === "one-off" || debitMop === "percentage";
    const isCreditModeDisabled = creditMop === "one-off" || creditMop === "percentage";

    const handleSave = () => {
      console.log("=== handleSave START ===");
      console.log("editCustomer:", editCustomer);
      console.log("tariff:", tariff, "dssAssetId:", dssAssetId);
      console.log("debitMop:", debitMop, "creditMop:", creditMop);
      console.log("isPaymentFormComplete:", isPaymentFormComplete);
      
      if (!editCustomer) {
        console.log("No editCustomer, not calling API");
        toast.error("No customer selected. Please try again.");
        alert("Error: No customer selected. Please try again.");
        return;
      }

      // Build the payload using meterAssignLocation.id or customer.id
      const meterAssignId = (editCustomer as any).meterAssignLocation?.id || editCustomer.id || editCustomer.customerId;
      
      if (!meterAssignId) {
        console.log("No meterAssignId found", { 
          id: editCustomer.id, 
          customerId: editCustomer.customerId,
          meterAssignLocation: (editCustomer as any).meterAssignLocation 
        });
        toast.error("Cannot find customer ID. Please refresh and try again.");
        alert("Error: Cannot find customer ID. Please refresh and try again.");
        return;
      }
      
      console.log("meterAssignId:", meterAssignId);
      
      const payload = {
        id: meterAssignId,
        tariff: tariff,
        dssAssetId: dssAssetId,
        feederAssetId: feederAssetId,
        cin: cin,
        accountNumber: accountNumber,
        meterAssignLocation: {
          state: state,
          city: city,
          houseNo: houseNo,
          streetName: streetName,
        },
        paymentMode: {
          debitPaymentMode: debitMop,
          debitPaymentPlan: debitMop === "one-off" ? "" : debitPaymentPlan,
          creditPaymentMode: creditMop,
          creditPaymentPlan: creditMop === "one-off" ? "" : creditPaymentPlan,
        },
      };

      console.log("Calling editAssignedMeterMutation with payload:", payload);

      editAssignedMeterMutation.mutate(payload, {
        onSuccess: () => {
          console.log("Edit success!");
          toast.success("Payment mode updated successfully!");
          onOpenChange(false);
          if (onEditSuccess) {
            onEditSuccess();
          }
        },
        onError: (error) => {
          console.error("Failed to update meter:", error);
          toast.error(error.message || "Failed to update payment mode!");
        },
      });
    };

    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="bg-white text-black h-fit max-w-2xl">
          <DialogHeader>
            <DialogTitle className="mt-2 text-xl">Set Payment Mode</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Debit Section */}
              <div className="space-y-2 p-3">
                <div>
                  <Label className="font-bold text-lg">
                    Debit Payment
                  </Label>
                </div>
                <div>
                  <p className="text-sm">
                    Mode of payment <span className="text-red-600">*</span>
                  </p>
                  <Select onValueChange={setDebitMop} value={debitMop}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select mode of payment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="one-off">One off</SelectItem>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="no-payment">No Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Payment Plan</Label>
                  <Select
                    onValueChange={setDebitPaymentPlan}
                    disabled={isDebitModeDisabled}
                    value={debitPaymentPlan}
                  >
                    <SelectTrigger
                      className={`w-full ${isDebitModeDisabled ? "bg-gray-100 cursor-not-allowed text-gray-300" : ""}`}
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
              {/* Credit Section */}
              <div className="space-y-2 p-3">
                <div>
                  <Label className="font-bold text-lg">
                    Credit Payment
                  </Label>
                </div>
                <div>
                  <p className="text-sm">
                    Mode of payment <span className="text-red-600">*</span>
                  </p>
                  <Select onValueChange={setCreditMop} value={creditMop}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select mode of payment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="one-off">One off</SelectItem>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="no-payment">No Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Payment Plan</Label>
                  <Select
                    onValueChange={setCreditPaymentPlan}
                    disabled={isCreditModeDisabled}
                    value={creditPaymentPlan}
                  >
                    <SelectTrigger
                      className={`w-full ${isCreditModeDisabled ? "bg-gray-100 cursor-not-allowed text-gray-300" : ""}`}
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
              onClick={handleSave}
              disabled={editAssignedMeterMutation.isPending}
              className="bg-[#161CCA] text-white cursor-pointer"
            >
              {editAssignedMeterMutation.isPending ? "Saving..." : "Save Payment Mode"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Legacy interface - with payment type selection and both debit/credit sections
  const {
    isOpen,
    onOpenChange,
    paymentType,
    setPaymentType,
    paymentMode,
    setPaymentMode,
    paymentPlan,
    setPaymentPlan,
    // Optional separate credit state
    creditPaymentMode,
    setCreditPaymentMode,
    creditPaymentPlan,
    setCreditPaymentPlan,
    isPaymentFormComplete,
    editCustomer,
    onProceed,
  } = props;

  // Use separate credit state if provided, otherwise fall back to debit state
  const effectiveCreditPaymentMode = creditPaymentMode ?? paymentMode;
  const effectiveSetCreditPaymentMode = setCreditPaymentMode ?? setPaymentMode;
  const effectiveCreditPaymentPlan = creditPaymentPlan ?? paymentPlan;
  const effectiveSetCreditPaymentPlan = setCreditPaymentPlan ?? setPaymentPlan;

  const isModeDisabled = paymentMode === "one-off" || paymentMode === "percentage";
  const isCreditModeDisabled = effectiveCreditPaymentMode === "one-off" || effectiveCreditPaymentMode === "percentage";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-black h-fit max-w-2xl">
        <DialogHeader>
          <DialogTitle className="mt-2 text-xl">Set Payment Mode</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Payment Type Selection */}
          {/* <div className="space-y-2">
            <Label className="font-semibold text-sm">
              Payment Type <span className="text-red-600">*</span>
            </Label>
            <Select onValueChange={setPaymentType} value={paymentType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select payment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="debit">Debit</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
              </SelectContent>
            </Select>
          </div> */}

          <div className="grid grid-cols-2 gap-4">
            {/* Debit Section */}
            <div className="space-y-2 p-3 rounded-lg">
              <div className="space-y-2">
                <Label className="font-bold text-lg">
                  Debit
                </Label>
              </div>
              <div className="space-y-2">
                <p className="text-sm">
                  Mode of payment <span className="text-red-600">*</span>
                </p>
                <Select onValueChange={setPaymentMode} value={paymentMode}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select mode of payment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="one-off">One off</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="no-payment">No Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Payment Plan</Label>
                <Select
                  onValueChange={setPaymentPlan}
                  disabled={isModeDisabled}
                  value={paymentPlan}
                >
                  <SelectTrigger
                    className={`w-full ${isModeDisabled ? "bg-gray-100 cursor-not-allowed text-gray-300" : ""}`}
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
            {/* Credit Section */}
            <div className="space-y-2 p-3 rounded-lg">
              <div>
                <Label className="font-bold text-lg">
                  Credit
                </Label>
              </div>
              <div className="space-y-2">
                <p className="text-sm">
                  Mode of payment <span className="text-red-600">*</span>
                </p>
                <Select onValueChange={effectiveSetCreditPaymentMode} value={effectiveCreditPaymentMode}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select mode of payment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="one-off">One off</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="no-payment">No Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Payment Plan</Label>
                <Select
                  onValueChange={effectiveSetCreditPaymentPlan}
                  disabled={isCreditModeDisabled}
                  value={effectiveCreditPaymentPlan}
                >
                  <SelectTrigger
                    className={`w-full ${isCreditModeDisabled ? "bg-gray-100 cursor-not-allowed text-gray-300" : ""}`}
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
            className="bg-[#161CCA] text-white cursor-pointer"
          >
            Save Payment Mode
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

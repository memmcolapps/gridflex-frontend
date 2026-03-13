"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MeterInventoryItem, EditAssignedMeterPayload } from "@/types/meter-inventory";
import { useEditAssignedMeter } from "@/hooks/use-meter";
import { toast } from "sonner";

interface EditPaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editCustomer: MeterInventoryItem | EditAssignedMeterPayload | null;
  // Edited values from parent dialog
  editedCin?: string;
  editedAccountNumber?: string;
  editedTariff?: string;
  editedFeeder?: string;
  editedDss?: string;
  editedState?: string;
  editedCity?: string;
  editedStreetName?: string;
  editedHouseNo?: string;
  debitMop: string;
  setDebitMop: (value: string) => void;
  creditMop: string;
  setCreditMop: (value: string) => void;
  debitPaymentPlan: string;
  setDebitPaymentPlan: (value: string) => void;
  creditPaymentPlan: string;
  setCreditPaymentPlan: (value: string) => void;
  isPaymentFormComplete: boolean;
  onProceed: () => void;
  onBack: () => void;
}

export function EditPaymentDialog({
  isOpen,
  onOpenChange,
  editCustomer,
  editedCin,
  editedAccountNumber,
  editedTariff,
  editedFeeder,
  editedDss,
  editedState,
  editedCity,
  editedStreetName,
  editedHouseNo,
  debitMop,
  setDebitMop,
  creditMop,
  setCreditMop,
  debitPaymentPlan,
  setDebitPaymentPlan,
  creditPaymentPlan,
  setCreditPaymentPlan,
  isPaymentFormComplete,
  onProceed,
  onBack,
}: EditPaymentDialogProps) {
  const editAssignedMeterMutation = useEditAssignedMeter();

  const handleSave = () => {
    if (!editCustomer) {
      toast.error("No customer selected");
      alert("Error: No customer selected");
      return;
    }

    // Build payload - use edited values if provided, otherwise fall back to editCustomer values
    let payload: EditAssignedMeterPayload;

    if ('paymentMode' in editCustomer) {
      // It's EditAssignedMeterPayload - use properties directly
      payload = {
        id: editCustomer.id,
        tariff: editedTariff ?? editCustomer.tariff,
        dssAssetId: editedDss ?? editCustomer.dssAssetId,
        feederAssetId: editedFeeder ?? editCustomer.feederAssetId,
        cin: editedCin ?? editCustomer.cin,
        accountNumber: editedAccountNumber ?? editCustomer.accountNumber,
        meterAssignLocation: {
          state: editedState ?? editCustomer.meterAssignLocation.state ?? "",
          city: editedCity ?? editCustomer.meterAssignLocation.city ?? "",
          houseNo: editedHouseNo ?? editCustomer.meterAssignLocation.houseNo ?? "",
          streetName: editedStreetName ?? editCustomer.meterAssignLocation.streetName ?? "",
        },
        paymentMode: {
          debitPaymentMode: debitMop,
          debitPaymentPlan: debitMop === "one-off" || debitMop === "percentage" || debitMop === "no-payment" || debitMop === "no payment" ? "" : debitPaymentPlan,
          creditPaymentMode: creditMop,
          creditPaymentPlan: creditMop === "one-off" || creditMop === "percentage" || creditMop === "no-payment" || creditMop === "no payment" ? "" : creditPaymentPlan,
        },
      };
    } else {
      // It's MeterInventoryItem - use edited values if provided
      const meterAssignId = editCustomer.id ?? "";
      
      payload = {
        id: meterAssignId,
        tariff: editedTariff ?? editCustomer.tariff ?? "",
        dssAssetId: editedDss ?? editCustomer.dss ?? "",
        feederAssetId: editedFeeder ?? editCustomer.feederLine ?? "",
        cin: editedCin ?? editCustomer.cin ?? "",
        accountNumber: editedAccountNumber ?? editCustomer.accountNumber ?? "",
        meterAssignLocation: {
          state: editedState ?? editCustomer.meterAssignLocation?.state ?? "",
          city: editedCity ?? editCustomer.meterAssignLocation?.city ?? "",
          houseNo: editedHouseNo ?? editCustomer.meterAssignLocation?.houseNo ?? "",
          streetName: editedStreetName ?? editCustomer.meterAssignLocation?.streetName ?? "",
        },
        paymentMode: {
          debitPaymentMode: debitMop,
          debitPaymentPlan: debitMop === "one-off" || debitMop === "percentage" || debitMop === "no-payment" || debitMop === "no payment" ? "" : debitPaymentPlan,
          creditPaymentMode: creditMop,
          creditPaymentPlan: creditMop === "one-off" || creditMop === "percentage" || creditMop === "no-payment" || creditMop === "no payment" ? "" : creditPaymentPlan,
        },
      };
    }

    editAssignedMeterMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Meter updated successfully!");
        onOpenChange(false);
        if (onProceed) onProceed();
      },
      onError: (error) => {
        toast.error(error.message ?? "Failed to update payment mode!");
        alert(error.message ?? "Failed to update payment mode!");
      },
    });
  };

  // Get payment plan options based on mode of payment
  const getDebitPaymentPlanOptions = () => {
    if (debitMop === "one-off" || debitMop === "percentage" || debitMop === "no-payment" || debitMop === "no payment") return null;
    // monthly - show 6 and 3
    return (
      <>
        <SelectItem value="6">6</SelectItem>
        <SelectItem value="3">3</SelectItem>
      </>
    );
  };

  const getCreditPaymentPlanOptions = () => {
    if (creditMop === "one-off" || creditMop === "percentage" || creditMop === "no-payment" || creditMop === "no payment" || creditMop === "no payment") return null;
    // monthly - show 6 and 3
    return (
      <>
        <SelectItem value="6">6</SelectItem>
        <SelectItem value="3">3</SelectItem>
      </>
    );
  };

  // Check if payment plan should be disabled (for one-off, percentage, and no-payment/no payment)
  const isDebitPaymentPlanDisabled = debitMop === "one-off" || debitMop === "percentage" || debitMop === "no-payment" || debitMop === "no payment";
  const isCreditPaymentPlanDisabled = creditMop === "one-off" || creditMop === "percentage" || creditMop === "no-payment" || creditMop === "no payment" || creditMop === "no payment";

  // Get default value for payment plan based on mode
  const getDebitPaymentPlanValue = () => {
    // If mop is one-off, percentage, or no-payment/no payment, show placeholder
    if (debitMop === "one-off" || debitMop === "percentage" || debitMop === "no-payment" || debitMop === "no payment") return "";
    // For monthly, return the actual payment plan value, or default to "6" if empty
    return debitPaymentPlan || "6";
  };

  const getCreditPaymentPlanValue = () => {
    // If mop is one-off, percentage, or no-payment/no payment, show placeholder
    if (creditMop === "one-off" || creditMop === "percentage" || creditMop === "no-payment" || creditMop === "no payment" || creditMop === "no payment") return "";
    // For monthly, return the actual payment plan value, or default to "6" if empty
    return creditPaymentPlan || "6";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-black h-fit border-none">
        <DialogHeader>
          <DialogTitle className="mt-2 text-xl">Edit Payment Mode</DialogTitle>
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
                  
                  <SelectItem value="no payment">No Payment</SelectItem>
                  
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
                 
                  <SelectItem value="no payment">No Payment</SelectItem>
                 
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Payment Plan</Label>
              <Select
                onValueChange={setDebitPaymentPlan}
                disabled={isDebitPaymentPlanDisabled}
                value={getDebitPaymentPlanValue()}
              >
                <SelectTrigger
                  className={`w-full ${isDebitPaymentPlanDisabled ? "bg-gray-100 cursor-not-allowed text-gray-400" : ""}`}
                >
                  <SelectValue placeholder="Select payment plan" />
                </SelectTrigger>
                <SelectContent>
                  {getDebitPaymentPlanOptions()}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Payment Plan</Label>
              <Select
                onValueChange={setCreditPaymentPlan}
                disabled={isCreditPaymentPlanDisabled}
                value={getCreditPaymentPlanValue()}
              >
                <SelectTrigger
                  className={`w-full ${isCreditPaymentPlanDisabled ? "bg-gray-100 cursor-not-allowed text-gray-400" : ""}`}
                >
                  <SelectValue placeholder="Select payment plan" />
                </SelectTrigger>
                <SelectContent>
                  {getCreditPaymentPlanOptions()}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              onBack();
            }}
            className="text-[#161CCA] border-[#161CCA] cursor-pointer"
          >
            Back
          </Button>
          <Button
            onClick={handleSave}
            disabled={editCustomer ? false : !isPaymentFormComplete}
            className={
              editCustomer || isPaymentFormComplete
                ? "bg-[#161CCA] text-white cursor-pointer"
                : "bg-blue-200 text-white cursor-not-allowed"
            }
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

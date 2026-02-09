/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import type { MeterInventoryItem } from "@/types/meter-inventory";
import { EditPaymentDialog } from "@/components/meter-management/edit-payment-dialog";

interface EditCustomerDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editCustomer: MeterInventoryItem | null;
  meterNumber: string;
  setMeterNumber: (value: string) => void;
  cin: string;
  setCin: (value: string) => void;
  accountNumber: string;
  setAccountNumber: (value: string) => void;
  tariff: string;
  setTariff: (value: string) => void;
  feeder: string;
  setFeeder: (value: string) => void;
  dss: string;
  setDss: (value: string) => void;
  state: string;
  setState: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  streetName: string;
  setStreetName: (value: string) => void;
  houseNo: string;
  setHouseNo: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  progress: number;
  isFormComplete: boolean;
  onProceed: () => void;
  onNextToPayment: () => void;
}

export function EditCustomerDetailsDialog({
  isOpen,
  onOpenChange,
  editCustomer,
  meterNumber,
  setMeterNumber,
  cin,
  setCin,
  accountNumber,
  setAccountNumber,
  tariff,
  setTariff,
  feeder,
  setFeeder,
  dss,
  setDss,
  state,
  setState,
  city,
  setCity,
  streetName,
  setStreetName,
  houseNo,
  setHouseNo,
  phone,
  setPhone,
  progress,
  isFormComplete,
  onProceed,
  onNextToPayment,
}: EditCustomerDetailsDialogProps) {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  // Payment mode state
  const [debitMop, setDebitMop] = useState("");
  const [creditMop, setCreditMop] = useState("");
  const [debitPaymentPlan, setDebitPaymentPlan] = useState("");
  const [creditPaymentPlan, setCreditPaymentPlan] = useState("");

  const handleNextToPayment = () => {
    onOpenChange(false);
    setShowPaymentDialog(true);
    onNextToPayment();
  };

  const handleBackToCustomerDetails = () => {
    setShowPaymentDialog(false);
    onOpenChange(true);
  };

  const isPaymentFormComplete = debitMop !== "" && creditMop !== "";

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="bg-white text-black h-fit border-none">
          {/* {editCustomer?.category === "Prepaid" && <Progress value={progress} className="w-full mt-4" />} */}
          <DialogHeader>
            <DialogTitle>Edit Details</DialogTitle>
            <p className="text-sm">Fill all compulsory fields</p>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Customer ID<span className="text-red-700">*</span>
                </Label>
                <Input
                  value={editCustomer?.customerId ?? ""}
                  readOnly
                  disabled
                  placeholder="Enter Customer ID"
                  className="cursor-not-allowed border-gray-200 bg-gray-100 text-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label>
                  First Name<span className="text-red-700">*</span>
                </Label>
                <Input
                  value={editCustomer?.firstName ?? ""}
                  readOnly
                  placeholder="Enter First Name"
                  className="border-gray-200 text-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Last Name<span className="text-red-700">*</span>
                </Label>
                <Input
                  value={editCustomer?.lastName ?? ""}
                  readOnly
                  placeholder="Enter Last Name"
                  className="border-gray-200 text-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Phone Number<span className="text-red-700">*</span>
                </Label>
                <Input
                  value={editCustomer?.phone ?? ""}
                  // onChange={(e) => setPhone(e.target.value)}
                  readOnly
                  placeholder="Enter Phone Number"
                  className="border-gray-200 text-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Meter Number<span className="text-red-700">*</span>
                </Label>
                <Input
                  value={editCustomer?.meterNumber ?? meterNumber}
                  onChange={(e) => setMeterNumber(e.target.value)}
                  placeholder="Enter Meter Number"
                  className="border-gray-200 text-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label>
                  CIN<span className="text-red-700">*</span>
                </Label>
                <Input
                  value={cin}
                  onChange={(e) => setCin(e.target.value)}
                  placeholder="Enter CIN"
                  className="border-gray-200 text-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Account Number<span className="text-red-700">*</span>
                </Label>
                <Input
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Enter Account Number"
                  className="border-gray-200 text-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Tariff<span className="text-red-700">*</span>
                </Label>
                <Input
                  value={tariff}
                  onChange={(e) => setTariff(e.target.value)}
                  // placeholder="Enter CIN"
                  className="border-gray-200 text-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Feeder Line<span className="text-red-700">*</span>
                </Label>
                <Input
                  value={feeder}
                  onChange={(e) => setFeeder(e.target.value)}
                  // placeholder="Enter CIN"
                  className="border-gray-200 text-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label>
                  DSS<span className="text-red-700">*</span>
                </Label>
                <Input
                  value={dss}
                  onChange={(e) => setDss(e.target.value)}
                  // placeholder="Enter CIN"
                  className="border-gray-200 text-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label>
                  State<span className="text-red-700">*</span>
                </Label>
                <Input
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Enter State"
                  className="border-gray-100 text-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label>
                  City<span className="text-red-700">*</span>
                </Label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter City"
                  className="border-gray-100 text-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Street Name<span className="text-red-700">*</span>
                </Label>
                <Input
                  value={streetName}
                  onChange={(e) => setStreetName(e.target.value)}
                  placeholder="Enter Street Name"
                  className="border-gray-100 text-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label>
                  House No. <span className="text-red-700">*</span>
                </Label>
                <Input
                  value={houseNo}
                  onChange={(e) => setHouseNo(e.target.value)}
                  placeholder="Enter House No"
                  className="border-gray-100 text-gray-600"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="cursor-pointer border-[#161CCA] text-[#161CCA]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleNextToPayment}
                disabled={editCustomer ? false : !isFormComplete}
                className={
                  editCustomer || isFormComplete
                    ? "cursor-pointer bg-[#161CCA] text-white"
                    : "cursor-not-allowed bg-blue-200 text-white"
                }
              >
                Next
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <EditPaymentDialog
        isOpen={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        editCustomer={editCustomer}
        debitMop={debitMop}
        setDebitMop={setDebitMop}
        creditMop={creditMop}
        setCreditMop={setCreditMop}
        debitPaymentPlan={debitPaymentPlan}
        setDebitPaymentPlan={setDebitPaymentPlan}
        creditPaymentPlan={creditPaymentPlan}
        setCreditPaymentPlan={setCreditPaymentPlan}
        isPaymentFormComplete={isPaymentFormComplete}
        onProceed={() => {
          console.log("Payment mode saved", {
            debitMop,
            creditMop,
            debitPaymentPlan,
            creditPaymentPlan,
          });
          setShowPaymentDialog(false);
        }}
        onBack={handleBackToCustomerDetails}
      />
    </>
  );
}

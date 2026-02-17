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
import { useNigerianStates, useNigerianCities } from "@/hooks/use-location";
import { useFeeders, useDSS } from "@/hooks/use-node";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

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

  // Dropdown open states
  const [feederOpen, setFeederOpen] = useState(false);
  const [dssOpen, setDssOpen] = useState(false);

  // Location hooks
  const {
    data: states,
    isLoading: isLoadingStates,
    isError: isErrorStates,
  } = useNigerianStates();
  const {
    data: cities,
    isLoading: isLoadingCities,
    isError: isErrorCities,
  } = useNigerianCities(state);

  const { data: feeders, isLoading: isLoadingFeeders } = useFeeders();
  const { data: dssOptions, isLoading: isLoadingDSS } = useDSS(feeder || null);

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
                <Popover open={feederOpen} onOpenChange={setFeederOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={feederOpen}
                      className="w-full justify-between border-gray-200 text-gray-600"
                      disabled={isLoadingFeeders}
                    >
                      {feeder
                        ? (feeders?.find((f) => f.assetId === feeder)?.name ??
                          "Select feeder...")
                        : isLoadingFeeders
                          ? "Loading feeders..."
                          : "Select feeder..."}
                      <ChevronsUpDown
                        className="ml-2 h-4 w-4 shrink-0 opacity-50"
                        size={14}
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full border-none p-0">
                    <Command className="border-none bg-white">
                      <CommandInput
                        placeholder="Search feeder..."
                        className="border-none"
                      />
                      <CommandList>
                        <CommandEmpty>No feeder found.</CommandEmpty>
                        <CommandGroup>
                          {feeders?.map((feederItem) => (
                            <CommandItem
                              key={feederItem.assetId}
                              value={feederItem.name}
                              onSelect={() => {
                                const selectedAssetId =
                                  feederItem.assetId === feeder
                                    ? ""
                                    : feederItem.assetId;
                                setFeeder(selectedAssetId);
                                if (selectedAssetId !== feeder) {
                                  setDss("");
                                }
                                setFeederOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 !h-3.5 !w-3.5",
                                  feeder === feederItem.assetId
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {feederItem.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>
                  DSS<span className="text-red-700">*</span>
                </Label>
                <Popover open={dssOpen} onOpenChange={setDssOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={dssOpen}
                      className="w-full justify-between border-gray-200 text-gray-600"
                      disabled={!feeder || isLoadingDSS}
                    >
                      {dss
                        ? (dssOptions?.find((d) => d.assetId === dss)?.name ??
                          "Select DSS...")
                        : !feeder
                          ? "Select feeder first"
                          : isLoadingDSS
                            ? "Loading DSS..."
                            : "Select DSS..."}
                      <ChevronsUpDown
                        className="ml-2 h-4 w-4 shrink-0 opacity-50"
                        size={14}
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full border-none p-0">
                    <Command className="border-none bg-white">
                      <CommandInput
                        placeholder="Search DSS..."
                        className="border-none"
                      />
                      <CommandList>
                        <CommandEmpty>No DSS found.</CommandEmpty>
                        <CommandGroup>
                          {dssOptions?.map((dssItem) => (
                            <CommandItem
                              key={dssItem.assetId}
                              value={dssItem.name}
                              onSelect={() => {
                                setDss(
                                  dssItem.assetId === dss
                                    ? ""
                                    : dssItem.assetId,
                                );
                                setDssOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 !h-3.5 !w-3.5",
                                  dss === dssItem.assetId
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {dssItem.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>
                  State<span className="text-red-700">*</span>
                </Label>
                <Select
                  value={state}
                  onValueChange={(value) => {
                    setState(value);
                    setCity(""); // Reset city when state changes
                  }}
                >
                  <SelectTrigger className="w-full border-gray-100 text-gray-600">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingStates ? (
                      <SelectItem value="loading" disabled>
                        Loading states...
                      </SelectItem>
                    ) : isErrorStates ? (
                      <SelectItem value="error-states" disabled>
                        Error loading states
                      </SelectItem>
                    ) : states?.length === 0 ? (
                      <SelectItem value="no-states-found" disabled>
                        No states found
                      </SelectItem>
                    ) : (
                      states?.map((stateItem) => (
                        <SelectItem key={stateItem.id} value={stateItem.id}>
                          {stateItem.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>
                  City<span className="text-red-700">*</span>
                </Label>
                <Select
                  value={city}
                  onValueChange={setCity}
                  disabled={!state || isLoadingCities}
                >
                  <SelectTrigger className="w-full border-gray-100 text-gray-600">
                    <SelectValue
                      placeholder={
                        isLoadingCities
                          ? "Loading cities..."
                          : state
                            ? "Select City"
                            : "Select a state first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingCities ? (
                      <SelectItem value="loading" disabled>
                        Loading cities...
                      </SelectItem>
                    ) : isErrorCities ? (
                      <SelectItem value="error-cities" disabled>
                        Error loading cities
                      </SelectItem>
                    ) : cities?.length === 0 && state ? (
                      <SelectItem value="no-cities-found" disabled>
                        No cities found for this state
                      </SelectItem>
                    ) : (
                      cities?.map((cityItem) => (
                        <SelectItem key={cityItem.id} value={cityItem.id}>
                          {cityItem.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
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

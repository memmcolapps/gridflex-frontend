/* eslint-disable @typescript-eslint/no-unused-vars */
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { VirtualMeterData } from "@/types/meter";
import type { MeterInventoryItem } from "@/types/meter-inventory";
import type { Customer } from "@/types/customer-types";
import { useTariff } from "@/hooks/use-tarrif";
import { useMeters, useAssignMeter } from "@/hooks/use-assign-meter";
import UploadImageDialog from "./upload-image-dialog";
import { ConfirmationModalDialog } from "./confirmation-modal-dialog";
import { SetPaymentModeDialog } from "./set-payment-mode-dialog";
import { useState, useMemo } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";

type CustomerDisplay = {
  firstName?: string;
  firstname?: string;
  lastName?: string;
  lastname?: string;
  phone?: string;
  phoneNumber?: string;
};

interface AssignMeterDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | MeterInventoryItem | VirtualMeterData | null;
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
  category: string;
  setCategory: (value: string) => void;
  feederLine?: string;
  setFeederLine?: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  onProceed: () => void;
  isFormComplete: boolean;
  progress: number;
  onConfirmAssignment?: () => void;
}

export function AssignMeterDialog({
  isOpen,
  onOpenChange,
  customer,
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
  // category,
  // setCategory,
  phone,
  setPhone,
  onProceed,
  isFormComplete,
  // progress,
  onConfirmAssignment,
}: AssignMeterDialogProps) {
  const { tariffs, isLoading: tariffsLoading } = useTariff();

  // Fetch available meters for dropdown
  const { data: metersData, isLoading: metersLoading } = useMeters({
    page: 1,
    pageSize: 1000,
    searchTerm: "",
    sortBy: null,
    sortDirection: null,
    type: "allocated", // Filter for allocated meters only
  });

  // Mutation for assigning meter
  const assignMeterMutation = useAssignMeter();

  // Get available meters as array
  const availableMeters = useMemo(() => {
    if (!metersData) return [];
    return [...metersData.actualMeters, ...metersData.virtualMeters];
  }, [metersData]);

  // State for dialogs
  const [isUploadImageOpen, setIsUploadImageOpen] = useState(false);
  const [isConfirmImageOpen, setIsConfirmImageOpen] = useState(false);
  const [isSetPaymentModalOpen, setIsSetPaymentModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [debitMop, setDebitMop] = useState("");
  const [creditMop, setCreditMop] = useState("");
  const [debitPaymentPlan, setDebitPaymentPlan] = useState("");
  const [creditPaymentPlan, setCreditPaymentPlan] = useState("");
  const [progress, setProgress] = useState(50);
  const [open, setOpen] = useState(false);

  // Type guard to check if customer is MeterInventoryItem
  const isMeterInventoryItem = (customer: Customer | MeterInventoryItem | VirtualMeterData): customer is MeterInventoryItem => {
    return "meterManufacturer" in customer;
  };

  // Handle proceed from assign dialog
  const handleProceedFromAssign = () => {
    console.log('Proceeding from assign dialog, customer:', customer); // Debug log
    onOpenChange(false); // Close the assign dialog
    setIsUploadImageOpen(true);
  };

  // Handle proceed from upload image
  const handleProceedFromUploadImage = (image: File | null) => {
    console.log('Upload image proceed, image:', image); // Debug log
    setUploadedImage(image);
    setIsUploadImageOpen(false);
    setIsConfirmImageOpen(true);
    setProgress(70);
  };

  // Handle proceed from confirm image
  const handleProceedFromConfirmImage = () => {
    setIsConfirmImageOpen(false);

    // Get the selected meter's category from the available meters
    const selectedMeter = availableMeters.find(meter => meter.meterNumber === meterNumber);
    const meterCategory = selectedMeter?.category ?? (selectedMeter && 'meterCategory' in selectedMeter ? selectedMeter.meterCategory : null);

    console.log('Selected meter:', selectedMeter, 'Meter category:', meterCategory); // Debug log

    if (meterCategory && meterCategory.toLowerCase() === "prepaid") {
      setIsSetPaymentModalOpen(true);
      setProgress(80);
    } else if (meterCategory && meterCategory.toLowerCase() === "postpaid") {
      // For postpaid, skip set payment mode and go directly to deactivate
      setIsDeactivateModalOpen(true);
      setProgress(80);
    } else {
      console.log('No valid category found, defaulting to confirmation modal');
      setIsConfirmationModalOpen(true);
      setProgress(100);
    }
  };

  // Handle proceed from set payment
  const handleProceedFromSetPayment = () => {
    setIsSetPaymentModalOpen(false);
    // For prepaid customers, after setting payment mode, go to deactivate
    setIsDeactivateModalOpen(true);
    setProgress(90);
  };

  // Handle proceed from deactivate
  const handleProceedFromDeactivate = () => {
    setIsDeactivateModalOpen(false);
    setIsConfirmationModalOpen(true);
    setProgress(100);
  };

  // Handle confirm assignment
  const handleConfirmAssignment = async () => {
    setIsConfirmationModalOpen(false);

    // Get the selected meter for additional data
    const selectedMeter = availableMeters.find(meter => meter.meterNumber === meterNumber);

    // Prepare the payload with all collected data matching the AssignMeterPayload interface
    const assignmentPayload = {
      meterNumber,
      customerId: customer?.customerId ?? '',
      tariffId: tariff, // Assuming tariff is the ID
      dssAssetId: dss, // Assuming dss is the asset ID
      feederAssetId: feeder, // Assuming feeder is the asset ID
      cin,
      accountNumber,
      state,
      city,
      houseNo,
      streetName,
      creditPaymentMode: creditMop,
      debitPaymentMode: debitMop,
      creditPaymentPlan,
      debitPaymentPlan,
    };

    console.log('Assignment payload:', assignmentPayload);

    try {
      // Use the mutation to assign the meter
      await assignMeterMutation.mutateAsync(assignmentPayload);
      console.log('Meter assigned successfully');
      if (onConfirmAssignment) {
        onConfirmAssignment();
      }
    } catch (error) {
      console.error('Error assigning meter:', error);
      // Error handling is done by the mutation hook (toast notifications)
    }
  };

  // Handle cancel confirmation
  const handleCancelConfirmation = () => {
    setIsConfirmationModalOpen(false);
  };

  const isPaymentFormComplete = debitMop !== "" && creditMop !== "";

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-black h-fit border-none">
        {/* {customer?.category === "Prepaid" && <Progress value={progress} className="w-full" />} */}
        <DialogHeader>
          <DialogTitle>Assign meter to customer</DialogTitle>
          <p className="text-sm">Fill all compulsory fields</p>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Customer ID
                <span className="text-red-700">*</span>
              </Label>
              <Input
                value={customer?.customerId ?? ""}

                readOnly
                placeholder={customer && isMeterInventoryItem(customer) ? "Enter Meter ID" : "Enter Customer ID"}
                className="border-gray-200 text-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label>
                First Name<span className="text-red-700">*</span>
              </Label>
              <Input
                value={(customer as CustomerDisplay)?.firstName ?? (customer as CustomerDisplay)?.firstname ?? ""}
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
                value={(customer as CustomerDisplay)?.lastName ?? (customer as CustomerDisplay)?.lastname ?? ""}
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
                value={(customer as CustomerDisplay)?.phone ?? (customer as CustomerDisplay)?.phoneNumber ?? ""}
                readOnly
                placeholder="Enter Phone Number"
                className="border-gray-200 text-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label>
                Meter Number<span className="text-red-700">*</span>
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between border-gray-200 text-gray-600"
                    disabled={metersLoading}
                  >
                    {meterNumber
                      ? availableMeters.find((meter) => meter.meterNumber === meterNumber)?.meterNumber + " - " + (availableMeters.find((meter) => meter.meterNumber === meterNumber)?.category)
                      : metersLoading ? "Loading meters..." : "Select meter number..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" size={14}/>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 border-none">
                  <Command className="bg-white border-none">
                    <CommandInput placeholder="Search meter number..." className="border-none"/>
                    <CommandList>
                      <CommandEmpty>No meter found.</CommandEmpty>
                      <CommandGroup>
                        {availableMeters.map((meter) => (
                          <CommandItem
                            key={meter.id ?? meter.meterNumber}
                            value={meter.meterNumber}
                            onSelect={(currentValue) => {
                              setMeterNumber(currentValue === meterNumber ? "" : currentValue);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                meterNumber === meter.meterNumber ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {meter.meterNumber}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            {/* {customer && !isMeterData(customer) && ( */}

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


            {/* )} */}
            <div className="space-y-2">
              <Label>
                Account Number<span className="text-red-700">*</span>
              </Label>
              <Input
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                readOnly
                placeholder="Enter Account Number"
                className="border-gray-200 text-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label>
                Tariff<span className="text-red-700">*</span>
              </Label>
              <Select onValueChange={setTariff} value={tariff} disabled={tariffsLoading}>
                <SelectTrigger className="border-gray-200 text-gray-600 w-full">
                  <SelectValue placeholder="Select Tariff" />
                </SelectTrigger>
                <SelectContent>
                  {tariffs.filter(t => t.approve_status === 'Approved').map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>
                Feeder Line
                <span className="text-red-700">*</span>
              </Label>
              <Input
                value={feeder}
                onChange={(e) => setFeeder(e.target.value)}
                placeholder="Enter Feeder Line ID"
                className="border-gray-200 text-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label>
                Distribution Substation (DSS)<span className="text-red-700">*</span>
              </Label>
              <Input
                value={dss}
                onChange={(e) => setDss(e.target.value)}
                placeholder="Enter DSS ID"
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
                readOnly
                placeholder="Enter City"
                className="border-gray-100 text-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label>
                City<span className="text-red-700">*</span>
              </Label>
              <Input
                value={city}
                readOnly
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
                readOnly
                onChange={(e) => setStreetName(e.target.value)}
                placeholder="Enter Street Name"
                className="border-gray-100 text-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label>
                House No.<span className="text-red-700">*</span>
              </Label>
              <Input
                value={houseNo}
                readOnly
                onChange={(e) => setHouseNo(e.target.value)}
                placeholder="Enter House No"
                className="border-gray-100 text-gray-600"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#161CCA] text-[#161CCA] cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleProceedFromAssign}
            disabled={!isFormComplete}
            className={
              isFormComplete
                ? "bg-[#161CCA] text-white cursor-pointer"
                : "bg-[#161CCA] text-white cursor-not-allowed"
            }
          >
            Proceed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Upload Image Dialog */}
    <UploadImageDialog
      isOpen={isUploadImageOpen}
      onOpenChange={setIsUploadImageOpen}
      onProceed={handleProceedFromUploadImage}
      onCancel={() => setIsUploadImageOpen(false)}
    />

    {/* Confirm Image Dialog - using the same UploadImageDialog for now */}
    <UploadImageDialog
      isOpen={isConfirmImageOpen}
      onOpenChange={setIsConfirmImageOpen}
      onProceed={handleProceedFromConfirmImage}
      onCancel={() => setIsConfirmImageOpen(false)}
      onConfirmImage={handleProceedFromConfirmImage}
      title="Confirm Meter Image"
      description="Please review the uploaded meter image and confirm to proceed with the assignment."
    />

    {/* Set Payment Mode Dialog */}
    <SetPaymentModeDialog
      isOpen={isSetPaymentModalOpen}
      onOpenChange={setIsSetPaymentModalOpen}
      debitMop={debitMop}
      setDebitMop={setDebitMop}
      creditMop={creditMop}
      setCreditMop={setCreditMop}
      debitPaymentPlan={debitPaymentPlan}
      setDebitPaymentPlan={setDebitPaymentPlan}
      creditPaymentPlan={creditPaymentPlan}
      setCreditPaymentPlan={setCreditPaymentPlan}
      progress={progress}
      isPaymentFormComplete={isPaymentFormComplete}
      editCustomer={null}
      onProceed={handleProceedFromSetPayment}
    />

    {/* Deactivate Dialog - placeholder for now */}
    <Dialog open={isDeactivateModalOpen} onOpenChange={setIsDeactivateModalOpen}>
      <DialogContent className="bg-white text-black h-fit">
        <DialogHeader>
          <DialogTitle>Deactivate Meter</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Deactivate meter for customer</p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsDeactivateModalOpen(false)}
            className="border-[#161CCA] text-[#161CCA] cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleProceedFromDeactivate}
            className="bg-[#161CCA] text-white cursor-pointer"
          >
            Proceed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Confirmation Modal Dialog */}
    <ConfirmationModalDialog
      isOpen={isConfirmationModalOpen}
      onOpenChange={setIsConfirmationModalOpen}
      selectedCustomer={customer}
      onConfirm={handleConfirmAssignment}
      onCancel={handleCancelConfirmation}
      isSubmitting={false}
    />
    </>
  );
}
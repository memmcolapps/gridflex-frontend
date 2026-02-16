/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { VirtualMeterData } from "@/types/meter";
import type { MeterInventoryItem } from "@/types/meter-inventory";
import type { Customer } from "@/types/customer-types";
import type { AssignMeterPayload, MeterAPIItem } from "@/service/assign-meter-service";
import { useTariff } from "@/hooks/use-tarrif";
import {
  useMeters,
  useAssignMeter,
  useContinueAssignMeter,
} from "@/hooks/use-assign-meter";
import { useNigerianStates, useNigerianCities } from "@/hooks/use-location";
import { useFeeders, useDSS } from "@/hooks/use-node";
import UploadImageDialog from "./upload-image-dialog";
import { ConfirmationModalDialog } from "./confirmation-modal-dialog";
import { SetPaymentModeDialog } from "./set-payment-mode-dialog";
import { CinExistsDialog } from "./cin-exists-dialog";
import { useState, useMemo } from "react";
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
} from "../ui/command";

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

  const { data: metersData, isLoading: metersLoading } = useMeters({
    page: 1,
    pageSize: 1000,
    searchTerm: "",
    sortBy: null,
    sortDirection: null,
    type: "allocated",
  });

  const { data: assignedMetersData } = useMeters({
    page: 1,
    pageSize: 1000,
    searchTerm: "",
    sortBy: null,
    sortDirection: null,
    type: "assigned",
  });

  const assignMeterMutation = useAssignMeter();
  const continueAssignMeterMutation = useContinueAssignMeter();

  const availableMeters = useMemo(() => {
    if (!metersData) return [];

    const allMeters = [...metersData.actualMeters];

    if (assignedMetersData) {
      const assignedMeterNumbers = new Set([
        ...assignedMetersData.actualMeters.map((m) => m.meterNumber),
        ...assignedMetersData.virtualMeters.map((m) => m.meterNumber),
      ]);

      return allMeters.filter(
        (meter) => !assignedMeterNumbers.has(meter.meterNumber),
      );
    }

    return allMeters;
  }, [metersData, assignedMetersData]);

  const [isUploadImageOpen, setIsUploadImageOpen] = useState(false);
  const [isConfirmImageOpen, setIsConfirmImageOpen] = useState(false);
  const [isSetPaymentModalOpen, setIsSetPaymentModalOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [paymentMode, setPaymentMode] = useState("");
  const [paymentPlan, setPaymentPlan] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [progress, setProgress] = useState(50);
  const [open, setOpen] = useState(false);
  const [feederOpen, setFeederOpen] = useState(false);
  const [dssOpen, setDssOpen] = useState(false);
  const [isCinExistsDialogOpen, setIsCinExistsDialogOpen] = useState(false);
  const [existingMeterData, setExistingMeterData] =
    useState<MeterAPIItem | null>(null);
  const [pendingAssignmentPayload, setPendingAssignmentPayload] = useState<{
    meterNumber: string;
    customerId: string;
    tariffId: string;
    dssAssetId: string;
    feederAssetId: string;
    cin: string;
    accountNumber: string;
    state: string;
    city: string;
    houseNo: string;
    streetName: string;
    paymentType: string;
    paymentMode: string;
    paymentPlan: string;
    image?: File | null;
  } | null>(null);

  const isMeterInventoryItem = (
    customer: Customer | MeterInventoryItem | VirtualMeterData,
  ): customer is MeterInventoryItem => {
    return "meterManufacturer" in customer;
  };

  const handleProceedFromAssign = () => {
    onOpenChange(false);
    setIsUploadImageOpen(true);
  };

  const executeAssignMeter = async (forceAssign = false, isContinuation = false) => {
    // Create payload for the API call
    // Use image from pendingAssignmentPayload if available (for continue assignment)
    const imageToUse = isContinuation ? pendingAssignmentPayload?.image ?? null : uploadedImage;
    
    const payload: AssignMeterPayload = {
      meterNumber,
      customerId: customer?.customerId ?? "",
      tariffId: tariff,
      dssAssetId: dss,
      feederAssetId: feeder,
      cin,
      accountNumber,
      state: states?.find((s) => s.id === state)?.name ?? "",
      city: cities?.find((c) => c.id === city)?.name ?? "",
      houseNo,
      streetName,
      paymentType,
      paymentMode,
      paymentPlan,
      forceAssign,
      image: imageToUse,
    };
    
    // Always use FormData since the API requires multipart/form-data
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value instanceof File ? value : String(value));
      }
    });

    console.log("Assignment payload: FormData with image:", !!imageToUse);

    try {
      const response = isContinuation 
        ? await continueAssignMeterMutation.mutateAsync(formData)
        : await assignMeterMutation.mutateAsync(formData);
      console.log("Assignment response:", response);

      // Check if CIN already exists (response code 131)
      if (response.responsecode === "131" && response.responsedata?.meter) {
        setExistingMeterData(response.responsedata.meter);
        setPendingAssignmentPayload({
          meterNumber,
          customerId: customer?.customerId ?? "",
          tariffId: tariff,
          dssAssetId: dss,
          feederAssetId: feeder,
          cin,
          accountNumber,
          state: states?.find((s) => s.id === state)?.name ?? "",
          city: cities?.find((c) => c.id === city)?.name ?? "",
          houseNo,
          streetName,
          paymentType,
          paymentMode,
          paymentPlan,
          image: uploadedImage,
        });
        setIsCinExistsDialogOpen(true);
        return;
      }

      if (response.responsecode === "000") {
        console.log("Meter assigned successfully");
        if (onConfirmAssignment) {
          onConfirmAssignment();
        }
      }
    } catch (error) {
      console.error("Error assigning meter:", error);
    }
  };

  const handleProceedFromUploadImage = (image: File | null) => {
    setUploadedImage(image);
    setIsUploadImageOpen(false);

    const selectedMeter = availableMeters.find(
      (meter) => meter.meterNumber === meterNumber,
    );
    // Determine the meter category from available sources
    const meterCategory: string | null =
      selectedMeter?.category ??
      (selectedMeter && "meterCategory" in selectedMeter
        ? (selectedMeter.meterCategory as string | undefined) ?? null
        : null);

    console.log("Meter category detected:", meterCategory, "meterNumber:", meterNumber);

    // Only proceed if meterCategory is a valid string
    if (meterCategory && typeof meterCategory === "string" && meterCategory.toLowerCase() === "prepaid") {
      setIsSetPaymentModalOpen(true);
      setProgress(80);
    } else {
      // For postpaid or unknown, call API directly
      console.log("Calling executeAssignMeter directly (non-prepaid or unknown category)");
      setProgress(100);
      void executeAssignMeter();
    }
  };

  const handleProceedFromSetPayment = () => {
    setIsSetPaymentModalOpen(false);
    setProgress(100);
    void executeAssignMeter();
  };

  const handleProceedWithSever = async () => {
    if (!pendingAssignmentPayload) return;

    // Create FormData from pendingAssignmentPayload
    const formData = new FormData();
    Object.entries(pendingAssignmentPayload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value instanceof File ? value : String(value));
      }
    });

    try {
      const response = await continueAssignMeterMutation.mutateAsync(formData);

      if (response.responsecode === "000") {
        setIsCinExistsDialogOpen(false);
        setExistingMeterData(null);
        setPendingAssignmentPayload(null);
        if (onConfirmAssignment) {
          onConfirmAssignment();
        }
      }
    } catch (error) {
      console.error("Error severing and assigning meter:", error);
    }
  };

  const handleCancelCinExists = () => {
    setIsCinExistsDialogOpen(false);
    setExistingMeterData(null);
    setPendingAssignmentPayload(null);
  };

  const isPaymentFormComplete = paymentMode !== "" && paymentType !== "";

  // Debug: Log form completion state
  console.log("Form completion check:", {
    meterNumber,
    cin,
    accountNumber,
    tariff,
    feeder,
    dss,
    state,
    city,
    streetName,
    houseNo,
    customerPhone:
      (customer as CustomerDisplay)?.phone ??
      (customer as CustomerDisplay)?.phoneNumber,
    isFormComplete,
  });

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="h-fit border-none bg-white text-black">
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
                  placeholder={
                    customer && isMeterInventoryItem(customer)
                      ? "Enter Meter ID"
                      : "Enter Customer ID"
                  }
                  className="border-gray-200 text-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label>
                  First Name<span className="text-red-700">*</span>
                </Label>
                <Input
                  value={
                    (customer as CustomerDisplay)?.firstName ??
                    (customer as CustomerDisplay)?.firstname ??
                    ""
                  }
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
                  value={
                    (customer as CustomerDisplay)?.lastName ??
                    (customer as CustomerDisplay)?.lastname ??
                    ""
                  }
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
                  value={
                    (customer as CustomerDisplay)?.phone ??
                    (customer as CustomerDisplay)?.phoneNumber ??
                    ""
                  }
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
                      {meterNumber ||
                        (metersLoading
                          ? "Loading meters..."
                          : "Select meter number...")}
                      <ChevronsUpDown
                        className="ml-2 h-4 w-4 shrink-0 opacity-50"
                        size={14}
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full border-none p-0">
                    <Command className="border-none bg-white">
                      <CommandInput
                        placeholder="Search meter number..."
                        className="border-none"
                      />
                      <CommandList>
                        <CommandEmpty>No meter found.</CommandEmpty>
                        <CommandGroup>
                          {availableMeters.map((meter) => (
                            <CommandItem
                              key={meter.id ?? meter.meterNumber}
                              value={meter.meterNumber}
                              onSelect={(currentValue) => {
                                setMeterNumber(
                                  currentValue === meterNumber
                                    ? ""
                                    : currentValue,
                                );
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 !h-3.5 !w-3.5",
                                  meterNumber === meter.meterNumber
                                    ? "opacity-100"
                                    : "opacity-0",
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
                  value={(customer as Customer)?.accountNumber ?? accountNumber}
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
                <Select onValueChange={setTariff} value={tariff}>
                  <SelectTrigger className="w-full border-gray-200 text-gray-600">
                    <SelectValue placeholder="Select Tariff" />
                  </SelectTrigger>
                  <SelectContent>
                    {tariffs
                      .filter((t) => t.approve_status === "Approved")
                      .map((t) => (
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
                  House No.<span className="text-red-700">*</span>
                </Label>
                <Input
                  value={houseNo}
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
              className="cursor-pointer border-[#161CCA] text-[#161CCA]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleProceedFromAssign}
              disabled={!isFormComplete}
              className={
                isFormComplete
                  ? "cursor-pointer bg-[#161CCA] text-white"
                  : "cursor-not-allowed bg-blue-200 text-white"
              }
            >
              Proceed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <UploadImageDialog
        isOpen={isUploadImageOpen}
        onOpenChange={setIsUploadImageOpen}
        onProceed={handleProceedFromUploadImage}
        onCancel={() => setIsUploadImageOpen(false)}
      />

      <SetPaymentModeDialog
        isOpen={isSetPaymentModalOpen}
        onOpenChange={setIsSetPaymentModalOpen}
        paymentType={paymentType}
        setPaymentType={setPaymentType}
        paymentMode={paymentMode}
        setPaymentMode={setPaymentMode}
        paymentPlan={paymentPlan}
        setPaymentPlan={setPaymentPlan}
        isPaymentFormComplete={isPaymentFormComplete}
        editCustomer={null}
        onProceed={handleProceedFromSetPayment}
      />

      <CinExistsDialog
        isOpen={isCinExistsDialogOpen}
        onOpenChange={setIsCinExistsDialogOpen}
        existingMeter={existingMeterData}
        onProceed={handleProceedWithSever}
        onCancel={handleCancelCinExists}
        isSubmitting={continueAssignMeterMutation.isPending}
      />
    </>
  );
}

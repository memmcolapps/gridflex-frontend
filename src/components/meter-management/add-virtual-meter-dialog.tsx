import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox"; // Added Checkbox import
import type { FC } from "react";
import type { VirtualMeterData } from "@/types/meter";
import { useTariff } from "@/hooks/use-tarrif";
import { useNigerianStates, useNigerianCities } from "@/hooks/use-location";
import { useFeeders, useDSS } from "@/hooks/use-node";
import { useState } from "react";
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

interface AddVirtualMeterDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCustomer: VirtualMeterData | null;
  setSelectedCustomer: (customer: VirtualMeterData | null) => void;
  accountNumber: string;
  setAccountNumber: (value: string) => void;
  cin: string;
  setCin: (value: string) => void;
  feeder: string;
  setFeeder: (value: string) => void;
  dss: string;
  setDss: (value: string) => void;
  tariff: string;
  setTariff: (value: string) => void;
  state: string;
  setState: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  streetName: string;
  setStreetName: (value: string) => void;
  houseNo: string;
  setHouseNo: (value: string) => void;
  energyType: string;
  setEnergyType: (value: string) => void;
  custoType?: string;
  setCustomerType?: (value: string) => void;
  fixedEnergy: string;
  setFixedEnergy: (value: string) => void;
  onProceed: () => void;
  isFormComplete: boolean;
  nigerianStates: string[];
  customerTypes: string[];
}

const AddVirtualMeterDetailsDialog: FC<AddVirtualMeterDetailsDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedCustomer,
  setSelectedCustomer,
  accountNumber,
  setAccountNumber,
  cin,
  setCin,
  feeder,
  setFeeder,
  dss,
  setDss,
  // tariff,
  setTariff,
  state,
  setState,
  city,
  setCity,
  streetName,
  setStreetName,
  houseNo,
  setHouseNo,
  energyType,
  setEnergyType,
  fixedEnergy,
  // custoType,
  setCustomerType,
  setFixedEnergy,
  onProceed,
  isFormComplete,
  nigerianStates: _nigerianStates,
  customerTypes
}) => {
  const { tariffs, isLoading: tariffsLoading } = useTariff();
  const { data: states, isLoading: isLoadingStates, isError: isErrorStates } = useNigerianStates();
  const {
    data: cities,
    isLoading: isLoadingCities,
    isError: isErrorCities,
  } = useNigerianCities(state);

  const { data: feeders, isLoading: isLoadingFeeders } = useFeeders();
  const { data: dssOptions, isLoading: isLoadingDSS } = useDSS(feeder || null);

  const [feederOpen, setFeederOpen] = useState(false);
  const [dssOpen, setDssOpen] = useState(false);

  // Filter only approved tariffs
  const approvedTariffs = tariffs.filter(tariff => tariff.approve_status === 'Approved');

  // Determine if the Fixed checkbox is selected
  const isFixedChecked = energyType === "Fixed";

  // Update isFormComplete to include new fields
  const updatedIsFormComplete =
    isFormComplete &&
    (isFixedChecked ? fixedEnergy.trim() !== "" : true);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="h-fit overflow-y-auto bg-white w-fit border-none text-black">
        <DialogHeader>
          <DialogTitle>Add Virtual Meter</DialogTitle>
          <DialogDescription>Fill all compulsory fields</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Customer ID <span className="text-red-600">*</span>
              </Label>
              <Input
                value={selectedCustomer?.customerId ?? ""}
                readOnly
                className="border border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label>
                First Name <span className="text-red-600">*</span>
              </Label>
              <Input
                value={selectedCustomer?.firstName ?? ""}
                readOnly
                className="border border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label>
                Last Name <span className="text-red-600">*</span>
              </Label>
              <Input
                value={selectedCustomer?.lastName ?? ""}
                readOnly
                className="border border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label>
                Phone Number <span className="text-red-600">*</span>
              </Label>
              <Input
                value={selectedCustomer?.phone ?? ""}
                readOnly
                className="border border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label>
                Account Number <span className="text-red-500">*</span>
              </Label>
              <Input
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter account number"
                className="border border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label>
                CIN <span className="text-red-500">*</span>
              </Label>
              <Input
                value={cin}
                onChange={(e) => setCin(e.target.value)}
                placeholder="Enter CIN"
                className="border border-gray-300"
              />
            </div>
          </div>


          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Feeder Line <span className="text-red-500">*</span>
              </Label>
              <Popover open={feederOpen} onOpenChange={setFeederOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={feederOpen}
                    className="w-full justify-between border-gray-300"
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
                DSS <span className="text-red-500">*</span>
              </Label>
              <Popover open={dssOpen} onOpenChange={setDssOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={dssOpen}
                    className="w-full justify-between border-gray-300"
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
                Customer Type <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => {
                setCustomerType?.(value);
                // Pass meterClass as the selected customer type string
                // The meterClass will be passed to the backend API
                console.log('Selected meterClass:', value);
              }}>
                <SelectTrigger className="border border-gray-300 w-55">
                  <SelectValue placeholder="Select Customer Type" />
                </SelectTrigger>
                <SelectContent>
                  {customerTypes.map((custoType) => (
                    <SelectItem key={custoType} value={custoType}>
                      {custoType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>
                Tariff <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={setTariff} disabled={tariffsLoading}>
                <SelectTrigger className="border border-gray-300 w-55">
                  <SelectValue placeholder="Select tariff" />
                </SelectTrigger>
                <SelectContent>
                  {approvedTariffs.map((tariff) => (
                    <SelectItem key={tariff.id} value={tariff.id}>
                      {tariff.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>
                State <span className="text-red-500">*</span>
              </Label>
              <Select
                value={state}
                onValueChange={(value) => {
                  setState(value);
                  setCity(""); // Reset city when state changes
                }}
              >
                <SelectTrigger className="border border-gray-300 w-55">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingStates ? (
                    <SelectItem value="loading" disabled>Loading states...</SelectItem>
                  ) : isErrorStates ? (
                    <SelectItem value="error-states" disabled>Error loading states</SelectItem>
                  ) : states?.length === 0 ? (
                    <SelectItem value="no-states-found" disabled>No states found</SelectItem>
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
                City <span className="text-red-500">*</span>
              </Label>
              <Select
                value={city}
                onValueChange={setCity}
                disabled={!state || isLoadingCities}
              >
                <SelectTrigger className="border border-gray-300 w-55">
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
                    <SelectItem value="loading" disabled>Loading cities...</SelectItem>
                  ) : isErrorCities ? (
                    <SelectItem value="error-cities" disabled>Error loading cities</SelectItem>
                  ) : cities?.length === 0 && state ? (
                    <SelectItem value="no-cities-found" disabled>No cities found for this state</SelectItem>
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
                Street Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={streetName}
                onChange={(e) => setStreetName(e.target.value)}
                placeholder="Enter street name"
                className="border border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label>
                House No <span className="text-red-500">*</span>
              </Label>
              <Input
                value={houseNo}
                onChange={(e) => setHouseNo(e.target.value)}
                placeholder="Enter house number"
                className="border border-gray-300"
              />
            </div>
          </div>
          {/* Added Energy Type Checkbox and Fixed Energy Input */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Energy Type <span className="text-red-500">*</span>
              </Label>
              <div className="flex justify-between gap-2 border border-gray-300 rounded-md px-3 py-2">
                <Label htmlFor="fixed-energy-type" className="text-sm text-gray-700">
                  Fixed
                </Label>
                <Checkbox
                  id="fixed-energy-type"
                  checked={isFixedChecked}
                  onCheckedChange={(checked) => {
                    setEnergyType(checked ? "Fixed" : "");
                    if (!checked) setFixedEnergy(""); // Clear fixedEnergy if unchecked
                  }}
                  className="h-4 w-4 border-gray-500 data-[state=checked]:bg-green-500 data-[state=checked]:text-white rounded-full"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>
                Fixed Energy <span className="text-red-500">{isFixedChecked ? "*" : ""}</span>
              </Label>
              <Input
                value={fixedEnergy}
                onChange={(e) => setFixedEnergy(e.target.value)}
                placeholder="Enter fixed energy"
                className="border border-gray-300"
                disabled={!isFixedChecked}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={() => setSelectedCustomer(null)}
            className="border-[#161CCA] text-[#161CCA] cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={onProceed}
            disabled={!updatedIsFormComplete}
            className={
              updatedIsFormComplete
                ? "bg-[#161CCA] text-white cursor-pointer"
                : "bg-blue-300 text-white cursor-not-allowed"
            }
          >
            Proceed
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddVirtualMeterDetailsDialog;
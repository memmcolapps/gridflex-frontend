  "use client";
  // components/meter-management/EditVirtualMeterDialog.tsx
  import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
  import { Button } from "@/components/ui/button";
  import { useState, useEffect } from "react";

  interface VirtualMeterData {
    id: string;
    customerId: string;
    meterNumber: string;
    accountNumber: string;
    feeder: string;
    dss: string;
    cin: string;
    tariff: string;
    status: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    state?: string;
    city?: string;
    streetName?: string;
    houseNo?: string;
  }

  interface EditVirtualMeterDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedMeter: VirtualMeterData) => void;
    meter: VirtualMeterData | null;
  }

  export function EditVirtualMeterDialog({ isOpen, onClose, onSave, meter }: EditVirtualMeterDialogProps) {
    const [accountNumber, setAccountNumber] = useState("");
    const [cin, setCin] = useState("");
    const [tariff, setTariff] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [streetName, setStreetName] = useState("");
    const [houseNo, setHouseNo] = useState("");

    const nigerianStates = [
      "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa",
      "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo",
      "Ekiti", "Enugu", "FCT", "Gombe", "Imo", "Jigawa",
      "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
      "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
      "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
    ];

    const cities = [
      "Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano", "Enugu",
      "Abeokuta", "Onitsha", "Maiduguri", "Benin City", "Jos", "Ilorin",
    ];

    // Initialize form fields when meter changes
    useEffect(() => {
      if (meter) {
        setAccountNumber(meter.accountNumber ?? "");
        setCin(meter.cin ?? "");
        setTariff(meter.tariff ?? "");
        setPhoneNumber(meter.phone ?? "");
        setState(meter.state ?? "");
        setCity(meter.city ?? "");
        setStreetName(meter.streetName ?? "");
        setHouseNo(meter.houseNo ?? "");
      }
    }, [meter]);

    const isFormComplete = accountNumber && cin && tariff && phoneNumber && state && city && streetName && houseNo;

    const handleSave = () => {
      if (meter) {
        const updatedMeter: VirtualMeterData = {
          ...meter,
          accountNumber,
          cin,
          tariff,
          phone: phoneNumber,
          state,
          city,
          streetName,
          houseNo,
        };
        onSave(updatedMeter);
        onClose();
      }
    };

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="h-fit overflow-y-auto bg-white w-[800px]">
          <DialogHeader>
            <DialogTitle>Edit Virtual Meter</DialogTitle>
            <DialogDescription>Fill all compulsory fields</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Customer ID <span className="text-red-600">*</span></Label>
                <Input value={meter?.customerId ?? ""} readOnly className="border border-gray-300" />
              </div>
              <div className="space-y-2">
                <Label>First Name <span className="text-red-600">*</span></Label>
                <Input value={meter?.firstName ?? ""} readOnly className="border border-gray-300" />
              </div>
              <div className="space-y-2">
                <Label>Last Name <span className="text-red-600">*</span></Label>
                <Input value={meter?.lastName ?? ""} readOnly className="border border-gray-300" />
              </div>
              <div className="space-y-2">
                <Label>Phone Number <span className="text-red-500">*</span></Label>
                <Input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number"
                  className="border border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label>Account Number <span className="text-red-500">*</span></Label>
                <Input
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Enter account number"
                  className="border border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label>CIN <span className="text-red-500">*</span></Label>
                <Input
                  value={cin}
                  onChange={(e) => setCin(e.target.value)}
                  placeholder="Enter CIN"
                  className="border border-gray-300"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Tariff <span className="text-red-500">*</span></Label>
                <Select onValueChange={setTariff} value={tariff}>
                  <SelectTrigger className="border border-gray-300 w-full">
                    <SelectValue placeholder="Select tariff" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tariff A1">Tariff A1</SelectItem>
                    <SelectItem value="Tariff A2">Tariff A2</SelectItem>
                    <SelectItem value="Tariff B1">Tariff B1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>State <span className="text-red-500">*</span></Label>
                <Select onValueChange={setState} value={state}>
                  <SelectTrigger className="border border-gray-300 w-full">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {nigerianStates.map((state) => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>City <span className="text-red-500">*</span></Label>
                <Select onValueChange={setCity} value={city}>
                  <SelectTrigger className="border border-gray-300 w-full">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Street Name <span className="text-red-500">*</span></Label>
                <Input
                  value={streetName}
                  onChange={(e) => setStreetName(e.target.value)}
                  placeholder="Enter street name"
                  className="border border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label>House No <span className="text-red-500">*</span></Label>
                <Input
                  value={houseNo}
                  onChange={(e) => setHouseNo(e.target.value)}
                  placeholder="Enter house number"
                  className="border border-gray-300"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-[#161CCA] text-[#161CCA] cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isFormComplete}
              className={isFormComplete ? "bg-[#161CCA] text-white cursor-pointer" : "bg-blue-300 text-white cursor-not-allowed"}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export interface MeterData {
  id: string;
  meterNumber: string;
  simNumber: string;
  class: string;
  category?: string;
  meterType: string;
  oldTariffIndex: string;
  newTariffIndex: string;
  meterManufacturer: string;
  accountNumber: string;
  oldsgc: string;
  oldkrn: string;
  newkrn: string;
  newsgc: string;
  tariff: string;
  approvalStatus: string;
  status: string;
}

interface AddMeterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveMeter: (meter: MeterData) => void;
  editMeter?: MeterData;
}

export function AddMeterDialog({ isOpen, onClose, onSaveMeter, editMeter }: AddMeterDialogProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    meterNumber: "",
    simNumber: "",
    accountNumber: "", // Added to match MeterData
    substation: "",
    feederLine: "",
    transformer: "",
    meterCategory: "",
    meterClass: "",
    meterType: "",
    meterManufacturer: "",
    creditType: "",
    state: "",
    oldsgc: "",
    newsgc: "",
    oldkrn: "",
    newkrn: "",
    oldtariffindex: "",
    newtariffindex: "",
    ctRatioNumerator: 0,
    ctRatioDenominator: 0,
    voltageRatioNumerator: 0,
    voltageRatioDenominator: 0,
    multiplier: 0,
    meterRating: 0,
    initReading: 0,
    dial: 0,
    longitude: 0,
    latitude: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-populate form data if in edit mode
  useEffect(() => {
    console.log("editMeter received:", editMeter); // Debug: Log editMeter
    if (editMeter && isOpen) {
      setFormData({
        meterNumber: editMeter.meterNumber ?? "",
        simNumber: editMeter.simNumber ?? "",
        accountNumber: editMeter.accountNumber ?? "", // Added
        substation: "",
        feederLine: "",
        transformer: "",
        meterCategory: editMeter.category ?? "",
        meterClass: editMeter.class ?? "",
        meterType: editMeter.meterType ?? "",
        meterManufacturer: editMeter.meterManufacturer ?? "",
        creditType: editMeter.tariff ?? "",
        state: "",
        oldsgc: editMeter.oldsgc ?? "",
        newsgc: editMeter.newsgc ?? "",
        oldkrn: editMeter.oldkrn ?? "",
        newkrn: editMeter.newkrn ?? "",
        oldtariffindex: editMeter.oldTariffIndex ?? "",
        newtariffindex: editMeter.newTariffIndex ?? "",
        ctRatioNumerator: 0,
        ctRatioDenominator: 0,
        voltageRatioNumerator: 0,
        voltageRatioDenominator: 0,
        multiplier: 0,
        meterRating: 0,
        initReading: 0,
        dial: 0,
        longitude: 0,
        latitude: 0,
      });
      setStep(1);
      setErrors({});
      console.log("formData set for edit:", formData); // Debug: Log formData
    } else if (isOpen) {
      setFormData({
        meterNumber: "",
        simNumber: "",
        accountNumber: "",
        substation: "",
        feederLine: "",
        transformer: "",
        meterCategory: "",
        meterClass: "",
        meterType: "",
        meterManufacturer: "",
        creditType: "",
        state: "",
        oldsgc: "",
        newsgc: "",
        oldkrn: "",
        newkrn: "",
        oldtariffindex: "",
        newtariffindex: "",
        ctRatioNumerator: 0,
        ctRatioDenominator: 0,
        voltageRatioNumerator: 0,
        voltageRatioDenominator: 0,
        multiplier: 0,
        meterRating: 0,
        initReading: 0,
        dial: 0,
        longitude: 0,
        latitude: 0,
      });
      setStep(1);
      setErrors({});
      console.log("formData reset for add:", formData); // Debug: Log formData
    }
  }, [editMeter, isOpen,formData]);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.meterNumber) newErrors.meterNumber = "Meter Number is required";
    if (!formData.simNumber) newErrors.simNumber = "Sim Card is required";
    if (!formData.meterCategory) newErrors.meterCategory = "Meter Category is required";
    if (!formData.meterClass) newErrors.meterClass = "Meter Class is required";
    if (!formData.meterManufacturer) newErrors.meterManufacturer = "Meter Manufacturer is required";
    if (!formData.oldsgc) newErrors.oldsgc = "Old SGC is required";
    if (!formData.newsgc) newErrors.newsgc = "New SGC is required";
    // Relax validation for oldkrn and newkrn to handle MT-1004
    if (!formData.oldkrn && editMeter?.oldkrn !== "") newErrors.oldkrn = "Old KRN is required";
    if (!formData.newkrn && editMeter?.newkrn !== "") newErrors.newkrn = "New KRN is required";
    if (!formData.oldtariffindex) newErrors.oldtariffindex = "Old Tariff Index is required";
    if (!formData.newtariffindex) newErrors.newtariffindex = "New Tariff Index is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (formData.ctRatioNumerator <= 0) newErrors.ctRatioNumerator = "Must be greater than 0";
    if (formData.ctRatioDenominator <= 0) newErrors.ctRatioDenominator = "Must be greater than 0";
    if (formData.voltageRatioNumerator <= 0) newErrors.voltageRatioNumerator = "Must be greater than 0";
    if (formData.voltageRatioDenominator <= 0) newErrors.voltageRatioDenominator = "Must be greater than 0";
    if (formData.multiplier <= 0) newErrors.multiplier = "Must be greater than 0";
    if (formData.meterRating <= 0) newErrors.meterRating = "Must be greater than 0";
    if (formData.initReading < 0) newErrors.initReading = "Must be 0 or greater";
    if (formData.dial <= 0) newErrors.dial = "Must be greater than 0";
    if (formData.longitude === 0) newErrors.longitude = "Longitude is required";
    if (formData.latitude === 0) newErrors.latitude = "Latitude is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "meterNumber" ||
        name === "simNumber" ||
        name === "accountNumber" ||
        name === "meterManufacturer" ||
        name === "oldsgc" ||
        name === "newsgc" ||
        name === "oldkrn" ||
        name === "newkrn" ||
        name === "oldtariffindex" ||
        name === "newtariffindex"
          ? value
          : parseFloat(value) || 0,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleNext = () => {
    if (validateStep1()) {
      if (formData.meterClass === "MD") {
        setStep(2);
      } else {
        saveMeter();
      }
    }
  };

  const handleBack = () => {
    setStep(1);
    setErrors({});
  };

  const saveMeter = () => {
    if (step === 2 && !validateStep2()) return;

    const updatedMeter: MeterData = {
      id: editMeter ? editMeter.id : Math.random().toString(36).substring(2, 9),
      meterNumber: formData.meterNumber || "N/A",
      simNumber: formData.simNumber || "N/A",
      class: formData.meterClass || "N/A", // Fixed: Use meterClass
      category: formData.meterCategory || "N/A",
      meterType: formData.meterType || "N/A",
      oldTariffIndex: formData.oldtariffindex || "N/A",
      newTariffIndex: formData.newtariffindex || "N/A",
      meterManufacturer: formData.meterManufacturer || "N/A",
      accountNumber: formData.accountNumber || "N/A",
      oldsgc: formData.oldsgc || "N/A",
      newsgc: formData.newsgc || "N/A",
      oldkrn: formData.oldkrn || "N/A",
      newkrn: formData.newkrn || "N/A",
      tariff: formData.creditType || "N/A",
      approvalStatus: editMeter ? editMeter.approvalStatus : "Pending",
      status: editMeter ? editMeter.status : "In-Stock",
    };
    console.log("Saving meter:", updatedMeter); // Debug: Log saved meter
    onSaveMeter(updatedMeter);
    onClose();
    setStep(1);
    setFormData({
      meterNumber: "",
      simNumber: "",
      accountNumber: "",
      substation: "",
      feederLine: "",
      transformer: "",
      meterCategory: "",
      meterClass: "",
      meterType: "",
      meterManufacturer: "",
      creditType: "",
      state: "",
      oldsgc: "",
      newsgc: "",
      oldkrn: "",
      newkrn: "",
      oldtariffindex: "",
      newtariffindex: "",
      ctRatioNumerator: 0,
      ctRatioDenominator: 0,
      voltageRatioNumerator: 0,
      voltageRatioDenominator: 0,
      multiplier: 0,
      meterRating: 0,
      initReading: 0,
      dial: 0,
      longitude: 0,
      latitude: 0,
    });
    setErrors({});
  };

  const dialogTitle = editMeter ? "Edit Meter" : "Add new meter";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg h-fit bg-white p-6 rounded-lg">
        <DialogHeader className="flex flex-col">
          {(formData.meterClass === "MD" || (editMeter && formData.meterClass === "MD")) && (
            <div className="w-full h-2 bg-gray-200 rounded-full mb-4 mt-6">
              <div
                className={`h-full bg-[#161CCA] rounded-full transition-all duration-300 ${step === 1 ? "w-1/2" : "w-full"}`}
              ></div>
            </div>
          )}
          <DialogTitle className="text-lg font-semibold text-gray-900">{dialogTitle}</DialogTitle>
          <p className="text-gray-600 text-sm">Basic Information</p>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto px-1">
          {step === 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 py-4">
              <div className="space-y-1">
                <Label htmlFor="meterNumber" className="text-sm font-medium text-gray-700">
                  Meter Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  id="meterNumber"
                  name="meterNumber"
                  value={formData.meterNumber}
                  onChange={handleInputChange}
                  placeholder="E.g 0404040404040"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.meterNumber ? "border-red-500" : ""
                  } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                  required
                />
                {errors.meterNumber && <p className="text-xs text-red-500 mt-1">{errors.meterNumber}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="simNumber" className="text-sm font-medium text-gray-700">
                  Sim Card Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="simNumber"
                  name="simNumber"
                  value={formData.simNumber}
                  onChange={handleInputChange}
                  placeholder="E.g 8900080734059874"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.simNumber ? "border-red-500" : ""
                  } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                  required
                />
                {errors.simNumber && <p className="text-xs text-red-500 mt-1">{errors.simNumber}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="meterType" className="text-sm font-medium text-gray-700">
                  Meter Type <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleSelectChange("meterType", value)} value={formData.meterType}>
                  <SelectTrigger
                    id="meterType"
                    className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                      errors.meterType ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select Meter Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electricity">Electricity</SelectItem>
                    <SelectItem value="Water">Water</SelectItem>
                    <SelectItem value="Gas">Gas</SelectItem>
                  </SelectContent>
                </Select>
                {errors.meterType && <p className="text-xs text-red-500 mt-1">{errors.meterType}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="meterCategory" className="text-sm font-medium text-gray-700">
                  Meter Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => handleSelectChange("meterCategory", value)}
                  value={formData.meterCategory}
                >
                  <SelectTrigger
                    id="meterCategory"
                    className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                      errors.meterCategory ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Prepaid">Prepaid</SelectItem>
                    <SelectItem value="Postpaid">Postpaid</SelectItem>
                  </SelectContent>
                </Select>
                {errors.meterCategory && <p className="text-xs text-red-500 mt-1">{errors.meterCategory}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="meterClass" className="text-sm font-medium text-gray-700">
                  Meter Class <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => handleSelectChange("meterClass", value)}
                  value={formData.meterClass}
                >
                  <SelectTrigger
                    id="meterClass"
                    className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                      errors.meterClass ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MD">MD</SelectItem>
                    <SelectItem value="NMD">Single Phase</SelectItem>
                    <SelectItem value="TP">Three Phase</SelectItem>
                  </SelectContent>
                </Select>
                {errors.meterClass && <p className="text-xs text-red-500 mt-1">{errors.meterClass}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="meterManufacturer" className="text-sm font-medium text-gray-700">
                  Meter Manufacturer <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => handleSelectChange("meterManufacturer", value)}
                  value={formData.meterManufacturer}
                >
                  <SelectTrigger
                    id="meterManufacturer"
                    className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                      errors.meterManufacturer ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select Manufacturer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Momas">Momas</SelectItem>
                    <SelectItem value="Honglian">Honglian</SelectItem>
                    <SelectItem value="Mojec">Mojec</SelectItem>
                    <SelectItem value="Hexing">Hexing</SelectItem>
                  </SelectContent>
                </Select>
                {errors.meterManufacturer && <p className="text-xs text-red-500 mt-1">{errors.meterManufacturer}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="oldsgc" className="text-sm font-medium text-gray-700">
                  Old SGC <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  id="oldsgc"
                  name="oldsgc"
                  value={formData.oldsgc}
                  onChange={handleInputChange}
                  placeholder="Enter Old SGC"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.oldsgc ? "border-red-500" : ""
                  } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                  required
                />
                {errors.oldsgc && <p className="text-xs text-red-500 mt-1">{errors.oldsgc}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="newsgc" className="text-sm font-medium text-gray-700">
                  New SGC <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  id="newsgc"
                  name="newsgc"
                  value={formData.newsgc}
                  onChange={handleInputChange}
                  placeholder="Enter New SGC"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.newsgc ? "border-red-500" : ""
                  } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                  required
                />
                {errors.newsgc && <p className="text-xs text-red-500 mt-1">{errors.newsgc}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="oldkrn" className="text-sm font-medium text-gray-700">
                  Old KRN <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  id="oldkrn"
                  name="oldkrn"
                  value={formData.oldkrn}
                  onChange={handleInputChange}
                  placeholder="Enter Old KRN"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.oldkrn ? "border-red-500" : ""
                  } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                  required
                />
                {errors.oldkrn && <p className="text-xs text-red-500 mt-1">{errors.oldkrn}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="newkrn" className="text-sm font-medium text-gray-700">
                  New KRN <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  id="newkrn"
                  name="newkrn"
                  value={formData.newkrn}
                  onChange={handleInputChange}
                  placeholder="Enter New KRN"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.newkrn ? "border-red-500" : ""
                  } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                  required
                />
                {errors.newkrn && <p className="text-xs text-red-500 mt-1">{errors.newkrn}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="oldtariffindex" className="text-sm font-medium text-gray-700">
                  Old Tariff Index <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  id="oldtariffindex"
                  name="oldtariffindex"
                  value={formData.oldtariffindex}
                  onChange={handleInputChange}
                  placeholder="Enter Old Tariff Index"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.oldtariffindex ? "border-red-500" : ""
                  } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                  required
                />
                {errors.oldtariffindex && <p className="text-xs text-red-500 mt-1">{errors.oldtariffindex}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="newtariffindex" className="text-sm font-medium text-gray-700">
                  New Tariff Index <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  id="newtariffindex"
                  name="newtariffindex"
                  value={formData.newtariffindex}
                  onChange={handleInputChange}
                  placeholder="Enter New Tariff Index"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.newtariffindex ? "border-red-500" : ""
                  } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                  required
                />
                {errors.newtariffindex && <p className="text-xs text-red-500 mt-1">{errors.newtariffindex}</p>}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 py-4">
              <div className="space-y-1">
                <Label htmlFor="ctRatioNumerator" className="text-sm font-medium text-gray-700">
                  CT Ratio Numerator <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ctRatioNumerator"
                  name="ctRatioNumerator"
                  type="number"
                  value={formData.ctRatioNumerator}
                  onChange={handleInputChange}
                  placeholder="0"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.ctRatioNumerator ? "border-red-500" : ""
                  } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                  required
                />
                {errors.ctRatioNumerator && <p className="text-xs text-red-500 mt-1">{errors.ctRatioNumerator}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="ctRatioDenominator" className="text-sm font-medium text-gray-700">
                  CT Ratio Denominator <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ctRatioDenominator"
                  name="ctRatioDenominator"
                  type="number"
                  value={formData.ctRatioDenominator}
                  onChange={handleInputChange}
                  placeholder="0"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.ctRatioDenominator ? "border-red-500" : ""
                  } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                  required
                />
                {errors.ctRatioDenominator && <p className="text-xs text-red-500 mt-1">{errors.ctRatioDenominator}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="voltageRatioNumerator" className="text-sm font-medium text-gray-700">
                  Voltage Ratio Numerator <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="voltageRatioNumerator"
                  name="voltageRatioNumerator"
                  type="number"
                  value={formData.voltageRatioNumerator}
                  onChange={handleInputChange}
                  placeholder="0"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.voltageRatioNumerator ? "border-red-500" : ""
                  } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                  required
                />
                {errors.voltageRatioNumerator && (
                  <p className="text-xs text-red-500 mt-1">{errors.voltageRatioNumerator}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="voltageRatioDenominator" className="text-sm font-medium text-gray-700">
                  Voltage Ratio Denominator <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="voltageRatioDenominator"
                  name="voltageRatioDenominator"
                  type="number"
                  value={formData.voltageRatioDenominator}
                  onChange={handleInputChange}
                  placeholder="0"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.voltageRatioDenominator ? "border-red-500" : ""
                  } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                  required
                />
                {errors.voltageRatioDenominator && (
                  <p className="text-xs text-red-500 mt-1">{errors.voltageRatioDenominator}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="multiplier" className="text-sm font-medium text-gray-700">
                  Multiplier <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="multiplier"
                  name="multiplier"
                  type="number"
                  value={formData.multiplier}
                  onChange={handleInputChange}
                  placeholder="0"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.multiplier ? "border-red-500" : ""
                  } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                  required
                />
                {errors.multiplier && <p className="text-xs text-red-500 mt-1">{errors.multiplier}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="meterRating" className="text-sm font-medium text-gray-700">
                  Meter Rating <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="meterRating"
                  name="meterRating"
                  type="number"
                  value={formData.meterRating}
                  onChange={handleInputChange}
                  placeholder="0"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.meterRating ? "border-red-500" : ""
                  } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                  required
                />
                {errors.meterRating && <p className="text-xs text-red-500 mt-1">{errors.meterRating}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="initReading" className="text-sm font-medium text-gray-700">
                  Init Reading <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="initReading"
                  name="initReading"
                  type="number"
                  value={formData.initReading}
                  onChange={handleInputChange}
                  placeholder="0"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.initReading ? "border-red-500" : ""
                  } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                  required
                />
                {errors.initReading && <p className="text-xs text-red-500 mt-1">{errors.initReading}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="dial" className="text-sm font-medium text-gray-700">
                  Dial <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dial"
                  name="dial"
                  type="number"
                  value={formData.dial}
                  onChange={handleInputChange}
                  placeholder="0"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.dial ? "border-red-500" : ""
                  } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                  required
                />
                {errors.dial && <p className="text-xs text-red-500 mt-1">{errors.dial}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="longitude" className="text-sm font-medium text-gray-700">
                  Longitude <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="longitude"
                  name="longitude"
                  type="number"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  placeholder="0.0"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.longitude ? "border-red-500" : ""
                  } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                  required
                />
                {errors.longitude && <p className="text-xs text-red-500 mt-1">{errors.longitude}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="latitude" className="text-sm font-medium text-gray-700">
                  Latitude <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="latitude"
                  name="latitude"
                  type="number"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  placeholder="0.0"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.latitude ? "border-red-500" : ""
                  } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                  required
                />
                {errors.latitude && <p className="text-xs text-red-500 mt-1">{errors.latitude}</p>}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="pt-4 mt-4 flex justify-end gap-3">
          {step === 1 ? (
            <>
              <Button
                variant="outline"
                onClick={onClose}
                size="lg"
                className="text-sm font-medium text-[#161CCA] border-[#161CCA] hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleNext}
                size="lg"
                disabled={
                  !formData.meterNumber ||
                  !formData.simNumber ||
                  !formData.meterCategory ||
                  !formData.meterClass ||
                  !formData.meterManufacturer ||
                  !formData.oldsgc ||
                  !formData.newsgc ||
                  (!formData.oldkrn && editMeter?.oldkrn !== "") ||
                  (!formData.newkrn && editMeter?.newkrn !== "") ||
                  !formData.oldtariffindex ||
                  !formData.newtariffindex
                }
                className={`text-sm font-medium text-white hover:bg-blue-700 ${
                  !formData.meterNumber ||
                  !formData.simNumber ||
                  !formData.meterCategory ||
                  !formData.meterClass ||
                  !formData.meterManufacturer ||
                  !formData.oldsgc ||
                  !formData.newsgc ||
                  (!formData.oldkrn && editMeter?.oldkrn !== "") ||
                  (!formData.newkrn && editMeter?.newkrn !== "") ||
                  !formData.oldtariffindex ||
                  !formData.newtariffindex
                    ? "bg-blue-400"
                    : "bg-[#161CCA] cursor-pointer"
                }`}
              >
                {formData.meterClass === "MD" ? "Next" : editMeter ? "Save" : "Add"}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleBack}
                className="text-sm font-medium text-blue-700 border-blue-700 hover:bg-gray-50"
              >
                Back
              </Button>
              <Button
                onClick={saveMeter}
                disabled={
                  !formData.ctRatioNumerator ||
                  !formData.ctRatioDenominator ||
                  !formData.voltageRatioNumerator ||
                  !formData.voltageRatioDenominator ||
                  !formData.multiplier ||
                  !formData.meterRating ||
                  formData.initReading < 0 ||
                  !formData.dial ||
                  !formData.longitude ||
                  !formData.latitude
                }
                className={`text-sm font-medium text-white hover:bg-blue-700 ${
                  !formData.ctRatioNumerator ||
                  !formData.ctRatioDenominator ||
                  !formData.voltageRatioNumerator ||
                  !formData.voltageRatioDenominator ||
                  !formData.multiplier ||
                  !formData.meterRating ||
                  formData.initReading < 0 ||
                  !formData.dial ||
                  !formData.longitude ||
                  !formData.latitude
                    ? "bg-blue-400"
                    : "bg-[#161CCA] cursor-pointer"
                }`}
              >
                {editMeter ? "Save Changes" : "Add Meter"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
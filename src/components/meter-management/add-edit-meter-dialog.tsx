"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { MeterData } from "@/types/meter";


//  customerId, accountNumber, tariff, assignedStatus, status(2322)
// export interface MeterData {
//   customerId: any;
//   accountNumber: string;
//   tariff: string;
//   assignedStatus: string;
//   status: string;
//   id: string;
//   meterNumber: string;
//   manufactureName: string;
//   class: string;
//   meterType: string;
//   category: string;
//   dateAdded: string;
//   oldSgc: string;
//   newSgc: string;
//   oldKrn: string;
//   newKrn: string;
//   oldTariffIndex: string;
//   newTariffIndex: string;
//   simNo: string;
//   smartMeter: string;
//   ctRatioNumerator: string;
//   ctRatioDenominator: string;
//   voltageRatioNumerator: string;
//   voltageRatioDenominator: string;
//   multiplier: string;
//   meterRating: string;
//   initialReading: string;
//   dial: string;
//   longitude: string;
//   latitude: string;
//   meterModel: string,
//   protocol: string
//   authentication: string
//   password: string
// }

interface AddMeterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveMeter: (meter: MeterData) => void;
  editMeter?: MeterData | null;
}

export function AddMeterDialog({ isOpen, onClose, onSaveMeter, editMeter }: AddMeterDialogProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    meterNumber: "",
    simNo: "",
    meterCategory: "",
    meterClass: "",
    meterType: "",
    manufactureName: "",
    oldSgc: "",
    newSgc: "",
    oldKrn: "",
    newKrn: "",
    oldTariffIndex: "",
    newTariffIndex: "",
    smartMeter: false,
    meterModel: "",
    protocol: "",
    authentication: "",
    password: "",
    ctRatioNumerator: "",
    ctRatioDenominator: "",
    voltageRatioNumerator: "",
    voltageRatioDenominator: "",
    multiplier: "",
    meterRating: "",
    initialReading: "",
    dial: "",
    longitude: "",
    latitude: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    console.log("editMeter received:", editMeter);
    if (editMeter && isOpen) {
      setFormData({
        meterNumber: editMeter.meterNumber ?? "",
        simNo: editMeter.simNo ?? "",
        meterCategory: editMeter.category ?? "",
        meterClass: editMeter.class ?? "",
        meterType: editMeter.meterType ?? "",
        manufactureName: editMeter.manufactureName ?? "",
        oldSgc: editMeter.oldSgc ?? "",
        newSgc: editMeter.newSgc ?? "",
        oldKrn: editMeter.oldKrn ?? "",
        newKrn: editMeter.newKrn ?? "",
        oldTariffIndex: editMeter.oldTariffIndex ?? "",
        newTariffIndex: editMeter.newTariffIndex ?? "",
        smartMeter: editMeter.smartMeter === "Smart",
        meterModel: editMeter.meterModel ?? "",
        protocol: editMeter.protocol ?? "",
        authentication: editMeter.authentication ?? "",
        password: editMeter.password ?? "",
        ctRatioNumerator: editMeter.ctRatioNumerator ?? "",
        ctRatioDenominator: editMeter.ctRatioDenominator ?? "",
        voltageRatioNumerator: editMeter.voltageRatioNumerator ?? "",
        voltageRatioDenominator: editMeter.voltageRatioDenominator ?? "",
        multiplier: editMeter.multiplier ?? "",
        meterRating: editMeter.meterRating ?? "",
        initialReading: editMeter.initialReading ?? "",
        dial: editMeter.dial ?? "",
        longitude: editMeter.longitude ?? "",
        latitude: editMeter.latitude ?? "",
      });
      setStep(1);
      setErrors({});
    } else if (isOpen) {
      setFormData({
        meterNumber: "",
        simNo: "",
        meterCategory: "",
        meterClass: "",
        meterType: "",
        manufactureName: "",
        oldSgc: "",
        newSgc: "",
        oldKrn: "",
        newKrn: "",
        oldTariffIndex: "",
        newTariffIndex: "",
        smartMeter: false,
        meterModel: "",
        protocol: "",
        authentication: "",
        password: "",
        ctRatioNumerator: "",
        ctRatioDenominator: "",
        voltageRatioNumerator: "",
        voltageRatioDenominator: "",
        multiplier: "",
        meterRating: "",
        initialReading: "",
        dial: "",
        longitude: "",
        latitude: "",
      });
      setStep(1);
      setErrors({});
    }
  }, [editMeter, isOpen]);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.meterNumber) newErrors.meterNumber = "Meter Number is required";
    if (!formData.simNo) newErrors.simNo = "Sim Card is required";
    if (!formData.meterCategory) newErrors.meterCategory = "Meter Category is required";
    if (!formData.meterClass) newErrors.meterClass = "Meter Class is required";
    if (!formData.manufactureName) newErrors.manufactureName = "Meter Manufacturer is required";
    if (!formData.oldSgc) newErrors.oldSgc = "Old SGC is required";
    if (!formData.newSgc) newErrors.newSgc = "New SGC is required";
    if (!formData.oldKrn) newErrors.oldKrn = "Old KRN is required";
    if (!formData.newKrn) newErrors.newKrn = "New KRN is required";
    if (!formData.oldTariffIndex) newErrors.oldTariffIndex = "Old Tariff Index is required";
    if (!formData.newTariffIndex) newErrors.newTariffIndex = "New Tariff Index is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (formData.meterClass === "MD") {
      if (!formData.ctRatioNumerator) newErrors.ctRatioNumerator = "CT Ratio Numerator is required";
      if (!formData.ctRatioDenominator) newErrors.ctRatioDenominator = "CT Ratio Denominator is required";
      if (!formData.voltageRatioNumerator) newErrors.voltageRatioNumerator = "Voltage Ratio Numerator is required";
      if (!formData.voltageRatioDenominator) newErrors.voltageRatioDenominator = "Voltage Ratio Denominator is required";
      if (!formData.multiplier) newErrors.multiplier = "Multiplier is required";
      if (!formData.meterRating) newErrors.meterRating = "Meter Rating is required";
      if (!formData.initialReading) newErrors.initialReading = "Initial Reading is required";
      if (!formData.dial) newErrors.dial = "Dial is required";
      if (!formData.longitude) newErrors.longitude = "Longitude is required";
      if (!formData.latitude) newErrors.latitude = "Latitude is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (formData.smartMeter) {
      if (!formData.meterModel) newErrors.meterModel = "Meter Model is required";
      if (!formData.protocol) newErrors.protocol = "Protocol is required";
      if (!formData.authentication) newErrors.authentication = "Authentication is required";
      if (!formData.password) newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      smartMeter: checked,
    }));
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
      } else if (formData.smartMeter) {
        setStep(3);
      } else {
        saveMeter();
      }
    }
  };

  const handleNextFromStep2 = () => {
    if (validateStep2()) {
      if (formData.smartMeter) {
        setStep(3);
      } else {
        saveMeter();
      }
    }
  };

  const handleBack = () => {
    if (step === 3) {
      if (formData.meterClass === "MD") {
        setStep(2);
      } else {
        setStep(1);
      }
    } else if (step === 2) {
      setStep(1);
    }
    setErrors({});
  };

  const saveMeter = () => {
    if (step === 2 && formData.meterClass === "MD" && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;

    const updatedMeter: MeterData = {
      id: editMeter ? String(editMeter.id) : uuidv4(), // Use UUID
      meterNumber: formData.meterNumber || "N/A",
      customerId: editMeter ? editMeter.customerId : "N/A",
      accountNumber: editMeter ? editMeter.accountNumber : "N/A",
      tariff: editMeter ? editMeter.tariff : "N/A",
      assignedStatus: editMeter ? editMeter.assignedStatus : "N/A",
      status: editMeter ? editMeter.status : "N/A",
      manufactureName: formData.manufactureName || "N/A",
      class: formData.meterClass || "N/A",
      meterType: formData.meterType || "N/A",
      category: formData.meterCategory || "N/A",
      dateAdded: new Date().toLocaleDateString("en-GB").split("/").join("-"),
      oldSgc: formData.oldSgc || "N/A",
      newSgc: formData.newSgc || "N/A",
      oldKrn: formData.oldKrn || "N/A",
      newKrn: formData.newKrn || "N/A",
      oldTariffIndex: formData.oldTariffIndex || "N/A",
      newTariffIndex: formData.newTariffIndex || "N/A",
      simNo: formData.simNo || "N/A",
      smartMeter: formData.smartMeter ? "Smart" : "Non-Smart",
      ctRatioNumerator: formData.ctRatioNumerator || "N/A",
      ctRatioDenominator: formData.ctRatioDenominator || "N/A",
      voltageRatioNumerator: formData.voltageRatioNumerator || "N/A",
      voltageRatioDenominator: formData.voltageRatioDenominator || "N/A",
      multiplier: formData.multiplier || "N/A",
      meterRating: formData.meterRating || "N/A",
      initialReading: formData.initialReading || "N/A",
      dial: formData.dial || "N/A",
      longitude: formData.longitude || "N/A",
      latitude: formData.latitude || "N/A",
      meterModel: formData.meterModel || "N/A",
      protocol: formData.protocol || "N/A",
      authentication: formData.authentication || "N/A",
      password: formData.password || "N/A"
    };
    console.log("Saving meter:", updatedMeter);
    onSaveMeter(updatedMeter);
    onClose();
    setStep(1);
    setFormData({
      meterNumber: "",
      simNo: "",
      meterCategory: "",
      meterClass: "",
      meterType: "",
      manufactureName: "",
      oldSgc: "",
      newSgc: "",
      oldKrn: "",
      newKrn: "",
      oldTariffIndex: "",
      newTariffIndex: "",
      smartMeter: false,
      meterModel: "",
      protocol: "",
      authentication: "",
      password: "",
      ctRatioNumerator: "",
      ctRatioDenominator: "",
      voltageRatioNumerator: "",
      voltageRatioDenominator: "",
      multiplier: "",
      meterRating: "",
      initialReading: "",
      dial: "",
      longitude: "",
      latitude: "",
    });
    setErrors({});
  };

  const dialogTitle = editMeter ? "Edit Meter" : "Add new meter";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg h-fit bg-white p-6 rounded-lg">
        <DialogHeader className="flex flex-col">
          {(formData.meterClass === "MD" || formData.smartMeter || (editMeter && formData.meterClass === "MD")) && (
            <div className="w-full h-2 bg-gray-200 rounded-full mb-4 mt-6">
              <div
                className={`h-full bg-[#161CCA] rounded-full transition-all duration-300 ${step === 1 ? "w-1/3" : step === 2 ? "w-2/3" : "w-full"
                  }`}
              ></div>
            </div>
          )}
          <DialogTitle className="text-lg font-semibold text-gray-900">{dialogTitle}</DialogTitle>
          <p className="text-gray-600 text-sm">
            {step === 1 ? "Basic Information" : step === 2 ? "Basic Parameter" : "Smart Parameter"}
          </p>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto px-1">
          {step === 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 py-4">
              <div className="space-y-1">
                <Label htmlFor="meterNumber" className="text-sm font-medium text-gray-700">
                  Meter Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="meterNumber"
                  name="meterNumber"
                  value={formData.meterNumber}
                  onChange={handleInputChange}
                  placeholder="E.g 0404040404040"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.meterNumber ? "border-red-500" : ""
                    }`}
                  required
                />
                {errors.meterNumber && <p className="text-xs text-red-500 mt-1">{errors.meterNumber}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="simNo" className="text-sm font-medium text-gray-700">
                  Sim Card Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="simNo"
                  name="simNo"
                  value={formData.simNo}
                  onChange={handleInputChange}
                  placeholder="E.g 8900080734059874"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.simNo ? "border-red-500" : ""
                    }`}
                  required
                />
                {errors.simNo && <p className="text-xs text-red-500 mt-1">{errors.simNo}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="meterType" className="text-sm font-medium text-gray-700">
                  Meter Type <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleSelectChange("meterType", value)} value={formData.meterType}>
                  <SelectTrigger
                    id="meterType"
                    className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.meterType ? "border-red-500" : ""
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
                    className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.meterCategory ? "border-red-500" : ""
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
                    className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.meterClass ? "border-red-500" : ""
                      }`}
                  >
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MD">MD</SelectItem>
                    <SelectItem value="Single Phase">Single Phase</SelectItem>
                    <SelectItem value="Three Phase">Three Phase</SelectItem>
                  </SelectContent>
                </Select>
                {errors.meterClass && <p className="text-xs text-red-500 mt-1">{errors.meterClass}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="manufactureName" className="text-sm font-medium text-gray-700">
                  Meter Manufacturer <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => handleSelectChange("manufactureName", value)}
                  value={formData.manufactureName}
                >
                  <SelectTrigger
                    id="manufactureName"
                    className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.manufactureName ? "border-red-500" : ""
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
                {errors.manufactureName && <p className="text-xs text-red-500 mt-1">{errors.manufactureName}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="oldSgc" className="text-sm font-medium text-gray-700">
                  Old SGC <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="oldSgc"
                  name="oldSgc"
                  value={formData.oldSgc}
                  onChange={handleInputChange}
                  placeholder="Enter Old SGC"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.oldSgc ? "border-red-500" : ""
                    }`}
                  required
                />
                {errors.oldSgc && <p className="text-xs text-red-500 mt-1">{errors.oldSgc}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="newSgc" className="text-sm font-medium text-gray-700">
                  New SGC <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="newSgc"
                  name="newSgc"
                  value={formData.newSgc}
                  onChange={handleInputChange}
                  placeholder="Enter New SGC"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.newSgc ? "border-red-500" : ""
                    }`}
                  required
                />
                {errors.newSgc && <p className="text-xs text-red-500 mt-1">{errors.newSgc}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="oldKrn" className="text-sm font-medium text-gray-700">
                  Old KRN <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="oldKrn"
                  name="oldKrn"
                  value={formData.oldKrn}
                  onChange={handleInputChange}
                  placeholder="Enter Old KRN"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.oldKrn ? "border-red-500" : ""
                    }`}
                  required
                />
                {errors.oldKrn && <p className="text-xs text-red-500 mt-1">{errors.oldKrn}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="newKrn" className="text-sm font-medium text-gray-700">
                  New KRN <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="newKrn"
                  name="newKrn"
                  value={formData.newKrn}
                  onChange={handleInputChange}
                  placeholder="Enter New KRN"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.newKrn ? "border-red-500" : ""
                    }`}
                  required
                />
                {errors.newKrn && <p className="text-xs text-red-500 mt-1">{errors.newKrn}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="oldTariffIndex" className="text-sm font-medium text-gray-700">
                  Old Tariff Index <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="oldTariffIndex"
                  name="oldTariffIndex"
                  value={formData.oldTariffIndex}
                  onChange={handleInputChange}
                  placeholder="Enter Old Tariff Index"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.oldTariffIndex ? "border-red-500" : ""
                    }`}
                  required
                />
                {errors.oldTariffIndex && <p className="text-xs text-red-500 mt-1">{errors.oldTariffIndex}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="newTariffIndex" className="text-sm font-medium text-gray-700">
                  New Tariff Index <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="newTariffIndex"
                  name="newTariffIndex"
                  value={formData.newTariffIndex}
                  onChange={handleInputChange}
                  placeholder="Enter New Tariff Index"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.newTariffIndex ? "border-red-500" : ""
                    }`}
                  required
                />
                {errors.newTariffIndex && <p className="text-xs text-red-500 mt-1">{errors.newTariffIndex}</p>}
              </div>
              <div className="space-y-1 col-span-2">
                <Label htmlFor="smartMeter" className="text-sm font-medium text-gray-700">
                  Smart Meter
                </Label>
                <div className="flex items-center justify-between w-full border border-gray-300 rounded-md px-3 py-2">
                  <span className="text-sm text-gray-700">Smart</span>
                  <Checkbox
                    id="smartMeter"
                    checked={formData.smartMeter}
                    onCheckedChange={handleCheckboxChange}
                    className="border-gray-500 rounded-md data-[state=checked]:bg-green-500 data-[state=checked]:text-white focus:ring-green-500 focus:ring-offset-0 focus:ring-1"
                  />
                </div>
              </div>
            </div>
          ) : step === 2 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 py-4">
              <div className="space-y-1">
                <Label htmlFor="ctRatioNumerator" className="text-sm font-medium text-gray-700">
                  CT Ratio Numerator <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ctRatioNumerator"
                  name="ctRatioNumerator"
                  type="text"
                  value={formData.ctRatioNumerator}
                  onChange={handleInputChange}
                  placeholder="E.g., 100"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.ctRatioNumerator ? "border-red-500" : ""
                    }`}
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
                  type="text"
                  value={formData.ctRatioDenominator}
                  onChange={handleInputChange}
                  placeholder="E.g., 5"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.ctRatioDenominator ? "border-red-500" : ""
                    }`}
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
                  type="text"
                  value={formData.voltageRatioNumerator}
                  onChange={handleInputChange}
                  placeholder="E.g., 11000"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.voltageRatioNumerator ? "border-red-500" : ""
                    }`}
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
                  type="text"
                  value={formData.voltageRatioDenominator}
                  onChange={handleInputChange}
                  placeholder="E.g., 110"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.voltageRatioDenominator ? "border-red-500" : ""
                    }`}
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
                  type="text"
                  value={formData.multiplier}
                  onChange={handleInputChange}
                  placeholder="E.g., 1"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.multiplier ? "border-red-500" : ""
                    }`}
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
                  type="text"
                  value={formData.meterRating}
                  onChange={handleInputChange}
                  placeholder="E.g., 100A"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.meterRating ? "border-red-500" : ""
                    }`}
                  required
                />
                {errors.meterRating && <p className="text-xs text-red-500 mt-1">{errors.meterRating}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="initialReading" className="text-sm font-medium text-gray-700">
                  Initial Reading <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="initialReading"
                  name="initialReading"
                  type="text"
                  value={formData.initialReading}
                  onChange={handleInputChange}
                  placeholder="E.g., 0"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.initialReading ? "border-red-500" : ""
                    }`}
                  required
                />
                {errors.initialReading && <p className="text-xs text-red-500 mt-1">{errors.initialReading}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="dial" className="text-sm font-medium text-gray-700">
                  Dial <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dial"
                  name="dial"
                  type="text"
                  value={formData.dial}
                  onChange={handleInputChange}
                  placeholder="E.g., 5"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.dial ? "border-red-500" : ""
                    }`}
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
                  type="text"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  placeholder="E.g., 3.8964"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.longitude ? "border-red-500" : ""
                    }`}
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
                  type="text"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  placeholder="E.g., 7.3775"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.latitude ? "border-red-500" : ""
                    }`}
                  required
                />
                {errors.latitude && <p className="text-xs text-red-500 mt-1">{errors.latitude}</p>}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 py-4">
              <div className="space-y-1">
                <Label htmlFor="meterModel" className="text-sm font-medium text-gray-700">
                  Meter Model <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="meterModel"
                  name="meterModel"
                  type="text"
                  value={formData.meterModel}
                  onChange={handleInputChange}
                  placeholder="E.g., SmartMeterX1"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.meterModel ? "border-red-500" : ""
                    }`}
                  required
                />
                {errors.meterModel && <p className="text-xs text-red-500 mt-1">{errors.meterModel}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="protocol" className="text-sm font-medium text-gray-700">
                  Protocol <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="protocol"
                  name="protocol"
                  type="text"
                  value={formData.protocol}
                  onChange={handleInputChange}
                  placeholder="E.g., DLMS/COSEM"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.protocol ? "border-red-500" : ""
                    }`}
                  required
                />
                {errors.protocol && <p className="text-xs text-red-500 mt-1">{errors.protocol}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="authentication" className="text-sm font-medium text-gray-700">
                  Authentication <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="authentication"
                  name="authentication"
                  type="text"
                  value={formData.authentication}
                  onChange={handleInputChange}
                  placeholder="E.g., Token-based"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.authentication ? "border-red-500" : ""
                    }`}
                  required
                />
                {errors.authentication && <p className="text-xs text-red-500 mt-1">{errors.authentication}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="text"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.password ? "border-red-500" : ""
                    }`}
                  required
                />
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
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
                onClick={
                  !editMeter && (formData.meterClass === "Single Phase" || formData.meterClass === "Three Phase") && !formData.smartMeter
                    ? saveMeter
                    : handleNext
                }
                size="lg"
                disabled={
                  !formData.meterNumber ||
                  !formData.simNo ||
                  !formData.meterCategory ||
                  !formData.meterClass ||
                  !formData.manufactureName ||
                  !formData.oldSgc ||
                  !formData.newSgc ||
                  !formData.oldKrn ||
                  !formData.newKrn ||
                  !formData.oldTariffIndex ||
                  !formData.newTariffIndex
                }
                className="text-sm font-medium bg-[#161CCA] text-white hover:bg-[#1e2abf]"
              >
                {/* {!editMeter && (formData.meterClass === "Single Phase" || formData.meterClass === "Three Phase") && !formData.smartMeter
                  ? "Add Meter"
                  : "Next"} */}
                {editMeter || formData.meterClass === "MD" || formData.smartMeter ? "Next" : "Add Meter"}
              </Button>
            </>
          ) : step === 2 ? (
            <>
              <Button
                variant="outline"
                onClick={handleBack}
                size="lg"
                className="text-sm font-medium text-[#161CCA] border-[#161CCA] hover:bg-gray-50"
              >
                Back
              </Button>
              <Button
                onClick={handleNextFromStep2}
                size="lg"
                disabled={
                  formData.meterClass === "MD" &&
                  (!formData.ctRatioNumerator ||
                    !formData.ctRatioDenominator ||
                    !formData.voltageRatioNumerator ||
                    !formData.voltageRatioDenominator ||
                    !formData.multiplier ||
                    !formData.meterRating ||
                    !formData.initialReading ||
                    !formData.dial ||
                    !formData.longitude ||
                    !formData.latitude)
                }
                className="text-sm font-medium bg-[#161CCA] text-white hover:bg-[#1e2abf] cursor-pointer"
              >
                {formData.smartMeter ? "Next" : "Save"}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleBack}
                size="lg"
                className="text-sm font-medium text-[#161CCA] border-[#161CCA] hover:bg-gray-50 cursor-pointer"
              >
                Back
              </Button>
              <Button
                onClick={saveMeter}
                size="lg"
                disabled={
                  formData.smartMeter &&
                  (!formData.meterModel || !formData.protocol || !formData.authentication || !formData.password)
                }
                className="text-sm font-medium bg-[#161CCA] text-white hover:bg-[#1e2abf] cursor-pointer"
              >
                Save
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function uuidv4(): string {
  throw new Error("Function not implemented.");
}

// components/billing/md-energy-import/add-readings-dialog.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface AddReadingsProps {
    onClose: () => void;
    data?: {
        assetId: string;
        month: string;
        year: string;
        technicalLoss: string;
        commercialLoss: string;
        feederConsumption: string;
    };
    onSave: (formData: {
        assetId: string;
        month: string;
        year: string;
        technicalLoss: string;
        commercialLoss: string;
        feederConsumption: string;
    }) => void;
}

export default function AddReadings({ onClose, data, onSave }: AddReadingsProps) {
    const [formData, setFormData] = useState({
        assetId: data?.assetId ?? "",
        month: data?.month ?? "",
        year: data?.year ?? "",
        technicalLoss: data?.technicalLoss ?? "",
        commercialLoss: data?.commercialLoss ?? "",
        feederConsumption: data?.feederConsumption ?? "",
    });

    useEffect(() => {
        if (data) {
            setFormData({
                assetId: data.assetId,
                month: data.month,
                year: data.year,
                technicalLoss: data.technicalLoss,
                commercialLoss: data.commercialLoss,
                feederConsumption: data.feederConsumption,
            });
        }
    }, [data]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSelectChange = (id: string, value: string) => {
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const isFormValid = () => {
        return (
            formData.assetId.trim() !== "" &&
            formData.month !== "" &&
            formData.year !== "" &&
            formData.technicalLoss.trim() !== "" &&
            formData.commercialLoss.trim() !== "" &&
            formData.feederConsumption.trim() !== ""
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormValid()) {
            onSave(formData);
            onClose();
        }
    };

    return (
        <div className="h-fit">
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <Label htmlFor="assetId" className="text-sm font-medium text-gray-700">
                        Asset ID *
                    </Label>
                    <Input
                        id="assetId"
                        placeholder="Enter asset ID"
                        className="mt-1 w-full border-gray-300 rounded-md"
                        value={formData.assetId}
                        onChange={handleInputChange}
                        disabled={!!data}
                    />
                </div>
                <div>
                    <Label htmlFor="month" className="text-sm font-medium text-gray-700">
                        Month *
                    </Label>
                    <Select
                        value={formData.month}
                        onValueChange={(value) => handleSelectChange("month", value)}
                    >
                        <SelectTrigger
                            id="month"
                            className="mt-1 w-full border-gray-300 rounded-md"
                        >
                            <SelectValue placeholder="Select billing month" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">January</SelectItem>
                            <SelectItem value="2">February</SelectItem>
                            <SelectItem value="3">March</SelectItem>
                            <SelectItem value="4">April</SelectItem>
                            <SelectItem value="5">May</SelectItem>
                            <SelectItem value="6">June</SelectItem>
                            <SelectItem value="7">July</SelectItem>
                            <SelectItem value="8">August</SelectItem>
                            <SelectItem value="9">September</SelectItem>
                            <SelectItem value="10">October</SelectItem>
                            <SelectItem value="11">November</SelectItem>
                            <SelectItem value="12">December</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="year" className="text-sm font-medium text-gray-700">
                        Year *
                    </Label>
                    <Select
                        value={formData.year}
                        onValueChange={(value) => handleSelectChange("year", value)}
                    >
                        <SelectTrigger
                            id="year"
                            className="mt-1 w-full border-gray-300 rounded-md"
                        >
                            <SelectValue placeholder="Select billing year" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => {
                                const year = new Date().getFullYear() - i;
                                return (
                                    <SelectItem key={year} value={year.toString()}>
                                        {year}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="technicalLoss" className="text-sm font-medium text-gray-700">
                        Technical Loss (%) *
                    </Label>
                    <Input
                        id="technicalLoss"
                        type="number"
                        placeholder="Enter technical loss"
                        className="mt-1 w-full border-gray-300 rounded-md"
                        value={formData.technicalLoss}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <Label htmlFor="commercialLoss" className="text-sm font-medium text-gray-700">
                        Commercial Loss (%) *
                    </Label>
                    <Input
                        id="commercialLoss"
                        type="number"
                        placeholder="Enter commercial loss"
                        className="mt-1 w-full border-gray-300 rounded-md"
                        value={formData.commercialLoss}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <Label htmlFor="feederConsumption" className="text-sm font-medium text-gray-700">
                        Feeder Consumption (kWh) *
                    </Label>
                    <Input
                        id="feederConsumption"
                        type="number"
                        placeholder="Enter feeder consumption"
                        className="mt-1 w-full border-gray-300 rounded-md"
                        value={formData.feederConsumption}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="flex justify-between space-x-4 mt-6">
                    <Button
                        variant="outline"
                        type="button"
                        className="border-[#161CCA] text-[#161CCA] cursor-pointer"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="bg-[#161CCA] text-white cursor-pointer"
                        disabled={!isFormValid()}
                    >
                        Proceed
                    </Button>
                </div>
            </form>
        </div>
    );
}
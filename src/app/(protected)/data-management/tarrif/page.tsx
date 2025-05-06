'use client';

import { NotificationBar } from '@/components/notificationbar';
import { TariffTable } from '@/components/tariff/tariff-table';
import { Button } from '@/components/ui/button';
import { ContentHeader } from '@/components/ui/content-header';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { TariffDatePicker } from '@/components/ui/tarrif-datepicker';
import { ArrowUpDown, Check, CirclePlusIcon, ListFilter, Search, SquareArrowOutUpRight } from 'lucide-react';
import React, { useState } from 'react';

export default function TariffManagementPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    interface Tariff {
        id: string;
        name: string;
        index: string;
        type: string;
        effectiveDate: Date | null;
        bandCode: string;
        tariffRate: string;
        status: 'active' | 'inactive';
        approvalStatus: 'approved' | 'pending' | 'rejected';
    }

    const [tariffs, setTariffs] = useState<Tariff[]>([]);
    const [selectedTariffs, setSelectedTariffs] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        index: '',
        type: '',
        effectiveDate: null as Date | null,
        bandCode: '',
        tariffRate: '',
        status: 'inactive' as 'active' | 'inactive',
        approvalStatus: 'pending' as 'approved' | 'pending' | 'rejected',
    });

    const handleInputChange = (field: string, value: string | Date | null) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleUpdateTariff = (id: string, updates: Partial<Tariff>) => {
        setTariffs((prev) =>
            prev.map((tariff) =>
                tariff.id === id ? { ...tariff, ...updates } : tariff
            )
        );
    };

    const handleBulkApprove = () => {
        selectedTariffs.forEach((id) => {
            handleUpdateTariff(id, {
                approvalStatus: 'approved',
                status: 'active',
            });
        });
        setSelectedTariffs([]); // Clear selection after approval
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        const newTariff = {
            ...formData,
            id: Date.now().toString(),
            status: 'inactive' as 'active' | 'inactive',
            approvalStatus: 'pending' as 'approved' | 'pending' | 'rejected',
        };

        setTariffs([...tariffs, newTariff]);
        setFormData({
            name: '',
            index: '',
            type: '',
            effectiveDate: null,
            bandCode: '',
            tariffRate: '',
            status: 'inactive',
            approvalStatus: 'pending',
        });
        setIsDialogOpen(false);
    };

    const isFormValid = formData.name && formData.index && formData.type &&
        formData.effectiveDate && formData.bandCode && formData.tariffRate;

    return (
        <div className="font-sans min-h-screen flex flex-col">
            <NotificationBar
                title="Tariff Management"
                bgColor="bg-[rgba(22,28,202,1)]"
                textColor="text-white"
                isTopBanner={true}
            />
            <NotificationBar
                title2="How to use"
                description="Note: At least one band must be created"
                bgColor="bg-[rgba(219,230,254,1)]"
                textColor="text-[rgba(22,28,202,1)]"
                closable={true}
                showIcon={true}
                isTopBanner={false}
            />

            <div className="flex-1 p-6 flex flex-col">
                <div className="flex justify-between items-start mb-8">
                    <ContentHeader
                        title={'Tariff'}
                        description={'Set and manage tariff plans here'}
                    />
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                className="bg-[rgba(22,28,202,0.4)] text-white hover:bg-[rgb(22,28,202)] flex items-center gap-2 text-sm h-fit cursor-pointer"
                                size="md"
                            >
                                <CirclePlusIcon strokeWidth={2.75} size={15} />
                                Add tariff
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[400px]">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-semibold">Add Tariff</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-4">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="name" className="text-sm font-medium text-gray-700">
                                        Tariff Name
                                    </label>
                                    <Input
                                        id="name"
                                        placeholder="Enter tariff name"
                                        className="border-gray-300 focus:ring-[rgba(22,28,202,1)] focus:border-[rgba(22,28,202,1)]"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-row justify-between gap-4">
                                    <div className="flex flex-col gap-2 w-1/2">
                                        <label htmlFor="index" className="text-sm font-medium text-gray-700">
                                            Tariff Index
                                        </label>
                                        <Select
                                            value={formData.index}
                                            onValueChange={(value: string) => handleInputChange('index', value)}
                                        >
                                            <SelectTrigger className="w-full border-gray-300 focus:ring-[rgba(22,28,202,1)] focus:border-[rgba(22,28,202,1)]">
                                                <SelectValue placeholder="Select tariff ID" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {['1', '2', '3', '4', '5', '6'].map((id) => (
                                                    <SelectItem key={id} value={id}>
                                                        {id}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex flex-col gap-2 w-1/2">
                                        <label htmlFor="type" className="text-sm font-medium text-gray-700">
                                            Tariff Type
                                        </label>
                                        <Select
                                            value={formData.type}
                                            onValueChange={(value: string) => handleInputChange('type', value)}
                                        >
                                            <SelectTrigger className="w-full border-gray-300 focus:ring-[rgba(22,28,202,1)] focus:border-[rgba(22,28,202,1)]">
                                                <SelectValue placeholder="Select tariff type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {['R1', 'R2', 'R3', 'C1', 'C2'].map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Tariff Effective Date
                                    </label>
                                    <TariffDatePicker
                                        value={formData.effectiveDate instanceof Date ? formData.effectiveDate.toISOString() : undefined}
                                        onChange={(date) => {
                                            const currentDate = formData.effectiveDate instanceof Date ? formData.effectiveDate.toISOString() : null;
                                            if (currentDate !== date) {
                                                handleInputChange('effectiveDate', date ? new Date(date) : null);
                                            }
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="band-code" className="text-sm font-medium text-gray-700">
                                        Band Code
                                    </label>
                                    <Select
                                        value={formData.bandCode}
                                        onValueChange={(value: string) => handleInputChange('bandCode', value)}
                                    >
                                        <SelectTrigger className="w-full border-gray-300 focus:ring-[rgba(22,28,202,1)] focus:border-[rgba(22,28,202,1)]">
                                            <SelectValue placeholder="Select band code" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['Band A', 'Band B', 'Band C', 'Band D', 'Band E'].map((band) => (
                                                <SelectItem key={band} value={band}>
                                                    {band}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="tariff-rate" className="text-sm font-medium text-gray-700">
                                        Tariff Rate
                                    </label>
                                    <Input
                                        id="tariff-rate"
                                        placeholder="Enter tariff rate"
                                        className="border-gray-300 focus:ring-[rgba(22,28,202,1)] focus:border-[rgba(22,28,202,1)]"
                                        value={formData.tariffRate}
                                        onChange={(e) => handleInputChange('tariffRate', e.target.value)}
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <Button
                                        variant="secondary"
                                        type="button"
                                        onClick={() => setIsDialogOpen(false)}
                                        className="text-gray-700 border-gray-300"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className={`bg-[rgba(22,28,202,1)] text-white hover:bg-[rgba(22,28,202,0.9)] ${isFormValid ? '' : 'opacity-40 cursor-not-allowed'}`}
                                        disabled={!isFormValid}
                                    >
                                        Submit
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="flex justify-between items-center mb-8">
                    <div className="flex gap-10 items-center mb-8">
                        <div className="flex border border-[rgba(228,231,236,1)] gap-2 rounded-md px-3 py-2 w-[219px]">
                            <Search size={14} strokeWidth={2.75} className="text-gray-500 ml-2" />
                            <input
                                type="text"
                                placeholder="Search by name, ID, cont..."
                                className="outline-none border-none text-sm flex-grow w-full text-[rgba(95,95,95,1)] placeholder-[rgba(95,95,95,1)]"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button className="text-gray-700 border border-[rgba(228,231,236,1)] text-sm rounded-md px-4 py-2 focus:outline-none flex items-center gap-2 cursor-pointer">
                                <ListFilter size={14} />
                                Filter
                            </Button>
                            <Button className="text-gray-700 border border-[rgba(228,231,236,1)] text-sm rounded-md px-4 py-2 focus:outline-none flex items-center gap-2 cursor-pointer">
                                <ArrowUpDown size={14} />
                                Sort
                            </Button>
                        </div>
                    </div>
                    <div className="flex gap-5">
                        <Button
                            variant={'outline'}
                            className={`border-[rgb(34,194,94)] text-[rgb(34,194,94)] font-semibold text-md gap-2 py-5 px-8 ${selectedTariffs.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleBulkApprove}
                            disabled={selectedTariffs.length === 0}
                        >
                            <Check size={14} />
                            Bulk Approve
                        </Button>
                        <Button
                            variant={'default'}
                            className="bg-[rgba(22,28,202,1)] text-[rgba(254,254,254,1)] font-semibold text-md gap-2 py-5 px-8"
                        >
                            <SquareArrowOutUpRight size={14} />
                            Export
                        </Button>
                    </div>
                </div>

                <div className="flex-1 bg-white rounded-lg border border-gray-200">
                    <TariffTable
                        tariffs={tariffs}
                        onUpdateTariff={handleUpdateTariff}
                        selectedTariffs={selectedTariffs}
                        setSelectedTariffs={setSelectedTariffs}
                    />
                </div>
            </div>

            <div className="text-center py-3 text-gray-500 border-t border-gray-200 mt-auto">
                © 2025, Powered by MEMMCOL
            </div>
        </div>
    );
};
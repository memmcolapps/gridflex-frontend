'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { ArrowUpDown, CircleAlert, CirclePlusIcon, ListFilter, Search } from 'lucide-react';
import React, { useState } from 'react';

type TariffManagementPageProps = unknown;

const TariffManagementPage: React.FC<TariffManagementPageProps> = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <div className="font-sans min-h-screen flex flex-col">
            {/* Top Navigation Bar */}
            <div className="bg-[rgba(22,28,202,1)] text-white py-4 px-6 flex justify-between rounded-tl-[10px] rounded-tr-[10px] items-center">
                <h2 className="text-lg font-medium font-[inter]">Tariff Management</h2>
                <div className="text-xl">
                    <CircleAlert strokeWidth={2.75} className='cursor-pointer' />
                </div>
            </div>

            {/* Secondary Navigation Bar */}
            <div className="bg-[rgba(219,230,254,1)] h-30 py-4 px-6 flex gap-5 font-medium text-base items-center">
                <div className="flex flex-col">
                    <div className='flex flex-row gap-2'>
                        <CircleAlert strokeWidth={2.0} size={16} className='cursor-pointer text-[rgba(22,28,202,1)]' />
                        <h2 className="text-base font-medium font-[manrope] text-[rgba(22,28,202,1)] mb-3">
                            How to use
                        </h2>
                    </div>
                    <p className="text-base font-medium font-[manrope] text-[rgba(38,38,38,1)]">
                        Note: At least one band must be created before tariff can be configured.
                    </p>
                </div>
            </div>

            {/* Main Content Container */}
            <div className="flex-1 p-6 flex flex-col">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-8">
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-[manrope] text-gray-800 font-bold">Tariff</h1>
                        <p className="text-[rgba(109,109,109,1)] font-medium font-[manrope] text-base">Set and manage tariff plans here</p>
                    </div>

                    {/* Dialog Implementation */}
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
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create New Tariff</DialogTitle>
                                <DialogDescription>
                                    Configure your new tariff plan here
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                {/* Add your form fields here */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="name" className="text-right">
                                        Name
                                    </label>
                                    <Input id="name" placeholder="Tariff name" className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="description" className="text-right">
                                        Description
                                    </label>
                                    <Input id="description" placeholder="Description" className="col-span-3" />
                                </div>
                                {/* Add more fields as needed */}
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-[rgba(22,28,202,1)] hover:bg-[rgba(22,28,202,0.9)]"
                                >
                                    Create Tariff
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Search and Filter Section */}
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
                        <button className="text-gray-700 border border-[rgba(228,231,236,1)] text-sm rounded-md px-4 py-2 focus:outline-none flex items-center gap-2 cursor-pointer">
                            <ListFilter size={14} />
                            Filter
                        </button>
                        <button className="text-gray-700 border border-[rgba(228,231,236,1)] text-sm rounded-md px-4 py-2 focus:outline-none flex items-center gap-2 cursor-pointer">
                            <ArrowUpDown size={14} />
                            Sort
                        </button>
                    </div>
                </div>

                {/* Table/Content Area */}
                <div className="flex-1 bg-white rounded-lg border border-gray-200">
                    {/* Your table or content goes here */}
                    <div className="p-4 text-gray-500">
                        Content area will go here (table, cards, etc.)
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center py-3 text-gray-500 border-t border-gray-200 mt-auto">
                © 2025, Powered by MEMMCOL
            </div>
        </div>
    );
};

export default TariffManagementPage;
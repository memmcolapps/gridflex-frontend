"use client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronDown, ChevronUp, MoveRight, Unlink } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface MeterItem {
    id: number;
    customerId: string;
    customerName: string;
    meterNo: string;
    simNumber: string;
    oldSGC: string;
    newSGC: string;
    manufacturer: string;
    class: string;
    metertype: string;
    category: string;
    changeDescription: string;
    approvalStatus: string;
    reason?: string;
    oldkrn?: string;
    newkrn?: string;
    oldTariffIndex?: string;
    newTariffIndex?: string;
    imageUrl?: string;
}

const meterDetachedDetailsData = [
    { label: 'Customer Name', value: 'Ademola Moshood' },
    { label: 'Phone Number', value: '08028072025' },
    { label: 'Address', value: '20, ijeun, orimerunmu, Ogun state' },
    { label: 'Meter Manufacturer', value: 'Momas' },
    { label: 'Meter Class', value: 'Three Phase' },
    { label: 'Meter Type', value: 'Electricity' },
    { label: 'Meter Category', value: 'Prepaid' },
    { label: 'Service Address', value: '40, ijeun, orimerunmu, Ogun state' },
    { label: 'Reason', value: 'Burnt' }
];
const allocatedDetailsData = [
    { label: 'BusinessHub ID', value: '123' },
    { label: 'Meter Manufacturer', value: 'Momas' },
    { label: 'Meter Class', value: 'Three Phase' },
    { label: 'Meter Type', value: 'Electricity' },
    { label: 'Meter Category', value: 'Prepaid' },
];
const migratedDetailsData = [
    { label: 'Customer ID', value: 'C-1234566778' },
    { label: 'Customer Name', value: 'Ademola Moshood' },
    { label: 'Phone Number', value: '08098765438' },
    { label: 'Address', value: '20, ijeun, orimerunmu, Ogun state' },
    { label: 'Meter Manufacturer', value: 'Momas' },
    { label: 'Meter Class', value: 'Three Phase' },
    { label: 'Meter Type', value: 'Electricity' },
    { label: 'Meter Category', value: 'Prepaid' },
    { label: 'Service Address', value: '40, ijeun, orimerunmu, Ogun state' },
];
const assignedDetailsData = [
    { label: 'Customer Name', value: 'Ademola Moshood' },
    { label: 'Phone Number', value: '08098765438' },
    { label: 'Address', value: '20, ijeun, orimerunmu, Ogun state' },
    { label: 'Meter Manufacturer', value: 'Momas' },
    { label: 'Meter Class', value: 'Three Phase' },
    { label: 'Meter Type', value: 'Electricity' },
    { label: 'Meter Category', value: 'Prepaid' },
    { label: 'Service Address', value: '40, ijeun, orimerunmu, Ogun state' },
    { label: 'Uploaded Image', value: 'Click to view image' },
];

interface ViewMeterDetailsDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedRow: MeterItem | null;
    onApprove: (row: MeterItem) => void;
    onReject: (row: MeterItem) => void;
}

const ViewMeterDetailsDialog: React.FC<ViewMeterDetailsDialogProps> = ({
    isOpen,
    onOpenChange,
    selectedRow,
    onApprove,
    onReject,
}) => {
    const [showDetachedDetails, setShowDetachedDetails] = useState(false);
    const [showAllocatedDetails, setShowAllocatedDetails] = useState(false);
    const [showMigratedDetails, setShowMigratedDetails] = useState(false);
    const [showAssignedDetails, setShowAssignedDetails] = useState(false);
    const [dialogMode, setDialogMode] = useState<'main' | 'image'>('main'); // Track dialog mode
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Debug state changes
    useEffect(() => {
        console.log('dialogMode changed to:', dialogMode);
        if (dialogMode === 'image' && !isTransitioning) {
            console.log('Image dialog should be visible');
        }
    }, [dialogMode, isTransitioning]);

    const handleImageClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsTransitioning(true);
        setDialogMode('image'); // Switch to image mode
        setTimeout(() => {
            setIsTransitioning(false);
        }, 200);
    };

    const handleBackClick = () => {
        setIsTransitioning(true);
        setDialogMode('main'); // Switch back to main mode
        setTimeout(() => {
            setIsTransitioning(false);
            onOpenChange(true); // Reopen the main dialog
        }, 200);
    };

    const renderContent = () => {
        if (!selectedRow) return null;

        switch (selectedRow.changeDescription) {
            case 'Meter Allocated':
                return (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-left text-base sm:text-lg font-semibold text-gray-900 truncate">
                                Meter Allocated
                            </DialogTitle>
                            <span className="text-gray-500 text-sm sm:text-base">
                                Operator: <span className="font-medium">Margaret</span>
                            </span>
                        </DialogHeader>
                        <div className="flex flex-col gap-3 py-4 sm:py-6 w-150">
                            <div className="flex items-center gap-4 p-2 ml-1">
                                <div className="flex-1 text-sm sm:text-base font-bold text-gray-900">
                                    {selectedRow.meterNo ?? 'N/A'}
                                </div>
                                <div className="flex-1 flex items-center gap-2 text-sm sm:text-base font-bold text-gray-900 mr-18">
                                    <MoveRight className="text-gray-900 mr-14 scale-x-250" size={16} />
                                    <span className="mr-24 whitespace-nowrap">Molete Business Hub</span>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                onClick={() => setShowAllocatedDetails(prev => !prev)}
                                className="w-fit px-2 py-1 text-sm font-medium text-[#161CCA] cursor-pointer hover:text-blue-700 flex items-center gap-1"
                            >
                                Details
                                {showAllocatedDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </Button>
                            {showAllocatedDetails && (
                                <div className="p-4 space-y-4">
                                    {allocatedDetailsData.map(({ label, value }) => (
                                        <div key={label} className="grid grid-cols-[150px_1fr] items-center gap-16">
                                            <span className="text-gray-700 font-medium w-40">{label}:</span>
                                            <span className="text-gray-900 font-bold">{value ?? 'N/A'}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                );

            case 'Meter Assigned':
                return (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-left text-base sm:text-lg font-semibold text-gray-900 truncate">
                                Meter Assigned
                            </DialogTitle>
                            <span className="text-gray-500 text-sm sm:text-base">
                                Operator: <span className="font-medium">Margaret</span>
                            </span>
                        </DialogHeader>
                        <div className="flex flex-col gap-3 py-4 sm:py-6 w-150 h-fit">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-3 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="text-sm sm:text-base font-bold text-gray-900">
                                            {selectedRow.meterNo}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Button
                                            variant="ghost"
                                            onClick={() => setShowAssignedDetails(prev => !prev)}
                                            className="w-fit px-2 py-1 text-sm font-medium text-[#161CCA] hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                                        >
                                            Details
                                            {showAssignedDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 space-y-6">
                                    <div className="flex items-center gap-2">
                                        <MoveRight className="text-gray-900 mr-8 scale-x-185" size={16} />
                                        <div className="text-sm sm:text-base font-bold text-gray-700">
                                            C-1234567890
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4" />
                                </div>
                            </div>
                            {showAssignedDetails && (
                                <div className="bg-white p-6 space-y-4">
                                    {assignedDetailsData.map(({ label, value }) => (
                                        <div key={label} className="grid grid-cols-[150px_1fr] items-start gap-16">
                                            <span className="text-gray-700 w-40">{label}:</span>
                                            {label === 'Uploaded Image' ? (
                                                <span className="text-gray-900 font-bold cursor-pointer">
                                                    <Image
                                                        src="/images/mdj.jpg"
                                                        alt="Uploaded meter image"
                                                        className="object-cover rounded-md border cursor-pointer"
                                                        width={200}
                                                        height={100}
                                                        onClick={handleImageClick}
                                                    />
                                                </span>
                                            ) : (
                                                <span className="text-gray-900 font-bold">{value ?? 'N/A'}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                );

            case 'Meter Deactivated':
                return (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-left text-base sm:text-lg font-semibold text-gray-900 truncate">
                                Meter Deactivated
                            </DialogTitle>
                            <span className="text-gray-500 text-sm sm:text-base">
                                Operator: <span className="font-medium">Margaret</span>
                            </span>
                        </DialogHeader>
                        <div className="flex flex-col gap-3 py-4 sm:py-6 w-[405px]">
                            {[
                                { label: 'Customer ID:', value: selectedRow.customerId },
                                { label: 'Customer Name:', value: selectedRow.customerName },
                                { label: 'Meter Number:', value: selectedRow.meterNo },
                                { label: 'SIM No.:', value: selectedRow.simNumber },
                                { label: 'Meter Type:', value: 'Electricity' },
                                { label: 'Meter Manufacturer:', value: selectedRow.manufacturer },
                                { label: 'Meter Class:', value: selectedRow.class },
                                { label: 'Meter Category:', value: selectedRow.category },
                                { label: 'Old SGC:', value: selectedRow.oldSGC },
                                { label: 'New SGC:', value: selectedRow.newSGC },
                                { label: 'Old KRN:', value: selectedRow.oldkrn },
                                { label: 'New KRN:', value: selectedRow.newkrn },
                                { label: 'Old Tariff Index:', value: selectedRow.oldTariffIndex },
                                { label: 'New Tariff Index:', value: selectedRow.newTariffIndex },
                                { label: 'Reason:', value: selectedRow.reason },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex items-center whitespace-nowrap">
                                    <div className="w-[120px] text-sm sm:text-base font-medium text-gray-700 whitespace-nowrap">
                                        {label}
                                    </div>
                                    <div className="text-sm sm:text-base font-bold text-gray-900 ml-30">
                                        {value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                );

                   case 'Meter Activated':
                return (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-left text-base sm:text-lg font-semibold text-gray-900 truncate">
                                Meter Activated
                            </DialogTitle>
                            <span className="text-gray-500 text-sm sm:text-base">
                                Operator: <span className="font-medium">Margaret</span>
                            </span>
                        </DialogHeader>
                        <div className="flex flex-col gap-3 py-4 sm:py-6 w-[405px]">
                            {[
                                { label: 'Customer ID:', value: selectedRow.customerId },
                                { label: 'Customer Name:', value: selectedRow.customerName },
                                { label: 'Meter Number:', value: selectedRow.meterNo },
                                { label: 'SIM No.:', value: selectedRow.simNumber },
                                { label: 'Meter Type:', value: 'Electricity' },
                                { label: 'Meter Manufacturer:', value: selectedRow.manufacturer },
                                { label: 'Meter Class:', value: selectedRow.class },
                                { label: 'Meter Category:', value: selectedRow.category },
                                { label: 'Old SGC:', value: selectedRow.oldSGC },
                                { label: 'New SGC:', value: selectedRow.newSGC },
                                { label: 'Old KRN:', value: selectedRow.oldkrn },
                                { label: 'New KRN:', value: selectedRow.newkrn },
                                { label: 'Old Tariff Index:', value: selectedRow.oldTariffIndex },
                                { label: 'New Tariff Index:', value: selectedRow.newTariffIndex },
                                { label: 'Reason:', value: selectedRow.reason },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex items-center whitespace-nowrap">
                                    <div className="w-[120px] text-sm sm:text-base font-medium text-gray-700 whitespace-nowrap">
                                        {label}
                                    </div>
                                    <div className="text-sm sm:text-base font-bold text-gray-900 ml-30">
                                        {value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                );

            case 'Meter Detached':
                return (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-left text-base sm:text-lg font-semibold text-gray-900 truncate">
                                Meter Detached
                            </DialogTitle>
                            <span className="text-gray-500 text-sm sm:text-base">
                                Operator: <span className="font-medium">Margaret</span>
                            </span>
                        </DialogHeader>
                        <div className="flex flex-col gap-4 py-4 sm:py-6">
                            <div className="flex items-start gap-4 w-150">
                                <div className="flex-1 flex flex-col gap-6 p-2">
                                    <div className="text-sm sm:text-base text-gray-900">
                                        <span className="ml-3">C-122623669</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        onClick={() => setShowDetachedDetails(prev => !prev)}
                                        className="w-fit px-2 py-1 text-sm font-medium text-[#161CCA] hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                                    >
                                        Details
                                        {showDetachedDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </Button>
                                </div>
                                <div className="flex-1 flex flex-col gap-3 p-2 mr-50">
                                    <div className="flex items-center gap-2 text-sm sm:text-base text-gray-900 mr-6">
                                        <Unlink size={20} className="text-gray-700" />
                                        <span className="font-bold ml-14">{selectedRow.meterNo ?? 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                            {showDetachedDetails && (
                                <div className="bg-white p-6 space-y-4">
                                    {meterDetachedDetailsData.map(({ label, value }) => (
                                        <div key={label} className="grid grid-cols-[150px_1fr] items-center gap-16">
                                            <span className="text-gray-700 w-40">{label}:</span>
                                            <span className="text-gray-900 font-bold">{value ?? 'N/A'}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                );

            case 'Meter Migrated':
                const newCategory =
                    selectedRow.category === 'Postpaid'
                        ? 'Prepaid'
                        : selectedRow.category === 'Prepaid'
                            ? 'Postpaid'
                            : 'N/A';

                return (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-left text-base sm:text-lg font-semibold text-gray-900 truncate">
                                Meter Migrated
                            </DialogTitle>
                            <span className="text-gray-500 text-sm sm:text-base">
                                Operator: <span className="font-medium">Margaret</span>
                            </span>
                        </DialogHeader>
                        <div className="flex flex-col gap-2 py-2 sm:py-2 w-150">
                            <div className="flex items-center gap-4 px-2 mr-16">
                                <div className="flex-1 text-sm sm:text-base text-gray-900" />
                                <div className="flex-1 text-sm sm:text-base text-gray-900">From</div>
                                <div className="flex-1 text-sm sm:text-base text-gray-900">To</div>
                            </div>
                            <div className="flex items-center gap-4 px-2">
                                <div className="flex-1 text-sm sm:text-base text-gray-900">
                                    {selectedRow.meterNo}
                                </div>
                                <div className="flex-1 text-sm sm:text-base font-bold text-gray-900">
                                    {selectedRow.category ?? 'N/A'}
                                </div>
                                <div className="flex-1 flex items-center gap-2 text-sm sm:text-base font-bold text-gray-900 mr-14">
                                    <MoveRight className="text-gray-900 scale-x-185 mr-2" size={16} />
                                    <span>{newCategory}</span>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                onClick={() => setShowMigratedDetails(prev => !prev)}
                                className="w-fit px-2 py-1 text-sm font-medium text-[#161CCA] hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                            >
                                Details
                                {showMigratedDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </Button>
                            {showMigratedDetails && (
                                <div className="bg-white p-6 space-y-4">
                                    {migratedDetailsData.map(({ label, value }) => (
                                        <div key={label} className="grid grid-cols-[150px_1fr] items-center gap-16">
                                            <span className="text-gray-700 w-40">{label}:</span>
                                            <span className="text-gray-900 font-bold">{value ?? 'N/A'}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                );

            case 'Newly Added':
                return (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-left text-base sm:text-lg font-semibold text-gray-900 truncate">
                                Newly Added
                            </DialogTitle>
                            <span className="text-gray-500 text-sm sm:text-base">
                                Operator: <span className="font-medium">Margaret</span>
                            </span>
                        </DialogHeader>
                        <div className="flex flex-col gap-3 py-4 sm:py-6 w-[405px]">
                            {[
                                { label: 'Meter Number:', value: selectedRow.meterNo },
                                { label: 'SIM No:', value: selectedRow.simNumber },
                                { label: 'Meter Type:', value: selectedRow.metertype },
                                { label: 'Meter Manufacturer:', value: selectedRow.manufacturer },
                                { label: 'Meter Class:', value: selectedRow.class },
                                { label: 'Meter Category:', value: selectedRow.category },
                                { label: 'Old SGC:', value: selectedRow.oldSGC },
                                { label: 'New SGC:', value: selectedRow.newSGC },
                                { label: 'Old KRN:', value: selectedRow.oldkrn },
                                { label: 'New KRN:', value: selectedRow.newkrn },
                                { label: 'Old Tariff Index:', value: selectedRow.oldTariffIndex },
                                { label: 'New Tariff Index:', value: selectedRow.newTariffIndex },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex items-center">
                                    <div className="w-[120px] text-sm sm:text-base font-medium text-gray-700 whitespace-nowrap">
                                        {label}
                                    </div>
                                    <div className="text-sm sm:text-base font-bold text-gray-900 ml-20">
                                        {value ?? 'N/A'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                );

            case 'Meter Edited':
                return (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-left text-base sm:text-lg font-semibold text-gray-900 truncate">
                                Meter Edited
                            </DialogTitle>
                            <span className="text-gray-500 text-sm sm:text-base">
                                Operator: <span className="font-medium">Margaret</span>
                            </span>
                        </DialogHeader>
                        <div className="flex flex-col gap-3 py-4 sm:py-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <div className="w-[100px] sm:w-[120px] text-sm sm:text-base font-medium text-gray-700 whitespace-nowrap">
                                    {/* Empty space for label column */}
                                </div>
                                <div className="w-full sm:w-[120px] lg:max-w-[700px] text-sm sm:text-base font-medium text-gray-700 whitespace-nowrap ml-20">
                                    From
                                </div>
                                <div className="flex items-start text-sm sm:text-base font-medium text-gray-700 whitespace-nowrap ml-10">
                                    To
                                </div>
                            </div>
                            {[
                                { label: 'Meter No:', oldValue: selectedRow.meterNo, newValue: selectedRow.meterNo === '6201021223' ? '6201021224' : selectedRow.meterNo },
                                { label: 'SIM Number:', oldValue: selectedRow.simNumber, newValue: selectedRow.simNumber === '890068073404' ? '890068073403' : selectedRow.simNumber },
                                { label: 'Meter Type:', oldValue: selectedRow.metertype, newValue: 'Water' },
                                { label: 'Meter Manufacturer:', oldValue: selectedRow.manufacturer, newValue: 'Majec' },
                                { label: 'Meter Class:', oldValue: selectedRow.class, newValue: '3 Phase' },
                                { label: 'Meter Category:', oldValue: selectedRow.category, newValue: 'Postpaid' },
                                { label: 'Old SGC:', oldValue: selectedRow.oldSGC, newValue: selectedRow.oldSGC },
                                { label: 'New SGC:', oldValue: selectedRow.newSGC, newValue: selectedRow.newSGC },
                                { label: 'Old KRN:', oldValue: selectedRow.oldkrn, newValue: selectedRow.oldkrn },
                                { label: 'New KRN:', oldValue: selectedRow.newkrn, newValue: selectedRow.newkrn },
                                { label: 'Old Tariff Index:', oldValue: selectedRow.oldTariffIndex, newValue: '3' },
                                { label: 'New Tariff Index:', oldValue: selectedRow.newTariffIndex, newValue: '4' },
                            ].map(({ label, oldValue, newValue }) => (
                                <div key={label} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                    <div className="w-[100px] sm:w-[120px] text-sm sm:text-base font-medium text-gray-700 whitespace-nowrap">
                                        {label}
                                    </div>
                                    <div className="w-full sm:w-[120px] lg:max-w-[700px] text-sm sm:text-base font-bold text-gray-900 whitespace-nowrap ml-20">
                                        {oldValue ?? 'N/A'}
                                    </div>
                                    {newValue && (
                                        <div className="flex items-start text-sm sm:text-base text-gray-900 whitespace-nowrap ml-10">
                                            <MoveRight className="text-gray-900 mr-4 scale-x-185" size={16} />
                                            <span className="font-bold truncate">{newValue}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <>
            <Dialog open={isOpen && dialogMode === 'main'} onOpenChange={onOpenChange}>
                <DialogContent
                    className="w-fit lg:max-w-[1200px] bg-white text-black p-4 sm:p-6 rounded-lg shadow-lg overflow-hidden h-fit"
                >
                    <div className="w-full">
                        {renderContent()}
                        <div className="flex justify-between gap-2 mt-4">
                            <Button
                                onClick={() => selectedRow && onReject(selectedRow)}
                                variant="outline"
                                className="border-red-500 text-red-500 bg-white hover:bg-red-50 hover:text-red-600 text-sm sm:text-base font-medium w-full sm:w-auto px-3 py-2 sm:px-4 sm:py-2 rounded-md transition-colors focus:ring-red-500/0"
                                disabled={!selectedRow}
                            >
                                Reject
                            </Button>
                            <Button
                                onClick={() => selectedRow && onApprove(selectedRow)}
                                variant="default"
                                className="bg-[#22C55E] text-white hover:bg-[#1ea34d] text-sm sm:text-base font-medium w-full sm:w-auto px-3 py-2 sm:px-4 sm:py-2 rounded-md transition-colors"
                                disabled={!selectedRow}
                            >
                                Approve
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isOpen && dialogMode === 'image' && !isTransitioning} onOpenChange={(open) => setDialogMode(open ? 'image' : 'main')}>
                <DialogContent className="w-fit max-w-[800px] bg-white p-6 rounded-lg shadow-lg h-fit">
                    <DialogHeader className="flex flex-col items-start">
                        <Button
                            variant="ghost"
                            onClick={handleBackClick}
                            className="mb-4 text-start font-medium text-gray-700 hover:text-gray-900 flex items-center gap-2 cursor-pointer"
                        >
                            <ArrowLeft size={16} />
                            Back
                        </Button>
                    </DialogHeader>
                    <div className="flex justify-center mb-4">
                        <Image
                            src="/images/mdj.jpg"
                            alt="Full-size uploaded meter image"
                            className="object-contain max-w-full max-h-[70vh]"
                            width={800}
                            height={400}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ViewMeterDetailsDialog;
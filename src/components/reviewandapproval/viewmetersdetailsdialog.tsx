import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MoveRight, UnlinkIcon } from 'lucide-react';
import Image from 'next/image';

interface MeterItem {
    id: number;
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
                            <div className="flex items-center gap-4 p-2">
                                <div className="flex-1 text-sm sm:text-base font-bold text-gray-900">
                                    {selectedRow.meterNo ?? 'N/A'}
                                </div>
                                <div className="flex-1 flex items-center gap-2 text-sm sm:text-base font-bold text-gray-900">
                                    <MoveRight className="text-gray-900 mr-2 scale-x-185" size={16} />
                                    <span>Molete Business Hub</span>
                                </div>
                            </div>
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
                            {/* Two-column layout */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Left Column */}
                                <div className="flex flex-col gap-3 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="text-sm sm:text-base font-bold text-gray-900">
                                            {selectedRow.meterNo}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-[120px] text-sm sm:text-base font-bold text-gray-700 whitespace-nowrap">
                                            Uploaded Image:
                                        </div>
                                    </div>
                                </div>
                                {/* Right Column */}
                                <div className="flex flex-col gap-3 space-y-6">
                                    <div className="flex items-center gap-2">
                                        <MoveRight className="text-gray-900 mr-2 scale-x-185" size={16} />
                                        <div className="text-sm sm:text-base font-bold text-gray-700">
                                            C-1234567890
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-sm sm:text-base font-bold text-gray-900">

                                            <Image
                                                src="/images/mdj.jpg"
                                                alt="C-1234567890"
                                                className=" object-cover w-100 h-50"
                                            />

                                        </div>
                                    </div>
                                </div>
                            </div>
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
                        <div className="flex flex-col gap-3 py-4 sm:py-6">
                            <div className="flex items-start gap-4 w-150">
                                <div className="flex-1 flex flex-col gap-3 p-2">
                                    <div className="text-sm sm:text-base font-bold text-gray-900">
                                        {selectedRow.meterNo ?? 'N/A'}
                                    </div>
                                    <div className="text-sm sm:text-base font-medium text-gray-700">
                                        Reason:
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col gap-3 p-2">
                                    <div className="flex items-center gap-2 text-sm sm:text-base text-gray-900">
                                        <UnlinkIcon size={20} className="text-gray-700" />
                                        <span className='font-bold'>C-122623669</span>
                                    </div>
                                    <div className="text-sm sm:text-base font-bold text-gray-900">
                                        {selectedRow.reason}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                );


            case 'Meter Migrated':
                const newCategory = selectedRow.category === 'Postpaid' ? 'Prepaid' : selectedRow.category === 'Prepaid' ? 'Postpaid' : 'N/A';
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
                        <div className="flex flex-col gap-6 py-4 sm:py-6 w-150">
                            <div className="flex items-center gap-4 p-2">
                                <div className="flex-1 text-sm sm:text-base text-gray-900">
                                    {selectedRow.meterNo}
                                </div>
                                <div className="flex-1 text-sm sm:text-base font-bold text-gray-900">
                                    {selectedRow.category ?? 'N/A'}
                                </div>
                                <div className="flex-1 flex items-center gap-2 text-sm sm:text-base font-bold text-gray-900">
                                    <MoveRight className="text-gray-900 mr-2 scale-x-185" size={16} />
                                    <span>{newCategory}</span>
                                </div>
                            </div>
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
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
    );
};

export default ViewMeterDetailsDialog;
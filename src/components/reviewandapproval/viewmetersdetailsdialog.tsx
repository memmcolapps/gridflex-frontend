import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MoveRight, UnlinkIcon } from 'lucide-react';
import Image from 'next/image';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'; // Import VisuallyHidden
import type { Meter } from "@/types/review-approval";
import type { BusinessHub } from '@/types/meter-inventory';
import { useAuth } from '@/context/auth-context';

interface ViewMeterDetailsDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedRow: Meter | null;
    onApprove: (item: Meter | null) => void;
    onReject: (item: Meter | null) => void;
    hub: BusinessHub;
}

const ViewMeterDetailsDialog: React.FC<ViewMeterDetailsDialogProps> = ({
    isOpen,
    onOpenChange,
    selectedRow,
    onApprove,
    onReject,
    hub,
}) => {
    const { user } = useAuth();
    const isMeterAllocated = selectedRow?.description === 'Meter Allocated';
    const isMeterAssigned = selectedRow?.description === 'Meter Assigned';
    const isMeterDeactivated = selectedRow?.description === 'Meter Deactivated';
    const isMeterDetached = selectedRow?.description === 'Meter Detached';
    const isMeterMigrated = selectedRow?.description === 'Meter Migrated';
    const isNewlyAdded = selectedRow?.description === 'Newly added';
    const isMeterEdited = selectedRow?.description === 'Meter edited';

    const renderContent = () => {
        if (!selectedRow) {
            return (
                <VisuallyHidden>
                    <DialogTitle>No Meter Selected</DialogTitle>
                </VisuallyHidden>
            );
        }
        if (isMeterAllocated) {
            return (
                <>
                    <DialogHeader>
                        <DialogTitle className="text-left text-base sm:text-lg font-semibold text-gray-900 truncate">
                            Meter Allocated
                        </DialogTitle>
                        <span className="text-gray-500 text-sm sm:text-base">
                            Operator: {user?.business?.businessName?.toUpperCase() ?? 'BUSINESS NAME'}
                        </span>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 py-4 sm:py-6 w-150">
                        <div className="flex items-center gap-4 p-2">
                            <div className="flex-1 text-sm sm:text-base font-bold text-gray-900">
                                {selectedRow.meterNumber}
                            </div>
                            <div className="flex-1 flex items-center gap-2 text-sm sm:text-base font-bold text-gray-900">
                                <MoveRight className="text-gray-900 mr-2 scale-x-185" size={16} />
                                <span>{hub?.name ?? 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </>
            );
        }

        if (isMeterAssigned) {
            return (
                <>
                    <DialogHeader>
                        <DialogTitle className="text-left text-base sm:text-lg font-semibold text-gray-900 truncate">
                            Meter Assigned
                        </DialogTitle>
                        <span className="text-gray-500 text-sm sm:text-base">
                            Operator: {user?.business?.businessName?.toUpperCase() ?? 'BUSINESS NAME'}
                        </span>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 py-4 sm:py-6 w-150 h-fit">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="text-sm sm:text-base font-bold text-gray-900">
                                        {selectedRow.meterNumber}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-[120px] text-sm sm:text-base font-bold text-gray-700 whitespace-nowrap">
                                        Uploaded Image:
                                    </div>
                                </div>
                            </div>
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
                                            className="object-cover w-100 h-50"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );
        }

        if (isMeterDeactivated) {
            return (
                <>
                    <DialogHeader>
                        <DialogTitle className="text-left text-base sm:text-lg font-semibold text-gray-900 truncate">
                            Meter Deactivated
                        </DialogTitle>
                        <span className="text-gray-500 text-sm sm:text-base">
                            Operator: {user?.business?.businessName?.toUpperCase() ?? 'BUSINESS NAME'}
                        </span>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 py-4 sm:py-6 w-[405px]">
                        {[
                            { label: 'Meter Number:', value: selectedRow.meterNumber },
                            { label: 'SIM No.:', value: selectedRow.simNumber },
                            { label: 'Meter Type:', value: 'Electricity' },
                            { label: 'Meter Manufacturer:', value: selectedRow.manufacturer?.name },
                            { label: 'Meter Class:', value: selectedRow.meterClass },
                            { label: 'Meter Category:', value: selectedRow.meterCategory },
                            { label: 'Old SGC:', value: selectedRow.oldSgc },
                            { label: 'New SGC:', value: selectedRow.newSgc },
                            { label: 'Old KRN:', value: selectedRow.oldKrn },
                            { label: 'New KRN:', value: selectedRow.newKrn },
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
        }

        if (isMeterDetached) {
            return (
                <>
                    <DialogHeader>
                        <DialogTitle className="text-left text-base sm:text-lg font-semibold text-gray-900 truncate">
                            Meter Detached
                        </DialogTitle>
                        <span className="text-gray-500 text-sm sm:text-base">
                            Operator: {user?.business?.businessName?.toUpperCase() ?? 'BUSINESS NAME'}
                        </span>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 py-4 sm:py-6">
                        <div className="flex items-start gap-4 w-150">
                            <div className="flex-1 flex flex-col gap-3 p-2">
                                <div className="text-sm sm:text-base font-bold text-gray-900">
                                    {selectedRow.meterNumber ?? 'N/A'}
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
        }

        if (isMeterMigrated) {
            const newCategory = selectedRow.meterCategory === 'Postpaid' ? 'Prepaid' : selectedRow.meterCategory === 'Prepaid' ? 'Postpaid' : 'N/A';
            return (
                <>
                    <DialogHeader>
                        <DialogTitle className="text-left text-base sm:text-lg font-semibold text-gray-900 truncate">
                            Meter Migrated
                        </DialogTitle>
                        <span className="text-gray-500 text-sm sm:text-base">
                            Operator: {user?.business?.businessName?.toUpperCase() ?? 'BUSINESS NAME'}
                        </span>
                    </DialogHeader>
                    <div className="flex flex-col gap-6 py-4 sm:py-6 w-150">
                        <div className="flex items-center gap-4 p-2">
                            <div className="flex-1 text-sm sm:text-base text-gray-900">
                                {selectedRow.meterNumber}
                            </div>
                            <div className="flex-1 text-sm sm:text-base font-bold text-gray-900">
                                {selectedRow.meterCategory ?? 'N/A'}
                            </div>
                            <div className="flex-1 flex items-center gap-2 text-sm sm:text-base font-bold text-gray-900">
                                <MoveRight className="text-gray-900 mr-2 scale-x-185" size={16} />
                                <span>{newCategory}</span>
                            </div>
                        </div>
                    </div>
                </>
            );
        }

        if (isNewlyAdded) {
            return (
                <>
                    <DialogHeader>
                        <DialogTitle className="text-left text-base sm:text-lg font-semibold text-gray-900 truncate">
                            Newly Added
                        </DialogTitle>
                        <span className="text-gray-500 text-sm sm:text-base">
                            Operator: {user?.business?.businessName?.toUpperCase() ?? 'BUSINESS NAME'}
                        </span>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 py-4 sm:py-6 w-[405px]">
                        {[
                            { label: 'Meter Number:', value: selectedRow.meterNumber },
                            { label: 'SIM No:', value: selectedRow.simNumber },
                            { label: 'Meter Type:', value: selectedRow.meterType },
                            { label: 'Meter Manufacturer:', value: selectedRow.manufacturer?.name },
                            { label: 'Meter Class:', value: selectedRow.meterClass },
                            { label: 'Meter Category:', value: selectedRow.meterCategory },
                            { label: 'Old SGC:', value: selectedRow.oldSgc },
                            { label: 'New SGC:', value: selectedRow.newSgc },
                            { label: 'Old KRN:', value: selectedRow.oldKrn },
                            { label: 'New KRN:', value: selectedRow.newKrn },
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
        }

        if (isMeterEdited) {
            return (
                <>
                    <DialogHeader>
                        <DialogTitle className="text-left text-base sm:text-lg font-semibold text-gray-900 truncate">
                            Meter Edited
                        </DialogTitle>
                        <span className="text-gray-500 text-sm sm:text-base">
                            Operator: {user?.business?.businessName?.toUpperCase() ?? 'BUSINESS NAME'}
                        </span>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 py-4 sm:py-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="w-[100px] sm:w-[120px] text-sm sm:text-base font-medium text-gray-700 whitespace-nowrap">
                                {/* Empty header for label column */}
                            </div>
                            <div className="w-full sm:w-[120px] lg:max-w-[700px] text-sm sm:text-base font-medium text-gray-700 whitespace-nowrap ml-20">
                                From
                            </div>
                            <div className="flex items-start text-sm sm:text-base font-medium text-gray-700 whitespace-nowrap ml-10">
                                To
                            </div>
                        </div>
                        {[
                            { label: 'Meter No:', oldValue: selectedRow.oldMeterInfo.meterNumber, newValue: selectedRow.meterNumber },
                            { label: 'SIM Number:', oldValue: selectedRow.oldMeterInfo.simNumber, newValue: selectedRow.simNumber },
                            { label: 'Meter Type:', oldValue: selectedRow.oldMeterInfo.meterType, newValue: selectedRow.meterType },
                            { label: 'Meter Manufacturer:', oldValue: selectedRow.oldMeterInfo.manufacturer.name, newValue: selectedRow.manufacturer.name },
                            { label: 'Meter Class:', oldValue: selectedRow.oldMeterInfo.meterClass, newValue: selectedRow.meterClass },
                            { label: 'Meter Category:', oldValue: selectedRow.oldMeterInfo.meterCategory, newValue: selectedRow.meterCategory },
                            { label: 'Old SGC:', oldValue: selectedRow.oldMeterInfo.oldSgc, newValue: selectedRow.oldSgc },
                            { label: 'New SGC:', oldValue: selectedRow.oldMeterInfo.newSgc, newValue: selectedRow.newSgc },
                            { label: 'Old KRN:', oldValue: selectedRow.oldMeterInfo.oldKrn, newValue: selectedRow.oldKrn },
                            { label: 'New KRN:', oldValue: selectedRow.oldMeterInfo.newKrn, newValue: selectedRow.newKrn },
                            { label: 'Old Tariff Index:', oldValue: selectedRow.oldMeterInfo.oldTariffIndex, newValue: selectedRow.oldTariffIndex },
                            { label: 'New Tariff Index:', oldValue: selectedRow.oldMeterInfo.newTariffIndex, newValue: selectedRow.newTariffIndex },
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
        }
        // Default case for unknown changeDescription
        return (
            <VisuallyHidden>
                <DialogTitle>Unknown Meter Action</DialogTitle>
            </VisuallyHidden>
        );
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
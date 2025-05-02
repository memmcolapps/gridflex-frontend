'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface DeactivateTariffDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    // tariffName: string;
    onConfirm: () => void;
}

export function DeactivateTariffDialog({ open, onOpenChange, onConfirm }: DeactivateTariffDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange} >
            <DialogContent className="sm:max-w-[300px]">
                <DialogHeader>
                    <DialogTitle>
                        <AlertTriangle size={16} className="text-red-500 bg-red-300 p-2 rounded-full" />
                    </DialogTitle>
                    <DialogDescription className="text-lg font-semibold">
                        Deactivate Tariff
                    </DialogDescription>
                </DialogHeader>

                <div>
                    <p className="text-sm text-gray-700">
                        Are you sure you want to deactivate Tariff?
                    </p>
                </div>

                <DialogFooter className='flex justify-between mt-4'>
                    <Button variant="outline" className='border-red-500 text-red-500 mr-50 cursor-pointer' onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" className='bg-red-500 cursor-pointer' onClick={onConfirm}>
                        Deactivate
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
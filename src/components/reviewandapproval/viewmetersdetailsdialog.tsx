"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Ban, CheckCircle, ChevronDown, ChevronUp, MoveRight, Unlink } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Meter } from '@/types/review-approval';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table';

interface ViewMeterDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRow: Meter | null;
  onApprove: (item: Meter | null) => void;
  onReject: (item: Meter | null) => void;
}

type DialogMode = 'main' | 'image';

const ViewMeterDetailsDialog = ({
  isOpen,
  onOpenChange,
  selectedRow,
  onApprove,
  onReject,
}: ViewMeterDetailsDialogProps) => {
  const [dialogMode, setDialogMode] = useState<DialogMode>('main');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setDialogMode('main');
      setIsDetailsVisible(true);
    }
  }, [isOpen]);

  const handleOpenImage = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setDialogMode('image');
      setIsTransitioning(false);
    }, 300); // Duration of the fade out
  };

  const handleBackClick = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setDialogMode('main');
      setIsTransitioning(false);
    }, 300); // Duration of the fade out
  };

  const mainDetailsData = [
    { label: 'Meter Number', value: selectedRow?.meterNumber || 'N/A' },
    { label: 'Meter Type', value: selectedRow?.meterType || 'N/A' },
    { label: 'Meter Manufacturer', value: selectedRow?.manufacturer || 'N/A' },
    { label: 'Meter Category', value: selectedRow?.category || 'N/A' },
    { label: 'Approval Status', value: selectedRow?.approvalStatus || 'N/A' },
    { label: 'Reason', value: selectedRow?.reason || 'N/A' },
    { label: 'Description', value: selectedRow?.description || 'N/A' },
  ];

  const oldValuesData = [
    { label: 'Customer ID', value: selectedRow?.customerId || 'N/A' },
    { label: 'Customer Name', value: selectedRow?.customerName || 'N/A' },
    { label: 'SIM Number', value: selectedRow?.simNumber || 'N/A' },
    { label: 'Old SGC', value: selectedRow?.oldSGC || 'N/A' },
    { label: 'Old KRN', value: selectedRow?.oldkrn || 'N/A' },
    { label: 'Old Tariff Index', value: selectedRow?.oldTariffIndex || 'N/A' },
    { label: 'Meter Class', value: selectedRow?.class || 'N/A' },
    { label: 'Change Description', value: selectedRow?.changeDescription || 'N/A' },
  ];

  const newValuesData = [
    { label: 'New SGC', value: selectedRow?.newSGC || 'N/A' },
    { label: 'New KRN', value: selectedRow?.newkrn || 'N/A' },
    { label: 'New Tariff Index', value: selectedRow?.newTariffIndex || 'N/A' },
  ];

  const renderDetailsSection = (title: string, data: { label: string; value: string | undefined }[]) => (
    <div>
      <h3 className="text-md font-semibold text-gray-800">{title}</h3>
      <Table className="mt-2 text-sm">
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell className="px-0 py-1 text-gray-600">{row.label}</TableCell>
              <TableCell className="px-0 py-1 text-right font-medium text-gray-800">{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <>
      <style>{`
        .fade-out {
          opacity: 0;
          transition: opacity 0.3s ease-out;
        }
        .fade-in {
          opacity: 1;
          transition: opacity 0.3s ease-in;
        }
      `}</style>
      <Dialog open={isOpen && dialogMode === 'main' && !isTransitioning} onOpenChange={onOpenChange}>
        <DialogContent className={`w-full max-w-sm sm:max-w-md h-fit mx-auto bg-white text-black rounded-lg shadow-lg p-6 z-[1000] ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
          <DialogHeader className="flex flex-col items-start">
            <DialogTitle className="text-xl font-semibold text-gray-900">Meter Details</DialogTitle>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${selectedRow?.approvalStatus === 'pending-state' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                {selectedRow?.approvalStatus === 'pending-state' ? 'Pending' : 'Approved'}
              </span>
              <span className="text-sm text-gray-500">
                Created on: {new Date(selectedRow?.createdAt || '').toLocaleDateString()}
              </span>
            </div>
          </DialogHeader>

          <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {renderDetailsSection('Main Details', mainDetailsData)}

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsDetailsVisible(!isDetailsVisible)}>
                <h3 className="text-md font-semibold text-gray-800">Change Details</h3>
                {isDetailsVisible ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
              </div>
              {isDetailsVisible && (
                <div className="mt-4 space-y-4">
                  {renderDetailsSection('Old Values', oldValuesData)}
                  {renderDetailsSection('New Values', newValuesData)}
                  {selectedRow?.imageUrl && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-gray-700">Image</h4>
                      <div className="mt-2 relative">
                        <Image
                          src={selectedRow.imageUrl}
                          alt="Uploaded meter image"
                          width={400}
                          height={200}
                          className="w-full h-auto rounded-lg"
                        />
                        <Button
                          variant="ghost"
                          onClick={handleOpenImage}
                          className="absolute bottom-2 right-2 flex items-center gap-1 text-xs font-medium bg-white/80 backdrop-blur-sm p-2 rounded-md transition-colors"
                        >
                          <Unlink size={12} />
                          <span className="text-gray-700">View Full Image</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-between gap-2">
            <Button
              variant="outline"
              className="text-sm font-medium w-full px-4 py-2 rounded-md border-gray-300 text-gray-700 transition-colors hover:bg-gray-100"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              className="text-sm font-medium w-full px-4 py-2 rounded-md border-[#161CCA] text-[#161CCA] transition-colors hover:bg-indigo-50"
              onClick={() => {
                onApprove(selectedRow);
              }}
            >
              <CheckCircle size={16} className="mr-2" /> Approve
            </Button>
            <Button
              variant="outline"
              className="text-sm font-medium w-full px-4 py-2 rounded-md border-red-500 text-red-500 transition-colors hover:bg-red-50"
              onClick={() => {
                onReject(selectedRow);
              }}
            >
              <Ban size={16} className="mr-2" /> Reject
            </Button>
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
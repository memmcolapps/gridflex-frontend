"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MoveRight, UnlinkIcon } from "lucide-react";
import Image from "next/image";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; // Import VisuallyHidden
import type { Meter } from "@/types/review-approval";
import { useAuth } from "@/context/auth-context";
import { useState } from "react"; // Keep this import
import { useEffect } from "react"; // Added useEffect to reset state for better UX

interface ViewMeterDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRow: Meter | null;
  onApprove: (item: Meter | null) => void;
  onReject: (item: Meter | null) => void;
}

const ViewMeterDetailsDialog: React.FC<ViewMeterDetailsDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedRow,
  onApprove,
  onReject,
}) => {
  const { user } = useAuth();

  const [showDetails, setShowDetails] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  useEffect(() => {
    if (isOpen || selectedRow) {
      setShowDetails(false);
    }
  }, [isOpen, selectedRow]);

  const isMeterAllocated = selectedRow?.description === "Meter Allocated";
  const isMeterAssigned = selectedRow?.description === "Meter Assigned";
  const isMeterDeactivated = selectedRow?.description === "Meter Deactivated";
  const isMeterActivated = selectedRow?.description === "Meter Activated";
  const isMeterDetached = selectedRow?.description === "Meter detached";
  const isMeterMigrated = selectedRow?.description === "Meter Migrated";
  const isNewlyAdded = selectedRow?.description === "Newly added";
  const isMeterEdited = selectedRow?.description === "Meter edited";

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
            <DialogTitle className="truncate text-left text-base font-semibold text-gray-900 sm:text-lg">
              Meter Allocated
            </DialogTitle>
            <span className="text-sm text-gray-500 sm:text-base">
              Operator:{" "}
              {user?.business?.businessName?.toUpperCase() ?? "BUSINESS NAME"}
            </span>
          </DialogHeader>

          <div className="flex w-150 flex-col gap-3 py-4 sm:py-6">
            <div className="flex items-center gap-4 p-2">
              <div className="flex-1 text-sm font-bold text-gray-900 sm:text-base">
                {selectedRow.meterNumber}
              </div>
              <div className="flex flex-1 items-center gap-2 text-sm font-bold text-gray-900 sm:text-base">
                <MoveRight
                  className="mr-2 scale-x-185 text-gray-900"
                  size={16}
                />
                <span>{selectedRow.nodeInfo?.name}</span>
              </div>
            </div>

            {/* Details Toggle Button */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="cursor-pointer pl-2 text-left text-sm text-[#161CCA]"
            >
              Details
            </button>

            {/* Expanded Details */}
            {showDetails && (
              <div className="animate-fadeIn pl-1 text-sm text-gray-700">
                <div className="flex items-center gap-4 p-2">
                  <div className="flex-1 text-sm font-bold text-gray-900 sm:text-base">
                    <span className="font-medium">Business Hub ID:</span>
                  </div>
                  <div className="flex flex-1 items-center gap-2 text-sm font-bold text-gray-900 sm:text-base">
                    <span>{selectedRow.nodeInfo?.regionId ?? "N/A"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-2">
                  <div className="flex-1 text-sm font-bold text-gray-900 sm:text-base">
                    <span className="font-medium">Meter Manufacturer:</span>
                  </div>
                  <div className="flex flex-1 items-center gap-2 text-sm font-bold text-gray-900 sm:text-base">
                    <span>{selectedRow.manufacturer?.name ?? "N/A"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-2">
                  <div className="flex-1 text-sm font-bold text-gray-900 sm:text-base">
                    <span className="font-medium">Meter Class:</span>
                  </div>
                  <div className="flex flex-1 items-center gap-2 text-sm font-bold text-gray-900 sm:text-base">
                    <span>{selectedRow.meterClass}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-2">
                  <div className="flex-1 text-sm font-bold text-gray-900 sm:text-base">
                    <span className="font-medium">Meter Type:</span>
                  </div>
                  <div className="flex flex-1 items-center gap-2 text-sm font-bold text-gray-900 sm:text-base">
                    <span>{selectedRow.meterType}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-2">
                  <div className="flex-1 text-sm font-bold text-gray-900 sm:text-base">
                    <span className="font-medium">Meter Category:</span>
                  </div>
                  <div className="flex flex-1 items-center gap-2 text-sm font-bold text-gray-900 sm:text-base">
                    <span>{selectedRow.meterCategory}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      );
    }

    if (isMeterAssigned) {
      return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className="h-fit w-fit overflow-hidden rounded-lg bg-white p-4 text-black shadow-lg sm:p-6 lg:max-w-[1200px]">
            {isImageDialogOpen ? (
              <div className="flex h-fit w-full flex-col items-center justify-center">
                <div
                  className="absolute top-4 left-4 ml-2 flex cursor-pointer items-center gap-2 text-base font-light text-gray-600 sm:text-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Returning to details view");
                    setIsImageDialogOpen(false);
                  }}
                >
                  <MoveRight className="rotate-180" size={16} />
                  <span>Back</span>
                </div>
                <div className="mt-8 rounded-b-full">
                  <Image
                    src="/images/mdj.jpg"
                    alt="Full Meter Image"
                    width={280}
                    height={200}
                    className="h-fit max-h-screen w-fit object-contain"
                  />
                </div>
              </div>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle className="truncate text-left text-base font-semibold text-gray-900 sm:text-lg">
                    Meter Assigned
                  </DialogTitle>
                  <span className="text-sm text-gray-500 sm:text-base">
                    Operator:{" "}
                    {user?.business?.businessName?.toUpperCase() ??
                      "BUSINESS NAME"}
                  </span>
                </DialogHeader>
                <div className="flex h-fit w-150 flex-col gap-3 py-4 sm:py-6">
                  <div className="flex items-center gap-4 p-2">
                    <div className="flex-1 text-sm font-bold text-gray-900 sm:text-base">
                      {selectedRow.meterNumber}
                    </div>
                    <div className="flex flex-1 items-center gap-2 text-sm font-bold text-gray-900 sm:text-base">
                      <MoveRight
                        className="mr-2 scale-x-185 text-gray-900"
                        size={16}
                      />
                      <span>{selectedRow.customer.customerId}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="cursor-pointer pl-2 text-left text-sm text-[#161CCA]"
                  >
                    Details
                  </button>
                  {showDetails && (
                    <div className="animate-fadeIn space-y-2 pl-1 text-sm text-gray-700">
                      <div className="flex items-center gap-4 p-2">
                        <div className="flex-1 font-bold text-gray-900">
                          <span className="font-medium">Customer Name:</span>
                        </div>
                        <div className="flex-1 font-bold text-gray-900">
                          {selectedRow.customer
                            ? `${selectedRow.customer.firstname} ${selectedRow.customer.lastname}`
                            : "N/A"}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-2">
                        <div className="flex-1 font-bold text-gray-900">
                          <span className="font-medium">Phone Number:</span>
                        </div>
                        <div className="flex-1 font-bold text-gray-900">
                          {selectedRow.customer.phoneNumber ?? "N/A"}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-2">
                        <div className="flex-1 font-bold text-gray-900">
                          <span className="font-medium">Address:</span>
                        </div>
                        <div className="flex-1 font-bold text-gray-900">
                          {selectedRow.customer
                            ? `${selectedRow.customer.houseNo} ${selectedRow.customer.streetName}`
                            : "N/A"}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-2">
                        <div className="flex-1 font-bold text-gray-900">
                          <span className="font-medium">
                            Meter Manufacturer:
                          </span>
                        </div>
                        <div className="flex-1 font-bold text-gray-900">
                          {selectedRow.manufacturer?.name ?? "N/A"}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-2">
                        <div className="flex-1 font-bold text-gray-900">
                          <span className="font-medium">Meter Class:</span>
                        </div>
                        <div className="flex-1 font-bold text-gray-900">
                          {selectedRow.meterClass ?? "N/A"}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-2">
                        <div className="flex-1 font-bold text-gray-900">
                          <span className="font-medium">Meter Type:</span>
                        </div>
                        <div className="flex-1 font-bold text-gray-900">
                          {selectedRow.meterType ?? "N/A"}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-2">
                        <div className="flex-1 font-bold text-gray-900">
                          <span className="font-medium">Meter Category:</span>
                        </div>
                        <div className="flex-1 font-bold text-gray-900">
                          {selectedRow.meterCategory ?? "N/A"}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-2">
                        <div className="flex-1 font-bold text-gray-900">
                          <span className="font-medium">Service Address:</span>
                        </div>
                        <div className="flex-1 font-bold text-gray-900">
                          {selectedRow.meterAssignLocation
                            ? `${selectedRow.meterAssignLocation.houseNo} ${selectedRow.meterAssignLocation.streetName}`
                            : "N/A"}
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-2">
                        <div className="flex-1 font-bold text-gray-900">
                          <span className="font-medium">Uploaded Image:</span>
                        </div>
                        <div className="flex-1 font-bold text-gray-900">
                          <Image
                            src="/images/mdj.jpg"
                            alt={selectedRow.customerName ?? "Meter Image"}
                            className="h-[150px] w-[200px] cursor-pointer rounded-md object-cover transition hover:opacity-90"
                            width={150}
                            height={150}
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Switching to full image view");
                              setIsImageDialogOpen(true);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex justify-between gap-2">
                  <Button
                    onClick={() => selectedRow && onReject(selectedRow)}
                    variant="outline"
                    className="w-full rounded-md border-red-500 bg-white px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 focus:ring-red-500/0 sm:w-auto sm:px-4 sm:py-2 sm:text-base"
                    disabled={!selectedRow}
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => selectedRow && onApprove(selectedRow)}
                    variant="default"
                    className="w-full rounded-md bg-[#22C55E] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1ea34d] sm:w-auto sm:px-4 sm:py-2 sm:text-base"
                    disabled={!selectedRow}
                  >
                    Approve
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      );
    }
    if (isMeterDeactivated) {
      return (
        <>
          <DialogHeader>
            <DialogTitle className="truncate text-left text-base font-semibold text-gray-900 sm:text-lg">
              Meter Deactivated
            </DialogTitle>
            <span className="text-sm text-gray-500 sm:text-base">
              Operator:{" "}
              {user?.business?.businessName?.toUpperCase() ?? "BUSINESS NAME"}
            </span>
          </DialogHeader>
          <div className="flex w-[405px] flex-col gap-3 py-4 sm:py-6">
            {[
              { label: "Meter Number:", value: selectedRow.meterNumber },
              { label: "SIM No.:", value: selectedRow.simNumber },
              { label: "Meter Type:", value: selectedRow.meterType },
              {
                label: "Meter Manufacturer:",
                value: selectedRow.oldMeterInfo.manufacturer?.name ?? "N/A",
              },
              { label: "Meter Class:", value: selectedRow.meterClass },
              { label: "Meter Category:", value: selectedRow.meterCategory },
              { label: "Old SGC:", value: selectedRow.oldSgc },
              { label: "New SGC:", value: selectedRow.newSgc },
              { label: "Old KRN:", value: selectedRow.oldKrn },
              { label: "New KRN:", value: selectedRow.newKrn },
              { label: "Old Tariff Index:", value: selectedRow.oldTariffIndex },
              { label: "New Tariff Index:", value: selectedRow.newTariffIndex },
              { label: "Reason:", value: selectedRow.reason },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center whitespace-nowrap">
                <div className="w-[120px] text-sm font-medium whitespace-nowrap text-gray-700 sm:text-base">
                  {label}
                </div>
                <div className="ml-30 text-sm font-bold text-gray-900 sm:text-base">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </>
      );
    }

    if (isMeterActivated) {
      return (
        <>
          <DialogHeader>
            <DialogTitle className="truncate text-left text-base font-semibold text-gray-900 sm:text-lg">
              Meter Activated
            </DialogTitle>
            <span className="text-sm text-gray-500 sm:text-base">
              Operator:{" "}
              {user?.business?.businessName?.toUpperCase() ?? "BUSINESS NAME"}
            </span>
          </DialogHeader>
          <div className="flex w-[405px] flex-col gap-3 py-4 sm:py-6">
            {[
              { label: "Meter Number:", value: selectedRow.meterNumber },
              { label: "SIM No.:", value: selectedRow.simNumber },
              { label: "Meter Type:", value: selectedRow.meterType },
              {
                label: "Meter Manufacturer:",
                value: selectedRow.oldMeterInfo.manufacturer?.name ?? "N/A",
              },
              { label: "Meter Class:", value: selectedRow.meterClass },
              { label: "Meter Category:", value: selectedRow.meterCategory },
              { label: "Old SGC:", value: selectedRow.oldSgc },
              { label: "New SGC:", value: selectedRow.newSgc },
              { label: "Old KRN:", value: selectedRow.oldKrn },
              { label: "New KRN:", value: selectedRow.newKrn },
              { label: "Old Tariff Index:", value: selectedRow.oldTariffIndex },
              { label: "New Tariff Index:", value: selectedRow.newTariffIndex },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center whitespace-nowrap">
                <div className="w-[120px] text-sm font-medium whitespace-nowrap text-gray-700 sm:text-base">
                  {label}
                </div>
                <div className="ml-30 text-sm font-bold text-gray-900 sm:text-base">
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
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className="h-fit w-fit overflow-hidden rounded-lg bg-white p-4 text-black shadow-lg sm:p-6 lg:max-w-[1200px]">
            <DialogHeader>
              <DialogTitle className="truncate text-left text-base font-semibold text-gray-900 sm:text-lg">
                Meter Detached
              </DialogTitle>
              <span className="text-sm text-gray-500 sm:text-base">
                Operator:{" "}
                {user?.business?.businessName?.toUpperCase() ?? "BUSINESS NAME"}
              </span>
            </DialogHeader>

            <div className="flex h-fit w-150 flex-col gap-3 py-4 sm:py-6">
              <div className="flex items-center gap-4 p-2">
                <div className="flex-1 text-sm font-bold text-gray-900 sm:text-base">
                  {selectedRow.oldMeterInfo.customer.customerId}
                </div>
                <div className="flex flex-1 items-center gap-2 text-sm font-bold text-gray-900 sm:text-base">
                  <UnlinkIcon className="mr-2 text-gray-900" size={18} />
                  <span>{selectedRow.meterNumber}</span>
                </div>
              </div>

              {/* Details Toggle Button */}
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="cursor-pointer pl-2 text-left text-sm text-[#161CCA]"
              >
                Details
              </button>

              {/* Expanded Details */}
              {showDetails && (
                <div className="animate-fadeIn space-y-2 pl-1 text-sm text-gray-700">
                  <div className="flex items-center gap-4 p-2">
                    <div className="flex-1 font-bold text-gray-900">
                      <span className="font-medium">Customer Name:</span>
                    </div>
                    <div className="flex-1 font-bold text-gray-900">
                      {selectedRow.oldMeterInfo.customer
                        ? `${selectedRow.oldMeterInfo.customer.firstname} ${selectedRow.oldMeterInfo.customer.lastname}`
                        : "N/A"}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-2">
                    <div className="flex-1 font-bold text-gray-900">
                      <span className="font-medium">Phone Number:</span>
                    </div>
                    <div className="flex-1 font-bold text-gray-900">
                      {selectedRow.oldMeterInfo.customer?.phoneNumber ??
                        "08080287025"}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-2">
                    <div className="flex-1 font-bold text-gray-900">
                      <span className="font-medium">Address:</span>
                    </div>
                    <div className="flex-1 font-bold text-gray-900">
                      {selectedRow.oldMeterInfo.customer
                        ? `${selectedRow.oldMeterInfo.customer.houseNo} ${selectedRow.oldMeterInfo.customer.streetName}`
                        : "N/A"}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-2">
                    <div className="flex-1 font-bold text-gray-900">
                      <span className="font-medium">Meter Manufacturer:</span>
                    </div>
                    <div className="flex-1 font-bold text-gray-900">
                      {selectedRow.oldMeterInfo.manufacturer?.name ?? "Momas"}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-2">
                    <div className="flex-1 font-bold text-gray-900">
                      <span className="font-medium">Meter Class:</span>
                    </div>
                    <div className="flex-1 font-bold text-gray-900">
                      {selectedRow.meterClass ?? "Three Phase"}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-2">
                    <div className="flex-1 font-bold text-gray-900">
                      <span className="font-medium">Meter Type:</span>
                    </div>
                    <div className="flex-1 font-bold text-gray-900">
                      {selectedRow.meterType ?? "Electricity"}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-2">
                    <div className="flex-1 font-bold text-gray-900">
                      <span className="font-medium">Meter Category:</span>
                    </div>
                    <div className="flex-1 font-bold text-gray-900">
                      {selectedRow.meterCategory ?? "Prepaid"}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-2">
                    <div className="flex-1 font-bold text-gray-900">
                      <span className="font-medium">Service Address:</span>
                    </div>
                    <div className="flex-1 font-bold text-gray-900">
                      {selectedRow.oldMeterInfo.meterAssignLocation
                        ? `${selectedRow.oldMeterInfo.meterAssignLocation.houseNo} ${selectedRow.oldMeterInfo.meterAssignLocation.streetName}`
                        : "N/A"}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-2">
                    <div className="flex-1 font-bold text-gray-900">
                      <span className="font-medium">Reason:</span>
                    </div>
                    <div className="flex-1 font-bold text-gray-900">
                      {selectedRow.reason ?? "Burnt"}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-between gap-2">
              <Button
                onClick={() => selectedRow && onReject(selectedRow)}
                variant="outline"
                className="w-full rounded-md border-red-500 bg-white px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 focus:ring-red-500/0 sm:w-auto sm:px-4 sm:py-2 sm:text-base"
                disabled={!selectedRow}
              >
                Reject
              </Button>
              <Button
                onClick={() => selectedRow && onApprove(selectedRow)}
                variant="default"
                className="w-full rounded-md bg-[#22C55E] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1ea34d] sm:w-auto sm:px-4 sm:py-2 sm:text-base"
                disabled={!selectedRow}
              >
                Approve
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      );
    }

    if (isMeterMigrated) {
      const newCategory =
        selectedRow.meterCategory === "Postpaid"
          ? "Prepaid"
          : selectedRow.meterCategory === "Prepaid"
            ? "Postpaid"
            : "N/A";

      return (
        <>
          <DialogHeader>
            <DialogTitle className="truncate text-left text-base font-semibold text-gray-900 sm:text-lg">
              Meter Migrated
            </DialogTitle>
            <span className="text-sm text-gray-500 sm:text-base">
              Operator:{" "}
              {user?.business?.businessName?.toUpperCase() ?? "BUSINESS NAME"}
            </span>
          </DialogHeader>

          <div className="flex w-150 flex-col gap-4 py-4 sm:py-6">
            {/* Header Row */}
            <div className="flex items-start gap-4 p-2">
              <div className="flex-1" /> {/* Empty space to align */}
              <div className="flex-1 text-left text-sm font-medium text-gray-700 sm:text-base">
                From
              </div>
              <div className="flex-1 text-left text-sm font-medium text-gray-700 sm:text-base">
                To
              </div>
            </div>

            {/* Data Row */}
            <div className="flex items-center gap-4 p-2">
              <div className="flex-1 text-sm text-black sm:text-base">
                {selectedRow.meterNumber}:
              </div>
              <div className="flex-1 text-sm font-bold text-gray-900 sm:text-base">
                {selectedRow.meterCategory ?? "N/A"}
              </div>
              <div className="flex flex-1 items-center gap-2 text-sm font-bold text-gray-900 sm:text-base">
                <MoveRight
                  className="mr-1 scale-x-125 text-gray-900"
                  size={16}
                />
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
            <DialogTitle className="truncate text-left text-base font-semibold text-gray-900 sm:text-lg">
              Newly Added
            </DialogTitle>
            <span className="text-sm text-gray-500 sm:text-base">
              Operator:{" "}
              {user?.business?.businessName?.toUpperCase() ?? "BUSINESS NAME"}
            </span>
          </DialogHeader>
          <div className="flex w-[405px] flex-col gap-3 py-4 sm:py-6">
            {[
              { label: "Meter Number:", value: selectedRow.meterNumber },
              { label: "SIM No:", value: selectedRow.simNumber },
              { label: "Meter Type:", value: selectedRow.meterType },
              {
                label: "Meter Manufacturer:",
                value: selectedRow.manufacturer?.name,
              },
              { label: "Meter Class:", value: selectedRow.meterClass },
              { label: "Meter Category:", value: selectedRow.meterCategory },
              { label: "Old SGC:", value: selectedRow.oldSgc },
              { label: "New SGC:", value: selectedRow.newSgc },
              { label: "Old KRN:", value: selectedRow.oldKrn },
              { label: "New KRN:", value: selectedRow.newKrn },
              { label: "Old Tariff Index:", value: selectedRow.oldTariffIndex },
              { label: "New Tariff Index:", value: selectedRow.newTariffIndex },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center">
                <div className="w-[120px] text-sm font-medium whitespace-nowrap text-gray-700 sm:text-base">
                  {label}
                </div>
                <div className="ml-20 text-sm font-bold text-gray-900 sm:text-base">
                  {value ?? "N/A"}
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
            <DialogTitle className="truncate text-left text-base font-semibold text-gray-900 sm:text-lg">
              Meter Edited
            </DialogTitle>
            <span className="text-sm text-gray-500 sm:text-base">
              Operator:{" "}
              {user?.business?.businessName?.toUpperCase() ?? "BUSINESS NAME"}
            </span>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-4 sm:py-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <div className="w-[100px] text-sm font-medium whitespace-nowrap text-gray-700 sm:w-[120px] sm:text-base">
                {/* Empty header for label column */}
              </div>
              <div className="ml-20 w-full text-sm font-medium whitespace-nowrap text-gray-700 sm:w-[120px] sm:text-base lg:max-w-[700px]">
                From
              </div>
              <div className="ml-10 flex items-start text-sm font-medium whitespace-nowrap text-gray-700 sm:text-base">
                To
              </div>
            </div>
            {[
              {
                label: "Meter No:",
                oldValue: selectedRow.oldMeterInfo.meterNumber,
                newValue: selectedRow.meterNumber,
              },
              {
                label: "SIM Number:",
                oldValue: selectedRow.oldMeterInfo.simNumber,
                newValue: selectedRow.simNumber,
              },
              {
                label: "Meter Type:",
                oldValue: selectedRow.oldMeterInfo.meterType,
                newValue: selectedRow.meterType,
              },
              {
                label: "Meter Manufacturer:",
                oldValue: selectedRow.oldMeterInfo.manufacturer?.name ?? "N/A",
                newValue: selectedRow.manufacturer?.name ?? "N/A",
              },
              {
                label: "Meter Class:",
                oldValue: selectedRow.oldMeterInfo.meterClass,
                newValue: selectedRow.meterClass,
              },
              {
                label: "Meter Category:",
                oldValue: selectedRow.oldMeterInfo.meterCategory,
                newValue: selectedRow.meterCategory,
              },
              {
                label: "Old SGC:",
                oldValue: selectedRow.oldMeterInfo.oldSgc,
                newValue: selectedRow.oldSgc,
              },
              {
                label: "New SGC:",
                oldValue: selectedRow.oldMeterInfo.newSgc,
                newValue: selectedRow.newSgc,
              },
              {
                label: "Old KRN:",
                oldValue: selectedRow.oldMeterInfo.oldKrn,
                newValue: selectedRow.oldKrn,
              },
              {
                label: "New KRN:",
                oldValue: selectedRow.oldMeterInfo.newKrn,
                newValue: selectedRow.newKrn,
              },
              {
                label: "Old Tariff Index:",
                oldValue: selectedRow.oldMeterInfo.oldTariffIndex,
                newValue: selectedRow.oldTariffIndex,
              },
              {
                label: "New Tariff Index:",
                oldValue: selectedRow.oldMeterInfo.newTariffIndex,
                newValue: selectedRow.newTariffIndex,
              },
            ].map(({ label, oldValue, newValue }) => (
              <div
                key={label}
                className="flex flex-col items-start gap-4 sm:flex-row sm:items-center"
              >
                <div className="w-[100px] text-sm font-medium whitespace-nowrap text-gray-700 sm:w-[120px] sm:text-base">
                  {label}
                </div>
                <div className="ml-20 w-full text-sm font-bold whitespace-nowrap text-gray-900 sm:w-[120px] sm:text-base lg:max-w-[700px]">
                  {oldValue ?? "N/A"}
                </div>
                {newValue && (
                  <div className="ml-10 flex items-start text-sm whitespace-nowrap text-gray-900 sm:text-base">
                    <MoveRight
                      className="mr-4 scale-x-185 text-gray-900"
                      size={16}
                    />
                    <span className="truncate font-bold">{newValue}</span>
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
      <DialogContent className="h-fit w-fit overflow-hidden rounded-lg bg-white p-4 text-black shadow-lg sm:p-6 lg:max-w-[1200px]">
        <div className="w-full">
          {renderContent()}
          <div className="mt-4 flex justify-between gap-2">
            <Button
              onClick={() => selectedRow && onReject(selectedRow)}
              variant="outline"
              className="w-full rounded-md border-red-500 bg-white px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 focus:ring-red-500/0 sm:w-auto sm:px-4 sm:py-2 sm:text-base"
              disabled={!selectedRow}
            >
              Reject
            </Button>
            <Button
              onClick={() => selectedRow && onApprove(selectedRow)}
              variant="default"
              className="w-full rounded-md bg-[#22C55E] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1ea34d] sm:w-auto sm:px-4 sm:py-2 sm:text-base"
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

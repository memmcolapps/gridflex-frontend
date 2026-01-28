"use client";
import { useState } from "react";
import { PlusCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomerForm from "./customerform";
import CustomerTable from "./customer-table";
import ViewCustomerDialog from "./view-customer-dialog";
import BlockCustomerDialog from "./block-customer-dialog";
import MeterDetailsDialog from "./meter-details-dialog";
import { ContentHeader } from "@/components/ui/content-header";
import { BulkUploadDialog } from "@/components/meter-management/bulk-upload";
import { useBulkUploadCustomer, useDownloadCustomerCsvTemplate, useDownloadCustomerExcelTemplate } from "@/hooks/use-customer";
import { type Customer } from "@/types/customer-types";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/use-permissions";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export default function CustomerManagement() {
    const { canEdit } = usePermissions();
    const bulkUploadMutation = useBulkUploadCustomer();
    const downloadCsvTemplateMutation = useDownloadCustomerCsvTemplate();
    const downloadExcelTemplateMutation = useDownloadCustomerExcelTemplate();

    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
    const [isConfirmBlockDialogOpen, setIsConfirmBlockDialogOpen] = useState(false);
    const [customerToBlock, setCustomerToBlock] = useState<Customer | null>(null);
    const [blockReason, setBlockReason] = useState("");
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isMeterDialogOpen, setIsMeterDialogOpen] = useState(false);
    const [selectedMeterCustomer, setSelectedMeterCustomer] = useState<Customer | null>(null);
    const [isBulkUploadDialogOpen, setIsBulkUploadDialogOpen] = useState(false);
    const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false);
    const [isUploadResultDialogOpen, setIsUploadResultDialogOpen] = useState(false);
    const [uploadResult, setUploadResult] = useState<{
        successCount: number;
        failedCount: number;
        totalRecords: number;
        failedRecords: string[];
    } | null>(null);

    const handleBlockCustomer = (customer: Customer) => {
        setCustomerToBlock(customer);
        setIsBlockDialogOpen(true);
    };

    const handleViewMeter = (customer: Customer) => {
        setSelectedMeterCustomer(customer);
        setIsMeterDialogOpen(true);
    };
    
    const handleViewCustomer = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsViewDialogOpen(true);
    };

    const confirmBlockCustomer = () => {
        if (customerToBlock && blockReason) {
            setIsConfirmBlockDialogOpen(false);
            setIsBlockDialogOpen(false);
            setCustomerToBlock(null);
            setBlockReason("");
        }
    };

    const handleBulkUpload = (data: unknown) => {
        if (data instanceof File) {
            bulkUploadMutation.mutate(data, {
                onSuccess: (response: unknown) => {
                    const res = response as {
                        responsecode: string;
                        responsedesc: string;
                        responsedata: {
                            totalRecords: number;
                            failedCount: number;
                            failedRecords: string[];
                            successCount: number;
                        };
                    };

                    setIsBulkUploadDialogOpen(false);
                    setIsTemplateDropdownOpen(false);

                    // Store result for detailed dialog
                    setUploadResult(res.responsedata);
                    setIsUploadResultDialogOpen(true);

                    // Show brief success toast if any succeeded
                    if (res.responsedata.successCount > 0) {
                        toast.success(`${res.responsedata.successCount} of ${res.responsedata.totalRecords} customers uploaded successfully!`);
                    }
                },
                onError: (error) => {
                    console.error("Bulk upload failed:", error);
                    const err = error as { message?: string };
                    toast.error(err?.message ?? "Bulk upload failed");
                    setIsBulkUploadDialogOpen(false);
                    setIsTemplateDropdownOpen(false);
                },
            });
        } else {
            setIsBulkUploadDialogOpen(false);
            setIsTemplateDropdownOpen(false);
        }
    };

    const handleDownloadCsvTemplate = () => {
        downloadCsvTemplateMutation.mutate(undefined, {
            onSuccess: () => {
                toast.success("CSV template downloaded successfully");
            },
            onError: (error: unknown) => {
                const err = error as { message?: string };
                console.error("CSV template download failed:", error);
                toast.error(err?.message ?? "Failed to download CSV template");
            },
        });
    };

    const handleDownloadExcelTemplate = () => {
        downloadExcelTemplateMutation.mutate(undefined, {
            onSuccess: () => {
                toast.success("Excel template downloaded successfully");
            },
            onError: (error: unknown) => {
                const err = error as { message?: string };
                console.error("Excel template download failed:", error);
                toast.error(err?.message ?? "Failed to download Excel template");
            },
        });
    };

    return (
        <div className="h-full overflow-hidden flex flex-col text-black">
            <div className="flex-grow">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <ContentHeader
                        title="Customer Management"
                        description="Manage And Access Customer Records"
                    />
                    {canEdit && (
                        <div className="flex gap-4">
                            <Button
                                onClick={() => setIsBulkUploadDialogOpen(true)}
                                variant="outline"
                                size={"lg"}
                                className="border-[#161CCA] text-[#161CCA] cursor-pointer py-4"
                            >
                                <div className="flex items-center justify-center p-0.5">
                                    <PlusCircleIcon className="text-[#161CCA]" size={12} />
                                </div>
                                <span>Bulk Upload New Customer</span>
                            </Button>
                            <CustomerForm
                                mode="add"
                                // eslint-disable-next-line @typescript-eslint/no-empty-function
                                onSave={() => {}}
                                triggerButton={
                                    <Button
                                    size={"lg"}
                                    className="flex items-center gap-2 bg-[#161CCA] hover:bg-[#121eb3] cursor-pointer py-4">
                                        <div className="flex items-center justify-center p-0.5">
                                            <PlusCircleIcon className="text-[#FEFEFE]" size={12} />
                                        </div>
                                        <span className="text-white">Add New Customer</span>
                                    </Button>
                                }
                            />
                        </div>
                    )}
                </div>

                <CustomerTable
                    // The following props are no longer needed as the table manages its own state
                    // searchTerm={searchTerm}
                    // setSearchTerm={setSearchTerm}
                    // selectedCustomers={selectedCustomers}
                    // setSelectedCustomers={setSelectedCustomers}
                    onEditCustomer={(customer) => {
                        setEditingCustomer(customer);
                        setIsEditDialogOpen(true);
                    }}
                    onViewCustomer={handleViewCustomer}
                    onViewMeter={handleViewMeter}
                    onBlockCustomer={handleBlockCustomer}
                />

                {editingCustomer && (
                    <CustomerForm
                        mode="edit"
                        customer={editingCustomer}
                        isOpen={isEditDialogOpen}
                        onSave={() => {
                            setIsEditDialogOpen(false);
                            setEditingCustomer(null);
                        }}
                        onClose={() => {
                            setIsEditDialogOpen(false);
                            setEditingCustomer(null);
                        }}
                    />
                )}

                <ViewCustomerDialog
                    isOpen={isViewDialogOpen}
                    onOpenChange={setIsViewDialogOpen}
                    customer={selectedCustomer}
                />

                <BlockCustomerDialog
                    isBlockOpen={isBlockDialogOpen}
                    setIsBlockOpen={setIsBlockDialogOpen}
                    isConfirmBlockOpen={isConfirmBlockDialogOpen}
                    setIsConfirmBlockOpen={setIsConfirmBlockDialogOpen}
                    customer={customerToBlock}
                    blockReason={blockReason}
                    setBlockReason={setBlockReason}
                    onConfirmBlock={confirmBlockCustomer}
                />

                <MeterDetailsDialog
                    isOpen={isMeterDialogOpen}
                    onOpenChange={setIsMeterDialogOpen}
                    customer={selectedMeterCustomer}
                />

                <BulkUploadDialog
                    isOpen={isBulkUploadDialogOpen}
                    onClose={() => setIsBulkUploadDialogOpen(false)}
                    onSave={handleBulkUpload}
                    title="Bulk Upload Customers"
                    sendRawFile={true}
                    templateUrl="#"
                    onTemplateClick={() => {
                        setIsBulkUploadDialogOpen(false);
                        setIsTemplateDropdownOpen(true);
                    }}
                />

                {/* Template Selection Dialog */}
                <Dialog open={isTemplateDropdownOpen} onOpenChange={(open) => {
                    setIsTemplateDropdownOpen(open);
                    if (!open) {
                        // Close all other dialogs when template dialog closes
                        setIsBulkUploadDialogOpen(false);
                        setIsEditDialogOpen(false);
                        setIsBlockDialogOpen(false);
                        setIsConfirmBlockDialogOpen(false);
                        setIsViewDialogOpen(false);
                        setIsMeterDialogOpen(false);
                    }
                }}>
                    <DialogContent className="max-w-sm bg-white h-fit">
                        <DialogHeader>
                            <DialogTitle>Select Template Format</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3">
                            <Button
                                onClick={() => {
                                    handleDownloadCsvTemplate();
                                    setIsTemplateDropdownOpen(false);
                                }}
                                className="w-full bg-[#161CCA] hover:bg-[#121eb3] text-white"
                                disabled={downloadCsvTemplateMutation.isPending}
                            >
                                {downloadCsvTemplateMutation.isPending ? "Downloading..." : "Download CSV Template"}
                            </Button>
                            <Button
                                onClick={() => {
                                    handleDownloadExcelTemplate();
                                    setIsTemplateDropdownOpen(false);
                                }}
                                variant="outline"
                                className="w-full border-[#161CCA] text-[#161CCA] hover:bg-[#161CCA] hover:text-white"
                                disabled={downloadExcelTemplateMutation.isPending}
                            >
                                {downloadExcelTemplateMutation.isPending ? "Downloading..." : "Download Excel Template"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Upload Result Dialog */}
                {uploadResult && (
                    <AlertDialog open={isUploadResultDialogOpen} onOpenChange={setIsUploadResultDialogOpen}>
                        <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2">
                                    {uploadResult.successCount === uploadResult.totalRecords ? (
                                        <>
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                            Bulk Upload Completed Successfully
                                        </>
                                    ) : uploadResult.successCount === 0 ? (
                                        <>
                                            <XCircle className="h-5 w-5 text-red-500" />
                                            Bulk Upload Failed
                                        </>
                                    ) : (
                                        <>
                                            <AlertTriangle className="h-5 w-5 text-yellow-500" />
                                            Bulk Upload Completed with Issues
                                        </>
                                    )}
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-left">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-gray-900">{uploadResult.totalRecords}</div>
                                                <div className="text-sm text-gray-600">Total Records</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-green-600">{uploadResult.successCount}</div>
                                                <div className="text-sm text-gray-600">Successful</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-red-600">{uploadResult.failedCount}</div>
                                                <div className="text-sm text-gray-600">Failed</div>
                                            </div>
                                        </div>

                                        {uploadResult.successCount > 0 && (
                                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                                <div className="flex items-center gap-2 text-green-800">
                                                    <CheckCircle className="h-4 w-4" />
                                                    <span className="font-medium">Success</span>
                                                </div>
                                                <p className="text-sm text-green-700 mt-1">
                                                    {uploadResult.successCount} customer{uploadResult.successCount !== 1 ? 's' : ''} uploaded successfully.
                                                </p>
                                            </div>
                                        )}

                                        {uploadResult.failedCount > 0 && (
                                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                                <div className="flex items-center gap-2 text-red-800">
                                                    <XCircle className="h-4 w-4" />
                                                    <span className="font-medium">Failed Records</span>
                                                </div>
                                                <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                                                    {uploadResult.failedRecords.map((record, index) => (
                                                        <div key={index} className="text-sm text-red-700 bg-red-100 p-2 rounded border-l-4 border-red-400">
                                                            {record}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <Button
                                    onClick={() => {
                                        setIsUploadResultDialogOpen(false);
                                        setUploadResult(null);
                                    }}
                                    className="bg-[#161CCA] hover:bg-[#121eb3] text-white"
                                >
                                    Close
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>
        </div>
    );
}
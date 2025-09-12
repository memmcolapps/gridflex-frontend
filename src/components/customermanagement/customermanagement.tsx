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
import { type Customer } from "@/types/customer-types";

export default function CustomerManagement() {

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

    const handleBulkUpload = (_data: unknown) => {
        setIsBulkUploadDialogOpen(false);
    };

    return (
        <div className="h-full overflow-hidden flex flex-col text-black">
            <div className="flex-grow">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <ContentHeader
                        title="Customer Management"
                        description="Manage And Access Customer Records"
                    />
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
                            <span>Bulk Upload</span>
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
                    title="Bulk Upload readings"
                    requiredColumns={[
                        "Customer ID",
                        "First Name",
                        "Last Name",
                        "Phone Number",
                        "Address",
                        "City",
                        "State",
                        "Operator",
                    ]}
                    templateUrl="/templates/readingSheet-template.xlsx"
                />
            </div>
        </div>
    );
}
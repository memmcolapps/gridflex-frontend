"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { type Customer } from "@/types/customer-types";

interface ViewCustomerDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    customer: Customer | null;
}

export default function ViewCustomerDialog({ isOpen, onOpenChange, customer }: ViewCustomerDialogProps) {
    if (!customer) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white w-full h-fit p-6 rounded-lg border border-gray-200 max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">View Details</DialogTitle>
                    <DialogClose className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer ring-gray-50" />
                </DialogHeader>
                <div className="mt-4 space-y-4">
                    {[
                        { label: "First Name", value: customer.firstname },
                        { label: "Last Name", value: customer.lastname },
                        {
                            label: "Phone Number",
                            value: (() => {
                                const phone = customer.phoneNumber ?? "";
                                if (phone.startsWith("+")) return phone;
                                let formatted = phone;
                                if (formatted.startsWith("0")) {
                                    formatted = formatted.slice(1);
                                }
                                return `(+234) ${formatted}`;
                            })(),
                        },
                        { label: "NIN", value: customer.nin },
                        { label: "Email Address", value: customer.email },
                        { label: "State", value: customer.state },
                        { label: "City", value: customer.city },
                        { label: "Street Name", value: customer.streetName },
                        { label: "House Number", value: customer.houseNo },
                        { label: "Value Added Tax", value: customer.vat ?? "Not Paying" },
                    ].map((item, idx) => (
                        <div key={idx} className="flex flex-row items-center">
                            <Label className="text-sm font-medium text-gray-700 min-w-[160px]">{item.label}:</Label>
                            <p className="text-sm font-medium ml-6">{item.value}</p>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
// components/billing/payment-history/view-payment-details.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface PaymentHistoryData {
  id: number;
  sn: string;
  accountNumber: string;
  meterNumber: string;
  feeder: string;
  dss: string;
  paymentType: "Manual" | "API";
  transactionId: string;
  transactionDate: string;
  amount: number;
}

interface ViewPaymentDetailsProps {
  open: boolean;
  onClose: () => void;
  data: PaymentHistoryData;
}

export default function ViewPaymentDetails({
  open,
  onClose,
  data,
}: ViewPaymentDetailsProps) {
  // Format amount as currency
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "decimal",
      minimumFractionDigits: 3,
    }).format(amount);
  };

  // Calculate balance (this would typically come from your data)
  const calculateBalance = (amountPaid: number) => {
    // This is just a mock calculation - replace with your actual logic
    const totalBill = amountPaid + 5000; // Assuming there's still a balance
    return totalBill - amountPaid;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="h-fit w-full max-w-2xl bg-white p-6">
        <DialogHeader>
          <DialogTitle>View Details</DialogTitle>
        </DialogHeader>
        <div
          className="grid gap-4 py-4 text-sm"
          style={{ gridTemplateColumns: "1fr 1fr" }}
        >
          <Label className="whitespace-nowrap text-gray-600">
            Customer ID:
          </Label>
          <span className="font-semibold text-gray-900">C-123456890</span>

          <Label className="whitespace-nowrap text-gray-600">
            Customer Name:
          </Label>
          <span className="font-semibold text-gray-900">UGORJI EUCHARIA E</span>

          <Label className="whitespace-nowrap text-gray-600">
            Meter Number:
          </Label>
          <span className="font-semibold text-gray-900">
            {data.meterNumber}
          </span>

          <Label className="whitespace-nowrap text-gray-600">Account No:</Label>
          <span className="font-semibold text-gray-900">
            {data.accountNumber}
          </span>

          <Label className="whitespace-nowrap text-gray-600">Feeder:</Label>
          <span className="font-semibold text-gray-900">{data.feeder}</span>

          <Label className="whitespace-nowrap text-gray-600">DSS:</Label>
          <span className="font-semibold text-gray-900">{data.dss}</span>

          <Label className="whitespace-nowrap text-gray-600">
            Transaction ID:
          </Label>
          <span className="font-semibold text-gray-900">
            {data.transactionId}
          </span>

          <Label className="whitespace-nowrap text-gray-600">
            Transaction Date:
          </Label>
          <span className="font-semibold text-gray-900">
            {data.transactionDate}
          </span>

          <Label className="whitespace-nowrap text-gray-600">
            Amount Paid:
          </Label>
          <span className="font-semibold text-gray-900">
            {formatAmount(data.amount)}
          </span>

          <Label className="whitespace-nowrap text-gray-600">Balance:</Label>
          <span className="font-semibold text-gray-900">
            {formatAmount(calculateBalance(data.amount))}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ViewDetailsField {
  label: string;
  value: string | number;
  key: string;
}

interface ViewDetailsProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  fields: ViewDetailsField[];
}

export default function ViewDetails({
  open,
  onClose,
  title = "View Details",
  fields,
}: ViewDetailsProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="h-fit w-full max-w-md bg-white p-6">
        <DialogHeader className="flex flex-row items-center justify-between pb-4">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.key} className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-600">
                {field.label}:
              </label>
              <span className="text-sm font-medium text-gray-900">
                {field.value}
              </span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

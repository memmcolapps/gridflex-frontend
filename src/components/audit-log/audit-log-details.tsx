import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AuditLog } from "@/service/audit-log-service";

interface AuditLogDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: AuditLog | null;
}

export function AuditLogDetailsDialog({
  open,
  onOpenChange,
  entry,
}: AuditLogDetailsDialogProps) {
  if (!entry) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-fit w-full rounded-lg bg-white p-6 shadow-lg">
        <DialogHeader>
          <DialogTitle>Activity Detail</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 px-4 py-2">
          <div className="grid grid-cols-[150px_1fr] items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Username:</span>
            <span className="text-sm">{entry.username}</span>
          </div>

          <div className="grid grid-cols-[150px_1fr] items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Email:</span>
            <span className="text-sm">{entry.email}</span>
          </div>

          <div className="grid grid-cols-[150px_1fr] items-center gap-4">
            <span className="text-sm font-medium text-gray-500">
              Group Permission:
            </span>
            <span className="text-sm">{entry.groupPermission}</span>
          </div>

          <div className="grid grid-cols-[150px_1fr] items-center gap-4">
            <span className="text-sm font-medium text-gray-500">
              User Agent:
            </span>
            <span className="font-mono text-sm">{entry.userAgent}</span>
          </div>

          <div className="grid grid-cols-[150px_1fr] items-center gap-4">
            <span className="text-sm font-medium text-gray-500">
              IP Address:
            </span>
            <span className="text-sm">{entry.ipAddress}</span>
          </div>

          <div className="grid grid-cols-[150px_1fr] items-center gap-4">
            <span className="text-sm font-medium text-gray-500">
              Timestamp:
            </span>
            <span className="text-sm">
              {new Date(entry.timeStamp).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <div className="grid grid-cols-[150px_1fr] items-center gap-4">
            <span className="text-sm font-medium text-gray-500">
              Activity Description:
            </span>
            <span className="text-sm">{entry.type}</span>
          </div>
        </div>
        <div className="space-y-1 rounded-lg border border-gray-200 px-4 py-4">
          <p className="text-sm text-gray-600">{entry.activity}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

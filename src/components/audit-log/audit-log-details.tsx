
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface AuditLogEntry {
    username: string;
    email: string;
    group: string;
    activity: string;
    userAgent: string;
    ip: string;
    timestamp: string | number | Date;
}

interface AuditLogDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    entry: AuditLogEntry | null;
}

export function AuditLogDetailsDialog({
    open,
    onOpenChange,
    entry,
}: AuditLogDetailsDialogProps) {
    if (!entry) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full bg-white p-6 rounded-lg shadow-lg h-fit">
                <DialogHeader>
                    <DialogTitle>Activity Detail</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-2 px-4">
                    <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                        <span className="text-sm font-medium text-gray-500 ">Username:</span>
                        <span >{entry.username}</span>
                    </div>

                    <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                        <span className="text-sm font-medium text-gray-500">Email:</span>
                        <span className="">{entry.email}</span>
                    </div>

                    <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                        <span className="text-sm font-medium text-gray-500">Group Permission:</span>
                        <span className="">{entry.group}</span>
                    </div>

                    <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                        <span className="text-sm font-medium text-gray-500">User Agent:</span>
                        <span className=" text-sm font-mono">{entry.userAgent}</span>
                    </div>

                    <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                        <span className="text-sm font-medium text-gray-500">IP Address:</span>
                        <span className="">{entry.ip}</span>
                    </div>

                    <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                        <span className="text-sm font-medium text-gray-500">Timestamp:</span>
                        <span className="">
                            {new Date(entry.timestamp).toLocaleDateString('en-US', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>

                    <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                        <span className="text-sm font-medium text-gray-500">Activity Description:</span>
                        <span className="">{entry.activity}</span>
                    </div>
                </div>
                <div className="space-y-1 border border-gray-200 px-4 py-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                        Allocated meters (250) to Olowotedo Business Hub
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
"use client";
import { AuditLog } from "@/components/audit-log/audit-log";



export default function AuditLogPage() {
    return (
        <div className="p-6 flex flex-col gap-4">
            <AuditLog />
        </div>
    );
}
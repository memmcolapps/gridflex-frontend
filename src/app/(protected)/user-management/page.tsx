"use client";

import UserManagement from "@/components/usermanagement/usermanagement";

export default function UserPage() {
  return (
    <div className="flex h-screen w-full flex-col overflow-y-hidden p-6">
      <UserManagement />
    </div>
  );
}

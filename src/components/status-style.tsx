import { Disc } from "lucide-react";

export const statusStyles: Record<string, string> = {
  Pending: "bg-[#FFF5EA] text-[#C86900] py-2 px-3 rounded-full",
  Unassigned: "bg-[#E9F6FF] text-[#161CCA] py-2 px-2 rounded-full",
  Rejected: "bg-[#FBE9E9] text-[#F50202] py-2 px-3 rounded-full",
  Deactivated: "bg-[#FBE9E9] text-[#F50202] py-2 px-3 rounded-full",
  Approved: "bg-[#E9F6FF] text-[#161CCA] py-2 px-3 rounded-full",
  InStock: "bg-[#E9F6FF] text-[#161CCA] py-2 px-3 rounded-full",
  Active: "bg-[#E9FBF0] text-[#059E40] py-2 px-3 rounded-full",
  Assigned: "bg-[#E9FBF0] text-[#059E40] py-2 px-3 rounded-full",
  Successful: "bg-[#F0FDF5] text-[#17643C] py-2 px-3 rounded-full",
  Inactive: "bg-[#FFF5EA] text-[#C86900] py-2 px-3 rounded-full",
  Blocked: "bg-[#FBE9E9] text-[#F50202] py-2 px-3 rounded-full",
  Failed: "bg-[#FBE9E9] text-[#F50202] py-2 px-3 rounded-full",
  Default: "bg-gray-100 text-gray-800 py-2 px-3 rounded-full",
  Offline: "text-[#F50202] bg-[#FBE9E9] py-2 px-2 rounded-full",
  Online: "text-[#059E40] bg-[#E9FBF0] py-2 px-2 rounded-full",
  Disconnected: "text-[#C86900] bg-[#FFF5EA] py-2 px-2 rounded-full",
  Connected: "text-[#161CCA] bg-[#E9F6FF] py-2 px-2 rounded-full",
  PendingCreated: "bg-[#FFF5EA] text-[#C86900] py-2 px-2 rounded-full",
  PendingAllocated: "bg-[#FFF5EA] text-[#C86900] py-2 px-2 rounded-full",
  PendingAssigned: "bg-[#FFF5EA] text-[#C86900] py-2 px-2 rounded-full",
  PendingDetached: "bg-[#FFF5EA] text-[#C86900] py-2 px-2 rounded-full",
  PendingMigrated: "bg-[#FFF5EA] text-[#C86900] py-2 px-2 rounded-full",
  RejectedCreated: "text-[#F50202] bg-[#FBE9E9] py-2 px-2 rounded-full",
  Created: "bg-[#E9F6FF] text-[#161CCA] py-2 px-2 rounded-full",
};

const statusMappings: Record<string, string> = {
  "Pending-allocated": "PendingAllocated",
  "Pending-created": "PendingCreated",
  "Rejected-created": "RejectedCreated",
  "Pending-assigned": "PendingAssigned",
  "Pending-detached": "PendingDetached",
  "Pending-migrated": "PendingMigrated",
};

export const getStatusStyle = (status: string | undefined): string => {
  const keyToLookup = status ? (statusMappings[status] ?? status) : "Default";
  const style = statusStyles[keyToLookup];
  // Use type assertion to ensure the return is a string
  return style ?? statusStyles.Default!; // Assert that Default exists
};
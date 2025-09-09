export const statusStyles: Record<string, string> = {
  pending: "bg-[#FFF5EA] text-[#C86900] py-2 px-3 rounded-full",
  unassigned: "bg-[#E9F6FF] text-[#161CCA] py-2 px-2 rounded-full",
  rejected: "bg-[#FBE9E9] text-[#F50202] py-2 px-3 rounded-full",
  deactivated: "bg-[#FBE9E9] text-[#F50202] py-2 px-3 rounded-full",
  approved: "bg-[#E9F6FF] text-[#161CCA] py-2 px-3 rounded-full",
  instock: "bg-[#E9F6FF] text-[#161CCA] py-2 px-3 rounded-full",
  active: "bg-[#E9FBF0] text-[#059E40] py-2 px-3 rounded-full",
  assigned: "bg-[#E9FBF0] text-[#059E40] py-2 px-3 rounded-full",
  successful: "bg-[#F0FDF5] text-[#17643C] py-2 px-3 rounded-full",
  inactive: "bg-[#FFF5EA] text-[#C86900] py-2 px-3 rounded-full",
  blocked: "bg-[#FBE9E9] text-[#F50202] py-2 px-3 rounded-full",
  failed: "bg-[#FBE9E9] text-[#F50202] py-2 px-3 rounded-full",
  default: "bg-gray-100 text-gray-800 py-2 px-3 rounded-full",
  offline: "text-[#F50202] bg-[#FBE9E9] py-2 px-2 rounded-full",
  online: "text-[#059E40] bg-[#E9FBF0] py-2 px-2 rounded-full",
  disconnected: "text-[#C86900] bg-[#FFF5EA] py-2 px-2 rounded-full",
  connected: "text-[#161CCA] bg-[#E9F6FF] py-2 px-2 rounded-full",
  pendingcreated: "bg-[#FFF5EA] text-[#C86900] py-2 px-2 rounded-full",
  pendingallocated: "bg-[#FFF5EA] text-[#C86900] py-2 px-2 rounded-full",
  pendingassigned: "bg-[#FFF5EA] text-[#C86900] py-2 px-2 rounded-full",
  pendingdetached: "bg-[#FFF5EA] text-[#C86900] py-2 px-2 rounded-full",
  pendingmigrated: "bg-[#FFF5EA] text-[#C86900] py-2 px-2 rounded-full",
  rejectedcreated: "text-[#F50202] bg-[#FBE9E9] py-2 px-2 rounded-full",
  created: "bg-[#E9F6FF] text-[#161CCA] py-2 px-2 rounded-full",
};

const statusMappings: Record<string, string> = {
  "pending-allocated": "pendingallocated",
  "pending-created": "pendingcreated",
  "rejected-created": "rejectedcreated",
  "pending-assigned": "pendingassigned",
  "pending-detached": "pendingdetached",
  "pending-migrated": "pendingmigrated",
};

export const getStatusStyle = (status: string | undefined): string => {
  const lowerCaseStatus = status?.toLowerCase();
  if (!lowerCaseStatus) {
    return statusStyles.Default!;
  }
  const keyToLookup = lowerCaseStatus
    ? (statusMappings[lowerCaseStatus] ?? lowerCaseStatus)
    : "Default";
  const style = statusStyles[keyToLookup];
  return style ?? statusStyles.Default!;
};

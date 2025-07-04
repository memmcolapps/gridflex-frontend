export const statusStyles: Record<string, string> = {
    Pending: "bg-[#FFF5EA] text-[#C86900] py-2 px-3 rounded-full",
    Rejected: "bg-[#FBE9E9] text-[#F50202] py-2 px-3 rounded-full",
    Approved: "bg-[#E9F6FF] text-[#161CCA] py-2 px-3 rounded-full",
    Active: "bg-[#F0FDF5] text-[#17643C] py-2 px-3 rounded-full",
    Successful: "bg-[#F0FDF5] text-[#17643C] py-2 px-3 rounded-full",
    Inactive: "bg-[#FFF5EA] text-[#C86900] py-2 px-3 rounded-full",
    Blocked: "bg-[#FBE9E9] text-[#F50202] py-2 px-3 rounded-full",
    Failed: "bg-[#FBE9E9] text-[#F50202] py-2 px-3 rounded-full",
    Default: "bg-gray-100 text-gray-800 py-2 px-3 rounded-full",
};

export const getStatusStyle = (status: string | undefined): string => {
    const keyToLookup = status ?? "Default";
    const style = statusStyles[keyToLookup];
    return (style ?? statusStyles.Default)!;
};
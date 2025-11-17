import { fetchAllCommunicationReports } from "@/service/reports-service";
import { type UseAllCommunicationReportsParams, type CommunicationReportData } from "@/types/reports";
import { useQuery } from "@tanstack/react-query";

export const useAllCommunicationReports = ({ 
    page = 0, 
    size = 5, 
    type = 'MD', 
    search = '' 
}: UseAllCommunicationReportsParams) => {
    return useQuery<CommunicationReportData[]>({
        queryKey: ["communicationReports", page, size, type, search], 
        queryFn: () => fetchAllCommunicationReports(page, size, type, search),
    });
};
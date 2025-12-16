import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAllCommunicationReports, fetchCommunicationRangeReport } from "@/service/reports-service";
import { type UseAllCommunicationReportsParams, type CommunicationReportData } from "@/types/reports";

export const useAllCommunicationReports = ({
    page = 0,
    size = 5,
    type = 'MD',
    search = ''
}: UseAllCommunicationReportsParams) => {
    return useQuery<CommunicationReportData[]>({
        queryKey: ["communicationReports", page, size, type, search],
        queryFn: () => fetchAllCommunicationReports(page, size, type, search),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
};

export const useCommunicationRangeReport = () => {
    const queryClient = useQueryClient();

    return useMutation<
        CommunicationReportData[],
        Error,
        {
            startDate: string;
            endDate: string;
            meterNumbers: string[];
            type: "MD" | "Non-MD";
        }
    >({
        mutationFn: ({ startDate, endDate, meterNumbers, type }) =>
            fetchCommunicationRangeReport(startDate, endDate, meterNumbers, type),
        onSuccess: (data) => {
            // Cache the result for the table to use
            queryClient.setQueryData(["communicationRangeReport"], data);
        },
    });
};
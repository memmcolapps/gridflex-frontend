import { fetchAuditLogs } from "@/service/audit-log-service";
import { useQuery } from "@tanstack/react-query";

export function useAuditLogs(page = 0, size = 10) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["auditLogs", page, size],
    queryFn: () => fetchAuditLogs(page, size),
    placeholderData: (previousData) => previousData,
  });

  return {
    data: data?.success ? data.data : null,
    isLoading,
    isError,
    error:
      data?.success === false
        ? data.error
        : (error?.message ?? "Unknown error"),
  };
}

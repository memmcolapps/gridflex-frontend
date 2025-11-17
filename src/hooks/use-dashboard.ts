import type { DashboardFilters } from "@/service/dashboard-service";
import { getDashboard, getHesDashboard } from "@/service/dashboard-service";
import { useQuery } from "@tanstack/react-query";

export const useDashboard = (filters?: DashboardFilters) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["dashboard", filters],
    queryFn: () => getDashboard(filters),
  });

  return {
    data: data?.success ? data.data : null,
    error: data?.success === false ? data.error : error?.message ?? null,
    isLoading,
  };
};

export const useHesDashboard = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["hesdashboard"],
    queryFn: () => getHesDashboard(),
  });

  return {
    data: data?.success ? data.data : null,
    error: data?.success === false ? data.error : error?.message ?? null,
    isLoading,
  };
};
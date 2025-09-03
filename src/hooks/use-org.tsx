import { useQuery } from "@tanstack/react-query";
import { fetchOrganizationNodes } from "../service/organaization-service";
import { useAuth } from "../context/auth-context";

export const useOrg = () => {
  const { isAuthenticated } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["organization-nodes"],
    queryFn: fetchOrganizationNodes,
    enabled: isAuthenticated,
  });

  return {
    nodes: data?.success ? data.data : [],
    isLoading,
    error,
  };
};

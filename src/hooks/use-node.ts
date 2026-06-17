import { useQuery } from "@tanstack/react-query";
import { fetchFeeders, fetchDSSByFeeder } from "@/service/node-service";

export const useFeeders = (nodeId: string | null) => {
  return useQuery({
    queryKey: ["feeders", nodeId],
    queryFn: () => {
      if (!nodeId) {
        return Promise.resolve([]);
      }
      return fetchFeeders(nodeId);
    },
    enabled: !!nodeId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useDSS = (feederNodeId: string | null) => {
  return useQuery({
    queryKey: ["dss", feederNodeId],
    queryFn: () => {
      if (!feederNodeId) {
        return Promise.resolve([]);
      }
      return fetchDSSByFeeder(feederNodeId);
    },
    enabled: !!feederNodeId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

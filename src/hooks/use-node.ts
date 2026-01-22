import { useQuery } from "@tanstack/react-query";
import { fetchFeeders, fetchDSSByFeeder } from "@/service/node-service";

export const useFeeders = () => {
  return useQuery({
    queryKey: ["feeders"],
    queryFn: fetchFeeders,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useDSS = (feederAssetId: string | null) => {
  return useQuery({
    queryKey: ["dss", feederAssetId],
    queryFn: () => {
      if (!feederAssetId) {
        return Promise.resolve([]);
      }
      return fetchDSSByFeeder(feederAssetId);
    },
    enabled: !!feederAssetId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

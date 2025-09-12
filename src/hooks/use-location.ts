// src/hooks/use-location.ts

import { useQuery } from "@tanstack/react-query";
import {
    fetchNigerianStates,
    fetchNigerianCitiesByState,
} from "@/service/location-service";
import { type NigerianState, type NigerianCity } from "@/types/location";

export const useNigerianStates = () => {
    return useQuery<NigerianState[], Error>({
        queryKey: ["nigerianStates"],
        queryFn: fetchNigerianStates,
        staleTime: Infinity,
        gcTime: Infinity,
    });
};

export const useNigerianCities = (state?: string) => {
    return useQuery<NigerianCity[], Error>({
        queryKey: ["nigerianCities", state],
        queryFn: () => fetchNigerianCitiesByState(state!),
        enabled: !!state,
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60 * 24,
    });
};

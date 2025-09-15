import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "@/service/profile-service";

export const useUser = (userId?: string) => {
  return useQuery({
    queryKey: ["user-profile", userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });
};

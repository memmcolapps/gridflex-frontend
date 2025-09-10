// @/hooks/use-user.ts
import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "@/service/profile-service";

export const useUser = () => {
    return useQuery({
        queryKey: ["user"],
        queryFn: fetchUser,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
    });
};
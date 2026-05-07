import { fetchAuthImage } from "@/service/assign-meter-service";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const authImageQueryOptions = (imageUrl: string) => ({
  queryKey: ["auth-image", imageUrl],
  queryFn: () => fetchAuthImage(imageUrl),
  staleTime: 1000 * 60 * 30,
  gcTime: 1000 * 60 * 60,
});

export function useAuthImage(imageUrl: string | null | undefined) {
  return useQuery({
    ...authImageQueryOptions(imageUrl!),
    enabled: !!imageUrl,
  });
}

export function usePrefetchAuthImage() {
  const queryClient = useQueryClient();
  return (imageUrl: string | null | undefined) => {
    if (!imageUrl) return;
    queryClient.prefetchQuery(authImageQueryOptions(imageUrl));
  };
}
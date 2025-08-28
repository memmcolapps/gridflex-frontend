import { getGroupPermission } from "@/service/user-service";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGroupPermissions = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["groupPermissions"],
    queryFn: () => getGroupPermission(),
  });
  return { data: data?.success ? data.data : [], error, isLoading };
};

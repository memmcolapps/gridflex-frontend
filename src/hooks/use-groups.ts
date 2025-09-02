import {
  createGroupPermission,
  getGroupPermission,
} from "@/service/user-service";
import { type OrganizationAccessPayload } from "@/types/group-permission-user";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGroupPermissions = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["groupPermissions"],
    queryFn: () => getGroupPermission(),
  });
  return { data: data?.success ? data.data : [], error, isLoading };
};

export const useCreateGroupPermission = () => {
  return useMutation({
    mutationFn: async (payload: OrganizationAccessPayload) => {
      const response = await createGroupPermission(payload);
      if ("success" in response && !response.success) {
        throw new Error(response.error);
      }
      return response;
    },
  });
};

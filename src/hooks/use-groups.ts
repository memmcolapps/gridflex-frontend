import {
  createGroupPermission,
  getGroupPermission,
  getUsers,
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

export const useGetUsers = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });
  return {
    data: data?.success
      ? data.data
      : { data: [], totalData: 1, size: 0, totalPages: 1, page: 1 },
    error,
    isLoading,
  };
};

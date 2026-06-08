import {
  activateOrDeactivateUser,
  createGroupPermission,
  createUser,
  deactivateOrActivateGroupPermission,
  editUser,
  type EditUserPayload,
  getGroupPermission,
  type GroupPermissionQueryParams,
  getUsers,
  type GetUsersQueryParams,
  updateGroupPermission,
  updateGroupPermissionField,
} from "@/service/user-service";
import {
  type CreateGroupPermissionPayload,
  type UpdateGroupPermissionPayload,
} from "@/types/group-permission-user";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { type CreateUserPayload } from "@/types/users-groups";

export const useGroupPermissions = (
  params: GroupPermissionQueryParams = {},
) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["groupPermissions", params],
    queryFn: () => getGroupPermission(params),
  });
  return { data: data?.success ? data.data : [], error, isLoading };
};

export const useCreateGroupPermission = () => {
  return useMutation({
    mutationFn: async (payload: CreateGroupPermissionPayload) => {
      const response = await createGroupPermission(payload);
      if ("success" in response && !response.success) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["groupPermissions"],
      });
    },
  });
};

export const useUpdateGroupPermission = () => {
  return useMutation({
    mutationFn: async ({
      groupId,
      payload,
    }: {
      groupId: string;
      payload: UpdateGroupPermissionPayload;
    }) => {
      const response = await updateGroupPermission(groupId, payload);
      if ("success" in response && !response.success) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["groupPermissions"],
      });
    },
  });
};

export const useUpdateGroupPermissionField = () => {
  return useMutation({
    mutationFn: async ({
      groupId,
      permissionType,
      value,
    }: {
      groupId: string;
      permissionType: "view" | "edit" | "approve" | "disable";
      value: boolean;
    }) => {
      const response = await updateGroupPermissionField(
        groupId,
        permissionType,
        value,
      );
      if ("success" in response && !response.success) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["groupPermissions"],
      });
    },
  });
};

export const useDeactivateOrActivateGroupPermission = () => {
  return useMutation({
    mutationFn: async (payload: { groupId: string; status: boolean }) => {
      const { groupId, status } = payload;
      const response = await deactivateOrActivateGroupPermission(
        groupId,
        status,
      );
      if ("success" in response && !response.success) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["groupPermissions"],
      });
    },
  });
};

export const useGetUsers = (params: GetUsersQueryParams = {}) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
    placeholderData: keepPreviousData,
  });
  return {
    data: data?.success
      ? data.data
      : { data: [], totalData: 0, size: 0, totalPages: 1, page: 0 },
    error,
    isLoading,
  };
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (user: CreateUserPayload) => {
      const response = await createUser(user);
      if ("success" in response && !response.success) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};

export const useEditUser = () => {
  return useMutation({
    mutationFn: async (user: EditUserPayload) => {
      const response = await editUser(user);
      if ("success" in response && !response.success) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};

export const useActivateOrDeactivateUser = () => {
  return useMutation({
    mutationFn: async (payload: { status: boolean; userId: string }) => {
      const { status, userId } = payload;
      const response = await activateOrDeactivateUser(status, userId);
      if ("success" in response && !response.success) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};

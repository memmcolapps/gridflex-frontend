import {
  activateOrDeactivateUser,
  createGroupPermission,
  createUser,
  deactivateOrActivateGroupPermission,
  editUser,
  type EditUserPayload,
  getGroupPermission,
  getUsers,
  updateGroupPermission,
  updateGroupPermissionField,
} from "@/service/user-service";
import { type OrganizationAccessPayload } from "@/types/group-permission-user";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { type CreateUserPayload } from "@/types/users-groups";

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
      payload: OrganizationAccessPayload;
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

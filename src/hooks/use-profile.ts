// @/hooks/use-profile.ts
import { useMutation, QueryClient } from "@tanstack/react-query";
import {
  updateProfile,
  type UpdateProfilePayload,
} from "../service/profile-service";
import { toast } from "sonner";

const queryClient = new QueryClient();

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const response = await updateProfile(payload);
      if ("success" in response && !response.success) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile.");
    },
  });
};

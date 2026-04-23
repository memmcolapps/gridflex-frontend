import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchScheduleData,
  fetchProfileEvents,
  createSchedule,
  resetCronSchedule,
  fetchHierarchyData
} from "@/service/hes-service";
import type { CreateSchedulePayload, ResetCronPayload } from "@/types/hes";
import { toast } from "sonner";

export const useHierarchyData = () => {
  return useQuery({
    queryKey: ['hierarchyData'],
    queryFn: fetchHierarchyData,
  });
};

export const scheduleQueryKeys = {
  all: ["schedule"] as const,
  list: (page: number, size: number, search?: string) =>
    [...scheduleQueryKeys.all, "list", { page, size, search }] as const,
  profileEvents: () => [...scheduleQueryKeys.all, "profile-events"] as const,
};

export function useScheduleData(page: number, size: number, search?: string) {
  return useQuery({
    queryKey: scheduleQueryKeys.list(page, size, search),
    queryFn: async () => {
      const result = await fetchScheduleData(page, size, search);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    placeholderData: (prev) => prev,
    staleTime: 0, 
  });
}

export function useProfileEvents() {
  return useQuery({
    queryKey: scheduleQueryKeys.profileEvents(),
    queryFn: async () => {
      const result = await fetchProfileEvents();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    staleTime: 5 * 60_000,
  });
}

export function useCreateSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateSchedulePayload) => {
      const result = await createSchedule(payload);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      toast.success("Sync schedule created successfully!");
      void queryClient.invalidateQueries({ queryKey: scheduleQueryKeys.all });
    },
    onError: (error: Error) => {
      toast.error(`Failed to create schedule: ${error.message}`);
    },
  });
}

export function useResetCronSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ResetCronPayload) => {
      const result = await resetCronSchedule(payload);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      toast.success("Cron schedule reset successfully!");
      void queryClient.invalidateQueries({ queryKey: scheduleQueryKeys.all });
    },
    onError: (error: Error) => {
      toast.error(`Failed to reset cron schedule: ${error.message}`);
    },
  });
}

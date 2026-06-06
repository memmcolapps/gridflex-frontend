import { queryClient } from "@/lib/queryClient";
import {
  createMessage,
  getIncidentReports,
  type IncidentMessage,
} from "@/service/incident-service";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateIncident = () => {
  return useMutation({
    mutationFn: (data: IncidentMessage) => createMessage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidentReport"] });
    },
  });
};

export const useIncidentReports = (
  page: number,
  size: number,
  status?: boolean,
) => {
  return useQuery({
    queryKey: ["incidentReport", page, size, status],
    queryFn: () => getIncidentReports(page, size, status),
  });
};

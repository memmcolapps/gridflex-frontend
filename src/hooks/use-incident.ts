import { queryClient } from "@/lib/queryClient";
import { createMessage, getIncidentReports, IncidentMessage } from "@/service/incident-service";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateIncident = () => {
  return useMutation({
    mutationFn: (data: IncidentMessage) => createMessage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidentReport']})
    }
  });
};

export const useIncidentReports = (
  page: number,
  size: number,
) => {
  return useQuery({
    queryKey: ['incidentReport', page, size],
    queryFn: () => getIncidentReports(page, size),
  });
};
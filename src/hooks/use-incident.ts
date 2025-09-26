import { createMessage,type IncidentMessage } from "@/service/incident-service";
import { useMutation } from "@tanstack/react-query";

export const useCreateIncident = () => {
  return useMutation({
    mutationFn: (data: IncidentMessage) => createMessage(data),
  });
};

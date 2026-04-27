import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getProfileEventsData,
  getEvents,
  getProfiles,
  getEventNames,
  getProfileNames,
} from "../service/profile-events-service";
import type {
  ProfileEventsApiResponse,
  EventsApiResponse,
  ProfilesApiResponse,
  GetEventsParams,
  GetProfilesParams,
  EventNameApiResponse,
  ProfileNameApiResponse,
} from "../types/profile-events";

export const useProfileEventsData = () => {
  return useQuery<ProfileEventsApiResponse, Error>({
    queryKey: ["profile-events-data"],
    queryFn: () => getProfileEventsData(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useEventNames = () => {
  return useQuery<EventNameApiResponse, Error>({
    queryKey: ["event-names"],
    queryFn: getEventNames,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useProfileNames = () => {
  return useQuery<ProfileNameApiResponse, Error>({
    queryKey: ["profile-names"],
    queryFn: getProfileNames,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useEvents = () => {
  return useMutation<EventsApiResponse, Error, GetEventsParams>({
    mutationFn: getEvents,
    onSuccess: (data) => {
      // Optionally cache the result or handle success
      console.log("Events fetched successfully", data);
    },
    onError: (error) => {
      console.error("Failed to fetch events", error);
    },
  });
};

export const useProfiles = () => {
  return useMutation<ProfilesApiResponse, Error, GetProfilesParams>({
    mutationFn: getProfiles,
    onSuccess: (data) => {
      // Optionally cache the result or handle success
      console.log("Profiles fetched successfully", data);
    },
    onError: (error) => {
      console.error("Failed to fetch profiles", error);
    },
  });
};
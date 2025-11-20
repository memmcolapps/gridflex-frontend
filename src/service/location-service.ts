/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/location-service.ts

import axios from "axios";
import { type NigerianState, type NigerianCity } from "@/types/location";
import { axiosInstance } from "@/lib/axios";

const NIGERIA_LOC_GEOJSON_BASE_URL =
  "https://temikeezy.github.io/nigeria-geojson-data/data";

interface GeoJSONState {
  state: string;
  lgas: { name: string }[];
}

export const fetchNigerianStates = async (): Promise<NigerianState[]> => {
  try {
    const response = await axiosInstance.get<GeoJSONState[]>(
      `${NIGERIA_LOC_GEOJSON_BASE_URL}/full.json`,
    );
    return response.data
      .map((item: GeoJSONState) => ({
        id: item.state.toLowerCase().replace(/\s+/g, "-"),
        name: item.state,
      }))
      .filter((state) => state.id.trim() !== "" && state.name.trim() !== "");
  } catch (error: any) {
    console.error("Error fetching Nigerian states from GeoJSON:", error);
    throw new Error(
      "Failed to fetch states from GeoJSON data. Please check the URL or your network connection.",
    );
  }
};
export const fetchNigerianCitiesByState = async (
  state: string,
): Promise<NigerianCity[]> => {
  try {
    const response = await axiosInstance.get<GeoJSONState[]>(
      `${NIGERIA_LOC_GEOJSON_BASE_URL}/full.json`,
    );

    const selectedState = response.data.find(
      (item: GeoJSONState) =>
        item.state.toLowerCase().replace(/\s+/g, "-") === state,
    );

    if (!selectedState) {
      return [];
    }
    return selectedState.lgas
      .map((lga: { name: string }) => ({
        id: lga.name.toLowerCase().replace(/\s+/g, "-"),
        name: lga.name,
        state: state,
      }))
      .filter((city) => city.id.trim() !== "" && city.name.trim() !== "");
  } catch (error: any) {
    console.error(
      `Error fetching cities for state ${state} from GeoJSON:`,
      error,
    );

    throw new Error(
      `Failed to fetch cities for state ${state} from GeoJSON data. Please check the URL or your network connection.`,
    );
  }
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  if (config.data && typeof config.data === "object") {
    config.data = trimObjectStrings(config.data);
  }
  return config;
});

const trimObjectStrings = (obj: any): any => {
  if (typeof obj === "string") return obj.trim();
  if (Array.isArray(obj)) return obj.map(trimObjectStrings);
  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      acc[key] = trimObjectStrings(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
};

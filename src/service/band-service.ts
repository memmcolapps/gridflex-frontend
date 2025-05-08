import axios from "axios";
import { toast } from "sonner";
import { handleApiError } from "@/utils/error-handler";
import { env } from "@/env";

export interface Band {
  id?: string | number;
  name: string;
  electricityHour: number;
  status?: boolean;
  createdat?: string;
  updatedat?: string;
}

interface BandResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: string;
}

interface BandListResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: Array<{
    id: number;
    name: string;
    hour: string;
    status: boolean;
    created_at: string;
    updated_at: string;
  }>;
}

const API_URL = env.NEXT_PUBLIC_BASE_URL;
const CUSTOM_HEADER = env.NEXT_PUBLIC_CUSTOM_HEADER;

export async function createBand(band: Omit<Band, 'id'>): Promise<boolean> {
  try {
    const token = localStorage.getItem('auth_token');
    
    const response = await axios.post<BandResponse>(
      `${API_URL}/band/service/create`,
      {
        name: band.name,
        hour: band.electricityHour.toString()
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'custom': CUSTOM_HEADER,
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (response.data.responsecode === "000") {
      toast.success(response.data.responsedesc);
      return true;
    } else {
      throw new Error(response.data.responsedesc ?? "Failed to create band");
    }
  } catch (error) {
    const apiError = handleApiError(error);
    toast.error(apiError.message);
    return false;
  }
}

export async function fetchBands(): Promise<Band[]> {
  try {
    const token = localStorage.getItem('auth_token');
    
    const response = await axios.get<BandListResponse>(
      `${API_URL}/band/service/all-band`,
      {
        headers: {
          'Content-Type': 'application/json',
          'custom': CUSTOM_HEADER,
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (response.data.responsecode === "000") {
      return response.data.responsedata.map(band => ({
        id: band.id,
        name: band.name,
        electricityHour: parseInt(band.hour, 10),
        status: band.status,
        createdat: band.created_at,
        updatedat: band.updated_at
      }));
    } else {
      throw new Error(response.data.responsedesc ?? "Failed to fetch bands");
    }
  } catch (error) {
    const apiError = handleApiError(error);
    toast.error(apiError.message);
    return [];
  }
}

export async function updateBand(band: Band): Promise<boolean> {
  try {
    const token = localStorage.getItem('auth_token');
    
    const response = await axios.put<BandResponse>(
      `${API_URL}/band/service/update`,
      {
        id: band.id,
        name: band.name,
        hour: band.electricityHour.toString()
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'custom': CUSTOM_HEADER,
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (response.data.responsecode === "000") {
      toast.success(response.data.responsedesc);
      return true;
    } else {
      throw new Error(response.data.responsedesc ?? "Failed to update band");
    }
  } catch (error) {
    const apiError = handleApiError(error);
    toast.error(apiError.message);
    return false;
  }
}
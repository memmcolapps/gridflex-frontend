import { HierarchyResponse } from '@/types/hes';
import { env } from "@/env";

export const fetchHierarchyData = async (): Promise<HierarchyResponse> => {
  const baseUrl = env.NEXT_PUBLIC_BASE_URL;
  const token = localStorage.getItem('auth_token');

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_BASE_URL is not configured');
  }

  if (!token) {
    throw new Error('No authorization token found');
  }

  const response = await fetch(`${baseUrl}/hes/service/model`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch hierarchy data');
  }

  return response.json();
};
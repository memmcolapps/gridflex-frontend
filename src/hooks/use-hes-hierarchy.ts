import { useQuery } from '@tanstack/react-query';
import { fetchHierarchyData } from '@/service/hes-service';

export const useHierarchyData = () => {
  return useQuery({
    queryKey: ['hierarchyData'],
    queryFn: fetchHierarchyData,
  });
};
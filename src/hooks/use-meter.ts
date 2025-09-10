import { fetchManufacturers } from "@/service/meter-service";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetMeterManufactures = (
  page?: number,
  size?: number,
  name?: string,
  manufacturerId?: string,
  sgc?: string,
  state?: string,
  createdAt?: string,
) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["meters"],
    queryFn: () =>
      fetchManufacturers(
        page,
        size,
        name,
        manufacturerId,
        sgc,
        state,
        createdAt,
      ),
  });

  return {
    data: data?.success
      ? data.data
      : {
          totalData: 0,
          data: [],
          size: 0,
          totalPages: 0,
          page: 0,
        },
    error,
    isLoading,
  };
};

// hooks/use-customer.ts

import { useQuery, useMutation } from "@tanstack/react-query";
import {
    getCustomers,
    addCustomer,
    updateCustomer,
    blockCustomer,
} from "../service/customer-service";
import {
    type Customer,
    type CustomersApiResponse,
    type AddCustomerPayload,
    type UpdateCustomerPayload,
    type BlockCustomerPayload,
} from "@/types/customer-types";

export interface UseCustomersParams {
    page: number;
    pageSize: number;
    searchTerm: string;
    sortBy?: keyof Customer | null;
    sortDirection?: "asc" | "desc" | null;
}

/**
 * A hook to fetch a paginated, searchable, and sortable list of customers.
 */
export const useCustomers = ({ page, pageSize, searchTerm, sortBy, sortDirection }: UseCustomersParams) => {
    return useQuery<CustomersApiResponse, Error>({
        queryKey: ["customers", page, pageSize, searchTerm, sortBy, sortDirection],
        queryFn: () => getCustomers({ page, pageSize, searchTerm, sortBy: sortBy ?? null, sortDirection: sortDirection ?? null }),
    });
};

/**
 * A hook for adding a new customer.
 * It returns a mutation object to be used in components.
 */
export const useAddCustomer = () => {
    return useMutation<unknown, Error, AddCustomerPayload>({
        mutationFn: addCustomer,
    });
};

/**
 * A hook for updating an existing customer.
 * It returns a mutation object to be used in components.
 */
export const useUpdateCustomer = () => {
    return useMutation<unknown, Error, UpdateCustomerPayload>({
        mutationFn: updateCustomer,
    });
};

/**
 * A hook for blocking a customer.
 * It returns a mutation object to be used in components.
 */
export const useBlockCustomer = () => {
    return useMutation<unknown, Error, BlockCustomerPayload>({
        mutationFn: blockCustomer,
    });
};
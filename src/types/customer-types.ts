export interface Customer {
    id: string;
    orgId: string;
    firstname: string;
    lastname: string;
    vat: string;
    status: boolean;
    firstName: string;
    lastName: string;
    accountNumber: string;
    customerId: string;
    nin: string;
    phoneNumber: string;
    email: string;
    state: string;
    city: string;
    houseNo: string;
    streetName: string;
    meterAssigned: boolean;
    meterNumber: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CustomersApiResponse {
    responsecode: string;
    responsedesc: string;
    responsedata: {
        totalData: number;
        data: Customer[];
        size: number;
        totalPages: number;
    };
}

export type AddCustomerPayload = {
    firstname: string;
    lastname: string;
    nin: string;
    phoneNumber: string;
    email: string;
    state: string;
    city: string;
    houseNo: string;
    streetName: string;
    vat: string;
};

export type UpdateCustomerPayload = Partial<AddCustomerPayload> & { id: string };

export interface BlockCustomerPayload {
    customerId: string;
    reason: string;
}

export interface CustomerMutationResponse {
    responsecode: string;
    responsedesc: string;
    responsedata: {
        id: string;
    };
}
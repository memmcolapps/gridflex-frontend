export interface Customer {
    id: string;
    orgId: string;
    firstname: string;
    lastname: string;
    vat: string;
    status: boolean;
    firstName: string;
    lastName: string;
    accountNumber?: string;
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
    meter?: Array<{
        id: string;
        nodeId?: string;
        meterNumber: string;
        accountNumber: string;
        simNumber?: string;
        cin?: string;
        tariff?: string;
        type: string;
        dss?: string;
        meterCategory: string;
        meterClass: string;
        meterType: string;
        meterStage: string;
        status: string;
        smartStatus: boolean;
        customerId: string;
        oldSgc: string;
        newSgc: string;
        oldKrn: string;
        newKrn: string;
        oldTariffIndex: number;
        newTariffIndex: number;
        meterAssignLocation?: {
            id: string;
            orgId: string;
            meterId: string;
            state: string;
            city: string;
            houseNo: string;
            streetName: string;
            createdAt: string;
            updatedAt: string;
        };
        createdAt: string;
        updatedAt: string;
    }>;
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
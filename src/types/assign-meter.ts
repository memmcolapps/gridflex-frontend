export interface ManufacturerDetails {
    id: string;
    orgId: string;
    manufacturerId: string;
    name: string;
    contactPerson: string;
    state: string;
    city: string;
    street: string;
    email: string;
    phoneNo: string;
    createdAt: string;
    updatedAt: string;
}

// Defines the structure of a single meter item returned from the API
export interface MeterAPIItem {
    id: string;
    meterNumber: string;
    simNumber: string;
    type: "VIRTUAL" | "NON-VIRTUAL" | string; // Key field for separation
    meterCategory: string; // e.g., "prepaid", "postpaid"
    meterClass: string;
    meterType: string;
    meterManufacturer: string;
    meterStage: string;
    status: string; // e.g., "Inactive", "Active"
    oldSgc: string;
    newSgc: string;
    oldKrn: string;
    newKrn: string;
    oldTariffIndex: number;
    newTariffIndex: number;
    manufacturer: ManufacturerDetails;
    createdAt: string;
    updatedAt: string;
}

// Defines the full structure of the API response
export interface MeterAPIResponse {
    responsecode: "000" | string;
    responsedesc: string;
    responsedata: {
        totalData: number;
        data: MeterAPIItem[];
    };
}
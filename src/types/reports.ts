export interface CommunicationReportData {
    meterNo?: string;
    connectionType?: string;
    onlineTime?: string;
    offlineTime?: string;
    updatedAt?: string;
    meter?: {
        id?: string;
        orgId?: string;
        nodeId?: string;
        meterNumber?: string;
        accountNumber?: string;
        simNumber?: string;
        fixedEnergy?: string;
        dss?: string;
        meterCategory?: string;
        meterClass?: string;
        meterType?: string;
        smartStatus?: boolean;
        customerId?: string;
        oldSgc?: string;
        newSgc?: string;
        oldKrn?: string;
        newKrn?: string;
        oldTariffIndex?: number;
        newTariffIndex?: number;
        smartMeterInfo?: {
            meterModel?: string;
            createdAt?: string;
            updatedAt?: string;
        };
        createdAt?: string;
        updatedAt?: string;
    };
}

export interface CommunicationReport {
    totalData?: number;
    data?: CommunicationReportData[];
    size?: number;
    totalPages?: number;
    page?: number;
}

export interface CommunicationReportResponse {
    responsecode: string;
    responsedesc: string;
    responsedata: CommunicationReport;
}

export interface UseAllCommunicationReportsParams {
    page?: number;
    size?: number;
    type?: 'MD' | 'Non-MD';
    search?: string;
}
export interface CommunicationReportData {
    serialNumber?: string;
    meterNo?: string;
    meterModel?: string;
    meterClass?: string;
    status?: string;
    lastSync?: string;
    tamperState?: string;
    tamperSync?: string;
    relayControl?: string;
    relaySync?: string;
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
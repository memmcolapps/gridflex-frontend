export interface LiabilityCause {
    id: string;
    name: string;
    code: string;
    createdAt: string;
    updatedAt: string;
    deactivated?: boolean;
    approveStatus: "Pending" | "Rejected" | "Approved";
}

export interface CustomerDetails {
    id: string;
    firstname: string;
    lastname: string;
    createdAt: string;
    updatedAt: string;
}

export interface Meter {
    id: string;
    meterNumber: string;
    accountNumber: string;
    customerId: string;
    customer: CustomerDetails;
    createdAt: string;
    updatedAt: string;
}

export interface Payment {
    id: string;
    amount: number;
    createdAt: string;
    updatedAt: string;
    credit: number;
}

export interface Adjustment {
    id: string;
    meterId: string;
    liabilityCauseId: string;
    amount: number;
    balance: number;
    status: string;
    type: string;
    origId: string;
    payment: Payment[];
    liabilityCause: LiabilityCause;
    meter: Meter[];
    createdAt: string;
}

export interface ApiResponse<T> {
    responsecode: string;
    responsedesc: string;
    responsedata: T;
}

export interface Customer {
    id: string;
    name: string;
    meterNo: string;
    accountNo: string;
    balance: number;
}

export interface Transaction {
    date: string;
    liabilityCause: string;
    liabilityCode: string;
    credit: number | string;
    debit: number | string;
    balance: number;
}

export interface AdjustmentTableProps {
    type: "credit" | "debit";
}

export interface AdjustmentPayload {
    meterId: string;
    liabilityCauseId: string;
    amount: number;
    type: "credit" | "debit";
}

export interface AdjustmentMutationResponse {
    responsecode: string;
    responsedesc: string;
    responsedata: Adjustment;
}

export interface LiabilityCausePayload {
    name: string;
    code: string;
}

export interface UpdatedLiabilityCausePayload {
    liabilityCauseId: string;
    name?: string;
    code?: string;
    deactivated?: boolean;
}

export interface Band {
    id: string;
    orgId: string;
    name: string;
    hour: string;
    approveStatus: string;
    createdAt: string;
    updatedAt: string;
}

export interface PercentageRange {
    id: string;
    percentageId: string;
    orgId: string;
    percentage: string;
    code: string;
    band: Band;
    amountStartRange: string;
    amountEndRange: string;
    approveStatus: "Pending" | "Rejected" | "Approved";
    deactivated?: boolean;
}

export interface PercentageRangePayload {
    percentage: string;
    code: string;
    amountStartRange?: string;
    amountEndRange?: string | undefined;
    bandId: undefined | string;
}

export interface UpdatedPercentageRangePayload {
    percentageId: string;
    percentage?: string;
    code?: string;
    amountStartRange?: string;
    amountEndRange?: string | undefined;
    bandId?: string;
    deactivated?: boolean;
}

// UI-specific types, defined only once
export type UILiability = {
    sNo: number;
    liabilityName: string;
    liabilityCode: string;
    approvalStatus: "Pending" | "Rejected" | "Approved";
    deactivated?: boolean;
};

export type UiPercentageRange = {
    sNo: number;
    percentage: string;
    percentageCode: string;
    band: string;
    amountStartRange: string;
    amountEndRange: string;
    approvalStatus: "Pending" | "Rejected" | "Approved";
};

export type TableData = (UILiability | UiPercentageRange) & { deactivated?: boolean };

export type LiabilityTableProps = {
    view: "liability" | "percentage";
    onViewChange: (view: "liability" | "percentage") => void;
    onDataChange?: (data: TableData[]) => void;
    onAddPercentageRange?: (range: { percentage: string; percentageCode: string; band: string; amountStartRange: string; amountEndRange: string }) => void;
};

export type AddLiabilityDialogProps = {
    onAddLiability: (liability: { liabilityName: string; liabilityCode: string }) => void;
};

export type AddPercentageRangeDialogProps = {
    onAddPercentageRange: (range: {
        percentage: string;
        percentageCode: string;
        band: string;
        amountStartRange: string;
        amountEndRange: string;
    }) => void;
};
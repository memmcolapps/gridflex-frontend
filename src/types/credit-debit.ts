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
    orgId?: string;
    firstname: string;
    lastname: string;
    customerId?: string;
    nin?: string;
    phoneNumber?: string;
    email?: string;
    state?: string;
    city?: string;
    houseNo?: string;
    streetName?: string;
    status?: string;
    vat?: string;
    createdAt?: string;
    updatedAt?: string;
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
    orgId?: string;
    creditDebitAdjId?: string;
    credit: number;
    createdAt?: string;
}

export interface Adjustment {
    id: string;
    orgId?: string;
    nodeId?: string;
    meterId: string;
    meterNumber?: string;
    accountNumber?: string;
    simNumber?: string;
    cin?: string;
    tariff?: string;
    type?: string;
    dss?: string;
    meterCategory?: string;
    meterClass?: string;
    meterType?: string;
    meterStage?: string;
    status?: string;
    smartStatus?: boolean;
    customerId?: string;
    oldSgc?: string;
    newSgc?: string;
    oldKrn?: string;
    newKrn?: string;
    oldTariffIndex?: number;
    newTariffIndex?: number;
    customer?: CustomerDetails;
    debitCreditAdjustInfo?: DebitCreditAdjustInfo[];
    createdAt?: string;
    updatedAt?: string;
}

export interface DebitCreditAdjustInfo {
    id: string;
    meterId: string;
    liabilityCauseId: string;
    amount: number;
    balance: number;
    status: string;
    type: "credit" | "debit";
    orgId?: string;
    payment: Payment[];
    liabilityCause: LiabilityCause;
    createdAt?: string;
    updatedAt?: string;
}

export interface AdjustmentListResponse {
    totalData: number;
    data: Adjustment[];
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
    responsedata: AdjustmentListResponse | Adjustment;
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

export type ApprovalStatusType = "Pending" | "Rejected" | "Approved";

// UI-specific types, defined only once
export type UILiability = {
    id: string;
    sNo: number;
    liabilityName: string;
    liabilityCode: string;
    approvalStatus: ApprovalStatusType;
    deactivated?: boolean;
    liabilityCauseId?: string;
};

export type UiPercentageRange = {
    id: string;
    sNo: number;
    percentage: string;
    percentageCode: string;
    band: string;
    amountStartRange: string;
    amountEndRange: string;
    approvalStatus: ApprovalStatusType;
    deactivated?: boolean;
};

export type TableData = UILiability | UiPercentageRange;

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
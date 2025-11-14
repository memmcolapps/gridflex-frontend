// vending.ts

export interface LiabilityCause {
  id: string;
  orgId: string;
  name: string;
  code: string;
  approveStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface Adjustment {
  id: string;
  meterId: string;
  liabilityCauseId: string;
  amount: number;
  balance: number;
  status: string;
  type: string;
  orgId: string;
  payment: any[];
  liabilityCause: LiabilityCause;
  createdAt: string;
  updatedAt: string;
}

export interface VendingTransaction {
  id: string;
  transactionId: string;
  customerId: string;
  customerFullname: string;
  address: string;
  meterId: string;
  meterAccountNumber: string;
  meterNumber: string;
  vatAmount: number;
  unit: number;
  unitCost: number;
  status: string;
  token: string;
  kct1?: string;
  kct2?: string;
  receiptNo: string;
  tokenType: string;
  tariffName: string;
  tariffRate: string;
  bandName: string;
  bandHour: string;
  userId: string;
  userFullname: string;
  debitAdjustment: [
    {
      id: string;
      meterId: string;
      liabilityCauseId: string;
      amount: number;
      balance: number;
      status: string;
      type: string;
      orgId: string;
      payment: any[];
      liabilityCause: LiabilityCause;
      createdAt: string;
      updatedAt: string;
    },
  ];
  creditAdjustment: [
    {
      id: string;
      meterId: string;
      liabilityCauseId: string;
      amount: number;
      balance: number;
      status: string;
      type: string;
      orgId: string;
      payment: any[];
      liabilityCause: LiabilityCause;
      createdAt: string;
      updatedAt: string;
    },
  ];
  createdAt: string;
  updatedAt: string;
  initialAmount: number;
  finalAmount: number;
}

export interface GenerateCreditTokenPayload {
  meterNumber?: string;
  meterAccountNumber?: string;
  initialAmount: number;
  tokenType: string;
}

export interface GenerateCreditTokenResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: VendingTransaction;
}

export interface PrintTokenPayload {
  id: string;
  tokenType: string;
}

export interface PrintTokenResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: {
    printData: string; // HTML content for printing
  };
}

export interface MeterInfo {
  meterId: string;
  orgId: string;
  customerId: string;
  customerFullname: string;
  address: string;
  meterAccountNumber: string;
  meterNumber: string;
  tariffId: string;
  tariffRate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreditTokenData {
  tokenType: string;
  meterNumber: string;
  costOfUnit: number;
  vat: number;
  vatAmount: number;
  unit: number;
  initialAmount: number;
  finalAmount: number;
}

export interface CalculateCreditTokenResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: {
    totalDebitBalance: number;
    data: {
      tokenType: string;
      meterNumber: string;
      costOfUnit: number;
      vat: number;
      vatAmount: number;
      unit: number;
      initialAmount: number;
      finalAmount: number;
    };
    totalCreditBalance: number;
    meter: {
      meterId: string;
      orgId: string;
      customerId: string;
      customerFullname: string;
      address: string;
      meterAccountNumber: string;
      meterNumber: string;
      tariffId: string;
      tariffRate: string;
      createdAt: string;
      updatedAt: string;
    }[];
  };
}

export interface GenerateKCTPayload {
  meterNumber?: string;
  meterAccountNumber?: string;
  tokenType: string;
  reason: string;
  oldSgc: string;
  newSgc: string;
  oldKrn: string;
  newKrn: string;
  oldTariffIndex: number;
  newTariffIndex: number;
}

export interface GenerateKCTResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: VendingTransaction;
}

export interface GenerateClearTamperPayload {
  meterNumber?: string;
  meterAccountNumber?: string;
  tokenType: string;
  reason: string;
}

export interface GenerateClearTamperResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: VendingTransaction;
}

export interface GenerateClearCreditPayload {
  meterNumber?: string;
  meterAccountNumber?: string;
  tokenType: string;
  reason: string;
}

export interface GenerateClearCreditResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: VendingTransaction;
}

export interface GenerateKCTAndClearTamperPayload {
  meterNumber?: string;
  tokenType: string;
  reason: string;
  oldSgc: string;
  newSgc: string;
}

export interface GenerateKCTAndClearTamperResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: VendingTransaction;
}

export interface GenerateCompensationPayload {
  meterNumber?: string;
  meterAccountNumber?: string;
  tokenType: string;
  reason: string;
  units: number;
}

export interface GenerateCompensationResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: VendingTransaction;
}

export interface CardData {
  totalProfit: number;
  unitCostSum: number;
  vatAmountSum: number;
  transactionSum: number;
  previousVatAmountSum: number;
  previousTotalProfit: number;
  previousUnitCostSum: number;
  previousTransactionSum: number;
}

export interface TokenDistribution {
  kctToken: string;
  creditToken: string;
  clearCreditToken: string;
  kctClearTamperToken: string;
  compensationToken: string;
  clearTamperToken: string;
}

export interface TransactionStatus {
  pending: number;
  failed: number;
  success: number;
}

export interface TransactionOverMonth {
  transactionSum: number;
  month: string;
  year: number;
  vatAmountSum: number;
  unitCostSum: number;
}

export interface VendingDashboardData {
  cardData: CardData;
  tokenDistribution: TokenDistribution;
  transactionStatus: TransactionStatus;
  transactionOverMonths: TransactionOverMonth[];
}

export interface VendingDashboardResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: VendingDashboardData;
}

export interface VendingDashboardPayload {
  band?: string;
  year?: string;
  meterCategory?: string;
}

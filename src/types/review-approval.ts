export interface GetPercentageResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: PercentageRange[];
}

export interface PercentageRange {
  id: string;
  percentageId: string;
  orgId: string;
  percentage: string;
  code: string;
  band: {
    id: string;
    orgId: string;
    name: string;
    hour: string;
    approveStatus: string;
    createdAt: string;
    updatedAt: string;
  };
  amountStartRange: string;
  amountEndRange: string;
  status: boolean;
  approveStatus: string;
  createdBy: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllLiabilitiesResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: Liability[];
}
export interface Liability {
  id: string;
  liabilityCauseId: string;
  orgId: string;
  name: string;
  code: string;
  status: boolean;
  approveStatus: string;
  createdBy: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

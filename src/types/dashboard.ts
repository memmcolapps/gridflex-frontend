export interface Manufacturer {
  orgId: string;
  manufacturerId: string;
  name: string;
  contactPerson: string;
  phoneNo: string;
  createdAt: string;
  updatedAt: string;
}

export interface InstalledOverMonths {
  month: string;
  year: number;
  count: number;
}

export interface CardData {
  totalMeter: number;
  assigned: number;
  inventory: number;
  deactivated: number;
  allocated: number;
}

export interface PercentData {
  assigned: string;
  inventory: string;
  deactivated: string;
  allocated: string;
}

export interface DashboardResponseData {
  cardData: CardData;
  manufacturers: Manufacturer[];
  installedOverMonths: InstalledOverMonths[];
  percentData: PercentData;
}

export interface DashboardApiResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: DashboardResponseData;
}
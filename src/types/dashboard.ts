export interface Manufacturer {
  totalMeters: number;
  name: string;
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

export interface MeterSummary {
  totalSmartMeters: number;
  online: number;
  offline: number;
  failedCommands: number;
}

export interface CommunicationLogs {
  timeLabel: string;
  value: number;
}

export interface ScheduleRate {
  activeRate: number;
  pausedRate: number;
}

export interface CommunicationReport {
  serialNumber: string;
  meterNo: string;
  meterModel: string;
  status: string;
  lastSync: string;
  tamperState: string;
  tamperSync: string;
  relayControl: string;
  relaySync: string;
}

export interface EventLog {
  meterNumber: string;
  meterModel: string;
  eventTypeId: string;
  eventTime: string;
  eventName: string;
  eventTypeName: string;
  obisCode: string;
  description: string;
}

export interface HesResponseData {
  meterSummary: MeterSummary;
  communicationLogs: CommunicationLogs[];
  eventLogs: EventLog[];
  schedulerRate: ScheduleRate;
  communicationReport: CommunicationReport[];
}

export interface HesDashboardApiResponse {
  responsecode: string;
  responsedesc?: string;
  responsedata: HesResponseData
}
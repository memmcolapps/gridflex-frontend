export interface SetCTPTRatioPayload {
  serials: string;
  ctNumerator: number;
  ctDenominator: number;
  ptNumerator: number;
  ptDenominator: number;
}

export interface SetAPNPayload {
  serials: string;
  apn: string;
}

export interface SetDateTimePayload {
  serials: string;
  dateTime: string;
}

export interface SetIpPortPayload {
  serials: string;
  ip: string;
  port: number;
}

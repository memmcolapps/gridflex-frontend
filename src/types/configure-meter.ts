export interface SetCTPTRatioPayload {
  serial: string;
  ctNumerator: number;
  ctDenominator: number;
  ptNumerator: number;
  ptDenominator: number;
}

export interface SetAPNPayload {
  serial: string;
  apn: string;
}

export interface SetDateTimePayload {
  serial: string;
  dateTime: string;
}

export interface SetIpPortPayload {
  serial: string;
  ip: string;
  port: number;
}

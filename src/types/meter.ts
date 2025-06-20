// components/meter-management/types.ts
export interface MetersData {
  id: string;
  meterNumber: string;
  simNumber?: string; // Optional, as not in initialMeterData
  meterType?: string;
  oldTariffIndex?: string;
  newTariffIndex?: string;
  oldsgc?: string;
  newsgc?: string;
  oldkrn?: string;
  newkrn?: string;
  meterManufacturer?: string;
  class?: string; // Optional, as not always required
  category?: string;
  accountNumber: string;
  tariff?: string;
  approvalStatus?: string;
  status?: string;
  firstName?: string;
  lastName?: string;
  nin?: string;
  phone?: string;
  email?: string;
  state?: string;
  city?: string;
  streetName?: string;
  houseNo?: string;
  reason?: string;
  customerId?: string; // Added to align with AssignMeterPage
  cin?: string;
  debitMop?: string; // Added for payment fields
  debitPaymentPlan?: string;
  creditMop?: string;
  creditPaymentPlan?: string;
}

export interface VirtualMeterData {
  id: string;
  customerId: string;
  meterNumber: string;
  accountNumber: string;
  feeder?: string; // Optional, as it may be set later
  dss?: string;
  category?: string;
  cin?: string;
  tariff?: string;
  status?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  state?: string;
  city?: string;
  streetName?: string;
  houseNo?: string;
  reason?: string;
  debitMop?: string; // Added for payment fields
  debitPaymentPlan?: string;
  creditMop?: string;
  creditPaymentPlan?: string;
}

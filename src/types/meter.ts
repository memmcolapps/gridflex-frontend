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
  energyType?: string;
  fixedEnergy?: string;
  custoType?: string;
  image?: File | null;
  consumptionType?: string; // Added for consumption type
}

// types.ts
export interface MeterData {
  id: string;
  meterNumber: string;
  manufactureName: string;
  class: string;
  meterType?: string;
  category: string;
  dateAdded?: string;
  oldSgc?: string;
  newSgc?: string;
  oldKrn?: string;
  newKrn?: string;
  oldTariffIndex?: string;
  newTariffIndex?: string;
  simNo?: string;
  smartMeter?: string;
  ctRatioNumerator?: string;
  ctRatioDenominator?: string;
  voltageRatioNumerator?: string;
  voltageRatioDenominator?: string;
  multiplier?: string;
  meterRating?: string;
  initialReading?: string;
  dial?: string;
  longitude?: string;
  latitude?: string;
  meterModel?: string;
  protocol?: string;
  authentication?: string;
  password?: string;
  customerId?: string | null;
  accountNumber?: string;
  tariff?: string;
  assignedStatus?: string;
  status?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  debitMop?: string; // Added for payment fields
  debitPaymentPlan?: string;
  creditPaymentPlan?: string;
  creditMop?: string;
  Image?: File;
  feeder?: string;
  dss?: string; // Optional, as not always required
  cin?: string;
  state?: string;
  city?: string;
  streetName?: string;
  houseNo?: string;
  approvedStatus?:string;
  meterStage?:string;
}
// types/meter.ts
export interface Meter {
    sN: string;
    meterNumber: string;
    simNo: string;
    businessHub: string;
    class: string;
    category: string;
    manufacturer: string;
    model: string;
    status: string;
    region: string;
    serviceCenter: string;
    feeder: string;
    transformer: string;
    lastSync: string;
}
export const nigerianStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

export const customerTypes = ["Prepaid", "Postpaid"];

export interface ReadingOption {
  label: string;
  children: { value: string; label: string }[];
}

export const MD_READING_OPTIONS: ReadingOption[] = [
  {
    label: "Product Information",
    children: [
      {
        value: "meter-logical-device-name",
        label: "Meter Logical Device Name",
      },
      { value: "meter-serial-number", label: "Meter Serial Number" },
      { value: "meter-hardware-version", label: "Meter Hardware Version" },
      { value: "meter-firmware-version", label: "Meter Firmware Version" },
      { value: "meter-firmware-checksum", label: "Meter Firmware Checksum" },
    ],
  },
  {
    label: "Clock",
    children: [{ value: "clock object", label: "Clock Object" }],
  },
  {
    label: "Energy",
    children: [
      {
        value: "Total absolute cumulative active energy register",
        label: "Total absolute cumulative active energy register",
      },
      {
        value: "T1 absolute cumulative active energy register",
        label: "T1 absolute cumulative active energy register",
      },
      {
        value: "T2 absolute cumulative active energy register",
        label: "T2 absolute cumulative active energy register",
      },
      {
        value: "T3 absolute cumulative active energy register",
        label: "T3 absolute cumulative active energy register",
      },
      {
        value: "T4 absolute cumulative active energy register",
        label: "T4 absolute cumulative active energy register",
      },
      {
        value: "Total import active energy register",
        label: "Total import active energy register",
      },
      {
        value: "T1 import active energy register",
        label: "T1 import active energy register",
      },
      {
        value: "T2 import active energy register",
        label: "T2 import active energy register",
      },
      {
        value: "T3 import active energy register",
        label: "T3 import active energy register",
      },
      {
        value: "T4 import active energy register",
        label: "T4 import active energy register",
      },
      {
        value: "Total export active energy register",
        label: "Total export active energy register",
      },
      {
        value: "T1 export active energy register",
        label: "T1 export active energy register",
      },
      {
        value: "T2 export active energy register",
        label: "T2 export active energy register",
      },
      {
        value: "T3 export active energy register",
        label: "T3 export active energy register",
      },
      {
        value: "T4 export active energy register",
        label: "T4 export active energy register",
      },
      {
        value: "Total import reactive energy register",
        label: "Total import reactive energy register",
      },
      {
        value: "T1 import reactive energy register",
        label: "T1 import reactive energy register",
      },
      {
        value: "T2 import reactive energy register",
        label: "T2 import reactive energy register",
      },
      {
        value: "T3 import reactive energy register",
        label: "T3 import reactive energy register",
      },
      {
        value: "T4 import reactive energy register",
        label: "T4 import reactive energy register",
      },
      {
        value: "Total export reactive energy register",
        label: "Total export reactive energy register",
      },
      {
        value: "T1 export reactive energy register",
        label: "T1 export reactive energy register",
      },
      {
        value: "T2 export reactive energy register",
        label: "T2 export reactive energy register",
      },
      {
        value: "T3 export reactive energy register",
        label: "T3 export reactive energy register",
      },
      {
        value: "T4 export reactive energy register",
        label: "T4 export reactive energy register",
      },
      {
        value: "Total QI reactive energy register",
        label: "Total QI reactive energy register",
      },
      {
        value: "Total QII reactive energy register",
        label: "Total QII reactive energy register",
      },
      {
        value: "Total QIII reactive energy register",
        label: "Total QIII reactive energy register",
      },
      {
        value: "Total QIV reactive energy register",
        label: "Total QIV reactive energy register",
      },
      {
        value: "Total import apparent energy register",
        label: "Total import apparent energy register",
      },
      {
        value: "Total export apparent energy register",
        label: "Total export apparent energy register",
      },
    ],
  },
  {
    label: "Maximum Demand",
    children: [
      {
        value: "Total import active maximum demand register",
        label: "Total import active maximum demand register",
      },
      {
        value: "T1 import active maximum demand register",
        label: "T1 import active maximum demand register",
      },
      {
        value: "T2 import active maximum demand register",
        label: "T2 import active maximum demand register",
      },
      {
        value: "T3 import active maximum demand register",
        label: "T3 import active maximum demand register",
      },
      {
        value: "T4 import active maximum demand register",
        label: "T4 import active maximum demand register",
      },
      {
        value: "Total export active maximum demand register",
        label: "Total export active maximum demand register",
      },
      {
        value: "T1 export active maximum demand register",
        label: "T1 export active maximum demand register",
      },
      {
        value: "T2 export active maximum demand register",
        label: "T2 export active maximum demand register",
      },
      {
        value: "T3 export active maximum demand register",
        label: "T3 export active maximum demand register",
      },
      {
        value: "T4 export active maximum demand register",
        label: "T4 export active maximum demand register",
      },
      {
        value: "Total import reactive maximum demand register",
        label: "Total import reactive maximum demand register",
      },
      {
        value: "T1 import reactive maximum demand register",
        label: "T1 import reactive maximum demand register",
      },
      {
        value: "T2 import reactive maximum demand register",
        label: "T2 import reactive maximum demand register",
      },
      {
        value: "T3 import reactive maximum demand register",
        label: "T3 import reactive maximum demand register",
      },
      {
        value: "T4 import reactive maximum demand register",
        label: "T4 import reactive maximum demand register",
      },
      {
        value: "Total export reactive maximum demand register",
        label: "Total export reactive maximum demand register",
      },
      {
        value: "T1 export reactive maximum demand register",
        label: "T1 export reactive maximum demand register",
      },
      {
        value: "T2 export reactive maximum demand register",
        label: "T2 export reactive maximum demand register",
      },
      {
        value: "T3 export reactive maximum demand register",
        label: "T3 export reactive maximum demand register",
      },
      {
        value: "T4 export reactive maximum demand register",
        label: "T4 export reactive maximum demand register",
      },
    ],
  },
  {
    label: "Instantaneous",
    children: [
      { value: "Frequency", label: "Frequency" },
      {
        value: "Sum Li import power factor",
        label: "Sum Li import power factor",
      },
      {
        value: "Sum Li Active power (abs(QI+QIV)+abs(QII+QIII))",
        label: "Sum Li Active power (abs(QI+QIV)+abs(QII+QIII))",
      },
      { value: "Sum Li Active power+ ", label: "Sum Li Active power+ " },
      { value: "Sum Li Active power- ", label: "Sum Li Active power- " },
      { value: "Sum Li Reactive power+ ", label: "Sum Li Reactive power+ " },
      { value: "Sum Li Reactive power- ", label: "Sum Li Reactive power- " },
      { value: "Sum Li Apparent power+ ", label: "Sum Li Apparent power+ " },
      { value: "Sum Li Apparent power- ", label: "Sum Li Apparent power- " },
      { value: "L1 Current ", label: "L1 Current " },
      { value: "L1 Voltage ", label: "L1 Voltage " },
      { value: "L1 import power factor ", label: "L1 import power factor " },
      { value: "L1 Active power+ ", label: "L1 Active power+ " },
      { value: "L1 Reactive power+", label: "L1 Reactive power+" },
      { value: "L1 Apparent power+ ", label: "L1 Apparent power+ " },
      {
        value: "L1 Current harmonic THD(%) ",
        label: "L1 Current harmonic THD(%) ",
      },
      {
        value: "L1 Voltage harmonic THD(%) ",
        label: "L1 Voltage harmonic THD(%) ",
      },
      { value: "L2 Current ", label: "L2 Current " },
      { value: "L2 Voltage ", label: "L2 Voltage " },
      { value: "L2 import power factor ", label: "L2 import power factor " },
      { value: "L2 Active power+ ", label: "L2 Active power+ " },
      { value: "L2 Reactive power+ ", label: "L2 Reactive power+ " },
      { value: "L2 Apparent power+ ", label: "L2 Apparent power+ " },
      {
        value: "L2 Current harmonic THD(%)",
        label: "L2 Current harmonic THD(%)",
      },
      {
        value: "L2 Voltage harmonic THD(%)",
        label: "L2 Voltage harmonic THD(%)",
      },
      { value: "L3 Current", label: "L3 Current" },
      { value: "L3 Voltage", label: "L3 Voltage" },
      { value: "L3 import power factor", label: "L3 import power factor" },
      { value: "L3 Active power+ ", label: "L3 Active power+ " },
      { value: "L3 Reactive power+ ", label: "L3 Reactive power+ " },
      { value: "L3 Apparent power+ ", label: "L3 Apparent power+ " },
      {
        value: "L3 Current harmonic THD(%)",
        label: "L3 Current harmonic THD(%)",
      },
      {
        value: "L3 Voltage harmonic THD(%)",
        label: "L3 Voltage harmonic THD(%)",
      },
      { value: "Neutral Current", label: "Neutral Current" },
      {
        value: "Phase Angle of U(L2) - U(L1)",
        label: "Phase Angle of U(L2) - U(L1)",
      },
      {
        value: "Phase Angle of U(L3) - U(L1)",
        label: "Phase Angle of U(L3) - U(L1)",
      },
      {
        value: "Phase Angle of U(L2) - U(L3)",
        label: "Phase Angle of U(L2) - U(L3)",
      },
      {
        value: "Phase Angle of U(L1) - I(L1)",
        label: "Phase Angle of U(L1) - I(L1)",
      },
      {
        value: "Phase Angle of U(L2) - I(L2)",
        label: "Phase Angle of U(L2) - I(L2)",
      },
      {
        value: "Phase Angle of U(L3) - I(L3)",
        label: "Phase Angle of U(L3) - I(L3)",
      },
    ],
  },
  {
    label: "Event count",
    children: [
      {
        value: "Counter of demand reset",
        label: "Counter of demand reset",
      },
      {
        value: "Counter of meter cover open",
        label: "Counter of meter cover open",
      },
      {
        value: "Counter of terminal cover open",
        label: "Counter of terminal cover open",
      },
      {
        value: "Counter of strong DC magnetic field",
        label: "Counter of strong DC magnetic field",
      },
    ],
  },
  {
    label: "Relay",
    children: [
      { value: "Control mode", label: "Control mode" },
      { value: "relay state", label: "relay state" },
      { value: "control state", label: "control state" },
      { value: "Disconnect", label: "Disconnect" },
      { value: "Connect", label: "Connect" },
    ],
  },
  {
    label: "Daily Billing",
    children: [
      { value: "Daily Billing Channel ", label: "Daily Billing Channel " },
      {
        value: "Date_time of Daily Billing",
        label: "Date_time of Daily Billing",
      },
    ],
  },
  {
    label: "Monthly Billing",
    children: [
      { value: "Monthly Billing Channel", label: "Monthly Billing Channel" },
      {
        value: "Date_time of Monthly Billing",
        label: "Date_time of Monthly Billing",
      },
    ],
  },
  {
    label: "Event",
    children: [
      { value: "Standard Event Logs", label: "Standard Event Logs" },
      { value: "Fraud Event Logs", label: "Fraud Event Logs" },
      { value: "Control Event Logs", label: "Control Event Logs" },
      {
        value: "Recharge Token Event Logs",
        label: "Recharge Token Event Logs",
      },
      { value: "Power Grid Event Logs", label: "Power Grid Event Logs" },
      { value: "ManageToken Event Logs", label: "ManageToken Event Logs" },
    ],
  },
  {
    label: "Load Profile",
    children: [
      { value: "Load profile 1", label: "Load profile 1" },
      { value: "Load profile 2", label: "Load profile 2" },
    ],
  },
  {
    label: "GPRS Modem Setup",
    children: [
      { value: "GPRS modem setup (APN)", label: "GPRS modem setup (APN)" },
      {
        value: "Auto connect setup (IP & Port)",
        label: "Auto connect setup (IP & Port)",
      },
    ],
  },
  {
    label: "CT&PT Ratio",
    children: [
      { value: "Numerator of CT ratio", label: "Numerator of CT ratio" },
      { value: "Denominator of CT ratio", label: "Denominator of CT ratio" },
      { value: "Numerator of PT ratio", label: "Numerator of PT ratio" },
      { value: "Denominator of PT ratio", label: "Denominator of PT ratio" },
    ],
  },
  {
    label: "Threshold Parameters",
    children: [
      { value: "Threshold of voltage sag", label: "Threshold of voltage sag" },
      {
        value: "Time threshold of voltage sag",
        label: "Time threshold of voltage sag",
      },
      {
        value: "Threshold of voltage swell",
        label: "Threshold of voltage swell",
      },
      {
        value: "Time threshold of voltage swell",
        label: "Time threshold of voltage swell",
      },
      {
        value: "Threshold of over loading",
        label: "Threshold of over loading",
      },
      {
        value: "Time threshold of over loading",
        label: "Time threshold of over loading",
      },
      {
        value: "Time threshold of over loading end",
        label: "Time threshold of over loading end",
      },
      {
        value: "Thereshold of meter high temperature",
        label: "Thereshold of meter high temperature",
      },
      {
        value: "Time thereshold of meter high temperature recover",
        label: "Time thereshold of meter high temperature recover",
      },
    ],
  },
];

export const NON_MD_READING_OPTIONS: ReadingOption[] = [
  {
    label: "Product Information",
    children: [
      { value: "logical-device-name", label: "Logical Device Name" },
      { value: "meter-serial-number", label: "Meter Serial Number" },
      { value: "meter-hardware-version", label: "Meter Hardware Version" },
      { value: "firmware-version", label: "Firmware Version" },
      { value: "firmware-checksum", label: "Firmware Checksum" },
    ],
  },
  {
    label: "Clock",
    children: [{ value: "clock object", label: "Clock Object" }],
  },
  {
    label: "Energy",
    children: [
      {
        value: "Total absolute active kWh",
        label: "Total absolute active kWh",
      },
      {
        value: "T1 absolute active kWh",
        label: "T1 absolute active kWh",
      },
      {
        value: "T2 absolute active kWh",
        label: "T2 absolute active kWh",
      },
      {
        value: "T3 absolute active kWh",
        label: "T3 absolute active kWh",
      },
      {
        value: "T4 absolute active kWh",
        label: "T4 absolute active kWh",
      },
      {
        value: "Total algebraic active kWh",
        label: "Total algebraic active kWh",
      },
      {
        value: "T1 algebraic active kWh",
        label: "T1 algebraic active kWh",
      },
      {
        value: "T2 algebraic active kWh",
        label: "T2 algebraic active kWh",
      },
      {
        value: "T3 algebraic active kWh",
        label: "T3 algebraic active kWh",
      },
      {
        value: "T4 algebraic active kWh",
        label: "T4 algebraic active kWh",
      },
      {
        value: "Total import active kWh",
        label: "Total import active kWh",
      },
      {
        value: "T1 import active kWh",
        label: "T1 import active kWh",
      },
      {
        value: "T2 import active kWh",
        label: "T2 import active kWh",
      },
      {
        value: "T3 import active kWh",
        label: "T3 import active kWh",
      },
      {
        value: "T4 import active kWh",
        label: "T4 import active kWh",
      },
      {
        value: "Total export active kWh",
        label: "Total export active kWh",
      },
      {
        value: "T1 export active kWh",
        label: "T1 export active kWh",
      },
      {
        value: "T2 export active kWh",
        label: "T2 export active kWh",
      },
      {
        value: "T3 export active kWh",
        label: "T3 export active kWh",
      },
      {
        value: "T4 export active kWh",
        label: "T4 export active kWh",
      },
      {
        value: "Total import reactive kVAh",
        label: "Total import reactive kVAh",
      },
      {
        value: "T1 import reactive kVAh",
        label: "T1 import reactive kVAh",
      },
      {
        value: "T2 import reactive kVAh",
        label: "T2 import reactive kVAh",
      },
      {
        value: "T3 import reactive kVAh",
        label: "T3 import reactive kVAh",
      },
      {
        value: "T4 import reactive kVAh",
        label: "T4 import reactive kVAh",
      },
      {
        value: "Total export reactive kVAh",
        label: "Total export reactive kVAh",
      },
      {
        value: "T1 export reactive kVAh",
        label: "T1 export reactive kVAh",
      },
      {
        value: "T2 export reactive kVAh",
        label: "T2 export reactive kVAh",
      },
      {
        value: "T3 export reactive kVAh",
        label: "T3 export reactive kVAh",
      },
      {
        value: "T4 export reactive kVAh",
        label: "T4 export reactive kVAh",
      },
      {
        value: "Total import apparent kVAh",
        label: "Total import apparent kVAh",
      },
      {
        value: "T1 import apparent kVAh",
        label: "T1 import apparent kVAh",
      },
      {
        value: "T2 import apparent kVAh",
        label: "T2 import apparent kVAh",
      },
      {
        value: "T3 import apparent kVAh",
        label: "T3 import apparent kVAh",
      },
      {
        value: "T4 import apparent kVAh",
        label: "T4 import apparent kVAh",
      },
      {
        value: "Total export apparent kVAh",
        label: "Total export apparent kVAh",
      },
      {
        value: "T1 export apparent kVAh",
        label: "T1 export apparent kVAh",
      },
      {
        value: "T2 export apparent kVAh",
        label: "T2 export apparent kVAh",
      },
      {
        value: "T3 export apparent kVAh",
        label: "T3 export apparent kVAh",
      },
      {
        value: "T4 export apparent kVAh",
        label: "T4 export apparent kVAh",
      },
    ],
  },
  {
    label: "Maximum Demand",
    children: [
      {
        value: "Total import active MD (kW) /(Datetime)",
        label: "Total import active MD (kW) /(Datetime)",
      },
      {
        value: "T1 import active MD (kW) /(Datetime)",
        label: "T1 import active MD (kW) /(Datetime)",
      },
      {
        value: "T2 import active MD (kW) /(Datetime)",
        label: "T2 import active MD (kW) /(Datetime)",
      },
      {
        value: "T3 import active MD (kW) /(Datetime)",
        label: "T3 import active MD (kW) /(Datetime)",
      },
      {
        value: "T4 import active MD (kW) /(Datetime)",
        label: "T4 import active MD (kW) /(Datetime)",
      },
      {
        value: "Total export active MD (kW) /(Datetime)",
        label: "Total export active MD (kW) /(Datetime)",
      },
      {
        value: "T1 export active MD (kW) /(Datetime)",
        label: "T1 export active MD (kW) /(Datetime)",
      },
      {
        value: "T2 export active MD (kW) /(Datetime)",
        label: "T2 export active MD (kW) /(Datetime)",
      },
      {
        value: "T3 export active MD (kW) /(Datetime)",
        label: "T3 export active MD (kW) /(Datetime)",
      },
      {
        value: "T4 export active MD (kW) /(Datetime)",
        label: "T4 export active MD (kW) /(Datetime)",
      },
      {
        value: "Total import reactive MD (kvar) /(Datetime)",
        label: "Total import reactive MD (kvar) /(Datetime)",
      },
      {
        value: "T1 import reactive MD (kvar) /(Datetime)",
        label: "T1 import reactive MD (kvar) /(Datetime)",
      },
      {
        value: "T2 import reactive MD (kvar) /(Datetime)",
        label: "T2 import reactive MD (kvar) /(Datetime)",
      },
      {
        value: "T3 import reactive MD (kvar) /(Datetime)",
        label: "T3 import reactive MD (kvar) /(Datetime)",
      },
      {
        value: "T4 import reactive MD (kvar) /(Datetime)",
        label: "T4 import reactive MD (kvar) /(Datetime)",
      },
      {
        value: "Total export reactive MD (kvar) /(Datetime)",
        label: "Total export reactive MD (kvar) /(Datetime)",
      },
      {
        value: "T1 export reactive MD (kvar) /(Datetime)",
        label: "T1 export reactive MD (kvar) /(Datetime)",
      },
      {
        value: "T2 export reactive MD (kvar) /(Datetime)",
        label: "T2 export reactive MD (kvar) /(Datetime)",
      },
      {
        value: "T3 export reactive MD (kvar) /(Datetime)",
        label: "T3 export reactive MD (kvar) /(Datetime)",
      },
      {
        value: "T4 export reactive MD (kvar) /(Datetime)",
        label: "T4 export reactive MD (kvar) /(Datetime)",
      },

      {
        value: "Total import apparent MD (kVA) /(Datetime)",
        label: "Total import apparent MD (kVA) /(Datetime)",
      },
      {
        value: "T1 import apparent MD (kVA) /(Datetime)",
        label: "T1 import apparent MD (kVA) /(Datetime)",
      },
      {
        value: "T2 import apparent MD (kVA) /(Datetime)",
        label: "T2 import apparent MD (kVA) /(Datetime)",
      },
      {
        value: "T3 import apparent MD (kVA) /(Datetime)",
        label: "T3 import apparent MD (kVA) /(Datetime)",
      },
      {
        value: "T4 import apparent MD (kVA) /(Datetime)",
        label: "T4 import apparent MD (kVA) /(Datetime)",
      },
      {
        value: "Total export apparent MD (kVA) /(Datetime)",
        label: "Total export apparent MD (kVA) /(Datetime)",
      },
      {
        value: "T1 export apparent MD (kVA) /(Datetime)",
        label: "T1 export apparent MD (kVA) /(Datetime)",
      },
      {
        value: "T2 export apparent MD (kVA) /(Datetime)",
        label: "T2 export apparent MD (kVA) /(Datetime)",
      },
      {
        value: "T3 export apparent MD (kVA) /(Datetime)",
        label: "T3 export apparent MD (kVA) /(Datetime)",
      },
      {
        value: "T4 export apparent MD (kVA) /(Datetime)",
        label: "T4 export apparent MD (kVA) /(Datetime)",
      },
    ],
  },
  {
    label: "Instantaneous",
    children: [
      { value: "Frequency (Hz)", label: "Frequency (Hz)" },
      {
        value: "Sum Li total  power factor",
        label: "Sum Li total  power factor",
      },
      {
        value: "Sum Li total  active power (kW) ",
        label: "Sum Li total  active power (kW) ",
      },
      {
        value: "Sum Li import  active power (kW) ",
        label: "Sum Li import  active power (kW) ",
      },
      {
        value: "Sum Li export  active power (kW) ",
        label: "Sum Li export  active power (kW) ",
      },
      {
        value: "Sum Li import  reactive power (kvar) ",
        label: "Sum Li import  reactive power (kvar) ",
      },
      {
        value: "Sum Li export  reactive power (kvar) ",
        label: "Sum Li export  reactive power (kvar) ",
      },
      {
        value: "Sum Li import  apparent power (kVA)  ",
        label: "Sum Li import  apparent power (kVA)  ",
      },
      {
        value: "Sum Li export  apparent power (kVA)  ",
        label: "Sum Li export  apparent power (kVA)  ",
      },
      { value: "L1 Current (A)", label: "L1 Current (A)" },
      { value: "L1 Voltage (V)", label: "L1 Voltage (V)" },
      {
        value: "L1 Current harmonic THD(%) ",
        label: "L1 Current harmonic THD(%) ",
      },
      {
        value: "L1 Voltage harmonic THD(%) ",
        label: "L1 Voltage harmonic THD(%) ",
      },
      {
        value: "L1 total power factor ",
        label: "L1 total power factor ",
      },
      {
        value: "L1 total active power (kW) ",
        label: "L1 total active power (kW) ",
      },
      {
        value: "L1 import active power (kvar) ",
        label: "L1 import active power (kvar) ",
      },
      {
        value: "L1 import reactive power (kvar)",
        label: "L1 import reactive power (kvar)",
      },
      {
        value: "L1 import apparent power (kvar)",
        label: "L1 import apparent power (kvar)",
      },

      { value: "L2 Current (A)", label: "L2 Current (A)" },
      { value: "L2 Voltage (V)", label: "L2 Voltage (V)" },
      {
        value: "L2 Current harmonic THD(%)",
        label: "L2 Current harmonic THD(%)",
      },
      {
        value: "L2 Voltage harmonic THD(%)",
        label: "L2 Voltage harmonic THD(%)",
      },

      {
        value: "L2 total power factor ",
        label: "L2 total power factor ",
      },
      {
        value: "L2 total active power (kW) ",
        label: "L2 total active power (kW) ",
      },
      {
        value: "L2 import active power (kvar) ",
        label: "L2 import active power (kvar) ",
      },
      {
        value: "L2 import reactive power (kvar)",
        label: "L2 import reactive power (kvar)",
      },
      {
        value: "L2 import apparent power (kvar)",
        label: "L2 import apparent power (kvar)",
      },

      { value: "L3 Current (A)", label: "L3 Current (A)" },
      { value: "L3 Voltage (V)", label: "L3 Voltage (V)" },
      {
        value: "L3 Current harmonic THD(%)",
        label: "L3 Current harmonic THD(%)",
      },
      {
        value: "L3 Voltage harmonic THD(%)",
        label: "L3 Voltage harmonic THD(%)",
      },

      {
        value: "L3 total power factor ",
        label: "L3 total power factor ",
      },
      {
        value: "L3 total active power (kW) ",
        label: "L3 total active power (kW) ",
      },
      {
        value: "L3 import active power (kvar) ",
        label: "L3 import active power (kvar) ",
      },
      {
        value: "L3 import reactive power (kvar)",
        label: "L3 import reactive power (kvar)",
      },
      {
        value: "L3 import apparent power (kvar)",
        label: "L3 import apparent power (kvar)",
      },

      { value: "Neutral Current (A)", label: "Neutral Current (A)" },
      {
        value: "Phase Angle U(L2) - U(L1) (°)",
        label: "Phase Angle U(L2) - U(L1) (°)",
      },
      {
        value: "Phase Angle U(L3) - U(L1) (°)",
        label: "Phase Angle U(L3) - U(L1) (°)",
      },
      {
        value: "Phase Angle U(L2) - U(L3) (°)",
        label: "Phase Angle U(L2) - U(L3) (°)",
      },
      {
        value: "Phase Angle U(L1) - I(L1) (°)",
        label: "Phase Angle U(L1) - I(L1) (°)",
      },
      {
        value: "Phase Angle U(L2) - I(L2) (°)",
        label: "Phase Angle U(L2) - I(L2) (°)",
      },
      {
        value: "Phase Angle U(L3) - I(L3) (°)",
        label: "Phase Angle U(L3) - I(L3) (°)",
      },
      {
        value: "Actual quadrant",
        label: "Actual quadrant",
      },
      {
        value: "Ambient temperature (°C) ",
        label: "Ambient temperature (°C) ",
      },
      {
        value: "Battery voltage (V)",
        label: "Battery voltage (V)",
      },
      {
        value: "Battery installation date and time",
        label: "Battery installation date and time",
      },
      {
        value: "Battery estimated remaining capacity (%)",
        label: "Battery estimated remaining capacity (%)",
      },
    ],
  },
  {
    label: "Event count",
    children: [
      {
        value: "Counter of programming",
        label: "Counter of programming",
      },
      {
        value: "Counter of clock adjusted",
        label: "Counter of clock adjusted",
      },
      {
        value: "Counter of demand reset",
        label: "Counter of demand reset",
      },
      {
        value: "Counter of meter cover open",
        label: "Counter of meter cover open",
      },
      {
        value: "Counter of terminal cover open",
        label: "Counter of terminal cover open",
      },
      {
        value: "Counter of module cover open",
        label: "Counter of module cover open",
      },
      {
        value: "Counter of strong DC magnetic field",
        label: "Counter of strong DC magnetic field",
      },
      {
        value: "Total counter of Tamper",
        label: "Total counter of Tamper",
      },
      {
        value: "Counter of overloading",
        label: "Counter of overloading",
      },
      {
        value: "Counter of low power factor",
        label: "Counter of low power factor",
      },
      {
        value: "Counter of relay remote disconnected",
        label: "Counter of relay remote disconnected",
      },
      {
        value: "Counter of relay remote connected",
        label: "Counter of relay remote connected",
      },
      {
        value: "Counter of relay local disconnected",
        label: "Counter of relay local disconnected",
      },
      {
        value: "Counter of relay local connected",
        label: "Counter of relay local connected",
      },
      {
        value: "Counter of L1 under  voltage",
        label: "Counter of L1 under  voltage",
      },
      {
        value: "Counter of L2 under  voltage",
        label: "Counter of L2 under  voltage",
      },
      {
        value: "Counter of L3 under  voltage",
        label: "Counter of L3 under  voltage",
      },
      {
        value: "Counter of L1 over  voltage",
        label: "Counter of L1 over  voltage",
      },
      {
        value: "Counter of L2 over  voltage",
        label: "Counter of L2 over  voltage",
      },
      {
        value: "Counter of L3 over  voltage",
        label: "Counter of L3 over  voltage",
      },
      {
        value: "Counter of power failures",
        label: "Counter of power failures",
      },
      {
        value: "Counter of L1 current reverse",
        label: "Counter of L1 current reverse",
      },
      {
        value: "Counter of L2 current reverse",
        label: "Counter of L2 current reverse",
      },
      {
        value: "Counter of L3 current reverse",
        label: "Counter of L3 current reverse",
      },
    ],
  },
  {
    label: "Relay",
    children: [
      { value: "Main disconnector", label: "Main disconnector" },
      { value: "Relay operations reason", label: "Relay operations reason" },
    ],
  },
  {
    label: "Daily Billing",
    children: [
      { value: "Daily Billing Channel ", label: "Daily Billing Channel " },
      {
        value: "Date_time of Daily Billing",
        label: "Date_time of Daily Billing",
      },
    ],
  },
  {
    label: "Monthly Billing",
    children: [
      { value: "Monthly Billing Channel", label: "Monthly Billing Channel" },
      {
        value: "Date_time of Monthly Billing",
        label: "Date_time of Monthly Billing",
      },
      { value: "Billing period counter", label: "Billing period counter" },
      {
        value: "Billing period reset lockout time (Min)",
        label: "Billing period reset lockout time (Min)",
      },
      {
        value: "Current month cumulative running hours",
        label: "Current month cumulative running hours",
      },
    ],
  },
  {
    label: "Event",
    children: [
      { value: "Standard Event Logs", label: "Standard Event Logs" },
      { value: "Fraud Event Logs", label: "Fraud Event Logs" },
      { value: "Control Event Logs", label: "Control Event Logs" },
      {
        value: "Recharge Token Event Logs",
        label: "Recharge Token Event Logs",
      },
      { value: "Power Grid Event Logs", label: "Power Grid Event Logs" },
      { value: "ManageToken Event Logs", label: "ManageToken Event Logs" },
    ],
  },
  {
    label: "Load Profile",
    children: [
      { value: "Load profile 1", label: "Load profile 1" },
      { value: "Load profile 2", label: "Load profile 2" },
      { value: "Load profile 3", label: "Load profile 3" },
      { value: "Load profile 4", label: "Load profile 4" },
      { value: "Load profile 5", label: "Load profile 5" },
      { value: "Load profile 6", label: "Load profile 6" },
    ],
  },
  {
    label: "GPRS Modem Setup",
    children: [
      { value: "GPRS modem setup (APN)", label: "GPRS modem setup (APN)" },
      {
        value: "Auto connect setup (IP & Port)",
        label: "Auto connect setup (IP & Port)",
      },
    ],
  },
  {
    label: "Prepayment Energy Registers",
    children: [
      { value: "Balance (kWh)", label: "Balance (kWh)" },
      { value: "Estimated remaining days", label: "Estimated remaining days" },
      { value: "Total Recharged Amount", label: "Total Recharged Amount" },
      { value: "Actual recharged amount(kWh)", label: "Actual recharged amount(kWh)" },
      { value: "Maximum accumulative amount (kWh)", label: "Maximum accumulative amount (kWh)" },
      { value: "Alarm Level 1 of remainder days", label: "Alarm Level 1 of remainder days" },
      { value: "Alarm Level 2 of remainder days", label: "Alarm Level 2 of remainder days" },
      { value: "Alarm Level 3 of remainder days", label: "Alarm Level 3 of remainder days" },

    ],
  },
  {
    label: "CT&PT Ratio",
    children: [
      { value: "Numerator of CT ratio", label: "Numerator of CT ratio" },
      { value: "Denominator of CT ratio", label: "Denominator of CT ratio" },
      { value: "Numerator of PT ratio", label: "Numerator of PT ratio" },
      { value: "Denominator of PT ratio", label: "Denominator of PT ratio" },
    ],
  },
  {
    label: "TOU Tariff",
    children: [
      { value: "Actual tariff indicator", label: "Actual tariff indicator" },
      { value: "Activity calendar setup", label: "Activity calendar setup" },
      { value: "Special days table", label: "Special days table" },
    ],
  },
  {
    label: "Threshold Parameters",
    children: [
      { value: "Maximum Demand-period (s)", label: "Maximum Demand-period (s)" },
      {
        value: "Maximum Demand- Number of periods",
        label: "Maximum Demand- Number of periods",
      },
      {
        value: "Threshold of under voltage (V)",
        label: "Threshold of under voltage (V)",
      },
      {
        value: "Time threshold of under voltage (s)",
        label: "Time threshold of under voltage (s)",
      },
      {
        value: "Threshold of swell voltage (V)",
        label: "Threshold of swell voltage (V)",
      },
      {
        value: "Time threshold of swell voltage (s)",
        label: "Time threshold of swell voltage (s)",
      },
      {
        value: "Threshold of overloading (W)",
        label: "Threshold of overloading (W)",
      },
      {
        value: "Time threshold of overloading (s)",
        label: "Time threshold of overloading (s)",
      },
       {
        value: "Time threshold of overloading stop (s)",
        label: "Time threshold of overloading stop (s)",
      },
       {
        value: "Time threshold of overloading recover  (s)",
        label: "Time threshold of overloading recover  (s)",
      },
      {
        value: "Threshold of meter high temperature (°C)",
        label: "Threshold of meter high temperature (°C)",
      },
    ],
  },
  {
    label: "Firmware upgrade",
    children: [
      { value: "Firmware upgrade", label: "Firmware upgrade" },
    ],
  },
];

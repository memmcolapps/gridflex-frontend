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
    children: [
      { value: "clock", label: "Clock" },
      { value: "timezone", label: "Time Zone" },
    ],
  },
  {
    label: "Energy",
    children: [
      {
        value: "Active energy Import (+A)",
        label: "Active energy Import (+A)",
      },
      {
        value: "Active energy Import (+A) of public grid ",
        label: "Active energy Import (+A) of public grid ",
      },
      {
        value: "Active energy Import (+A) of private grid",
        label: "Active energy Import (+A) of private grid",
      },
      {
        value: "Active energy Export (-A)",
        label: "Active energy Export (-A)",
      },
      {
        value: "Active energy Export (-A) of public grid ",
        label: "Active energy Export (-A) of public grid ",
      },
      {
        value: "Active energy Export (-A) of private grid",
        label: "Active energy Export (-A) of private grid",
      },
      {
        value: "Reactive energy Import (+A)",
        label: "Reactive energy Import (+A)",
      },
      {
        value: "Reactive energy Import (+A) of public grid ",
        label: "Reactive energy Import (+A) of public grid ",
      },
      {
        value: "Reactive energy Import (+A) of private grid",
        label: "Reactive energy Import (+A) of private grid",
      },
      {
        value: "Reactive energy Export (-A)",
        label: "Reactive energy Export (-A)",
      },
      {
        value: "Reactive energy Export (-A) of public grid ",
        label: "Reactive energy Export (-A) of public grid ",
      },
      {
        value: "Reactive energy Export (-A) of private grid",
        label: "Reactive energy Export (-A) of private grid",
      },
    ],
  },
  {
    label: "Maximum Demand",
    children: [
      {
        value: " Active energy import (+A) && occurring time",
        label: " Active energy import (+A) && occurring time",
      },
      {
        value: "Active energy import (+A) && occurring time of public grid ",
        label: "Active energy import (+A) && occurring time of public grid ",
      },
      {
        value: "Active energy import (+A) && occurring time of private grid",
        label: "Active energy import (+A) && occurring time of private grid",
      },
      {
        value: "Active energy export (-A) && occurring time",
        label: "Active energy export (-A) && occurring time",
      },
      {
        value: "Active energy export (-A) && occurring time of public grid ",
        label: "Active energy export (-A) && occurring time of public grid ",
      },
      {
        value: "Active energy export (-A) && occurring time of private grid",
        label: "Active energy export (-A) && occurring time of private grid",
      },
      {
        value: "Reactive energy import (+A) && occurring time",
        label: "Reactive energy import (+A) && occurring time",
      },
      {
        value: " Reactive energy import (+A) && occurring time of public grid ",
        label: " Reactive energy import (+A) && occurring time of public grid ",
      },
      {
        value: "Reactive energy import (+A) && occurring time of private grid",
        label: "Reactive energy import (+A) && occurring time of private grid",
      },
      {
        value: "Reactive energy export (-A) && occurring time",
        label: "Reactive energy export (-A) && occurring time",
      },
      {
        value: "Reactive energy export (-A) && occurring time of public grid ",
        label: "Reactive energy export (-A) && occurring time of public grid ",
      },
      {
        value: "Reactive energy export (-A) && occurring time of private grid",
        label: "Reactive energy export (-A) && occurring time of private grid",
      },
      {
        value: "Apparent energy import (+A) && occurring time",
        label: "Apparent energy import (+A) && occurring time",
      },
      {
        value: "Apparent energy import (+A) && occurring time of public grid ",
        label: "Apparent energy import (+A) && occurring time of public grid ",
      },
      {
        value: "Apparent energy import (+A) && occurring time of private grid",
        label: "Apparent energy import (+A) && occurring time of private grid",
      },
      {
        value: "Apparent energy export (-A) && occurring time",
        label: "Apparent energy export (-A) && occurring time",
      },
      {
        value: "Apparent energy export (-A) && occurring time of public grid ",
        label: "Apparent energy export (-A) && occurring time of public grid ",
      },
      {
        value: "Apparent energy export (-A) && occurring time of private grid",
        label: "Apparent energy export (-A) && occurring time of private grid",
      },
    ],
  },
  {
    label: "Instantaneous",
    children: [
      { value: "Voltage in phase L1", label: "Voltage in phase L1" },
      {
        value: "Voltage in phase L2",
        label: "Voltage in phase L2",
      },
      {
        value: "Voltage in phase L3 ",
        label: "Voltage in phase L3 ",
      },
      {
        value: "Current in phase L1",
        label: "Current in phase L1",
      },
      {
        value: "Current in phase L2",
        label: "Current in phase L2",
      },
      {
        value: "Current in phase L3",
        label: "Current in phase L3",
      },
      {
        value: "Neutral Current",
        label: "Neutral Current",
      },
      {
        value: "Frequency",
        label: "Frequency",
      },
      {
        value: "Total active power",
        label: "Total active power",
      },
      { value: "Active power in phase L1", label: "Active power in phase L1" },
      { value: "Active power in phase L2", label: "Active power in phase L2" },
      {
        value: "Active power in phase L3",
        label: "Active power in phase L3",
      },
      {
        value: "Total reactive power",
        label: "Total reactive power",
      },
      {
        value: "Reactive power in phase L1",
        label: "Reactive power in phase L1",
      },
      {
        value: "Reactive power in phase L2",
        label: "Reactive power in phase L2",
      },
      {
        value: "Reactive power in phase L3",
        label: "Reactive power in phase L3",
      },
      {
        value: "Total apparent power ",
        label: "Total apparent power ",
      },
      {
        value: "Apparent power in phase L1",
        label: "Apparent power in phase L1",
      },

      {
        value: "Apparent power in phase L2",
        label: "Apparent power in phase L2",
      },
      {
        value: "Apparent power in phase L3",
        label: "Apparent power in phase L3",
      },
      {
        value: "L2 Current harmonic THD(%)",
        label: "L2 Current harmonic THD(%)",
      },
      {
        value: "Total power factor",
        label: "Total power factor",
      },

      {
        value: "Power factor in phase L1",
        label: "Power factor in phase L1",
      },
      {
        value: "Power factor in phase L2",
        label: "Power factor in phase L2",
      },
      {
        value: "Power factor in phase L3",
        label: "Power factor in phase L3",
      },
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
      {
        value: "Actual recharged amount(kWh)",
        label: "Actual recharged amount(kWh)",
      },
      {
        value: "Maximum accumulative amount (kWh)",
        label: "Maximum accumulative amount (kWh)",
      },
      {
        value: "Alarm Level 1 of remainder days",
        label: "Alarm Level 1 of remainder days",
      },
      {
        value: "Alarm Level 2 of remainder days",
        label: "Alarm Level 2 of remainder days",
      },
      {
        value: "Alarm Level 3 of remainder days",
        label: "Alarm Level 3 of remainder days",
      },
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
    label: "Firmware upgrade",
    children: [{ value: "Firmware upgrade", label: "Firmware upgrade" }],
  },

  {
    label: "Others",
    children: [
      { value: "Public Grid Credit ", label: "Public Grid Credit " },
      {
        value: "Private Grid Credit ",
        label: "Private Grid Credit ",
      },
      {
        value: "Tariff index",
        label: "Tariff index",
      },
      {
        value: "Public Grid  SGC code",
        label: "Public Grid  SGC code",
      },
      {
        value: "Private Grid  SGC code",
        label: "Private Grid  SGC code",
      },
      {
        value: "Public Grid Cumulative power purchase credit [kWh]",
        label: "Public Grid Cumulative power purchase credit [kWh]",
      },
      {
        value: "Private Grid Cumulative power purchase credit [kWh]",
        label: "Private Grid Cumulative power purchase credit [kWh]",
      },
      {
        value: "Current month consumed credit [kWh]",
        label: "Current month consumed credit [kWh]",
      },
      {
        value: "Maximum vend limit [kWh]",
        label: "Maximum vend limit [kWh]",
      },
    ],
  },
];

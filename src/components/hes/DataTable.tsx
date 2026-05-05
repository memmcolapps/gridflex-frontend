import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "../ui/card";
import { LoadingAnimation } from "@/components/ui/loading-animation";

interface MeterData {
  [key: string]: string;
  meter: string;
  time: string;
}

interface DataTableProps {
  data: MeterData[];
  reading: string[];
  loading: boolean;
}

const readingLabels: Record<string, string> = {
  "meter-logical-device-name": "Meter Logical Device Name",
  "meter-serial-number": "Meter Serial Number",
  "meter-hardware-version": "Meter Hardware Version",
  "meter-firmware-version": "Meter Firmware Version",
  "meter-firmware-checksum": "Meter Firmware Checksum",
  "clock object": "Clock Object",
  "Total absolute cumulative active energy register":
    "Total absolute cumulative active energy register",
  "T1 absolute cumulative active energy register":
    "T1 absolute cumulative active energy register",
  "T3 absolute cumulative active energy register":
    "T3 absolute cumulative active energy register",
  "T4 absolute cumulative active energy register":
    "T4 absolute cumulative active energy register",
  "Total import active energy register": "Total import active energy register",
  "T1 import active energy register": "T1 import active energy register",
  "T2 import active energy register": "T2 import active energy register",
  "T3 import active energy register": "T3 import active energy register",
  "T4 import active energy register": "T4 import active energy register",
  "Total export active energy register": "Total export active energy register",
  "T1 export active energy register": "T1 export active energy register",
  "T2 export active energy register": "T2 export active energy register",
  "T3 export active energy register": "T3 export active energy register",
  "Total import reactive energy register":
    "Total import reactive energy register",
  "T1 import reactive energy register": "T1 import reactive energy register",
  "T2 import reactive energy register": "T2 import reactive energy register",
  "T3 import reactive energy register": "T3 import reactive energy register",
  "T4 import reactive energy register": "T4 import reactive energy register",
  "Total QI reactive energy register": "Total QI reactive energy register",
  "Total QII reactive energy register": "Total QII reactive energy register",
  "Total QIII reactive energy register": "Total QIII reactive energy register",
  "Total QIV reactive energy register": "Total QIV reactive energy register",
  "Total import apparent energy register":
    "Total import apparent energy register",
  "Total export apparent energy register":
    "Total export apparent energy register",
  "Total import active maximum demand register":
    "Total import active maximum demand register",
  "T1 import active maximum demand register":
    "T1 import active maximum demand register",
  "T2 import active maximum demand register":
    "T2 import active maximum demand register",
  "T3 import active maximum demand register":
    "T3 import active maximum demand register",
  "T4 import active maximum demand register":
    "T4 import active maximum demand register",
  "Total export active maximum demand register":
    "Total export active maximum demand register",
  "T1 export active maximum demand register":
    "T1 export active maximum demand register",
  "T2 export active maximum demand register":
    "T2 export active maximum demand register",
  "T3 export active maximum demand register":
    "T3 export active maximum demand register",
  "T4 export active maximum demand register":
    "T4 export active maximum demand register",
  "Total import reactive maximum demand register":
    "Total import reactive maximum demand register",
  "T1 import reactive maximum demand register":
    "T1 import reactive maximum demand register",
  "T2 import reactive maximum demand register":
    "T2 import reactive maximum demand register",
  "T3 import reactive maximum demand register":
    "T3 import reactive maximum demand register",
  "T4 import reactive maximum demand register":
    "T4 import reactive maximum demand register",
  "Total export reactive maximum demand register":
    "Total export reactive maximum demand register",
  "T1 export reactive maximum demand register":
    "T1 export reactive maximum demand register",
  "T2 export reactive maximum demand register":
    "T2 export reactive maximum demand register",
  "T3 export reactive maximum demand register":
    "T3 export reactive maximum demand register",
  "T4 export reactive maximum demand register":
    "T4 export reactive maximum demand register",
  Frequency: "Frequency",
  "Sum Li import power factor": "Sum Li import power factor",
  "Sum Li Active power (abs(QI+QIV)+abs(QII+QIII))":
    "Sum Li Active power (abs(QI+QIV)+abs(QII+QIII))",
  "Sum Li Active power+ ": "Sum Li Active power+ ",
  "Sum Li Active power- ": "Sum Li Active power- ",
  "Sum Li Reactive power+ ": "Sum Li Reactive power+ ",
  "Sum Li Reactive power- ": "Sum Li Reactive power- ",
  "Sum Li Apparent power+ ": "Sum Li Apparent power+ ",
  "Sum Li Apparent power- ": "Sum Li Apparent power- ",
  "L1 Current ": "L1 Current ",
  "L1 Voltage ": "L1 Voltage ",
  "L1 import power factor ": "L1 import power factor ",
  "L1 Active power+ ": "L1 Active power+ ",
  "L1 Reactive power+": "L1 Reactive power+",
  "L1 Apparent power+ ": "L1 Apparent power+ ",
  "L1 Current harmonic THD(%) ": "L1 Current harmonic THD(%) ",
  "L1 Voltage harmonic THD(%) ": "L1 Voltage harmonic THD(%) ",
  "L2 Current ": "L2 Current ",
  "L2 Voltage ": "L2 Voltage ",
  "L2 import power factor ": "L2 import power factor ",
  "L2 Active power+ ": "L2 Active power+ ",
  "L2 Reactive power+ ": "L2 Reactive power+ ",
  "L2 Apparent power+ ": "L2 Apparent power+ ",
  "L2 Current harmonic THD(%)": "L2 Current harmonic THD(%)",
  "L2 Voltage harmonic THD(%)": "L2 Voltage harmonic THD(%)",
  "L3 Current": "L3 Current",
  "L3 Voltage": "L3 Voltage",
  "L3 import power factor": "L3 import power factor",
  "L3 Active power+ ": "L3 Active power+ ",
  "L3 Reactive power+ ": "L3 Reactive power+ ",
  "L3 Apparent power+ ": "L3 Apparent power+ ",
  "L3 Current harmonic THD(%)": "L3 Current harmonic THD(%)",
  "L3 Voltage harmonic THD(%)": "L3 Voltage harmonic THD(%)",
  "Neutral Current": "Neutral Current",
  "Phase Angle of U(L2) - U(L1)": "Phase Angle of U(L2) - U(L1)",
  "Phase Angle of U(L3) - U(L1)": "Phase Angle of U(L3) - U(L1)",
  "Phase Angle of U(L2) - U(L3)": "Phase Angle of U(L2) - U(L3)",
  "Phase Angle of U(L1) - I(L1)": "Phase Angle of U(L1) - I(L1)",
  "Phase Angle of U(L2) - I(L2)": "Phase Angle of U(L2) - I(L2)",
  "Phase Angle of U(L3) - I(L3)": "Phase Angle of U(L3) - I(L3)",
  "Counter of demand reset": "Counter of demand reset",
  "Counter of meter cover open": "Counter of meter cover open",
  "Counter of terminal cover open": "Counter of terminal cover open",
  "Counter of strong DC magnetic field": "Counter of strong DC magnetic field",
  "Control mode": "Control mode",
  "relay state": "relay state",
  "control state": "control state",
  Disconnect: "Disconnect",
  Connect: "Connect",
  "Daily Billing Channel ": "Daily Billing Channel ",
  "Date_time of Daily Billing": "Date_time of Daily Billing",
  "Monthly Billing Channel": "Monthly Billing Channel",
  "Date_time of Monthly Billing": "Date_time of Monthly Billing",
  "Standard Event Logs": "Standard Event Logs",
  "Fraud Event Logs": "Fraud Event Logs",
  "Control Event Logs": "Control Event Logs",
  "Recharge Token Event Logs": "Recharge Token Event Logs",
  "Power Grid Event Logs": "Power Grid Event Logs",
  "ManageToken Event Logs": "ManageToken Event Logs",
  "Load profile 1": "Load profile 1",
  "Load profile 2": "Load profile 2",
  "GPRS modem setup (APN)": "GPRS modem setup (APN)",
  "Auto connect setup (IP & Port)": "Auto connect setup (IP & Port)",
  "Remaining Credit Amount": "Remaining Credit Amount",
  "Total Recharged Amount": "Total Recharged Amount",
  "Numerator of CT ratio": "Numerator of CT ratio",
  "Denominator of CT ratio": "Denominator of CT ratio",
  "Numerator of PT ratio": "Numerator of PT ratio",
  "Denominator of PT ratio": "Denominator of PT ratio",
  "Threshold Parameters": "Threshold Parameters",
  "Time threshold of voltage sag": "Time threshold of voltage sag",
  "Threshold of voltage swell": "Threshold of voltage swell",
  "Time threshold of voltage swell": "Time threshold of voltage swell",
  "Threshold of over loading": "Threshold of over loading",
  "Time threshold of over loading": "Time threshold of over loading",
  "Time threshold of over loading end": "Time threshold of over loading end",
  "Thereshold of meter high temperature":
    "Thereshold of meter high temperature",
  "Time thereshold of meter high temperature recover":
    "Time thereshold of meter high temperature recover",
  "logical-device-name": "Logical Device Name",

  "firmware-version": "Firmware Version",
  "firmware-checksum": "Firmware Checksum",
  "Total absolute active kWh": "Total absolute active kWh",

  "T1 absolute active kWh": "T1 absolute active kWh",

  "T2 absolute active kWh": "T2 absolute active kWh",

  "T3 absolute active kWh": "T3 absolute active kWh",

  "T4 absolute active kWh": "T4 absolute active kWh",

  "Total algebraic active kWh": "Total algebraic active kWh",

  "T1 algebraic active kWh": "T1 algebraic active kWh",

  "T2 algebraic active kWh": "T2 algebraic active kWh",

  "T3 algebraic active kWh": "T3 algebraic active kWh",

  "T4 algebraic active kWh": "T4 algebraic active kWh",

  "Total import active kWh": "Total import active kWh",

  "T1 import active kWh": "T1 import active kWh",

  "T2 import active kWh": "T2 import active kWh",

  "T3 import active kWh": "T3 import active kWh",

  "T4 import active kWh": "T4 import active kWh",

  "Total export active kWh": "Total export active kWh",

  "T1 export active kWh": "T1 export active kWh",

  "T2 export active kWh": "T2 export active kWh",

  "T3 export active kWh": "T3 export active kWh",

  "T4 export active kWh": "T4 export active kWh",

  "Total import reactive kVAh": "Total import reactive kVAh",

  "T1 import reactive kVAh": "T1 import reactive kVAh",

  "T2 import reactive kVAh": "T2 import reactive kVAh",

  "T3 import reactive kVAh": "T3 import reactive kVAh",

  "T4 import reactive kVAh": "T4 import reactive kVAh",

  "Total export reactive kVAh": "Total export reactive kVAh",

  "T1 export reactive kVAh": "T1 export reactive kVAh",

  "T2 export reactive kVAh": "T2 export reactive kVAh",

  "T3 export reactive kVAh": "T3 export reactive kVAh",

  "T4 export reactive kVAh": "T4 export reactive kVAh",

  "Total import apparent kVAh": "Total import apparent kVAh",

  "T1 import apparent kVAh": "T1 import apparent kVAh",

  "T2 import apparent kVAh": "T2 import apparent kVAh",

  "T3 import apparent kVAh": "T3 import apparent kVAh",

  "T4 import apparent kVAh": "T4 import apparent kVAh",

  "Total export apparent kVAh": "Total export apparent kVAh",

  "T1 export apparent kVAh": "T1 export apparent kVAh",

  "T2 export apparent kVAh": "T2 export apparent kVAh",

  "T3 export apparent kVAh": "T3 export apparent kVAh",

  "T4 export apparent kVAh": "T4 export apparent kVAh",

  "Total import active MD (kW) /(Datetime)":
    "Total import active MD (kW) /(Datetime)",

  "T1 import active MD (kW) /(Datetime)":
    "T1 import active MD (kW) /(Datetime)",

  "T2 import active MD (kW) /(Datetime)":
    "T2 import active MD (kW) /(Datetime)",

  "T3 import active MD (kW) /(Datetime)":
    "T3 import active MD (kW) /(Datetime)",

  "T4 import active MD (kW) /(Datetime)":
    "T4 import active MD (kW) /(Datetime)",

  "Total export active MD (kW) /(Datetime)":
    "Total export active MD (kW) /(Datetime)",

  "T1 export active MD (kW) /(Datetime)":
    "T1 export active MD (kW) /(Datetime)",

  "T2 export active MD (kW) /(Datetime)":
    "T2 export active MD (kW) /(Datetime)",

  "T3 export active MD (kW) /(Datetime)":
    "T3 export active MD (kW) /(Datetime)",
  "T4 export active MD (kW) /(Datetime)":
    "T4 export active MD (kW) /(Datetime)",

  "Total import reactive MD (kvar) /(Datetime)":
    "Total import reactive MD (kvar) /(Datetime)",

  "T1 import reactive MD (kvar) /(Datetime)":
    "T1 import reactive MD (kvar) /(Datetime)",

  "T2 import reactive MD (kvar) /(Datetime)":
    "T2 import reactive MD (kvar) /(Datetime)",

  "T3 import reactive MD (kvar) /(Datetime)":
    "T3 import reactive MD (kvar) /(Datetime)",

  "T4 import reactive MD (kvar) /(Datetime)":
    "T4 import reactive MD (kvar) /(Datetime)",

  "Total export reactive MD (kvar) /(Datetime)":
    "Total export reactive MD (kvar) /(Datetime)",

  "T1 export reactive MD (kvar) /(Datetime)":
    "T1 export reactive MD (kvar) /(Datetime)",

  "T2 export reactive MD (kvar) /(Datetime)":
    "T2 export reactive MD (kvar) /(Datetime)",

  "T3 export reactive MD (kvar) /(Datetime)":
    "T3 export reactive MD (kvar) /(Datetime)",

  "T4 export reactive MD (kvar) /(Datetime)":
    "T4 export reactive MD (kvar) /(Datetime)",

  "Total import apparent MD (kVA) /(Datetime)":
    "Total import apparent MD (kVA) /(Datetime)",

  "T1 import apparent MD (kVA) /(Datetime)":
    "T1 import apparent MD (kVA) /(Datetime)",

  "T2 import apparent MD (kVA) /(Datetime)":
    "T2 import apparent MD (kVA) /(Datetime)",

  "T3 import apparent MD (kVA) /(Datetime)":
    "T3 import apparent MD (kVA) /(Datetime)",

  "T4 import apparent MD (kVA) /(Datetime)":
    "T4 import apparent MD (kVA) /(Datetime)",

  "Total export apparent MD (kVA) /(Datetime)":
    "Total export apparent MD (kVA) /(Datetime)",

  "T1 export apparent MD (kVA) /(Datetime)":
    "T1 export apparent MD (kVA) /(Datetime)",

  "T2 export apparent MD (kVA) /(Datetime)":
    "T2 export apparent MD (kVA) /(Datetime)",

  "T3 export apparent MD (kVA) /(Datetime)":
    "T3 export apparent MD (kVA) /(Datetime)",

  "T4 export apparent MD (kVA) /(Datetime)":
    "T4 export apparent MD (kVA) /(Datetime)",

  "Sum Li total  power factor": "Sum Li total  power factor",

  "Sum Li total  active power (kW) ": "Sum Li total  active power (kW) ",

  "Sum Li import  active power (kW) ": "Sum Li import  active power (kW) ",

  "Sum Li export  active power (kW) ": "Sum Li export  active power (kW) ",

  "Sum Li import  reactive power (kvar) ":
    "Sum Li import  reactive power (kvar) ",

  "Sum Li export  reactive power (kvar) ":
    "Sum Li export  reactive power (kvar) ",

  "Sum Li import  apparent power (kVA)  ":
    "Sum Li import  apparent power (kVA)  ",

  "Sum Li export  apparent power (kVA)  ":
    "Sum Li export  apparent power (kVA)  ",
  "L1 Current (A)": "L1 Current (A)",
  "L1 Voltage (V)": "L1 Voltage (V)",

  "L1 total power factor ": "L1 total power factor ",

  "L1 total active power (kW) ": "L1 total active power (kW) ",

  "L1 import active power (kvar) ": "L1 import active power (kvar) ",

  "L1 import reactive power (kvar)": "L1 import reactive power (kvar)",

  "L1 import apparent power (kvar)": "L1 import apparent power (kvar)",

  "L2 Current (A)": "L2 Current (A)",
  "L2 Voltage (V)": "L2 Voltage (V)",

  "L2 total power factor ": "L2 total power factor ",

  "L2 total active power (kW) ": "L2 total active power (kW) ",

  "L2 import active power (kvar) ": "L2 import active power (kvar) ",

  "L2 import reactive power (kvar)": "L2 import reactive power (kvar)",

  "L2 import apparent power (kvar)": "L2 import apparent power (kvar)",

  "L3 Current (A)": "L3 Current (A)",
  "L3 Voltage (V)": "L3 Voltage (V)",

  "L3 total power factor ": "L3 total power factor ",

  "L3 total active power (kW) ": "L3 total active power (kW) ",

  "L3 import active power (kvar) ": "L3 import active power (kvar) ",

  "L3 import reactive power (kvar)": "L3 import reactive power (kvar)",

  "L3 import apparent power (kvar)": "L3 import apparent power (kvar)",

  "Neutral Current (A)": "Neutral Current (A)",
  "Phase Angle U(L2) - U(L1) (°)": "Phase Angle U(L2) - U(L1) (°)",

  "Phase Angle U(L3) - U(L1) (°)": "Phase Angle U(L3) - U(L1) (°)",

  "Phase Angle U(L2) - U(L3) (°)": "Phase Angle U(L2) - U(L3) (°)",

  "Phase Angle U(L1) - I(L1) (°)": "Phase Angle U(L1) - I(L1) (°)",

  "Phase Angle U(L2) - I(L2) (°)": "Phase Angle U(L2) - I(L2) (°)",

  "Phase Angle U(L3) - I(L3) (°)": "Phase Angle U(L3) - I(L3) (°)",

  "Actual quadrant": "Actual quadrant",

  "Ambient temperature (°C) ": "Ambient temperature (°C) ",

  "Battery voltage (V)": "Battery voltage (V)",

  "Battery installation date and time": "Battery installation date and time",

  "Battery estimated remaining capacity (%)":
    "Battery estimated remaining capacity (%)",

  "Counter of programming": "Counter of programming",

  "Counter of clock adjusted": "Counter of clock adjusted",

  "Counter of module cover open": "Counter of module cover open",

  "Total counter of Tamper": "Total counter of Tamper",

  "Counter of overloading": "Counter of overloading",

  "Counter of low power factor": "Counter of low power factor",

  "Counter of relay remote disconnected":
    "Counter of relay remote disconnected",

  "Counter of relay remote connected": "Counter of relay remote connected",

  "Counter of relay local disconnected": "Counter of relay local disconnected",

  "Counter of relay local connected": "Counter of relay local connected",

  "Counter of L1 under  voltage": "Counter of L1 under  voltage",

  "Counter of L2 under  voltage": "Counter of L2 under  voltage",

  "Counter of L3 under  voltage": "Counter of L3 under  voltage",

  "Counter of L1 over  voltage": "Counter of L1 over  voltage",

  "Counter of L2 over  voltage": "Counter of L2 over  voltage",

  "Counter of L3 over  voltage": "Counter of L3 over  voltage",

  "Counter of power failures": "Counter of power failures",

  "Counter of L1 current reverse": "Counter of L1 current reverse",

  "Counter of L2 current reverse": "Counter of L2 current reverse",

  "Counter of L3 current reverse": "Counter of L3 current reverse",

  "Main disconnector": "Main disconnector ",
  "Relay operations reason": "Relay operations reason",

  "Billing period counter": "Billing period counter",

  "Billing period reset lockout time (Min)":
    "Billing period reset lockout time (Min)",

  "Current month cumulative running hours":
    "Current month cumulative running hours",

  "Load profile 3": "Load profile 3",
  "Load profile 4": "Load profile 4",
  "Load profile 5": "Load profile 5",
  "Load profile 6": "Load profile 6",

  "Balance (kWh)": "Balance (kWh)",
  "Estimated remaining days": "Estimated remaining days",
  "Actual recharged amount(kWh)": "Actual recharged amount(kWh)",
  "Maximum accumulative amount (kWh)": "Maximum accumulative amount (kWh)",
  "Alarm Level 1 of remainder days": "Alarm Level 1 of remainder days",
  "Alarm Level 2 of remainder days": "Alarm Level 2 of remainder days",
  "Alarm Level 3 of remainder days": "Alarm Level 3 of remainder days",

  "Actual tariff indicator": "Actual tariff indicator",
  "Activity calendar setup": "Activity calendar setup",
  "Special days table": "Special days table",

  "Maximum Demand-period (s)": "Maximum Demand-period (s)",

  "Maximum Demand- Number of periods": "Maximum Demand- Number of periods",

  "Threshold of under voltage (V)": "Threshold of under voltage (V)",

  "Time threshold of under voltage (s)": "Time threshold of under voltage (s)",

  "Threshold of swell voltage (V)": "Threshold of swell voltage (V)",

  "Time threshold of swell voltage (s)": "Time threshold of swell voltage (s)",

  "Threshold of overloading (W)": "Threshold of overloading (W)",

  "Time threshold of overloading (s)": "Time threshold of overloading (s)",

  "Time threshold of overloading stop (s)":
    "Time threshold of overloading stop (s)",

  "Time threshold of overloading recover  (s)":
    "Time threshold of overloading recover  (s)",

  "Threshold of meter high temperature (°C)":
    "Threshold of meter high temperature (°C)",

  "Firmware upgrade": "Firmware upgrade",
};

export function DataTable({ data, reading, loading }: DataTableProps) {
  const dynamicColumns = reading
    .filter((r) => r !== "meter-serial-number" && r !== "clock object")
    .map((r) => readingLabels[r]);
  const columns = ["S/N", "Meter Serial Number", "Time", ...dynamicColumns];

  return (
    <Card className="w-full border-none">
      {/* ✅ Ensure only the table scrolls */}
      <div className="w-full overflow-x-auto">
        <Table className="min-w-max">
          <TableHeader className="bg-transparent">
            <TableRow>
              {columns.map((col, index) => (
                <TableHead
                  key={index}
                  className="py-4 text-base whitespace-nowrap"
                >
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-8 text-center"
                >
                  <LoadingAnimation
                    variant="spinner"
                    message="Loading meter data..."
                    size="md"
                  />
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow key={index} className="text-base">
                  <TableCell className="py-4 whitespace-nowrap">
                    {(index + 1).toString().padStart(2, "0")}
                  </TableCell>
                  <TableCell className="py-4 whitespace-nowrap">
                    {row.meter}
                  </TableCell>
                  <TableCell className="py-4 whitespace-nowrap">
                    {row.time}
                  </TableCell>
                  {reading
                    .filter(
                      (r) =>
                        r !== "meter-serial-number" && r !== "clock object",
                    )
                    .map((r) => (
                      <TableCell key={r} className="py-4 whitespace-nowrap">
                        {row[r]}
                      </TableCell>
                    ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

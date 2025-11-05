"use client";

import { useState } from "react";
import { DatePicker } from "@/components/customized-report/date-picker";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  ListFilter,
  Printer,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AllReport from "./billing-table/all-reports-table";
import CustomerInfoTable from "./billing-table/customer-info-table";
import MeterInfoTable from "./billing-table/meter-info-table";
import PaymentHistoryTable from "./billing-table/payment-history-table";
import AdjustmentBalance from "./billing-table/adjustment-table";
import EnergyConsumedTable from "./billing-table/energy-consumed-table";
import OutstandingBalance from "./billing-table/outstand-balance-table";
import TariffDetails from "./billing-table/tariff-details";
import AllPendingReport from "./pending-table/all-vending";
import PendingCustomerInfoTable from "./pending-table/customer-info";
import PendingMeterInfoTable from "./billing-table/meter-info-table";
import PendingTariffDetails from "./pending-table/tariff-details";
import PendingAdjustmentBalance from "./pending-table/adjustment-balance";
import TokenDetailsReport from "./pending-table/token-details";
import VendingHistoryTable from "./pending-table/vending-history";
import { LoadingAnimation } from "@/components/ui/loading-animation";

const EXPORT = [{ accord: "CSV" }, { accord: "XLSX" }, { accord: "PDF" }];
const FILTER = [{ accord: "opt 1" }, { accord: "opt 2" }, { accord: "opt 3" }];
const options = [{ label: "Billing" }, { label: "Vending" }];

export default function CustomReportLayout() {
  const [reportType, setReportType] = useState<string | null>(null);
  const [generateBy, setGenerateBy] = useState("Select");
  const [meter, setMeter] = useState("Select");
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleGenerate = () => {
    setLoading(true);
    setShowTable(false);

    let value = 0;
    const interval = setInterval(() => {
      value += 10;
      setProgress(value);

      if (value >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setLoading(false);
          setShowTable(true);
        }, 500);
      }
    }, 200);
  };

  const renderBillingTable = () => {
    switch (reportType) {
      case "Select All":
        return <AllReport />;
      case "Customer Information ":
        return <CustomerInfoTable />;
      case "Meter Information":
        return <MeterInfoTable />;
      case "Payment History":
        return <PaymentHistoryTable />;
      case "Energy Consumed":
        return <EnergyConsumedTable />;
      case "Adjustment Balance":
        return <AdjustmentBalance />;
      case "New Outstanding Balance":
        return <OutstandingBalance />;
      case "Tariff":
        return <TariffDetails />;
      default:
        return (
          <div className="mt-10 text-center text-gray-500">
            Please select a report to display results.
          </div>
        );
    }
  };

  const renderPendingTable = () => {
    switch (reportType) {
      case "Select All":
        return <AllPendingReport />;
      case "Customer Information ":
        return <PendingCustomerInfoTable />;
      case "Meter Information":
        return <PendingMeterInfoTable />;
      case "Adjustment Balance":
        return <PendingAdjustmentBalance />;
      case "Tariff Details":
        return <PendingTariffDetails />;
      case "Token Details":
        return <TokenDetailsReport />;
      case "Vending History":
        return <VendingHistoryTable />;
      default:
        return (
          <div className="mt-10 text-center text-gray-500">
            Please select a report to display results.
          </div>
        );
    }
  };

  return (
    <div>
      <div>
        {/* Filters */}
        <Card className="flex w-full flex-row justify-between rounded-lg border border-gray-200 px-5 py-1 shadow-none">
          <div className="w-full p-2">
            <h4>
              Start date <span className="text-red-500">*</span>
            </h4>
            <DatePicker placeHolder={"Select Date"} />
          </div>

          <h4 className="self-center">to</h4>

          <div className="w-full p-2">
            <h4>
              End date <span className="text-red-500">*</span>
            </h4>
            <DatePicker placeHolder={"Select Date"} />
          </div>

          {/* Report Type */}
          <div className="w-full p-2">
            <h4>
              Report Type <span className="text-red-500">*</span>
            </h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="text-md mt-1 flex w-full cursor-pointer flex-row items-center justify-between border border-gray-300 px-4 py-4 font-medium text-gray-700">
                  {generateBy}
                  <ChevronDown size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[150px] space-y-2 px-0 py-4 shadow-lg">
                {options.map(({ label }, index) => (
                  <div key={label}>
                    <DropdownMenuItem
                      onClick={() => setGenerateBy(label)}
                      className="flex cursor-pointer items-center gap-3 text-sm font-medium hover:text-gray-400"
                    >
                      <span className="ml-4">{label}</span>
                    </DropdownMenuItem>
                    {index < options.length - 1 && (
                      <hr className="my-1 border-gray-200" />
                    )}
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Meter */}
          <div className="w-full p-2">
            <h4>
              Meter <span className="text-red-500">*</span>
            </h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="text-md mt-1 flex w-full cursor-pointer flex-row items-center justify-between border border-gray-300 px-4 py-4 font-medium text-gray-700">
                  {meter}
                  <ChevronDown size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-90 p-3 shadow-lg">
                {[
                  "All Meter",
                  "6201021224",
                  "6201021223",
                  "6201021225",
                  "6201021226",
                  "6201021256",
                ].map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => setMeter(option)}
                    className="text-md flex cursor-pointer items-center justify-between py-3 font-medium"
                  >
                    <span>{option}</span>
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-lg border transition-colors ${
                        meter === option
                          ? "border-green-500 bg-green-500"
                          : "border-gray-400"
                      }`}
                    >
                      {meter === option && (
                        <Check
                          className="text-white"
                          size={10}
                          strokeWidth={3}
                        />
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Report */}
          {generateBy === "Billing" ? (
            <div className="w-full p-2">
              <h4>
                Report <span className="text-red-500">*</span>
              </h4>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="text-md mt-1 flex w-full cursor-pointer flex-row items-center justify-between border border-gray-300 px-4 py-4 font-medium text-gray-700">
                    {reportType ?? "Select"}
                    <ChevronDown size={14} />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-100 py-4 shadow-lg">
                  {[
                    "Select All",
                    "Customer Information ",
                    "Meter Information",
                    "Payment History",
                    "Energy Consumed",
                    "Adjustment Balance",
                    "New Outstanding Balance",
                    "Tariff",
                  ].map((option, index, arr) => (
                    <div key={option}>
                      <DropdownMenuItem
                        onClick={() => setReportType(option)}
                        className="text-md flex cursor-pointer items-center justify-between py-3 font-medium"
                      >
                        <span className="ml-4">{option}</span>

                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-lg border transition-colors ${
                            reportType === option
                              ? "border-green-500 bg-green-500"
                              : "border-gray-400"
                          }`}
                        >
                          {reportType === option && (
                            <Check
                              className="text-white"
                              size={10}
                              strokeWidth={3}
                            />
                          )}
                        </div>
                      </DropdownMenuItem>
                      {index < arr.length - 1 && (
                        <hr className="my-1 border-gray-200" />
                      )}
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="w-full p-2">
              <h4>
                Report <span className="text-red-500">*</span>
              </h4>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="text-md mt-1 flex w-full cursor-pointer flex-row items-center justify-between border border-gray-300 px-4 py-4 font-medium text-gray-700">
                    {reportType ?? "Select"}
                    <ChevronDown size={14} />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-100 py-4 shadow-lg">
                  {[
                    "Select All",
                    "Customer Information ",
                    "Meter Information",
                    "Adjustment Balance",
                    "Tariff Details",
                    "Vending History",
                  ].map((option, index, arr) => (
                    <div key={option}>
                      <DropdownMenuItem
                        onClick={() => setReportType(option)}
                        className="text-md flex cursor-pointer items-center justify-between py-3 font-medium"
                      >
                        <span className="ml-4">{option}</span>

                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-lg border transition-colors ${
                            reportType === option
                              ? "border-green-500 bg-green-500"
                              : "border-gray-400"
                          }`}
                        >
                          {reportType === option && (
                            <Check
                              className="text-white"
                              size={10}
                              strokeWidth={3}
                            />
                          )}
                        </div>
                      </DropdownMenuItem>
                      {index < arr.length - 1 && (
                        <hr className="my-1 border-gray-200" />
                      )}
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            className="text-md mt-6 ml-4 cursor-pointer border-none bg-[#161CCA] px-10 py-6 font-medium text-white"
            variant="secondary"
            size="lg"
          >
            Generate Report
          </Button>
        </Card>

        {/* Filters below */}
        <Card className="mt-4 flex w-full flex-row items-center justify-between rounded-lg border border-gray-200 px-5 py-4 shadow-none">
          <div className="flex w-[480px] items-center gap-4">
            <div className="relative flex-1">
              <Search
                size={14}
                className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400"
              />
              <Input
                type="text"
                placeholder="Search..."
                className="w-full border-gray-300 pl-10 text-sm focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50 lg:text-base"
              />
            </div>

            {/* Filter Select */}
            <div className="w-[90px]">
              <Select>
                <SelectTrigger className="h-10 w-full justify-center bg-transparent [&>svg]:hidden">
                  <div className="flex items-center gap-2">
                    <ListFilter size={14} strokeWidth={1.5} />
                    <SelectValue placeholder="Filter" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {FILTER.map((accord, index) => (
                    <SelectItem key={index} value={accord.accord}>
                      {accord.accord}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Select */}
            <div className="w-[70px]">
              <Select>
                <SelectTrigger className="h-10 w-full justify-center bg-transparent [&>svg]:hidden">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown size={14} strokeWidth={1.5} />
                    <SelectValue placeholder="Sort" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {FILTER.map((accord, index) => (
                    <SelectItem key={index} value={accord.accord}>
                      {accord.accord}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Select>
              <SelectTrigger className="flex h-14 w-36 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#161CCA] text-[#161CCA]">
                <Printer size={14} color="#161CCA" strokeWidth={1.75} />
                Export
              </SelectTrigger>
              <SelectContent>
                {EXPORT.map((accord, index) => (
                  <SelectItem
                    className="rounded-none border-b border-gray-200 py-3 [&>svg]:hidden"
                    key={index}
                    value={accord.accord}
                  >
                    {accord.accord}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Render report table here */}
        {loading && (
          <div className="mt-8 flex min-h-80 items-center justify-center">
            <LoadingAnimation
              variant="card"
              progress={progress}
              message="Processing..."
            />
          </div>
        )}
        {!loading && showTable && (
          <div className="mt-6">
            <div className="">
              {generateBy === "Billing" ? (
                renderBillingTable()
              ) : generateBy === "Vending" ? (
                renderPendingTable()
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No report available for this selection.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

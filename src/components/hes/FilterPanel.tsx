import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Building2,
  Zap,
  Grid2X2,
  Wrench,
  Database,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  getHierarchyOptions,
  type HierarchyType,
  getUnitsForHierarchy,
  flattenOrganizationNodes,
} from "@/utils/hierarchy-utils";
import { fetchHierarchyData } from "@/service/hes-service";
import { type HierarchyResponse } from "@/types/hes";
import { useMeters } from "@/hooks/use-assign-meter";
import { useAuth } from "@/context/auth-context";
import { MD_READING_OPTIONS, NON_MD_READING_OPTIONS } from "@/constants";

type MeterId =
  | "62124022443"
  | "62124569871"
  | "62224029918"
  | "62224039487"
  | "62124095803"
  | "62124023359"
  | "62124027822";
type ReadingKey = string;

interface UnitOption {
  value: string;
  label: string;
}

interface MeterOption {
  value: string;
  label: string;
}

interface ReadingOption {
  label: string;
  children: { value: string; label: string }[];
}

interface FilterPanelProps {
  onRun: (filters: {
    hierarchy: HierarchyType;
    unit: string;
    meters: MeterId[];
    reading: ReadingKey[];
    obisCodes: string[];
  }) => void;
  meterType?: string

}

// Get hierarchy options from the utility function
const hierarchyOptionsWithIcons = getHierarchyOptions().map((option) => {
  let icon: React.ComponentType<{ size?: number }>;

  switch (option.value) {
    case "region":
      icon = Grid2X2;
      break;
    case "businesshub":
      icon = Building2;
      break;
    case "servicecenter":
      icon = Wrench;
      break;
    case "substation":
      icon = Database;
      break;
    case "feederline":
      icon = Zap;
      break;
    case "distributionsubstation":
      icon = Lightbulb;
      break;
    default:
      icon = Building2;
  }

  return {
    ...option,
    icon,
  };
});


const obisCodeByReadingValue: Record<string, string> = {
  "meter-logical-device-name": "00000.90878",
  "meter-serial-number": "99.2300.8890",
};

export function FilterPanel({ onRun, meterType = 'MD' }: FilterPanelProps) {
  const { user } = useAuth();
  const [hierarchy, setHierarchy] =
    useState<HierarchyType | "">(user?.nodeInfo.type as HierarchyType) ?? "";
  const [unit, setUnit] = useState<string>(user?.nodeInfo.name ?? "");
  const [meters, setMeters] = useState<MeterId[]>([]);
  const [reading, setReading] = useState<ReadingKey[]>([]);
  const [hierarchyData, setHierarchyData] = useState<HierarchyResponse | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { data: metersData, isLoading: metersLoading } = useMeters({
    page: 1,
    pageSize: 1000,
    searchTerm: "",
    sortBy: null,
    sortDirection: null,
    type: "assigned",
  });

   useEffect(() => {
    setReading([]);
  }, [meterType]);

    const readingOptions: ReadingOption[] =
    meterType === "MD" ? MD_READING_OPTIONS : NON_MD_READING_OPTIONS;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchHierarchyData();
        setHierarchyData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch hierarchy data",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setUnit("");
  }, [hierarchy]);

  useEffect(() => {
    if (user?.nodeInfo?.type) {
      setHierarchy(user.nodeInfo.type as HierarchyType);
    }
    if (user?.nodeInfo?.name) {
      setUnit(user.nodeInfo.name);
    }
  }, [user]);

  const allNodes = hierarchyData
    ? flattenOrganizationNodes(hierarchyData.responsedata.nodes)
    : [];
  const unitOptions: UnitOption[] = hierarchy
    ? getUnitsForHierarchy(allNodes, hierarchy).map((option) => ({
        value: option.label.toLowerCase(),
        label: option.label,
      }))
    : [];

  const metersOptions: MeterOption[] = metersData
    ? [
        { value: "all-meters", label: "All Meters" },
        ...metersData.actualMeters.map((m) => ({
          value: m.meterNumber as MeterId,
          label: m.meterNumber,
        })),
        ...metersData.virtualMeters.map((m) => ({
          value: m.meterNumber as MeterId,
          label: m.meterNumber,
        })),
      ]
    : [];

  const getHierarchyLabel = () => {
    return hierarchy
      ? (hierarchyOptionsWithIcons.find((o) => o.value === hierarchy)?.label ??
          "Select Hierarchy")
      : "Select Hierarchy";
  };

  const getUnitLabel = () => {
    return unit
      ? (unitOptions.find((o) => o.value === unit)?.label ?? "Enter Unit")
      : "Enter Unit";
  };

  const handleMetersSelect = (meterValue: string) => {
    if (meterValue === "all-meters") {
      const allMeters = metersOptions
        .filter((o) => o.value !== "all-meters")
        .map((o) => o.value as MeterId);
      setMeters(meters.length === allMeters.length ? [] : allMeters);
    } else {
      setMeters((prevMeters) =>
        prevMeters.includes(meterValue as MeterId)
          ? prevMeters.filter((id) => id !== meterValue)
          : [...prevMeters, meterValue as MeterId],
      );
    }
  };

  const getMetersLabel = () => {
    if (meters.length === 0) return "Enter Meters";
    if (meters.length === 1)
      return metersOptions.find((o) => o.value === meters[0])?.label ?? "";
    return `${meters.length} item(s) selected`;
  };

  const handleReadingSelect = (readingValue: string) => {
    setReading((prevReading) =>
      prevReading.includes(readingValue as ReadingKey)
        ? prevReading.filter((id) => id !== readingValue)
        : [...prevReading, readingValue as ReadingKey],
    );
  };

  const handleGroupSelect = (groupLabel: string, isChecked: boolean) => {
    const group = readingOptions.find((g) => g.label === groupLabel);
    if (group) {
      const childrenValues = group.children.map(
        (child) => child.value as ReadingKey,
      );
      setReading((prevReading) =>
        isChecked
          ? [...new Set([...prevReading, ...childrenValues])]
          : prevReading.filter((r) => !childrenValues.includes(r)),
      );
    }
  };

  const isGroupChecked = (groupLabel: string) => {
    const group = readingOptions.find((g) => g.label === groupLabel);
    if (group) {
      const childrenValues = group.children.map(
        (child) => child.value as ReadingKey,
      );
      return childrenValues.every((value) => reading.includes(value));
    }
    return false;
  };

  const getReadingLabel = () => {
    if (reading.length === 0) return "Select Reading";
    if (reading.length === 1)
      return (
        readingOptions
          .flatMap((g) => g.children || [])
          .find((o) => o.value === reading[0])?.label ?? ""
      );
    return `${reading.length} item(s) selected`;
  };

  const isFormComplete =
    !!hierarchy && !!unit && meters.length > 0 && reading.length > 0;

  const normalizeText = (value: string) =>
    value.toLowerCase().replace(/[^a-z0-9]/g, "");

  const isLikelyObisCode = (value: string) => /^\d+(\.\d+)+$/.test(value);

  const resolveObisCode = (readingValue: string): string => {
    const mappedObisCode = obisCodeByReadingValue[readingValue];
    if (mappedObisCode) {
      return mappedObisCode;
    }

    if (isLikelyObisCode(readingValue)) {
      return readingValue;
    }

    const readingLabel = readingOptions
      .flatMap((group) => group.children)
      .find((option) => option.value === readingValue)?.label;

    const normalizedReadingValue = normalizeText(readingValue);
    const normalizedReadingLabel = normalizeText(readingLabel ?? "");

    const eventType = hierarchyData?.responsedata?.event_types?.find((item) => {
      const normalizedName = normalizeText(item.name ?? "");
      const normalizedDescription = normalizeText(item.description ?? "");
      return (
        normalizedName === normalizedReadingValue ||
        normalizedDescription === normalizedReadingValue ||
        normalizedName === normalizedReadingLabel ||
        normalizedDescription === normalizedReadingLabel ||
        normalizedName.includes(normalizedReadingValue) ||
        normalizedDescription.includes(normalizedReadingValue) ||
        normalizedReadingValue.includes(normalizedName) ||
        normalizedReadingValue.includes(normalizedDescription)
      );
    });

    return eventType?.obisCode ?? readingValue;
  };

  const handleRunClick = () => {
    if (isFormComplete && hierarchy) {
      onRun({
        hierarchy: hierarchy as HierarchyType,
        unit,
        meters,
        reading,
        obisCodes: reading.map(resolveObisCode),
      });
    }
  };

  return (
    <div className="grid w-full grid-cols-1 items-end gap-6 sm:grid-cols-5">
      <div>
        <Label
          htmlFor="hierarchy"
          className="mb-2 block text-base font-medium text-gray-700"
        >
          Hierarchy <span className="text-red-500">*</span>
        </Label>
        <Input
          readOnly
          value={
            user?.nodeInfo?.type
              ? user.nodeInfo.type.charAt(0).toUpperCase() +
                user.nodeInfo.type.slice(1)
              : ""
          }
          className="h-12 w-full cursor-default border-gray-200 bg-transparent text-base text-gray-600"
        />
      </div>

      <div>
        <Label
          htmlFor="unit"
          className="mb-2 block text-base font-medium text-gray-700"
        >
          Unit <span className="text-red-500">*</span>
        </Label>
        <Input
          readOnly
          value={
            user?.nodeInfo?.name
              ? user.nodeInfo.name.charAt(0).toUpperCase() +
                user.nodeInfo.name.slice(1)
              : ""
          }
          className="h-12 w-full cursor-default border-gray-200 bg-transparent text-base text-gray-600"
        />
      </div>

      <div>
        <Label
          htmlFor="meters"
          className="mb-2 block text-base font-medium text-gray-700"
        >
          Meters <span className="text-red-500">*</span>
        </Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-12 w-full justify-between text-left text-base"
              disabled={metersLoading}
            >
              <span>{getMetersLabel()}</span>
              <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full">
            <div
              className="flex cursor-pointer items-center justify-between gap-3 px-2 py-2 text-base"
              onClick={() => handleMetersSelect("all-meters")}
            >
              <span>All Meters</span>
              <Checkbox
                checked={meters.length === metersOptions.length - 1}
                className="h-5 w-5 border-gray-300 data-[state=checked]:border-green-500 data-[state=checked]:bg-green-500"
              />
            </div>
            {metersOptions
              .filter((o) => o.value !== "all-meters")
              .map((option) => (
                <div
                  key={option.value}
                  className="flex cursor-pointer items-center justify-between gap-3 px-2 py-2 text-base"
                  onClick={() => handleMetersSelect(option.value)}
                >
                  <span>{option.label}</span>
                  <Checkbox
                    checked={meters.includes(option.value as MeterId)}
                    className="h-5 w-5 border-gray-300 data-[state=checked]:border-green-500 data-[state=checked]:bg-green-500"
                  />
                </div>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div>
        <Label
          htmlFor="reading"
          className="mb-2 block text-base font-medium text-gray-700"
        >
          Realtime Reading <span className="text-red-500">*</span>
        </Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-12 w-full justify-between text-left text-base"
            >
              <span>{getReadingLabel()}</span>
              <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full">
            <Accordion
              type="multiple"
              className="w-full"
              defaultValue={readingOptions.map((g) => g.label)}
            >
              {readingOptions.map((group, index) => (
                <AccordionItem
                  key={index}
                  value={group.label}
                  className="border-b-gray-200"
                >
                  <AccordionTrigger
                    className="flex w-full items-center justify-between px-2 text-base font-semibold no-underline hover:no-underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex w-full items-center justify-between gap-3">
                      <span>{group.label}</span>
                      <Checkbox
                        checked={isGroupChecked(group.label)}
                        onCheckedChange={(checked) =>
                          handleGroupSelect(group.label, checked as boolean)
                        }
                        className="h-5 w-5 border-gray-300 data-[state=checked]:border-green-500 data-[state=checked]:bg-green-500"
                      />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-2">
                    {group.children.map((option) => (
                      <div
                        key={option.value}
                        className="flex cursor-pointer items-center justify-between gap-3 py-2 pl-4 text-base"
                        onClick={() => handleReadingSelect(option.value)}
                      >
                        <span>{option.label}</span>
                        <Checkbox
                          checked={reading.includes(option.value as ReadingKey)}
                          className="h-5 w-5 border-gray-300 data-[state=checked]:border-green-500 data-[state=checked]:bg-green-500"
                        />
                      </div>
                    ))}
                    {index < readingOptions.length - 1 && (
                      <div className="my-2 border-b border-gray-200"></div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-6 sm:mt-0">
        <Label className="mb-2 block text-base font-medium text-transparent">
          .
        </Label>
        <Button
          onClick={handleRunClick}
          // disabled={!isFormComplete}
          className={`h-12 w-full text-base ${isFormComplete ? "bg-[#161cca]" : "cursor-not-allowed bg-[#161cca]/50"} text-white`}
        >
          Run
        </Button>
      </div>
    </div>
  );
}

import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";

const LICENSE_RESPONSE_CODE = "403";

const LICENSE_WARNING_HEADER = "x-license-warning";

const LICENSE_EXPIRY_PATTERN = /^License expires in (\d+) day\(s\)$/;
const LICENSE_METER_COUNTDOWN_PATTERN =
  /^License meter limit countdown: (\d+) meter\(s\) remaining out of (\d+)$/;

const KNOWN_LICENSE_MESSAGES = [
  "Access denied: Organisation ID not found in token",
  "Access denied: License is inactive",
  "Access denied: License has been tampered with",
  "Access denied: Unable to verify license time",
  "Access denied: License not found"
] as const;

const METER_LIMIT_PATTERN = /^Access denied: Meter limit reached \(\d+ max\)$/;

interface LicenseDeniedResponse {
  responsecode: string;
  responsedesc: string;
  responsedata?: unknown;
}

const isLicenseDeniedResponse = (
  body: unknown,
): body is LicenseDeniedResponse => {
  if (!body || typeof body !== "object") return false;

  const { responsecode, responsedesc } = body as LicenseDeniedResponse;

  if (responsecode !== LICENSE_RESPONSE_CODE) return false;
  if (typeof responsedesc !== "string") return false;

  return (
    (KNOWN_LICENSE_MESSAGES as readonly string[]).includes(responsedesc) ||
    METER_LIMIT_PATTERN.test(responsedesc)
  );
};

const showLicenseDeniedToast = (responsedesc: string) => {
  toast.error(responsedesc, { id: `license-denied:${responsedesc}` });
};

const isMeterLimitResponse = (responsedesc: string): boolean =>
  METER_LIMIT_PATTERN.test(responsedesc);

// Meter-limit state (external store, consumed via useMeterLimitReached)
type Listener = () => void;

let meterLimitReached = false;
const meterLimitListeners = new Set<Listener>();

export const subscribeMeterLimitReached = (
  listener: Listener,
): (() => void) => {
  meterLimitListeners.add(listener);
  return () => {
    meterLimitListeners.delete(listener);
  };
};

export const getMeterLimitReached = (): boolean => meterLimitReached;

export const resetMeterLimitReached = (): void => {
  setMeterLimitReached(false);
};

const setMeterLimitReached = (value: boolean): void => {
  if (meterLimitReached === value) return;
  meterLimitReached = value;
  meterLimitListeners.forEach((listener) => listener());
};

const handleLicenseDenied = (body: unknown) => {
  if (!isLicenseDeniedResponse(body)) return;

  showLicenseDeniedToast(body.responsedesc);

  if (isMeterLimitResponse(body.responsedesc)) {
    setMeterLimitReached(true);
  }
};

const handleLicenseWarnings = (headers: unknown) => {
  if (!headers || typeof headers !== "object") return;

  const headerValue = (headers as Record<string, string>)[LICENSE_WARNING_HEADER];
  if (typeof headerValue !== "string" || headerValue.trim() === "") return;

  const warnings = headerValue
    .split(",")
    .map((part) => part.trim())
    .filter(
      (part) =>
        LICENSE_EXPIRY_PATTERN.test(part) ||
        LICENSE_METER_COUNTDOWN_PATTERN.test(part),
    );

  warnings.forEach((warning) => {
    toast.warning(warning, { id: `license-warning:${warning}` });
  });
};

axiosInstance.interceptors.response.use(
  (response) => {
    handleLicenseDenied(response.data);
    handleLicenseWarnings(response.headers);
    return response;
  },
  (error) => {
    handleLicenseDenied(error.response?.data);
    handleLicenseWarnings(error.response?.headers);
    return Promise.reject(error);
  },
);

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
type ResponseValueItem = {
  description: string;
  value: string | number;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getValueByDescription = (
  responseValue: ResponseValueItem[],
  description: string
): string => {
  const item = responseValue.find(
    (entry) =>
      entry.description?.toLowerCase() === description.toLowerCase()
  );

  return item?.value !== undefined ? String(item.value) : "";
};
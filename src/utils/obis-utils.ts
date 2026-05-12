import type { ObisDataResponse, ObisItem } from '@/types/hes';

export interface ReadingOption {
  label: string;
  children: { value: string; label: string }[];
}

export const transformObisDataToReadingOptions = (
  data: ObisDataResponse
): ReadingOption[] => {
  return Object.entries(data.responsedata).map(([groupKey, items]) => {
    const seen = new Set<string>();
    const uniqueItems = items.filter((item: ObisItem) => {
      if (!item.obisCodeCombined) return false; 
      if (seen.has(item.obisCodeCombined)) return false;
      seen.add(item.obisCodeCombined);
      return true;
    });

    return {
      label: items[0]?.groupName ?? groupKey,
      children: uniqueItems.map((item: ObisItem) => ({
        value: item.obisCodeCombined!, 
        label: item.description,
      })),
    };
  });
};
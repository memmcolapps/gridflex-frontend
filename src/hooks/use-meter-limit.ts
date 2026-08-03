"use client";

import { useSyncExternalStore } from "react";
import {
  getMeterLimitReached,
  subscribeMeterLimitReached,
} from "@/service/license-service";

export const useMeterLimitReached = (): boolean =>
  useSyncExternalStore(subscribeMeterLimitReached, getMeterLimitReached);

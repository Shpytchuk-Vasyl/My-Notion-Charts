"use client";

import { LocalCache } from "./local-cache";

const KEY = "completed_toors"
type ToorsObj = Record<string, boolean>

export class ToorHelper {
  static isCompleted(name: string): boolean {
    return ((LocalCache.get(KEY) ?? {}) as ToorsObj) [name]
  }

  static complete(name: string) {
    const all = (LocalCache.get(KEY) ?? {}) as ToorsObj;
    all[name] = true;
    LocalCache.set(KEY, all);
  }
}

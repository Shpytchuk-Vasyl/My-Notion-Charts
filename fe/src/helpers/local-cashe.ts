"use client";

export class LocalCashe {
  static get<T>(key: string, storage: Storage = localStorage): T | null {
    const item = storage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  }

  static set<T>(key: string, value: T, storage: Storage = localStorage): void {
    storage.setItem(key, JSON.stringify(value));
  }
}

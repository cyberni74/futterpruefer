"use client";
import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** Liefert auf dem Server/bei Hydration `fallback`, danach `get()` – ohne setState im Effect. */
export function useClientValue<T>(get: () => T, fallback: T): T {
  return useSyncExternalStore(noop, get, () => fallback);
}

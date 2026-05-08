"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { AuditHistoryItem } from "@/types/api";

interface AuditHistoryContextValue {
  history: AuditHistoryItem[];
  addAudit: (item: AuditHistoryItem) => void;
}

const AuditHistoryContext = createContext<AuditHistoryContextValue | null>(null);

const HISTORY_KEY = "auditseguros_history";
const VERSION_KEY = "auditseguros_history_v";
const CURRENT_VERSION = "2"; // bump this to wipe stale data on next load

export function AuditHistoryProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [history, setHistory] = useState<AuditHistoryItem[]>([]);

  useEffect(() => {
    // Si la versión almacenada no coincide, es datos viejos (seed) → limpiar
    const storedVersion = localStorage.getItem(VERSION_KEY);
    if (storedVersion !== CURRENT_VERSION) {
      localStorage.removeItem(HISTORY_KEY);
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
      setHistory([]);
      return;
    }

    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  function addAudit(item: AuditHistoryItem) {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.invoiceId !== item.invoiceId);
      const next = [item, ...filtered];
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
      return next;
    });
  }

  return (
    <AuditHistoryContext.Provider value={{ history, addAudit }}>
      {children}
    </AuditHistoryContext.Provider>
  );
}

export function useAuditHistory() {
  const ctx = useContext(AuditHistoryContext);
  if (!ctx) throw new Error("useAuditHistory must be used inside AuditHistoryProvider");
  return ctx;
}

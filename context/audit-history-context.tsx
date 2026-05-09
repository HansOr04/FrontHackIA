"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { AuditHistoryItem } from "@/types/api";
import { useAuth } from "@/context/auth-context";

interface AuditHistoryContextValue {
  history: AuditHistoryItem[];
  addAudit: (item: AuditHistoryItem) => void;
}

const AuditHistoryContext = createContext<AuditHistoryContextValue | null>(null);

const VERSION = "2";

function historyKey(email: string) {
  return `auditseguros_history_${email}`;
}

function versionKey(email: string) {
  return `auditseguros_history_v_${email}`;
}

export function AuditHistoryProvider({ children }: Readonly<{ children: ReactNode }>) {
  const { user } = useAuth();
  const [history, setHistory] = useState<AuditHistoryItem[]>([]);

  useEffect(() => {
    if (!user?.email) {
      setHistory([]);
      return;
    }

    const vKey = versionKey(user.email);
    const hKey = historyKey(user.email);

    const storedVersion = localStorage.getItem(vKey);
    if (storedVersion !== VERSION) {
      localStorage.removeItem(hKey);
      localStorage.setItem(vKey, VERSION);
      setHistory([]);
      return;
    }

    const stored = localStorage.getItem(hKey);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        setHistory([]);
      }
    } else {
      setHistory([]);
    }
  }, [user?.email]);

  function addAudit(item: AuditHistoryItem) {
    if (!user?.email) return;
    const hKey = historyKey(user.email);
    const vKey = versionKey(user.email);
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.invoiceId !== item.invoiceId);
      const next = [item, ...filtered];
      localStorage.setItem(hKey, JSON.stringify(next));
      localStorage.setItem(vKey, VERSION);
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

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { AuditHistoryItem, Recommendation } from "@/types/api";

interface AuditHistoryContextValue {
  history: AuditHistoryItem[];
  addAudit: (item: AuditHistoryItem) => void;
  clearHistory: () => void;
}

const AuditHistoryContext = createContext<AuditHistoryContextValue | null>(null);

const HISTORY_KEY = "auditseguros_history";

const SEED: AuditHistoryItem[] = [
  { invoiceId: 891, claimId: 891, workshopName: "Motors & Repairs S.A.", riskScore: 92, recommendation: "APPROVE", date: "2023-10-12T14:30:00Z" },
  { invoiceId: 890, claimId: 890, workshopName: "Taller Gamma Sur", riskScore: 14, recommendation: "ESCALATE", date: "2023-10-12T11:15:00Z" },
  { invoiceId: 888, claimId: 888, workshopName: "AutoCentro Express", riskScore: 85, recommendation: "ESCALATE", date: "2023-10-11T09:20:00Z" },
  { invoiceId: 885, claimId: 885, workshopName: "Servicio Premier", riskScore: 8, recommendation: "APPROVE", date: "2023-10-10T16:45:00Z" },
  { invoiceId: 881, claimId: 881, workshopName: "Laminado y Pintura Alfa", riskScore: 45, recommendation: "MANUAL_REVIEW" as Recommendation, date: "2023-10-09T08:00:00Z" },
  { invoiceId: 879, claimId: 879, workshopName: "Mecánica Hermanos Ruiz", riskScore: 77, recommendation: "APPROVE", date: "2023-10-08T13:30:00Z" },
  { invoiceId: 877, claimId: 877, workshopName: "Autopartes del Norte", riskScore: 33, recommendation: "ESCALATE", date: "2023-10-07T10:00:00Z" },
];

export function AuditHistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<AuditHistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        setHistory(SEED);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(SEED));
      }
    } else {
      setHistory(SEED);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(SEED));
    }
  }, []);

  function addAudit(item: AuditHistoryItem) {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.invoiceId !== item.invoiceId);
      const next = [item, ...filtered];
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }

  function clearHistory() {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(SEED));
    setHistory(SEED);
  }

  return (
    <AuditHistoryContext.Provider value={{ history, addAudit, clearHistory }}>
      {children}
    </AuditHistoryContext.Provider>
  );
}

export function useAuditHistory() {
  const ctx = useContext(AuditHistoryContext);
  if (!ctx) throw new Error("useAuditHistory must be used inside AuditHistoryProvider");
  return ctx;
}

import type { LineStatus, Recommendation } from "@/types/api";

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(value: number | null | undefined): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number | null | undefined): string {
  if (value == null) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(0)}%`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatClaimId(claimId: number): string {
  const shortId = String(claimId).slice(-4).padStart(4, "0");
  return `#SIN-${shortId}`;
}

export function lineStatusLabel(status: LineStatus): string {
  const map: Record<LineStatus, string> = {
    APPROVED: "Aprobado",
    DISCREPANCY: "Discrepancia",
    DUPLICATE: "Duplicado",
    UNJUSTIFIED: "Injustificado",
    UNDERCHARGED: "Subcargado",
  };
  return map[status] ?? status;
}

export function lineStatusColor(status: LineStatus): string {
  const map: Record<LineStatus, string> = {
    APPROVED: "text-green-400 bg-green-400/10 border-green-400/30",
    DISCREPANCY: "text-red-400 bg-red-400/10 border-red-400/30",
    DUPLICATE: "text-orange-400 bg-orange-400/10 border-orange-400/30",
    UNJUSTIFIED: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
    UNDERCHARGED: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  };
  return map[status] ?? "text-gray-400 bg-gray-400/10 border-gray-400/30";
}

export function recommendationLabel(rec: Recommendation): string {
  const map: Record<Recommendation, string> = {
    APPROVE: "Aprobar",
    ESCALATE: "Escalar",
    MANUAL_REVIEW: "Revisión Manual",
  };
  return map[rec] ?? rec;
}

export function recommendationColor(rec: Recommendation): string {
  const map: Record<Recommendation, string> = {
    APPROVE: "text-green-400 bg-green-400/10 border-green-400/30",
    ESCALATE: "text-red-400 bg-red-400/10 border-red-400/30",
    MANUAL_REVIEW: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  };
  return map[rec] ?? "text-gray-400 bg-gray-400/10 border-gray-400/30";
}

export function scoreColor(score: number): string {
  if (score >= 70) return "#22c55e";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}

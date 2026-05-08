"use client";

import { useMemo, useState } from "react";
import { useAuditHistory } from "@/context/audit-history-context";
import { Badge } from "@/components/ui/badge";
import {
  formatClaimId,
  formatDate,
  recommendationColor,
  recommendationLabel,
  scoreColor,
} from "@/lib/utils";
import type { Recommendation } from "@/types/api";

const PAGE_SIZE = 8;

type Filter = "TODOS" | "APPROVE" | "ESCALATE" | "MANUAL_REVIEW";

const FILTER_LABELS: Record<Filter, string> = {
  TODOS: "Todos",
  APPROVE: "Aprobar",
  ESCALATE: "Escalar",
  MANUAL_REVIEW: "Revisión Manual",
};

export default function HistorialPage() {
  const { history } = useAuditHistory();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("TODOS");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    return history.filter((item) => {
      const matchSearch =
        !search ||
        item.workshopName.toLowerCase().includes(search.toLowerCase()) ||
        String(item.claimId).includes(search) ||
        String(item.invoiceId).includes(search);
      const matchFilter = filter === "TODOS" || item.recommendation === filter;
      return matchSearch && matchFilter;
    });
  }, [history, search, filter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  function handleFilterChange(f: Filter) {
    setFilter(f);
    setPage(0);
  }

  function handleSearch(val: string) {
    setSearch(val);
    setPage(0);
  }

  function downloadCSV() {
    const headers = ["ID Factura", "Taller", "Score", "Recomendación", "Fecha"];
    const rows = filtered.map((item) => [
      formatClaimId(item.claimId),
      item.workshopName,
      item.riskScore,
      recommendationLabel(item.recommendation as Recommendation),
      formatDate(item.date),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "historial-auditorias.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-8 max-w-5xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#e2e8f0]">Historial de Auditorías</h1>
          <p className="text-[#64748b] text-sm mt-1">Revisa y filtra los registros de reclamaciones pasadas.</p>
        </div>
        <button
          onClick={downloadCSV}
          className="w-9 h-9 rounded-lg border border-[#2d3748] flex items-center justify-center text-[#94a3b8] hover:border-[#2e75b6] hover:text-[#2e75b6] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar por ID Factura o Taller..."
            className="w-full bg-[#1a2332] border border-[#2d3748] rounded-lg pl-9 pr-4 py-2 text-sm text-[#e2e8f0] placeholder-[#64748b] focus:outline-none focus:border-[#2e75b6] transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#64748b] text-sm">Filtrar por:</span>
          <select
            value={filter}
            onChange={(e) => handleFilterChange(e.target.value as Filter)}
            className="bg-[#1a2332] border border-[#2d3748] rounded-lg px-3 py-2 text-sm text-[#e2e8f0] focus:outline-none focus:border-[#2e75b6] cursor-pointer"
          >
            {(Object.keys(FILTER_LABELS) as Filter[]).map((f) => (
              <option key={f} value={f}>{FILTER_LABELS[f]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1a2332] border border-[#2d3748] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2d3748]">
              {["ID FACTURA", "TALLER", "SCORE", "RECOMENDACIÓN", "FECHA", ""].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-[#64748b] text-xs font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-[#64748b] text-sm">
                  No se encontraron auditorías con los filtros actuales.
                </td>
              </tr>
            ) : (
              paginated.map((item) => (
                <tr key={item.invoiceId} className="border-b border-[#2d3748]/50 hover:bg-[#243044]/50 transition-colors cursor-pointer">
                  <td className="px-5 py-3 text-[#2e75b6] font-semibold">{formatClaimId(item.claimId)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#2e75b6]/20 flex items-center justify-center text-[#2e75b6] text-[10px] font-bold">
                        {item.workshopName.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-[#e2e8f0]">{item.workshopName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="font-semibold" style={{ color: scoreColor(item.riskScore) }}>
                      {item.riskScore}
                    </span>
                    <span className="text-[#64748b]"> /100</span>
                  </td>
                  <td className="px-5 py-3">
                    <Badge className={recommendationColor(item.recommendation as Recommendation)}>
                      {item.recommendation === "APPROVE" ? "✓" : item.recommendation === "ESCALATE" ? "⚠" : "○"}
                      {" "}{recommendationLabel(item.recommendation as Recommendation)}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-[#94a3b8] text-xs">{formatDate(item.date)}</td>
                  <td className="px-5 py-3 text-right">
                    <svg className="w-4 h-4 text-[#64748b] inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="px-5 py-3 border-t border-[#2d3748] flex items-center justify-between">
          <span className="text-[#64748b] text-xs">
            Mostrando {filtered.length === 0 ? 0 : page * PAGE_SIZE + 1} - {Math.min((page + 1) * PAGE_SIZE, filtered.length)} de {filtered.length} registros
          </span>
          <div className="flex gap-1">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="w-7 h-7 rounded border border-[#2d3748] flex items-center justify-center text-[#94a3b8] hover:border-[#2e75b6] hover:text-[#2e75b6] disabled:opacity-30 transition-colors"
            >
              ‹
            </button>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="w-7 h-7 rounded border border-[#2d3748] flex items-center justify-center text-[#94a3b8] hover:border-[#2e75b6] hover:text-[#2e75b6] disabled:opacity-30 transition-colors"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

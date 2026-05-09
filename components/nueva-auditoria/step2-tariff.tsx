"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import {
  formatCurrency,
  formatPercent,
  lineStatusColor,
  lineStatusLabel,
} from "@/lib/utils";
import type { AuditResultResponse, InvoiceUploadResponse, LineStatus } from "@/types/api";

interface Props {
  uploadData: InvoiceUploadResponse;
  onDone: (auditResult: AuditResultResponse) => void;
  onBack: () => void;
}

const PAGE_SIZE = 5;

export function Step2Tariff({ uploadData, onDone, onBack }: Props) {
  const [auditResult, setAuditResult] = useState<AuditResultResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    async function run() {
      try {
        const res = await api.auditInvoice(uploadData.invoiceId);
        setAuditResult(res);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Error al auditar");
      } finally {
        setLoading(false);
      }
    }
    run();
  }, [uploadData.invoiceId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="flex items-center gap-3 text-[#2e75b6]">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm">Consultando tarifario vía RAG… comparando {uploadData.linesExtracted} items.</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
        <Button variant="secondary" onClick={onBack}>← Volver</Button>
      </div>
    );
  }

  if (!auditResult) return null;

  const lines = auditResult.auditedLines;
  const totalPages = Math.ceil(lines.length / PAGE_SIZE);
  const paginated = lines.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const discrepanciaAltas = lines.filter((l) => l.status === "DISCREPANCY").length;
  const injustificados = lines.filter((l) => l.status === "UNJUSTIFIED").length;
  const duplicados = lines.filter((l) => l.status === "DUPLICATE").length;

  return (
    <div className="flex gap-6">
      {/* Main table area */}
      <div className="flex-1 min-w-0">
        {/* Invoice header */}
        <div className="bg-[#1a2332] border border-[#2d3748] rounded-xl px-5 py-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#64748b] text-xs">Factura ID: {uploadData.invoiceId}</p>
              <p className="text-[#94a3b8] text-xs mt-0.5">
                Taller: {uploadData.workshopName} | Fecha Ingreso: {new Date().toLocaleDateString("es-ES")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[#64748b] text-xs">MONTO TOTAL FACTURADO</p>
              <p className="text-[#e2e8f0] font-bold text-lg">
                {formatCurrency(lines.reduce((s, l) => s + (l.totalCharged ?? 0), 0))}
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1a2332] border border-[#2d3748] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2d3748]">
                  {["DESCRIPCIÓN", "CATEGORÍA", "PRECIO FACTURADO", "PRECIO TARIFARIO", "DELTA ABS", "DELTA %", "ESTADO"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[#64748b] text-xs font-medium whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((line) => (
                  <tr key={line.lineId} className="border-b border-[#2d3748]/50 hover:bg-[#243044]/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className={line.status === "DUPLICATE" || line.status === "UNJUSTIFIED" ? "text-orange-300" : "text-[#e2e8f0]"}>
                        {line.description}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#94a3b8] whitespace-nowrap">{line.category}</td>
                    <td className="px-4 py-3 text-[#e2e8f0] whitespace-nowrap">{formatCurrency(line.unitPrice)}</td>
                    <td className="px-4 py-3 text-[#e2e8f0] whitespace-nowrap">
                      {line.tariffPrice != null ? formatCurrency(line.tariffPrice) : <span className="text-[#64748b]">—</span>}
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap font-medium ${(line.absoluteDelta ?? 0) > 0 ? "text-red-400" : "text-[#94a3b8]"}`}>
                      {line.absoluteDelta != null ? formatCurrency(line.absoluteDelta) : "—"}
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap font-medium ${(line.percentualDelta ?? 0) > 0 ? "text-red-400" : "text-[#94a3b8]"}`}>
                      {line.percentualDelta != null ? formatPercent(line.percentualDelta) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={lineStatusColor(line.status as LineStatus)}>
                        {lineStatusLabel(line.status as LineStatus)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-[#2d3748] flex items-center justify-between">
            <span className="text-[#64748b] text-xs">
              Mostrando {page * PAGE_SIZE + 1} - {Math.min((page + 1) * PAGE_SIZE, lines.length)} de {lines.length} ítems analizados.
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

      {/* Sidebar summary */}
      <div className="w-56 shrink-0 space-y-4">
        <div className="bg-[#1a2332] border border-[#2d3748] rounded-xl p-4">
          <p className="text-[#e2e8f0] font-semibold text-sm mb-3">Resumen de Hallazgos</p>
          <p className="text-[#64748b] text-xs mb-1">TOTAL DISCREPANCIA</p>
          <p className="text-red-400 font-bold text-xl mb-4">{formatCurrency(auditResult.totalDiscrepancy)}</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[#94a3b8] text-xs flex items-center gap-1">
                <span className="text-orange-400">⚠</span> Discrepancias Altas
              </span>
              <span className="text-[#e2e8f0] text-sm font-semibold">{discrepanciaAltas}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#94a3b8] text-xs flex items-center gap-1">
                <span className="text-yellow-400">!</span> Injustificados
              </span>
              <span className="text-[#e2e8f0] text-sm font-semibold">{injustificados}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#94a3b8] text-xs flex items-center gap-1">
                <span className="text-blue-400">⊕</span> Duplicados Detectados
              </span>
              <span className="text-[#e2e8f0] text-sm font-semibold">{duplicados}</span>
            </div>
          </div>
        </div>

        <Button className="w-full" onClick={() => onDone(auditResult)}>
          Analizar Justificación →
        </Button>
        <Button variant="secondary" className="w-full" size="sm">
          Exportar Reporte Parcial ↓
        </Button>
        <Button variant="ghost" className="w-full" size="sm" onClick={onBack}>
          ← Volver
        </Button>
      </div>
    </div>
  );
}

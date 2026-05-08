"use client";

import Link from "next/link";
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

export default function DashboardPage() {
  const { history } = useAuditHistory();

  const total = history.length;
  const approved = history.filter((h) => h.recommendation === "APPROVE").length;
  const escalated = history.filter((h) => h.recommendation === "ESCALATE").length;
  const approvalRate = total > 0 ? ((approved / total) * 100).toFixed(1) : "0.0";

  const recent = history.slice(0, 10);

  return (
    <div className="p-8 space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-[#e2e8f0]">Resumen de Operaciones</h1>
        <p className="text-[#64748b] text-sm mt-1">Métricas clave y estado de facturación en tiempo real.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#1a2332] border border-[#2d3748] rounded-xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#64748b] text-xs mb-2">FACTURAS AUDITADAS</p>
              <p className="text-[#e2e8f0] text-3xl font-bold">{total.toLocaleString()}</p>
              {total > 0 && <p className="text-green-400 text-xs mt-1">Total acumulado</p>}
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#2e75b6]/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#2e75b6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-[#1a2332] border border-[#2d3748] rounded-xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#64748b] text-xs mb-2">APROBADAS AUTOMÁTICAMENTE</p>
              <p className="text-[#e2e8f0] text-3xl font-bold">{approved.toLocaleString()}</p>
              <p className="text-[#64748b] text-xs mt-1">{approvalRate}% tasa de aprobación</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-[#1a2332] border border-[#2d3748] rounded-xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#64748b] text-xs mb-2">ESCALADAS A REVISIÓN</p>
              <p className="text-[#e2e8f0] text-3xl font-bold">{escalated.toLocaleString()}</p>
              {escalated > 0 && <p className="text-red-400 text-xs mt-1">Requieren atención</p>}
            </div>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Audits */}
      <div className="bg-[#1a2332] border border-[#2d3748] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2d3748]">
          <h2 className="text-[#e2e8f0] font-semibold">Auditorías Recientes</h2>
          {recent.length > 0 && (
            <Link href="/historial" className="text-[#2e75b6] text-sm hover:text-[#2563a8] transition-colors">
              Ver todas →
            </Link>
          )}
        </div>

        {recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#0d1117] border border-[#2d3748] flex items-center justify-center">
              <svg className="w-7 h-7 text-[#64748b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-[#e2e8f0] font-medium">No hay auditorías aún</p>
              <p className="text-[#64748b] text-sm mt-1">Sube tu primera factura para comenzar el análisis.</p>
            </div>
            <Link
              href="/nueva-auditoria"
              className="px-4 py-2 bg-[#2e75b6] hover:bg-[#2563a8] text-white text-sm font-medium rounded-lg transition-colors"
            >
              + Nueva Auditoría
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2d3748]">
                {["ID FACTURA", "TALLER", "SCORE", "RECOMENDACIÓN", "FECHA", "ACCIÓN"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[#64748b] text-xs font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((item) => (
                <tr key={item.invoiceId} className="border-b border-[#2d3748]/50 hover:bg-[#243044]/50 transition-colors">
                  <td className="px-5 py-3 text-[#2e75b6] font-medium">{formatClaimId(item.claimId)}</td>
                  <td className="px-5 py-3 text-[#e2e8f0]">{item.workshopName}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full bg-[#0d1117] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${item.riskScore}%`, backgroundColor: scoreColor(item.riskScore) }}
                        />
                      </div>
                      <span className="text-[#e2e8f0] text-xs">{item.riskScore}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <Badge className={recommendationColor(item.recommendation as Recommendation)}>
                      {recommendationLabel(item.recommendation as Recommendation).toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-[#94a3b8] text-xs">{formatDate(item.date)}</td>
                  <td className="px-5 py-3">
                    <button className="text-[#2e75b6] hover:text-[#2563a8] transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

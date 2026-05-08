"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreGauge } from "@/components/ui/score-gauge";
import { api } from "@/lib/api";
import {
  formatCurrency,
  recommendationColor,
  recommendationLabel,
} from "@/lib/utils";
import type {
  AuditReportResponse,
  AuditResultResponse,
  InvoiceUploadResponse,
  JustificationResultResponse,
  Recommendation,
} from "@/types/api";
import { useAuditHistory } from "@/context/audit-history-context";
import { useRouter } from "next/navigation";

interface Props {
  uploadData: InvoiceUploadResponse;
  auditResult: AuditResultResponse;
  onBack: () => void;
}

export function Step3Report({ uploadData, auditResult, onBack }: Props) {
  const [justification, setJustification] = useState<JustificationResultResponse | null>(null);
  const [report, setReport] = useState<AuditReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  const { addAudit } = useAuditHistory();
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const [just, rep] = await Promise.all([
          api.justifyInvoice(uploadData.invoiceId),
          api.generateReport(uploadData.invoiceId),
        ]);
        if (!cancelled) {
          setJustification(just);
          setReport(rep);
        }
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Error al generar el reporte");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [uploadData.invoiceId]);

  async function handleConfirm() {
    if (!report) return;
    setConfirming(true);
    addAudit({
      invoiceId: uploadData.invoiceId,
      claimId: uploadData.claimId,
      workshopName: uploadData.workshopName,
      riskScore: report.riskScore,
      recommendation: report.recommendation as Recommendation,
      date: new Date().toISOString(),
    });
    router.push("/historial");
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <svg className="animate-spin w-8 h-8 text-[#2e75b6]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="text-[#94a3b8] text-sm">Analizando justificaciones y generando reporte final…</p>
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

  if (!report || !justification) return null;

  const rec = report.recommendation as Recommendation;
  const bd = report.scoreBreakdown;

  return (
    <div className="flex gap-6">
      {/* Left: Justification Details */}
      <div className="flex-1 min-w-0 space-y-4">
        <h3 className="text-[#e2e8f0] font-semibold">Detalles de Justificación</h3>
        <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
          {justification.justifiedLines.map((line) => {
            const isJustified = line.status === "APPROVED";
            return (
              <div
                key={line.lineId}
                className={`bg-[#1a2332] border rounded-xl p-4 ${isJustified ? "border-green-500/20" : "border-yellow-500/20"}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[#e2e8f0] text-sm font-medium">{line.description}</p>
                  <Badge className={isJustified ? "text-green-400 bg-green-400/10 border-green-400/30" : "text-yellow-400 bg-yellow-400/10 border-yellow-400/30"}>
                    {isJustified ? "Justificado" : "Revisión Manual"}
                  </Badge>
                </div>
                {line.narrativeAnalysis && (
                  <p className="text-[#94a3b8] text-xs leading-relaxed mb-2">{line.narrativeAnalysis}</p>
                )}
                {line.claimExcerpt && (
                  <div className="mt-2">
                    <p className="text-[#64748b] text-[10px] mb-1">»» Extracto Clínico</p>
                    <p className="text-[#94a3b8] text-xs italic bg-[#0d1117] rounded px-3 py-2 border border-[#2d3748]">
                      &ldquo;{line.claimExcerpt}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Executive Report */}
      <div className="w-64 shrink-0">
        <div className="bg-[#1a2332] border border-[#2d3748] rounded-xl p-5 space-y-4 sticky top-6">
          <h3 className="text-[#e2e8f0] font-semibold text-sm">Reporte Ejecutivo</h3>

          <div className="flex flex-col items-center gap-3">
            <ScoreGauge score={report.riskScore} />
            <Badge className={recommendationColor(rec)}>
              {rec === "APPROVE" ? "✓" : rec === "ESCALATE" ? "⚠" : "○"} {recommendationLabel(rec)} Automáticamente
            </Badge>
          </div>

          <div className="space-y-1.5 text-xs border-t border-[#2d3748] pt-3">
            <div className="flex justify-between">
              <span className="text-[#94a3b8]">Penalización Discrepancias</span>
              <span className={bd.discrepanciesPenalty < 0 ? "text-red-400" : "text-[#94a3b8]"}>
                {bd.discrepanciesPenalty} pts
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#94a3b8]">Duplicados Encontrados</span>
              <span className={bd.duplicatesPenalty < 0 ? "text-orange-400" : "text-green-400"}>
                {bd.duplicatesPenalty} pts
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#94a3b8]">Cargos No Justificados</span>
              <span className={bd.unjustifiedPenalty < 0 ? "text-red-400" : "text-[#94a3b8]"}>
                {bd.unjustifiedPenalty} pts
              </span>
            </div>
            <div className="flex justify-between border-t border-[#2d3748] pt-1.5 font-medium">
              <span className="text-[#e2e8f0]">Score Final</span>
              <span className="text-[#e2e8f0]">{bd.finalScore} / 100</span>
            </div>
          </div>

          {report.totalDiscrepancy > 0 && (
            <div className="text-xs text-[#94a3b8]">
              Total discrepancia: <span className="text-red-400 font-medium">{formatCurrency(report.totalDiscrepancy)}</span>
            </div>
          )}

          {report.narrativeSummary && (
            <div className="bg-[#0d1117] rounded-lg p-3 border border-[#2d3748]">
              <p className="text-[#94a3b8] text-xs leading-relaxed italic">
                &ldquo;{report.narrativeSummary}&rdquo;
              </p>
            </div>
          )}

          <div className="space-y-2 pt-1">
            <Button variant="secondary" size="sm" className="w-full" onClick={onBack}>
              Solicitar Revisión Manual
            </Button>
            <Button size="sm" className="w-full" loading={confirming} onClick={handleConfirm}>
              Confirmar Aprobación
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

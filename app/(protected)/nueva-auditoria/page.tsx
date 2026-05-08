"use client";

import { useState } from "react";
import { Step1Upload } from "@/components/nueva-auditoria/step1-upload";
import { Step2Tariff } from "@/components/nueva-auditoria/step2-tariff";
import { Step3Report } from "@/components/nueva-auditoria/step3-report";
import type {
  AuditResultResponse,
  InvoiceUploadResponse,
} from "@/types/api";

type Step = 1 | 2 | 3;

const STEP_LABELS: Record<Step, string> = {
  1: "Carga de Datos",
  2: "Extracción de Reglas",
  3: "Análisis y Reporte",
};

export default function NuevaAuditoriaPage() {
  const [step, setStep] = useState<Step>(1);
  const [uploadData, setUploadData] = useState<InvoiceUploadResponse | null>(null);
  const [auditResult, setAuditResult] = useState<AuditResultResponse | null>(null);

  function handleUploadDone(data: InvoiceUploadResponse) {
    setUploadData(data);
    setStep(2);
  }

  function handleAuditDone(result: AuditResultResponse) {
    setAuditResult(result);
    setStep(3);
  }

  function reset() {
    setStep(1);
    setUploadData(null);
    setAuditResult(null);
  }

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#e2e8f0]">Nueva Auditoría</h1>
        <p className="text-[#64748b] text-sm mt-1">Sube la documentación para iniciar el análisis inteligente.</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-10">
        {([1, 2, 3] as Step[]).map((s, i) => {
          const done = s < step;
          const active = s === step;
          return (
            <div key={s} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                    ${done ? "bg-green-500 text-white" : active ? "bg-[#2e75b6] text-white" : "bg-[#1a2332] text-[#64748b] border border-[#2d3748]"}`}
                >
                  {done ? (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : s}
                </div>
                <span className={`text-xs font-medium ${active ? "text-[#e2e8f0]" : done ? "text-green-400" : "text-[#64748b]"}`}>
                  {STEP_LABELS[s]}
                </span>
              </div>
              {i < 2 && (
                <div className={`w-16 h-px mx-3 ${s < step ? "bg-green-500" : "bg-[#2d3748]"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      {step === 1 && <Step1Upload onDone={handleUploadDone} />}

      {step === 2 && uploadData && (
        <Step2Tariff
          uploadData={uploadData}
          onDone={handleAuditDone}
          onBack={reset}
        />
      )}

      {step === 3 && uploadData && auditResult && (
        <Step3Report
          uploadData={uploadData}
          auditResult={auditResult}
          onBack={() => setStep(2)}
        />
      )}
    </div>
  );
}

"use client";

import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { InvoiceUploadResponse } from "@/types/api";

interface Props {
  onDone: (data: InvoiceUploadResponse) => void;
}

export function Step1Upload({ onDone }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<InvoiceUploadResponse | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    if (!f.name.endsWith(".pdf")) {
      setError("Solo se permiten archivos PDF.");
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setError("El archivo supera los 20MB.");
      return;
    }
    setError(null);
    setFile(f);
    setPreview(null);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  async function handleUpload() {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.uploadInvoice(file);
      setPreview(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al subir el archivo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Drop zone */}
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !file && inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer
          ${file ? "border-[#2e75b6] bg-[#2e75b6]/5" : "border-[#2d3748] hover:border-[#2e75b6]/50 hover:bg-[#1a2332]/50"}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-[#1a2332] flex items-center justify-center">
            <svg className="w-7 h-7 text-[#2e75b6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <p className="text-[#e2e8f0] font-medium">Sube la factura del taller (PDF)</p>
            <p className="text-[#64748b] text-sm mt-1">
              Arrastra y suelta el documento aquí, o haz clic para explorar tus archivos.
            </p>
            <p className="text-[#64748b] text-xs mt-1">Solo se permiten formatos PDF (.pdf) hasta 20MB.</p>
          </div>
          {!file && (
            <Button variant="primary" size="sm" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}>
              Seleccionar Archivo
            </Button>
          )}
        </div>
      </div>

      {/* File selected */}
      {file && (
        <div className="bg-[#1a2332] border border-[#2d3748] rounded-xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z" />
              </svg>
            </div>
            <div>
              <p className="text-[#e2e8f0] text-sm font-medium">{file.name}</p>
              <p className="text-[#64748b] text-xs">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="primary" size="sm" loading={loading} onClick={handleUpload}>
              Subir y Extraer
            </Button>
            <button
              onClick={() => { setFile(null); setPreview(null); }}
              className="text-[#64748b] hover:text-[#e2e8f0] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div className="bg-[#1a2332] border border-[#2e75b6]/30 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-[#2e75b6]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">Extracción Previa (Ejemplo)</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "ID FACTURA", value: `${preview.invoiceId}` },
              { label: "CLAIM ID", value: `CLM-${preview.claimId}` },
              { label: "WORKSHOP", value: preview.workshopName },
              { label: "LÍNEAS DETECTADAS", value: `${preview.linesExtracted} Items`, highlight: true },
            ].map(({ label, value, highlight }) => (
              <div key={label} className="bg-[#0d1117] rounded-lg px-4 py-3">
                <p className="text-[#64748b] text-xs mb-1">{label}</p>
                <p className={`text-sm font-semibold ${highlight ? "text-[#2e75b6]" : "text-[#e2e8f0]"}`}>
                  {value}
                </p>
              </div>
            ))}
          </div>
          <Button
            className="w-full"
            onClick={() => onDone(preview)}
          >
            Continuar al Análisis de Tarifario →
          </Button>
        </div>
      )}
    </div>
  );
}

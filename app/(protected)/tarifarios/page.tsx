"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import type { TariffUploadResponse } from "@/types/api";

const SECTOR_LABELS: Record<string, string> = {
  "tarifario_siniestros_automotriz.pdf": "Automotriz",
  "tarifario_siniestros_salud.pdf": "Salud",
  "tarifario_siniestros_hogar.pdf": "Hogar",
  "tarifario_vida_accidentes_personales.pdf": "Vida y Accidentes",
  "tarifario_general_servicios_profesionales.pdf": "Servicios Generales",
};

const SECTOR_COLORS: Record<string, string> = {
  "tarifario_siniestros_automotriz.pdf": "bg-blue-500/20 text-blue-400",
  "tarifario_siniestros_salud.pdf": "bg-green-500/20 text-green-400",
  "tarifario_siniestros_hogar.pdf": "bg-orange-500/20 text-orange-400",
  "tarifario_vida_accidentes_personales.pdf": "bg-purple-500/20 text-purple-400",
  "tarifario_general_servicios_profesionales.pdf": "bg-cyan-500/20 text-cyan-400",
};

function sectorLabel(filename: string) {
  return SECTOR_LABELS[filename] ?? filename;
}

function sectorColor(filename: string) {
  return SECTOR_COLORS[filename] ?? "bg-[#2e75b6]/20 text-[#2e75b6]";
}

export default function TarifariosPage() {
  const [sources, setSources] = useState<string[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<TariffUploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLoadingList(true);
    api
      .listTariffs()
      .then(setSources)
      .catch(() => setSources([]))
      .finally(() => setLoadingList(false));
  }, [result]);

  const handleFile = useCallback((f: File) => {
    if (!f.name.endsWith(".pdf")) {
      setError("Solo se permiten archivos PDF.");
      return;
    }
    if (f.size > 30 * 1024 * 1024) {
      setError("El archivo supera los 30 MB.");
      return;
    }
    setError(null);
    setResult(null);
    setFile(f);
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
    setUploading(true);
    setError(null);
    try {
      const res = await api.uploadTariff(file);
      if (res.error) throw new Error(res.error);
      setResult(res);
      setFile(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al subir el archivo");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="p-8 max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#e2e8f0]">Gestión de Tarifarios</h1>
        <p className="text-[#64748b] text-sm mt-1">
          Administra los documentos de referencia que el sistema usa para auditar facturas de cualquier ramo.
        </p>
      </div>

      {/* Indexed tariffs */}
      <div className="bg-[#1a2332] border border-[#2d3748] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#2d3748] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#2e75b6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0121 9.414V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-[#e2e8f0] text-sm font-medium">Tarifarios Indexados</span>
          </div>
          <span className="text-[#64748b] text-xs">
            {loadingList ? "Cargando…" : `${sources.length} documento${sources.length !== 1 ? "s" : ""}`}
          </span>
        </div>

        {loadingList ? (
          <div className="px-5 py-10 flex justify-center">
            <svg className="animate-spin w-5 h-5 text-[#2e75b6]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : sources.length === 0 ? (
          <div className="px-5 py-10 text-center text-[#64748b] text-sm">
            No hay tarifarios indexados aún. Sube el primer documento abajo.
          </div>
        ) : (
          <ul className="divide-y divide-[#2d3748]/50">
            {sources.map((src) => (
              <li key={src} className="px-5 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#e2e8f0] text-sm font-medium truncate">{src}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${sectorColor(src)}`}>
                  {sectorLabel(src)}
                </span>
                <svg className="w-3.5 h-3.5 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Upload new tariff */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-[#e2e8f0]">Añadir Nuevo Tarifario</h2>
          <p className="text-[#64748b] text-xs mt-0.5">
            Sube un PDF con la tabla de precios acordados. El sistema lo indexará automáticamente para todos los ramos.
          </p>
        </div>

        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => !file && inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer
            ${file ? "border-[#2e75b6] bg-[#2e75b6]/5" : "border-[#2d3748] hover:border-[#2e75b6]/50 hover:bg-[#1a2332]/50"}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#1a2332] flex items-center justify-center">
              <svg className="w-6 h-6 text-[#2e75b6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-[#e2e8f0] text-sm font-medium">Arrastra un PDF de tarifario aquí</p>
              <p className="text-[#64748b] text-xs mt-0.5">o haz clic para explorar · máx. 30 MB</p>
            </div>
            {!file && (
              <button
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                className="px-4 py-1.5 bg-[#2e75b6] hover:bg-[#2563a8] text-white text-sm rounded-lg transition-colors"
              >
                Seleccionar archivo
              </button>
            )}
          </div>
        </div>

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
              <button
                disabled={uploading}
                onClick={handleUpload}
                className="px-4 py-1.5 bg-[#2e75b6] hover:bg-[#2563a8] disabled:opacity-50 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
              >
                {uploading && (
                  <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {uploading ? "Indexando…" : "Indexar Tarifario"}
              </button>
              <button
                onClick={() => { setFile(null); setResult(null); }}
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

        {result && (
          <div className={`border rounded-lg px-4 py-3 text-sm flex items-start gap-3
            ${result.chunksIndexed > 0
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-[#2e75b6]/10 border-[#2e75b6]/30 text-[#2e75b6]"}`}
          >
            <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="font-medium">{result.message}</p>
              {result.chunksIndexed > 0 && (
                <p className="text-xs mt-0.5 opacity-80">
                  {result.chunksIndexed} fragmentos indexados de &quot;{result.filename}&quot;
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Info box */}
      <div className="bg-[#1a2332] border border-[#2d3748] rounded-xl px-5 py-4 flex gap-3">
        <svg className="w-4 h-4 text-[#64748b] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v-4M12 8h.01" />
        </svg>
        <p className="text-[#64748b] text-xs leading-relaxed">
          Los tarifarios se usan como base de referencia durante la auditoría: el sistema compara cada línea de la
          factura contra los precios indexados y marca discrepancias. Puedes subir tarifarios de cualquier ramo
          (automotriz, salud, hogar, vida, servicios profesionales, etc.). Los documentos ya indexados al arrancar
          el servidor se muestran automáticamente en la lista de arriba.
        </p>
      </div>
    </div>
  );
}

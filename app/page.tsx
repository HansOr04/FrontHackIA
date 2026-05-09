import Link from "next/link";

const TARIFFS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
          d="M8 7h12m0 0l-4-4m4 4l-4 4M4 17h12m0 0l-4-4m4 4l-4 4" />
      </svg>
    ),
    label: "Automotriz",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    dot: "bg-blue-400",
    desc: "Repuestos, mano de obra y servicios de taller mecánico.",
    items: ["Parachoques y carrocería", "Frenos y suspensión", "Pintura y latonería", "Alineación y balanceo"],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    label: "Salud",
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
    dot: "bg-green-400",
    desc: "Gastos médicos, cirugías, hospitalización y rehabilitación.",
    items: ["Consultas y diagnóstico", "Cirugía y hospitalización", "Laboratorio e imagen", "Terapias y medicamentos"],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    label: "Hogar",
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
    dot: "bg-orange-400",
    desc: "Reparaciones, plomería, electricidad e impermeabilización.",
    items: ["Mano de obra especializada", "Materiales de construcción", "Electricidad y plomería", "Carpintería y techos"],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    label: "Vida y Accidentes",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    dot: "bg-purple-400",
    desc: "Invalidez, sepelio, incapacidad y gastos por accidente.",
    items: ["Indemnizaciones por muerte", "Invalidez parcial/total", "Prótesis y rehabilitación", "Gastos de sepelio"],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: "Servicios Generales",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
    dot: "bg-cyan-400",
    desc: "Honorarios profesionales, peritaje, transporte y tecnología.",
    items: ["Honorarios y peritaje", "Transporte y logística", "Limpieza industrial", "Tecnología y equipos"],
  },
];

const STEPS = [
  {
    num: "01",
    title: "Carga la factura",
    desc: "Sube el PDF del taller o proveedor. El agente extrae automáticamente todos los ítems, montos y datos del emisor.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Verificación contra tarifario",
    desc: "Cada línea se compara con el tarifario acordado usando búsqueda semántica RAG + IA. Se detectan discrepancias y duplicados al instante.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Reporte ejecutivo con score",
    desc: "Obtenés un reporte con score de riesgo (0–100), hallazgos detallados y recomendación automática: aprobar, escalar o revisión manual.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e2e8f0]">

      {/* ── NAV ── */}
      <nav className="border-b border-[#2d3748]/60 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#2e75b6] flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
          </div>
          <div>
            <span className="text-[#e2e8f0] font-semibold text-sm">AuditSeguros</span>
            <span className="text-[#64748b] text-[10px] block leading-none">Precision Audit System</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login"
            className="text-[#94a3b8] hover:text-[#e2e8f0] text-sm transition-colors px-3 py-1.5">
            Iniciar Sesión
          </Link>
          <Link href="/register"
            className="bg-[#2e75b6] hover:bg-[#2563a8] text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors">
            Crear Cuenta
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-[#2e75b6]/10 border border-[#2e75b6]/30 rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2e75b6] animate-pulse" />
          <span className="text-[#2e75b6] text-xs font-medium">Powered by NVIDIA NIM · Spring AI · pgvector RAG</span>
        </div>

        <h1 className="text-5xl font-bold tracking-tight mb-6 leading-tight">
          Auditoría automática de facturas
          <br />
          <span className="text-[#2e75b6]">para aseguradoras</span>
        </h1>

        <p className="text-[#94a3b8] text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Un agente inteligente que verifica en segundos si los insumos y honorarios
          cobrados por talleres y proveedores corresponden al tarifario acordado,
          detectando discrepancias y cobros duplicados antes de que lleguen al auditor humano.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link href="/register"
            className="bg-[#2e75b6] hover:bg-[#2563a8] text-white font-semibold px-8 py-3 rounded-xl transition-colors text-sm">
            Comenzar gratis →
          </Link>
          <Link href="/login"
            className="border border-[#2d3748] hover:border-[#2e75b6] text-[#94a3b8] hover:text-[#e2e8f0] px-8 py-3 rounded-xl transition-colors text-sm">
            Iniciar Sesión
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {[
            { value: "< 30s", label: "por factura auditada" },
            { value: "5 ramos", label: "de seguros cubiertos" },
            { value: "0", label: "revisiones manuales innecesarias" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold text-[#2e75b6]">{value}</div>
              <div className="text-[#64748b] text-xs mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-[#2d3748]/50">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-2">¿Cómo funciona?</h2>
          <p className="text-[#64748b] text-sm">Tres pasos, totalmente automatizados.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((step) => (
            <div key={step.num}
              className="bg-[#1a2332] border border-[#2d3748] rounded-xl p-6 relative">
              <div className="text-[#2d3748] text-5xl font-black absolute top-4 right-5 select-none leading-none">
                {step.num}
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#2e75b6]/15 flex items-center justify-center text-[#2e75b6] mb-4">
                {step.icon}
              </div>
              <h3 className="font-semibold text-[#e2e8f0] mb-2">{step.title}</h3>
              <p className="text-[#64748b] text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TARIFFS ── */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-[#2d3748]/50">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-2">Tarifarios activos</h2>
          <p className="text-[#64748b] text-sm max-w-xl mx-auto">
            El sistema carga automáticamente estos cinco tarifarios al iniciar. También podés
            subir tarifarios propios desde la sección <span className="text-[#2e75b6]">Tarifarios</span> del panel.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TARIFFS.map((t) => (
            <div key={t.label}
              className={`border rounded-xl p-5 ${t.bg}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg bg-[#0d1117]/40 flex items-center justify-center ${t.color}`}>
                  {t.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${t.dot}`} />
                    <span className="text-[#e2e8f0] font-semibold text-sm">{t.label}</span>
                  </div>
                  <span className="text-[#64748b] text-xs">Indexado · listo para usar</span>
                </div>
              </div>
              <p className="text-[#94a3b8] text-xs mb-3 leading-relaxed">{t.desc}</p>
              <ul className="space-y-1">
                {t.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-[#64748b]">
                    <svg className={`w-3 h-3 ${t.color} shrink-0`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Upload CTA card */}
          <div className="border border-dashed border-[#2d3748] rounded-xl p-5 flex flex-col items-center justify-center text-center gap-3 hover:border-[#2e75b6]/50 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-[#1a2332] flex items-center justify-center text-[#64748b]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="text-[#94a3b8] text-sm font-medium">Tu propio tarifario</p>
              <p className="text-[#64748b] text-xs mt-0.5">Subí cualquier PDF con precios acordados y el sistema lo indexa en segundos.</p>
            </div>
            <Link href="/login"
              className="text-[#2e75b6] text-xs hover:underline">
              Acceder para subir →
            </Link>
          </div>
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-[#2d3748]/50">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-2">Tecnología detrás del agente</h2>
          <p className="text-[#64748b] text-sm">Stack moderno diseñado para precisión y escalabilidad.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {[
            {
              name: "NVIDIA NIM",
              detail: "Llama 3.1 · Extracción de datos de PDFs y análisis de justificación",
              color: "text-green-400",
              bg: "bg-green-500/10",
            },
            {
              name: "Spring AI + RAG",
              detail: "Búsqueda semántica en tarifarios · pgvector embeddings HNSW",
              color: "text-blue-400",
              bg: "bg-blue-500/10",
            },
            {
              name: "Next.js 15",
              detail: "Frontend con App Router · autenticación JWT · historial por usuario",
              color: "text-[#e2e8f0]",
              bg: "bg-[#2d3748]/50",
            },
            {
              name: "PostgreSQL 16",
              detail: "pgvector para embeddings · Spring Data JPA · perfiles de entorno",
              color: "text-cyan-400",
              bg: "bg-cyan-500/10",
            },
          ].map((t) => (
            <div key={t.name} className={`rounded-xl p-4 border border-[#2d3748] ${t.bg}`}>
              <span className={`text-sm font-bold ${t.color}`}>{t.name}</span>
              <p className="text-[#64748b] text-xs mt-2 leading-relaxed">{t.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-[#2d3748]/50">
        <div className="bg-[#1a2332] border border-[#2d3748] rounded-2xl p-12 text-center">
          <h2 className="text-2xl font-bold mb-3">
            Empezá a auditar facturas hoy
          </h2>
          <p className="text-[#64748b] text-sm mb-8 max-w-md mx-auto">
            Sin configuración compleja. Subí una factura y en menos de 30 segundos
            tenés el reporte de auditoría completo con score de riesgo.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register"
              className="bg-[#2e75b6] hover:bg-[#2563a8] text-white font-semibold px-8 py-3 rounded-xl transition-colors text-sm">
              Crear cuenta gratuita →
            </Link>
            <Link href="/login"
              className="border border-[#2d3748] hover:border-[#2e75b6] text-[#94a3b8] hover:text-[#e2e8f0] px-8 py-3 rounded-xl transition-colors text-sm">
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#2d3748]/60 px-6 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#2e75b6] flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
            </div>
            <span className="text-[#64748b] text-xs">AuditSeguros — Precision Audit System</span>
          </div>
          <span className="text-[#64748b] text-xs">Hackathon 2026</span>
        </div>
      </footer>

    </div>
  );
}

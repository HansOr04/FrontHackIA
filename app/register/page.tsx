"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password || !confirm) {
      setError("Completa todos los campos.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await register(name, email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al registrarse");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#2e75b6] flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
          </div>
          <h1 className="text-[#e2e8f0] text-xl font-bold">AuditSeguros</h1>
          <p className="text-[#64748b] text-xs">Precision Audit System</p>
        </div>

        <div className="bg-[#1a2332] border border-[#2d3748] rounded-2xl p-6 space-y-5">
          <div>
            <h2 className="text-[#e2e8f0] font-semibold text-lg">Crear Cuenta</h2>
            <p className="text-[#64748b] text-sm">Completa el formulario para comenzar.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[#94a3b8] text-sm">Nombre completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan Pérez"
                className="w-full bg-[#0d1117] border border-[#2d3748] rounded-lg px-3 py-2.5 text-sm text-[#e2e8f0] placeholder-[#64748b] focus:outline-none focus:border-[#2e75b6] transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[#94a3b8] text-sm">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@empresa.com"
                className="w-full bg-[#0d1117] border border-[#2d3748] rounded-lg px-3 py-2.5 text-sm text-[#e2e8f0] placeholder-[#64748b] focus:outline-none focus:border-[#2e75b6] transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[#94a3b8] text-sm">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0d1117] border border-[#2d3748] rounded-lg px-3 py-2.5 text-sm text-[#e2e8f0] placeholder-[#64748b] focus:outline-none focus:border-[#2e75b6] transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[#94a3b8] text-sm">Confirmar contraseña</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0d1117] border border-[#2d3748] rounded-lg px-3 py-2.5 text-sm text-[#e2e8f0] placeholder-[#64748b] focus:outline-none focus:border-[#2e75b6] transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 text-red-400 text-xs">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" loading={loading}>
              Crear Cuenta
            </Button>
          </form>

          <p className="text-center text-[#64748b] text-sm">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-[#2e75b6] hover:text-[#2563a8] transition-colors">
              Iniciar Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

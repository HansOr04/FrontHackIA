import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { AuditHistoryProvider } from "@/context/audit-history-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AuditSeguros — Precision Audit System",
  description: "Sistema de auditoría inteligente de facturas de talleres para seguros de vehículos.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.className} h-full`}>
      <body className="min-h-full bg-[#0d1117] text-[#e2e8f0] antialiased">
        <AuthProvider>
          <AuditHistoryProvider>
            {children}
          </AuditHistoryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

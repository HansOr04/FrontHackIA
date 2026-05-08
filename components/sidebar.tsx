"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";

const NAV = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2" />
        <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2" />
        <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2" />
        <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2" />
      </svg>
    ),
  },
  {
    href: "/nueva-auditoria",
    label: "Nueva Auditoría",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    href: "/historial",
    label: "Historial",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <aside className="flex flex-col w-56 min-h-screen bg-[#0d1117] border-r border-[#2d3748]">
      {/* Brand */}
      <div className="px-4 pt-5 pb-4 border-b border-[#2d3748]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[#2e75b6] flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
          </div>
          <div>
            <p className="text-[#e2e8f0] text-sm font-semibold leading-tight">AuditSeguros</p>
            <p className="text-[#64748b] text-[10px]">Precision Audit System</p>
          </div>
        </div>
      </div>

      {/* Nueva Auditoría CTA */}
      <div className="px-3 pt-4">
        <Link
          href="/nueva-auditoria"
          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-[#2e75b6] hover:bg-[#2563a8] text-white text-sm font-medium transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Nueva Auditoría
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 pt-4 space-y-0.5">
        {NAV.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                active
                  ? "bg-[#2e75b6]/15 text-[#2e75b6] font-medium"
                  : "text-[#94a3b8] hover:bg-[#1a2332] hover:text-[#e2e8f0]"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom links */}
      <div className="px-2 pb-4 space-y-0.5 border-t border-[#2d3748] pt-4">
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#94a3b8] hover:bg-[#1a2332] hover:text-[#e2e8f0] w-full transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
          </svg>
          Centro de Ayuda
        </button>

        {user && (
          <div className="px-3 py-2">
            <p className="text-[#64748b] text-[10px] truncate mb-1">{user.email}</p>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#94a3b8] hover:bg-[#1a2332] hover:text-[#e2e8f0] w-full transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}

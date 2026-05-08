"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface User {
  name: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = "auditseguros_session";
const TOKEN_KEY = "auditseguros_token";

async function authFetch(path: string, body: object): Promise<{ token: string; email: string; name: string }> {
  const res = await fetch(`/api/v1/auth/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message ?? `HTTP ${res.status}`);
  }

  return data as { token: string; email: string; name: string };
}

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    }
  }, []);

  async function login(email: string, password: string) {
    const data = await authFetch("login", { email, password });
    const session: User = { name: data.name, email: data.email };
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
  }

  async function register(name: string, email: string, password: string) {
    const data = await authFetch("register", { email, name, password });
    const session: User = { name: data.name, email: data.email };
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export function getStoredToken(): string | null {
  if (globalThis.window === undefined) return null;
  return localStorage.getItem(TOKEN_KEY);
}

import type {
  AuditReportResponse,
  AuditResultResponse,
  InvoiceUploadResponse,
  JustificationResultResponse,
} from "@/types/api";
import { getStoredToken } from "@/context/auth-context";

const BASE = "/api/v1";

function authHeaders(extra?: HeadersInit): HeadersInit {
  const token = getStoredToken();
  return token
    ? { Authorization: `Bearer ${token}`, ...extra }
    : { ...extra };
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: authHeaders(init?.headers),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    let message: string;
    try {
      const parsed = JSON.parse(body);
      message = parsed.message || parsed.error || body || `HTTP ${res.status}`;
    } catch {
      message = body || `HTTP ${res.status}`;
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export const api = {
  uploadInvoice(file: File): Promise<InvoiceUploadResponse> {
    const form = new FormData();
    form.append("file", file);
    return request<InvoiceUploadResponse>(`${BASE}/invoice/upload`, {
      method: "POST",
      body: form,
    });
  },

  auditInvoice(invoiceId: number): Promise<AuditResultResponse> {
    return request<AuditResultResponse>(`${BASE}/audit/invoice/${invoiceId}`, {
      method: "POST",
    });
  },

  justifyInvoice(invoiceId: number): Promise<JustificationResultResponse> {
    return request<JustificationResultResponse>(
      `${BASE}/audit/invoice/${invoiceId}/justify`,
      { method: "POST" }
    );
  },

  generateReport(invoiceId: number): Promise<AuditReportResponse> {
    return request<AuditReportResponse>(
      `${BASE}/audit/invoice/${invoiceId}/report`,
      { method: "POST" }
    );
  },

  getReport(invoiceId: number): Promise<AuditReportResponse> {
    return request<AuditReportResponse>(
      `${BASE}/audit/invoice/${invoiceId}/report`
    );
  },
};

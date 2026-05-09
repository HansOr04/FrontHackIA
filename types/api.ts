export interface InvoiceUploadResponse {
  invoiceId: number;
  claimId: number;
  workshopName: string;
  linesExtracted: number;
}

export interface AuditLineResponse {
  lineId: number;
  description: string;
  category: string;
  unitPrice: number;
  quantity: number;
  totalCharged: number;
  tariffPrice: number | null;
  absoluteDelta: number | null;
  percentualDelta: number | null;
  status: LineStatus;
  tariffReferences: string | null;
}

export type LineStatus = "APPROVED" | "DISCREPANCY" | "DUPLICATE" | "UNJUSTIFIED" | "UNDERCHARGED";
export type Recommendation = "APPROVE" | "ESCALATE" | "MANUAL_REVIEW";

export interface AuditResultResponse {
  invoiceId: number;
  auditedLines: AuditLineResponse[];
  totalDiscrepancy: number;
  duplicatesDetected: number;
}

export interface ScoreBreakdownDto {
  baseScore: number;
  discrepanciesPenalty: number;
  duplicatesPenalty: number;
  unjustifiedPenalty: number;
  finalScore: number;
  discrepanciesCount: number;
  duplicatesCount: number;
  unjustifiedCount: number;
}

export interface AuditReportResponse {
  reportId: number;
  invoiceId: number;
  riskScore: number;
  recommendation: Recommendation;
  scoreBreakdown: ScoreBreakdownDto;
  narrativeSummary: string;
  totalDiscrepancy: number;
  llmModelVersion: string;
  rulesVersion: string;
  createdAt: string;
}

export interface JustifiedLineResponse {
  lineId: number;
  description: string;
  status: string;
  claimExcerpt: string | null;
  narrativeAnalysis: string | null;
}

export interface JustificationResultResponse {
  invoiceId: number;
  justifiedLines: JustifiedLineResponse[];
  totalUnjustified: number;
}

export interface TariffUploadResponse {
  filename: string;
  chunksIndexed: number;
  message: string;
  error?: string;
}

export interface AuditHistoryItem {
  invoiceId: number;
  claimId: number;
  workshopName: string;
  riskScore: number;
  recommendation: Recommendation;
  date: string;
}

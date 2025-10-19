// /lib/api.ts
import type {
  DocumentLite, VoteChoice, VoteSummary, VoteDocSummary,
  FeedbackList, Stats
} from "./types";

const JSON_HEADERS = { "Content-Type": "application/json" };

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const j = await res.json();
      msg = (j?.error && typeof j.error === "string")
        ? j.error
        : j?.error?.formErrors?.join(", ")
          ?? j?.error?.fieldErrors
          ?? msg;
    } catch { /* ignore */ }
    throw new Error(msg);
  }
  // some endpoints return CSV / empty
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json() as Promise<T>;
  return (undefined as unknown) as T;
}

/* -------- Documents -------- */
export async function apiListDocuments(): Promise<DocumentLite[]> {
  const res = await fetch("/api/documents", { cache: "no-store" });
  return handle<DocumentLite[]>(res);
}

export async function apiCreateDocument(input: Partial<DocumentLite>): Promise<DocumentLite> {
  const res = await fetch("/api/documents", {
    method: "POST", headers: JSON_HEADERS, body: JSON.stringify(input)
  });
  return handle<DocumentLite>(res);
}

/* -------- Votes -------- */
export async function apiCastVote(params: {
  documentId: string; choice: VoteChoice; mssv?: string; unit?: string;
}) {
  const res = await fetch("/api/votes", {
    method: "POST", headers: JSON_HEADERS, body: JSON.stringify(params),
  });
  return handle<{ ok: true }>(res);
}

export async function apiVoteSummary(documentId: string): Promise<VoteSummary> {
  const res = await fetch(`/api/votes?documentId=${encodeURIComponent(documentId)}`, { cache: "no-store" });
  return handle<VoteSummary>(res);
}

export async function apiVotesSummaryAll(): Promise<VoteDocSummary[]> {
  const res = await fetch("/api/votes/summary", { cache: "no-store" });
  return handle<VoteDocSummary[]>(res);
}

/* -------- Feedback -------- */
export async function apiCreateFeedback(body: {
  documentId: string; fullname: string; studentId: string; email: string;
  unit: string; content: string; fileUrl?: string;
}) {
  const res = await fetch("/api/feedback", {
    method: "POST", headers: JSON_HEADERS, body: JSON.stringify(body)
  });
  return handle(res);
}

export async function apiListFeedback(params: {
  documentId?: string; q?: string; tag?: string; page?: number; pageSize?: number;
}): Promise<FeedbackList> {
  const sp = new URLSearchParams();
  if (params.documentId) sp.set("documentId", params.documentId);
  if (params.q)         sp.set("q", params.q);
  if (params.tag)       sp.set("tag", params.tag);
  sp.set("page", String(params.page ?? 1));
  sp.set("pageSize", String(params.pageSize ?? 20));

  const res = await fetch(`/api/feedback?${sp.toString()}`, { cache: "no-store" });
  return handle<FeedbackList>(res);
}

/* -------- Stats -------- */
export async function apiStats(): Promise<Stats> {
  const res = await fetch("/api/stats", { cache: "no-store" });
  return handle<Stats>(res);
}

/* -------- Export CSV (admin) -------- */
export function getExportVotesUrl(key: string) {
  return `/api/admin/export/votes?key=${encodeURIComponent(key)}`;
}
export function getExportFeedbackUrl(key: string) {
  return `/api/admin/export/feedback?key=${encodeURIComponent(key)}`;
}

/* -------- (Tuỳ chọn) Upload file: presigned URL flow --------
   - Backend tạo route trả về { uploadUrl, publicUrl } từ S3.
   - Client PUT file vào uploadUrl, sau đó gửi publicUrl vào apiCreateFeedback.
---------------------------------------------------------------- */
// Ví dụ chung (nếu đã có presign API):
export async function uploadToPresignedUrl(uploadUrl: string, file: File) {
  const res = await fetch(uploadUrl, { method: "PUT", body: file });
  if (!res.ok) throw new Error("Upload thất bại");
}

// /lib/hooks.ts
import useSWR, { mutate } from "swr";
import {
  apiListDocuments, apiVotesSummaryAll, apiVoteSummary, apiStats,
  apiListFeedback
} from "./api";

const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then(r => r.json());

/* Home stats */
export function useStats() {
  const { data, error, isLoading } = useSWR("/api/stats", fetcher, { refreshInterval: 15000 });
  return { data, error, isLoading };
}

/* List documents */
export function useDocuments() {
  const { data, error, isLoading } = useSWR("/api/documents", fetcher);
  return { documents: data ?? [], error, isLoading };
}

/* Vote summary for one doc */
export function useVoteSummary(documentId?: string) {
  const key = documentId ? `/api/votes?documentId=${documentId}` : null;
  const { data, error, isLoading } = useSWR(key, key ? fetcher : null, { refreshInterval: 5000 });
  return { summary: data, error, isLoading };
}

/* All docs summary (admin) */
export function useVotesSummaryAll() {
  const { data, error, isLoading } = useSWR("/api/votes/summary", fetcher, { refreshInterval: 5000 });
  return { rows: data ?? [], error, isLoading };
}

/* Feedback list (admin) */
export function useFeedbackList(params: { documentId?: string; q?: string; tag?: string; page?: number; pageSize?: number; }) {
  const sp = new URLSearchParams();
  if (params.documentId) sp.set("documentId", params.documentId);
  if (params.q) sp.set("q", params.q);
  if (params.tag) sp.set("tag", params.tag);
  sp.set("page", String(params.page ?? 1));
  sp.set("pageSize", String(params.pageSize ?? 20));
  const key = `/api/feedback?${sp.toString()}`;

  const { data, error, isLoading } = useSWR(key, fetcher, { refreshInterval: 8000 });
  return { list: data, error, isLoading };
}

/* Helpers to revalidate specific keys (sau khi submit) */
export function revalidateVote(documentId: string) {
  return mutate(`/api/votes?documentId=${documentId}`);
}
export function revalidateVotesSummaryAll() {
  return mutate("/api/votes/summary");
}
export function revalidateFeedbackList(params?: { documentId?: string; q?: string; tag?: string; page?: number; pageSize?: number; }) {
  const sp = new URLSearchParams();
  if (params?.documentId) sp.set("documentId", params.documentId);
  if (params?.q) sp.set("q", params.q);
  if (params?.tag) sp.set("tag", params.tag);
  sp.set("page", String(params?.page ?? 1));
  sp.set("pageSize", String(params?.pageSize ?? 20));
  return mutate(`/api/feedback?${sp.toString()}`);
}

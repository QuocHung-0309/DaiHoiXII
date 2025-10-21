import useSWR from "swr";

const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then(r => r.json());

export function useLiveVoteSummary() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/live/vote-summary",
    fetcher,
    { refreshInterval: 2000, revalidateOnFocus: false } // 2s/lần
  );
  return {
    rows: (data?.items ?? []) as Array<{ id: string; title: string; status: string; agree: number; disagree: number; abstain: number; total: number }>,
    updatedAt: data?.updatedAt as string | undefined,
    isLoading,
    error,
    mutate
  };
}

export function useLiveFeedbackSummary() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/live/feedback-summary",
    fetcher,
    { refreshInterval: 3000, revalidateOnFocus: false } // 3s/lần
  );
  return {
    total: (data?.total ?? 0) as number,
    rows: (data?.items ?? []) as Array<{ documentId: string; title: string; count: number }>,
    updatedAt: data?.updatedAt as string | undefined,
    isLoading,
    error,
    mutate
  };
}

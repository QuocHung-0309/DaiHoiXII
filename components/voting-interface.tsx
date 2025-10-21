"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getSession } from "@/lib/user-session";

type Choice = "AGREE" | "DISAGREE" | "ABSTAIN";

export function VotingInterface({
  documentId,
  documentTitle,
}: {
  documentId: string;
  documentTitle: string;
}) {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState<"A" | "D" | "N" | null>(null);

  // trạng thái đã biểu quyết và (tuỳ chọn) lựa chọn đã bầu
  const [hasVoted, setHasVoted] = React.useState(false);
  const [votedChoice, setVotedChoice] = React.useState<Choice | null>(null);

  const session = getSession();
  const isGuest = !!session.isGuest;
  const hasDelegate = !!session.delegateId;
  const delegateId = session.delegateId as string | undefined;

  // Khi có MSSV & documentId => gọi API check
  React.useEffect(() => {
    let aborted = false;
    async function run() {
      if (!hasDelegate || !delegateId) return;
      try {
        const res = await fetch(
          `/api/votes/check?documentId=${encodeURIComponent(
            documentId
          )}&mssv=${encodeURIComponent(delegateId)}`,
          { cache: "no-store" }
        );
        if (!res.ok) return;
        const j = await res.json();
        if (aborted) return;
        if (j?.voted) {
          setHasVoted(true);
          if (
            j.choice === "AGREE" ||
            j.choice === "DISAGREE" ||
            j.choice === "ABSTAIN"
          ) {
            setVotedChoice(j.choice as Choice);
          }
        } else {
          setHasVoted(false);
          setVotedChoice(null);
        }
      } catch {
        // im lặng: không block UI nếu check lỗi
      }
    }
    run();
    return () => {
      aborted = true;
    };
  }, [documentId, hasDelegate, delegateId]);

  async function vote(choice: Choice) {
    if (!hasDelegate) {
      toast({
        title: "Chưa xác định đại biểu",
        description: "Vui lòng nhập MSSV để biểu quyết.",
      });
      return;
    }
    if (isGuest) {
      toast({
        title: "Chế độ Khách",
        description: "Khách không thể biểu quyết.",
      });
      return;
    }
    if (hasVoted) {
      toast({
        title: "Bạn đã biểu quyết",
        description: "Mỗi MSSV chỉ được biểu quyết 1 lần cho văn kiện này.",
      });
      return;
    }

    setLoading(choice === "AGREE" ? "A" : choice === "DISAGREE" ? "D" : "N");
    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId,
          choice,
          mssv: delegateId, // bắt buộc truyền để BE ràng buộc
        }),
      });

      // Đã biểu quyết trước đó (BE ràng UNIQUE) -> 409
      if (res.status === 409) {
        let msg = "Mỗi MSSV chỉ được biểu quyết 1 lần cho văn kiện này.";
        try {
          const j = await res.json();
          if (j?.error) msg = j.error;
          if (j?.choice) setVotedChoice(j.choice as Choice);
        } catch {}
        setHasVoted(true);
        toast({ title: "Bạn đã biểu quyết", description: msg });
        return;
      }

      if (!res.ok) {
        let msg = "Không gửi được phiếu. Thử lại sau.";
        try {
          const j = await res.json();
          if (j?.error) msg = j.error;
        } catch {}
        throw new Error(msg);
      }

      // thành công
      setHasVoted(true);
      setVotedChoice(choice);
      toast({
        title: "Đã ghi nhận",
        description: `Bạn đã biểu quyết “${documentTitle}”.`,
      });
    } catch (e: any) {
      toast({
        title: "Lỗi",
        description: e?.message || "Không gửi được phiếu. Thử lại sau.",
      });
      console.error(e);
    } finally {
      setLoading(null);
    }
  }

  const disabled = isGuest || !hasDelegate || loading !== null || hasVoted;

  function labelChoice(c: Choice | null) {
    if (c === "AGREE") return "Tán thành";
    if (c === "DISAGREE") return "Không tán thành";
    if (c === "ABSTAIN") return "Phiếu trắng";
    return "đã gửi";
  }

  return (
    <div className="rounded-xl border p-4 bg-white">
      <div className="text-sm text-slate-600 mb-2">
        {isGuest
          ? "Bạn đang ở chế độ Khách — không thể biểu quyết."
          : hasDelegate
          ? `Đại biểu: ${session.displayName ?? session.delegateId}`
          : "Chưa xác định đại biểu."}
      </div>

      {hasVoted ? (
        <div className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-800 text-sm">
          Bạn đã {labelChoice(votedChoice)} cho văn kiện này.
        </div>
      ) : null}

      <div className="flex gap-2">
        <Button disabled={disabled} onClick={() => vote("AGREE")}>
          {loading === "A" ? "..." : "Tán thành"}
        </Button>
        <Button
          variant="secondary"
          disabled={disabled}
          onClick={() => vote("DISAGREE")}
        >
          {loading === "D" ? "..." : "Không tán thành"}
        </Button>
        <Button
          variant="outline"
          disabled={disabled}
          onClick={() => vote("ABSTAIN")}
        >
          {loading === "N" ? "..." : "Phiếu trắng"}
        </Button>
      </div>
    </div>
  );
}

// /app/api/live/vote-summary/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { STATIC_DOCS } from "@/lib/static-docs";

const meta = new Map(STATIC_DOCS.map((d) => [d.id, d]));

export async function GET() {
  try {
    const grouped = await prisma.vote.groupBy({
      by: ["documentId", "choice"],
      _count: { _all: true },
    });

    const acc: Record<string, { agree: number; disagree: number; abstain: number }> = {};
    for (const g of grouped) {
      acc[g.documentId] ??= { agree: 0, disagree: 0, abstain: 0 };
      if (g.choice === "AGREE") acc[g.documentId].agree += g._count._all;
      else if (g.choice === "DISAGREE") acc[g.documentId].disagree += g._count._all;
      else acc[g.documentId].abstain += g._count._all;
    }

    const items = Object.entries(acc).map(([id, v]) => {
      const m = meta.get(id);
      const total = v.agree + v.disagree + v.abstain;
      return {
        id,
        title: m?.title ?? `Văn kiện #${id}`,
        status: m?.status ?? "voting",
        total,
        agree: v.agree,
        disagree: v.disagree,
        abstain: v.abstain,
      };
    });

    for (const d of STATIC_DOCS) {
      if (d.status === "voting" && !items.find((x) => x.id === d.id)) {
        items.push({
          id: d.id,
          title: d.title,
          status: d.status,
          total: 0,
          agree: 0,
          disagree: 0,
          abstain: 0,
        });
      }
    }

    items.sort(
      (a, b) =>
        STATIC_DOCS.findIndex((d) => d.id === a.id) -
        STATIC_DOCS.findIndex((d) => d.id === b.id)
    );

    return NextResponse.json({ updatedAt: new Date().toISOString(), items });
  } catch (e) {
    console.error("[live/vote-summary] GET", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

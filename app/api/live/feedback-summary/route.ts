import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { STATIC_DOCS } from "@/lib/static-docs";

export async function GET() {
  try {
    const votes = await prisma.vote.groupBy({
      by: ["documentCode", "choice"],
      _count: true,
    });

    const result = STATIC_DOCS.map((d) => {
      const seg = votes.filter((v) => v.documentCode === d.code);
      const agree = seg.find((s) => s.choice === "AGREE")?._count ?? 0;
      const disagree = seg.find((s) => s.choice === "DISAGREE")?._count ?? 0;
      const abstain = seg.find((s) => s.choice === "ABSTAIN")?._count ?? 0;
      const total = agree + disagree + abstain;
      return { id: d.code, title: d.title, total, agree, disagree, abstain };
    });

    return NextResponse.json({ items: result });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

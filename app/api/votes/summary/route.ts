import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const docs = await prisma.document.findMany({ orderBy: { createdAt: "asc" }});
  const results = await Promise.all(
    docs.map(async (d) => {
      const total = await prisma.vote.count({ where: { documentId: d.id }});
      const agree = await prisma.vote.count({ where: { documentId: d.id, choice: "AGREE" }});
      const disagree = await prisma.vote.count({ where: { documentId: d.id, choice: "DISAGREE" }});
      const abstain = await prisma.vote.count({ where: { documentId: d.id, choice: "ABSTAIN" }});
      return { id: d.id, title: d.title, total, agree, disagree, abstain };
    })
  );
  return NextResponse.json(results);
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { voteCreateSchema } from "@/lib/validators";
import { getClientInfo } from "@/lib/request";
export const runtime = "nodejs";

// Cast a vote
export async function POST(req: Request) {
  const body = await req.json();
  const parsed = voteCreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { documentId, choice, mssv, unit } = parsed.data;

const { ip, ua } = getClientInfo(req);
  await prisma.vote.create({
    data: { documentId, choice, mssv: mssv ?? null, unit: unit ?? null, ip, ua },
  });
  return NextResponse.json({ ok: true }, { status: 201 });
}

// Summary by documentId
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const documentId = searchParams.get("documentId");
  if (!documentId) {
    return NextResponse.json({ error: "Missing documentId" }, { status: 400 });
  }
  const [agree, disagree, abstain, total] = await Promise.all([
    prisma.vote.count({ where: { documentId, choice: "AGREE" } }),
    prisma.vote.count({ where: { documentId, choice: "DISAGREE" } }),
    prisma.vote.count({ where: { documentId, choice: "ABSTAIN" } }),
    prisma.vote.count({ where: { documentId } }),
  ]);
  return NextResponse.json({ documentId, agree, disagree, abstain, total, agreeRate: total ? agree / total : 0 });
}

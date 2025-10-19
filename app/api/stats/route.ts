import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const [delegates, documents, feedback, votes] = await Promise.all([
    // nếu bạn có bảng delegates thì thay thật, còn không mock = sum vote unique mssv
    prisma.vote.groupBy({ by: ["mssv"], where: { mssv: { not: null }}}).then(g => g.length),
    prisma.document.count(),
    prisma.feedback.count(),
    prisma.vote.count(),
  ]);
  return NextResponse.json({ delegates, documents, feedback, votes });
}

// app/api/votes/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
// (optional) nếu bạn có getSession thì import, còn không có cũng OK
import { getSession } from "@/lib/user-session";

type Body = {
  documentId?: string;
  choice?: "AGREE" | "DISAGREE" | "ABSTAIN";
  mssv?: string;
  unit?: string | null;
};

export async function POST(req: Request) {
  try {
    const { documentId, choice, mssv: mssvFromBody, unit }: Body = await req.json();

    // Cho phép lấy MSSV từ body hoặc từ session (nếu FE đã xác thực trước đó)
    let mssv = (mssvFromBody ?? "").trim();
    try {
      const session = getSession?.();
      if (!mssv && session?.delegateId) mssv = String(session.delegateId).trim();
    } catch {
      // nếu bạn chưa có lib session thì bỏ qua
    }

    if (!documentId) {
      return NextResponse.json({ error: "Thiếu documentId." }, { status: 400 });
    }
    if (!choice || !["AGREE", "DISAGREE", "ABSTAIN"].includes(choice)) {
      return NextResponse.json({ error: "choice không hợp lệ." }, { status: 400 });
    }
    if (!mssv) {
      return NextResponse.json({ error: "Bạn cần nhập MSSV để biểu quyết." }, { status: 400 });
    }

    const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0] || null;
    const ua = req.headers.get("user-agent") ?? null;

    const created = await prisma.vote.create({
      data: { documentId, choice, mssv, unit: unit ?? null, ip, ua },
      // có @@unique([documentId, mssv]) trong schema
    });

    return NextResponse.json({ ok: true, id: created.id });
  } catch (e: any) {
    // Prisma unique violation (đã vote văn kiện đó)
    if (e?.code === "P2002") {
      return NextResponse.json(
        { error: "Mỗi MSSV chỉ được biểu quyết 1 lần cho văn kiện này." },
        { status: 409 }
      );
    }
    console.error("[/api/votes] POST", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

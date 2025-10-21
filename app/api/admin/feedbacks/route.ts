import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { STATIC_DOCS } from "@/lib/static-docs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // CHUẨN HOÁ: chấp nhận cả documentCode | documentId | docId
    const rawCode =
      body.documentCode ?? body.documentId ?? body.docId ?? "";
    const documentCode = String(rawCode || "").trim();

    const fullname = String(body.fullname ?? "").trim();
    const studentId = String(body.studentId ?? "").trim();
    const email = String(body.email ?? "").trim();
    const unit = String(body.unit ?? "").trim();
    const content = String(body.content ?? "").trim();
    const consent = Boolean(body.consent);

    // validate rõ ràng để FE thấy lỗi cụ thể
    if (!fullname) return bad("Thiếu fullname");
    if (!studentId) return bad("Thiếu studentId");
    if (!email) return bad("Thiếu email");
    if (!unit) return bad("Thiếu unit");
    if (!documentCode) return bad("Thiếu documentCode");
    if (content.length < 30) return bad("Nội dung quá ngắn (≥30 ký tự)");
    if (!consent) return bad("Bạn cần đồng ý cho phép sử dụng thông tin góp ý");

    // tra meta để lưu kèm title
    const meta = STATIC_DOCS.find((d) => d.id === documentCode);
    const documentTitle = meta?.title ?? `Văn kiện #${documentCode}`;

    await prisma.feedback.create({
      data: {
        fullname,
        studentId,
        email,
        unit,
        content,
        consent,
        documentCode,       // cột TEXT trong DB
        documentTitle,      // cột TEXT trong DB
        // ip/ua tuỳ bạn muốn log thêm:
        // ip: req.headers.get("x-forwarded-for") ?? null,
        // ua: req.headers.get("user-agent") ?? null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[feedback] POST", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

function bad(msg: string) {
  return NextResponse.json({ error: msg }, { status: 400 });
}

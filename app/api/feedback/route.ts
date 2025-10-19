import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { feedbackCreateSchema } from "@/lib/validators";
import { getClientInfo } from "@/lib/request";

export const runtime = "nodejs";

// GET ?documentId=...&q=...&tag=...&page=1&pageSize=20
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const documentId = searchParams.get("documentId") || undefined;
  const q = searchParams.get("q")?.toLowerCase() || "";
  const tag = searchParams.get("tag") || undefined;
  const page = Number(searchParams.get("page") || "1");
  const pageSize = Math.min(100, Number(searchParams.get("pageSize") || "20"));
  const where = {
    AND: [
      documentId ? { documentId } : {},
      tag ? { tag } : {},
      q
        ? {
            OR: [
              { content: { contains: q, mode: "insensitive" } },
              { fullname: { contains: q, mode: "insensitive" } },
              { unit: { contains: q, mode: "insensitive" } },
            ],
          }
        : {},
    ],
  };
  const [items, total] = await Promise.all([
    prisma.feedback.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.feedback.count({ where }),
  ]);
  return NextResponse.json({ items, total, page, pageSize });
}

// POST JSON (nếu upload file thì client upload S3 trước rồi gửi fileUrl)
export async function POST(req: Request) {
  const body = await req.json();
  const parsed = feedbackCreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { ip, ua } = getClientInfo(req);
  const fb = await prisma.feedback.create({
    data: { ...parsed.data, ip, ua },
  });
  return NextResponse.json(fb, { status: 201 });
}

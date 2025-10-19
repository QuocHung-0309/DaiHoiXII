import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const docs = await prisma.document.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, category: true, status: true, deadline: true, description: true },
  });
  return NextResponse.json(docs);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { title, category, status, description, deadline } = body || {};

  if (!title || !category || !status) {
    return NextResponse.json({ error: "title, category, status là bắt buộc" }, { status: 400 });
  }

  const doc = await prisma.document.create({
    data: { title, category, status, description: description ?? null, deadline: deadline ?? null },
  });

  return NextResponse.json(doc, { status: 201 });
}

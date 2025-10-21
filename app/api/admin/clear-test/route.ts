// app/api/admin/clear-test/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

export async function POST() {
  try {
    // ✅ Guard: cho phép nếu (dev) hoặc (cookie role === 'admin')
    let allowed = process.env.NODE_ENV !== "production";
    try {
      const raw = cookies().get("congress.user")?.value;
      if (raw) {
        const u = JSON.parse(raw);
        if (u?.role === "admin") allowed = true;
      }
    } catch {}

    if (!allowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [v, f] = await Promise.all([
      prisma.vote.deleteMany({}),
      prisma.feedback.deleteMany({}),
    ]);

    return NextResponse.json({
      ok: true,
      deleted: { votes: v.count, feedback: f.count },
      at: new Date().toISOString(),
    });
  } catch (e) {
    console.error("[admin/clear-test] POST", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

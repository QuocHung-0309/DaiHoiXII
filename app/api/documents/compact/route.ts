import { NextResponse } from "next/server";
import { listCompact } from "@/lib/static-docs";

export async function GET() {
  return NextResponse.json({ items: listCompact() });
}

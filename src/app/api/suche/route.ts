import { NextResponse } from "next/server";
import { search } from "@/lib/search";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q");
  try {
    const hits = await search(q, 10);
    return NextResponse.json({ hits }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
  } catch {
    return NextResponse.json({ hits: [] }, { status: 500 });
  }
}

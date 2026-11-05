import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasSupabase } from "@/lib/supabase/mock";

// ডাটাবেস সচল কি না দেখার জন্য সহজ endpoint।
export async function GET() {
  if (!hasSupabase()) return NextResponse.json({ ok: true, supabase: false, mode: "demo" });
  const sb = await createClient();
  const { error } = await sb.from("site_published").select("key").limit(1);
  return NextResponse.json({ ok: !error }, { status: error ? 500 : 200 });
}

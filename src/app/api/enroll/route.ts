import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSite } from "@/lib/site";

// POST { "courseId": "..." } — লগইন করা শিক্ষার্থীর ভর্তির অনুরোধ জমা দেয়।
export async function POST(req: Request) {
  const site = await getSite();
  if (!site.flags.enrollment) return NextResponse.json({ error: "enrollment_closed" }, { status: 403 });
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  if (!body.courseId) return NextResponse.json({ error: "courseId_required" }, { status: 400 });
  const { error } = await sb.from("enrollments").upsert(
    { user_id: user.id, course_id: body.courseId, status: "pending" },
    { onConflict: "user_id,course_id", ignoreDuplicates: true }
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

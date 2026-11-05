import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSite, getLang, type Course } from "@/lib/site";
import { t, num } from "@/lib/i18n";
import { enroll } from "@/app/actions";

export default async function CourseDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sb = await createClient();
  const { data } = await sb.from("courses").select("*").eq("slug", slug).eq("is_published", true).maybeSingle();
  if (!data) notFound();
  const c = data as Course;
  const [site, lang] = await Promise.all([getSite(), getLang()]);
  const open = site.flags.enrollment;
  return (
    <section className="sec">
      <div className="w" style={{ maxWidth: 760 }}>
        <div className="th" style={{ borderRadius: "var(--r)", height: 180, background: `linear-gradient(135deg,hsl(${c.hue} 70% 38%),hsl(${(c.hue + 45) % 360} 75% 52%))` }}>{c.thumb_text}</div>
        <h1 style={{ marginBottom: 4 }}>{c.title}</h1>
        <p className="mu">{t(lang, "teacher")}: {c.teacher}</p>
        <p className="mu">{num(lang, c.duration_months)} {t(lang, "months")} · {num(lang, c.class_count)} {t(lang, "classes")} · {num(lang, c.student_count)} {t(lang, "students")}</p>
        <p style={{ whiteSpace: "pre-wrap" }}>{c.description}</p>
        <p className="pr"><s>৳{num(lang, c.price)}</s> <strong>৳{num(lang, c.discount_price)}</strong></p>
        <form action={enroll}>
          <input type="hidden" name="course_id" value={c.id} />
          <input type="hidden" name="slug" value={c.slug} />
          <button className="btn b1" disabled={!open}>{open ? t(lang, "enroll") : t(lang, "closed")}</button>
        </form>
      </div>
    </section>
  );
}

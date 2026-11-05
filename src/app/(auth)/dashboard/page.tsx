import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUser, getLang } from "@/lib/site";
import { t, num } from "@/lib/i18n";

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ msg?: string }> }) {
  const sp = await searchParams;
  const { user, name } = await getUser();
  if (!user) redirect("/login?next=/dashboard");
  const lang = await getLang();
  const sb = await createClient();
  const { data } = await sb
    .from("enrollments")
    .select("id,status,created_at,courses(slug,title,teacher,class_count)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });
  const rows = (data ?? []) as any[];
  return (
    <section className="sec">
      <div className="w">
        <h1 style={{ marginTop: 0 }}>{t(lang, "dashboard")}</h1>
        <p className="mu">{name || user!.email}</p>
        {sp.msg === "enrolled" && <div className="msg">{t(lang, "enrolled")}</div>}
        <h2>{t(lang, "myCourses")}</h2>
        {rows.length === 0 ? (
          <p className="mu">{t(lang, "noEnroll")} <Link href="/courses" style={{ color: "var(--p)" }}>{t(lang, "courses")}</Link></p>
        ) : (
          <div className="grid">
            {rows.map((r) => (
              <div className="box" key={r.id}>
                <h3 style={{ margin: 0 }}>{r.courses?.title}</h3>
                <p className="mu">{t(lang, "teacher")}: {r.courses?.teacher} · {num(lang, r.courses?.class_count ?? 0)} {t(lang, "classes")}</p>
                <p><b>{t(lang, "status_" + r.status)}</b></p>
                {r.courses?.slug && <Link className="btn b2" href={`/courses/${r.courses.slug}`}>{t(lang, "details")}</Link>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

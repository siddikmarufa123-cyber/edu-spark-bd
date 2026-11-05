import Link from "next/link";
import type { Course } from "@/lib/site";
import { t, num, type Lang } from "@/lib/i18n";
import { enroll } from "@/app/actions";

export default function CourseCard({ c, lang, open }: { c: Course; lang: Lang; open: boolean }) {
  const pc = c.price > 0 ? Math.round((1 - c.discount_price / c.price) * 100) : 0;
  return (
    <article className="cc">
      <div className="th" style={{ background: `linear-gradient(135deg,hsl(${c.hue} 70% 38%),hsl(${(c.hue + 45) % 360} 75% 52%))` }}>
        {pc > 0 && <span className="bdg">-{num(lang, pc)}%</span>}
        {c.thumb_text}
      </div>
      <div className="cb">
        <h3>{c.title}</h3>
        <p className="mu">{t(lang, "teacher")}: {c.teacher}</p>
        <p className="mu sm">
          {num(lang, c.duration_months)} {t(lang, "months")} · {num(lang, c.class_count)} {t(lang, "classes")} · {num(lang, c.student_count)} {t(lang, "students")}
        </p>
        <p className="pr"><s>৳{num(lang, c.price)}</s> <strong>৳{num(lang, c.discount_price)}</strong></p>
        <div className="bt">
          <Link className="btn b2" href={`/courses/${c.slug}`}>{t(lang, "details")}</Link>
          <form action={enroll}>
            <input type="hidden" name="course_id" value={c.id} />
            <input type="hidden" name="slug" value={c.slug} />
            <button className="btn b1" disabled={!open}>{open ? t(lang, "enroll") : t(lang, "closed")}</button>
          </form>
        </div>
      </div>
    </article>
  );
}

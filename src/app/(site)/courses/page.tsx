import { getSite, getCourses, getLang } from "@/lib/site";
import { t } from "@/lib/i18n";
import CourseCard from "@/components/CourseCard";

export default async function Courses() {
  const [site, courses, lang] = await Promise.all([getSite(), getCourses(), getLang()]);
  return (
    <section className="sec">
      <div className="w">
        <h2>{t(lang, "courses")}</h2>
        <div className="grid">
          {courses.map((c) => <CourseCard key={c.id} c={c} lang={lang} open={site.flags.enrollment} />)}
        </div>
      </div>
    </section>
  );
}

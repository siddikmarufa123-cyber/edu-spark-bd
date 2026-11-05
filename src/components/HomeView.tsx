import Link from "next/link";
import type { Site, Course } from "@/lib/site";
import { t, num, type Lang } from "@/lib/i18n";
import CourseCard from "./CourseCard";

export default function HomeView({ site, courses, lang }: { site: Site; courses: Course[]; lang: Lang }) {
  const B = site.blocks;
  const wrap = (id: string, title: string, inner: React.ReactNode) => (
    <section className="sec" id={id} key={id}>
      <div className="w"><h2>{title}</h2>{inner}</div>
    </section>
  );
  const courseSec = (id: "ssc" | "hsc" | "combo", title: string) => {
    const list = courses.filter((c) => c.category === id);
    return wrap(id, title,
      list.length ? (
        <div className="grid">{list.map((c) => <CourseCard key={c.id} c={c} lang={lang} open={site.flags.enrollment} />)}</div>
      ) : <p className="mu">{t(lang, "noCourses")}</p>);
  };
  const render = (id: string, title: string) => {
    switch (id) {
      case "stats":
        return wrap(id, title, <div className="st">{B.stats.map((s, i) => <div className="box" key={i}><b>{s.n}</b>{s.l}</div>)}</div>);
      case "cats":
        return wrap(id, title, <div className="grid">{B.cats.map((s, i) => <div className="box" key={i}><h3 style={{ margin: 0 }}>{s.t}</h3><p className="mu" style={{ marginTop: 4 }}>{s.d}</p></div>)}</div>);
      case "ssc": case "hsc": case "combo":
        return courseSec(id, title);
      case "process":
        return wrap(id, title, <div className="grid">{B.process.map((s, i) => <div className="box" key={i}><h3 style={{ margin: 0 }}>{num(lang, i + 1)}. {s.t}</h3><p className="mu" style={{ marginTop: 4 }}>{s.d}</p></div>)}</div>);
      case "teachers":
        return wrap(id, title, <div className="grid">{B.teachers.map((s, i) => (
          <div className="box" key={i}>
            <div className="th" style={{ height: 70, borderRadius: 10, background: `hsl(${i * 70 + 220} 60% 45%)` }}>{s.name.slice(0, 1)}</div>
            <h3 style={{ margin: "10px 0 0" }}>{s.name}</h3><p className="mu">{s.sub}</p>
          </div>))}</div>);
      case "reviews":
        return wrap(id, title, <div className="grid">{B.reviews.map((s, i) => <div className="box" key={i}><p style={{ margin: "0 0 8px" }}>{s.q}</p><b>{s.by}</b></div>)}</div>);
      case "faq":
        return wrap(id, title, <>{B.faq.map((s, i) => <details key={i}><summary>{s.q}</summary><p className="mu">{s.a}</p></details>)}</>);
      default:
        return null;
    }
  };
  return (
    <>
      <section className="hero" id="top">
        <div className="w">
          <span className="tg">{site.brand.tagline}</span>
          <h1>{site.hero.title}</h1>
          <p>{site.hero.subtitle}</p>
          <Link className="btn b3" href="/courses">{site.hero.button}</Link>
        </div>
      </section>
      {site.sections.filter((s) => s.on).map((s) => render(s.id, s.t))}
    </>
  );
}

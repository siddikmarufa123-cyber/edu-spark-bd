import { getSite, getCourses, getLang } from "@/lib/site";
import HomeView from "@/components/HomeView";

export default async function Preview() {
  const [site, courses, lang] = await Promise.all([getSite("draft"), getCourses(), getLang()]);
  const style = { "--p": site.brand.primary, "--a": site.brand.accent, "--r": `${site.brand.radius}px` } as React.CSSProperties;
  return (
    <div style={{ ...style, border: "2px dashed var(--a)", borderRadius: 12, overflow: "hidden" }}>
      <div className="pv">ড্রাফট প্রিভিউ — এখনও প্রকাশিত হয়নি</div>
      {site.announcement.on && <div className="ann">{site.announcement.text}</div>}
      <HomeView site={site} courses={courses} lang={lang} />
    </div>
  );
}

import { getSite, getCourses, getLang } from "@/lib/site";
import HomeView from "@/components/HomeView";

export default async function Home() {
  const [site, courses, lang] = await Promise.all([getSite(), getCourses(), getLang()]);
  return <HomeView site={site} courses={courses} lang={lang} />;
}

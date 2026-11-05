import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSite, getUser, getLang } from "@/lib/site";
import { t } from "@/lib/i18n";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite();
  const { role } = await getUser();
  const lang = await getLang();
  // রক্ষণাবেক্ষণ মোডে শুধু Super Admin সাইট দেখতে পারেন
  if (site.flags.maintenance && role !== "super_admin") {
    return (
      <div className="mt">
        <div>
          <h1>{t(lang, "maint")}</h1>
          <p className="mu">{t(lang, "maintSub")}</p>
          <p><a className="btn b2" href="/login">{t(lang, "login")}</a></p>
        </div>
      </div>
    );
  }
  return (<><Header />{children}<Footer /></>);
}

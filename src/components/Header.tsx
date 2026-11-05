import Link from "next/link";
import { getSite, getUser, getLang } from "@/lib/site";
import { t } from "@/lib/i18n";
import { logout } from "@/app/actions";
import LangSwitch from "./LangSwitch";

const NAV: [string, string][] = [
  ["home", "/"], ["courses", "/courses"], ["live", "/#process"], ["exams", "/#process"],
  ["ebooks", "/#combo"], ["instructors", "/#teachers"], ["contact", "/#foot"],
];

export default async function Header() {
  const site = await getSite();
  const { user, role } = await getUser();
  const lang = await getLang();
  return (
    <>
      {site.announcement.on && <div className="ann">{site.announcement.text}</div>}
      <header className="top">
        <div className="w">
          <div className="hd">
            <Link href="/" className="lg"><i>⚡</i>{site.brand.name}</Link>
            <LangSwitch lang={lang} />
            {user ? (
              <>
                {role === "super_admin" && <Link className="btn b3" href="/admin">{t(lang, "superAdmin")}</Link>}
                <Link className="btn b2" href="/dashboard">{t(lang, "dashboard")}</Link>
                <form action={logout}><button className="btn b2">{t(lang, "logout")}</button></form>
              </>
            ) : (
              <>
                <Link className="btn b2" href="/login">{t(lang, "login")}</Link>
                {site.flags.registration && <Link className="btn b1" href="/register">{t(lang, "register")}</Link>}
              </>
            )}
          </div>
          <nav className="mn">
            {NAV.map(([k, href]) => <Link key={k} href={href}>{t(lang, k)}</Link>)}
          </nav>
        </div>
      </header>
    </>
  );
}

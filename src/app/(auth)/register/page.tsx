import Link from "next/link";
import { register } from "@/app/actions";
import { getLang, getSite } from "@/lib/site";
import { t } from "@/lib/i18n";

export default async function Register({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const sp = await searchParams;
  const [lang, site] = await Promise.all([getLang(), getSite()]);
  const closed = !site.flags.registration || sp.error === "closed";
  return (
    <div className="form">
      <h1>{t(lang, "register")}</h1>
      {closed ? (
        <div className="msg">{t(lang, "regClosed")}</div>
      ) : (
        <form action={register}>
          {sp.error && <div className="msg">Error</div>}
          <label>{t(lang, "name")}<input name="name" required /></label>
          <label>{t(lang, "email")}<input name="email" type="email" required autoComplete="email" /></label>
          <label>{t(lang, "password")}<input name="password" type="password" minLength={6} required autoComplete="new-password" /></label>
          <button className="btn b1" style={{ width: "100%" }}>{t(lang, "register")}</button>
        </form>
      )}
      <p className="mu">{t(lang, "haveAccount")} <Link href="/login" style={{ color: "var(--p)" }}>{t(lang, "login")}</Link></p>
    </div>
  );
}

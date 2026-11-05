import Link from "next/link";
import { login } from "@/app/actions";
import { getLang } from "@/lib/site";
import { t } from "@/lib/i18n";

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string; msg?: string; next?: string }> }) {
  const sp = await searchParams;
  const lang = await getLang();
  return (
    <div className="form">
      <h1>{t(lang, "login")}</h1>
      {sp.error && <div className="msg">{t(lang, "badLogin")}</div>}
      {sp.msg === "confirm" && <div className="msg">{t(lang, "checkMail")}</div>}
      <form action={login}>
        <input type="hidden" name="next" value={sp.next ?? "/dashboard"} />
        <label>{t(lang, "email")}<input name="email" type="email" required autoComplete="email" /></label>
        <label>{t(lang, "password")}<input name="password" type="password" required autoComplete="current-password" /></label>
        <button className="btn b1" style={{ width: "100%" }}>{t(lang, "login")}</button>
      </form>
      <p className="mu">{t(lang, "noAccount")} <Link href="/register" style={{ color: "var(--p)" }}>{t(lang, "register")}</Link></p>
    </div>
  );
}

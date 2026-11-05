"use client";
import { setLang } from "@/app/actions";

export default function LangSwitch({ lang }: { lang: string }) {
  return (
    <div className="lang">
      <button className={lang === "bn" ? "on" : ""} onClick={() => setLang("bn")}>বাংলা</button>
      <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
    </div>
  );
}

import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { getSite, getLang } from "@/lib/site";
import { hasSupabase } from "@/lib/supabase/mock";

const font = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bn",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return {
    title: site.brand.name,
    description: site.brand.tagline,
    icons: { icon: "/favicon.svg" },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite();
  const lang = await getLang();
  const style = {
    "--p": site.brand.primary,
    "--a": site.brand.accent,
    "--r": `${site.brand.radius}px`,
  } as React.CSSProperties;
  return (
    <html lang={lang} className={font.variable} style={style}>
      <body>
        {!hasSupabase() && (
          <div style={{ background: "#fff3cd", color: "#664d03", padding: "8px 16px", textAlign: "center", fontSize: 14 }}>
            ডেমো মোড: Supabase এখনো যুক্ত হয়নি, তাই নমুনা কোর্স দেখানো হচ্ছে। লগইন ও ভর্তি কাজ করবে না।
          </div>
        )}
        {children}
      </body>
    </html>
  );
}

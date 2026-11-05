import { cookies } from "next/headers";
import { createClient } from "./supabase/server";

export type Sec = { id: string; on: boolean; t: string };
export type Blocks = {
  stats: { n: string; l: string }[];
  cats: { t: string; d: string }[];
  process: { t: string; d: string }[];
  teachers: { name: string; sub: string }[];
  reviews: { q: string; by: string }[];
  faq: { q: string; a: string }[];
};
export type Site = {
  brand: { name: string; tagline: string; primary: string; accent: string; radius: number };
  announcement: { on: boolean; text: string };
  hero: { title: string; subtitle: string; button: string };
  sections: Sec[];
  flags: { maintenance: boolean; enrollment: boolean; registration: boolean };
  footer: { phone: string; email: string; address: string; copyright: string };
  blocks: Blocks;
};
export type Course = {
  id: string; slug: string; title: string; teacher: string; category: "ssc" | "hsc" | "combo";
  duration_months: number; class_count: number; student_count: number; price: number;
  discount_price: number; hue: number; thumb_text: string; description: string; is_published: boolean;
};

export const DEFAULT_BLOCKS: Blocks = {
  stats: [
    { n: "১০,০০০+", l: "শিক্ষার্থী" }, { n: "৫০+", l: "কোর্স" },
    { n: "২০+", l: "শিক্ষক" }, { n: "১,০০০+", l: "ভিডিও ক্লাস" },
  ],
  cats: [
    { t: "SSC প্রস্তুতি", d: "নবম–দশম শ্রেণি" }, { t: "HSC প্রস্তুতি", d: "একাদশ–দ্বাদশ শ্রেণি" },
    { t: "বিষয়ভিত্তিক কোর্স", d: "পছন্দের বিষয়ে গভীর প্রস্তুতি" }, { t: "কম্বো প্যাকেজ", d: "একসাথে সব বিষয়, কম দামে" },
  ],
  process: [
    { t: "কোর্সে ভর্তি হও", d: "পছন্দের কোর্স বেছে নিয়ে অনলাইনে ভর্তি হও।" },
    { t: "ক্লাস করো", d: "লাইভ ক্লাসে প্রশ্ন করো, রেকর্ডেড ক্লাস যতবার ইচ্ছা দেখো।" },
    { t: "পরীক্ষা দাও", d: "নিয়মিত পরীক্ষায় নিজের প্রস্তুতি যাচাই করো।" },
    { t: "ফলাফল দেখো", d: "ভুলগুলো বিশ্লেষণ করে এগিয়ে চলো।" },
  ],
  teachers: [
    { name: "আরিফ হোসেন", sub: "গণিত" }, { name: "সাবরিনা আক্তার", sub: "পদার্থবিজ্ঞান" },
    { name: "নুসরাত জাহান", sub: "রসায়ন" }, { name: "তানভীর রহমান", sub: "ইংরেজি" },
  ],
  reviews: [
    { q: "ক্লাসগুলো গুছিয়ে সাজানো, তাই কঠিন অধ্যায়ও সহজ লাগে।", by: "রিমা, SSC" },
    { q: "পরীক্ষার পর ভুলগুলো বোঝার সুযোগ আমার আত্মবিশ্বাস বাড়িয়েছে।", by: "সাকিব, HSC" },
    { q: "রেকর্ডেড ক্লাস থাকায় নিজের সময়মতো পড়তে পারি।", by: "তাসনিম, SSC" },
  ],
  faq: [
    { q: "কোর্সে ভর্তি হতে কী করতে হবে?", a: "পছন্দের কোর্সে “কোর্সে ভর্তি হও” বাটনে ক্লিক করে রেজিস্ট্রেশন ও পেমেন্ট সম্পন্ন করো।" },
    { q: "ক্লাস মিস হলে কী হবে?", a: "সব লাইভ ক্লাস রেকর্ড করা থাকে, পরে দেখে নিতে পারবে।" },
    { q: "কোন কোন মাধ্যমে পেমেন্ট করা যাবে?", a: "বিকাশ, নগদ, রকেট ও কার্ডে পেমেন্ট করা যাবে।" },
  ],
};

export const DEFAULTS: Site = {
  brand: { name: "EDU SPARK BD", tagline: "বাংলায় শেখো, আত্মবিশ্বাসের সঙ্গে এগিয়ে চলো।", primary: "#2a2f8f", accent: "#ffb400", radius: 14 },
  announcement: { on: true, text: "নতুন ব্যাচে ভর্তি চলছে!" },
  hero: { title: "শেখা হোক সহজ, ফলাফল হোক সেরা", subtitle: "SSC ও HSC-এর প্রস্তুতি নাও লাইভ ও রেকর্ডেড ক্লাসে।", button: "সকল কোর্স দেখো" },
  sections: [
    { id: "stats", on: true, t: "আমাদের পথচলা" }, { id: "cats", on: true, t: "তোমার শেখার পথ বেছে নাও" },
    { id: "ssc", on: true, t: "SSC কোর্সসমূহ" }, { id: "hsc", on: true, t: "HSC কোর্সসমূহ" },
    { id: "combo", on: true, t: "কম্বো প্যাকেজ ও বিশেষ অফার" }, { id: "process", on: true, t: "আমাদের শেখানোর ধাপ" },
    { id: "teachers", on: true, t: "জনপ্রিয় শিক্ষকবৃন্দ" }, { id: "reviews", on: true, t: "শিক্ষার্থীদের মতামত" },
    { id: "faq", on: true, t: "সাধারণ জিজ্ঞাসা" },
  ],
  flags: { maintenance: false, enrollment: true, registration: true },
  footer: { phone: "", email: "", address: "", copyright: "© EDU SPARK BD" },
  blocks: DEFAULT_BLOCKS,
};

export async function getSite(source: "published" | "draft" = "published"): Promise<Site> {
  const sb = await createClient();
  const { data } = await sb.from(source === "draft" ? "site_draft" : "site_published").select("key,value");
  const out: any = { ...DEFAULTS };
  (data ?? []).forEach((r: any) => { out[r.key] = r.value; });
  out.blocks = { ...DEFAULT_BLOCKS, ...(out.blocks || {}) };
  return out as Site;
}

export async function getCourses(): Promise<Course[]> {
  const sb = await createClient();
  const { data } = await sb.from("courses").select("*").eq("is_published", true).order("sort_order");
  return (data ?? []) as Course[];
}

export async function getUser() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return { user: null, role: null as string | null, name: "" };
  const { data } = await sb.from("profiles").select("role,full_name").eq("id", user.id).single();
  return { user, role: (data?.role ?? "student") as string, name: (data?.full_name ?? "") as string };
}

export async function getLang(): Promise<"bn" | "en"> {
  const c = await cookies();
  return c.get("lang")?.value === "en" ? "en" : "bn";
}

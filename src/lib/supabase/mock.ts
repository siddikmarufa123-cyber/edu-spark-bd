// ⚠️ নমুনা (MOCK) ডাটা — শুধু তখনই ব্যবহার হয় যখন NEXT_PUBLIC_SUPABASE_URL ও
// NEXT_PUBLIC_SUPABASE_ANON_KEY সেট করা নেই। এগুলো সেট করলেই আসল Supabase চালু হবে।
// Sample data used only while the Supabase environment variables are missing.
import type { Course } from "@/lib/site";

export const hasSupabase = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const base = { student_count: 0, is_published: true, description: "নমুনা কোর্স — Supabase সংযোগ দিলে আসল কোর্স দেখাবে।" };
const SAMPLE_COURSES: (Course & { sort_order: number })[] = [
  { ...base, id: "s1", slug: "ssc-science", title: "SSC বিজ্ঞান সম্পূর্ণ প্রস্তুতি (নমুনা)", teacher: "আরিফ হোসেন", category: "ssc", duration_months: 6, class_count: 72, price: 3000, discount_price: 2000, hue: 230, thumb_text: "SSC বিজ্ঞান", sort_order: 1 },
  { ...base, id: "s2", slug: "ssc-math", title: "SSC গণিত মাস্টারক্লাস (নমুনা)", teacher: "সাবরিনা আক্তার", category: "ssc", duration_months: 4, class_count: 48, price: 2000, discount_price: 1500, hue: 160, thumb_text: "SSC গণিত", sort_order: 2 },
  { ...base, id: "h1", slug: "hsc-physics", title: "HSC পদার্থবিজ্ঞান (নমুনা)", teacher: "নুসরাত জাহান", category: "hsc", duration_months: 6, class_count: 80, price: 3500, discount_price: 2500, hue: 280, thumb_text: "HSC পদার্থ", sort_order: 3 },
  { ...base, id: "c1", slug: "ssc-combo", title: "SSC কম্বো প্যাকেজ (নমুনা)", teacher: "EDU SPARK BD টিম", category: "combo", duration_months: 12, class_count: 200, price: 8000, discount_price: 5000, hue: 20, thumb_text: "কম্বো", sort_order: 4 },
];

const notConfigured = { message: "Supabase is not configured yet" };

function query(table: string) {
  let rows: any[] = table === "courses" ? [...SAMPLE_COURSES] : [];
  const q: any = {
    select: () => q,
    order: () => q,
    limit: () => q,
    eq: (col: string, val: unknown) => { rows = rows.filter((r) => r[col] === val); return q; },
    insert: () => Promise.resolve({ data: null, error: notConfigured }),
    upsert: () => Promise.resolve({ data: null, error: notConfigured }),
    update: () => ({ eq: () => Promise.resolve({ data: null, error: notConfigured }) }),
    delete: () => ({ eq: () => Promise.resolve({ data: null, error: notConfigured }) }),
    single: () => Promise.resolve({ data: rows[0] ?? null, error: rows[0] ? null : notConfigured }),
    maybeSingle: () => Promise.resolve({ data: rows[0] ?? null, error: null }),
    then: (ok: any, fail: any) => Promise.resolve({ data: rows, error: null }).then(ok, fail),
  };
  return q;
}

export function createMockClient(): any {
  return {
    from: query,
    rpc: () => Promise.resolve({ data: null, error: notConfigured }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: null, error: notConfigured }),
      signUp: () => Promise.resolve({ data: { session: null }, error: notConfigured }),
      signOut: () => Promise.resolve({ error: null }),
    },
  };
}

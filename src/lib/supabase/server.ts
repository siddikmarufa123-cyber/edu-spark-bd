import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createMockClient, hasSupabase } from "./mock";

export async function createClient() {
  // Supabase ভ্যারিয়েবল না থাকলে নমুনা ডাটা দেখাও।
  if (!hasSupabase()) return createMockClient();
  const store = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return store.getAll();
        },
        setAll(list) {
          try {
            list.forEach(({ name, value, options }) => store.set(name, value, options));
          } catch {
            // Server Component থেকে কল হলে কুকি সেট করা যায় না — middleware এটি সামলায়।
          }
        },
      },
    }
  );
}

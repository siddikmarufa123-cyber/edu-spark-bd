import { createClient } from "@/lib/supabase/server";
import { restoreVersion } from "../actions";

export default async function Versions() {
  const sb = await createClient();
  const { data } = await sb.from("site_versions").select("id,created_at").order("id", { ascending: false }).limit(20);
  return (
    <div className="box">
      <h3>ভার্সন হিস্ট্রি</h3>
      <p className="mu sm">প্রতিবার “প্রকাশ করো” চাপলে আগের প্রকাশিত ভার্সন এখানে জমা হয়। ফিরিয়ে আনলে সেটি ড্রাফটে আসে — তারপর প্রিভিউ দেখে আবার প্রকাশ করতে হবে।</p>
      {(data ?? []).length === 0 && <p className="mu">এখনও কোনো ভার্সন নেই।</p>}
      {(data ?? []).map((v: any) => (
        <form className="li" action={restoreVersion} key={v.id}>
          <input type="hidden" name="vid" value={v.id} />
          <span className="g">{new Date(v.created_at).toLocaleString("bn-BD")}</span>
          <button className="btn b2">ড্রাফটে ফিরিয়ে আনো</button>
        </form>
      ))}
    </div>
  );
}

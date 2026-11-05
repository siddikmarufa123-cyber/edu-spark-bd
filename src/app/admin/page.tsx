import { getSite } from "@/lib/site";
import { saveSettings } from "./actions";

export default async function AdminSettings() {
  const c = await getSite("draft");
  return (
    <form action={saveSettings} style={{ display: "grid", gap: 18 }}>
      <input type="hidden" name="section_ids" value={JSON.stringify(c.sections.map((x) => x.id))} />
      <div className="box"><h3>ব্র্যান্ড ও ডিজাইন</h3>
        <div className="row">
          <label>ওয়েবসাইটের নাম<input name="name" defaultValue={c.brand.name} /></label>
          <label>ট্যাগলাইন<input name="tagline" defaultValue={c.brand.tagline} /></label>
        </div>
        <div className="row">
          <label>প্রধান রং<input type="color" name="primary" defaultValue={c.brand.primary} /></label>
          <label>অ্যাকসেন্ট রং<input type="color" name="accent" defaultValue={c.brand.accent} /></label>
          <label>কোণের গোলাকার ভাব (px)<input type="number" min={0} max={28} name="radius" defaultValue={c.brand.radius} /></label>
        </div>
      </div>
      <div className="box"><h3>ঘোষণা বার ও হিরো সেকশন</h3>
        <label style={{ color: "var(--tx)" }}><input type="checkbox" name="ann_on" defaultChecked={c.announcement.on} />ঘোষণা বার চালু</label>
        <label>ঘোষণার লেখা<input name="ann_text" defaultValue={c.announcement.text} /></label>
        <label>হিরো শিরোনাম<input name="hero_title" defaultValue={c.hero.title} /></label>
        <label>হিরো সাবটাইটেল<input name="hero_subtitle" defaultValue={c.hero.subtitle} /></label>
        <label>বাটনের লেখা<input name="hero_button" defaultValue={c.hero.button} /></label>
      </div>
      <div className="box"><h3>হোমপেজ সেকশন (ক্রম নম্বর ছোট হলে আগে দেখাবে)</h3>
        {c.sections.map((s, i) => (
          <div className="li" key={s.id}>
            <input type="number" name={"o_" + s.id} defaultValue={i + 1} style={{ width: 70 }} title="ক্রম" />
            <input type="checkbox" name={"on_" + s.id} defaultChecked={s.on} title="চালু/বন্ধ" />
            <input className="g" name={"t_" + s.id} defaultValue={s.t} />
          </div>
        ))}
      </div>
      <div className="box"><h3>অ্যাডভান্স কন্ট্রোল ও ফুটার</h3>
        <label style={{ color: "var(--tx)" }}><input type="checkbox" name="maintenance" defaultChecked={c.flags.maintenance} />রক্ষণাবেক্ষণ মোড</label>
        <label style={{ color: "var(--tx)" }}><input type="checkbox" name="enrollment" defaultChecked={c.flags.enrollment} />কোর্সে ভর্তি চালু</label>
        <label style={{ color: "var(--tx)" }}><input type="checkbox" name="registration" defaultChecked={c.flags.registration} />রেজিস্ট্রেশন চালু</label>
        <div className="row">
          <label>ফোন<input name="phone" defaultValue={c.footer.phone} /></label>
          <label>ইমেইল<input name="email" defaultValue={c.footer.email} /></label>
          <label>ঠিকানা<input name="address" defaultValue={c.footer.address} /></label>
        </div>
        <label>কপিরাইট লেখা<input name="copyright" defaultValue={c.footer.copyright} /></label>
      </div>
      <button className="btn b1">ড্রাফট সংরক্ষণ করো</button>
    </form>
  );
}

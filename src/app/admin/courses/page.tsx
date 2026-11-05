import { createClient } from "@/lib/supabase/server";
import { saveCourse, deleteCourse } from "../actions";

const F = ({ l, n, v, t }: { l: string; n: string; v?: any; t?: string }) => (
  <label>{l}<input name={n} type={t ?? "text"} defaultValue={v ?? ""} /></label>
);

function CourseForm({ c }: { c?: any }) {
  return (
    <form action={saveCourse} className="cr">
      {c && <input type="hidden" name="id" value={c.id} />}
      <div className="row">
        <F l="কোর্সের নাম" n="title" v={c?.title} />
        <F l="শিক্ষক" n="teacher" v={c?.teacher} />
        <label>ক্যাটাগরি
          <select name="category" defaultValue={c?.category ?? "ssc"}>
            <option value="ssc">SSC</option><option value="hsc">HSC</option><option value="combo">কম্বো</option>
          </select>
        </label>
        {!c && <F l="স্লাগ (ইংরেজি, ফাঁকা রাখলে অটো)" n="slug" />}
      </div>
      <div className="row">
        <F l="মূল দাম" n="price" t="number" v={c?.price ?? 0} />
        <F l="ছাড়ের দাম" n="discount_price" t="number" v={c?.discount_price ?? 0} />
        <F l="ক্লাস সংখ্যা" n="class_count" t="number" v={c?.class_count ?? 0} />
        <F l="মেয়াদ (মাস)" n="duration_months" t="number" v={c?.duration_months ?? 0} />
        <F l="শিক্ষার্থী সংখ্যা" n="student_count" t="number" v={c?.student_count ?? 0} />
        <F l="থাম্বনেইল রং (০–৩৬০)" n="hue" t="number" v={c?.hue ?? 230} />
        <F l="থাম্বনেইলের লেখা" n="thumb_text" v={c?.thumb_text} />
        <F l="ক্রম নম্বর" n="sort_order" t="number" v={c?.sort_order ?? 0} />
      </div>
      <label>বিবরণ<textarea name="description" rows={3} defaultValue={c?.description ?? ""} /></label>
      <label style={{ color: "var(--tx)" }}><input type="checkbox" name="is_published" defaultChecked={c ? c.is_published : true} />সাইটে দেখাও</label>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn b1">{c ? "সংরক্ষণ" : "কোর্স যোগ করো"}</button>
        {c && <button className="btn bd2" formAction={deleteCourse}>মুছে ফেলো</button>}
      </div>
    </form>
  );
}

export default async function AdminCourses() {
  const sb = await createClient();
  const { data } = await sb.from("courses").select("*").order("sort_order");
  return (
    <div className="box">
      <h3>কোর্স — পরিবর্তন সঙ্গে সঙ্গে সাইটে প্রযোজ্য হয়</h3>
      <p className="mu sm">মুছে ফেললে ওই কোর্সের সব ভর্তির রেকর্ডও মুছে যায়। অস্থায়ীভাবে লুকাতে “সাইটে দেখাও” বন্ধ করো।</p>
      {(data ?? []).map((c: any) => <CourseForm key={c.id} c={c} />)}
      <h3>নতুন কোর্স</h3>
      <CourseForm />
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser, getSite } from "@/lib/site";
import { publish, discard } from "./actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { role } = await getUser();
  if (role !== "super_admin") redirect("/");
  const [pub, draft] = await Promise.all([getSite("published"), getSite("draft")]);
  const dirty = JSON.stringify(pub) !== JSON.stringify(draft);
  return (
    <div className="ad">
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <h2 style={{ margin: 0, marginRight: "auto" }}>সুপার অ্যাডমিন — ওয়েবসাইট কাস্টমাইজেশন</h2>
        <Link className="btn b2" href="/">সাইট দেখো</Link>
      </div>
      <div className="bar">
        <span className="s"><span className="dot" style={{ background: dirty ? "#e8890c" : "#1b9e5a" }} />{dirty ? "অপ্রকাশিত পরিবর্তন আছে" : "সব পরিবর্তন প্রকাশিত"}</span>
        <Link className="btn b2" href="/admin/preview">লাইভ প্রিভিউ</Link>
        <form action={publish}><button className="btn b1" disabled={!dirty}>প্রকাশ করো</button></form>
        <form action={discard}><button className="btn b2" disabled={!dirty}>বাতিল করো</button></form>
      </div>
      <nav className="tabs">
        <Link className="btn b2" href="/admin">সেটিংস</Link>
        <Link className="btn b2" href="/admin/content">কনটেন্ট ব্লক</Link>
        <Link className="btn b2" href="/admin/courses">কোর্স</Link>
        <Link className="btn b2" href="/admin/versions">ভার্সন হিস্ট্রি</Link>
      </nav>
      {children}
    </div>
  );
}

import { getSite } from "@/lib/site";
import { saveBlocks } from "./../actions";

const LABELS: Record<string, string> = {
  stats: "পরিসংখ্যান [{n, l}]", cats: "শেখার পথ [{t, d}]", process: "শেখানোর ধাপ [{t, d}]",
  teachers: "শিক্ষকবৃন্দ [{name, sub}]", reviews: "শিক্ষার্থীদের মতামত [{q, by}]", faq: "সাধারণ জিজ্ঞাসা [{q, a}]",
};

export default async function Content({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string }> }) {
  const sp = await searchParams;
  const c = await getSite("draft");
  return (
    <form action={saveBlocks} style={{ display: "grid", gap: 18 }}>
      {sp.error && <div className="msg">“{LABELS[sp.error] ?? sp.error}” ঘরের JSON ভুল। ঠিক করে আবার সংরক্ষণ করো।</div>}
      {sp.saved && <div className="msg">ড্রাফট সংরক্ষণ হয়েছে।</div>}
      <p className="mu">নিচের প্রতিটি ঘরে তালিকা আকারে লেখা আছে। শুধু লেখার অংশ (বাংলা টেক্সট) বদলাও, চিহ্নগুলো ঠিক রাখো।</p>
      {Object.keys(LABELS).map((k) => (
        <div className="box" key={k}>
          <label>{LABELS[k]}
            <textarea name={k} rows={8} defaultValue={JSON.stringify((c.blocks as any)[k], null, 2)} style={{ fontFamily: "monospace" }} />
          </label>
        </div>
      ))}
      <button className="btn b1">ড্রাফট সংরক্ষণ করো</button>
    </form>
  );
}

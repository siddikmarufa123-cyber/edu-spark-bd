import { getSite, getLang } from "@/lib/site";
import { t } from "@/lib/i18n";

export default async function Footer() {
  const site = await getSite();
  const lang = await getLang();
  return (
    <footer className="ft" id="foot">
      <div className="w">
        <div className="grid">
          <div><h4>{site.brand.name}</h4><p>{site.brand.tagline}</p></div>
          <div>
            <h4>{t(lang, "contact")}</h4>
            <p>{site.footer.phone}<br />{site.footer.email}<br />{site.footer.address}</p>
          </div>
          <div>
            <h4>{t(lang, "payment")}</h4>
            {["বিকাশ", "নগদ", "রকেট", "কার্ড"].map((x) => <span className="chip" key={x}>{x}</span>)}
          </div>
        </div>
        <p style={{ margin: "24px 0 0", fontSize: 14 }}>{site.footer.copyright}</p>
      </div>
    </footer>
  );
}

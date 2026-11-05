"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// সব অ্যাকশন Row Level Security দ্বারা সুরক্ষিত — Super Admin ছাড়া কিছুই লিখতে পারবে না।
const s = (fd: FormData, k: string) => String(fd.get(k) ?? "");
const n = (fd: FormData, k: string) => Number(s(fd, k)) || 0;
const on = (fd: FormData, k: string) => fd.get(k) === "on";

export async function saveSettings(fd: FormData) {
  const sb = await createClient();
  const ids = JSON.parse(s(fd, "section_ids")) as string[];
  const sections = ids
    .map((id) => ({ id, on: on(fd, "on_" + id), t: s(fd, "t_" + id), o: n(fd, "o_" + id) }))
    .sort((a, b) => a.o - b.o)
    .map(({ id, on, t }) => ({ id, on, t }));
  const rows = [
    { key: "brand", value: { name: s(fd, "name"), tagline: s(fd, "tagline"), primary: s(fd, "primary"), accent: s(fd, "accent"), radius: n(fd, "radius") } },
    { key: "announcement", value: { on: on(fd, "ann_on"), text: s(fd, "ann_text") } },
    { key: "hero", value: { title: s(fd, "hero_title"), subtitle: s(fd, "hero_subtitle"), button: s(fd, "hero_button") } },
    { key: "sections", value: sections },
    { key: "flags", value: { maintenance: on(fd, "maintenance"), enrollment: on(fd, "enrollment"), registration: on(fd, "registration") } },
    { key: "footer", value: { phone: s(fd, "phone"), email: s(fd, "email"), address: s(fd, "address"), copyright: s(fd, "copyright") } },
  ].map((r) => ({ ...r, updated_at: new Date().toISOString() }));
  await sb.from("site_draft").upsert(rows);
  revalidatePath("/admin", "layout");
}

export async function saveBlocks(fd: FormData) {
  const sb = await createClient();
  const names = ["stats", "cats", "process", "teachers", "reviews", "faq"];
  const value: Record<string, unknown> = {};
  for (const k of names) {
    try {
      value[k] = JSON.parse(s(fd, k));
    } catch {
      redirect("/admin/content?error=" + k);
    }
  }
  await sb.from("site_draft").upsert({ key: "blocks", value, updated_at: new Date().toISOString() });
  revalidatePath("/admin", "layout");
  redirect("/admin/content?saved=1");
}

export async function publish() {
  const sb = await createClient();
  await sb.rpc("publish_site");
  revalidatePath("/", "layout");
}

export async function discard() {
  const sb = await createClient();
  await sb.rpc("discard_draft");
  revalidatePath("/admin", "layout");
}

export async function restoreVersion(fd: FormData) {
  const sb = await createClient();
  await sb.rpc("restore_version", { vid: n(fd, "vid") });
  revalidatePath("/admin", "layout");
  redirect("/admin");
}

export async function saveCourse(fd: FormData) {
  const sb = await createClient();
  const id = s(fd, "id");
  const row: Record<string, unknown> = {
    title: s(fd, "title"), teacher: s(fd, "teacher"), category: s(fd, "category") || "ssc",
    price: n(fd, "price"), discount_price: n(fd, "discount_price"), class_count: n(fd, "class_count"),
    duration_months: n(fd, "duration_months"), student_count: n(fd, "student_count"),
    hue: n(fd, "hue"), thumb_text: s(fd, "thumb_text"), description: s(fd, "description"),
    is_published: on(fd, "is_published"), sort_order: n(fd, "sort_order"),
  };
  if (id) await sb.from("courses").update(row).eq("id", id);
  else await sb.from("courses").insert({ ...row, slug: s(fd, "slug") || "c-" + Date.now().toString(36) });
  revalidatePath("/", "layout");
  redirect("/admin/courses");
}

export async function deleteCourse(fd: FormData) {
  const sb = await createClient();
  await sb.from("courses").delete().eq("id", s(fd, "id"));
  revalidatePath("/", "layout");
  redirect("/admin/courses");
}

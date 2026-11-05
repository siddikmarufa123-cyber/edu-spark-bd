"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSite } from "@/lib/site";

const safeNext = (n: string) => (n.startsWith("/") && !n.startsWith("//") ? n : "/dashboard");

export async function setLang(l: string) {
  (await cookies()).set("lang", l === "en" ? "en" : "bn", { path: "/", maxAge: 31536000 });
  revalidatePath("/", "layout");
}

export async function login(fd: FormData) {
  const sb = await createClient();
  const { error } = await sb.auth.signInWithPassword({
    email: String(fd.get("email") ?? ""),
    password: String(fd.get("password") ?? ""),
  });
  if (error) redirect("/login?error=1");
  redirect(safeNext(String(fd.get("next") ?? "/dashboard")));
}

export async function register(fd: FormData) {
  const site = await getSite();
  if (!site.flags.registration) redirect("/register?error=closed");
  const sb = await createClient();
  const { data, error } = await sb.auth.signUp({
    email: String(fd.get("email") ?? ""),
    password: String(fd.get("password") ?? ""),
    options: { data: { full_name: String(fd.get("name") ?? "") } },
  });
  if (error) redirect("/register?error=1");
  if (!data.session) redirect("/login?msg=confirm");
  redirect("/dashboard");
}

export async function logout() {
  const sb = await createClient();
  await sb.auth.signOut();
  redirect("/");
}

export async function enroll(fd: FormData) {
  const courseId = String(fd.get("course_id") ?? "");
  const slug = String(fd.get("slug") ?? "");
  const site = await getSite();
  if (!site.flags.enrollment) redirect(`/courses/${slug}`);
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect(`/login?next=/courses/${slug}`);
  await sb.from("enrollments").upsert(
    { user_id: user!.id, course_id: courseId, status: "pending" },
    { onConflict: "user_id,course_id", ignoreDuplicates: true }
  );
  redirect("/dashboard?msg=enrolled");
}

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// সেশন রিফ্রেশ করে এবং /dashboard ও /admin লগইন ছাড়া খুলতে দেয় না।
export async function middleware(req: NextRequest) {
  // Supabase সেট না থাকলে লগইন নেই — সুরক্ষিত পাতা লগইনে পাঠাও।
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const p = req.nextUrl.pathname;
    if (p.startsWith("/dashboard") || p.startsWith("/admin")) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.search = "";
      url.searchParams.set("next", p);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }
  let res = NextResponse.next({ request: req });
  const sb = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(list) {
          list.forEach(({ name, value }) => req.cookies.set(name, value));
          res = NextResponse.next({ request: req });
          list.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
        },
      },
    }
  );
  const {
    data: { user },
  } = await sb.auth.getUser();
  const p = req.nextUrl.pathname;
  if (!user && (p.startsWith("/dashboard") || p.startsWith("/admin"))) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", p);
    return NextResponse.redirect(url);
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.svg|.*\\.(?:svg|png|jpg|jpeg|ico|webp)$).*)"],
};

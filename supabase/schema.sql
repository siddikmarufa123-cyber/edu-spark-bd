-- EDU SPARK BD — Supabase ডাটাবেস স্কিমা
-- Supabase Dashboard → SQL Editor → New query → পুরোটা পেস্ট করে Run চাপুন।

create extension if not exists pgcrypto;

-- ============ টেবিল ============
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text default '',
  phone text default '',
  role text not null default 'student' check (role in ('student','admin','super_admin')),
  created_at timestamptz default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  teacher text not null default '',
  category text not null check (category in ('ssc','hsc','combo')),
  duration_months int default 0,
  class_count int default 0,
  student_count int default 0,
  price int not null default 0,
  discount_price int not null default 0,
  hue int default 230,
  thumb_text text default '',
  description text default '',
  is_published boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','active','cancelled')),
  created_at timestamptz default now(),
  unique (user_id, course_id)
);

create table if not exists public.site_draft (
  key text primary key, value jsonb not null, updated_at timestamptz default now()
);
create table if not exists public.site_published (
  key text primary key, value jsonb not null, updated_at timestamptz default now()
);
create table if not exists public.site_versions (
  id bigint generated always as identity primary key,
  snapshot jsonb not null,
  created_at timestamptz default now()
);

-- ============ সাহায্যকারী ফাংশন ============
create or replace function public.my_role() returns text
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_super_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.my_role() = 'super_admin', false)
$$;

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- ড্রাফট → প্রকাশ (শুধু Super Admin)
create or replace function public.publish_site() returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_super_admin() then raise exception 'not allowed'; end if;
  insert into public.site_versions (snapshot)
    select coalesce(jsonb_object_agg(key, value), '{}'::jsonb) from public.site_published;
  insert into public.site_published (key, value, updated_at)
    select key, value, now() from public.site_draft
    on conflict (key) do update set value = excluded.value, updated_at = now();
end $$;

-- ড্রাফট বাতিল (প্রকাশিত ভার্সনে ফিরে যাওয়া)
create or replace function public.discard_draft() returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_super_admin() then raise exception 'not allowed'; end if;
  delete from public.site_draft where true;
  insert into public.site_draft (key, value) select key, value from public.site_published;
end $$;

-- পুরনো ভার্সন ড্রাফটে ফিরিয়ে আনা
create or replace function public.restore_version(vid bigint) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_super_admin() then raise exception 'not allowed'; end if;
  insert into public.site_draft (key, value, updated_at)
    select key, value, now() from jsonb_each((select snapshot from public.site_versions where id = vid))
    on conflict (key) do update set value = excluded.value, updated_at = now();
end $$;

-- ============ Row Level Security ============
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.site_draft enable row level security;
alter table public.site_published enable row level security;
alter table public.site_versions enable row level security;

drop policy if exists profiles_select on public.profiles;
drop policy if exists profiles_update_own on public.profiles;
drop policy if exists profiles_admin_all on public.profiles;
create policy profiles_select on public.profiles for select
  using (id = auth.uid() or public.is_super_admin());
create policy profiles_update_own on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid() and role = public.my_role());
create policy profiles_admin_all on public.profiles for all
  using (public.is_super_admin()) with check (public.is_super_admin());

drop policy if exists courses_select on public.courses;
drop policy if exists courses_admin_all on public.courses;
create policy courses_select on public.courses for select
  using (is_published or public.is_super_admin());
create policy courses_admin_all on public.courses for all
  using (public.is_super_admin()) with check (public.is_super_admin());

drop policy if exists enroll_select on public.enrollments;
drop policy if exists enroll_insert on public.enrollments;
drop policy if exists enroll_admin_all on public.enrollments;
create policy enroll_select on public.enrollments for select
  using (user_id = auth.uid() or public.is_super_admin());
create policy enroll_insert on public.enrollments for insert
  with check (user_id = auth.uid() and status = 'pending');
create policy enroll_admin_all on public.enrollments for all
  using (public.is_super_admin()) with check (public.is_super_admin());

drop policy if exists pub_select on public.site_published;
drop policy if exists pub_admin_all on public.site_published;
create policy pub_select on public.site_published for select using (true);
create policy pub_admin_all on public.site_published for all
  using (public.is_super_admin()) with check (public.is_super_admin());

drop policy if exists draft_admin_all on public.site_draft;
create policy draft_admin_all on public.site_draft for all
  using (public.is_super_admin()) with check (public.is_super_admin());

drop policy if exists ver_admin_all on public.site_versions;
create policy ver_admin_all on public.site_versions for all
  using (public.is_super_admin()) with check (public.is_super_admin());

-- ============ প্রাথমিক (নমুনা) তথ্য ============
insert into public.site_published (key, value) values
 ('brand', '{"name":"EDU SPARK BD","tagline":"বাংলায় শেখো, আত্মবিশ্বাসের সঙ্গে এগিয়ে চলো।","primary":"#2a2f8f","accent":"#ffb400","radius":14}'),
 ('announcement', '{"on":true,"text":"নতুন ব্যাচে ভর্তি চলছে — এখনই ২০% পর্যন্ত ছাড়!"}'),
 ('hero', '{"title":"শেখা হোক সহজ, ফলাফল হোক সেরা","subtitle":"SSC ও HSC-এর প্রস্তুতি নাও লাইভ ও রেকর্ডেড ক্লাসে, নিজের গতিতে, অভিজ্ঞ শিক্ষকদের সঙ্গে।","button":"সকল কোর্স দেখো"}'),
 ('sections', '[{"id":"stats","on":true,"t":"আমাদের পথচলা"},{"id":"cats","on":true,"t":"তোমার শেখার পথ বেছে নাও"},{"id":"ssc","on":true,"t":"SSC কোর্সসমূহ"},{"id":"hsc","on":true,"t":"HSC কোর্সসমূহ"},{"id":"combo","on":true,"t":"কম্বো প্যাকেজ ও বিশেষ অফার"},{"id":"process","on":true,"t":"আমাদের শেখানোর ধাপ"},{"id":"teachers","on":true,"t":"জনপ্রিয় শিক্ষকবৃন্দ"},{"id":"reviews","on":true,"t":"শিক্ষার্থীদের মতামত"},{"id":"faq","on":true,"t":"সাধারণ জিজ্ঞাসা"}]'),
 ('flags', '{"maintenance":false,"enrollment":true,"registration":true}'),
 ('footer', '{"phone":"০১৭০০-০০০০০০","email":"info@eduspark.example","address":"ঢাকা, বাংলাদেশ","copyright":"© ২০২৬ EDU SPARK BD। সর্বস্বত্ব সংরক্ষিত।"}')
on conflict (key) do nothing;

insert into public.site_draft (key, value) select key, value from public.site_published
on conflict (key) do nothing;

insert into public.courses (slug, title, teacher, category, duration_months, class_count, student_count, price, discount_price, hue, thumb_text, description, sort_order) values
 ('ssc-math','SSC গণিত পূর্ণাঙ্গ কোর্স','আরিফ হোসেন','ssc',6,80,1250,2500,1800,235,'গণিত','নমুনা বিবরণ — অ্যাডমিন প্যানেল থেকে বদলান।',1),
 ('ssc-physics','SSC পদার্থবিজ্ঞান ফুল কোর্স','সাবরিনা আক্তার','ssc',5,64,980,2200,1600,200,'পদার্থ','নমুনা বিবরণ — অ্যাডমিন প্যানেল থেকে বদলান।',2),
 ('ssc-english','SSC ইংরেজি গ্রামার মাস্টারি','তানভীর রহমান','ssc',4,48,1430,1800,1200,20,'ইংরেজি','নমুনা বিবরণ — অ্যাডমিন প্যানেল থেকে বদলান।',3),
 ('hsc-physics-1','HSC পদার্থবিজ্ঞান ১ম পত্র','মাহফুজ আলম','hsc',6,90,870,3200,2400,280,'পদার্থ ১ম','নমুনা বিবরণ — অ্যাডমিন প্যানেল থেকে বদলান।',4),
 ('hsc-chemistry-2','HSC রসায়ন ২য় পত্র','নুসরাত জাহান','hsc',6,84,760,3000,2200,150,'রসায়ন','নমুনা বিবরণ — অ্যাডমিন প্যানেল থেকে বদলান।',5),
 ('hsc-higher-math','HSC উচ্চতর গণিত','রাকিব হাসান','hsc',7,100,910,3400,2600,330,'উচ্চতর গণিত','নমুনা বিবরণ — অ্যাডমিন প্যানেল থেকে বদলান।',6),
 ('ssc-science-combo','SSC সায়েন্স কম্বো প্যাকেজ','একাধিক শিক্ষক','combo',8,220,640,7000,4500,45,'SSC কম্বো','নমুনা বিবরণ — অ্যাডমিন প্যানেল থেকে বদলান।',7),
 ('hsc-science-combo','HSC সায়েন্স কম্বো প্যাকেজ','একাধিক শিক্ষক','combo',10,300,520,9500,6200,175,'HSC কম্বো','নমুনা বিবরণ — অ্যাডমিন প্যানেল থেকে বদলান।',8)
on conflict (slug) do nothing;

-- ============ Super Admin বানানো ============
-- আগে সাইটে রেজিস্ট্রেশন করুন, তারপর নিচের লাইনে নিজের ইমেইল বসিয়ে আলাদা query হিসেবে Run করুন:
-- update public.profiles set role = 'super_admin' where id = (select id from auth.users where email = 'আপনার-ইমেইল@example.com');

-- Premium Minecraft creative portfolio CMS schema.
-- Run this in Supabase SQL editor or through the Supabase CLI.

create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  avatar_url text,
  created_at timestamptz not null default now()
);

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.users where id = auth.uid()
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() = 'admin', false)
$$;

create or replace function public.is_admin_or_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() in ('admin', 'editor'), false)
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  display_order integer not null default 0,
  visibility text not null default 'public' check (visibility in ('public', 'private', 'draft')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text,
  full_description text,
  category_id uuid references public.categories(id) on delete set null,
  thumbnail_url text,
  gallery_images text[] not null default '{}',
  tags text[] not null default '{}',
  featured boolean not null default false,
  popularity_score integer not null default 0,
  visibility text not null default 'draft' check (visibility in ('public', 'private', 'draft')),
  client_name text,
  client_permission boolean not null default false,
  external_link text,
  discord_order_link text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text,
  full_description text,
  starting_price numeric(10, 2) not null default 0,
  delivery_time text,
  revisions text,
  feature_list text[] not null default '{}',
  featured boolean not null default false,
  discord_order_link text,
  active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_role text,
  quote text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  approved boolean not null default false,
  featured boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.homepage_blocks (
  id uuid primary key default gen_random_uuid(),
  block_type text not null,
  title text,
  subtitle text,
  content text,
  image_url text,
  linked_portfolio_ids uuid[] not null default '{}',
  alignment text not null default 'left' check (alignment in ('left', 'center', 'right', 'split-left', 'split-right')),
  style_variant text not null default 'default',
  visibility text not null default 'public' check (visibility in ('public', 'private', 'draft')),
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  site_name text not null default 'Creative Portfolio',
  hero_title text,
  hero_subtitle text,
  about_text text,
  discord_url text,
  socials jsonb not null default '{}'::jsonb,
  footer_text text,
  seo_title text,
  seo_description text,
  logo_url text,
  favicon_url text,
  singleton boolean not null default true unique,
  updated_at timestamptz not null default now()
);

create table if not exists public.media_library (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  file_url text not null,
  file_type text not null,
  alt_text text,
  uploaded_by uuid references public.users(id) on delete set null,
  storage_path text not null unique,
  file_size bigint,
  width integer,
  height integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists set_portfolio_items_updated_at on public.portfolio_items;
create trigger set_portfolio_items_updated_at
before update on public.portfolio_items
for each row execute function public.set_updated_at();

drop trigger if exists set_services_updated_at on public.services;
create trigger set_services_updated_at
before update on public.services
for each row execute function public.set_updated_at();

drop trigger if exists set_testimonials_updated_at on public.testimonials;
create trigger set_testimonials_updated_at
before update on public.testimonials
for each row execute function public.set_updated_at();

drop trigger if exists set_homepage_blocks_updated_at on public.homepage_blocks;
create trigger set_homepage_blocks_updated_at
before update on public.homepage_blocks
for each row execute function public.set_updated_at();

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

create index if not exists categories_visibility_order_idx on public.categories(visibility, display_order);
create index if not exists portfolio_items_visibility_created_idx on public.portfolio_items(visibility, created_at desc);
create index if not exists portfolio_items_featured_idx on public.portfolio_items(featured) where featured = true;
create index if not exists portfolio_items_category_idx on public.portfolio_items(category_id);
create index if not exists portfolio_items_popularity_idx on public.portfolio_items(popularity_score desc);
create index if not exists portfolio_items_tags_idx on public.portfolio_items using gin(tags);
create index if not exists services_active_order_idx on public.services(active, display_order);
create index if not exists testimonials_public_order_idx on public.testimonials(approved, featured, display_order);
create index if not exists homepage_blocks_public_order_idx on public.homepage_blocks(visibility, display_order);
create index if not exists media_library_created_idx on public.media_library(created_at desc);
create index if not exists media_library_file_url_idx on public.media_library(file_url);

alter table public.users enable row level security;
alter table public.categories enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.services enable row level security;
alter table public.testimonials enable row level security;
alter table public.homepage_blocks enable row level security;
alter table public.site_settings enable row level security;
alter table public.media_library enable row level security;

drop policy if exists "Users can read own profile" on public.users;
create policy "Users can read own profile"
on public.users for select
using (auth.uid() = id or public.is_admin());

drop policy if exists "Admins can manage users" on public.users;
create policy "Admins can manage users"
on public.users for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read visible categories" on public.categories;
create policy "Public can read visible categories"
on public.categories for select
using (visibility = 'public' or public.is_admin_or_editor());

drop policy if exists "Editors can manage categories" on public.categories;
create policy "Editors can manage categories"
on public.categories for all
using (public.is_admin_or_editor())
with check (public.is_admin_or_editor());

drop policy if exists "Public can read visible portfolio items" on public.portfolio_items;
create policy "Public can read visible portfolio items"
on public.portfolio_items for select
using (visibility = 'public' or public.is_admin_or_editor());

drop policy if exists "Editors can manage portfolio items" on public.portfolio_items;
create policy "Editors can manage portfolio items"
on public.portfolio_items for all
using (public.is_admin_or_editor())
with check (public.is_admin_or_editor());

drop policy if exists "Public can read active services" on public.services;
create policy "Public can read active services"
on public.services for select
using (active = true or public.is_admin_or_editor());

drop policy if exists "Editors can manage services" on public.services;
create policy "Editors can manage services"
on public.services for all
using (public.is_admin_or_editor())
with check (public.is_admin_or_editor());

drop policy if exists "Public can read approved testimonials" on public.testimonials;
create policy "Public can read approved testimonials"
on public.testimonials for select
using (approved = true or public.is_admin_or_editor());

drop policy if exists "Editors can manage testimonials" on public.testimonials;
create policy "Editors can manage testimonials"
on public.testimonials for all
using (public.is_admin_or_editor())
with check (public.is_admin_or_editor());

drop policy if exists "Public can read visible homepage blocks" on public.homepage_blocks;
create policy "Public can read visible homepage blocks"
on public.homepage_blocks for select
using (visibility = 'public' or public.is_admin_or_editor());

drop policy if exists "Editors can manage homepage blocks" on public.homepage_blocks;
create policy "Editors can manage homepage blocks"
on public.homepage_blocks for all
using (public.is_admin_or_editor())
with check (public.is_admin_or_editor());

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
on public.site_settings for select
using (true);

drop policy if exists "Admins can manage site settings" on public.site_settings;
create policy "Admins can manage site settings"
on public.site_settings for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read media library" on public.media_library;
create policy "Public can read media library"
on public.media_library for select
using (true);

drop policy if exists "Editors can manage media library" on public.media_library;
create policy "Editors can manage media library"
on public.media_library for all
using (public.is_admin_or_editor())
with check (public.is_admin_or_editor());

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, role, avatar_url)
  values (
    new.id,
    coalesce(new.email, ''),
    'editor',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update
  set email = excluded.email,
      avatar_url = coalesce(excluded.avatar_url, public.users.avatar_url);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert or update of email, raw_user_meta_data on auth.users
for each row execute function public.handle_new_auth_user();

insert into public.categories (name, slug, description, display_order, visibility)
values
  ('Thumbnails', 'thumbnails', 'YouTube-ready Minecraft thumbnails and campaign art.', 10, 'public'),
  ('Logos', 'logos', 'Creator, studio, server, and brand identities.', 20, 'public'),
  ('Texture Packs', 'texture-packs', 'Custom Minecraft resource and texture pack artwork.', 30, 'public'),
  ('Banners', 'banners', 'Channel, social, launch, and campaign banners.', 40, 'public')
on conflict (slug) do update
set name = excluded.name,
    description = excluded.description,
    display_order = excluded.display_order,
    visibility = excluded.visibility;

insert into public.services (
  title,
  slug,
  short_description,
  full_description,
  starting_price,
  delivery_time,
  revisions,
  feature_list,
  featured,
  discord_order_link,
  active,
  display_order
)
values
  ('Starter', 'starter', 'Perfect for small projects', 'A focused custom design package for creators who need a single polished asset.', 50, '24-hour turnaround', '2 revisions', array['1 custom design', '2 revisions', '24-hour turnaround', 'Discord support', 'High resolution files'], false, 'https://discord.gg/your-discord', true, 10),
  ('Professional', 'professional', 'For serious creators', 'A larger creative package with priority support, commercial rights, and flexible deliverables.', 150, '48-hour turnaround', 'Unlimited revisions', array['3 custom designs', 'Unlimited revisions', '48-hour turnaround', 'Priority Discord support', 'High resolution + source files', 'Commercial use rights', 'Custom animations'], true, 'https://discord.gg/your-discord', true, 20),
  ('Premium', 'premium', 'Full creative package', 'An ongoing premium creative package for creators and teams that need complete Minecraft visual systems.', 400, 'Priority scheduling', 'Unlimited revisions', array['Unlimited designs per month', 'Unlimited revisions', '24-hour turnaround', 'Direct communication', 'All file formats', 'Full commercial rights', 'Custom animations & effects', 'Monthly strategy consultation'], false, 'https://discord.gg/your-discord', true, 30)
on conflict (slug) do update
set title = excluded.title,
    short_description = excluded.short_description,
    full_description = excluded.full_description,
    starting_price = excluded.starting_price,
    delivery_time = excluded.delivery_time,
    revisions = excluded.revisions,
    feature_list = excluded.feature_list,
    featured = excluded.featured,
    discord_order_link = excluded.discord_order_link,
    active = excluded.active,
    display_order = excluded.display_order;

insert into public.testimonials (client_name, client_role, quote, rating, approved, featured, display_order)
values
  ('Alex Gaming', 'Content Creator', 'The thumbnail designs completely transformed my channel. Engagement went up 40% in the first month. Highly recommended!', 5, true, true, 10),
  ('BuildCraft Studios', 'Game Developer', 'Professional, creative, and incredibly responsive. The texture packs are pixel-perfect and optimized.', 5, true, true, 20),
  ('Luna Streams', 'Twitch Streamer', 'Amazing work on our branding. The logo design perfectly captures our studio vision and aesthetic.', 5, true, false, 30)
on conflict do nothing;

insert into public.homepage_blocks (block_type, title, subtitle, content, alignment, style_variant, visibility, display_order)
values
  ('hero', 'Minecraft Creative Design', 'Artwork crafted for creators.', 'Thumbnails, logos, texture packs, and digital assets that bring your Minecraft vision to life.', 'split-left', 'featured-artwork', 'public', 10),
  ('featured_projects', 'Featured Work', 'A curated selection of recent creative projects.', null, 'left', 'masonry', 'public', 20),
  ('categories', 'Explore By Category', 'Browse thumbnails, logos, texture packs, and banners.', null, 'left', 'grid', 'public', 30),
  ('services', 'Simple, Transparent Pricing', 'Flexible rates for custom Minecraft creative work.', null, 'left', 'pricing-cards', 'public', 40),
  ('testimonials', 'Client Stories', 'What creators and studios say about working with me.', null, 'left', 'editorial-grid', 'public', 50)
on conflict do nothing;

insert into public.site_settings (
  site_name,
  hero_title,
  hero_subtitle,
  about_text,
  discord_url,
  socials,
  footer_text,
  seo_title,
  seo_description,
  logo_url,
  favicon_url
)
values (
  'Creative Portfolio',
  'Minecraft Creative Design',
  'Artwork crafted for creators. Thumbnails, logos, texture packs, and digital assets that bring your Minecraft vision to life.',
  'Premium Minecraft design work for creators, teams, and studios.',
  'https://discord.gg/your-discord',
  '{"discord":"https://discord.gg/your-discord"}'::jsonb,
  'Creative Portfolio',
  'Premium Minecraft Creative Portfolio',
  'Premium Minecraft thumbnails, logos, texture packs, banners, and creator artwork.',
  null,
  null
)
on conflict (singleton) do update
set site_name = excluded.site_name,
    hero_title = excluded.hero_title,
    hero_subtitle = excluded.hero_subtitle,
    about_text = excluded.about_text,
    discord_url = excluded.discord_url,
    socials = excluded.socials,
    footer_text = excluded.footer_text,
    seo_title = excluded.seo_title,
    seo_description = excluded.seo_description,
    logo_url = coalesce(public.site_settings.logo_url, excluded.logo_url),
    favicon_url = coalesce(public.site_settings.favicon_url, excluded.favicon_url);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-media',
  'portfolio-media',
  true,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Anyone can read portfolio media" on storage.objects;
create policy "Anyone can read portfolio media"
on storage.objects for select
using (bucket_id = 'portfolio-media');

drop policy if exists "Editors can upload portfolio media" on storage.objects;
create policy "Editors can upload portfolio media"
on storage.objects for insert
with check (
  bucket_id = 'portfolio-media'
  and public.is_admin_or_editor()
  and lower(name) ~ '\.(png|jpg|jpeg|webp)$'
);

drop policy if exists "Editors can update portfolio media" on storage.objects;
create policy "Editors can update portfolio media"
on storage.objects for update
using (bucket_id = 'portfolio-media' and public.is_admin_or_editor())
with check (
  bucket_id = 'portfolio-media'
  and public.is_admin_or_editor()
  and lower(name) ~ '\.(png|jpg|jpeg|webp)$'
);

drop policy if exists "Editors can delete portfolio media" on storage.objects;
create policy "Editors can delete portfolio media"
on storage.objects for delete
using (bucket_id = 'portfolio-media' and public.is_admin_or_editor());

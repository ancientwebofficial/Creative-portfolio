-- Extend the singleton site_settings record with owner profile fields.

alter table public.site_settings
  add column if not exists owner_name text,
  add column if not exists owner_avatar_url text,
  add column if not exists owner_email text,
  add column if not exists owner_discord text,
  add column if not exists owner_instagram_url text,
  add column if not exists owner_x_url text,
  add column if not exists owner_youtube_url text,
  add column if not exists owner_fiverr_url text,
  add column if not exists owner_behance_url text,
  add column if not exists owner_website_url text,
  add column if not exists owner_github_url text,
  add column if not exists owner_location text,
  add column if not exists owner_bio text;

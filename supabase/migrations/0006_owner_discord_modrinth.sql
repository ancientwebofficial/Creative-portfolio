-- Add Discord server invite and Modrinth profile fields to site_settings.

alter table public.site_settings
  add column if not exists owner_discord_server_url text,
  add column if not exists owner_modrinth_url text;

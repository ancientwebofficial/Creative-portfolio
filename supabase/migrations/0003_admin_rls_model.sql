-- Normalize CMS row-level security around a single admin role.
-- Admin identity is auth.uid() -> public.users.id where public.users.role = 'admin'.

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select u.role
  from public.users as u
  where u.id = auth.uid()
  limit 1
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

-- Compatibility shim for any old policy or code path that still references it.
-- The CMS permission model is admin-only for mutations.
create or replace function public.is_admin_or_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_admin()
$$;

grant execute on function public.current_user_role() to anon, authenticated, service_role;
grant execute on function public.is_admin() to anon, authenticated, service_role;
grant execute on function public.is_admin_or_editor() to anon, authenticated, service_role;

alter table public.users enable row level security;
alter table public.categories enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.services enable row level security;
alter table public.testimonials enable row level security;
alter table public.homepage_blocks enable row level security;
alter table public.site_settings enable row level security;
alter table public.media_library enable row level security;

grant usage on schema public to anon, authenticated;

grant select on table
  public.categories,
  public.portfolio_items,
  public.services,
  public.testimonials,
  public.homepage_blocks,
  public.site_settings
to anon;

grant select, insert, update, delete on table
  public.users,
  public.categories,
  public.portfolio_items,
  public.services,
  public.testimonials,
  public.homepage_blocks,
  public.site_settings,
  public.media_library
to authenticated;

grant all on table
  public.users,
  public.categories,
  public.portfolio_items,
  public.services,
  public.testimonials,
  public.homepage_blocks,
  public.site_settings,
  public.media_library
to service_role;

do $$
declare
  policy_record record;
begin
  for policy_record in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = any (array[
        'users',
        'categories',
        'portfolio_items',
        'services',
        'testimonials',
        'homepage_blocks',
        'site_settings',
        'media_library'
      ])
  loop
    execute format(
      'drop policy if exists %I on %I.%I',
      policy_record.policyname,
      policy_record.schemaname,
      policy_record.tablename
    );
  end loop;
end
$$;

create policy "users_self_select"
on public.users
for select
to authenticated
using (auth.uid() = id);

create policy "users_admin_select"
on public.users
for select
to authenticated
using (public.is_admin());

create policy "users_admin_insert"
on public.users
for insert
to authenticated
with check (public.is_admin());

create policy "users_admin_update"
on public.users
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "users_admin_delete"
on public.users
for delete
to authenticated
using (public.is_admin());

create policy "categories_public_select"
on public.categories
for select
to anon, authenticated
using (visibility = 'public');

create policy "categories_admin_select"
on public.categories
for select
to authenticated
using (public.is_admin());

create policy "categories_admin_insert"
on public.categories
for insert
to authenticated
with check (public.is_admin());

create policy "categories_admin_update"
on public.categories
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "categories_admin_delete"
on public.categories
for delete
to authenticated
using (public.is_admin());

create policy "portfolio_items_public_select"
on public.portfolio_items
for select
to anon, authenticated
using (visibility = 'public');

create policy "portfolio_items_admin_select"
on public.portfolio_items
for select
to authenticated
using (public.is_admin());

create policy "portfolio_items_admin_insert"
on public.portfolio_items
for insert
to authenticated
with check (public.is_admin());

create policy "portfolio_items_admin_update"
on public.portfolio_items
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "portfolio_items_admin_delete"
on public.portfolio_items
for delete
to authenticated
using (public.is_admin());

create policy "services_public_select"
on public.services
for select
to anon, authenticated
using (active = true);

create policy "services_admin_select"
on public.services
for select
to authenticated
using (public.is_admin());

create policy "services_admin_insert"
on public.services
for insert
to authenticated
with check (public.is_admin());

create policy "services_admin_update"
on public.services
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "services_admin_delete"
on public.services
for delete
to authenticated
using (public.is_admin());

create policy "testimonials_public_select"
on public.testimonials
for select
to anon, authenticated
using (approved = true);

create policy "testimonials_admin_select"
on public.testimonials
for select
to authenticated
using (public.is_admin());

create policy "testimonials_admin_insert"
on public.testimonials
for insert
to authenticated
with check (public.is_admin());

create policy "testimonials_admin_update"
on public.testimonials
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "testimonials_admin_delete"
on public.testimonials
for delete
to authenticated
using (public.is_admin());

create policy "homepage_blocks_public_select"
on public.homepage_blocks
for select
to anon, authenticated
using (visibility = 'public');

create policy "homepage_blocks_admin_select"
on public.homepage_blocks
for select
to authenticated
using (public.is_admin());

create policy "homepage_blocks_admin_insert"
on public.homepage_blocks
for insert
to authenticated
with check (public.is_admin());

create policy "homepage_blocks_admin_update"
on public.homepage_blocks
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "homepage_blocks_admin_delete"
on public.homepage_blocks
for delete
to authenticated
using (public.is_admin());

create policy "site_settings_public_select"
on public.site_settings
for select
to anon, authenticated
using (true);

create policy "site_settings_admin_select"
on public.site_settings
for select
to authenticated
using (public.is_admin());

create policy "site_settings_admin_insert"
on public.site_settings
for insert
to authenticated
with check (public.is_admin());

create policy "site_settings_admin_update"
on public.site_settings
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "site_settings_admin_delete"
on public.site_settings
for delete
to authenticated
using (public.is_admin());

create policy "media_library_admin_select"
on public.media_library
for select
to authenticated
using (public.is_admin());

create policy "media_library_admin_insert"
on public.media_library
for insert
to authenticated
with check (public.is_admin());

create policy "media_library_admin_update"
on public.media_library
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "media_library_admin_delete"
on public.media_library
for delete
to authenticated
using (public.is_admin());

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

-- Storage bucket creation only

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'portfolio-media',
  'portfolio-media',
  true,
  10485760,
  array['image/png','image/jpeg','image/webp']
)
on conflict (id) do nothing;
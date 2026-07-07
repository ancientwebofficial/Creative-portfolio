-- Add CMS-managed branding fields and keep media dimension metadata queryable.

alter table public.site_settings
  add column if not exists logo_url text,
  add column if not exists favicon_url text;

update public.media_library
set metadata = coalesce(metadata, '{}'::jsonb)
  || jsonb_build_object(
    'width', width,
    'height', height,
    'aspect_ratio',
      case
        when width is not null and height is not null and height > 0
          then width::numeric / height::numeric
        else null
      end
  )
where width is not null
  and height is not null;

create index if not exists media_library_file_url_idx
on public.media_library(file_url);

grant select on table public.media_library to anon, authenticated;

drop policy if exists "media_library_public_select" on public.media_library;
create policy "media_library_public_select"
on public.media_library
for select
to anon, authenticated
using (true);

-- Fix CMS auth role checks by making public.users self-read non-recursive.
-- Admin validation reads the logged-in user's own public.users row.

drop policy if exists "Users can read own profile" on public.users;
create policy "Users can read own profile"
on public.users for select
using (auth.uid() = id);

drop policy if exists "Admins can manage users" on public.users;

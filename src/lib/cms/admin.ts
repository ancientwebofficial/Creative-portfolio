import { requireAdmin, requireCmsUser } from "@/lib/auth/guards";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getCmsAdminContext() {
  const profile = await requireCmsUser();
  const supabase = await createSupabaseServerClient();

  return { profile, supabase };
}

export async function getSiteSettingsAdminContext() {
  const profile = await requireAdmin();
  const supabase = await createSupabaseServerClient();

  return { profile, supabase };
}

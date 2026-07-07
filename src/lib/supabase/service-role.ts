import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/cms/database.types";
import { getSupabaseServiceRoleConfig } from "./config";

export function createSupabaseServiceRoleClient() {
  const { url, serviceRoleKey } = getSupabaseServiceRoleConfig();

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

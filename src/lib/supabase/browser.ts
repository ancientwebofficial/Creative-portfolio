import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/cms/database.types";
import { getSupabaseConfig } from "./config";

export function createSupabaseBrowserClient() {
  const { url, anonKey } = getSupabaseConfig();
  return createBrowserClient<Database>(url, anonKey);
}

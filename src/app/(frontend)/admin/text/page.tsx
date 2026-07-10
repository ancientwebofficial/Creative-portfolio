import SiteTextEditor from "@/components/admin/SiteTextEditor";
import { getSiteSettingsAdminContext } from "@/lib/cms/admin";
import { getSiteSettings } from "@/lib/cms/repositories";

export default async function AdminTextPage() {
  const { supabase } = await getSiteSettingsAdminContext();
  const settings = await getSiteSettings(supabase);

  return <SiteTextEditor initialSettings={settings} />;
}

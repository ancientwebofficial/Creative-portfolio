import SettingsPanel from "@/components/admin/SettingsPanel";
import { getSiteSettingsAdminContext } from "@/lib/cms/admin";
import { getSiteSettings, listMedia } from "@/lib/cms/repositories";

export default async function AdminSettingsPage() {
  const { supabase } = await getSiteSettingsAdminContext();
  const [settings, media] = await Promise.all([
    getSiteSettings(supabase),
    listMedia(supabase, { limit: 24 }),
  ]);

  return <SettingsPanel initialSettings={settings} initialMedia={media.items} />;
}

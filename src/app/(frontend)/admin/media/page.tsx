import MediaManager from "@/components/admin/MediaManager";
import { getCmsAdminContext } from "@/lib/cms/admin";
import { listMedia } from "@/lib/cms/repositories";

export default async function AdminMediaPage() {
  const { supabase } = await getCmsAdminContext();
  const media = await listMedia(supabase, { limit: 100 });

  return <MediaManager initialMedia={media.items} />;
}


import HomeArrangement from "@/components/admin/HomeArrangement";
import { getCmsAdminContext } from "@/lib/cms/admin";
import { listHomepageBlocks } from "@/lib/cms/repositories";

export default async function AdminHomepagePage() {
  const { supabase } = await getCmsAdminContext();
  const blocks = await listHomepageBlocks(supabase, { includePrivate: true });

  return <HomeArrangement initialBlocks={blocks} />;
}

import PlansManager from "@/components/admin/PlansManager";
import { getCmsAdminContext } from "@/lib/cms/admin";
import { listServices } from "@/lib/cms/repositories";

export default async function AdminPlansPage() {
  const { supabase } = await getCmsAdminContext();
  const services = await listServices(supabase, { includeInactive: true });

  return <PlansManager initialServices={services} />;
}

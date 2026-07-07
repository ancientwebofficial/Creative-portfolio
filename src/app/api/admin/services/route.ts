import { getCmsAdminContext } from "@/lib/cms/admin";
import { handleRouteError, jsonCreated, jsonOk, readJson } from "@/lib/cms/api";
import { createService, listServices } from "@/lib/cms/repositories";
import { serviceInputSchema } from "@/lib/cms/schemas";

export async function GET() {
  try {
    const { supabase } = await getCmsAdminContext();
    const services = await listServices(supabase, { includeInactive: true });
    return jsonOk(services);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const { supabase } = await getCmsAdminContext();
    const payload = serviceInputSchema.parse(await readJson(request));
    const service = await createService(supabase, payload);
    return jsonCreated(service);
  } catch (error) {
    return handleRouteError(error);
  }
}

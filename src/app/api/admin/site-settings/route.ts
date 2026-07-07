import { getSiteSettingsAdminContext } from "@/lib/cms/admin";
import { handleRouteError, jsonOk, readJson } from "@/lib/cms/api";
import { getSiteSettings, updateSiteSettings } from "@/lib/cms/repositories";
import { siteSettingsUpdateSchema } from "@/lib/cms/schemas";

export async function GET() {
  try {
    const { supabase } = await getSiteSettingsAdminContext();
    const settings = await getSiteSettings(supabase);
    return jsonOk(settings);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const { supabase } = await getSiteSettingsAdminContext();
    const payload = siteSettingsUpdateSchema.parse(await readJson(request));
    const settings = await updateSiteSettings(supabase, payload);
    return jsonOk(settings);
  } catch (error) {
    return handleRouteError(error);
  }
}

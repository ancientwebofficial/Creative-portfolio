import { handleRouteError, jsonOk, publicCache } from "@/lib/cms/api";
import { getSiteSettingsData } from "@/lib/cms/public-data";

export async function GET() {
  try {
    const settings = await getSiteSettingsData();
    return jsonOk(settings, publicCache(300));
  } catch (error) {
    return handleRouteError(error);
  }
}

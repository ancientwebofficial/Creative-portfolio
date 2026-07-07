import { handleRouteError, jsonOk, publicCache } from "@/lib/cms/api";
import { getHomepageData } from "@/lib/cms/public-data";

export async function GET() {
  try {
    const content = await getHomepageData();
    return jsonOk(content, publicCache(120));
  } catch (error) {
    return handleRouteError(error);
  }
}

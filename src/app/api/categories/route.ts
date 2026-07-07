import { handleRouteError, jsonOk, publicCache } from "@/lib/cms/api";
import { getCategoriesData } from "@/lib/cms/public-data";

export async function GET() {
  try {
    const categories = await getCategoriesData();
    return jsonOk(categories, publicCache(300));
  } catch (error) {
    return handleRouteError(error);
  }
}

import { handleRouteError, jsonOk, publicCache } from "@/lib/cms/api";
import { getServicesData } from "@/lib/cms/public-data";

export async function GET() {
  try {
    const services = await getServicesData();
    return jsonOk(services, publicCache(300));
  } catch (error) {
    return handleRouteError(error);
  }
}

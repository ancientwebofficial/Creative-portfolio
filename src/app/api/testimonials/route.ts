import type { NextRequest } from "next/server";
import { handleRouteError, jsonOk, publicCache } from "@/lib/cms/api";
import { getTestimonialsData } from "@/lib/cms/public-data";

export async function GET(request: NextRequest) {
  try {
    const featuredOnly = request.nextUrl.searchParams.get("featured") === "true";
    const testimonials = await getTestimonialsData({ featuredOnly });
    return jsonOk(testimonials, publicCache(300));
  } catch (error) {
    return handleRouteError(error);
  }
}

import type { NextRequest } from "next/server";
import { handleRouteError, jsonError, jsonOk, publicCache } from "@/lib/cms/api";
import { getPortfolioItemData } from "@/lib/cms/public-data";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const item = await getPortfolioItemData(slug);

    if (!item) {
      return jsonError("Portfolio item not found.", 404);
    }

    return jsonOk(item, publicCache(120));
  } catch (error) {
    return handleRouteError(error);
  }
}

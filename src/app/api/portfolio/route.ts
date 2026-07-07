import type { NextRequest } from "next/server";
import { handleRouteError, jsonOk, publicCache } from "@/lib/cms/api";
import { getPortfolioData } from "@/lib/cms/public-data";
import { portfolioQuerySchema } from "@/lib/cms/schemas";

export async function GET(request: NextRequest) {
  try {
    const query = portfolioQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams)
    );
    const { portfolio } = await getPortfolioData(query);

    return jsonOk(portfolio, publicCache(60));
  } catch (error) {
    return handleRouteError(error);
  }
}

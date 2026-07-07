import type { NextRequest } from "next/server";
import { getCmsAdminContext } from "@/lib/cms/admin";
import { handleRouteError, jsonCreated, jsonOk, readJson } from "@/lib/cms/api";
import { createPortfolioItem, listPortfolioItems } from "@/lib/cms/repositories";
import { portfolioInputSchema, portfolioQuerySchema } from "@/lib/cms/schemas";

export async function GET(request: NextRequest) {
  try {
    const query = portfolioQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams)
    );
    const { supabase } = await getCmsAdminContext();
    const portfolio = await listPortfolioItems(supabase, {
      ...query,
      includePrivate: true,
    });

    return jsonOk(portfolio);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    console.log("[PORTFOLIO_API] POST /api/admin/portfolio - Start");
    const { supabase } = await getCmsAdminContext();
    console.log("[PORTFOLIO_API] Admin context retrieved");
    
    const body = await readJson(request);
    console.log("[PORTFOLIO_API] Request body:", JSON.stringify(body).substring(0, 200));
    
    const payload = portfolioInputSchema.parse(body);
    console.log("[PORTFOLIO_API] Payload validated:", JSON.stringify(payload).substring(0, 200));
    
    console.log("[PORTFOLIO_API] Calling createPortfolioItem...");
    const item = await createPortfolioItem(supabase, payload);
    console.log("[PORTFOLIO_API] Item created successfully:", item.id);
    
    return jsonCreated(item);
  } catch (error) {
    console.error("[PORTFOLIO_API] Error caught:", error);
    return handleRouteError(error);
  }
}

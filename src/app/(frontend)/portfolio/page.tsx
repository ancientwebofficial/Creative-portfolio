import PortfolioPageClient from "@/components/portfolio/PortfolioPageClient";
import { getPortfolioData } from "@/lib/cms/public-data";
import { getPayloadGlobals } from "@/lib/payload/public-data";

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    sort?: "popular" | "newest" | "oldest" | "featured" | "recent";
    search?: string;
  }>;
}) {
  const params = await searchParams;
  const [{ portfolio, categories }, payload] = await Promise.all([
    getPortfolioData({
      category: params.category,
      sort: params.sort || "newest",
      search: params.search,
      limit: 100,
    }),
    getPayloadGlobals(),
  ]);

  return (
    <PortfolioPageClient
      items={portfolio.items}
      categories={categories}
      initialCategory={params.category || null}
      initialSort={params.sort || "recent"}
      content={payload.portfolioPage}
    />
  );
}

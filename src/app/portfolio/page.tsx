import PortfolioPageClient from "@/components/portfolio/PortfolioPageClient";
import { getPortfolioData } from "@/lib/cms/public-data";

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
  const { portfolio, categories } = await getPortfolioData({
    category: params.category,
    sort: params.sort || "newest",
    search: params.search,
    limit: 100,
  });

  return (
    <PortfolioPageClient
      items={portfolio.items}
      categories={categories}
      initialCategory={params.category || null}
      initialSort={params.sort || "recent"}
    />
  );
}

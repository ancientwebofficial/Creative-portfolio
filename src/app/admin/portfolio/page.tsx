import PortfolioManager from "@/components/admin/PortfolioManager";
import { getCmsAdminContext } from "@/lib/cms/admin";
import { listCategories, listPortfolioItems } from "@/lib/cms/repositories";

export default async function AdminPortfolioPage() {
  const { supabase } = await getCmsAdminContext();
  const [portfolio, categories] = await Promise.all([
    listPortfolioItems(supabase, {
      includePrivate: true,
      limit: 100,
      sort: "newest",
    }),
    listCategories(supabase, { includePrivate: true }),
  ]);

  return <PortfolioManager initialItems={portfolio.items} categories={categories} />;
}

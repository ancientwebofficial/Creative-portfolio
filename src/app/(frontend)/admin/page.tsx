import AdminOverview from "@/components/admin/AdminOverview";
import { getCmsAdminContext } from "@/lib/cms/admin";
import {
  listCategories,
  listPortfolioItems,
  listServices,
  listTestimonials,
} from "@/lib/cms/repositories";

export default async function AdminPage() {
  const { supabase } = await getCmsAdminContext();
  const [portfolio, services, testimonials, categories] = await Promise.all([
    listPortfolioItems(supabase, { includePrivate: true, limit: 1 }),
    listServices(supabase, { includeInactive: true }),
    listTestimonials(supabase, { includeUnapproved: true }),
    listCategories(supabase, { includePrivate: true }),
  ]);

  return (
    <AdminOverview
      totalWorks={portfolio.count}
      activeServices={services.filter((service) => service.active).length}
      testimonials={testimonials.length}
      categories={categories}
    />
  );
}

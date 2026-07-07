import { categories as staticCategories, portfolioItems } from "@/data/portfolioItems";
import type { PortfolioItem } from "@/data/portfolioItems";
import { plans } from "@/data/plans";
import { testimonials } from "@/data/testimonials";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import {
  getHomepageContent,
  getPortfolioItemBySlug,
  getSiteSettings,
  listCategories,
  listPortfolioItems,
  listServices,
  listTestimonials,
} from "./repositories";
import type {
  CategoryDto,
  HomepageBlockDto,
  ServiceDto,
  SiteSettingsDto,
  TestimonialDto,
} from "./mappers";
import type { PortfolioSort } from "./repositories";

function createPublicDataClient() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return createSupabaseServiceRoleClient();
  }

  return createSupabaseServerClient();
}

export interface HomepageCmsData {
  settings: SiteSettingsDto | null;
  blocks: HomepageBlockDto[];
  featuredProjects: PortfolioItem[];
  services: ServiceDto[];
  testimonials: TestimonialDto[];
  categories: CategoryDto[];
}

function getStaticServices(): ServiceDto[] {
  return plans.map((plan) => ({
    ...plan,
    title: plan.name,
    database_id: plan.id,
    slug: plan.id,
    short_description: plan.description,
    full_description: plan.description,
    starting_price: plan.price,
    currency: "USD" as const,
    delivery_time: null,
    revisions: null,
    feature_list: plan.features,
    featured: Boolean(plan.highlighted),
    discord_order_link: plan.orderUrl || null,
    active: true,
    display_order: 0,
    highlighted: Boolean(plan.highlighted),
    orderUrl: plan.orderUrl || null,
  }));
}

function getStaticTestimonials(): TestimonialDto[] {
  return testimonials.map((testimonial) => ({
    ...testimonial,
    client_name: testimonial.author,
    client_role: testimonial.role,
    quote: testimonial.content,
    approved: true,
    featured: true,
    display_order: 0,
  }));
}

function getStaticCategories(): CategoryDto[] {
  return staticCategories.map((category) => ({
    ...category,
    database_id: category.id,
    name: category.label,
    slug: category.id,
    description: null,
    display_order: 0,
    visibility: "public",
  }));
}

export async function getHomepageData(): Promise<HomepageCmsData> {
  if (!hasSupabaseConfig()) {
    return {
      settings: null,
      blocks: [],
      featuredProjects: portfolioItems.filter((item) => item.featured),
      services: getStaticServices(),
      testimonials: getStaticTestimonials(),
      categories: getStaticCategories(),
    };
  }

  const supabase = await createPublicDataClient();
  return getHomepageContent(supabase);
}

export async function getSiteSettingsData() {
  if (!hasSupabaseConfig()) {
    return null;
  }

  const supabase = await createPublicDataClient();
  return getSiteSettings(supabase);
}

export async function getPortfolioData(options: {
  category?: string;
  sort?: PortfolioSort;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  if (!hasSupabaseConfig()) {
    return {
      portfolio: {
        items: portfolioItems,
        count: portfolioItems.length,
        limit: options.limit || portfolioItems.length,
        offset: options.offset || 0,
      },
      categories: getStaticCategories(),
    };
  }

  const supabase = await createPublicDataClient();
  const [portfolio, categories] = await Promise.all([
    listPortfolioItems(supabase, options),
    listCategories(supabase),
  ]);

  return { portfolio, categories };
}

export async function getPortfolioItemData(slug: string) {
  if (!hasSupabaseConfig()) {
    return portfolioItems.find((item) => item.id === slug) || null;
  }

  const supabase = await createPublicDataClient();
  return getPortfolioItemBySlug(supabase, slug);
}

export async function getCategoriesData() {
  if (!hasSupabaseConfig()) {
    return getStaticCategories();
  }

  const supabase = await createPublicDataClient();
  return listCategories(supabase);
}

export async function getServicesData() {
  if (!hasSupabaseConfig()) {
    return getStaticServices();
  }

  const supabase = await createPublicDataClient();
  return listServices(supabase);
}

export async function getTestimonialsData(options: { featuredOnly?: boolean } = {}) {
  const featuredOnly = options.featuredOnly || false;

  if (!hasSupabaseConfig()) {
    const staticTestimonials = getStaticTestimonials();
    return featuredOnly
      ? staticTestimonials.filter((testimonial) => testimonial.featured)
      : staticTestimonials;
  }

  const supabase = await createPublicDataClient();
  return listTestimonials(supabase, { featuredOnly });
}

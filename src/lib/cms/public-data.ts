import { categories as staticCategories, portfolioItems } from "@/data/portfolioItems";
import type { PortfolioItem } from "@/data/portfolioItems";
import { faqItems } from "@/data/faqItems";
import { plans } from "@/data/plans";
import { testimonials } from "@/data/testimonials";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import {
  getPayloadCollections,
  getPayloadGlobals,
  getPayloadSiteSettings,
  hasPayloadDatabaseConfig,
  hasPayloadContent,
  type PayloadGlobals,
} from "@/lib/payload/public-data";
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
  faqs: typeof faqItems;
  payload: PayloadGlobals;
}

interface PayloadPublicData {
  settings: SiteSettingsDto;
  collections: NonNullable<Awaited<ReturnType<typeof getPayloadCollections>>>;
  payload: PayloadGlobals;
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

async function getPayloadPublicData(): Promise<PayloadPublicData | null> {
  const [payload, collections] = await Promise.all([
    getPayloadGlobals(),
    getPayloadCollections(),
  ]);

  if (!collections || !hasPayloadContent(collections)) {
    return null;
  }

  return {
    settings: getPayloadSiteSettings(payload),
    collections,
    payload,
  };
}

async function getLegacyHomepageData(payload: PayloadGlobals): Promise<HomepageCmsData> {
  if (!hasSupabaseConfig()) {
    return {
      settings: null,
      blocks: [],
      featuredProjects: portfolioItems.filter((item) => item.featured),
      services: getStaticServices(),
      testimonials: getStaticTestimonials(),
      categories: getStaticCategories(),
      faqs: faqItems,
      payload,
    };
  }

  const supabase = await createPublicDataClient();
  const homepage = await getHomepageContent(supabase);

  return {
    ...homepage,
    faqs: faqItems,
    payload,
  };
}

function sortPortfolioItems(items: PortfolioItem[], sort?: PortfolioSort) {
  const sorted = [...items];

  if (sort === "popular") {
    return sorted.sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0) || a.title.localeCompare(b.title));
  }

  if (sort === "oldest") {
    return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  if (sort === "featured") {
    return sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || (b.popularity_score || 0) - (a.popularity_score || 0));
  }

  return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function filterPortfolioItems(
  items: PortfolioItem[],
  options: {
    category?: string;
    sort?: PortfolioSort;
    search?: string;
    limit?: number;
    offset?: number;
  }
) {
  const search = options.search?.trim().toLowerCase();
  const filtered = items.filter((item) => {
    const matchesCategory = !options.category || item.category === options.category;
    const matchesSearch =
      !search ||
      item.title.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search) ||
      item.tags.some((tag) => tag.toLowerCase().includes(search));

    return matchesCategory && matchesSearch;
  });
  const sorted = sortPortfolioItems(filtered, options.sort || "recent");
  const offset = options.offset || 0;
  const limit = options.limit || sorted.length;

  return {
    items: sorted.slice(offset, offset + limit),
    count: sorted.length,
    limit,
    offset,
  };
}

export async function getHomepageData(): Promise<HomepageCmsData> {
  const payloadData = await getPayloadPublicData();

  if (payloadData) {
    const { collections, payload, settings } = payloadData;
    return {
      settings,
      blocks: [],
      featuredProjects: collections.portfolioItems.filter((item) => item.featured),
      services: collections.pricingPlans,
      testimonials: collections.testimonials,
      categories: collections.categories,
      faqs: collections.faqs,
      payload,
    };
  }

  return getLegacyHomepageData(await getPayloadGlobals());
}

export async function getSiteSettingsData() {
  if (hasPayloadDatabaseConfig()) {
    return getPayloadSiteSettings(await getPayloadGlobals());
  }

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
  const payloadData = await getPayloadPublicData();

  if (payloadData) {
    return {
      portfolio: filterPortfolioItems(payloadData.collections.portfolioItems, options),
      categories: payloadData.collections.categories,
    };
  }

  if (!hasSupabaseConfig()) {
    return {
      portfolio: filterPortfolioItems(portfolioItems, options),
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
  const payloadData = await getPayloadPublicData();

  if (payloadData) {
    return payloadData.collections.portfolioItems.find((item) => item.slug === slug || item.id === slug) || null;
  }

  if (!hasSupabaseConfig()) {
    return portfolioItems.find((item) => item.id === slug) || null;
  }

  const supabase = await createPublicDataClient();
  return getPortfolioItemBySlug(supabase, slug);
}

export async function getCategoriesData() {
  const payloadData = await getPayloadPublicData();

  if (payloadData) {
    return payloadData.collections.categories;
  }

  if (!hasSupabaseConfig()) {
    return getStaticCategories();
  }

  const supabase = await createPublicDataClient();
  return listCategories(supabase);
}

export async function getServicesData() {
  const payloadData = await getPayloadPublicData();

  if (payloadData) {
    return payloadData.collections.pricingPlans;
  }

  if (!hasSupabaseConfig()) {
    return getStaticServices();
  }

  const supabase = await createPublicDataClient();
  return listServices(supabase);
}

export async function getTestimonialsData(options: { featuredOnly?: boolean } = {}) {
  const featuredOnly = options.featuredOnly || false;
  const payloadData = await getPayloadPublicData();

  if (payloadData) {
    return featuredOnly
      ? payloadData.collections.testimonials.filter((testimonial) => testimonial.featured)
      : payloadData.collections.testimonials;
  }

  if (!hasSupabaseConfig()) {
    const staticTestimonials = getStaticTestimonials();
    return featuredOnly
      ? staticTestimonials.filter((testimonial) => testimonial.featured)
      : staticTestimonials;
  }

  const supabase = await createPublicDataClient();
  return listTestimonials(supabase, { featuredOnly });
}

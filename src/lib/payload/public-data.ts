import { getPayload } from "payload";
import configPromise from "@payload-config";
import type { PortfolioItem } from "@/data/portfolioItems";
import type {
  CategoryDto,
  ServiceDto,
  SiteSettingsDto,
  TestimonialDto,
} from "@/lib/cms/mappers";
import { cosmicPurpleTheme } from "@/payload/lib/theme.ts";

// Payload documents are intentionally schema-flexible at this mapping boundary.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDoc = Record<string, any>;

export function hasPayloadDatabaseConfig() {
  return Boolean(process.env.PAYLOAD_DATABASE_URI || process.env.DATABASE_URL);
}

async function getPayloadClient() {
  if (!hasPayloadDatabaseConfig()) {
    return null;
  }

  return getPayload({ config: configPromise });
}

function getMediaUrl(value: unknown, fallback?: string | null) {
  if (!value) {
    return fallback || null;
  }

  if (typeof value === "string") {
    return fallback || null;
  }

  if (typeof value === "object" && value) {
    const media = value as AnyDoc;
    const sizeUrl =
      media.sizes?.card?.url ||
      media.sizes?.hero?.url ||
      media.sizes?.thumbnail?.url;

    if (typeof sizeUrl === "string" && sizeUrl.trim()) {
      return sizeUrl;
    }
  }

  if (typeof value === "object" && "url" in value && typeof value.url === "string") {
    return value.url;
  }

  return fallback || null;
}

function relationId(value: unknown) {
  if (!value) {
    return null;
  }

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (typeof value === "object" && "id" in value) {
    return String(value.id);
  }

  return null;
}

function relationSlug(value: unknown) {
  if (typeof value === "object" && value && "slug" in value && typeof value.slug === "string") {
    return value.slug;
  }

  return relationId(value) || "uncategorized";
}

function relationName(value: unknown) {
  if (typeof value === "object" && value && "name" in value && typeof value.name === "string") {
    return value.name;
  }

  return null;
}

function arrayField<T>(value: T[] | undefined | null) {
  return Array.isArray(value) ? value : [];
}

function isPlainObject(value: unknown): value is AnyDoc {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function mergeDefaults<T extends AnyDoc>(fallback: T, value: unknown): T {
  if (!isPlainObject(value)) {
    return fallback;
  }

  const merged: AnyDoc = { ...fallback };

  for (const [key, nextValue] of Object.entries(value)) {
    const fallbackValue = fallback[key];

    if (Array.isArray(nextValue)) {
      merged[key] = nextValue;
    } else if (isPlainObject(fallbackValue) && isPlainObject(nextValue)) {
      merged[key] = mergeDefaults(fallbackValue, nextValue);
    } else if (nextValue !== undefined && nextValue !== null) {
      merged[key] = nextValue;
    }
  }

  return merged as T;
}

function text(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function isPublished(doc: AnyDoc) {
  return doc.status === "published" || doc._status === "published";
}

export const defaultPayloadGlobals = {
  branding: {
    siteName: "Cosmic Flare",
    siteDescription:
      "Professional Minecraft design portfolio featuring thumbnails, logos, texture packs, and artwork.",
    browserTitle: "",
    logoUrl: null,
    faviconUrl: null,
  },
  navigation: {
    headerLinks: [
      { label: "Portfolio", href: "/portfolio", newTab: false },
      { label: "Pricing", href: "/#pricing", newTab: false },
      { label: "Contact", href: "/contact", newTab: false },
    ],
    mobileCta: { label: "Contact", href: "/contact", newTab: false },
    adminLink: { enabled: true, label: "Admin", href: "/admin", newTab: false },
    footerLinks: [
      { label: "Portfolio", href: "/portfolio", newTab: false },
      { label: "Pricing", href: "/#pricing", newTab: false },
      { label: "Contact", href: "/contact", newTab: false },
    ],
  },
  footer: {
    brandKicker: "Premium creative work",
    description: "Premium Minecraft design portfolio",
    ownerProfileNotice: "Owner profile active",
    navigationHeading: "Navigation",
    contactHeading: "Contact",
    primaryCta: { label: "View portfolio", href: "/portfolio", newTab: false },
    secondaryCta: { label: "Start a project", href: "/contact", newTab: false },
    copyrightText: "Cosmic Flare. All rights reserved.",
  },
  ownerProfile: {
    name: "WatereyeFx",
    role: "Creative Director",
    biography: "",
    location: "",
    avatarUrl: null,
    socialProfiles: [],
  },
  defaultSeo: {
    title: "",
    description:
      "Premium Minecraft design portfolio featuring thumbnails, logos, texture packs, and artwork. Professional quality, creative vision.",
    openGraphTitle: "",
    openGraphDescription: "",
    openGraphImage: null,
  },
  themeSettings: {
    preset: "cosmicPurple",
    colors: cosmicPurpleTheme,
    radiusPreset: "large",
    shadowIntensity: "strong",
    glowIntensity: "medium",
  },
  homepage: {
    hero: {
      badge: "Premium creative agency design",
      heading: "Minecraft Creative Design",
      description:
        "Artwork crafted for creators. Thumbnails, logos, texture packs, and digital assets that bring your Minecraft vision to life.",
      primaryCta: { label: "Explore work", href: "/portfolio", newTab: false },
      secondaryCta: { label: "View pricing", href: "#pricing", newTab: false },
      statistics: [
        { value: "70+", label: "Projects delivered" },
        { value: "200+", label: "Creators served" },
        { value: "4+", label: "Years of work" },
      ],
    },
    featuredWork: {
      enabled: true,
      eyebrow: "Selected work",
      heading: "Featured Work",
      description:
        "A cinematic look at recent creative projects, built to feel closer to an agency showcase than a static portfolio grid.",
      cta: { label: "View all work", href: "/portfolio", newTab: false },
      autoplayDelayMs: 5000,
    },
    ownerProfilePresentation: {
      enabled: true,
      eyebrow: "Owner profile",
      cta: { label: "See portfolio", href: "/portfolio", newTab: false },
    },
    servicesPresentation: {
      enabled: true,
      eyebrow: "Services",
      heading: "Specialized Creative Services",
      description: "Tailored design solutions for Minecraft creators, streamers, and content studios.",
      countSuffix: "Projects",
      cardCtaLabel: "Explore",
    },
    testimonialsPresentation: {
      enabled: true,
      eyebrow: "Testimonials",
      heading: "Client Stories",
      description: "What creators and studios say about working with me.",
      statistics: [
        { value: "98%", label: "Satisfaction rate" },
        { value: "50+", label: "Testimonials" },
        { value: "200+", label: "Happy creators" },
      ],
    },
    pricingPresentation: {
      enabled: true,
      eyebrow: "Pricing",
      heading: "Simple, Transparent Pricing",
      description: "Flexible rates for custom Minecraft creative work. Each project tailored to your needs.",
      highlightBadge: "Most Popular",
      priceSuffix: "/ project",
      moreFeaturesLabel: "more features",
      planCtaLabel: "Get started",
      customPackageHeading: "Need a custom package?",
      customPackageFallbackKicker: "Direct owner contact",
      customPackageOwnerKickerTemplate: "Work directly with {ownerName}",
      customPackageDescription: "Bulk rates and specialized projects available. Let's discuss your needs.",
      customPackageCta: { label: "Contact", href: "/contact", newTab: false },
    },
    faqPresentation: {
      enabled: true,
      eyebrow: "FAQ",
      heading: "Frequently Asked Questions",
      description: "Everything you need to know about working on projects together.",
      ctaKicker: "Still have questions?",
      cta: { label: "Reach out on the contact page", href: "/contact", newTab: false },
    },
  },
  portfolioPage: {
    filterHeading: "Categories",
    allCategoriesLabel: "All",
    sortHeading: "Sort by",
    sortOptions: [
      { id: "popular", label: "Most Popular" },
      { id: "recent", label: "Newest" },
      { id: "oldest", label: "Oldest" },
      { id: "featured", label: "Featured" },
    ],
    eyebrow: "Portfolio",
    heading: "Portfolio",
    workSingular: "work",
    workPlural: "works",
    categorySuffix: "in this category",
    emptyState: "No portfolio items found",
    featuredBadge: "Featured",
    cardCtaLabel: "View",
    modalEyebrow: "Portfolio item",
    categoryLabel: "Category",
    dateLabel: "Date",
    descriptionLabel: "Description",
    tagsLabel: "Tags",
    modalCta: { label: "Order This Design", href: "/contact", newTab: false },
  },
  contactPage: {
    seoTitleTemplate: "Contact {siteName}",
    seoFallbackDescription: "Contact {ownerName} for creative work, commissions, and collaborations.",
    seo: {
      title: "",
      description: "",
      openGraphTitle: "",
      openGraphDescription: "",
      openGraphImage: null,
    },
    eyebrow: "Contact",
    headingTemplate: "Get in touch with {ownerName}",
    description: "Choose the best place to connect, collaborate, or start a commission.",
    ownerProfileEyebrow: "Owner profile",
    bioFallback: "Project inquiries, collaborations, and business questions can all go here.",
    discordServerDisplayFallback: "Join our Discord Community",
    actions: [
      { kind: "email", platform: "Email", action: "Send Email" },
      { kind: "discord", platform: "Discord", action: "Message" },
      { kind: "discord_server", platform: "Discord", action: "Join Server" },
      { kind: "instagram", platform: "Instagram", action: "Follow" },
      { kind: "x", platform: "X", action: "Follow" },
      { kind: "youtube", platform: "YouTube", action: "Watch" },
      { kind: "fiverr", platform: "Fiverr", action: "Hire" },
      { kind: "behance", platform: "Behance", action: "View Portfolio" },
      { kind: "website", platform: "Website", action: "Visit" },
      { kind: "github", platform: "GitHub", action: "View Profile" },
      { kind: "modrinth", platform: "Modrinth", action: "View Profile" },
    ],
  },
};

export type PayloadGlobals = typeof defaultPayloadGlobals;

async function findGlobal(slug: string, fallback: AnyDoc) {
  const payload = await getPayloadClient();

  if (!payload) {
    return fallback;
  }

  try {
    return await payload.findGlobal({ slug: slug as never, depth: 2 });
  } catch {
    return fallback;
  }
}

export async function getPayloadGlobals(): Promise<PayloadGlobals> {
  const entries = await Promise.all([
    findGlobal("branding", defaultPayloadGlobals.branding),
    findGlobal("navigation", defaultPayloadGlobals.navigation),
    findGlobal("footer", defaultPayloadGlobals.footer),
    findGlobal("owner-profile", defaultPayloadGlobals.ownerProfile),
    findGlobal("default-seo", defaultPayloadGlobals.defaultSeo),
    findGlobal("theme-settings", defaultPayloadGlobals.themeSettings),
    findGlobal("homepage", defaultPayloadGlobals.homepage),
    findGlobal("portfolio-page", defaultPayloadGlobals.portfolioPage),
    findGlobal("contact-page", defaultPayloadGlobals.contactPage),
  ]);

  return {
    branding: mergeDefaults(defaultPayloadGlobals.branding, entries[0]),
    navigation: mergeDefaults(defaultPayloadGlobals.navigation, entries[1]),
    footer: mergeDefaults(defaultPayloadGlobals.footer, entries[2]),
    ownerProfile: mergeDefaults(defaultPayloadGlobals.ownerProfile, entries[3]),
    defaultSeo: mergeDefaults(defaultPayloadGlobals.defaultSeo, entries[4]),
    themeSettings: mergeDefaults(defaultPayloadGlobals.themeSettings, entries[5]),
    homepage: mergeDefaults(defaultPayloadGlobals.homepage, entries[6]),
    portfolioPage: mergeDefaults(defaultPayloadGlobals.portfolioPage, entries[7]),
    contactPage: mergeDefaults(defaultPayloadGlobals.contactPage, entries[8]),
  } as PayloadGlobals;
}

export async function getPayloadCollections() {
  const payload = await getPayloadClient();

  if (!payload) {
    return null;
  }

  let categories;
  let items;
  let plans;
  let testimonials;
  let faqs;

  try {
    [categories, items, plans, testimonials, faqs] = await Promise.all([
      payload.find({
        collection: "portfolio-categories",
        depth: 1,
        limit: 100,
        sort: "displayOrder",
      }),
      payload.find({
        collection: "portfolio-items",
        depth: 2,
        limit: 100,
        sort: "displayOrder",
      }),
      payload.find({
        collection: "pricing-plans",
        depth: 1,
        limit: 100,
        sort: "displayOrder",
      }),
      payload.find({
        collection: "testimonials",
        depth: 1,
        limit: 100,
        sort: "displayOrder",
      }),
      payload.find({
        collection: "faqs",
        depth: 1,
        limit: 100,
        sort: "displayOrder",
      }),
    ]);
  } catch {
    return null;
  }

  const publishedCategories = (categories.docs as AnyDoc[]).filter(isPublished);
  const publishedItems = (items.docs as AnyDoc[]).filter(isPublished);
  const publishedPlans = (plans.docs as AnyDoc[]).filter(isPublished);
  const publishedTestimonials = (testimonials.docs as AnyDoc[]).filter(isPublished);
  const publishedFaqs = (faqs.docs as AnyDoc[]).filter(isPublished);

  const categoryCounts = new Map<string, number>();

  for (const item of publishedItems) {
    const slug = relationSlug(item.category);
    categoryCounts.set(slug, (categoryCounts.get(slug) || 0) + 1);
  }

  return {
    categories: publishedCategories.map((category): CategoryDto => ({
      id: category.slug,
      database_id: String(category.id),
      name: category.name,
      slug: category.slug,
      label: category.name,
      description: category.description || null,
      display_order: category.displayOrder || 0,
      visibility: "public",
      count: categoryCounts.get(category.slug) || 0,
    })),
    portfolioItems: publishedItems.map((item): PortfolioItem => ({
      id: String(item.id),
      title: item.title,
      slug: item.slug,
      category: relationSlug(item.category),
      category_id: relationId(item.category),
      categoryName: relationName(item.category),
      image: getMediaUrl(item.image, item.externalImageUrl) || "/placeholder-1.jpg",
      thumbnail_url: getMediaUrl(item.image, item.externalImageUrl),
      thumbnail_width: null,
      thumbnail_height: null,
      gallery_images: [],
      tags: arrayField(item.tags).map((tag) => (tag as AnyDoc).tag).filter(Boolean),
      featured: Boolean(item.featured),
      popularity_score: item.popularityScore || 0,
      visibility: "public",
      date: item.createdAt || new Date().toISOString(),
      description: item.shortDescription || item.fullDescription || "",
      short_description: item.shortDescription || null,
      full_description: item.fullDescription || null,
      client_name: item.clientName || null,
      client_permission: Boolean(item.clientPermission),
      external_link: item.externalLink || null,
      discord_order_link: item.orderLink || null,
      created_at: item.createdAt,
      updated_at: item.updatedAt,
    })),
    pricingPlans: publishedPlans.map((plan): ServiceDto => ({
      id: plan.slug,
      database_id: String(plan.id),
      title: plan.name,
      slug: plan.slug,
      name: plan.name,
      description: plan.description,
      short_description: plan.description,
      full_description: plan.fullDescription || null,
      price: Number(plan.price || 0),
      starting_price: Number(plan.price || 0),
      currency: "USD",
      delivery_time: plan.deliveryTime || null,
      revisions: plan.revisions || null,
      features: arrayField(plan.features).map((feature) => (feature as AnyDoc).feature).filter(Boolean),
      feature_list: arrayField(plan.features).map((feature) => (feature as AnyDoc).feature).filter(Boolean),
      highlighted: Boolean(plan.highlighted),
      featured: Boolean(plan.highlighted),
      orderUrl: plan.orderUrl || null,
      discord_order_link: plan.orderUrl || null,
      active: true,
      display_order: plan.displayOrder || 0,
    })),
    testimonials: publishedTestimonials.map((testimonial): TestimonialDto => ({
      id: String(testimonial.id),
      author: testimonial.clientName,
      client_name: testimonial.clientName,
      role: testimonial.clientRole || "",
      client_role: testimonial.clientRole || null,
      content: testimonial.quote,
      quote: testimonial.quote,
      rating: testimonial.rating || 5,
      approved: true,
      featured: Boolean(testimonial.featured),
      display_order: testimonial.displayOrder || 0,
    })),
    faqs: publishedFaqs.map((faq) => ({
      id: String(faq.id),
      question: faq.question,
      answer: faq.answer,
    })),
  };
}

export function getPayloadSiteSettings(globals: PayloadGlobals): SiteSettingsDto {
  const branding = globals.branding as AnyDoc;
  const owner = globals.ownerProfile as AnyDoc;
  const defaultSeo = globals.defaultSeo as AnyDoc;

  return {
    id: "payload-site-settings",
    site_name: text(branding.siteName, "Cosmic Flare"),
    hero_title: globals.homepage.hero.heading || null,
    hero_subtitle: globals.homepage.hero.description || null,
    about_text: owner.biography || null,
    discord_url: null,
    owner_name: owner.name || null,
    owner_role: owner.role || null,
    owner_avatar_url: getMediaUrl(owner.avatar, owner.avatarUrl),
    owner_email: null,
    owner_discord: null,
    owner_discord_server_url: null,
    owner_instagram_url: null,
    owner_x_url: null,
    owner_youtube_url: null,
    owner_fiverr_url: null,
    owner_behance_url: null,
    owner_website_url: null,
    owner_github_url: null,
    owner_modrinth_url: null,
    owner_location: owner.location || null,
    owner_bio: owner.biography || null,
    socials: {
      ownerSocialLinks: getPayloadOwnerSocialLinks(globals),
    },
    footer_text: globals.footer.copyrightText || null,
    seo_title: defaultSeo.title || branding.browserTitle || null,
    seo_description: defaultSeo.description || branding.siteDescription || null,
    logo_url: getMediaUrl(branding.logo, branding.logoUrl),
    favicon_url: getMediaUrl(branding.favicon, branding.faviconUrl),
    updated_at: new Date().toISOString(),
  };
}

export function getPayloadOwnerSocialLinks(globals: PayloadGlobals) {
  return arrayField((globals.ownerProfile as AnyDoc).socialProfiles as AnyDoc[] | null | undefined)
    .filter((link) => link?.kind && link?.href)
    .map((link) => ({
      kind: link.kind,
      label: link.label || link.kind,
      href: link.href,
      value: link.value || link.href,
      external: link.external !== false,
    }));
}

export function hasPayloadContent(collections: Awaited<ReturnType<typeof getPayloadCollections>>) {
  if (!collections) {
    return false;
  }

  return Boolean(
    collections.categories.length ||
      collections.portfolioItems.length ||
      collections.pricingPlans.length ||
      collections.testimonials.length ||
      collections.faqs.length
  );
}

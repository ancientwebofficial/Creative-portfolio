import type { SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_MEDIA_BUCKET } from "@/lib/supabase/config";
import type { Database, Inserts, Tables, Updates } from "./database.types";
import {
  mapCategory,
  mapHomepageBlock,
  mapMedia,
  mapPortfolioItem,
  mapService,
  mapSiteSettings,
  mapTestimonial,
} from "./mappers";
import type { PortfolioItemDto } from "./mappers";

export type CmsClient = SupabaseClient<Database>;
export type PortfolioSort = "popular" | "newest" | "oldest" | "featured" | "recent";

export interface PaginationQuery {
  limit?: number;
  offset?: number;
  search?: string;
}

export interface PortfolioListQuery extends PaginationQuery {
  category?: string;
  sort?: PortfolioSort;
  includePrivate?: boolean;
}

function stripUndefined<T extends Record<string, unknown>>(input: T) {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined)
  ) as Partial<T>;
}

function searchPattern(value: string) {
  return `%${value.replace(/[%_]/g, "\\$&")}%`;
}

function rangeFrom(limit = 24, offset = 0) {
  return { from: offset, to: offset + limit - 1 };
}

type PortfolioRowWithCategory = Tables<"portfolio_items"> & {
  categories?: Pick<Tables<"categories">, "id" | "name" | "slug" | "description"> | null;
};

async function getMediaDimensionsByUrl(
  supabase: CmsClient,
  urls: Array<string | null | undefined>
) {
  const uniqueUrls = Array.from(new Set(urls.filter(Boolean))) as string[];

  if (uniqueUrls.length === 0) {
    return new Map<string, { width: number | null; height: number | null }>();
  }

  const { data, error } = await supabase
    .from("media_library")
    .select("file_url,width,height")
    .in("file_url", uniqueUrls);

  if (error) {
    throwSupabaseMutationError(error, {
      table: "media_library",
      operation: "select-dimensions",
    });
  }

  return new Map(
    (data || []).map((media) => [
      media.file_url,
      { width: media.width, height: media.height },
    ])
  );
}

async function mapPortfolioRowsWithDimensions(
  supabase: CmsClient,
  rows: PortfolioRowWithCategory[]
) {
  const dimensionsByUrl = await getMediaDimensionsByUrl(
    supabase,
    rows.map((row) => row.thumbnail_url)
  );

  return rows.map((row) =>
    mapPortfolioItem(
      row,
      row.thumbnail_url ? dimensionsByUrl.get(row.thumbnail_url) : null
    )
  );
}

async function mapPortfolioRowWithDimensions(
  supabase: CmsClient,
  row: PortfolioRowWithCategory
) {
  const [item] = await mapPortfolioRowsWithDimensions(supabase, [row]);
  return item;
}

interface SupabaseErrorContext {
  table: string;
  operation: string;
}

function errorField(error: Record<string, unknown>, field: string) {
  const value = error[field];
  return typeof value === "string" ? value : undefined;
}

function isMissingColumnError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as { code?: unknown }).code === "42703"
  );
}

function mergeBrandingIntoSocials(input: Updates<"site_settings">) {
  const branding: Record<string, string> = {};

  if (typeof input.logo_url === "string" && input.logo_url) {
    branding.logo_url = input.logo_url;
  }

  if (typeof input.favicon_url === "string" && input.favicon_url) {
    branding.favicon_url = input.favicon_url;
  }

  if (Object.keys(branding).length === 0) {
    return input;
  }

  const socials =
    input.socials && typeof input.socials === "object" && !Array.isArray(input.socials)
      ? input.socials
      : {};

  return {
    ...input,
    socials: {
      ...socials,
      ...branding,
    },
  };
}

function stripLegacySiteSettingsFields(input: Updates<"site_settings">) {
  const legacy = { ...input };

  delete legacy.owner_name;
  delete legacy.owner_avatar_url;
  delete legacy.owner_email;
  delete legacy.owner_discord;
  delete legacy.owner_discord_server_url;
  delete legacy.owner_instagram_url;
  delete legacy.owner_x_url;
  delete legacy.owner_youtube_url;
  delete legacy.owner_fiverr_url;
  delete legacy.owner_behance_url;
  delete legacy.owner_website_url;
  delete legacy.owner_github_url;
  delete legacy.owner_modrinth_url;
  delete legacy.owner_location;
  delete legacy.owner_bio;

  return legacy;
}

export function throwSupabaseMutationError(
  error: unknown,
  context: SupabaseErrorContext
): never {
  const enriched =
    typeof error === "object" && error !== null
      ? Object.assign(error as Record<string, unknown>, context)
      : { message: String(error), ...context };

  console.error("CMS_SUPABASE_MUTATION_ERROR", {
    table: context.table,
    operation: context.operation,
    code: errorField(enriched, "code"),
    message: errorField(enriched, "message"),
    details: enriched.details,
    hint: enriched.hint,
    raw: enriched,
  });

  throw enriched;
}

export async function listCategories(
  supabase: CmsClient,
  options: { includePrivate?: boolean } = {}
) {
  let query = supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (!options.includePrivate) {
    query = query.eq("visibility", "public");
  }

  const { data, error } = await query;

  if (error) {
    throwSupabaseMutationError(error, {
      table: "categories",
      operation: "select",
    });
  }

  const categoryRows = data || [];
  const { data: portfolioRows } = await supabase
    .from("portfolio_items")
    .select("category_id")
    .eq("visibility", "public");

  const counts = new Map<string, number>();
  for (const row of portfolioRows || []) {
    if (row.category_id) {
      counts.set(row.category_id, (counts.get(row.category_id) || 0) + 1);
    }
  }

  return categoryRows.map((category) => mapCategory(category, counts.get(category.id) || 0));
}

export async function createCategory(
  supabase: CmsClient,
  input: Inserts<"categories">
) {
  const { data, error } = await supabase
    .from("categories")
    .insert(input)
    .select("*")
    .single();

  if (error) {
    throwSupabaseMutationError(error, {
      table: "categories",
      operation: "insert",
    });
  }

  return mapCategory(data);
}

export async function updateCategory(
  supabase: CmsClient,
  id: string,
  input: Updates<"categories">
) {
  const { data, error } = await supabase
    .from("categories")
    .update(stripUndefined(input))
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throwSupabaseMutationError(error, {
      table: "categories",
      operation: "update",
    });
  }

  return mapCategory(data);
}

export async function deleteCategory(supabase: CmsClient, id: string) {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) {
    throwSupabaseMutationError(error, {
      table: "categories",
      operation: "delete",
    });
  }
}

export async function listPortfolioItems(
  supabase: CmsClient,
  options: PortfolioListQuery = {}
) {
  const { from, to } = rangeFrom(options.limit, options.offset);
  const select =
    "*, categories(id, name, slug, description, display_order, visibility)";

  let query = supabase
    .from("portfolio_items")
    .select(select, { count: "exact" })
    .range(from, to);

  if (!options.includePrivate) {
    query = query.eq("visibility", "public");
  }

  if (options.category) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", options.category)
      .maybeSingle();

    if (!category) {
      return { items: [] as PortfolioItemDto[], count: 0, limit: options.limit || 24, offset: options.offset || 0 };
    }

    query = query.eq("category_id", category.id);
  }

  if (options.search) {
    const pattern = searchPattern(options.search);
    query = query.or(
      `title.ilike.${pattern},short_description.ilike.${pattern},full_description.ilike.${pattern}`
    );
  }

  switch (options.sort) {
    case "popular":
      query = query.order("popularity_score", { ascending: false });
      break;
    case "oldest":
      query = query.order("created_at", { ascending: true });
      break;
    case "featured":
      query = query.order("featured", { ascending: false }).order("created_at", {
        ascending: false,
      });
      break;
    case "recent":
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  const { data, error, count } = await query;

  if (error) {
    throwSupabaseMutationError(error, {
      table: "portfolio_items",
      operation: "select",
    });
  }

  return {
    items: await mapPortfolioRowsWithDimensions(
      supabase,
      (data || []) as PortfolioRowWithCategory[]
    ),
    count: count || 0,
    limit: options.limit || 24,
    offset: options.offset || 0,
  };
}

export async function getPortfolioItemBySlug(
  supabase: CmsClient,
  slug: string,
  includePrivate = false
) {
  let query = supabase
    .from("portfolio_items")
    .select("*, categories(id, name, slug, description)")
    .eq("slug", slug);

  if (!includePrivate) {
    query = query.eq("visibility", "public");
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    throwSupabaseMutationError(error, {
      table: "portfolio_items",
      operation: "select",
    });
  }

  return data
    ? mapPortfolioRowWithDimensions(supabase, data as PortfolioRowWithCategory)
    : null;
}

export async function createPortfolioItem(
  supabase: CmsClient,
  input: Inserts<"portfolio_items">
) {
  console.log("[REPO] createPortfolioItem - Input:", JSON.stringify(input).substring(0, 300));
  
  const { data, error } = await supabase
    .from("portfolio_items")
    .insert(input)
    .select("*, categories(id, name, slug, description)")
    .single();

  console.log("[REPO] createPortfolioItem - Supabase response - error:", error ? JSON.stringify(error).substring(0, 500) : "null");
  console.log("[REPO] createPortfolioItem - Supabase response - data:", data ? JSON.stringify(data).substring(0, 300) : "null");

  if (error) {
    console.error("[REPO] createPortfolioItem - Error detected, throwing:", error);
    throwSupabaseMutationError(error, {
      table: "portfolio_items",
      operation: "insert",
    });
  }

  const result = await mapPortfolioRowWithDimensions(
    supabase,
    data as PortfolioRowWithCategory
  );
  console.log("[REPO] createPortfolioItem - Mapped result:", JSON.stringify(result).substring(0, 300));
  return result;
}

export async function updatePortfolioItem(
  supabase: CmsClient,
  id: string,
  input: Updates<"portfolio_items">
) {
  const { data, error } = await supabase
    .from("portfolio_items")
    .update(stripUndefined(input))
    .eq("id", id)
    .select("*, categories(id, name, slug, description)")
    .single();

  if (error) {
    throwSupabaseMutationError(error, {
      table: "portfolio_items",
      operation: "update",
    });
  }

  return mapPortfolioRowWithDimensions(supabase, data as PortfolioRowWithCategory);
}

export async function deletePortfolioItem(supabase: CmsClient, id: string) {
  const { error } = await supabase.from("portfolio_items").delete().eq("id", id);
  if (error) {
    throwSupabaseMutationError(error, {
      table: "portfolio_items",
      operation: "delete",
    });
  }
}

export async function listServices(
  supabase: CmsClient,
  options: { includeInactive?: boolean } = {}
) {
  let query = supabase
    .from("services")
    .select("*")
    .order("display_order", { ascending: true })
    .order("starting_price", { ascending: true });

  if (!options.includeInactive) {
    query = query.eq("active", true);
  }

  const { data, error } = await query;

  if (error) {
    throwSupabaseMutationError(error, {
      table: "services",
      operation: "select",
    });
  }

  return (data || []).map(mapService);
}

export async function createService(supabase: CmsClient, input: Inserts<"services">) {
  const { data, error } = await supabase
    .from("services")
    .insert(input)
    .select("*")
    .single();

  if (error) {
    throwSupabaseMutationError(error, {
      table: "services",
      operation: "insert",
    });
  }

  return mapService(data);
}

export async function updateService(
  supabase: CmsClient,
  id: string,
  input: Updates<"services">
) {
  const { data, error } = await supabase
    .from("services")
    .update(stripUndefined(input))
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throwSupabaseMutationError(error, {
      table: "services",
      operation: "update",
    });
  }

  return mapService(data);
}

export async function deleteService(supabase: CmsClient, id: string) {
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) {
    throwSupabaseMutationError(error, {
      table: "services",
      operation: "delete",
    });
  }
}

export async function listTestimonials(
  supabase: CmsClient,
  options: { includeUnapproved?: boolean; featuredOnly?: boolean } = {}
) {
  let query = supabase
    .from("testimonials")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (!options.includeUnapproved) {
    query = query.eq("approved", true);
  }

  if (options.featuredOnly) {
    query = query.eq("featured", true);
  }

  const { data, error } = await query;

  if (error) {
    throwSupabaseMutationError(error, {
      table: "testimonials",
      operation: "select",
    });
  }

  return (data || []).map(mapTestimonial);
}

export async function createTestimonial(
  supabase: CmsClient,
  input: Inserts<"testimonials">
) {
  const { data, error } = await supabase
    .from("testimonials")
    .insert(input)
    .select("*")
    .single();

  if (error) {
    throwSupabaseMutationError(error, {
      table: "testimonials",
      operation: "insert",
    });
  }

  return mapTestimonial(data);
}

export async function updateTestimonial(
  supabase: CmsClient,
  id: string,
  input: Updates<"testimonials">
) {
  const { data, error } = await supabase
    .from("testimonials")
    .update(stripUndefined(input))
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throwSupabaseMutationError(error, {
      table: "testimonials",
      operation: "update",
    });
  }

  return mapTestimonial(data);
}

export async function deleteTestimonial(supabase: CmsClient, id: string) {
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) {
    throwSupabaseMutationError(error, {
      table: "testimonials",
      operation: "delete",
    });
  }
}

export async function listHomepageBlocks(
  supabase: CmsClient,
  options: { includePrivate?: boolean } = {}
) {
  let query = supabase
    .from("homepage_blocks")
    .select("*")
    .order("display_order", { ascending: true });

  if (!options.includePrivate) {
    query = query.eq("visibility", "public");
  }

  const { data, error } = await query;

  if (error) {
    throwSupabaseMutationError(error, {
      table: "homepage_blocks",
      operation: "select",
    });
  }

  return (data || []).map(mapHomepageBlock);
}

export async function createHomepageBlock(
  supabase: CmsClient,
  input: Inserts<"homepage_blocks">
) {
  const { data, error } = await supabase
    .from("homepage_blocks")
    .insert(input)
    .select("*")
    .single();

  if (error) {
    throwSupabaseMutationError(error, {
      table: "homepage_blocks",
      operation: "insert",
    });
  }

  return mapHomepageBlock(data);
}

export async function updateHomepageBlock(
  supabase: CmsClient,
  id: string,
  input: Updates<"homepage_blocks">
) {
  const { data, error } = await supabase
    .from("homepage_blocks")
    .update(stripUndefined(input))
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throwSupabaseMutationError(error, {
      table: "homepage_blocks",
      operation: "update",
    });
  }

  return mapHomepageBlock(data);
}

export async function deleteHomepageBlock(supabase: CmsClient, id: string) {
  const { error } = await supabase.from("homepage_blocks").delete().eq("id", id);
  if (error) {
    throwSupabaseMutationError(error, {
      table: "homepage_blocks",
      operation: "delete",
    });
  }
}

export async function getSiteSettings(supabase: CmsClient) {
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("singleton", true)
    .maybeSingle();

  if (error) {
    throwSupabaseMutationError(error, {
      table: "site_settings",
      operation: "select",
    });
  }

  return data ? mapSiteSettings(data) : null;
}

export async function updateSiteSettings(
  supabase: CmsClient,
  input: Updates<"site_settings">
) {
  const payload = mergeBrandingIntoSocials(stripUndefined(input));
  const { data, error } = await supabase
    .from("site_settings")
    .upsert({ ...payload, singleton: true }, { onConflict: "singleton" })
    .select("*")
    .single();

  if (error) {
    if (isMissingColumnError(error)) {
      const legacyPayload = stripLegacySiteSettingsFields({
        ...payload,
        logo_url: undefined,
        favicon_url: undefined,
      });
      delete legacyPayload.logo_url;
      delete legacyPayload.favicon_url;

      const { data: legacyData, error: legacyError } = await supabase
        .from("site_settings")
        .upsert(
          { ...legacyPayload, singleton: true },
          { onConflict: "singleton" }
        )
        .select("*")
        .single();

      if (!legacyError) {
        return mapSiteSettings(legacyData);
      }

      throwSupabaseMutationError(legacyError, {
        table: "site_settings",
        operation: "upsert",
      });
    }

    throwSupabaseMutationError(error, {
      table: "site_settings",
      operation: "upsert",
    });
  }

  return mapSiteSettings(data);
}

export async function getHomepageContent(supabase: CmsClient) {
  const [settings, blocks, portfolio, services, testimonials, categories] =
    await Promise.all([
      getSiteSettings(supabase),
      listHomepageBlocks(supabase),
      listPortfolioItems(supabase, { sort: "featured", limit: 8 }),
      listServices(supabase),
      listTestimonials(supabase, { featuredOnly: false }),
      listCategories(supabase),
    ]);

  return {
    settings,
    blocks,
    featuredProjects: portfolio.items,
    services,
    testimonials,
    categories,
  };
}

export async function listMedia(supabase: CmsClient, options: PaginationQuery = {}) {
  const { from, to } = rangeFrom(options.limit, options.offset);
  let query = supabase
    .from("media_library")
    .select("*", { count: "exact" })
    .range(from, to)
    .order("created_at", { ascending: false });

  if (options.search) {
    const pattern = searchPattern(options.search);
    query = query.or(`file_name.ilike.${pattern},alt_text.ilike.${pattern}`);
  }

  const { data, error, count } = await query;

  if (error) {
    throwSupabaseMutationError(error, {
      table: "media_library",
      operation: "select",
    });
  }

  return {
    items: (data || []).map(mapMedia),
    count: count || 0,
    limit: options.limit || 24,
    offset: options.offset || 0,
  };
}

export async function createMediaRecord(
  supabase: CmsClient,
  input: Inserts<"media_library">
) {
  const { data, error } = await supabase
    .from("media_library")
    .insert(input)
    .select("*")
    .single();

  if (error) {
    throwSupabaseMutationError(error, {
      table: "media_library",
      operation: "insert",
    });
  }

  return mapMedia(data);
}

export async function updateMediaRecord(
  supabase: CmsClient,
  id: string,
  input: Updates<"media_library">
) {
  const { data, error } = await supabase
    .from("media_library")
    .update(stripUndefined(input))
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throwSupabaseMutationError(error, {
      table: "media_library",
      operation: "update",
    });
  }

  return mapMedia(data);
}

export async function deleteMediaRecord(supabase: CmsClient, id: string) {
  const { data, error: fetchError } = await supabase
    .from("media_library")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError) {
    throwSupabaseMutationError(fetchError, {
      table: "media_library",
      operation: "select-before-delete",
    });
  }

  const { error: storageError } = await supabase.storage
    .from(SUPABASE_MEDIA_BUCKET)
    .remove([data.storage_path]);

  if (storageError) {
    throwSupabaseMutationError(storageError, {
      table: "storage.objects",
      operation: "delete",
    });
  }

  const { error } = await supabase.from("media_library").delete().eq("id", id);

  if (error) {
    throwSupabaseMutationError(error, {
      table: "media_library",
      operation: "delete",
    });
  }

  return mapMedia(data);
}

export function asPortfolioDatabaseRow(input: Record<string, unknown>) {
  return stripUndefined(input) as Updates<"portfolio_items">;
}

export type CategoryRow = Tables<"categories">;

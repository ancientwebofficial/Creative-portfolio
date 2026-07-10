import type { Json, Tables } from "./database.types";

type CategoryRow = Tables<"categories">;
type PortfolioRow = Tables<"portfolio_items"> & {
  categories?: Pick<CategoryRow, "id" | "name" | "slug" | "description"> | null;
};

interface MediaDimensions {
  width: number | null;
  height: number | null;
}

function stringFromJsonObject(json: Json, key: string) {
  if (!json || typeof json !== "object" || Array.isArray(json)) {
    return null;
  }

  const value = json[key];
  return typeof value === "string" ? value : null;
}

export interface PortfolioItemDto {
  id: string;
  title: string;
  slug: string;
  category: string;
  category_id: string | null;
  categoryName: string | null;
  image: string;
  thumbnail_url: string | null;
  thumbnail_width: number | null;
  thumbnail_height: number | null;
  gallery_images: string[];
  tags: string[];
  featured: boolean;
  popularity_score: number;
  visibility: string;
  date: string;
  description: string;
  short_description: string | null;
  full_description: string | null;
  client_name: string | null;
  client_permission: boolean;
  external_link: string | null;
  discord_order_link: string | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryDto {
  id: string;
  database_id: string;
  name: string;
  slug: string;
  label: string;
  description: string | null;
  display_order: number;
  visibility: string;
  count?: number;
}

export interface ServiceDto {
  id: string;
  database_id: string;
  title: string;
  slug: string;
  name: string;
  description: string;
  short_description: string | null;
  full_description: string | null;
  price: number;
  starting_price: number;
  currency: "USD";
  delivery_time: string | null;
  revisions: string | null;
  features: string[];
  feature_list: string[];
  highlighted: boolean;
  featured: boolean;
  orderUrl: string | null;
  discord_order_link: string | null;
  active: boolean;
  display_order: number;
}

export interface TestimonialDto {
  id: string;
  author: string;
  client_name: string;
  role: string;
  client_role: string | null;
  content: string;
  quote: string;
  rating: number;
  approved: boolean;
  featured: boolean;
  display_order: number;
}

export interface HomepageBlockDto {
  id: string;
  block_type: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  image_url: string | null;
  linked_portfolio_ids: string[];
  alignment: string;
  style_variant: string;
  visibility: string;
  display_order: number;
}

export interface SiteSettingsDto {
  id: string;
  site_name: string;
  hero_title: string | null;
  hero_subtitle: string | null;
  about_text: string | null;
  discord_url: string | null;
  owner_name: string | null;
  owner_role: string | null;
  owner_avatar_url: string | null;
  owner_email: string | null;
  owner_discord: string | null;
  owner_discord_server_url: string | null;
  owner_instagram_url: string | null;
  owner_x_url: string | null;
  owner_youtube_url: string | null;
  owner_fiverr_url: string | null;
  owner_behance_url: string | null;
  owner_website_url: string | null;
  owner_github_url: string | null;
  owner_modrinth_url: string | null;
  owner_location: string | null;
  owner_bio: string | null;
  socials: Json;
  footer_text: string | null;
  seo_title: string | null;
  seo_description: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  updated_at: string;
}

export interface MediaDto {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  alt_text: string | null;
  uploaded_by: string | null;
  storage_path: string;
  file_size: number | null;
  width: number | null;
  height: number | null;
  metadata: Json;
  created_at: string;
}

export function mapCategory(row: CategoryRow, count?: number): CategoryDto {
  return {
    id: row.slug,
    database_id: row.id,
    name: row.name,
    slug: row.slug,
    label: row.name,
    description: row.description,
    display_order: row.display_order,
    visibility: row.visibility,
    count,
  };
}

export function mapPortfolioItem(
  row: PortfolioRow,
  thumbnailDimensions?: MediaDimensions | null
): PortfolioItemDto {
  const categorySlug = row.categories?.slug || row.category_id || "uncategorized";
  const description = row.short_description || row.full_description || "";

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: categorySlug,
    category_id: row.category_id,
    categoryName: row.categories?.name || null,
    image: row.thumbnail_url || "/placeholder-1.jpg",
    thumbnail_url: row.thumbnail_url,
    thumbnail_width: thumbnailDimensions?.width || null,
    thumbnail_height: thumbnailDimensions?.height || null,
    gallery_images: row.gallery_images,
    tags: row.tags,
    featured: row.featured,
    popularity_score: row.popularity_score,
    visibility: row.visibility,
    date: row.created_at,
    description,
    short_description: row.short_description,
    full_description: row.full_description,
    client_name: row.client_name,
    client_permission: row.client_permission,
    external_link: row.external_link,
    discord_order_link: row.discord_order_link,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function mapService(row: Tables<"services">): ServiceDto {
  return {
    id: row.slug,
    database_id: row.id,
    title: row.title,
    slug: row.slug,
    name: row.title,
    description: row.short_description || row.full_description || "",
    short_description: row.short_description,
    full_description: row.full_description,
    price: Number(row.starting_price),
    starting_price: Number(row.starting_price),
    currency: "USD",
    delivery_time: row.delivery_time,
    revisions: row.revisions,
    features: row.feature_list,
    feature_list: row.feature_list,
    highlighted: row.featured,
    featured: row.featured,
    orderUrl: row.discord_order_link,
    discord_order_link: row.discord_order_link,
    active: row.active,
    display_order: row.display_order,
  };
}

export function mapTestimonial(row: Tables<"testimonials">): TestimonialDto {
  return {
    id: row.id,
    author: row.client_name,
    client_name: row.client_name,
    role: row.client_role || "",
    client_role: row.client_role,
    content: row.quote,
    quote: row.quote,
    rating: row.rating,
    approved: row.approved,
    featured: row.featured,
    display_order: row.display_order,
  };
}

export function mapHomepageBlock(row: Tables<"homepage_blocks">): HomepageBlockDto {
  return {
    id: row.id,
    block_type: row.block_type,
    title: row.title,
    subtitle: row.subtitle,
    content: row.content,
    image_url: row.image_url,
    linked_portfolio_ids: row.linked_portfolio_ids,
    alignment: row.alignment,
    style_variant: row.style_variant,
    visibility: row.visibility,
    display_order: row.display_order,
  };
}

export function mapSiteSettings(row: Tables<"site_settings">): SiteSettingsDto {
  return {
    id: row.id,
    site_name: row.site_name,
    hero_title: row.hero_title,
    hero_subtitle: row.hero_subtitle,
    about_text: row.about_text,
    discord_url: row.discord_url,
    owner_name: row.owner_name,
    owner_role: null,
    owner_avatar_url: row.owner_avatar_url,
    owner_email: row.owner_email,
    owner_discord: row.owner_discord,
    owner_discord_server_url: row.owner_discord_server_url,
    owner_instagram_url: row.owner_instagram_url,
    owner_x_url: row.owner_x_url,
    owner_youtube_url: row.owner_youtube_url,
    owner_fiverr_url: row.owner_fiverr_url,
    owner_behance_url: row.owner_behance_url,
    owner_website_url: row.owner_website_url,
    owner_github_url: row.owner_github_url,
    owner_modrinth_url: row.owner_modrinth_url,
    owner_location: row.owner_location,
    owner_bio: row.owner_bio,
    socials: row.socials,
    footer_text: row.footer_text,
    seo_title: row.seo_title,
    seo_description: row.seo_description,
    logo_url: row.logo_url || stringFromJsonObject(row.socials, "logo_url"),
    favicon_url:
      row.favicon_url || stringFromJsonObject(row.socials, "favicon_url"),
    updated_at: row.updated_at,
  };
}

export function mapMedia(row: Tables<"media_library">): MediaDto {
  return {
    id: row.id,
    file_name: row.file_name,
    file_url: row.file_url,
    file_type: row.file_type,
    alt_text: row.alt_text,
    uploaded_by: row.uploaded_by,
    storage_path: row.storage_path,
    file_size: row.file_size,
    width: row.width,
    height: row.height,
    metadata: row.metadata,
    created_at: row.created_at,
  };
}
